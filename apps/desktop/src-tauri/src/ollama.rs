use reqwest;
use serde::{Deserialize, Serialize};
use anyhow::{Result, anyhow};

#[derive(Debug, Serialize)]
struct OllamaRequest {
    model: String,
    prompt: String,
    stream: bool,
    options: OllamaOptions,
}

#[derive(Debug, Serialize)]
struct OllamaOptions {
    temperature: f32,
    num_predict: i32,
}

#[derive(Debug, Deserialize)]
struct OllamaResponse {
    model: String,
    created_at: String,
    response: String,
    done: bool,
}

pub struct OllamaClient {
    base_url: String,
    client: reqwest::Client,
}

impl OllamaClient {
    pub fn new(base_url: Option<String>) -> Self {
        Self {
            base_url: base_url.unwrap_or_else(|| crate::config::CONFIG.api.ollama_base_url.clone()),
            client: reqwest::Client::new(),
        }
    }
    
    pub async fn is_available(&self) -> bool {
        match self.client.get(&format!("{}/api/tags", self.base_url)).send().await {
            Ok(response) => response.status().is_success(),
            Err(_) => false,
        }
    }
    
    pub async fn generate(&self, model: &str, prompt: &str, temperature: f32) -> Result<String> {
        let request = OllamaRequest {
            model: model.to_string(),
            prompt: prompt.to_string(),
            stream: false,
            options: OllamaOptions {
                temperature,
                num_predict: 2000,
            },
        };
        
        let response = self.client
            .post(&format!("{}/api/generate", self.base_url))
            .json(&request)
            .send()
            .await?;
        
        if response.status().is_success() {
            let ollama_response: OllamaResponse = response.json().await?;
            Ok(ollama_response.response)
        } else {
            Err(anyhow!("Ollama API error: {}", response.status()))
        }
    }
    
    pub async fn list_models(&self) -> Result<Vec<String>> {
        let response = self.client
            .get(&format!("{}/api/tags", self.base_url))
            .send()
            .await?;
        
        if response.status().is_success() {
            let data: serde_json::Value = response.json().await?;
            if let Some(models) = data["models"].as_array() {
                let model_names: Vec<String> = models.iter()
                    .filter_map(|m| m["name"].as_str().map(|s| s.to_string()))
                    .collect();
                Ok(model_names)
            } else {
                Ok(vec![])
            }
        } else {
            Err(anyhow!("Failed to list Ollama models"))
        }
    }
}