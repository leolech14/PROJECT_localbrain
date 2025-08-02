use git2::{Repository, StatusOptions, Status};
use std::path::{Path, PathBuf};
use anyhow::{Result, anyhow};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GitFileStatus {
    pub path: String,
    pub status: String,
    pub staged: bool,
    pub modified: bool,
    pub deleted: bool,
    pub new: bool,
    pub renamed: bool,
    pub type_changed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GitRepositoryInfo {
    pub path: String,
    pub current_branch: Option<String>,
    pub is_dirty: bool,
    pub ahead: usize,
    pub behind: usize,
}

pub struct GitManager {
    repos: HashMap<PathBuf, Repository>,
}

impl GitManager {
    pub fn new() -> Self {
        Self {
            repos: HashMap::new(),
        }
    }
    
    pub fn get_repository(&mut self, path: &Path) -> Result<&Repository> {
        // Find the git repository for this path
        let repo_path = self.find_repository_path(path)?;
        
        // Check if we already have this repo open
        if !self.repos.contains_key(&repo_path) {
            let repo = Repository::open(&repo_path)?;
            self.repos.insert(repo_path.clone(), repo);
        }
        
        self.repos.get(&repo_path)
            .ok_or_else(|| anyhow!("Failed to get repository"))
    }
    
    fn find_repository_path(&self, path: &Path) -> Result<PathBuf> {
        let mut current = path;
        
        loop {
            let git_path = current.join(".git");
            if git_path.exists() {
                return Ok(current.to_path_buf());
            }
            
            match current.parent() {
                Some(parent) => current = parent,
                None => return Err(anyhow!("No git repository found")),
            }
        }
    }
    
    pub fn get_file_status(&mut self, file_path: &Path) -> Result<Option<GitFileStatus>> {
        let repo = self.get_repository(file_path)?;
        let repo_path = repo.workdir().ok_or_else(|| anyhow!("No workdir"))?;
        
        // Get relative path
        let relative_path = file_path.strip_prefix(repo_path)?;
        
        let mut opts = StatusOptions::new();
        opts.include_untracked(true);
        opts.include_ignored(false);
        
        let statuses = repo.statuses(Some(&mut opts))?;
        
        for entry in statuses.iter() {
            if let Some(path) = entry.path() {
                if Path::new(path) == relative_path {
                    let status = entry.status();
                    return Ok(Some(GitFileStatus {
                        path: path.to_string(),
                        status: format_status(status),
                        staged: status.contains(Status::INDEX_NEW) || 
                               status.contains(Status::INDEX_MODIFIED) ||
                               status.contains(Status::INDEX_DELETED),
                        modified: status.contains(Status::WT_MODIFIED),
                        deleted: status.contains(Status::WT_DELETED) || status.contains(Status::INDEX_DELETED),
                        new: status.contains(Status::WT_NEW),
                        renamed: status.contains(Status::WT_RENAMED) || status.contains(Status::INDEX_RENAMED),
                        type_changed: status.contains(Status::WT_TYPECHANGE) || status.contains(Status::INDEX_TYPECHANGE),
                    }));
                }
            }
        }
        
        Ok(None)
    }
    
    pub fn get_repository_info(&mut self, path: &Path) -> Result<GitRepositoryInfo> {
        let repo = self.get_repository(path)?;
        let repo_path = repo.workdir()
            .ok_or_else(|| anyhow!("No workdir"))?
            .to_string_lossy()
            .to_string();
        
        // Get current branch
        let head = repo.head()?;
        let current_branch = head.shorthand().map(|s| s.to_string());
        
        // Check if dirty
        let mut opts = StatusOptions::new();
        opts.include_untracked(true);
        let statuses = repo.statuses(Some(&mut opts))?;
        let is_dirty = !statuses.is_empty();
        
        // Get ahead/behind counts
        let (ahead, behind) = if let Some(branch_name) = &current_branch {
            match repo.find_branch(branch_name, git2::BranchType::Local) {
                Ok(branch) => {
                    if let Ok(upstream) = branch.upstream() {
                        let local_oid = branch.get().target()
                            .ok_or_else(|| anyhow!("Failed to get local branch target"))?;
                        let upstream_oid = upstream.get().target()
                            .ok_or_else(|| anyhow!("Failed to get upstream branch target"))?;
                        
                        match repo.graph_ahead_behind(local_oid, upstream_oid) {
                            Ok(counts) => counts,
                            Err(_) => (0, 0),
                        }
                    } else {
                        (0, 0)
                    }
                }
                Err(_) => (0, 0),
            }
        } else {
            (0, 0)
        };
        
        Ok(GitRepositoryInfo {
            path: repo_path,
            current_branch,
            is_dirty,
            ahead,
            behind,
        })
    }
    
    pub fn get_directory_status(&mut self, dir_path: &Path) -> Result<Vec<GitFileStatus>> {
        let repo = self.get_repository(dir_path)?;
        let repo_path = repo.workdir().ok_or_else(|| anyhow!("No workdir"))?;
        
        let mut opts = StatusOptions::new();
        opts.include_untracked(true);
        opts.include_ignored(false);
        
        let statuses = repo.statuses(Some(&mut opts))?;
        let mut results = Vec::new();
        
        for entry in statuses.iter() {
            if let Some(path) = entry.path() {
                let full_path = repo_path.join(path);
                
                // Check if this file is under the requested directory
                if full_path.starts_with(dir_path) {
                    let status = entry.status();
                    results.push(GitFileStatus {
                        path: path.to_string(),
                        status: format_status(status),
                        staged: status.contains(Status::INDEX_NEW) || 
                               status.contains(Status::INDEX_MODIFIED) ||
                               status.contains(Status::INDEX_DELETED),
                        modified: status.contains(Status::WT_MODIFIED),
                        deleted: status.contains(Status::WT_DELETED) || status.contains(Status::INDEX_DELETED),
                        new: status.contains(Status::WT_NEW),
                        renamed: status.contains(Status::WT_RENAMED) || status.contains(Status::INDEX_RENAMED),
                        type_changed: status.contains(Status::WT_TYPECHANGE) || status.contains(Status::INDEX_TYPECHANGE),
                    });
                }
            }
        }
        
        Ok(results)
    }
}

fn format_status(status: Status) -> String {
    let mut parts = Vec::new();
    
    if status.contains(Status::INDEX_NEW) { parts.push("new"); }
    if status.contains(Status::INDEX_MODIFIED) { parts.push("modified"); }
    if status.contains(Status::INDEX_DELETED) { parts.push("deleted"); }
    if status.contains(Status::INDEX_RENAMED) { parts.push("renamed"); }
    if status.contains(Status::INDEX_TYPECHANGE) { parts.push("typechange"); }
    
    if status.contains(Status::WT_NEW) { parts.push("untracked"); }
    if status.contains(Status::WT_MODIFIED) { parts.push("modified"); }
    if status.contains(Status::WT_DELETED) { parts.push("deleted"); }
    if status.contains(Status::WT_RENAMED) { parts.push("renamed"); }
    if status.contains(Status::WT_TYPECHANGE) { parts.push("typechange"); }
    
    if status.contains(Status::CONFLICTED) { parts.push("conflict"); }
    
    if parts.is_empty() {
        "clean".to_string()
    } else {
        parts.join(",")
    }
}

// Global git manager
use once_cell::sync::Lazy;
use std::sync::Mutex;

static GIT_MANAGER: Lazy<Mutex<GitManager>> = Lazy::new(|| Mutex::new(GitManager::new()));

pub fn with_git_manager<F, R>(f: F) -> Result<R>
where
    F: FnOnce(&mut GitManager) -> Result<R>,
{
    let mut manager = GIT_MANAGER.lock().map_err(|e| anyhow!("Failed to lock git manager: {}", e))?;
    f(&mut manager)
}