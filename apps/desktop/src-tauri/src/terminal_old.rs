use std::sync::Arc;
use tokio::sync::{Mutex, RwLock};
use std::collections::HashMap;
use tauri::{AppHandle, Emitter};
use anyhow::{Result, anyhow};
use serde::{Deserialize, Serialize};
use portable_pty::{native_pty_system, CommandBuilder, PtySize, Child, MasterPty, PtyPair};
use std::io::{Read, Write};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TerminalSessionData {
    pub id: String,
    pub shell: String,
    pub working_dir: String,
    pub cols: u16,
    pub rows: u16,
}

pub struct TerminalSession {
    pub data: TerminalSessionData,
    child: Box<dyn Child + Send + Sync>,
    reader_thread: Option<std::thread::JoinHandle<()>>,
}

pub struct TerminalManager {
    sessions: Arc<RwLock<HashMap<String, Arc<Mutex<TerminalSession>>>>>,
    // Store master PTYs separately to handle I/O
    masters: Arc<RwLock<HashMap<String, Box<dyn MasterPty + Send>>>>,
    app_handle: AppHandle,
}

impl TerminalManager {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            sessions: Arc::new(RwLock::new(HashMap::new())),
            masters: Arc::new(RwLock::new(HashMap::new())),
            app_handle,
        }
    }

    pub async fn create_session(&self, shell: &str, working_dir: &str) -> Result<String> {
        let session_id = format!("term_{}", chrono::Utc::now().timestamp_millis());
        
        // Create PTY
        let pty_system = native_pty_system();
        let pair = pty_system.openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })?;
        
        // Configure command
        let mut cmd = CommandBuilder::new(shell);
        cmd.cwd(working_dir);
        
        // Spawn the command
        let child = pair.slave.spawn_command(cmd)?;
        
        // Get reader from master
        let reader = pair.master.try_clone_reader()?;
        
        // Store session data
        let session_data = TerminalSessionData {
            id: session_id.clone(),
            shell: shell.to_string(),
            working_dir: working_dir.to_string(),
            cols: 80,
            rows: 24,
        };
        
        // Create reader thread
        let app_handle = self.app_handle.clone();
        let session_id_clone = session_id.clone();
        let reader_thread = std::thread::spawn(move || {
            let mut reader = reader;
            let mut buffer = [0u8; 4096];
            
            loop {
                match reader.read(&mut buffer) {
                    Ok(0) => break, // EOF
                    Ok(n) => {
                        let data = String::from_utf8_lossy(&buffer[..n]).to_string();
                        let _ = app_handle.emit(&format!("terminal-output-{}", session_id_clone), &data);
                    }
                    Err(e) => {
                        eprintln!("Terminal read error: {}", e);
                        break;
                    }
                }
            }
            
            // Notify session closed
            let _ = app_handle.emit("terminal-session-closed", &session_id_clone);
        });
        
        let session = TerminalSession {
            data: session_data,
            child,
            reader_thread: Some(reader_thread),
        };
        
        // Store the session and master separately
        self.sessions.write().await.insert(session_id.clone(), Arc::new(Mutex::new(session)));
        self.masters.write().await.insert(session_id.clone(), pair.master);
        
        // Emit session created event
        self.app_handle.emit("terminal-session-created", &session_id)?;
        
        Ok(session_id)
    }

    pub async fn close_session(&self, session_id: &str) -> Result<()> {
        let mut sessions = self.sessions.write().await;
        let mut masters = self.masters.write().await;
        
        if let Some(session) = sessions.remove(session_id) {
            let mut session_lock = session.lock().await;
            
            // Kill the child process
            let _ = session_lock.child.kill();
            
            // Remove master PTY
            masters.remove(session_id);
            
            self.app_handle.emit("terminal-session-closed", &session_id)?;
            Ok(())
        } else {
            Err(anyhow!("Terminal session not found"))
        }
    }

    pub async fn send_input(&self, session_id: &str, input: &str) -> Result<()> {
        let mut masters = self.masters.write().await;
        
        if let Some(master) = masters.get_mut(session_id) {
            master.write_all(input.as_bytes())?;
            Ok(())
        } else {
            Err(anyhow!("Terminal session not found"))
        }
    }

    pub async fn resize_session(&self, session_id: &str, cols: u16, rows: u16) -> Result<()> {
        let sessions = self.sessions.read().await;
        let masters = self.masters.read().await;
        
        if let Some(session) = sessions.get(session_id) {
            let mut session_lock = session.lock().await;
            session_lock.data.cols = cols;
            session_lock.data.rows = rows;
            
            if let Some(master) = masters.get(session_id) {
                master.resize(PtySize {
                    rows,
                    cols,
                    pixel_width: 0,
                    pixel_height: 0,
                })?;
            }
            
            self.app_handle.emit(&format!("terminal-resized-{}", session_id), 
                serde_json::json!({ "cols": cols, "rows": rows }))?;
            
            Ok(())
        } else {
            Err(anyhow!("Terminal session not found"))
        }
    }

    pub async fn list_sessions(&self) -> Result<Vec<TerminalSessionData>> {
        let sessions = self.sessions.read().await;
        let mut result = Vec::new();
        
        for session in sessions.values() {
            let session_lock = session.lock().await;
            result.push(session_lock.data.clone());
        }
        
        Ok(result)
    }
}

// Global terminal manager instance
use once_cell::sync::Lazy;

static TERMINAL_MANAGER: Lazy<Arc<Mutex<Option<TerminalManager>>>> = Lazy::new(|| Arc::new(Mutex::new(None)));

pub async fn initialize_terminal_manager(app_handle: AppHandle) -> Result<()> {
    let manager = TerminalManager::new(app_handle);
    *TERMINAL_MANAGER.lock().await = Some(manager);
    Ok(())
}

pub async fn with_terminal_manager<F, R>(f: F) -> Result<R>
where
    F: FnOnce(&mut TerminalManager) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<R>> + Send + '_>>,
{
    let mut guard = TERMINAL_MANAGER.lock().await;
    match guard.as_mut() {
        Some(manager) => f(manager).await,
        None => Err(anyhow!("Terminal manager not initialized")),
    }
}