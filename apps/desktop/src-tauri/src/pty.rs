use anyhow::{anyhow, Result};
use bytes::Bytes;
use std::process::Stdio;
use std::sync::Arc;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::process::Command;
use tokio::sync::{mpsc, RwLock};
use tokio_pty_process::{CommandExt, PtyMaster};
use tracing::{debug, error, info};

pub struct PtySession {
    pub id: String,
    pub master: Arc<RwLock<PtyMaster>>,
    pub child_pid: u32,
    pub tx: mpsc::Sender<PtyMessage>,
    pub rx: Arc<RwLock<mpsc::Receiver<PtyMessage>>>,
}

#[derive(Debug, Clone)]
pub enum PtyMessage {
    Data(Bytes),
    Resize(u16, u16),
    Exit(i32),
}

impl PtySession {
    pub async fn new(id: String, shell: Option<String>, cwd: Option<String>) -> Result<Self> {
        let shell = shell.unwrap_or_else(|| {
            std::env::var("SHELL").unwrap_or_else(|_| "/bin/bash".to_string())
        });
        
        let mut cmd = Command::new(&shell);
        cmd.env("TERM", "xterm-256color");
        cmd.env("COLORTERM", "truecolor");
        
        if let Some(cwd) = cwd {
            cmd.current_dir(cwd);
        }
        
        // Create PTY
        let pty = cmd.spawn_pty()?;
        let pid = pty.id();
        let master = Arc::new(RwLock::new(pty));
        
        // Create channels
        let (tx, rx) = mpsc::channel(1024);
        let rx = Arc::new(RwLock::new(rx));
        
        info!("Created PTY session {} with PID {}", id, pid);
        
        Ok(Self {
            id,
            master,
            child_pid: pid,
            tx,
            rx,
        })
    }
    
    pub async fn write(&self, data: &[u8]) -> Result<()> {
        let mut master = self.master.write().await;
        master.write_all(data).await?;
        master.flush().await?;
        Ok(())
    }
    
    pub async fn resize(&self, cols: u16, rows: u16) -> Result<()> {
        let master = self.master.read().await;
        // Note: resize method would need to be implemented on PtyMaster
        // For now, we'll send a resize message
        self.tx.send(PtyMessage::Resize(cols, rows)).await?;
        debug!("Resized PTY {} to {}x{}", self.id, cols, rows);
        Ok(())
    }
    
    pub async fn start_read_loop(self: Arc<Self>) {
        let master = self.master.clone();
        let tx = self.tx.clone();
        let id = self.id.clone();
        
        tokio::spawn(async move {
            let mut buffer = vec![0u8; 4096];
            
            loop {
                let mut master_guard = master.write().await;
                
                match master_guard.read(&mut buffer).await {
                    Ok(0) => {
                        info!("PTY {} closed", id);
                        let _ = tx.send(PtyMessage::Exit(0)).await;
                        break;
                    }
                    Ok(n) => {
                        let data = Bytes::copy_from_slice(&buffer[..n]);
                        if let Err(e) = tx.send(PtyMessage::Data(data)).await {
                            error!("Failed to send PTY data: {}", e);
                            break;
                        }
                    }
                    Err(e) => {
                        error!("PTY read error: {}", e);
                        let _ = tx.send(PtyMessage::Exit(1)).await;
                        break;
                    }
                }
            }
        });
    }
    
    pub async fn kill(&self) -> Result<()> {
        // Try to kill the process gracefully
        unsafe {
            libc::kill(self.child_pid as i32, libc::SIGTERM);
        }
        
        // Wait a bit for graceful shutdown
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        
        // Force kill if still running
        unsafe {
            libc::kill(self.child_pid as i32, libc::SIGKILL);
        }
        
        info!("Killed PTY session {}", self.id);
        Ok(())
    }
}

pub struct PtyManager {
    sessions: Arc<RwLock<dashmap::DashMap<String, Arc<PtySession>>>>,
}

impl PtyManager {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(RwLock::new(dashmap::DashMap::new())),
        }
    }
    
    pub async fn create_session(
        &self,
        id: String,
        shell: Option<String>,
        cwd: Option<String>,
    ) -> Result<Arc<PtySession>> {
        let session = Arc::new(PtySession::new(id.clone(), shell, cwd).await?);
        
        // Start read loop
        session.clone().start_read_loop().await;
        
        // Store session
        let sessions = self.sessions.read().await;
        sessions.insert(id, session.clone());
        
        Ok(session)
    }
    
    pub async fn get_session(&self, id: &str) -> Option<Arc<PtySession>> {
        let sessions = self.sessions.read().await;
        sessions.get(id).map(|s| s.clone())
    }
    
    pub async fn remove_session(&self, id: &str) -> Result<()> {
        let sessions = self.sessions.read().await;
        
        if let Some((_, session)) = sessions.remove(id) {
            session.kill().await?;
        }
        
        Ok(())
    }
    
    pub async fn list_sessions(&self) -> Vec<String> {
        let sessions = self.sessions.read().await;
        sessions.iter().map(|e| e.key().clone()).collect()
    }
    
    pub async fn cleanup(&self) -> Result<()> {
        let sessions = self.sessions.read().await;
        
        for session in sessions.iter() {
            let _ = session.kill().await;
        }
        
        sessions.clear();
        Ok(())
    }
}

// Alternative implementation using portable-pty crate
pub mod portable {
    use super::*;
    use portable_pty::{CommandBuilder, PtySize, PtySystem};
    
    pub struct PortablePtySession {
        pub id: String,
        pub master: Box<dyn portable_pty::MasterPty + Send>,
        pub child: Box<dyn portable_pty::Child + Send + Sync>,
    }
    
    impl PortablePtySession {
        pub fn new(id: String, shell: Option<String>, cwd: Option<String>) -> Result<Self> {
            let pty_system = portable_pty::native_pty_system();
            
            let pty_size = PtySize {
                rows: 24,
                cols: 80,
                pixel_width: 0,
                pixel_height: 0,
            };
            
            let pair = pty_system.openpty(pty_size)?;
            
            let shell = shell.unwrap_or_else(|| {
                std::env::var("SHELL").unwrap_or_else(|_| "/bin/bash".to_string())
            });
            
            let mut cmd = CommandBuilder::new(&shell);
            cmd.env("TERM", "xterm-256color");
            cmd.env("COLORTERM", "truecolor");
            
            if let Some(cwd) = cwd {
                cmd.cwd(cwd);
            }
            
            let child = pair.slave.spawn_command(cmd)?;
            
            Ok(Self {
                id,
                master: pair.master,
                child,
            })
        }
        
        pub fn resize(&mut self, cols: u16, rows: u16) -> Result<()> {
            let size = PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            };
            self.master.resize(size)?;
            Ok(())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_pty_creation() {
        let session = PtySession::new(
            "test".to_string(),
            Some("/bin/sh".to_string()),
            None,
        ).await;
        
        assert!(session.is_ok());
    }
}