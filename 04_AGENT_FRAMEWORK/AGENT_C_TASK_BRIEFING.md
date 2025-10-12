# 🎯 AGENT C (GLM-4.6) - Task Briefing
## Backend Specialist - Assigned Tasks via MCP

**Agent**: C (Backend Specialist - GLM-4.6 200K context)
**Project**: LocalBrain - Central Intelligence
**Coordinator**: Agent D (Integration Specialist - Sonnet 4.5)
**Status**: READY FOR ORDERS

---

## 📋 YOUR ASSIGNED TASKS (Pick One)

### **Option 1: T010 - Universal Task Registry (Cloud Version)**

**Priority**: P0-CRITICAL
**Estimated**: 5 hours
**Dependencies**: T007 ✅ (DB Migration complete)

**What You're Building**: Cloud-native multi-project task registry

**Deliverables**:
1. UniversalTaskRegistry class (cloud version)
2. Multi-project task storage and queries
3. Project-scoped task operations
4. Task templates by project type
5. Auto-task discovery from files

**Location**: `src/core/UniversalTaskRegistry.ts`

**Key Features**:
```typescript
class UniversalTaskRegistry {
  // Multi-project task management
  async getTasksByProject(projectId: string): Promise<Task[]>
  async createTask(task: Task, projectId: string): Promise<Task>

  // Cross-project queries (when appropriate)
  async searchTasksAcrossProjects(query: string): Promise<Task[]>

  // Task templates
  async applyTemplate(projectId: string, templateType: string): Promise<Task[]>

  // Auto-discovery from CENTRAL_TASK_REGISTRY.md files
  async discoverTasksFromFile(filePath: string, projectId: string): Promise<Task[]>
}
```

---

### **Option 2: T011 - Context Manager (Cloud Storage)**

**Priority**: P0-CRITICAL
**Estimated**: 6 hours
**Dependencies**: T002 ✅ (ContextExtractor complete)

**What You're Building**: Cloud storage manager for context files

**Deliverables**:
1. ContextManager class with cloud storage
2. S3/GCS upload implementation
3. Context retrieval API
4. Search functionality
5. Integration with DiscoveryEngine

**Location**: `src/core/ContextManager.ts`

**Key Features**:
```typescript
class ContextManager {
  // Cloud storage operations
  async uploadToCloud(files: ContextFile[], projectId: string): Promise<void>
  async downloadFromCloud(projectId: string, fileId: string): Promise<Buffer>

  // Intelligent retrieval
  async getContextForAgent(agentId: string, taskId: string): Promise<ContextFile[]>

  // Search
  async searchContext(projectId: string, query: string): Promise<ContextFile[]>

  // Optimization
  async optimizeContextForModel(modelId: string, files: ContextFile[]): Promise<ContextFile[]>
}
```

**Cloud Integration**:
- Use `@aws-sdk/client-s3` for S3
- OR use local file storage for now (prepare for cloud)
- Implement caching layer (Redis future)

---

### **Option 3: T018 - RAG Index for Specifications**

**Priority**: P1-HIGH
**Estimated**: 8 hours
**Dependencies**: T003 ✅ (Schema complete)

**What You're Building**: RAG search system for all specs

**Deliverables**:
1. RAG index for /02_SPECBASES/**
2. 800-char chunking system
3. Search API (≤10ms)
4. Index refresh pipeline

**Location**: `src/rag/RAGIndex.ts`

**Key Features**:
```typescript
class RAGIndex {
  // Index all specs
  async buildIndex(projectId: string, specFiles: ContextFile[]): Promise<void>

  // Search with semantic similarity
  async search(query: string, projectId: string): Promise<SearchResult[]>

  // Chunking strategy (800 chars with overlap)
  async chunkDocument(content: string): Promise<Chunk[]>

  // Auto-refresh when specs change
  async refreshIndex(projectId: string): Promise<void>
}
```

**Use Vector DB**:
- Supabase pgvector (PostgreSQL extension)
- OR simple in-memory for now
- Prepare for cloud vector DB

---

## 🔗 RESOURCES FOR ALL TASKS

**Review These Files**:
- `src/discovery/ContextExtractor.ts` (existing context extraction)
- `src/discovery/DiscoveryEngine.ts` (integration point)
- `src/registry/TaskRegistry.ts` (current task management)
- `04_AGENT_FRAMEWORK/CENTRAL_INTELLIGENCE_SYSTEM_ARCHITECTURE.md`

**Database**:
- Tables: 13 tables available
- Context files: 1,808 already indexed
- Projects: Multi-project support ready

**MCP Server**:
- Location: `/Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry`
- Tools: 14 MCP tools available
- Status: Running and ready

---

## 🚀 HOW TO START

### **Step 1: Connect via MCP**
```bash
# Your terminal should connect to the MCP server
# Use discover_environment to get activated
```

### **Step 2: Query Available Tasks**
```bash
# Call get_available_tasks via MCP
# See your recommended tasks
```

### **Step 3: Claim a Task**
```bash
# Call claim_task with your chosen task ID
# MCP will mark it CLAIMED by you
```

### **Step 4: Build**
```bash
# Create the files
# Write the code
# Test your implementation
```

### **Step 5: Complete**
```bash
# Call complete_task via MCP
# System will verify with Git
# Auto-unblock dependent tasks
```

---

## 💪 PICK YOUR TASK AND GO BUILD!

**All 3 options are P0/P1 and ready to start.**

Choose based on your preference:
- T010: Core infrastructure (task management)
- T011: Cloud storage (context management)
- T018: AI/RAG system (semantic search)

**When you claim via MCP, the system will coordinate with Agent A automatically!** 🎯

**GO EXECUTE!** 🚀
