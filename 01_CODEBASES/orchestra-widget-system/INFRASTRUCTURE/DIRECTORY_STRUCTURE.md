# LocalBrain v2.0 Directory Structure Architecture

## 📁 **Root Directory Structure**

```
~/.localbrain-v2/                    # Main LocalBrain data directory
├── 📂 active-projects/              # Current workspaces
│   ├── 📁 project-{uuid}/           # Individual project folders
│   │   ├── 📁 contexts/             # RAG contexts for this project
│   │   ├── 📁 documents/            # Project documents and files
│   │   ├── 📁 code/                 # Generated and modified code
│   │   ├── 📁 conversations/        # Chat history and sessions
│   │   ├── 📁 widgets/              # Widget layouts and configurations
│   │   ├── 📁 assets/               # Images, diagrams, media
│   │   ├── 📁 metadata/             # Project metadata and settings
│   │   └── 📄 project.json          # Project configuration file
│   └── 📄 projects-index.json       # Global project registry
│
├── 📂 knowledge-base/               # Cross-project knowledge
│   ├── 📁 rag-vectors/              # Vector embeddings
│   │   ├── 📄 metadata.db           # Vector metadata
│   │   ├── 📁 embeddings/           # Stored vector files
│   │   └── 📁 indices/               # Search indices
│   ├── 📁 document-store/           # Processed documents
│   │   ├── 📁 processed/            # Granite-Docling processed files
│   │   ├── 📁 raw/                  # Original documents
│   │   └── 📁 chunks/               # Document chunks for RAG
│   ├── 📁 context-pool/             # Shared contexts
│   │   ├── 📁 ai-conversations/     # AI chat contexts
│   │   ├── 📁 file-contexts/        # File analysis contexts
│   │   ├── 📁 web-contexts/         # Browser contexts
│   │   └── 📁 system-contexts/       # System state contexts
│   └── 📁 ontology/                 # Knowledge relationships
│       ├── 📄 entities.json          # Named entities
│       ├── 📄 relationships.json     # Entity relationships
│       └── 📄 concepts.json          # Domain concepts
│
├── 📂 databases/                     # Persistent databases
│   ├── 🗄️ localbrain.sqlite        # Main SQLite database
│   ├── 🗄️ conversations.db         # Chat history database
│   ├── 🗄️ metrics.db               # Usage metrics database
│   ├── 🗄️ context-index.db         # Context search index
│   └── 🗄️ user-preferences.db      # User settings database
│
├── 📂 agent-memory/                  # Agent state and memory
│   ├── 📁 the-queen/                # Agent orchestration state
│   ├── 📁 ai-providers/             # AI provider states
│   ├── 📁 context-gatherer/         # Context collection state
│   └── 📁 task-executor/            # Task execution history
│
├── 📂 configuration/                 # System configuration
│   ├── 📄 ai-providers.json         # AI provider configurations
│   ├── 📄 widget-layouts.json       # Saved widget layouts
│   ├── 📄 voice-profiles.json       # Voice recognition profiles
│   └── 📄 system-settings.json      # Global system settings
│
├── 📂 cache/                         # Temporary storage
│   ├── 📁 api-responses/            # Cached API responses
│   ├── 📁 file-previews/            # Generated file previews
│   ├── 📁 voice-transcripts/        # Voice recognition cache
│   └── 📁 search-indexes/            # Temporary search indexes
│
├── 📂 logs/                          # System logs
│   ├── 📄 conversations.log          # Chat conversation logs
│   ├── 📄 system.log                # System operation logs
│   ├── 📄 errors.log                # Error logs
│   └── 📄 performance.log           # Performance metrics logs
│
├── 📄 backup/                        # System backups
│   ├── 📁 daily/                    # Daily backups
│   ├── 📁 weekly/                   # Weekly backups
│   └── 📁 monthly/                  # Monthly backups
│
└── 📄 localbrain-config.json        # Main configuration file
```

## 🏗️ **Project Directory Structure (Expanded)**

Each project in `active-projects/project-{uuid}/` follows this structure:

```
project-{uuid}/
├── 📁 contexts/                      # RAG contexts
│   ├── 📁 ai-conversations/          # Chat history contexts
│   │   ├── 📄 session-{id}.json      # Individual chat sessions
│   │   └── 📄 context-summary.json   # Session summaries
│   ├── 📁 file-analysis/             # File context analysis
│   │   ├── 📄 {filename}.json       # Individual file analysis
│   │   └── 📄 file-index.json        # File content index
│   ├── 📁 code-contexts/             # Code analysis contexts
│   │   ├── 📄 functions.json         # Function definitions
│   │   ├── 📄 classes.json           # Class definitions
│   │   └── 📄 dependencies.json      # Dependency analysis
│   └── 📁 research-contexts/          # Research and web contexts
│       ├── 📄 sources.json           # Source references
│       └── 📄 findings.json          # Research findings
│
├── 📁 documents/                     # Project documents
│   ├── 📁 sources/                   # Original source files
│   ├── 📁 processed/                 # Processed by Granite-Docling
│   │   ├── 📄 {filename}.structured.json  # Structured content
│   │   ├── 📄 {filename}.chunks.jsonl     # Text chunks
│   │   └── 📄 {filename}.embeddings.json  # Vector embeddings
│   └── 📁 exports/                   # Generated exports
│       ├── 📄 summary.md             # Document summaries
│       └── 📄 key-points.json        # Key extraction results
│
├── 📁 code/                          # Generated and modified code
│   ├── 📁 generated/                 # AI-generated code
│   │   ├── 📄 {filename}.swift       # Generated Swift code
│   │   ├── 📄 {filename}.py          # Generated Python code
│   │   └── 📄 {filename}.js          # Generated JavaScript code
│   ├── 📁 modified/                  # Modified existing code
│   │   ├── 📄 {filename}.swift.diff  # Code modifications
│   │   └── 📄 {filename}.py.diff     # Python modifications
│   └── 📄 code-index.json             # Code structure index
│
├── 📁 conversations/                 # Chat sessions
│   ├── 📄 session-{id}.json          # Complete session data
│   ├── 📄 session-{id}-summary.json   # Session summary
│   └── 📄 conversations-index.json    # Session index
│
├── 📁 widgets/                       # Widget configurations
│   ├── 📄 layout.json                # Widget layout configuration
│   ├── 📄 widget-states.json         # Widget state snapshots
│   └── 📁 custom-widgets/            # Custom widget definitions
│
├── 📁 assets/                        # Media and resources
│   ├── 📁 images/                    # Images and diagrams
│   ├── 📁 audio/                     # Audio files
│   ├── 📁 video/                     # Video files
│   └── 📁 documents/                 # PDF, docs, etc.
│
├── 📁 metadata/                      # Project metadata
│   ├── 📄 tags.json                  # Project tags
│   ├── 📄 milestones.json            # Project milestones
│   └── 📄 notes.json                 # Project notes
│
└── 📄 project.json                   # Main project configuration
    {
      "id": "uuid",
      "name": "Project Name",
      "type": "software-development",
      "created_at": "2025-10-06T...",
      "last_modified": "2025-10-06T...",
      "status": "active",
      "context_sources": ["documents", "code", "conversations"],
      "ai_providers": ["claude", "gpt-4", "gemini"],
      "widget_layout": "grid-default",
      "tags": ["swift", "ios", "ai"],
      "description": "Project description",
      "goals": ["Build MVP", "Launch product"],
      "settings": {
        "auto_context": true,
        "voice_enabled": true,
        "code_generation": true
      }
    }
```

## 🗄️ **Database Schema Architecture**

### **Main SQLite Database (localbrain.sqlite)**

```sql
-- Projects table
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    directory_path TEXT NOT NULL,
    metadata TEXT, -- JSON metadata
    settings TEXT  -- JSON settings
);

-- Context sources table
CREATE TABLE context_sources (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'document', 'conversation', 'code', 'web'
    source_path TEXT NOT NULL,
    processed_at DATETIME,
    vector_count INTEGER DEFAULT 0,
    metadata TEXT, -- JSON metadata
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- RAG chunks table
CREATE TABLE rag_chunks (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding_id TEXT, -- Reference to vector file
    metadata TEXT, -- JSON metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES context_sources(id)
);

-- Vector references table
CREATE TABLE vector_references (
    id TEXT PRIMARY KEY,
    chunk_id TEXT NOT NULL,
    vector_file_path TEXT NOT NULL,
    model_used TEXT NOT NULL, -- 'text-embedding-ada-002', etc.
    dimension_count INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chunk_id) REFERENCES rag_chunks(id)
);

-- Conversations table
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_message_at DATETIME,
    message_count INTEGER DEFAULT 0,
    metadata TEXT, -- JSON metadata
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Messages table
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT, -- JSON metadata
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

-- AI providers table
CREATE TABLE ai_providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'anthropic', 'openai', 'google'
    api_endpoint TEXT,
    model_name TEXT,
    is_active BOOLEAN DEFAULT 1,
    rate_limit INTEGER,
    cost_per_token REAL,
    metadata TEXT -- JSON metadata
);

-- Usage metrics table
CREATE TABLE usage_metrics (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL,
    project_id TEXT,
    conversation_id TEXT,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    cost REAL DEFAULT 0.0,
    response_time_ms INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES ai_providers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

## 📊 **Vector Store Architecture**

### **Vector Storage Strategy**

```
~/.localbrain-v2/knowledge-base/rag-vectors/
├── 📄 metadata.db                    # SQLite vector metadata
├── 📁 embeddings/                    # Stored vector files
│   ├── 📄 {chunk_id}.bin            # Binary vector data
│   ├── 📄 {chunk_id}.metadata.json # Vector metadata
│   └── 📄 {model_id}/               # Model-specific directories
│       ├── 📄 text-embedding-ada-002/
│       ├── 📄 sentence-transformers/
│       └── 📄 granite-embedding-v1/
├── 📁 indices/                       # Search indices
│   ├── 📄 faiss_index.idx          # FAISS index file
│   ├── 📄 hnsw_index.pkl           # HNSW index file
│   └── 📄 ivf_index.bin            # IVF index file
└── 📄 vector_config.json            # Vector store configuration
```

### **Vector Metadata Structure**

```json
{
  "id": "chunk-uuid",
  "source_id": "source-uuid",
  "chunk_index": 0,
  "content_hash": "sha256-hash",
  "vector_file": "embeddings/text-embedding-ada-002/chunk-uuid.bin",
  "model_used": "text-embedding-ada-002",
  "dimensions": 1536,
  "created_at": "2025-10-06T...",
  "metadata": {
    "source_type": "document",
    "file_path": "/path/to/document.pdf",
    "page_number": 1,
    "section": "introduction",
    "tokens": 256,
    "language": "en"
  }
}
```

## 🔍 **Context Management System**

### **Context Pool Structure**

```
~/.localbrain-v2/knowledge-base/context-pool/
├── 📁 ai-conversations/              # Chat conversation contexts
│   ├── 📄 {session_id}.context.json
│   ├── 📄 {session_id}.summary.json
│   └── 📄 active-sessions.json
├── 📁 file-contexts/                 # File analysis contexts
│   ├── 📁 {file_hash}/              # File-specific context
│   │   ├── 📄 analysis.json         # File analysis results
│   │   ├── 📄 metadata.json         # File metadata
│   │   └── 📄 relationships.json     # File relationships
│   └── 📄 file-index.json            # Global file index
├── 📁 web-contexts/                  # Web browsing contexts
│   ├── 📄 {session_id}.context.json
│   ├── 📄 {session_id}.pages.json
│   └── 📄 {session_id}.summary.json
└── 📁 system-contexts/               # System state contexts
    ├── 📄 system-state.json
    ├── 📄 performance-context.json
    └── 📄 error-context.json
```

## 🎯 **Usage Guidelines**

### **Project Creation Workflow**

1. **Generate UUID**: Create unique project identifier
2. **Create Directory Structure**: Set up all necessary directories
3. **Initialize Database**: Create project entries in SQLite
4. **Configure Settings**: Set default project configuration
5. **Create Context Sources**: Initialize context tracking
6. **Set Up Vector Store**: Prepare vector storage for RAG

### **Data Management Principles**

1. **Immutable Chunks**: Never modify existing chunks, create new ones
2. **Version Control**: Keep track of document and context versions
3. **Backup Strategy**: Regular backups of critical data
4. **Privacy First**: Encrypt sensitive data at rest
5. **Performance**: Use appropriate indexing for fast queries

### **Scalability Considerations**

1. **Chunking Strategy**: Optimal chunk size for embedding models
2. **Indexing Strategy**: Choose appropriate vector index type
3. **Storage Optimization**: Compress vector data where possible
4. **Query Optimization**: Use efficient similarity search algorithms
5. **Memory Management**: Limit in-memory vector storage

---

This architecture provides a comprehensive foundation for storing and managing all of LocalBrain's data, from individual conversations to large-scale RAG systems. The structure is designed to be scalable, performant, and maintainable while supporting the advanced AI capabilities of LocalBrain v2.0.