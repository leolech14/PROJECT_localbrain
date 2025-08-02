use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use std::path::{Path, PathBuf};
use chrono::{DateTime, Utc};
use std::fs;
use std::io::Read;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ItemType {
    Folder,
    Document,
    Image,
    Video,
    Audio,
    Dataset,
    Model,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KnowledgeItem {
    pub id: String,
    pub name: String,
    #[serde(rename = "type")]
    pub item_type: ItemType,
    pub size: u64,
    pub modified: DateTime<Utc>,
    pub author: String,
    pub tags: Vec<String>,
    pub description: Option<String>,
    pub vectorized: bool,
    pub embedding_count: Option<u32>,
    pub private: bool,
    pub starred: bool,
    pub path: PathBuf,
    pub children: Option<Vec<KnowledgeItem>>,
    pub content: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StorageInfo {
    pub used_bytes: u64,
    pub total_bytes: u64,
    pub percentage: f32,
}

pub struct KnowledgeManager {
    knowledge_dir: PathBuf,
    items_cache: Arc<RwLock<HashMap<String, KnowledgeItem>>>,
    vectorized_items: Arc<RwLock<HashMap<String, Vec<f32>>>>, // Simple embedding storage
}

impl KnowledgeManager {
    pub fn new(knowledge_dir: PathBuf) -> Result<Self> {
        // Create knowledge directory if it doesn't exist
        std::fs::create_dir_all(&knowledge_dir)?;
        
        // Create default folders
        let default_folders = vec![
            "documents",
            "images",
            "videos",
            "audio",
            "datasets",
            "models",
        ];
        
        for folder in default_folders {
            let folder_path = knowledge_dir.join(folder);
            std::fs::create_dir_all(&folder_path)?;
        }
        
        Ok(Self {
            knowledge_dir,
            items_cache: Arc::new(RwLock::new(HashMap::new())),
            vectorized_items: Arc::new(RwLock::new(HashMap::new())),
        })
    }
    
    pub async fn scan_directory(&self, path: &Path) -> Result<Vec<KnowledgeItem>> {
        let mut items = Vec::new();
        
        let entries = fs::read_dir(path)?;
        for entry in entries {
            let entry = entry?;
            let metadata = entry.metadata()?;
            let file_path = entry.path();
            
            if file_path.file_name().map(|n| n.to_string_lossy().starts_with('.')).unwrap_or(false) {
                continue; // Skip hidden files
            }
            
            let item_type = if metadata.is_dir() {
                ItemType::Folder
            } else {
                Self::determine_file_type(&file_path)
            };
            
            let modified = metadata.modified()
                .map(|t| DateTime::<Utc>::from(t))
                .unwrap_or_else(|_| Utc::now());
            
            let mut item = KnowledgeItem {
                id: uuid::Uuid::new_v4().to_string(),
                name: file_path.file_name()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .to_string(),
                item_type: item_type.clone(),
                size: metadata.len(),
                modified,
                author: "System".to_string(),
                tags: Self::auto_tag(&file_path, &item_type),
                description: None,
                vectorized: false,
                embedding_count: None,
                private: false,
                starred: false,
                path: file_path.clone(),
                children: None,
                content: None,
            };
            
            // Recursively scan subdirectories
            if metadata.is_dir() {
                item.children = Some(Box::pin(self.scan_directory(&file_path)).await?);
            }
            
            // Cache the item
            let mut cache = self.items_cache.write().await;
            cache.insert(item.id.clone(), item.clone());
            
            items.push(item);
        }
        
        items.sort_by(|a, b| a.name.cmp(&b.name));
        Ok(items)
    }
    
    fn determine_file_type(path: &Path) -> ItemType {
        let extension = path.extension()
            .and_then(|e| e.to_str())
            .unwrap_or("")
            .to_lowercase();
        
        match extension.as_str() {
            "txt" | "md" | "pdf" | "doc" | "docx" => ItemType::Document,
            "jpg" | "jpeg" | "png" | "gif" | "svg" | "webp" => ItemType::Image,
            "mp4" | "avi" | "mov" | "mkv" | "webm" => ItemType::Video,
            "mp3" | "wav" | "flac" | "ogg" | "m4a" => ItemType::Audio,
            "csv" | "json" | "xml" | "parquet" => ItemType::Dataset,
            "onnx" | "pt" | "pth" | "h5" | "pb" => ItemType::Model,
            _ => ItemType::Document,
        }
    }
    
    fn auto_tag(path: &Path, item_type: &ItemType) -> Vec<String> {
        let mut tags = vec![format!("{:?}", item_type).to_lowercase()];
        
        if let Some(extension) = path.extension().and_then(|e| e.to_str()) {
            tags.push(extension.to_lowercase());
        }
        
        // Add content-based tags
        match item_type {
            ItemType::Model => {
                if path.to_string_lossy().contains("sentiment") {
                    tags.push("nlp".to_string());
                    tags.push("sentiment".to_string());
                } else if path.to_string_lossy().contains("object") {
                    tags.push("computer-vision".to_string());
                }
            }
            ItemType::Document => {
                if path.to_string_lossy().contains("api") {
                    tags.push("api".to_string());
                    tags.push("reference".to_string());
                } else if path.to_string_lossy().contains("architecture") {
                    tags.push("architecture".to_string());
                    tags.push("technical".to_string());
                }
            }
            _ => {}
        }
        
        tags
    }
    
    pub async fn get_items(&self) -> Result<Vec<KnowledgeItem>> {
        self.scan_directory(&self.knowledge_dir).await
    }
    
    pub async fn get_item(&self, item_id: &str) -> Option<KnowledgeItem> {
        let cache = self.items_cache.read().await;
        cache.get(item_id).cloned()
    }
    
    pub async fn read_item_content(&self, item_id: &str) -> Result<String> {
        let cache = self.items_cache.read().await;
        let item = cache.get(item_id)
            .ok_or_else(|| anyhow!("Item not found"))?;
        
        match item.item_type {
            ItemType::Document => {
                let mut file = fs::File::open(&item.path)?;
                let mut content = String::new();
                file.read_to_string(&mut content)?;
                Ok(content)
            }
            _ => Err(anyhow!("Cannot read content for this item type")),
        }
    }
    
    pub async fn create_folder(&self, parent_path: Option<&Path>, name: &str) -> Result<KnowledgeItem> {
        let folder_path = if let Some(parent) = parent_path {
            parent.join(name)
        } else {
            self.knowledge_dir.join(name)
        };
        
        if folder_path.exists() {
            return Err(anyhow!("Folder already exists"));
        }
        
        fs::create_dir_all(&folder_path)?;
        
        let item = KnowledgeItem {
            id: uuid::Uuid::new_v4().to_string(),
            name: name.to_string(),
            item_type: ItemType::Folder,
            size: 0,
            modified: Utc::now(),
            author: "User".to_string(),
            tags: vec!["folder".to_string()],
            description: None,
            vectorized: false,
            embedding_count: None,
            private: false,
            starred: false,
            path: folder_path,
            children: Some(Vec::new()),
            content: None,
        };
        
        let mut cache = self.items_cache.write().await;
        cache.insert(item.id.clone(), item.clone());
        
        Ok(item)
    }
    
    pub async fn upload_file(&self, parent_path: Option<&Path>, file_name: &str, content: Vec<u8>) -> Result<KnowledgeItem> {
        let file_path = if let Some(parent) = parent_path {
            parent.join(file_name)
        } else {
            self.knowledge_dir.join(file_name)
        };
        
        fs::write(&file_path, &content)?;
        
        let metadata = fs::metadata(&file_path)?;
        let item_type = Self::determine_file_type(&file_path);
        
        let item = KnowledgeItem {
            id: uuid::Uuid::new_v4().to_string(),
            name: file_name.to_string(),
            item_type: item_type.clone(),
            size: metadata.len(),
            modified: Utc::now(),
            author: "User".to_string(),
            tags: Self::auto_tag(&file_path, &item_type),
            description: None,
            vectorized: false,
            embedding_count: None,
            private: false,
            starred: false,
            path: file_path,
            children: None,
            content: None,
        };
        
        let mut cache = self.items_cache.write().await;
        cache.insert(item.id.clone(), item.clone());
        
        Ok(item)
    }
    
    pub async fn delete_item(&self, item_id: &str) -> Result<()> {
        let mut cache = self.items_cache.write().await;
        let item = cache.remove(item_id)
            .ok_or_else(|| anyhow!("Item not found"))?;
        
        if item.path.exists() {
            if item.path.is_dir() {
                fs::remove_dir_all(&item.path)?;
            } else {
                fs::remove_file(&item.path)?;
            }
        }
        
        Ok(())
    }
    
    pub async fn update_item_tags(&self, item_id: &str, tags: Vec<String>) -> Result<()> {
        let mut cache = self.items_cache.write().await;
        let item = cache.get_mut(item_id)
            .ok_or_else(|| anyhow!("Item not found"))?;
        
        item.tags = tags;
        Ok(())
    }
    
    pub async fn toggle_star(&self, item_id: &str) -> Result<bool> {
        let mut cache = self.items_cache.write().await;
        let item = cache.get_mut(item_id)
            .ok_or_else(|| anyhow!("Item not found"))?;
        
        item.starred = !item.starred;
        Ok(item.starred)
    }
    
    pub async fn toggle_private(&self, item_id: &str) -> Result<bool> {
        let mut cache = self.items_cache.write().await;
        let item = cache.get_mut(item_id)
            .ok_or_else(|| anyhow!("Item not found"))?;
        
        item.private = !item.private;
        Ok(item.private)
    }
    
    pub async fn vectorize_item(&self, item_id: &str) -> Result<()> {
        let cache = self.items_cache.read().await;
        let item = cache.get(item_id)
            .ok_or_else(|| anyhow!("Item not found"))?;
        
        if !matches!(item.item_type, ItemType::Document | ItemType::Dataset) {
            return Err(anyhow!("Can only vectorize documents and datasets"));
        }
        
        // In a real implementation, this would use an embedding model
        // For now, we'll create mock embeddings
        let mock_embeddings: Vec<f32> = (0..768).map(|i| (i as f32 * 0.1).sin()).collect();
        
        let mut vectorized = self.vectorized_items.write().await;
        vectorized.insert(item_id.to_string(), mock_embeddings);
        
        drop(cache);
        let mut cache = self.items_cache.write().await;
        if let Some(item) = cache.get_mut(item_id) {
            item.vectorized = true;
            item.embedding_count = Some(42); // Mock embedding count
        }
        
        Ok(())
    }
    
    pub async fn search_similar(&self, item_id: &str, limit: usize) -> Result<Vec<(String, f32)>> {
        let vectorized = self.vectorized_items.read().await;
        let query_embedding = vectorized.get(item_id)
            .ok_or_else(|| anyhow!("Item not vectorized"))?;
        
        // Simple cosine similarity search
        let mut similarities: Vec<(String, f32)> = Vec::new();
        
        for (other_id, other_embedding) in vectorized.iter() {
            if other_id == item_id {
                continue;
            }
            
            let similarity = Self::cosine_similarity(query_embedding, other_embedding);
            similarities.push((other_id.clone(), similarity));
        }
        
        similarities.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
        similarities.truncate(limit);
        
        Ok(similarities)
    }
    
    fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
        let dot_product: f32 = a.iter().zip(b.iter()).map(|(x, y)| x * y).sum();
        let norm_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
        let norm_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();
        
        if norm_a == 0.0 || norm_b == 0.0 {
            0.0
        } else {
            dot_product / (norm_a * norm_b)
        }
    }
    
    pub async fn get_storage_info(&self) -> Result<StorageInfo> {
        let mut total_size = 0u64;
        
        for entry in walkdir::WalkDir::new(&self.knowledge_dir).into_iter().filter_map(|e| e.ok()) {
            if let Ok(metadata) = entry.metadata() {
                if metadata.is_file() {
                    total_size += metadata.len();
                }
            }
        }
        
        // Mock 10GB total storage
        let total_bytes = 10 * 1024 * 1024 * 1024;
        let percentage = (total_size as f32 / total_bytes as f32) * 100.0;
        
        Ok(StorageInfo {
            used_bytes: total_size,
            total_bytes,
            percentage,
        })
    }
}

// Global knowledge manager instance
use once_cell::sync::Lazy;

static KNOWLEDGE_MANAGER: Lazy<Arc<tokio::sync::Mutex<Option<KnowledgeManager>>>> = 
    Lazy::new(|| Arc::new(tokio::sync::Mutex::new(None)));

pub async fn initialize_knowledge_manager(knowledge_dir: PathBuf) -> Result<()> {
    let manager = KnowledgeManager::new(knowledge_dir)?;
    *KNOWLEDGE_MANAGER.lock().await = Some(manager);
    Ok(())
}

pub async fn with_knowledge_manager<F, R>(f: F) -> Result<R>
where
    F: FnOnce(&KnowledgeManager) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<R>> + Send + '_>>,
{
    let guard = KNOWLEDGE_MANAGER.lock().await;
    match guard.as_ref() {
        Some(manager) => f(manager).await,
        None => Err(anyhow!("Knowledge manager not initialized")),
    }
}