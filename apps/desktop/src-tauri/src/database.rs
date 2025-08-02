use anyhow::{anyhow, Result};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;
use chrono::Utc;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Setting {
    pub key: String,
    pub value: JsonValue,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditLogEntry {
    pub id: i64,
    pub timestamp: String,
    pub user_id: Option<String>,
    pub action: String,
    pub resource: String,
    pub details: JsonValue,
    pub success: bool,
    pub error_message: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatContext {
    pub id: String,
    pub name: String,
    pub context_type: String,
    pub data: JsonValue,
    pub created_at: String,
    pub updated_at: String,
}

pub struct Database {
    conn: Arc<Mutex<Connection>>,
}

impl Database {
    pub async fn new(app_data_dir: PathBuf) -> Result<Self> {
        // Ensure the directory exists
        std::fs::create_dir_all(&app_data_dir)?;
        
        let db_path = app_data_dir.join("localbrain.db");
        
        // Open connection with encryption if available
        let conn = Connection::open(&db_path)?;
        
        // Enable foreign keys
        conn.execute("PRAGMA foreign_keys = ON", [])?;
        
        // Create tables
        Self::create_tables(&conn)?;
        
        Ok(Self {
            conn: Arc::new(Mutex::new(conn)),
        })
    }
    
    fn create_tables(conn: &Connection) -> Result<()> {
        // Settings table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;
        
        // Audit log table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_id TEXT,
                action TEXT NOT NULL,
                resource TEXT NOT NULL,
                details TEXT,
                success BOOLEAN NOT NULL DEFAULT 1,
                error_message TEXT
            )",
            [],
        )?;
        
        // Context storage table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS context_storage (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                context_type TEXT NOT NULL,
                data TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;
        
        // Plugin registry table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS plugins (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                version TEXT NOT NULL,
                manifest TEXT NOT NULL,
                enabled BOOLEAN NOT NULL DEFAULT 0,
                installed_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;
        
        // Create indexes
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp)",
            [],
        )?;
        
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id)",
            [],
        )?;
        
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_context_type ON context_storage(context_type)",
            [],
        )?;
        
        Ok(())
    }
    
    // Settings operations
    pub async fn get_setting(&self, key: &str) -> Result<Option<Setting>> {
        let conn = self.conn.lock().await;
        let mut stmt = conn.prepare(
            "SELECT key, value, updated_at FROM settings WHERE key = ?1"
        )?;
        
        let setting = stmt.query_row(params![key], |row| {
            Ok(Setting {
                key: row.get(0)?,
                value: serde_json::from_str(&row.get::<_, String>(1)?).unwrap_or(JsonValue::Null),
                updated_at: row.get(2)?,
            })
        }).optional()?;
        
        Ok(setting)
    }
    
    pub async fn set_setting(&self, key: &str, value: JsonValue) -> Result<()> {
        let conn = self.conn.lock().await;
        let value_str = serde_json::to_string(&value)?;
        
        conn.execute(
            "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?1, ?2, CURRENT_TIMESTAMP)",
            params![key, value_str],
        )?;
        
        Ok(())
    }
    
    pub async fn get_all_settings(&self) -> Result<Vec<Setting>> {
        let conn = self.conn.lock().await;
        let mut stmt = conn.prepare("SELECT key, value, updated_at FROM settings")?;
        
        let settings = stmt.query_map([], |row| {
            Ok(Setting {
                key: row.get(0)?,
                value: serde_json::from_str(&row.get::<_, String>(1)?).unwrap_or(JsonValue::Null),
                updated_at: row.get(2)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        
        Ok(settings)
    }
    
    // Audit log operations
    pub async fn log_action(&self, entry: AuditLogEntry) -> Result<()> {
        let conn = self.conn.lock().await;
        let details_str = serde_json::to_string(&entry.details)?;
        
        conn.execute(
            "INSERT INTO audit_log (user_id, action, resource, details, success, error_message) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                entry.user_id,
                entry.action,
                entry.resource,
                details_str,
                entry.success,
                entry.error_message
            ],
        )?;
        
        Ok(())
    }
    
    pub async fn get_audit_logs(&self, limit: Option<usize>) -> Result<Vec<AuditLogEntry>> {
        let conn = self.conn.lock().await;
        let query = if let Some(limit) = limit {
            format!("SELECT id, timestamp, user_id, action, resource, details, success, error_message 
                     FROM audit_log ORDER BY timestamp DESC LIMIT {}", limit)
        } else {
            "SELECT id, timestamp, user_id, action, resource, details, success, error_message 
             FROM audit_log ORDER BY timestamp DESC".to_string()
        };
        
        let mut stmt = conn.prepare(&query)?;
        
        let logs = stmt.query_map([], |row| {
            Ok(AuditLogEntry {
                id: row.get(0)?,
                timestamp: row.get(1)?,
                user_id: row.get(2)?,
                action: row.get(3)?,
                resource: row.get(4)?,
                details: serde_json::from_str(&row.get::<_, String>(5)?).unwrap_or(JsonValue::Null),
                success: row.get(6)?,
                error_message: row.get(7)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        
        Ok(logs)
    }
    
    // Context storage operations
    pub async fn save_context(&self, context: ChatContext) -> Result<()> {
        let conn = self.conn.lock().await;
        let data_str = serde_json::to_string(&context.data)?;
        
        conn.execute(
            "INSERT OR REPLACE INTO context_storage (id, name, context_type, data, updated_at) 
             VALUES (?1, ?2, ?3, ?4, CURRENT_TIMESTAMP)",
            params![context.id, context.name, context.context_type, data_str],
        )?;
        
        Ok(())
    }
    
    pub async fn get_context(&self, id: &str) -> Result<Option<ChatContext>> {
        let conn = self.conn.lock().await;
        let mut stmt = conn.prepare(
            "SELECT id, name, context_type, data, created_at, updated_at 
             FROM context_storage WHERE id = ?1"
        )?;
        
        let context = stmt.query_row(params![id], |row| {
            Ok(ChatContext {
                id: row.get(0)?,
                name: row.get(1)?,
                context_type: row.get(2)?,
                data: serde_json::from_str(&row.get::<_, String>(3)?).unwrap_or(JsonValue::Null),
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        }).optional()?;
        
        Ok(context)
    }
    
    pub async fn list_contexts(&self, context_type: Option<&str>) -> Result<Vec<ChatContext>> {
        let conn = self.conn.lock().await;
        
        let (query, has_param) = if context_type.is_some() {
            ("SELECT id, name, context_type, data, created_at, updated_at 
              FROM context_storage WHERE context_type = ?1 ORDER BY updated_at DESC", true)
        } else {
            ("SELECT id, name, context_type, data, created_at, updated_at 
              FROM context_storage ORDER BY updated_at DESC", false)
        };
        
        let mut stmt = conn.prepare(query)?;
        
        let contexts = if has_param {
            stmt.query_map(params![context_type], |row| {
                Ok(ChatContext {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    context_type: row.get(2)?,
                    data: serde_json::from_str(&row.get::<_, String>(3)?).unwrap_or(JsonValue::Null),
                    created_at: row.get(4)?,
                    updated_at: row.get(5)?,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?
        } else {
            stmt.query_map([], |row| {
                Ok(ChatContext {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    context_type: row.get(2)?,
                    data: serde_json::from_str(&row.get::<_, String>(3)?).unwrap_or(JsonValue::Null),
                    created_at: row.get(4)?,
                    updated_at: row.get(5)?,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?
        };
        
        Ok(contexts)
    }
    
    pub async fn delete_context(&self, id: &str) -> Result<()> {
        let conn = self.conn.lock().await;
        conn.execute("DELETE FROM context_storage WHERE id = ?1", params![id])?;
        Ok(())
    }
    
    // Cleanup operations
    pub async fn cleanup_old_audit_logs(&self, days_to_keep: i64) -> Result<usize> {
        let conn = self.conn.lock().await;
        let cutoff_date = Utc::now() - chrono::Duration::days(days_to_keep);
        let cutoff_date_str = cutoff_date.format("%Y-%m-%d %H:%M:%S").to_string();
        
        let deleted = conn.execute(
            "DELETE FROM audit_log WHERE timestamp < ?1",
            params![cutoff_date_str],
        )?;
        
        Ok(deleted)
    }
}

// Global database instance
use once_cell::sync::Lazy;

static DATABASE: Lazy<Arc<Mutex<Option<Database>>>> = Lazy::new(|| Arc::new(Mutex::new(None)));

pub async fn initialize_database(app_data_dir: PathBuf) -> Result<()> {
    let db = Database::new(app_data_dir).await?;
    let mut database = DATABASE.lock().await;
    *database = Some(db);
    Ok(())
}

pub async fn with_database<F, R>(f: F) -> Result<R>
where
    F: FnOnce(&Database) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<R>> + Send + '_>>,
{
    let database = DATABASE.lock().await;
    match database.as_ref() {
        Some(db) => f(db).await,
        None => Err(anyhow!("Database not initialized")),
    }
}