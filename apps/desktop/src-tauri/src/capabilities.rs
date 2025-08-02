// FILE: apps/desktop/src-tauri/src/capabilities.rs
use std::process::Command;
use std::path::Path;
use tokio::fs;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

pub struct FileOperation;

impl FileOperation {
    pub async fn read_file(path: &str) -> Result<String, Box<dyn std::error::Error>> {
        let mut file = fs::File::open(path).await?;
        let mut contents = String::new();
        file.read_to_string(&mut contents).await?;
        Ok(contents)
    }
    
    pub async fn write_file(path: &str, content: &str) -> Result<(), Box<dyn std::error::Error>> {
        // Ensure parent directory exists
        if let Some(parent) = Path::new(path).parent() {
            fs::create_dir_all(parent).await?;
        }
        
        let mut file = fs::File::create(path).await?;
        file.write_all(content.as_bytes()).await?;
        Ok(())
    }
    
    pub async fn list_directory(path: &str) -> Result<Vec<String>, Box<dyn std::error::Error>> {
        let mut entries = fs::read_dir(path).await?;
        let mut file_list = Vec::new();
        
        while let Some(entry) = entries.next_entry().await? {
            let path = entry.path();
            let name = path.file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("")
                .to_string();
            
            if path.is_dir() {
                file_list.push(format!("{}/", name));
            } else {
                file_list.push(name);
            }
        }
        
        file_list.sort();
        Ok(file_list)
    }
    
    pub async fn file_exists(path: &str) -> bool {
        Path::new(path).exists()
    }
    
    pub async fn create_directory(path: &str) -> Result<(), Box<dyn std::error::Error>> {
        fs::create_dir_all(path).await?;
        Ok(())
    }
    
    pub async fn delete_file(path: &str) -> Result<(), Box<dyn std::error::Error>> {
        if Path::new(path).is_dir() {
            fs::remove_dir_all(path).await?;
        } else {
            fs::remove_file(path).await?;
        }
        Ok(())
    }
    
    pub async fn copy_file(src: &str, dest: &str) -> Result<(), Box<dyn std::error::Error>> {
        // Ensure parent directory exists
        if let Some(parent) = Path::new(dest).parent() {
            fs::create_dir_all(parent).await?;
        }
        
        fs::copy(src, dest).await?;
        Ok(())
    }
    
    pub async fn move_file(src: &str, dest: &str) -> Result<(), Box<dyn std::error::Error>> {
        // Ensure parent directory exists
        if let Some(parent) = Path::new(dest).parent() {
            fs::create_dir_all(parent).await?;
        }
        
        fs::rename(src, dest).await?;
        Ok(())
    }
    
    pub async fn get_file_metadata(path: &str) -> Result<serde_json::Value, Box<dyn std::error::Error>> {
        let metadata = fs::metadata(path).await?;
        
        Ok(serde_json::json!({
            "size": metadata.len(),
            "is_file": metadata.is_file(),
            "is_dir": metadata.is_dir(),
            "modified": metadata.modified()?.duration_since(std::time::UNIX_EPOCH)?.as_secs(),
            "permissions": {
                "readonly": metadata.permissions().readonly()
            }
        }))
    }
}

pub async fn execute_system_command(
    command: &str,
    args: &[String],
    working_dir: Option<&str>,
) -> Result<String, Box<dyn std::error::Error>> {
    let mut cmd = Command::new(command);
    cmd.args(args);
    
    if let Some(dir) = working_dir {
        cmd.current_dir(dir);
    }
    
    let output = cmd.output()?;
    
    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        let stderr = String::from_utf8_lossy(&output.stderr);
        
        if stderr.is_empty() {
            Ok(stdout.to_string())
        } else {
            Ok(format!("{}\n{}", stdout, stderr))
        }
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Command failed: {}", stderr).into())
    }
}

pub struct ProcessManager;

impl ProcessManager {
    pub async fn start_process(
        command: &str,
        args: &[String],
        working_dir: Option<&str>,
    ) -> Result<u32, Box<dyn std::error::Error>> {
        let mut cmd = Command::new(command);
        cmd.args(args);
        
        if let Some(dir) = working_dir {
            cmd.current_dir(dir);
        }
        
        let child = cmd.spawn()?;
        Ok(child.id())
    }
    
    pub async fn kill_process(pid: u32) -> Result<(), Box<dyn std::error::Error>> {
        #[cfg(unix)]
        {
            unsafe {
                libc::kill(pid as i32, libc::SIGTERM);
            }
        }
        
        #[cfg(windows)]
        {
            // Windows-specific process termination would go here
        }
        
        Ok(())
    }
    
    pub async fn list_processes() -> Result<Vec<serde_json::Value>, Box<dyn std::error::Error>> {
        // This would implement process listing
        // For now, returning empty list
        Ok(vec![])
    }
}

pub struct NetworkCapability;

impl NetworkCapability {
    pub async fn http_request(
        method: &str,
        url: &str,
        headers: Option<serde_json::Value>,
        body: Option<String>,
    ) -> Result<serde_json::Value, Box<dyn std::error::Error>> {
        let client = reqwest::Client::new();
        
        let mut request = match method.to_uppercase().as_str() {
            "GET" => client.get(url),
            "POST" => client.post(url),
            "PUT" => client.put(url),
            "DELETE" => client.delete(url),
            "PATCH" => client.patch(url),
            _ => return Err("Unsupported HTTP method".into()),
        };
        
        if let Some(headers_obj) = headers {
            if let Some(headers_map) = headers_obj.as_object() {
                for (key, value) in headers_map {
                    if let Some(value_str) = value.as_str() {
                        request = request.header(key, value_str);
                    }
                }
            }
        }
        
        if let Some(body_content) = body {
            request = request.body(body_content);
        }
        
        let response = request.send().await?;
        let status = response.status().as_u16();
        let headers: serde_json::Value = response.headers()
            .iter()
            .map(|(name, value)| {
                (name.as_str().to_string(), value.to_str().unwrap_or("").to_string())
            })
            .collect::<std::collections::HashMap<_, _>>()
            .into();
        
        let body = response.text().await?;
        
        Ok(serde_json::json!({
            "status": status,
            "headers": headers,
            "body": body
        }))
    }
    
    pub async fn download_file(
        url: &str,
        destination: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let response = reqwest::get(url).await?;
        let bytes = response.bytes().await?;
        
        // Ensure parent directory exists
        if let Some(parent) = Path::new(destination).parent() {
            fs::create_dir_all(parent).await?;
        }
        
        let mut file = fs::File::create(destination).await?;
        file.write_all(&bytes).await?;
        
        Ok(())
    }
}

pub struct SystemCapability;

impl SystemCapability {
    pub async fn get_system_info() -> Result<serde_json::Value, Box<dyn std::error::Error>> {
        Ok(serde_json::json!({
            "os": std::env::consts::OS,
            "arch": std::env::consts::ARCH,
            "family": std::env::consts::FAMILY,
            "username": whoami::username(),
            "hostname": whoami::hostname(),
            "platform": whoami::platform(),
        }))
    }
    
    pub async fn get_environment_variables() -> Result<serde_json::Value, Box<dyn std::error::Error>> {
        let env_vars: std::collections::HashMap<String, String> = std::env::vars().collect();
        Ok(serde_json::to_value(env_vars)?)
    }
    
    pub async fn set_environment_variable(key: &str, value: &str) -> Result<(), Box<dyn std::error::Error>> {
        std::env::set_var(key, value);
        Ok(())
    }
    
    pub async fn get_current_directory() -> Result<String, Box<dyn std::error::Error>> {
        let current_dir = std::env::current_dir()?;
        Ok(current_dir.to_string_lossy().to_string())
    }
    
    pub async fn set_current_directory(path: &str) -> Result<(), Box<dyn std::error::Error>> {
        std::env::set_current_dir(path)?;
        Ok(())
    }
}