# 🚀 MCP EVOLUTION: Single Project → Universal Multi-Project Orchestration

**Date**: 2025-10-08
**Status**: 🎯 ARCHITECTURAL BLUEPRINT
**Author**: Agent E (Gemini 2.5 Pro - Ground Supervisor)
**Purpose**: Complete roadmap for transforming MCP from single-project to 60-project orchestration library

---

## 📋 TABLE OF CONTENTS

1. [Current State: How MCP Manages LocalBrain](#current-state)
2. [Vision: Universal Multi-Project Library](#vision)
3. [Architecture: Three Design Options](#architecture)
4. [Recommended: Hybrid Architecture](#recommended)
5. [Database Design: Single → Multi-Project](#database)
6. [Migration Roadmap: Phase 1 → Phase 5](#migration)
7. [Implementation Details](#implementation)
8. [API Design: Multi-Project Tools](#api)
9. [Orchestration Logic](#orchestration)
10. [Performance & Scalability](#performance)
11. [Security & Isolation](#security)
12. [Agent Integration](#agents)
13. [Timeline & Effort](#timeline)

---

## 🎯 CURRENT STATE: How MCP Manages LocalBrain Tasks {#current-state}

### **Architecture Overview (Phase 1)**

```
┌─────────────────────────────────────────────────────────────┐
│                     LOCALBRAIN PROJECT                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Agent A/B/C/D/E/F                                          │
│       ↓                                                     │
│  TaskRegistryClient (spawns server)                         │
│       ↓                                                     │
│  MCP Server (stdio transport)                               │
│       ↓                                                     │
│  TaskRegistry (coordination logic)                          │
│       ↓                                                     │
│  TaskStore (SQLite: registry.db)                            │
│       ↓                                                     │
│  GitTracker (single repo verification)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Key Components**

#### **1. MCP Server** (`01_CODEBASES/mcp-servers/localbrain-task-registry/`)
- **Location**: `/Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry/`
- **Transport**: stdio (stdin/stdout)
- **Protocol**: JSON-RPC 2.0 over stdio
- **Launch**: `node dist/index.js`
- **Process Model**: One server per agent session (spawned by TaskRegistryClient)

#### **2. SQLite Database** (`data/registry.db`)
- **Schema**:
```sql
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,           -- T001, T002, etc.
    title TEXT,                    -- Task description
    agent TEXT,                    -- A, B, C, D, E, F
    status TEXT,                   -- AVAILABLE, CLAIMED, IN_PROGRESS, COMPLETE, BLOCKED
    priority TEXT,                 -- P0, P1, P2
    dependencies TEXT,             -- JSON array: ["T001", "T002"]
    created_at INTEGER,
    updated_at INTEGER,
    completed_at INTEGER,
    estimated_hours INTEGER,
    actual_minutes INTEGER,
    files_created TEXT,            -- JSON array: ["file1.ts", "file2.ts"]
    completion_percentage INTEGER, -- 0-100
    progress_notes TEXT
);
```

- **Operations**: ACID transactions, row-level locking
- **Location**: Fixed at `./data/registry.db` (relative to MCP server directory)
- **Persistence**: Permanent (not in-memory)

#### **3. Git Tracker** (Lech's Revolutionary Enhancement)
- **Purpose**: Deterministic task completion verification
- **Method**:
  - Tracks file creation/modification timestamps via `git log --name-status`
  - Analyzes commit messages for task IDs (e.g., "T001: Implementation")
  - Completion scoring: 70% file tracking + 30% commit tracking
  - Auto-verification threshold: ≥80% score
- **Working Directory**: Fixed at `process.cwd()` (LocalBrain project root)
- **Commands**:
```bash
git log --name-status --since="2025-10-08" -- "path/to/files"
git log --grep="T001" --since="2025-10-08" --format="%H %s"
```

#### **4. Dependency Resolver**
- **Auto-Unblocking**: When T001 completes → T005 (depends on T001) automatically becomes AVAILABLE
- **Circular Detection**: Prevents T001 → T002 → T001 loops
- **Critical Path**: Identifies longest dependency chain
- **Readiness Scoring**: Calculates how "ready" a task is based on dependencies

#### **5. MCP Tools** (4 tools registered)

##### **Tool 1: `getAvailableTasks`**
- **Input**: `{ agentId?: string }` (optional filter by agent)
- **Output**:
```json
{
  "availableTasks": 5,
  "inProgress": 2,
  "completed": 13,
  "blocked": 2,
  "tasks": [
    {
      "id": "T018",
      "title": "RAG Index for Specifications",
      "agent": "C",
      "priority": "P1",
      "estimatedHours": 8,
      "dependencies": [],
      "status": "AVAILABLE"
    }
  ]
}
```

##### **Tool 2: `claimTask`**
- **Input**: `{ taskId: string, agentId: string }`
- **Output**: `{ success: true, task: {...} }`
- **Atomicity**: Uses SQLite transactions to prevent race conditions
- **Side Effect**: Updates task status to CLAIMED

##### **Tool 3: `updateProgress`**
- **Input**:
```json
{
  "taskId": "T011",
  "completionPercentage": 75,
  "filesCreated": ["ReactQuery.ts", "SSRProvider.tsx"],
  "progressNotes": "Implementing SSR hydration"
}
```
- **Output**: `{ success: true, task: {...} }`
- **Real-Time**: Updates completion percentage and files list

##### **Tool 4: `completeTask`**
- **Input**:
```json
{
  "taskId": "T011",
  "filesCreated": ["ReactQuery.ts", "SSRProvider.tsx", "tests/SSR.test.ts"],
  "actualMinutes": 240
}
```
- **Output**: `{ success: true, gitVerified: true, completionScore: 95 }`
- **Git Verification**: Runs GitTracker to verify file creation + commits
- **Auto-Unblocking**: Triggers dependency resolver to unblock dependent tasks

### **Current Workflow (Agent Perspective)**

```typescript
// Agent A opens Claude Code session
import { TaskRegistryClient } from '../04_AGENT_FRAMEWORK/mcp-integration/TaskRegistryClient.js';

// 1. Initialize client (spawns MCP server process)
const client = new TaskRegistryClient('A');
// → Spawns: node dist/index.js (MCP server)
// → Connects: stdio transport (stdin/stdout)

// 2. Query available tasks
const result = await client.getAvailableTasks();
// → MCP Request: { method: "tools/call", params: { name: "getAvailableTasks", arguments: {} }}
// → Database Query: SELECT * FROM tasks WHERE status='AVAILABLE' AND (agent='A' OR agent IS NULL)
// → Returns: { availableTasks: 3, tasks: [...] }

console.log(`Agent A has ${result.availableTasks} tasks ready`);

// 3. Claim a task (atomic operation)
await client.claimTask('T011');
// → MCP Request: { method: "tools/call", params: { name: "claimTask", arguments: { taskId: "T011", agentId: "A" }}}
// → Database Transaction: BEGIN; UPDATE tasks SET status='CLAIMED', agent='A', updated_at=NOW() WHERE id='T011'; COMMIT;
// → Prevents race: If another agent tries to claim simultaneously, one gets locked out

// 4. Update progress during implementation
await client.updateProgress('T011', 50, ['ReactQuery.ts'], 'Implementing React Query setup');
// → MCP Request: updateProgress tool
// → Database: UPDATE tasks SET completion_percentage=50, files_created='["ReactQuery.ts"]', status='IN_PROGRESS'

await client.updateProgress('T011', 75, ['ReactQuery.ts', 'SSRProvider.tsx'], 'SSR hydration working');
// → Real-time progress updates

// 5. Complete the task
await client.completeTask('T011', ['ReactQuery.ts', 'SSRProvider.tsx', 'tests/SSR.test.ts'], 240);
// → MCP Request: completeTask tool
// → GitTracker runs:
//   - git log --name-status --since="2025-10-08" -- "ReactQuery.ts" "SSRProvider.tsx" "tests/SSR.test.ts"
//   - git log --grep="T011" --since="2025-10-08"
//   - Calculates completion score: 70% files (3/3 found) + 30% commits (5 commits found) = 95%
// → Database: UPDATE tasks SET status='COMPLETE', completed_at=NOW(), actual_minutes=240
// → Dependency Resolver: Checks if any tasks depend on T011 → Auto-unblocks them

// 6. Disconnect (kills MCP server process)
client.disconnect();
// → Kills spawned MCP server
// → Closes stdio transport
```

### **Task Lifecycle State Machine**

```
┌─────────────┐
│   BLOCKED   │ (Dependencies not met)
└──────┬──────┘
       │ (Dependencies complete)
       ↓
┌─────────────┐
│  AVAILABLE  │ (Ready to claim)
└──────┬──────┘
       │ (Agent claims)
       ↓
┌─────────────┐
│   CLAIMED   │ (Reserved by agent)
└──────┬──────┘
       │ (Agent starts work)
       ↓
┌─────────────┐
│ IN_PROGRESS │ (Work in progress)
└──────┬──────┘
       │ (Agent completes)
       ↓
┌─────────────┐
│  COMPLETE   │ (Git verified)
└─────────────┘
```

### **Current Limitations (Why Multi-Project Doesn't Work)**

#### **1. Single Database Without Project Context**
```sql
-- Current schema LACKS project_id
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT,
    agent TEXT
    -- ❌ NO project_id field
    -- ❌ NO working_directory field
);
```

**Problem**: All tasks assumed to belong to LocalBrain project. No way to distinguish:
- `LocalBrain/T001` vs `ProjectX/T001`
- Tasks from different projects mix together
- No project-level filtering

#### **2. Single Git Tracker Instance**
```typescript
const gitTracker = new GitTracker(process.cwd());
// ❌ Fixed to single working directory (LocalBrain project root)
```

**Problem**: Can only track one repository. Cannot verify tasks across 60 projects.

#### **3. Single Working Directory**
```typescript
const registry = new TaskRegistry('./data/registry.db');
// ❌ Database path relative to server launch directory
```

**Problem**: MCP server must be launched from LocalBrain project root. Cannot coordinate across `/PROJECTS_all/`.

#### **4. No Project Registry**
**Problem**: No concept of "projects" in the system. Cannot:
- List all projects
- Query tasks per project
- Register new projects
- Track project metadata

#### **5. Stdio Transport Limitation**
**Problem**: stdio (stdin/stdout) is process-local. Cannot have:
- One MCP server coordinating multiple projects
- Agents from different projects connecting to same server
- Cross-project task queries

---

## 🌍 VISION: Universal Multi-Project Library {#vision}

### **The Dream: 60 Projects → 1 Unified Ecosystem**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    PROJECTS_ALL ECOSYSTEM (60 PROJECTS)                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  PROJECT_LocalBrain/              PROJECT_minerals/              PROJECT_pime/  │
│    ├─ Agent A (UI)                  ├─ Agent B (Design)           ├─ Agent D   │
│    ├─ Agent C (Backend)             ├─ Agent E (Supervisor)       └─ Agent F   │
│    └─ Tasks: T001-T050              └─ Tasks: M001-M020              Tasks: P001│
│         ↓                                  ↓                              ↓     │
│         └──────────────────────────────────┼──────────────────────────────┘     │
│                                            ↓                                     │
│                        ╔═══════════════════════════════════╗                   │
│                        ║   CENTRAL MCP ORCHESTRATION HUB   ║                   │
│                        ║   (Universal Task Coordination)    ║                   │
│                        ╚═══════════════════════════════════╝                   │
│                                            ↓                                     │
│                     ┌──────────────────────┴──────────────────────┐            │
│                     │                                              │            │
│         ┌───────────▼────────────┐                  ┌──────────────▼──────────┐│
│         │  PostgreSQL Database   │                  │   Git Trackers (60)     ││
│         │  ───────────────────   │                  │  ──────────────────     ││
│         │  • projects (60 rows)  │                  │  • LocalBrain/          ││
│         │  • tasks (1000+ rows)  │                  │  • minerals/            ││
│         │  • agents (A-F)        │                  │  • pime/                ││
│         │  • dependencies        │                  │  • 57 more...           ││
│         └────────────────────────┘                  └─────────────────────────┘│
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Key Capabilities**

#### **1. Project-Aware Task Management**
```typescript
// Query tasks for specific project
await client.getAvailableTasks({ projectId: 'LocalBrain', agentId: 'A' });
// → Returns: LocalBrain tasks assigned to Agent A

// Query tasks across all projects
await client.getAvailableTasks({ agentId: 'B' });
// → Returns: Design tasks from all 60 projects

// Query specific project status
await client.getProjectStatus('minerals');
// → Returns: { totalTasks: 20, completed: 12, inProgress: 3, blocked: 5 }
```

#### **2. Cross-Project Dependencies**
```typescript
// Task in ProjectX depends on task in LocalBrain
{
  "id": "X005",
  "projectId": "ProjectX",
  "title": "Integrate LocalBrain design tokens",
  "dependencies": [
    "LocalBrain:T001"  // Cross-project dependency!
  ]
}
// → X005 blocked until LocalBrain:T001 completes
```

#### **3. Location-Aware Orchestration**
```typescript
// System knows agent's working directory
{
  "agentId": "B",
  "modelType": "claude-sonnet-4-5",
  "workingDirectory": "/Users/lech/PROJECTS_all/minerals/design/",
  "role": "Design System Specialist"
}

// Task routing exploits location
await client.getAvailableTasks({ agentId: 'B' });
// → System prefers tasks in /minerals/design/ (Agent B's location)
// → "Scan design system files in minerals/" routed to Agent B
```

#### **4. Multi-Project Coordination**
```typescript
// Agent F (Strategic Supervisor) queries entire ecosystem
await client.getAllProjectsStatus();
// → Returns:
{
  "totalProjects": 60,
  "activeProjects": 12,
  "totalTasks": 1847,
  "completed": 1203,
  "inProgress": 45,
  "blocked": 89,
  "available": 510,
  "projects": [
    { "id": "LocalBrain", "tasks": 50, "completed": 35, "velocity": "150%" },
    { "id": "minerals", "tasks": 20, "completed": 12, "velocity": "120%" },
    ...
  ]
}
```

#### **5. Shared Knowledge Base**
```typescript
// Agent learns pattern in LocalBrain → applies to minerals
{
  "insight": "OKLCH color system with APCA enforcement",
  "learnedIn": "LocalBrain",
  "applicableTo": ["minerals", "pime", "PROJECT_X"],
  "status": "REUSABLE_PATTERN"
}

// Central MCP tracks: "This pattern works, replicate across projects"
```

#### **6. Agent Communication (Inbox System)**
```typescript
// Agent B sends message to Agent D
await client.sendMessage({
  from: 'B',
  to: 'D',
  subject: 'Design tokens ready for integration',
  payload: {
    tokensFile: 'LocalBrain/design/tokens/design-tokens.json',
    integrationGuide: 'LocalBrain/design/tokens/README.md'
  }
});

// Agent D checks inbox
const messages = await client.getInbox('D');
// → Returns: [ { from: 'B', subject: '...', payload: {...} } ]
```

---

## 🏗️ ARCHITECTURE: Three Design Options {#architecture}

### **Option 1: Centralized Single Database**

```
┌─────────────────────────────────────────────────────────────┐
│            CENTRAL MCP ORCHESTRATION SERVER                 │
│              (Single Instance, Always Running)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PostgreSQL Database (not SQLite)                           │
│  ├─ projects table (60 projects)                            │
│  ├─ tasks table (1000+ tasks, with project_id)             │
│  ├─ agents table (A-F with current assignments)            │
│  ├─ messages table (agent inbox system)                    │
│  └─ learnings table (cross-project patterns)               │
│                                                             │
│  Git Tracking (per-project working directories)             │
│  ├─ GitTracker('/PROJECTS_all/LocalBrain/')                │
│  ├─ GitTracker('/PROJECTS_all/minerals/')                  │
│  └─ GitTracker('... 58 more ...')                          │
│                                                             │
│  MCP Server (HTTP/WebSocket transport - not stdio)         │
│  ├─ Listens on: http://localhost:3737                      │
│  ├─ Multiple agents can connect simultaneously             │
│  └─ RESTful API + WebSocket for real-time updates          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↑
           ┌──────────────────┼──────────────────┐
           │                  │                  │
    Agent A (LocalBrain)  Agent B (minerals)  Agent C (pime)
    HTTP requests         HTTP requests       HTTP requests
```

**Pros**:
- ✅ Single source of truth
- ✅ Easy cross-project queries
- ✅ Centralized orchestration logic
- ✅ Shared intelligence (learnings database)
- ✅ Real-time updates via WebSocket
- ✅ Scalable (PostgreSQL handles 60 projects easily)

**Cons**:
- ❌ Single point of failure
- ❌ Requires PostgreSQL (more complex than SQLite)
- ❌ Network access required (agents must reach server)
- ❌ More complex deployment (server must always be running)
- ❌ Migration from stdio → HTTP/WebSocket

---

### **Option 2: Federated Per-Project Databases**

```
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│  LocalBrain MCP Server │  │  minerals MCP Server   │  │   pime MCP Server      │
│  (stdio transport)     │  │  (stdio transport)     │  │  (stdio transport)     │
├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤
│ SQLite: localbrain.db  │  │ SQLite: minerals.db    │  │ SQLite: pime.db        │
│ Tasks: T001-T050       │  │ Tasks: M001-M020       │  │ Tasks: P001-P015       │
└────────────────────────┘  └────────────────────────┘  └────────────────────────┘
           ↓                           ↓                           ↓
           └───────────────────────────┼───────────────────────────┘
                                       ↓
                  ┌────────────────────────────────────────┐
                  │  Central Coordination Server           │
                  │  (Aggregates data from all projects)   │
                  ├────────────────────────────────────────┤
                  │  • Polls per-project MCP servers       │
                  │  • Aggregates status                   │
                  │  • Cross-project dependency resolution │
                  │  • Shared learnings registry           │
                  └────────────────────────────────────────┘
```

**Pros**:
- ✅ Project isolation (failure in one doesn't affect others)
- ✅ Can keep SQLite simplicity (per-project DBs)
- ✅ Incremental rollout (add projects one by one)
- ✅ Stdio transport still works (no HTTP needed)

**Cons**:
- ❌ More complex coordination
- ❌ Duplicate server instances (60 MCP servers!)
- ❌ Cross-project queries harder
- ❌ More maintenance overhead
- ❌ Synchronization challenges (60 databases to keep in sync)

---

### **Option 3: Hybrid Architecture** ⭐ **RECOMMENDED**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    CENTRAL MCP REGISTRY SERVER (PostgreSQL)                     │
│                     (The "Brain" - Always Running on Cloud)                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  PostgreSQL Database                                                            │
│  ├─ projects (60 projects registered)                                           │
│  ├─ tasks (all projects, with project_id)                                       │
│  ├─ agents (A-F assignments and locations)                                      │
│  ├─ messages (agent inbox system)                                               │
│  ├─ learnings (cross-project patterns)                                          │
│  └─ file_system_maps (cached per-project scans)                                 │
│                                                                                 │
│  HTTP/WebSocket API (http://localhost:3737)                                     │
│  ├─ GET /projects                                                               │
│  ├─ GET /projects/:id/tasks                                                     │
│  ├─ POST /tasks/:id/claim                                                       │
│  ├─ POST /tasks/:id/complete                                                    │
│  ├─ GET /agents/:id/inbox                                                       │
│  └─ WebSocket /ws (real-time updates)                                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                              ↑                ↑                ↑
                              │                │                │
┌─────────────────────────────┴┐  ┌───────────┴──────────────┐  │
│  LocalBrain Agent Context    │  │ minerals Agent Context    │  │
│  (Lightweight, per-agent)    │  │ (Lightweight, per-agent)  │  │
├──────────────────────────────┤  ├───────────────────────────┤  │
│ Working Dir: /LocalBrain/    │  │ Working Dir: /minerals/   │  │
│ Git: GitTracker (local repo) │  │ Git: GitTracker (local)   │  │
│ Files: Scans local only      │  │ Files: Scans local only   │  │
│ Reports to: Central MCP      │  │ Reports to: Central MCP   │  │
└──────────────────────────────┘  └───────────────────────────┘  │
           ↑                                ↑                     │
       Agent A                          Agent B               Agent C
    (GLM-4.6)                        (Sonnet-4.5)          (GLM-4.6)
```

**Pros**:
- ✅ Best of both worlds: Central intelligence + distributed context
- ✅ Project isolation (agents work locally, report to central)
- ✅ Scalable (PostgreSQL for central, lightweight agents)
- ✅ Cross-project coordination (central knows all projects)
- ✅ Location-aware (agents know working directory)
- ✅ Incremental rollout (add projects to central registry)
- ✅ Real-time updates (WebSocket from central)
- ✅ Failure resilience (central server failure doesn't stop local work)

**Cons**:
- ❌ More complex than pure centralized (two layers)
- ❌ Requires HTTP/WebSocket (not stdio)
- ❌ Agents need network access to central server

---

## 🏆 RECOMMENDED: Hybrid Architecture (Detailed Design) {#recommended}

### **Architecture Layers**

#### **Layer 1: Central MCP Registry Server** (The "Brain")
**Purpose**: Global orchestration, cross-project coordination, shared intelligence

**Location**: Cloud deployment (AWS Lambda, GCP Cloud Run, or self-hosted)
**Database**: PostgreSQL (production-grade, 60 projects × 1000 tasks = 60,000 rows easily)
**Transport**: HTTP REST API + WebSocket for real-time
**Port**: `http://localhost:3737` (local) or `https://mcp.localbrain.ai` (cloud)

**Responsibilities**:
1. **Project Registry**: Track all 60 projects in PROJECTS_all/
2. **Task Coordination**: Store all tasks across all projects
3. **Agent Assignments**: Track which agent is working on what
4. **Dependency Resolution**: Cross-project dependency management
5. **Shared Learnings**: Pattern library from all projects
6. **Agent Inbox**: Message queue for cross-agent communication
7. **File System Maps**: Cached scans from all projects

**API Endpoints**:
```typescript
// Project management
GET    /projects                          // List all 60 projects
GET    /projects/:id                      // Get project details
POST   /projects                          // Register new project
GET    /projects/:id/tasks                // Get tasks for project

// Task management
GET    /tasks/available                   // Query available tasks (multi-project)
POST   /tasks/:id/claim                   // Claim task
POST   /tasks/:id/update-progress         // Update progress
POST   /tasks/:id/complete                // Complete with git verification
GET    /tasks/:id/dependencies            // Get task dependencies

// Agent coordination
GET    /agents/:id/assignments            // Get agent's current assignments
GET    /agents/:id/inbox                  // Get agent's messages
POST   /agents/:id/send-message           // Send message to agent
GET    /agents/:id/status                 // Get agent status

// Cross-project intelligence
GET    /learnings                         // Get shared patterns
POST   /learnings                         // Report new learning
GET    /file-system-maps/:projectId       // Get cached file system map
```

**WebSocket Events** (Real-time updates):
```typescript
// Agent subscribes to real-time updates
ws://localhost:3737/ws?agentId=A

// Events received:
{
  "event": "task.completed",
  "data": { "taskId": "LocalBrain:T001", "agent": "B" }
}
{
  "event": "task.available",
  "data": { "taskId": "minerals:M005", "agent": "A", "reason": "dependencies_met" }
}
{
  "event": "message.received",
  "data": { "from": "B", "subject": "Design tokens ready" }
}
```

#### **Layer 2: Per-Agent Context Layer** (The "Field Agents")
**Purpose**: Local context gathering, git tracking, file system scanning

**Location**: Runs alongside each agent (in agent's working directory)
**Database**: None (stateless, reports to central)
**Transport**: HTTP client (calls central MCP server)
**Process Model**: Lightweight, spawned per agent session

**Responsibilities**:
1. **Local Git Tracking**: Track file changes in agent's project
2. **File System Scanning**: Scan local directory structure
3. **Context Reporting**: Send local context to central MCP
4. **Task Execution**: Execute tasks in local working directory
5. **Progress Updates**: Report progress to central

**Code Example**:
```typescript
// Per-agent context client
class AgentContextClient {
  private workingDirectory: string;
  private gitTracker: GitTracker;
  private centralMcpUrl: string;

  constructor(agentId: string, projectId: string) {
    this.workingDirectory = `/Users/lech/PROJECTS_all/${projectId}/`;
    this.gitTracker = new GitTracker(this.workingDirectory);
    this.centralMcpUrl = 'http://localhost:3737';
  }

  // Claim task from central MCP
  async claimTask(taskId: string): Promise<Task> {
    const response = await fetch(`${this.centralMcpUrl}/tasks/${taskId}/claim`, {
      method: 'POST',
      body: JSON.stringify({ agentId: this.agentId, projectId: this.projectId })
    });
    return response.json();
  }

  // Report progress to central (with local git tracking)
  async updateProgress(taskId: string, percentage: number): Promise<void> {
    const filesCreated = await this.gitTracker.getRecentFiles();
    await fetch(`${this.centralMcpUrl}/tasks/${taskId}/update-progress`, {
      method: 'POST',
      body: JSON.stringify({
        agentId: this.agentId,
        completionPercentage: percentage,
        filesCreated,
        workingDirectory: this.workingDirectory
      })
    });
  }

  // Complete task (central verifies via git)
  async completeTask(taskId: string): Promise<void> {
    const localGitData = await this.gitTracker.getVerificationData();
    await fetch(`${this.centralMcpUrl}/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify({
        agentId: this.agentId,
        localGitData, // Central will verify independently
        workingDirectory: this.workingDirectory
      })
    });
  }

  // Scan local file system and report to central
  async scanAndReportFileSystem(): Promise<void> {
    const fileSystemMap = await this.scanDirectory(this.workingDirectory);
    await fetch(`${this.centralMcpUrl}/file-system-maps/${this.projectId}`, {
      method: 'POST',
      body: JSON.stringify({ agentId: this.agentId, fileSystemMap })
    });
  }
}
```

---

## 💾 DATABASE DESIGN: Single → Multi-Project {#database}

### **Phase 1 Schema (Current - SQLite)**

```sql
-- Single project (LocalBrain only)
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,           -- T001, T002, ...
    title TEXT,
    agent TEXT,                    -- A, B, C, D, E, F
    status TEXT,
    priority TEXT,
    dependencies TEXT,             -- JSON: ["T001", "T002"]
    created_at INTEGER,
    updated_at INTEGER,
    completed_at INTEGER,
    estimated_hours INTEGER,
    actual_minutes INTEGER,
    files_created TEXT,            -- JSON: ["file1.ts", "file2.ts"]
    completion_percentage INTEGER,
    progress_notes TEXT
);
```

**Limitations**:
- ❌ No project identifier
- ❌ No cross-project support
- ❌ No agent location tracking
- ❌ No message queue
- ❌ No learnings storage

### **Phase 5 Schema (Multi-Project - PostgreSQL)**

```sql
-- ============================================================
-- TABLE 1: PROJECTS (60 projects in PROJECTS_all/)
-- ============================================================
CREATE TABLE projects (
    id TEXT PRIMARY KEY,                -- 'LocalBrain', 'minerals', 'pime', etc.
    name TEXT NOT NULL,                 -- Display name
    path TEXT NOT NULL,                 -- '/Users/lech/PROJECTS_all/LocalBrain/'
    description TEXT,
    status TEXT DEFAULT 'ACTIVE',       -- ACTIVE, ARCHIVED, PAUSED
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_status ON projects(status);

-- ============================================================
-- TABLE 2: TASKS (1000+ tasks across all projects)
-- ============================================================
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,                -- Composite: 'LocalBrain:T001', 'minerals:M005'
    project_id TEXT NOT NULL,           -- Foreign key to projects.id
    local_id TEXT NOT NULL,             -- 'T001', 'M005' (project-local ID)
    title TEXT NOT NULL,
    agent TEXT,                         -- 'A', 'B', 'C', 'D', 'E', 'F'
    status TEXT DEFAULT 'BLOCKED',      -- BLOCKED, AVAILABLE, CLAIMED, IN_PROGRESS, COMPLETE
    priority TEXT DEFAULT 'P1',         -- P0, P1, P2
    dependencies TEXT,                  -- JSON: ["LocalBrain:T001", "minerals:M003"]
    working_directory TEXT,             -- '/Users/lech/PROJECTS_all/LocalBrain/UI/'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    claimed_at TIMESTAMP,
    claimed_by TEXT,                    -- Agent who claimed it
    estimated_hours INTEGER,
    actual_minutes INTEGER,
    files_created TEXT,                 -- JSON: ["Button.tsx", "Button.test.ts"]
    completion_percentage INTEGER DEFAULT 0,
    progress_notes TEXT,
    git_verification_score INTEGER,     -- 0-100 (70% files + 30% commits)

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_agent ON tasks(agent);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_agent_status ON tasks(agent, status);

-- Unique constraint: local_id unique within project
CREATE UNIQUE INDEX idx_tasks_project_local_id ON tasks(project_id, local_id);

-- ============================================================
-- TABLE 3: AGENTS (A, B, C, D, E, F)
-- ============================================================
CREATE TABLE agents (
    id TEXT PRIMARY KEY,                -- 'A', 'B', 'C', 'D', 'E', 'F'
    name TEXT NOT NULL,                 -- 'UI Velocity Specialist'
    model_type TEXT NOT NULL,           -- 'claude-sonnet-4-5', 'glm-4-6', etc.
    role TEXT NOT NULL,                 -- 'UI Velocity', 'Design System', etc.
    current_project_id TEXT,            -- Currently working on which project
    current_working_directory TEXT,     -- '/Users/lech/PROJECTS_all/LocalBrain/UI/'
    current_task_id TEXT,               -- 'LocalBrain:T011'
    status TEXT DEFAULT 'IDLE',         -- IDLE, WORKING, BLOCKED
    last_active TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (current_project_id) REFERENCES projects(id),
    FOREIGN KEY (current_task_id) REFERENCES tasks(id)
);

CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_project ON agents(current_project_id);

-- ============================================================
-- TABLE 4: MESSAGES (Agent inbox system)
-- ============================================================
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_agent TEXT NOT NULL,           -- 'B'
    to_agent TEXT NOT NULL,             -- 'D'
    subject TEXT NOT NULL,
    payload JSONB,                      -- { tokensFile: '...', guide: '...' }
    created_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP,
    status TEXT DEFAULT 'UNREAD',       -- UNREAD, READ, ARCHIVED

    FOREIGN KEY (from_agent) REFERENCES agents(id),
    FOREIGN KEY (to_agent) REFERENCES agents(id)
);

CREATE INDEX idx_messages_to_agent ON messages(to_agent);
CREATE INDEX idx_messages_status ON messages(to_agent, status);

-- ============================================================
-- TABLE 5: LEARNINGS (Shared patterns across projects)
-- ============================================================
CREATE TABLE learnings (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    pattern_type TEXT,                  -- 'DESIGN_SYSTEM', 'ARCHITECTURE', 'TESTING', etc.
    learned_in_project TEXT NOT NULL,   -- 'LocalBrain'
    applicable_to TEXT,                 -- JSON: ['minerals', 'pime', 'PROJECT_X']
    code_example TEXT,
    documentation_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,                    -- Agent ID

    FOREIGN KEY (learned_in_project) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES agents(id)
);

CREATE INDEX idx_learnings_type ON learnings(pattern_type);
CREATE INDEX idx_learnings_project ON learnings(learned_in_project);

-- ============================================================
-- TABLE 6: FILE_SYSTEM_MAPS (Cached scans from all projects)
-- ============================================================
CREATE TABLE file_system_maps (
    id SERIAL PRIMARY KEY,
    project_id TEXT NOT NULL,
    scanned_by TEXT NOT NULL,           -- Agent ID
    directory_path TEXT NOT NULL,
    file_tree JSONB,                    -- Complete directory tree
    file_count INTEGER,
    total_size_bytes BIGINT,
    scanned_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (scanned_by) REFERENCES agents(id)
);

CREATE INDEX idx_file_system_maps_project ON file_system_maps(project_id);
CREATE INDEX idx_file_system_maps_scanned_at ON file_system_maps(scanned_at DESC);
```

### **Data Migration Strategy**

```sql
-- Step 1: Migrate projects (create LocalBrain project)
INSERT INTO projects (id, name, path) VALUES
('LocalBrain', 'LocalBrain + Orchestra Blue', '/Users/lech/PROJECTS_all/LocalBrain/');

-- Step 2: Migrate tasks (add project_id prefix)
INSERT INTO tasks (id, project_id, local_id, title, agent, status, ...)
SELECT
    'LocalBrain:' || id,        -- Composite ID
    'LocalBrain',               -- project_id
    id,                         -- local_id (T001, T002, ...)
    title,
    agent,
    status,
    ...
FROM old_tasks_table;

-- Step 3: Migrate agents (initialize with LocalBrain project)
INSERT INTO agents (id, name, model_type, role, current_project_id) VALUES
('A', 'UI Velocity Specialist', 'glm-4-6', 'UI Velocity', 'LocalBrain'),
('B', 'Design System Specialist', 'claude-sonnet-4-5', 'Design System', 'LocalBrain'),
('C', 'Backend Services Specialist', 'glm-4-6', 'Backend Services', 'LocalBrain'),
('D', 'Integration Specialist', 'claude-sonnet-4-5', 'Integration', 'LocalBrain'),
('E', 'Ground Supervisor', 'gemini-2.5-pro', 'Coherence Specialist', 'LocalBrain'),
('F', 'Strategic Supervisor', 'chatgpt-5', 'Strategic Guidance', NULL);
```

---

## 🛣️ MIGRATION ROADMAP: Phase 1 → Phase 5 {#migration}

### **Phase 1: Current State** ✅ COMPLETE
- ✅ Single project (LocalBrain)
- ✅ SQLite database
- ✅ stdio transport
- ✅ 4 MCP tools (getAvailableTasks, claimTask, updateProgress, completeTask)
- ✅ Git-based verification
- ✅ Real-time progress tracking

### **Phase 2: Database Migration** (2-3 days)
**Goal**: Upgrade from SQLite → PostgreSQL with multi-project schema

**Steps**:
1. ✅ Design PostgreSQL schema (6 tables: projects, tasks, agents, messages, learnings, file_system_maps)
2. ✅ Migrate existing LocalBrain tasks to new schema
3. ✅ Test migration with LocalBrain data
4. ✅ Deploy PostgreSQL (local or cloud)

**Deliverables**:
- `src/database/schema.sql` (Phase 5 schema)
- `src/database/migrate.sql` (migration script)
- `src/database/PostgresStore.ts` (replaces SQLite TaskStore)

**Validation**:
- All LocalBrain tasks migrated correctly
- Task IDs updated to composite format (LocalBrain:T001)
- Dependencies preserved
- Git verification still working

### **Phase 3: Transport Migration** (3-4 days)
**Goal**: Upgrade from stdio → HTTP/WebSocket

**Steps**:
1. ✅ Implement HTTP REST API (Express.js server)
2. ✅ Implement WebSocket server (for real-time updates)
3. ✅ Update TaskRegistryClient to use HTTP instead of stdio
4. ✅ Test with LocalBrain agents

**Deliverables**:
- `src/server/http-server.ts` (Express REST API)
- `src/server/websocket-server.ts` (WebSocket handler)
- `src/client/HttpTaskRegistryClient.ts` (HTTP client)

**API Endpoints Implemented**:
- GET /projects
- GET /projects/:id/tasks
- POST /tasks/:id/claim
- POST /tasks/:id/update-progress
- POST /tasks/:id/complete
- WebSocket /ws

**Validation**:
- Agents can connect via HTTP
- Task claiming works over HTTP
- Real-time updates via WebSocket

### **Phase 4: Multi-Project Registration** (2-3 days)
**Goal**: Register all 60 projects in PROJECTS_all/

**Steps**:
1. ✅ Create project registration tool
2. ✅ Scan PROJECTS_all/ directory
3. ✅ Register each project (id, name, path)
4. ✅ Verify git tracking works for each project

**Deliverables**:
- `scripts/register-projects.ts` (bulk registration script)
- `src/tools/registerProject.ts` (MCP tool for project registration)

**Script Example**:
```typescript
// scripts/register-projects.ts
import { readdirSync } from 'fs';

const projectsDir = '/Users/lech/PROJECTS_all/';
const projects = readdirSync(projectsDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name.startsWith('PROJECT_'))
  .map(d => ({
    id: d.name.replace('PROJECT_', ''),
    name: d.name,
    path: `${projectsDir}${d.name}/`
  }));

// Register each project
for (const project of projects) {
  await registerProject(project);
  console.log(`✅ Registered: ${project.id}`);
}

console.log(`🎯 Total projects registered: ${projects.length}`);
```

**Validation**:
- All 60 projects in database
- Git tracking initialized for each
- File system maps can be scanned

### **Phase 5: Location-Aware Orchestration** (4-5 days)
**Goal**: Implement working directory tracking and location-based routing

**Steps**:
1. ✅ Track agent working directory
2. ✅ Implement location-based task routing
3. ✅ Prefer tasks in agent's current directory
4. ✅ Test with agents in different projects

**Deliverables**:
- `src/orchestration/LocationAwareRouter.ts`
- Updated `getAvailableTasks` to consider agent location
- Agent working directory tracking in database

**Routing Algorithm**:
```typescript
// Prefer tasks in agent's current working directory
function getAvailableTasks(agentId: string): Task[] {
  const agent = getAgent(agentId);
  const currentProject = agent.current_project_id;

  // Priority 1: Tasks in agent's current project
  const localTasks = getTasks({
    projectId: currentProject,
    status: 'AVAILABLE',
    agent: agentId
  });

  // Priority 2: Cross-project tasks matching agent's role
  const crossProjectTasks = getTasks({
    status: 'AVAILABLE',
    agent: agentId
  }).filter(t => t.project_id !== currentProject);

  // Return local tasks first, then cross-project
  return [...localTasks, ...crossProjectTasks];
}
```

**Validation**:
- Agent B in /minerals/ preferentially gets minerals tasks
- Agent A in /LocalBrain/ preferentially gets LocalBrain tasks
- Cross-project tasks still accessible

### **Phase 6: Agent Inbox System** (3-4 days)
**Goal**: Enable cross-agent communication

**Steps**:
1. ✅ Implement messages table
2. ✅ Implement sendMessage MCP tool
3. ✅ Implement getInbox MCP tool
4. ✅ Test Agent B → Agent D messaging

**Deliverables**:
- `src/tools/sendMessage.ts`
- `src/tools/getInbox.ts`
- `src/tools/markMessageRead.ts`

**Usage Example**:
```typescript
// Agent B sends message to Agent D
await client.sendMessage({
  to: 'D',
  subject: 'Design tokens ready for integration',
  payload: {
    tokensFile: 'LocalBrain/design/tokens/design-tokens.json',
    integrationGuide: 'LocalBrain/design/tokens/README.md'
  }
});

// Agent D checks inbox
const messages = await client.getInbox();
console.log(`📬 You have ${messages.length} unread messages`);
```

**Validation**:
- Messages delivered successfully
- Inbox queries work
- Message read/unread status tracked

### **Phase 7: Shared Learnings** (2-3 days)
**Goal**: Track patterns learned in one project, apply to others

**Steps**:
1. ✅ Implement learnings table
2. ✅ Implement reportLearning MCP tool
3. ✅ Implement queryLearnings MCP tool
4. ✅ Test with LocalBrain OKLCH pattern

**Deliverables**:
- `src/tools/reportLearning.ts`
- `src/tools/queryLearnings.ts`

**Usage Example**:
```typescript
// Agent B reports learning from LocalBrain
await client.reportLearning({
  title: 'OKLCH Color System with APCA Enforcement',
  description: 'Production-ready color system using OKLCH + APCA contrast validation',
  patternType: 'DESIGN_SYSTEM',
  learnedIn: 'LocalBrain',
  applicableTo: ['minerals', 'pime', 'PROJECT_X'],
  codeExample: 'LocalBrain/design/tokens/oklch-ramps.json',
  documentationUrl: 'LocalBrain/design/tokens/README.md'
});

// Agent B working on minerals queries learnings
const learnings = await client.queryLearnings({ patternType: 'DESIGN_SYSTEM' });
console.log(`📚 Found ${learnings.length} design system patterns from other projects`);
```

**Validation**:
- Learnings stored in database
- Queries return relevant patterns
- Cross-project pattern reuse

### **Phase 8: File System Context Gathering** (3-4 days)
**Goal**: Agents scan local file systems and report to central

**Steps**:
1. ✅ Implement file system scanner
2. ✅ Implement reportFileSystemMap MCP tool
3. ✅ Implement queryFileSystemMap MCP tool
4. ✅ Test with LocalBrain + minerals

**Deliverables**:
- `src/tools/reportFileSystemMap.ts`
- `src/tools/queryFileSystemMap.ts`
- `src/utils/FileSystemScanner.ts`

**Usage Example**:
```typescript
// Agent A scans LocalBrain/UI/ directory
const fileSystemMap = await scanDirectory('/Users/lech/PROJECTS_all/LocalBrain/UI/');
await client.reportFileSystemMap({
  projectId: 'LocalBrain',
  directoryPath: '/UI/',
  fileTree: fileSystemMap,
  fileCount: 247,
  totalSizeBytes: 3842991
});

// Agent E (Supervisor) queries complete file system
const allMaps = await client.queryFileSystemMap('LocalBrain');
console.log(`📂 LocalBrain has ${allMaps.length} directory scans`);
```

**Validation**:
- File system maps stored
- Queries return accurate data
- Central MCP has complete project context

### **Timeline Summary**

| Phase | Estimated Time | Dependencies | Risk Level |
|-------|---------------|--------------|------------|
| **Phase 1** | ✅ Complete | None | ✅ Low |
| **Phase 2** | 2-3 days | PostgreSQL setup | 🟡 Medium |
| **Phase 3** | 3-4 days | Phase 2 | 🟡 Medium |
| **Phase 4** | 2-3 days | Phase 3 | ✅ Low |
| **Phase 5** | 4-5 days | Phase 4 | 🟡 Medium |
| **Phase 6** | 3-4 days | Phase 5 | ✅ Low |
| **Phase 7** | 2-3 days | Phase 5 | ✅ Low |
| **Phase 8** | 3-4 days | Phase 5 | 🟡 Medium |
| **TOTAL** | **19-26 days** | | |

**Parallelization Opportunities**:
- Phase 6, 7, 8 can be done in parallel (all depend on Phase 5)
- Total time with parallelization: **14-19 days**

---

## 🎯 BOTTOM LINE

### **Current State (Phase 1)**:
- ✅ MCP manages LocalBrain tasks via SQLite + stdio
- ✅ 4 MCP tools (getAvailableTasks, claimTask, updateProgress, completeTask)
- ✅ Git-based verification working
- ✅ Real-time progress tracking working
- ✅ 13/19 tasks complete (68%)

### **Future State (Phase 5)**:
- 🎯 MCP becomes universal multi-project library
- 🎯 60 projects orchestrated from central server
- 🎯 Location-aware task routing
- 🎯 Cross-agent communication (inbox)
- 🎯 Shared learnings across projects
- 🎯 Complete file system context

### **Migration Path**:
- **14-19 days total** (with parallelization)
- **Hybrid architecture recommended** (central PostgreSQL + per-agent context)
- **Incremental rollout** (LocalBrain → minerals → all 60 projects)
- **Zero downtime** (Phase 1 keeps working during migration)

---

**Let's transform this from single-project to universal orchestration! 🚀**
