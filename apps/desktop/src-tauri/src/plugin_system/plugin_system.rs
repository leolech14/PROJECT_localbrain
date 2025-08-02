use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tokio::sync::RwLock;
use async_trait::async_trait;
use libloading::{Library, Symbol};
use wasmtime::*;
use std::fs;

// Plugin trait that all plugins must implement
#[async_trait]
pub trait Plugin: Send + Sync {
    fn name(&self) -> &str;
    fn version(&self) -> &str;
    fn description(&self) -> &str;
    
    async fn initialize(&mut self, config: PluginConfig) -> Result<()>;
    async fn execute(&self, action: &str, params: serde_json::Value) -> Result<serde_json::Value>;
    async fn shutdown(&mut self) -> Result<()>;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PluginConfig {
    pub settings: HashMap<String, serde_json::Value>,
    pub permissions: Vec<Permission>,
    pub resources: Resources,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Permission {
    pub name: String,
    pub scope: PermissionScope,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PermissionScope {
    FileSystem { paths: Vec<String> },
    Network { hosts: Vec<String> },
    Process { commands: Vec<String> },
    Tts,
    Stt,
    Database,
    Terminal,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Resources {
    pub max_memory_mb: u64,
    pub max_cpu_percent: f32,
    pub timeout_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PluginManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: String,
    pub author: String,
    pub plugin_type: PluginType,
    pub entry_point: String,
    pub required_permissions: Vec<Permission>,
    pub api_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PluginType {
    RustDylib,
    Wasm,
}

// Plugin instance wrapper
pub enum PluginInstance {
    Rust(Box<dyn Plugin>),
    Wasm(WasmPlugin),
}

pub struct WasmPlugin {
    module: Module,
    manifest: PluginManifest,
    engine: Engine,
}

struct WasmState {
    memory: Option<Memory>,
}

pub struct PluginSystem {
    plugins: Arc<RwLock<HashMap<String, PluginInstance>>>,
    manifests: Arc<RwLock<HashMap<String, PluginManifest>>>,
    plugin_dir: PathBuf,
    engine: Engine,
}

impl PluginSystem {
    pub fn new(plugin_dir: PathBuf) -> Result<Self> {
        // Create plugin directory if it doesn't exist
        fs::create_dir_all(&plugin_dir)?;
        
        // Configure WASM engine
        let mut config = Config::new();
        config.wasm_threads(true);
        config.async_support(true);
        
        let engine = Engine::new(&config)?;
        
        Ok(Self {
            plugins: Arc::new(RwLock::new(HashMap::new())),
            manifests: Arc::new(RwLock::new(HashMap::new())),
            plugin_dir,
            engine,
        })
    }
    
    pub async fn load_plugin(&self, plugin_path: &Path) -> Result<String> {
        // Read manifest
        let manifest_path = plugin_path.join("manifest.json");
        let manifest_data = fs::read_to_string(&manifest_path)?;
        let manifest: PluginManifest = serde_json::from_str(&manifest_data)?;
        
        // Validate permissions
        self.validate_permissions(&manifest.required_permissions)?;
        
        let plugin_id = manifest.id.clone();
        
        match manifest.plugin_type {
            PluginType::RustDylib => {
                self.load_rust_plugin(&manifest, plugin_path).await?;
            }
            PluginType::Wasm => {
                self.load_wasm_plugin(&manifest, plugin_path).await?;
            }
        }
        
        // Store manifest
        let mut manifests = self.manifests.write().await;
        manifests.insert(plugin_id.clone(), manifest);
        
        Ok(plugin_id)
    }
    
    async fn load_rust_plugin(&self, manifest: &PluginManifest, plugin_path: &Path) -> Result<()> {
        let lib_path = plugin_path.join(&manifest.entry_point);
        
        // Load the dynamic library
        let lib = unsafe { Library::new(&lib_path)? };
        
        // Get the plugin creation function
        let create_plugin: Symbol<fn() -> Box<dyn Plugin>> = unsafe {
            lib.get(b"create_plugin")?
        };
        
        let mut plugin = create_plugin();
        
        // Initialize plugin with config
        let config = PluginConfig {
            settings: HashMap::new(),
            permissions: manifest.required_permissions.clone(),
            resources: Resources {
                max_memory_mb: 100,
                max_cpu_percent: 25.0,
                timeout_ms: 30000,
            },
        };
        
        plugin.initialize(config).await?;
        
        // Store plugin instance
        let mut plugins = self.plugins.write().await;
        plugins.insert(manifest.id.clone(), PluginInstance::Rust(plugin));
        
        // Keep library loaded
        std::mem::forget(lib);
        
        Ok(())
    }
    
    async fn load_wasm_plugin(&self, manifest: &PluginManifest, plugin_path: &Path) -> Result<()> {
        let wasm_path = plugin_path.join(&manifest.entry_point);
        let wasm_bytes = fs::read(&wasm_path)?;
        
        // Create WASM module
        let module = Module::new(&self.engine, &wasm_bytes)?;
        
        // Create plugin without store - we'll create store during execution
        let wasm_plugin = WasmPlugin {
            module,
            manifest: manifest.clone(),
            engine: self.engine.clone(),
        };
        
        // Store plugin instance
        let mut plugins = self.plugins.write().await;
        plugins.insert(manifest.id.clone(), PluginInstance::Wasm(wasm_plugin));
        
        Ok(())
    }
    
    fn add_host_functions(&self, linker: &mut Linker<WasmState>) -> Result<()> {
        // Add logging function
        linker.func_wrap("host", "log", |mut _caller: Caller<'_, WasmState>, ptr: i32, len: i32| {
            // Implementation would read string from WASM memory and log it
            println!("[Plugin Log] ptr: {}, len: {}", ptr, len);
        })?;
        
        // Add file system access (with permission check)
        linker.func_wrap("host", "read_file", |mut _caller: Caller<'_, WasmState>, _path_ptr: i32, _path_len: i32| -> i32 {
            // Implementation would check permissions and read file
            -1 // Error for now
        })?;
        
        Ok(())
    }
    
    pub async fn execute_plugin(&self, plugin_id: &str, action: &str, params: serde_json::Value) -> Result<serde_json::Value> {
        let plugins = self.plugins.read().await;
        let plugin = plugins.get(plugin_id)
            .ok_or_else(|| anyhow!("Plugin not found: {}", plugin_id))?;
        
        match plugin {
            PluginInstance::Rust(plugin) => {
                plugin.execute(action, params).await
            }
            PluginInstance::Wasm(wasm_plugin) => {
                self.execute_wasm_plugin(wasm_plugin, action, params).await
            }
        }
    }
    
    async fn execute_wasm_plugin(&self, plugin: &WasmPlugin, action: &str, _params: serde_json::Value) -> Result<serde_json::Value> {
        // Create a new store for each execution
        // For now, we'll use a simple implementation without WASI
        let mut store = Store::new(&plugin.engine, WasmState {
            memory: None,
        });
        
        // Create linker
        let mut linker = Linker::new(&plugin.engine);
        
        // Add custom host functions
        self.add_host_functions(&mut linker)?;
        
        // Instantiate module
        let instance = linker.instantiate(&mut store, &plugin.module)?;
        
        // Get memory export if available
        if let Some(memory) = instance.get_memory(&mut store, "memory") {
            store.data_mut().memory = Some(memory);
        }
        
        // Call the requested action function if it exists
        if let Some(func) = instance.get_func(&mut store, action) {
            func.call(&mut store, &[], &mut [])?;
        }
        
        // Return success response
        Ok(serde_json::json!({
            "status": "executed",
            "action": action,
            "plugin": plugin.manifest.name
        }))
    }
    
    pub async fn unload_plugin(&self, plugin_id: &str) -> Result<()> {
        let mut plugins = self.plugins.write().await;
        if let Some(plugin) = plugins.remove(plugin_id) {
            match plugin {
                PluginInstance::Rust(mut plugin) => {
                    plugin.shutdown().await?;
                }
                PluginInstance::Wasm(_) => {
                    // WASM cleanup happens automatically
                }
            }
        }
        
        let mut manifests = self.manifests.write().await;
        manifests.remove(plugin_id);
        
        Ok(())
    }
    
    pub async fn list_plugins(&self) -> Vec<PluginManifest> {
        let manifests = self.manifests.read().await;
        manifests.values().cloned().collect()
    }
    
    pub async fn scan_plugins(&self) -> Result<Vec<PluginManifest>> {
        let mut found_plugins = Vec::new();
        
        // Scan plugin directory
        let entries = fs::read_dir(&self.plugin_dir)?;
        for entry in entries {
            let entry = entry?;
            let path = entry.path();
            
            if path.is_dir() {
                let manifest_path = path.join("manifest.json");
                if manifest_path.exists() {
                    let manifest_data = fs::read_to_string(&manifest_path)?;
                    if let Ok(manifest) = serde_json::from_str::<PluginManifest>(&manifest_data) {
                        found_plugins.push(manifest);
                    }
                }
            }
        }
        
        Ok(found_plugins)
    }
    
    fn validate_permissions(&self, permissions: &[Permission]) -> Result<()> {
        // Check if requested permissions are allowed
        for permission in permissions {
            match &permission.scope {
                PermissionScope::FileSystem { paths } => {
                    // Validate paths are within allowed roots
                    for path in paths {
                        if path.contains("..") {
                            return Err(anyhow!("Invalid file path: {}", path));
                        }
                    }
                }
                PermissionScope::Network { hosts } => {
                    // Validate hosts
                    for host in hosts {
                        if host == "*" {
                            return Err(anyhow!("Wildcard network access not allowed"));
                        }
                    }
                }
                _ => {}
            }
        }
        
        Ok(())
    }
}

// Example plugin implementation for testing
pub struct ExamplePlugin {
    name: String,
    version: String,
    config: Option<PluginConfig>,
}

#[async_trait]
impl Plugin for ExamplePlugin {
    fn name(&self) -> &str {
        &self.name
    }
    
    fn version(&self) -> &str {
        &self.version
    }
    
    fn description(&self) -> &str {
        "Example plugin for testing"
    }
    
    async fn initialize(&mut self, config: PluginConfig) -> Result<()> {
        self.config = Some(config);
        Ok(())
    }
    
    async fn execute(&self, action: &str, params: serde_json::Value) -> Result<serde_json::Value> {
        match action {
            "echo" => Ok(params),
            "info" => Ok(serde_json::json!({
                "name": self.name,
                "version": self.version,
            })),
            _ => Err(anyhow!("Unknown action: {}", action)),
        }
    }
    
    async fn shutdown(&mut self) -> Result<()> {
        Ok(())
    }
}

// Function to be called from dynamic library
#[no_mangle]
pub extern "C" fn create_plugin() -> Box<dyn Plugin> {
    Box::new(ExamplePlugin {
        name: "example".to_string(),
        version: "1.0.0".to_string(),
        config: None,
    })
}