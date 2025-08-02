pub mod plugin_system;
pub use plugin_system::*;

use anyhow::Result;
use std::sync::Arc;
use tokio::sync::Mutex;
use once_cell::sync::Lazy;

// Global plugin system instance
static PLUGIN_SYSTEM: Lazy<Arc<Mutex<Option<PluginSystem>>>> = Lazy::new(|| Arc::new(Mutex::new(None)));

pub async fn initialize_plugin_system(plugins_dir: std::path::PathBuf) -> Result<()> {
    let system = PluginSystem::new(plugins_dir)?;
    *PLUGIN_SYSTEM.lock().await = Some(system);
    Ok(())
}

pub async fn with_plugin_system<F, R>(f: F) -> Result<R>
where
    F: FnOnce(&PluginSystem) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<R>> + Send + '_>>,
{
    let guard = PLUGIN_SYSTEM.lock().await;
    match guard.as_ref() {
        Some(system) => f(system).await,
        None => Err(anyhow::anyhow!("Plugin system not initialized")),
    }
}