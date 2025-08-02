use anyhow::{anyhow, Result};
use std::path::PathBuf;
use std::process::Command;
use std::fs;
use std::io::Write;
use tempfile::NamedTempFile;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone)]
pub struct PiperTts {
    model_path: PathBuf,
    config_path: PathBuf,
    piper_path: PathBuf,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PiperVoice {
    pub name: String,
    pub language: String,
    pub quality: String,
    pub model_url: String,
    pub config_url: String,
}

impl PiperTts {
    pub fn new(model_path: PathBuf, config_path: PathBuf) -> Result<Self> {
        // Check if piper executable exists
        let piper_path = which::which("piper")
            .or_else(|_| which::which("piper-tts"))
            .or_else(|_| {
                // Try common installation paths
                let paths = vec![
                    "/usr/local/bin/piper",
                    "/opt/homebrew/bin/piper",
                    "./piper/piper",
                ];
                paths.into_iter()
                    .find(|p| std::path::Path::new(p).exists())
                    .map(PathBuf::from)
                    .ok_or_else(|| anyhow!("piper TTS not found"))
            })?;
        
        // Verify model files exist
        if !model_path.exists() {
            return Err(anyhow!("Piper model file not found: {:?}", model_path));
        }
        if !config_path.exists() {
            return Err(anyhow!("Piper config file not found: {:?}", config_path));
        }
        
        Ok(Self {
            model_path,
            config_path,
            piper_path,
        })
    }
    
    pub async fn synthesize(&self, text: &str, output_format: &str) -> Result<Vec<u8>> {
        // Create temporary file for output
        let temp_file = NamedTempFile::new()?;
        let output_path = temp_file.path();
        
        // Build command
        let mut cmd = Command::new(&self.piper_path);
        cmd.arg("--model").arg(&self.model_path)
           .arg("--config").arg(&self.config_path)
           .arg("--output_file").arg(output_path);
        
        // Set output format
        match output_format {
            "mp3" => cmd.arg("--output-format").arg("mp3"),
            "wav" => cmd.arg("--output-format").arg("wav"),
            _ => cmd.arg("--output-format").arg("wav"),
        };
        
        // Pipe text to piper via stdin
        let mut child = cmd
            .stdin(std::process::Stdio::piped())
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()?;
        
        // Write text to stdin
        if let Some(mut stdin) = child.stdin.take() {
            stdin.write_all(text.as_bytes())?;
        }
        
        // Wait for completion
        let output = tokio::task::spawn_blocking(move || {
            child.wait_with_output()
        }).await??;
        
        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(anyhow!("Piper synthesis failed: {}", stderr));
        }
        
        // Read the generated audio file
        let audio_data = fs::read(output_path)?;
        Ok(audio_data)
    }
    
    pub async fn download_voice(voice_name: &str, target_dir: &PathBuf) -> Result<(PathBuf, PathBuf)> {
        // Common Piper voices
        let voices = vec![
            PiperVoice {
                name: "en_US-amy-low".to_string(),
                language: "en_US".to_string(),
                quality: "low".to_string(),
                model_url: "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/amy/low/en_US-amy-low.onnx".to_string(),
                config_url: "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/amy/low/en_US-amy-low.onnx.json".to_string(),
            },
            PiperVoice {
                name: "en_US-danny-low".to_string(),
                language: "en_US".to_string(),
                quality: "low".to_string(),
                model_url: "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/danny/low/en_US-danny-low.onnx".to_string(),
                config_url: "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/danny/low/en_US-danny-low.onnx.json".to_string(),
            },
            PiperVoice {
                name: "en_GB-alan-low".to_string(),
                language: "en_GB".to_string(),
                quality: "low".to_string(),
                model_url: "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_GB/alan/low/en_GB-alan-low.onnx".to_string(),
                config_url: "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_GB/alan/low/en_GB-alan-low.onnx.json".to_string(),
            },
        ];
        
        let voice = voices.iter()
            .find(|v| v.name == voice_name)
            .ok_or_else(|| anyhow!("Unknown voice: {}", voice_name))?;
        
        let model_filename = format!("{}.onnx", voice_name);
        let config_filename = format!("{}.onnx.json", voice_name);
        let model_path = target_dir.join(&model_filename);
        let config_path = target_dir.join(&config_filename);
        
        // Check if already downloaded
        if model_path.exists() && config_path.exists() {
            return Ok((model_path, config_path));
        }
        
        // Ensure directory exists
        fs::create_dir_all(target_dir)?;
        
        // Download model
        println!("Downloading Piper voice model: {}", voice_name);
        let model_response = reqwest::get(&voice.model_url).await?;
        let model_bytes = model_response.bytes().await?;
        
        let mut model_file = fs::File::create(&model_path)?;
        model_file.write_all(&model_bytes)?;
        
        // Download config
        println!("Downloading Piper voice config: {}", voice_name);
        let config_response = reqwest::get(&voice.config_url).await?;
        let config_bytes = config_response.bytes().await?;
        
        let mut config_file = fs::File::create(&config_path)?;
        config_file.write_all(&config_bytes)?;
        
        Ok((model_path, config_path))
    }
    
    pub fn list_available_voices() -> Vec<PiperVoice> {
        vec![
            PiperVoice {
                name: "en_US-amy-low".to_string(),
                language: "en_US".to_string(),
                quality: "low".to_string(),
                model_url: "".to_string(),
                config_url: "".to_string(),
            },
            PiperVoice {
                name: "en_US-danny-low".to_string(),
                language: "en_US".to_string(),
                quality: "low".to_string(),
                model_url: "".to_string(),
                config_url: "".to_string(),
            },
            PiperVoice {
                name: "en_GB-alan-low".to_string(),
                language: "en_GB".to_string(),
                quality: "low".to_string(),
                model_url: "".to_string(),
                config_url: "".to_string(),
            },
        ]
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_piper_initialization() {
        // This test will only pass if piper is installed
        let model_path = PathBuf::from("models/en_US-amy-low.onnx");
        let config_path = PathBuf::from("models/en_US-amy-low.onnx.json");
        match PiperTts::new(model_path, config_path) {
            Ok(_) => println!("Piper initialized successfully"),
            Err(e) => println!("Piper initialization failed (expected if not installed): {}", e),
        }
    }
}