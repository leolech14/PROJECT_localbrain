use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use async_trait::async_trait;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentNode {
    pub id: String,
    pub name: String,
    pub agent_type: AgentType,
    pub x: f32,
    pub y: f32,
    pub config: serde_json::Value,
    pub status: AgentStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AgentType {
    Input,
    Processor,
    Output,
    Condition,
    Transform,
    Storage,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AgentStatus {
    Idle,
    Running,
    Success,
    Error,
    Disabled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentConnection {
    pub id: String,
    pub from: String,
    pub to: String,
    pub label: Option<String>,
    pub condition: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentWorkflow {
    pub id: String,
    pub name: String,
    pub description: String,
    pub nodes: Vec<AgentNode>,
    pub connections: Vec<AgentConnection>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[async_trait]
pub trait AgentExecutor: Send + Sync {
    async fn execute(&self, input: serde_json::Value, config: &serde_json::Value) -> Result<serde_json::Value>;
    fn get_type(&self) -> AgentType;
    fn get_name(&self) -> &str;
}

// Built-in agent executors
pub struct VoiceInputAgent;
pub struct IntentClassifierAgent;
pub struct CommandExecutorAgent;
pub struct ResponseGeneratorAgent;
pub struct VoiceOutputAgent;
pub struct FileReaderAgent;
pub struct DataTransformAgent;
pub struct ConditionalAgent;

#[async_trait]
impl AgentExecutor for VoiceInputAgent {
    async fn execute(&self, _input: serde_json::Value, config: &serde_json::Value) -> Result<serde_json::Value> {
        let stt_provider = config["sttProvider"].as_str().unwrap_or("openai");
        let wake_word = config["wakeWord"].as_str().unwrap_or("Hey Brain");
        
        // In real implementation, this would capture audio and transcribe it
        Ok(serde_json::json!({
            "transcript": "Sample voice input",
            "provider": stt_provider,
            "wakeWord": wake_word,
            "timestamp": Utc::now()
        }))
    }
    
    fn get_type(&self) -> AgentType { AgentType::Input }
    fn get_name(&self) -> &str { "Voice Input" }
}

#[async_trait]
impl AgentExecutor for IntentClassifierAgent {
    async fn execute(&self, input: serde_json::Value, config: &serde_json::Value) -> Result<serde_json::Value> {
        let transcript = input["transcript"].as_str()
            .ok_or_else(|| anyhow!("No transcript in input"))?;
        
        let model = config["model"].as_str().unwrap_or("gpt-4o");
        let temperature = config["temperature"].as_f64().unwrap_or(0.3);
        
        // In real implementation, this would use AI to classify intent
        let intent = if transcript.contains("weather") {
            "weather_query"
        } else if transcript.contains("file") || transcript.contains("open") {
            "file_operation"
        } else if transcript.contains("run") || transcript.contains("execute") {
            "command_execution"
        } else {
            "general_query"
        };
        
        Ok(serde_json::json!({
            "intent": intent,
            "confidence": 0.95,
            "transcript": transcript,
            "model": model,
            "temperature": temperature
        }))
    }
    
    fn get_type(&self) -> AgentType { AgentType::Processor }
    fn get_name(&self) -> &str { "Intent Classifier" }
}

#[async_trait]
impl AgentExecutor for CommandExecutorAgent {
    async fn execute(&self, input: serde_json::Value, config: &serde_json::Value) -> Result<serde_json::Value> {
        let command = input["command"].as_str()
            .unwrap_or(input["transcript"].as_str().unwrap_or(""));
        
        let max_retries = config["maxRetries"].as_u64().unwrap_or(3);
        let timeout = config["timeout"].as_u64().unwrap_or(30000);
        
        // In real implementation, this would execute commands safely
        Ok(serde_json::json!({
            "command": command,
            "status": "executed",
            "output": format!("Executed: {}", command),
            "exitCode": 0,
            "maxRetries": max_retries,
            "timeout": timeout
        }))
    }
    
    fn get_type(&self) -> AgentType { AgentType::Processor }
    fn get_name(&self) -> &str { "Command Executor" }
}

#[async_trait]
impl AgentExecutor for ResponseGeneratorAgent {
    async fn execute(&self, input: serde_json::Value, config: &serde_json::Value) -> Result<serde_json::Value> {
        let query = input["query"].as_str()
            .unwrap_or(input["transcript"].as_str().unwrap_or(""));
        
        let model = config["model"].as_str().unwrap_or("gpt-4o");
        let style = config["style"].as_str().unwrap_or("concise");
        
        // In real implementation, this would generate AI responses
        Ok(serde_json::json!({
            "response": format!("Generated response for: {}", query),
            "model": model,
            "style": style,
            "tokens": 150
        }))
    }
    
    fn get_type(&self) -> AgentType { AgentType::Processor }
    fn get_name(&self) -> &str { "Response Generator" }
}

#[async_trait]
impl AgentExecutor for VoiceOutputAgent {
    async fn execute(&self, input: serde_json::Value, config: &serde_json::Value) -> Result<serde_json::Value> {
        let text = input["response"].as_str()
            .unwrap_or(input["text"].as_str().unwrap_or(""));
        
        let tts_provider = config["ttsProvider"].as_str().unwrap_or("openai");
        let voice = config["voice"].as_str().unwrap_or("maple");
        
        // In real implementation, this would synthesize speech
        Ok(serde_json::json!({
            "text": text,
            "provider": tts_provider,
            "voice": voice,
            "audioUrl": "data:audio/mp3;base64,..."
        }))
    }
    
    fn get_type(&self) -> AgentType { AgentType::Output }
    fn get_name(&self) -> &str { "Voice Output" }
}

pub struct AgentSystem {
    executors: Arc<RwLock<HashMap<String, Box<dyn AgentExecutor>>>>,
    workflows: Arc<RwLock<HashMap<String, AgentWorkflow>>>,
}

impl AgentSystem {
    pub fn new() -> Self {
        let mut executors: HashMap<String, Box<dyn AgentExecutor>> = HashMap::new();
        
        // Register built-in agents
        executors.insert("voice_input".to_string(), Box::new(VoiceInputAgent));
        executors.insert("intent_classifier".to_string(), Box::new(IntentClassifierAgent));
        executors.insert("command_executor".to_string(), Box::new(CommandExecutorAgent));
        executors.insert("response_generator".to_string(), Box::new(ResponseGeneratorAgent));
        executors.insert("voice_output".to_string(), Box::new(VoiceOutputAgent));
        
        Self {
            executors: Arc::new(RwLock::new(executors)),
            workflows: Arc::new(RwLock::new(HashMap::new())),
        }
    }
    
    pub async fn create_workflow(&self, name: String, description: String) -> Result<String> {
        let workflow = AgentWorkflow {
            id: Uuid::new_v4().to_string(),
            name,
            description,
            nodes: Vec::new(),
            connections: Vec::new(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };
        
        let workflow_id = workflow.id.clone();
        let mut workflows = self.workflows.write().await;
        workflows.insert(workflow_id.clone(), workflow);
        
        Ok(workflow_id)
    }
    
    pub async fn add_node(&self, workflow_id: &str, node: AgentNode) -> Result<()> {
        let mut workflows = self.workflows.write().await;
        let workflow = workflows.get_mut(workflow_id)
            .ok_or_else(|| anyhow!("Workflow not found"))?;
        
        workflow.nodes.push(node);
        workflow.updated_at = Utc::now();
        
        Ok(())
    }
    
    pub async fn add_connection(&self, workflow_id: &str, connection: AgentConnection) -> Result<()> {
        let mut workflows = self.workflows.write().await;
        let workflow = workflows.get_mut(workflow_id)
            .ok_or_else(|| anyhow!("Workflow not found"))?;
        
        workflow.connections.push(connection);
        workflow.updated_at = Utc::now();
        
        Ok(())
    }
    
    pub async fn execute_workflow(&self, workflow_id: &str, initial_input: serde_json::Value) -> Result<serde_json::Value> {
        let workflows = self.workflows.read().await;
        let workflow = workflows.get(workflow_id)
            .ok_or_else(|| anyhow!("Workflow not found"))?;
        
        // Find input nodes
        let input_nodes: Vec<_> = workflow.nodes.iter()
            .filter(|n| matches!(n.agent_type, AgentType::Input))
            .collect();
        
        if input_nodes.is_empty() {
            return Err(anyhow!("No input nodes in workflow"));
        }
        
        // Simple execution - in reality, this would be more sophisticated
        let mut results = HashMap::new();
        results.insert("initial_input".to_string(), initial_input);
        
        // Execute nodes in order (simplified - real implementation would handle dependencies)
        for node in &workflow.nodes {
            let executors = self.executors.read().await;
            if let Some(executor) = executors.get(&node.name.to_lowercase().replace(" ", "_")) {
                let input = results.get("initial_input").cloned()
                    .unwrap_or_else(|| serde_json::Value::Null);
                
                match executor.execute(input, &node.config).await {
                    Ok(output) => {
                        results.insert(node.id.clone(), output);
                    }
                    Err(e) => {
                        return Err(anyhow!("Node {} execution failed: {}", node.name, e));
                    }
                }
            }
        }
        
        Ok(serde_json::json!({
            "workflowId": workflow_id,
            "results": results,
            "timestamp": Utc::now()
        }))
    }
    
    pub async fn list_workflows(&self) -> Vec<AgentWorkflow> {
        let workflows = self.workflows.read().await;
        workflows.values().cloned().collect()
    }
    
    pub async fn get_workflow(&self, workflow_id: &str) -> Result<AgentWorkflow> {
        let workflows = self.workflows.read().await;
        workflows.get(workflow_id)
            .cloned()
            .ok_or_else(|| anyhow!("Workflow not found"))
    }
    
    pub async fn update_workflow(&self, workflow: AgentWorkflow) -> Result<()> {
        let mut workflows = self.workflows.write().await;
        workflows.insert(workflow.id.clone(), workflow);
        Ok(())
    }
    
    pub async fn delete_workflow(&self, workflow_id: &str) -> Result<()> {
        let mut workflows = self.workflows.write().await;
        workflows.remove(workflow_id)
            .ok_or_else(|| anyhow!("Workflow not found"))?;
        Ok(())
    }
    
    pub fn get_available_agents(&self) -> Vec<(String, String, AgentType)> {
        vec![
            ("voice_input".to_string(), "Voice Input".to_string(), AgentType::Input),
            ("intent_classifier".to_string(), "Intent Classifier".to_string(), AgentType::Processor),
            ("command_executor".to_string(), "Command Executor".to_string(), AgentType::Processor),
            ("response_generator".to_string(), "Response Generator".to_string(), AgentType::Processor),
            ("voice_output".to_string(), "Voice Output".to_string(), AgentType::Output),
            ("file_reader".to_string(), "File Reader".to_string(), AgentType::Input),
            ("data_transform".to_string(), "Data Transform".to_string(), AgentType::Transform),
            ("conditional".to_string(), "Conditional".to_string(), AgentType::Condition),
        ]
    }
}

// Global agent system instance
use once_cell::sync::Lazy;

static AGENT_SYSTEM: Lazy<Arc<tokio::sync::Mutex<Option<AgentSystem>>>> = 
    Lazy::new(|| Arc::new(tokio::sync::Mutex::new(None)));

pub async fn initialize_agent_system() -> Result<()> {
    let system = AgentSystem::new();
    *AGENT_SYSTEM.lock().await = Some(system);
    Ok(())
}

pub async fn with_agent_system<F, R>(f: F) -> Result<R>
where
    F: FnOnce(&AgentSystem) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<R>> + Send + '_>>,
{
    let guard = AGENT_SYSTEM.lock().await;
    match guard.as_ref() {
        Some(system) => f(system).await,
        None => Err(anyhow!("Agent system not initialized")),
    }
}