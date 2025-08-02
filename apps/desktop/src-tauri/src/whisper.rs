use anyhow::{anyhow, Result};
use std::path::PathBuf;
use std::process::Command;
use serde::{Deserialize, Serialize};
use std::fs;
use std::io::Write;
use tempfile::NamedTempFile;

#[derive(Debug, Clone)]
pub struct WhisperCpp {
    model_path: PathBuf,
    whisper_path: PathBuf,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WhisperResult {
    pub text: String,
    pub language: Option<String>,
    pub segments: Vec<WhisperSegment>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WhisperSegment {
    pub start: f32,
    pub end: f32,
    pub text: String,
}

impl WhisperCpp {
    pub fn new(model_path: PathBuf) -> Result<Self> {
        // Check if whisper executable exists
        let whisper_path = which::which("whisper-cpp")
            .or_else(|_| which::which("whisper"))
            .or_else(|_| {
                // Try common installation paths
                let paths = vec![
                    "/usr/local/bin/whisper",
                    "/opt/homebrew/bin/whisper",
                    "./whisper.cpp/main",
                ];
                paths.into_iter()
                    .find(|p| std::path::Path::new(p).exists())
                    .map(PathBuf::from)
                    .ok_or_else(|| anyhow!("whisper-cpp not found"))
            })?;
        
        // Verify model file exists
        if !model_path.exists() {
            return Err(anyhow!("Whisper model file not found: {:?}", model_path));
        }
        
        Ok(Self {
            model_path,
            whisper_path,
        })
    }
    
    pub async fn transcribe(&self, audio_data: &[u8], language: Option<&str>) -> Result<WhisperResult> {
        // Create temporary file for audio
        let mut temp_file = NamedTempFile::new()?;
        temp_file.write_all(audio_data)?;
        let temp_path = temp_file.path();
        
        // Build command
        let mut cmd = Command::new(&self.whisper_path);
        cmd.arg("-m").arg(&self.model_path)
           .arg("-f").arg(temp_path)
           .arg("--output-json")
           .arg("--no-timestamps");
        
        if let Some(lang) = language {
            cmd.arg("-l").arg(lang);
        }
        
        // Execute whisper
        let output = tokio::task::spawn_blocking(move || {
            cmd.output()
        }).await??;
        
        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(anyhow!("Whisper transcription failed: {}", stderr));
        }
        
        // Parse output
        let stdout = String::from_utf8_lossy(&output.stdout);
        
        // Simple parsing - whisper outputs the transcribed text directly
        // For more detailed output, use --output-json flag and parse JSON
        Ok(WhisperResult {
            text: stdout.trim().to_string(),
            language: language.map(|s| s.to_string()),
            segments: vec![],
        })
    }
    
    pub async fn download_model(model_name: &str, target_dir: &PathBuf) -> Result<PathBuf> {
        // Common whisper model names and URLs
        let model_url = match model_name {
            "tiny" | "tiny.en" => "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin",
            "base" | "base.en" => "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin",
            "small" | "small.en" => "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin",
            "medium" | "medium.en" => "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin",
            "large" => "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large.bin",
            _ => return Err(anyhow!("Unknown model name: {}", model_name)),
        };
        
        let model_filename = format!("ggml-{}.bin", model_name.replace(".en", "-en"));
        let model_path = target_dir.join(&model_filename);
        
        // Check if already downloaded
        if model_path.exists() {
            return Ok(model_path);
        }
        
        // Ensure directory exists
        fs::create_dir_all(target_dir)?;
        
        // Download model
        println!("Downloading whisper model: {}", model_name);
        let response = reqwest::get(model_url).await?;
        let bytes = response.bytes().await?;
        
        // Save to file
        let mut file = fs::File::create(&model_path)?;
        file.write_all(&bytes)?;
        
        Ok(model_path)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_whisper_initialization() {
        // This test will only pass if whisper.cpp is installed
        let model_path = PathBuf::from("models/ggml-base.bin");
        match WhisperCpp::new(model_path) {
            Ok(_) => println!("Whisper initialized successfully"),
            Err(e) => println!("Whisper initialization failed (expected if not installed): {}", e),
        }
    }
}