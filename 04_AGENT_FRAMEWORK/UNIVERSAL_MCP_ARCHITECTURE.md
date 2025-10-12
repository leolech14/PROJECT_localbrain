# Universal Multi-Project MCP System Architecture
## Doppler-Style Centralized Project & Agent Management

**Vision Date**: 2025-10-08
**Architect**: Lech + Agent D
**Status**: 🎯 DESIGN PHASE

---

## 🎯 THE VISION

### Current State (Single-Project MCP)
```bash
# One MCP server per project
cd LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry
node dist/index.js
```

### Target State (Universal MCP - Doppler-Style)
```bash
# Universal MCP managing ALL projects
mcp-registry --project LocalBrain --agent D getAvailableTasks
mcp-registry --project PROJECT_minerals --agent A claimTask T005
mcp-registry --project PROJECT_pime --config dev getDashboard

# Just like Doppler:
doppler secrets get --project example --config dev API_KEY
```

---

## 🏗️ SYSTEM ARCHITECTURE

### Hierarchical Structure
```
UNIVERSAL_MCP_REGISTRY (Central Hub)
├── PROJECT: LocalBrain
│   ├── database: localbrain.db
│   ├── config: dev|staging|prod
│   ├── agents: A, B, C, D, E, F
│   ├── tasks: 19 tasks (T001-T019)
│   └── git_repo: /Users/lech/PROJECTS_all/LocalBrain
│
├── PROJECT: PROJECT_minerals
│   ├── database: minerals.db
│   ├── config: dev|prod
│   ├── agents: A, B, C
│   ├── tasks: 45 tasks
│   └── git_repo: /Users/lech/PROJECTS_all/PROJECT_minerals
│
├── PROJECT: PROJECT_pime
│   ├── database: pime.db
│   ├── config: dev|staging|prod
│   ├── agents: A, B, C, D
│   ├── tasks: 67 tasks
│   └── git_repo: /Users/lech/PROJECTS_all/PROJECT_pime
│
└── PROJECT: PROJECT_profilepro
    ├── database: profilepro.db
    ├── config: dev|prod
    ├── agents: A, B
    ├── tasks: 23 tasks
    └── git_repo: /Users/lech/PROJECTS_all/PROJECT_profilepro
```

### Directory Structure
```
/Users/lech/PROJECTS_all/
└── UNIVERSAL_MCP_REGISTRY/
    ├── projects/
    │   ├── LocalBrain/
    │   │   ├── registry.db           # Task database
    │   │   ├── project.json          # Project config
    │   │   └── agents.json           # Agent assignments
    │   ├── PROJECT_minerals/
    │   │   ├── registry.db
    │   │   ├── project.json
    │   │   └── agents.json
    │   └── PROJECT_pime/
    │       ├── registry.db
    │       ├── project.json
    │       └── agents.json
    │
    ├── src/
    │   ├── index.ts                  # Universal MCP server
    │   ├── ProjectRegistry.ts        # Multi-project manager
    │   ├── UniversalTaskStore.ts     # Cross-project queries
    │   └── tools/
    │       ├── listProjects.ts       # List all projects
    │       ├── switchProject.ts      # Change active project
    │       ├── getAvailableTasks.ts  # Query tasks (project-scoped)
    │       ├── claimTask.ts          # Claim task (project-scoped)
    │       └── getDashboard.ts       # Dashboard (all projects)
    │
    ├── cli/
    │   └── mcp-registry              # Universal CLI tool
    │
    └── config/
        └── projects.json             # Global project registry
```

---

## 🔧 CLI INTERFACE (Doppler-Style)

### Project Management
```bash
# List all projects
mcp-registry projects list

# Add new project
mcp-registry projects add PROJECT_name \
  --path /Users/lech/PROJECTS_all/PROJECT_name \
  --agents A,B,C \
  --config dev,staging,prod

# Get project info
mcp-registry projects info LocalBrain

# Switch default project
mcp-registry projects set-default LocalBrain
```

### Task Operations (Project-Scoped)
```bash
# Get available tasks for agent in project
mcp-registry --project LocalBrain --agent D getAvailableTasks

# Claim task
mcp-registry --project LocalBrain --agent D claimTask T019

# Update progress
mcp-registry --project LocalBrain updateProgress T019 \
  --percentage 75 \
  --files "TaskStore.ts,GitTracker.ts" \
  --notes "Database integration complete"

# Complete task
mcp-registry --project LocalBrain completeTask T019 \
  --deliverables "MCP server operational, 19 tasks loaded" \
  --minutes 180
```

### Cross-Project Queries
```bash
# Dashboard for all projects
mcp-registry dashboard --all

# Status for specific agent across all projects
mcp-registry agent-status D --all-projects

# Find agent availability
mcp-registry agents available --skills "UI,React"

# Cross-project task search
mcp-registry tasks search "authentication" --all-projects
```

### Configuration Management
```bash
# Get project config
mcp-registry --project LocalBrain config get

# Set project property
mcp-registry --project LocalBrain config set git_auto_verify true

# List agents in project
mcp-registry --project LocalBrain agents list

# Assign agent to project
mcp-registry --project PROJECT_minerals agents add E \
  --specialization "Backend" \
  --capacity 40
```

---

## 📊 DATABASE SCHEMA

### Global Projects Registry
```sql
-- projects.db (global registry)
CREATE TABLE projects (
  id TEXT PRIMARY KEY,                    -- "LocalBrain", "PROJECT_minerals"
  name TEXT NOT NULL,
  path TEXT NOT NULL,                     -- Absolute path to project
  git_repo TEXT NOT NULL,
  created_at TEXT NOT NULL,
  active BOOLEAN DEFAULT 1,
  config TEXT NOT NULL                    -- JSON: { dev: {...}, staging: {...}, prod: {...} }
);

CREATE TABLE project_agents (
  project_id TEXT NOT NULL,
  agent_letter TEXT NOT NULL,             -- A, B, C, D, E, F
  specialization TEXT NOT NULL,
  capacity_hours INTEGER DEFAULT 40,
  active BOOLEAN DEFAULT 1,
  PRIMARY KEY (project_id, agent_letter),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE global_agent_status (
  agent_letter TEXT PRIMARY KEY,          -- A, B, C, D, E, F
  current_project TEXT,                   -- Currently active project
  total_tasks_complete INTEGER DEFAULT 0,
  total_velocity_minutes INTEGER DEFAULT 0,
  last_active TEXT,
  FOREIGN KEY (current_project) REFERENCES projects(id)
);
```

### Project-Specific Task Database
```sql
-- projects/LocalBrain/registry.db
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  agent TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  phase TEXT NOT NULL,
  timeline TEXT NOT NULL,
  dependencies TEXT NOT NULL,           -- JSON array
  deliverables TEXT NOT NULL,          -- JSON array
  acceptance_criteria TEXT NOT NULL,   -- JSON array
  location TEXT NOT NULL,
  claimed_by TEXT,
  started_at TEXT,
  completed_at TEXT,
  estimated_hours REAL,
  actual_minutes REAL,
  files_created TEXT,                  -- JSON array
  velocity REAL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT NOT NULL,
  action TEXT NOT NULL,                 -- CREATED, CLAIMED, UPDATED, COMPLETED
  agent TEXT,
  timestamp TEXT NOT NULL,
  details TEXT,                         -- JSON
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
```

---

## 🎯 MCP TOOLS (Universal)

### 1. listProjects
```typescript
{
  name: "list_projects",
  description: "List all registered projects",
  inputSchema: {
    type: "object",
    properties: {
      activeOnly: { type: "boolean", default: true },
      includeStats: { type: "boolean", default: true }
    }
  }
}
```

### 2. getAvailableTasks (Project-Scoped)
```typescript
{
  name: "get_available_tasks",
  description: "Get available tasks for agent in specific project",
  inputSchema: {
    type: "object",
    properties: {
      project: { type: "string", required: true },  // NEW!
      agent: { type: "string", required: true },
      includeDetails: { type: "boolean", default: false }
    },
    required: ["project", "agent"]
  }
}
```

### 3. claimTask (Project-Scoped)
```typescript
{
  name: "claim_task",
  description: "Claim a task in specific project",
  inputSchema: {
    type: "object",
    properties: {
      project: { type: "string", required: true },  // NEW!
      taskId: { type: "string", required: true },
      agent: { type: "string", required: true }
    },
    required: ["project", "taskId", "agent"]
  }
}
```

### 4. getDashboard (Cross-Project)
```typescript
{
  name: "get_dashboard",
  description: "Get comprehensive dashboard for all or specific projects",
  inputSchema: {
    type: "object",
    properties: {
      projects: {
        type: "array",
        items: { type: "string" },
        description: "List of project IDs, or empty for all"
      },
      includeAgentStatus: { type: "boolean", default: true },
      includeVelocity: { type: "boolean", default: true }
    }
  }
}
```

### 5. agentStatus (Cross-Project)
```typescript
{
  name: "agent_status",
  description: "Get agent status across all projects",
  inputSchema: {
    type: "object",
    properties: {
      agent: { type: "string", required: true },
      projects: {
        type: "array",
        items: { type: "string" },
        description: "Filter by projects, or empty for all"
      }
    },
    required: ["agent"]
  }
}
```

---

## 🚀 CLIENT INTEGRATION

### Universal Client (TypeScript)
```typescript
import { UniversalMCPClient } from './UniversalMCPClient';

// Initialize client
const client = new UniversalMCPClient();

// List all projects
const projects = await client.listProjects();

// Work on LocalBrain
const localbrainTasks = await client.getAvailableTasks('LocalBrain', 'D');
await client.claimTask('LocalBrain', 'T019', 'D');
await client.updateProgress('LocalBrain', 'T019', 75);
await client.completeTask('LocalBrain', 'T019', ['files'], 180);

// Switch to PROJECT_minerals
const mineralsTasks = await client.getAvailableTasks('PROJECT_minerals', 'A');
await client.claimTask('PROJECT_minerals', 'T005', 'A');

// Cross-project dashboard
const dashboard = await client.getDashboard(['LocalBrain', 'PROJECT_minerals']);

// Agent status across all projects
const agentStatus = await client.getAgentStatus('D');
```

### CLI Usage in Agent Scripts
```bash
#!/bin/bash
# Agent A's daily workflow

# Check what project needs work
mcp-registry dashboard --all | grep "AVAILABLE"

# Work on LocalBrain
TASKS=$(mcp-registry --project LocalBrain --agent A getAvailableTasks)
if [ "$TASKS" != "0" ]; then
  # Claim first available task
  TASK_ID=$(echo "$TASKS" | jq -r '.tasks[0].id')
  mcp-registry --project LocalBrain --agent A claimTask $TASK_ID

  # Work on task...

  # Complete task
  mcp-registry --project LocalBrain completeTask $TASK_ID \
    --deliverables "Feature complete" \
    --minutes 120
fi

# Check PROJECT_minerals
TASKS=$(mcp-registry --project PROJECT_minerals --agent A getAvailableTasks)
# ... continue workflow
```

---

## 📁 PROJECT CONFIGURATION FILES

### Global Config (`/Users/lech/PROJECTS_all/UNIVERSAL_MCP_REGISTRY/config/projects.json`)
```json
{
  "projects": {
    "LocalBrain": {
      "id": "LocalBrain",
      "name": "LocalBrain + Orchestra Blue",
      "path": "/Users/lech/PROJECTS_all/LocalBrain",
      "gitRepo": "https://github.com/leolech14/LocalBrain",
      "active": true,
      "agents": ["A", "B", "C", "D", "E", "F"],
      "configs": ["dev", "staging", "prod"],
      "taskRegistry": "04_AGENT_FRAMEWORK/CENTRAL_TASK_REGISTRY.md"
    },
    "PROJECT_minerals": {
      "id": "PROJECT_minerals",
      "name": "Minerals Exploration Platform",
      "path": "/Users/lech/PROJECTS_all/PROJECT_minerals",
      "gitRepo": "https://github.com/leolech14/PROJECT_minerals",
      "active": true,
      "agents": ["A", "B", "C"],
      "configs": ["dev", "prod"],
      "taskRegistry": "docs/TASK_REGISTRY.md"
    },
    "PROJECT_pime": {
      "id": "PROJECT_pime",
      "name": "PIME Real Estate Platform",
      "path": "/Users/lech/PROJECTS_all/PROJECT_pime",
      "gitRepo": "https://github.com/leolech14/PROJECT_pime",
      "active": true,
      "agents": ["A", "B", "C", "D"],
      "configs": ["dev", "staging", "prod"],
      "taskRegistry": "PRODUCT/TASK_REGISTRY.md"
    }
  },
  "defaultProject": "LocalBrain"
}
```

### Project-Specific Config (`projects/LocalBrain/project.json`)
```json
{
  "id": "LocalBrain",
  "name": "LocalBrain + Orchestra Blue",
  "path": "/Users/lech/PROJECTS_all/LocalBrain",
  "gitRepo": "https://github.com/leolech14/LocalBrain",
  "created": "2025-10-08T00:00:00Z",
  "agents": {
    "A": { "specialization": "UI", "capacity": 40, "active": true },
    "B": { "specialization": "Architecture", "capacity": 40, "active": true },
    "C": { "specialization": "Backend", "capacity": 40, "active": true },
    "D": { "specialization": "Integration", "capacity": 40, "active": true },
    "E": { "specialization": "Coherence", "capacity": 80, "active": true },
    "F": { "specialization": "Strategic", "capacity": 20, "active": true }
  },
  "configs": {
    "dev": {
      "gitAutoVerify": true,
      "progressTracking": true,
      "velocityMetrics": true
    },
    "staging": {
      "gitAutoVerify": true,
      "progressTracking": true,
      "velocityMetrics": false
    },
    "prod": {
      "gitAutoVerify": true,
      "progressTracking": false,
      "velocityMetrics": false
    }
  },
  "taskRegistry": "04_AGENT_FRAMEWORK/CENTRAL_TASK_REGISTRY.md",
  "stats": {
    "totalTasks": 19,
    "completed": 13,
    "inProgress": 1,
    "available": 2,
    "blocked": 2
  }
}
```

---

## 🎯 IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Current - Single Project) ✅
- [x] Single-project MCP server
- [x] SQLite database per project
- [x] 6 MCP tools (project-specific)
- [x] TaskRegistryClient wrapper
- [x] Git verification system

### Phase 2: Universal Architecture (Next - Multi-Project)
- [ ] Global projects registry database
- [ ] Project-scoped MCP tools
- [ ] Universal CLI tool (`mcp-registry`)
- [ ] Cross-project query capabilities
- [ ] UniversalMCPClient wrapper
- [ ] Multi-project dashboard

### Phase 3: Advanced Features (Future)
- [ ] Agent skills matching across projects
- [ ] Automatic agent allocation
- [ ] Cross-project dependency tracking
- [ ] Resource optimization (agent time)
- [ ] Velocity analytics across projects
- [ ] Project health monitoring

### Phase 4: Enterprise Features (Advanced)
- [ ] Multi-user access control
- [ ] Role-based permissions
- [ ] Audit logging
- [ ] API rate limiting
- [ ] Webhook integrations
- [ ] Cloud deployment

---

## 🚀 DOPPLER COMPARISON

### Doppler's Strengths (Apply to MCP)
```bash
# 1. Clear hierarchy
doppler secrets --project NAME --config ENV get KEY
mcp-registry --project NAME --config ENV getTask ID

# 2. Universal access
doppler secrets get --project any-project
mcp-registry tasks list --project any-project

# 3. Environment separation
doppler run --project NAME --config dev -- command
mcp-registry run --project NAME --config dev -- agent-script

# 4. Simple CLI
doppler login
doppler setup
mcp-registry init
mcp-registry setup

# 5. Cross-project operations
doppler projects list
mcp-registry projects list
```

### Key Parallels
| Doppler Feature | MCP Equivalent |
|----------------|----------------|
| Projects | Projects (LocalBrain, PROJECT_minerals) |
| Configs (dev, staging, prod) | Configs (dev, staging, prod) |
| Secrets | Tasks |
| Service Tokens | Agent Credentials |
| CLI Tool | `mcp-registry` CLI |
| Dashboard | Multi-project dashboard |
| API | MCP JSON-RPC 2.0 |

---

## 💡 REVOLUTIONARY BENEFITS

### For Lech (Human)
- **Single Command Access**: `mcp-registry --project X` to manage any project
- **Clear Visibility**: Dashboard showing all projects and agents
- **Centralized Control**: One system managing entire PROJECTS_all ecosystem
- **Doppler Familiarity**: Same mental model as existing tools

### For Agents (AI)
- **Cross-Project Awareness**: Agents can see work across all projects
- **Resource Optimization**: Know when to switch between projects
- **Consistent Interface**: Same tools work across all projects
- **Collaborative Intelligence**: Share learnings between projects

### For Projects
- **Unified Management**: All projects use same coordination system
- **Pattern Reuse**: Success patterns propagate across projects
- **Quality Standards**: Consistent task tracking everywhere
- **Velocity Metrics**: Compare and optimize across projects

---

## 🎯 NEXT STEPS

### Immediate (Current Session)
1. ✅ Complete LocalBrain MCP operational verification
2. ✅ Document current single-project architecture
3. ⏭️ Design Universal MCP architecture (this document)

### Short-Term (Next Sprint)
1. Create global projects registry database
2. Extend MCP tools to accept project parameter
3. Build Universal CLI tool (`mcp-registry`)
4. Migrate LocalBrain to universal system

### Medium-Term (Next 2 Weeks)
1. Add PROJECT_minerals to registry
2. Add PROJECT_pime to registry
3. Implement cross-project dashboard
4. Build UniversalMCPClient

### Long-Term (Next Month)
1. Add all PROJECTS_all projects
2. Implement advanced analytics
3. Build web dashboard
4. Deploy centralized MCP hub

---

## 📊 SUCCESS METRICS

### Technical Metrics
- **Response Time**: < 50ms for cross-project queries
- **Database Size**: < 100MB for all projects
- **CLI Performance**: < 200ms for any operation
- **Uptime**: 99.9% availability

### Business Metrics
- **Project Coverage**: 100% of PROJECTS_all projects
- **Agent Utilization**: >80% of agent capacity allocated
- **Task Completion**: >90% of tasks completed on time
- **Cross-Project Learning**: Patterns shared between ≥3 projects

---

**Vision by**: Lech
**Architect**: Agent D (Integration Specialist)
**Date**: 2025-10-08
**Impact**: Revolutionary - Transforms project management from siloed to unified
**Inspiration**: Doppler's elegant project/config hierarchy

**Status**: 🎯 DESIGN COMPLETE - READY FOR IMPLEMENTATION
