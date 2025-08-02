use std::sync::Arc;
use tokio::sync::{Mutex, RwLock};
use std::collections::HashMap;
use tauri::{AppHandle, Emitter};
use reqwest;
use serde::{Deserialize, Serialize};
use anyhow::{Result, anyhow};
use dirs::data_dir;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoiceSessionConfig {
    pub mode: String, // "chain" or "realtime"
    pub stt_provider: String, // "openai" or "whisper-cpp"
    pub tts_provider: String, // "openai" or "piper"
    pub voice_model: String, // "whisper-1" for STT
    pub response_voice: String, // "maple" for TTS
}

#[derive(Debug)]
pub struct VoiceSession {
    pub id: String,
    pub config: VoiceSessionConfig,
    pub is_active: bool,
    pub audio_buffer: Vec<u8>,
}

pub struct VoiceManager {
    sessions: Arc<RwLock<HashMap<String, Arc<Mutex<VoiceSession>>>>>,
    app_handle: AppHandle,
    api_key: Option<String>,
    organization_id: Option<String>,
}

impl VoiceManager {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            sessions: Arc::new(RwLock::new(HashMap::new())),
            app_handle,
            api_key: None,
            organization_id: None,
        }
    }

    pub fn set_api_key(&mut self, api_key: Option<String>) {
        self.api_key = api_key;
    }
    
    pub fn set_organization_id(&mut self, organization_id: Option<String>) {
        self.organization_id = organization_id;
    }

    pub async fn create_session(&self, config: VoiceSessionConfig) -> Result<String> {
        let session_id = format!("voice_{}", chrono::Utc::now().timestamp_millis());
        
        let session = Arc::new(Mutex::new(VoiceSession {
            id: session_id.clone(),
            config,
            is_active: true,
            audio_buffer: Vec::new(),
        }));

        self.sessions.write().await.insert(session_id.clone(), session.clone());
        
        // Emit session started event
        self.app_handle.emit("voice-session-started", &session_id)?;
        
        Ok(session_id)
    }

    pub async fn stop_session(&self, session_id: &str) -> Result<()> {
        let mut sessions = self.sessions.write().await;
        
        if let Some(session) = sessions.get(session_id) {
            let mut session_lock = session.lock().await;
            session_lock.is_active = false;
            
            // Process any remaining audio
            if !session_lock.audio_buffer.is_empty() {
                let config = session_lock.config.clone();
                let audio_data = session_lock.audio_buffer.clone();
                drop(session_lock);
                
                // Transcribe the buffered audio
                if let Ok(transcript) = self.transcribe_audio(&audio_data, &config).await {
                    self.app_handle.emit("voice-transcript", serde_json::json!({
                        "session_id": session_id,
                        "transcript": transcript,
                        "is_final": true
                    }))?;
                }
            }
        }
        
        sessions.remove(session_id);
        
        // Emit session stopped event
        self.app_handle.emit("voice-session-stopped", &session_id)?;
        
        Ok(())
    }

    pub async fn add_audio_chunk(&self, session_id: &str, audio_data: Vec<u8>) -> Result<()> {
        let sessions = self.sessions.read().await;
        
        if let Some(session) = sessions.get(session_id) {
            let mut session_lock = session.lock().await;
            
            if !session_lock.is_active {
                return Err(anyhow!("Session is not active"));
            }
            
            // Add to buffer
            session_lock.audio_buffer.extend_from_slice(&audio_data);
            
            // If buffer is large enough, process it
            if session_lock.audio_buffer.len() >= 16000 * 2 { // ~1 second of 16kHz audio
                let config = session_lock.config.clone();
                let audio_to_process = session_lock.audio_buffer.clone();
                session_lock.audio_buffer.clear();
                
                drop(session_lock);
                
                // Process audio in background
                let app_handle = self.app_handle.clone();
                let session_id_clone = session_id.to_string();
                let api_key = self.api_key.clone();
                let organization_id = self.organization_id.clone();
                
                tokio::spawn(async move {
                    if let Ok(transcript) = Self::transcribe_with_api(&audio_to_process, &config, api_key, organization_id).await {
                        let _ = app_handle.emit("voice-transcript", serde_json::json!({
                            "session_id": session_id_clone,
                            "transcript": transcript,
                            "is_final": false
                        }));
                    }
                });
            }
            
            Ok(())
        } else {
            Err(anyhow!("Session not found"))
        }
    }

    pub async fn transcribe_audio(&self, audio_data: &[u8], config: &VoiceSessionConfig) -> Result<String> {
        Self::transcribe_with_api(audio_data, config, self.api_key.clone(), self.organization_id.clone()).await
    }

    async fn transcribe_with_api(audio_data: &[u8], config: &VoiceSessionConfig, api_key: Option<String>, organization_id: Option<String>) -> Result<String> {
        if config.stt_provider == "openai" {
            let api_key = match api_key {
                Some(key) => key,
                None => crate::config::get_openai_api_key()
                    .ok_or_else(|| anyhow!("OpenAI API key not configured"))?,
            };
            
            // Create form data
            let form = reqwest::multipart::Form::new()
                .text("model", config.voice_model.clone())
                .text("response_format", "json")
                .part("file", reqwest::multipart::Part::bytes(audio_data.to_vec())
                    .file_name("audio.webm")
                    .mime_str("audio/webm")?);
            
            let client = reqwest::Client::new();
            let url = format!("{}{}", crate::config::CONFIG.api.openai_base_url, crate::config::CONFIG.api.openai_stt_endpoint);
            let mut req = client
                .post(&url)
                .header("Authorization", format!("Bearer {}", api_key));
            
            // Add organization ID if present
            if let Some(org_id) = &organization_id {
                req = req.header("OpenAI-Organization", org_id);
            }
            
            let response = req
                .multipart(form)
                .send()
                .await?;
            
            if response.status().is_success() {
                let result: serde_json::Value = response.json().await?;
                if let Some(text) = result["text"].as_str() {
                    Ok(text.to_string())
                } else {
                    Err(anyhow!("Invalid response format from Whisper API"))
                }
            } else {
                let error_text = response.text().await?;
                Err(anyhow!("Whisper API error: {}", error_text))
            }
        } else if config.stt_provider == "whisper-cpp" {
            // Use local whisper.cpp
            let model_path = data_dir()
                .map(|dir| dir.join("models").join("ggml-base.bin"))
                .ok_or_else(|| anyhow!("Failed to get app data directory"))?;
            
            // Download model if not exists
            if !model_path.exists() {
                let models_dir = model_path.parent()
                    .ok_or_else(|| anyhow!("Invalid model path"))?;
                let downloaded_path = crate::whisper::WhisperCpp::download_model("base", &models_dir.to_path_buf()).await?;
                if downloaded_path != model_path {
                    std::fs::rename(downloaded_path, &model_path)?;
                }
            }
            
            let whisper = crate::whisper::WhisperCpp::new(model_path)?;
            let result = whisper.transcribe(audio_data, None).await?;
            Ok(result.text)
        } else {
            Err(anyhow!("Unknown STT provider: {}", config.stt_provider))
        }
    }

    pub async fn speak_text(&self, text: &str, options: &HashMap<String, String>) -> Result<Vec<u8>> {
        let tts_provider = options.get("provider").map(|s| s.as_str()).unwrap_or("openai");
        let voice = options.get("voice").map(|s| s.as_str()).unwrap_or("maple");
        
        if tts_provider == "openai" {
            let api_key = match self.api_key.as_ref() {
                Some(key) => key.clone(),
                None => crate::config::get_openai_api_key()
                    .ok_or_else(|| anyhow!("OpenAI API key not configured"))?,
            };
            
            let client = reqwest::Client::new();
            let url = format!("{}{}", crate::config::CONFIG.api.openai_base_url, crate::config::CONFIG.api.openai_tts_endpoint);
            let mut req = client
                .post(&url)
                .header("Authorization", format!("Bearer {}", api_key));
            
            // Add organization ID if present
            if let Some(org_id) = &self.organization_id {
                req = req.header("OpenAI-Organization", org_id);
            }
            
            let response = req
                .json(&serde_json::json!({
                    "model": "tts-1",
                    "input": text,
                    "voice": voice,
                    "response_format": "mp3"
                }))
                .send()
                .await?;
            
            if response.status().is_success() {
                let audio_data = response.bytes().await?;
                Ok(audio_data.to_vec())
            } else {
                let error_text = response.text().await?;
                Err(anyhow!("OpenAI TTS error: {}", error_text))
            }
        } else if tts_provider == "piper" {
            // Use local Piper TTS
            let voice_name = match voice {
                "maple" | "amy" => "en_US-amy-low",
                "danny" => "en_US-danny-low",
                "alan" => "en_GB-alan-low",
                _ => "en_US-amy-low", // default voice
            };
            
            let models_dir = data_dir()
                .map(|dir| dir.join("LocalBrain").join("models"))
                .ok_or_else(|| anyhow!("Failed to get data directory"))?;
            
            // Download voice if not exists
            let (model_path, config_path) = crate::piper::PiperTts::download_voice(voice_name, &models_dir).await?;
            
            let piper = crate::piper::PiperTts::new(model_path, config_path)?;
            let audio_data = piper.synthesize(text, "mp3").await?;
            Ok(audio_data)
        } else {
            Err(anyhow!("Unknown TTS provider: {}", tts_provider))
        }
    }
}

// Global voice manager instance
use once_cell::sync::Lazy;

static VOICE_MANAGER: Lazy<Arc<Mutex<Option<VoiceManager>>>> = Lazy::new(|| Arc::new(Mutex::new(None)));

pub async fn initialize_voice_manager(app_handle: AppHandle) -> Result<()> {
    let manager = VoiceManager::new(app_handle);
    *VOICE_MANAGER.lock().await = Some(manager);
    Ok(())
}

pub async fn with_voice_manager<F, R>(f: F) -> Result<R>
where
    F: FnOnce(&mut VoiceManager) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<R>> + Send + '_>>,
{
    let mut guard = VOICE_MANAGER.lock().await;
    match guard.as_mut() {
        Some(manager) => f(manager).await,
        None => Err(anyhow!("Voice manager not initialized")),
    }
}