// Voice provider implementation for LocalBrain
// Supports OpenAI Whisper STT, OpenAI TTS with maple voice, and wake word detection

use anyhow::{anyhow, Result};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{mpsc, Mutex, RwLock};
use tokio::time::{sleep, Duration};
use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoiceConfig {
    pub api_key: String,
    pub stt_provider: String, // "openai" or "local"
    pub tts_provider: String, // "openai" or "local"
    pub wake_word: String,
    pub voice_model: String, // "whisper-1" for OpenAI
    pub tts_voice: String, // "maple" for OpenAI TTS
    pub offline_mode: bool,
    pub noise_suppression: bool,
    pub sample_rate: u32,
}

impl Default for VoiceConfig {
    fn default() -> Self {
        Self {
            api_key: String::new(),
            stt_provider: "openai".to_string(),
            tts_provider: "openai".to_string(),
            wake_word: "Hey Brain".to_string(),
            voice_model: "whisper-1".to_string(),
            tts_voice: "maple".to_string(),
            offline_mode: false,
            noise_suppression: true,
            sample_rate: 16000,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoiceSession {
    pub id: String,
    pub status: VoiceSessionStatus,
    pub started_at: DateTime<Utc>,
    pub config: VoiceConfig,
    pub transcript: String,
    pub is_listening: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum VoiceSessionStatus {
    Idle,
    WaitingForWakeWord,
    Listening,
    Processing,
    Speaking,
    Error(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TranscriptionResult {
    pub text: String,
    pub duration: f32,
    pub language: Option<String>,
}

#[derive(Debug)]
pub struct VoiceProvider {
    config: Arc<RwLock<VoiceConfig>>,
    http_client: Client,
    sessions: Arc<Mutex<HashMap<String, VoiceSession>>>,
    active_session: Arc<Mutex<Option<String>>>,
}

impl VoiceProvider {
    pub fn new(config: VoiceConfig) -> Result<Self> {
        let http_client = Client::builder()
            .timeout(Duration::from_secs(30))
            .build()?;
        
        Ok(Self {
            config: Arc::new(RwLock::new(config)),
            http_client,
            sessions: Arc::new(Mutex::new(HashMap::new())),
            active_session: Arc::new(Mutex::new(None)),
        })
    }
    
    pub async fn update_config(&self, config: VoiceConfig) -> Result<()> {
        let mut cfg = self.config.write().await;
        *cfg = config;
        Ok(())
    }
    
    // Start a new voice session
    pub async fn start_session(&self, session_config: Option<VoiceConfig>) -> Result<String> {
        let config = if let Some(cfg) = session_config {
            cfg
        } else {
            self.config.read().await.clone()
        };
        
        let session_id = uuid::Uuid::new_v4().to_string();
        let session = VoiceSession {
            id: session_id.clone(),
            status: VoiceSessionStatus::WaitingForWakeWord,
            started_at: Utc::now(),
            config: config.clone(),
            transcript: String::new(),
            is_listening: true,
        };
        
        let mut sessions = self.sessions.lock().await;
        sessions.insert(session_id.clone(), session);
        
        let mut active = self.active_session.lock().await;
        *active = Some(session_id.clone());
        
        Ok(session_id)
    }
    
    // Stop a voice session
    pub async fn stop_session(&self, session_id: &str) -> Result<()> {
        let mut sessions = self.sessions.lock().await;
        if let Some(mut session) = sessions.get_mut(session_id) {
            session.is_listening = false;
            session.status = VoiceSessionStatus::Idle;
        }
        
        let mut active = self.active_session.lock().await;
        if active.as_ref() == Some(&session_id.to_string()) {
            *active = None;
        }
        
        Ok(())
    }
    
    // Process audio data for STT using OpenAI Whisper
    pub async fn transcribe_audio(&self, audio_data: Vec<u8>, session_id: &str) -> Result<TranscriptionResult> {
        let config = self.config.read().await;
        
        // Check if we should use local or cloud STT
        if config.offline_mode || config.stt_provider == "local" {
            return self.transcribe_local(audio_data).await;
        }
        
        // Update session status
        {
            let mut sessions = self.sessions.lock().await;
            if let Some(session) = sessions.get_mut(session_id) {
                session.status = VoiceSessionStatus::Processing;
            }
        }
        
        // Use OpenAI Whisper API
        let form = reqwest::multipart::Form::new()
            .text("model", config.voice_model.clone())
            .text("response_format", "json")
            .part("file", reqwest::multipart::Part::bytes(audio_data)
                .file_name("audio.wav")
                .mime_str("audio/wav")?);
        
        let response = self.http_client
            .post("https://api.openai.com/v1/audio/transcriptions")
            .header("Authorization", format!("Bearer {}", config.api_key))
            .multipart(form)
            .send()
            .await?;
        
        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(anyhow!("Whisper API error: {}", error_text));
        }
        
        #[derive(Deserialize)]
        struct WhisperResponse {
            text: String,
            #[serde(default)]
            language: Option<String>,
            #[serde(default)]
            duration: Option<f32>,
        }
        
        let whisper_response: WhisperResponse = response.json().await?;
        
        // Update session transcript
        {
            let mut sessions = self.sessions.lock().await;
            if let Some(session) = sessions.get_mut(session_id) {
                session.transcript = whisper_response.text.clone();
                session.status = VoiceSessionStatus::Idle;
            }
        }
        
        Ok(TranscriptionResult {
            text: whisper_response.text,
            duration: whisper_response.duration.unwrap_or(0.0),
            language: whisper_response.language,
        })
    }
    
    // Local transcription fallback (would integrate with whisper.cpp)
    async fn transcribe_local(&self, _audio_data: Vec<u8>) -> Result<TranscriptionResult> {
        // TODO: Integrate with whisper.cpp for local transcription
        // For now, return a placeholder
        Err(anyhow!("Local transcription not yet implemented. Please use online mode."))
    }
    
    // Text-to-speech using OpenAI TTS with maple voice
    pub async fn synthesize_speech(&self, text: &str, session_id: Option<&str>) -> Result<Vec<u8>> {
        let config = self.config.read().await;
        
        // Check if we should use local or cloud TTS
        if config.offline_mode || config.tts_provider == "local" {
            return self.synthesize_local(text).await;
        }
        
        // Update session status if provided
        if let Some(sid) = session_id {
            let mut sessions = self.sessions.lock().await;
            if let Some(session) = sessions.get_mut(sid) {
                session.status = VoiceSessionStatus::Speaking;
            }
        }
        
        #[derive(Serialize)]
        struct TTSRequest {
            model: String,
            voice: String,
            input: String,
            response_format: String,
        }
        
        let request = TTSRequest {
            model: "tts-1".to_string(),
            voice: config.tts_voice.clone(), // Use maple voice as requested
            input: text.to_string(),
            response_format: "mp3".to_string(),
        };
        
        let response = self.http_client
            .post("https://api.openai.com/v1/audio/speech")
            .header("Authorization", format!("Bearer {}", config.api_key))
            .header("Content-Type", "application/json")
            .json(&request)
            .send()
            .await?;
        
        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(anyhow!("TTS API error: {}", error_text));
        }
        
        let audio_bytes = response.bytes().await?;
        
        // Update session status if provided
        if let Some(sid) = session_id {
            let mut sessions = self.sessions.lock().await;
            if let Some(session) = sessions.get_mut(sid) {
                session.status = VoiceSessionStatus::Idle;
            }
        }
        
        Ok(audio_bytes.to_vec())
    }
    
    // Local TTS fallback (would integrate with Piper TTS)
    async fn synthesize_local(&self, _text: &str) -> Result<Vec<u8>> {
        // TODO: Integrate with Piper TTS for local speech synthesis
        // For now, return a placeholder
        Err(anyhow!("Local TTS not yet implemented. Please use online mode."))
    }
    
    // Wake word detection
    pub async fn detect_wake_word(&self, audio_chunk: &[u8]) -> Result<bool> {
        // For a production implementation, this would use a wake word detection engine
        // like Porcupine or a custom model. For now, we'll use STT to check for the wake word
        
        let config = self.config.read().await;
        let wake_word_lower = config.wake_word.to_lowercase();
        
        // Convert audio chunk to proper format for transcription
        // This is a simplified version - in production you'd buffer audio properly
        if audio_chunk.len() < 16000 { // Less than 1 second of audio at 16kHz
            return Ok(false);
        }
        
        // Create a temporary session for wake word detection
        let temp_session_id = "wake_word_detection";
        match self.transcribe_audio(audio_chunk.to_vec(), temp_session_id).await {
            Ok(result) => {
                let transcript_lower = result.text.to_lowercase();
                Ok(transcript_lower.contains(&wake_word_lower))
            }
            Err(_) => Ok(false), // Don't fail on transcription errors during wake word detection
        }
    }
    
    // Get session info
    pub async fn get_session(&self, session_id: &str) -> Result<VoiceSession> {
        let sessions = self.sessions.lock().await;
        sessions.get(session_id)
            .cloned()
            .ok_or_else(|| anyhow!("Session not found"))
    }
    
    // Get active session
    pub async fn get_active_session(&self) -> Result<Option<VoiceSession>> {
        let active = self.active_session.lock().await;
        if let Some(session_id) = active.as_ref() {
            let sessions = self.sessions.lock().await;
            Ok(sessions.get(session_id).cloned())
        } else {
            Ok(None)
        }
    }
    
    // Stream audio processing (for real-time voice)
    pub async fn process_audio_stream(
        &self,
        mut audio_receiver: mpsc::Receiver<Vec<u8>>,
        result_sender: mpsc::Sender<TranscriptionResult>,
    ) -> Result<()> {
        let mut audio_buffer = Vec::new();
        let buffer_duration_ms = 1000; // 1 second chunks
        let sample_rate = 16000;
        let bytes_per_second = sample_rate * 2; // 16-bit audio
        let buffer_size = (bytes_per_second * buffer_duration_ms / 1000) as usize;
        
        while let Some(chunk) = audio_receiver.recv().await {
            audio_buffer.extend_from_slice(&chunk);
            
            // Process when we have enough audio
            if audio_buffer.len() >= buffer_size {
                let audio_to_process = audio_buffer.drain(..buffer_size).collect::<Vec<_>>();
                
                // Check for wake word if waiting
                let active_session = self.get_active_session().await?;
                if let Some(session) = active_session {
                    if session.status == VoiceSessionStatus::WaitingForWakeWord {
                        if self.detect_wake_word(&audio_to_process).await? {
                            // Wake word detected, update session status
                            let mut sessions = self.sessions.lock().await;
                            if let Some(sess) = sessions.get_mut(&session.id) {
                                sess.status = VoiceSessionStatus::Listening;
                            }
                            continue;
                        }
                    } else if session.status == VoiceSessionStatus::Listening {
                        // Transcribe the audio
                        match self.transcribe_audio(audio_to_process, &session.id).await {
                            Ok(result) => {
                                let _ = result_sender.send(result).await;
                            }
                            Err(e) => {
                                eprintln!("Transcription error: {}", e);
                            }
                        }
                    }
                }
            }
        }
        
        Ok(())
    }
}

// Global voice provider instance
use once_cell::sync::Lazy;

static VOICE_PROVIDER: Lazy<Arc<Mutex<Option<VoiceProvider>>>> = Lazy::new(|| Arc::new(Mutex::new(None)));

pub async fn initialize_voice_provider(config: VoiceConfig) -> Result<()> {
    let provider = VoiceProvider::new(config)?;
    let mut voice_provider = VOICE_PROVIDER.lock().await;
    *voice_provider = Some(provider);
    Ok(())
}

pub async fn with_voice_provider<F, R>(f: F) -> Result<R>
where
    F: FnOnce(&VoiceProvider) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<R>> + Send + '_>>,
{
    let voice_provider = VOICE_PROVIDER.lock().await;
    match voice_provider.as_ref() {
        Some(provider) => f(provider).await,
        None => Err(anyhow!("Voice provider not initialized")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_voice_provider_initialization() {
        let config = VoiceConfig::default();
        let provider = VoiceProvider::new(config).unwrap();
        
        // Test session creation
        let session_id = provider.start_session(None).await.unwrap();
        assert!(!session_id.is_empty());
        
        // Test session retrieval
        let session = provider.get_session(&session_id).await.unwrap();
        assert_eq!(session.id, session_id);
        assert_eq!(session.status, VoiceSessionStatus::WaitingForWakeWord);
        
        // Test session stop
        provider.stop_session(&session_id).await.unwrap();
        let session = provider.get_session(&session_id).await.unwrap();
        assert!(!session.is_listening);
    }
}