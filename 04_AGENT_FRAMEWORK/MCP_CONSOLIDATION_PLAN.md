# MCP Consolidation Plan - Single Unified System
## All Features in ONE MCP Server

**Date**: 2025-10-08
**Architect**: Agent D + Lech
**Status**: 🎯 IMPLEMENTATION READY
**Goal**: Consolidate ALL MCP functionality into single server

---

## 🎯 THE VISION - ONE UNIFIED SYSTEM

```
┌────────────────────────────────────────────────────────────┐
│ SINGLE MCP SERVER                                          │
│ Location: 01_CODEBASES/mcp-servers/localbrain-task-registry│
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ✅ Task Management (6 tools)                              │
│    - get_available_tasks                                  │
│    - claim_task                                           │
│    - update_progress                                      │
│    - complete_task                                        │
│    - get_dashboard                                        │
│    - get_agent_status                                     │
│                                                            │
│ ✅ Agent Intelligence (6 NEW tools)                       │
│    - agent_connect        ← Automatic on connection      │
│    - agent_heartbeat      ← Every 30s                    │
│    - agent_disconnect     ← Automatic on exit            │
│    - get_agent_timeline   ← Activity history            │
│    - get_swarm_dashboard  ← Real-time coordination      │
│    - get_analytics        ← Performance metrics         │
│                                                            │
│ ✅ Single Database (registry.db)                          │
│    - tasks                 ← Existing                    │
│    - agent_sessions        ← NEW                         │
│    - agent_activity        ← NEW                         │
│    - agent_presence        ← NEW                         │
│    - agent_metrics         ← NEW                         │
│    - agent_collaboration   ← NEW                         │
│                                                            │
│ ✅ Live Dashboard (http://localhost:3000)                 │
│    - Real-time agent status                              │
│    - Task progress visualization                         │
│    - Performance analytics                               │
│    - Activity timeline                                   │
│                                                            │
│ ✅ Single Client (TaskRegistryClient)                     │
│    - Automatic session tracking                          │
│    - Auto heartbeat (every 30s)                          │
│    - Activity logging (all operations)                   │
│    - Graceful disconnect                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 📁 CONSOLIDATED DIRECTORY STRUCTURE

```
01_CODEBASES/mcp-servers/localbrain-task-registry/
├── src/
│   ├── index.ts                        # ✅ EXISTING - Main MCP server
│   │
│   ├── database/                       # 🔄 ENHANCED
│   │   ├── Database.ts                 # ✅ EXISTING - SQLite wrapper
│   │   ├── migrations/                 # 🆕 NEW - Schema migrations
│   │   │   ├── 001_initial_tasks.sql   # ✅ Existing schema
│   │   │   └── 002_agent_intelligence.sql  # 🆕 NEW intelligence tables
│   │   └── schema.sql                  # 🔄 UPDATED - Complete schema
│   │
│   ├── registry/                       # ✅ EXISTING - Task management
│   │   ├── TaskStore.ts                # ✅ EXISTING
│   │   ├── TaskRegistry.ts             # ✅ EXISTING
│   │   ├── DependencyResolver.ts       # ✅ EXISTING
│   │   └── GitTracker.ts               # ✅ EXISTING
│   │
│   ├── intelligence/                   # 🆕 NEW - Agent intelligence
│   │   ├── SessionManager.ts           # Manages agent sessions
│   │   ├── ActivityLogger.ts           # Logs all MCP operations
│   │   ├── PresenceTracker.ts          # Real-time agent presence
│   │   ├── MetricsAggregator.ts        # Daily performance metrics
│   │   └── AnalyticsEngine.ts          # Performance analytics
│   │
│   ├── tools/                          # 🔄 ENHANCED - MCP tools
│   │   ├── tasks/                      # ✅ EXISTING - Task tools
│   │   │   ├── getAvailableTasks.ts
│   │   │   ├── claimTask.ts
│   │   │   ├── updateProgress.ts
│   │   │   ├── completeTask.ts
│   │   │   ├── getDashboard.ts
│   │   │   └── getAgentStatus.ts
│   │   │
│   │   ├── intelligence/               # 🆕 NEW - Intelligence tools
│   │   │   ├── agentConnect.ts
│   │   │   ├── agentHeartbeat.ts
│   │   │   ├── agentDisconnect.ts
│   │   │   ├── getAgentTimeline.ts
│   │   │   ├── getSwarmDashboard.ts
│   │   │   └── getAnalytics.ts
│   │   │
│   │   └── index.ts                    # 🔄 UPDATED - Register all 12 tools
│   │
│   ├── dashboard/                      # 🆕 NEW - Web dashboard
│   │   ├── server.ts                   # Express + WebSocket server
│   │   ├── public/
│   │   │   ├── index.html              # Dashboard UI
│   │   │   ├── styles.css              # Styling
│   │   │   └── app.js                  # Frontend logic
│   │   └── routes/
│   │       ├── agents.ts               # Agent endpoints
│   │       ├── tasks.ts                # Task endpoints
│   │       └── analytics.ts            # Analytics endpoints
│   │
│   ├── types/                          # 🔄 ENHANCED - TypeScript types
│   │   ├── Task.ts                     # ✅ EXISTING
│   │   ├── Agent.ts                    # 🆕 NEW - Agent types
│   │   ├── Session.ts                  # 🆕 NEW - Session types
│   │   └── Intelligence.ts             # 🆕 NEW - Intelligence types
│   │
│   └── utils/
│       ├── logger.ts                   # ✅ EXISTING
│       └── machineId.ts                # 🆕 NEW - Machine identification
│
├── data/
│   └── registry.db                     # 🔄 ENHANCED - Single database
│       ├── tasks table                 # ✅ EXISTING
│       ├── agent_sessions              # 🆕 NEW
│       ├── agent_activity              # 🆕 NEW
│       ├── agent_presence              # 🆕 NEW
│       ├── agent_metrics               # 🆕 NEW
│       └── agent_collaboration         # 🆕 NEW
│
├── scripts/
│   ├── load-localbrain-tasks.ts        # ✅ EXISTING
│   ├── migrate-database.ts             # 🆕 NEW - Run migrations
│   └── seed-intelligence.ts            # 🆕 NEW - Seed intelligence data
│
├── dist/                               # Compiled output
├── node_modules/                       # Dependencies
├── package.json                        # 🔄 UPDATED - Add new deps
└── tsconfig.json                       # ✅ EXISTING

Legend:
✅ EXISTING - Already built
🔄 ENHANCED - Update existing file
🆕 NEW - Create new file
```

---

## 🗄️ CONSOLIDATED DATABASE SCHEMA

### **Single Database: `registry.db`**

```sql
-- ============================================
-- EXISTING TABLES (KEEP AS-IS)
-- ============================================

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  agent TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  phase TEXT NOT NULL,
  timeline TEXT NOT NULL,
  dependencies TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  acceptance_criteria TEXT NOT NULL,
  location TEXT NOT NULL,
  claimed_by TEXT,
  started_at TEXT,
  completed_at TEXT,
  estimated_hours REAL,
  actual_minutes REAL,
  files_created TEXT,
  velocity REAL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NEW INTELLIGENCE TABLES
-- ============================================

-- Agent Sessions (connection tracking)
CREATE TABLE agent_sessions (
  id TEXT PRIMARY KEY,
  agent_letter TEXT NOT NULL,
  agent_model TEXT NOT NULL,
  project_id TEXT NOT NULL,
  connected_at TEXT NOT NULL,
  disconnected_at TEXT,
  last_heartbeat TEXT NOT NULL,
  machine_id TEXT,
  session_duration_minutes INTEGER,
  total_queries INTEGER DEFAULT 0,
  tasks_claimed INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE'
);

CREATE INDEX idx_sessions_agent ON agent_sessions(agent_letter);
CREATE INDEX idx_sessions_status ON agent_sessions(status);
CREATE INDEX idx_sessions_connected ON agent_sessions(connected_at);

-- Agent Activity Log (all MCP operations)
CREATE TABLE agent_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  agent_letter TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  task_id TEXT,
  details TEXT,
  duration_ms INTEGER,
  FOREIGN KEY (session_id) REFERENCES agent_sessions(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE INDEX idx_activity_session ON agent_activity(session_id);
CREATE INDEX idx_activity_agent ON agent_activity(agent_letter);
CREATE INDEX idx_activity_timestamp ON agent_activity(timestamp);
CREATE INDEX idx_activity_type ON agent_activity(activity_type);

-- Agent Presence (current status)
CREATE TABLE agent_presence (
  agent_letter TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  current_session_id TEXT,
  current_task_id TEXT,
  last_seen TEXT NOT NULL,
  online_since TEXT,
  total_sessions_today INTEGER DEFAULT 0,
  total_active_time_minutes INTEGER DEFAULT 0,
  tasks_today INTEGER DEFAULT 0,
  FOREIGN KEY (current_session_id) REFERENCES agent_sessions(id),
  FOREIGN KEY (current_task_id) REFERENCES tasks(id)
);

-- Agent Performance Metrics (daily aggregation)
CREATE TABLE agent_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_letter TEXT NOT NULL,
  metric_date TEXT NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_active_minutes INTEGER DEFAULT 0,
  tasks_claimed INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  average_task_minutes REAL,
  velocity_score REAL,
  quality_score REAL,
  collaboration_score REAL,
  UNIQUE(agent_letter, metric_date)
);

CREATE INDEX idx_metrics_agent_date ON agent_metrics(agent_letter, metric_date);

-- Agent Collaboration Events
CREATE TABLE agent_collaboration (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  agent_from TEXT NOT NULL,
  agent_to TEXT NOT NULL,
  collaboration_type TEXT NOT NULL,
  task_id TEXT,
  details TEXT,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE INDEX idx_collab_from ON agent_collaboration(agent_from);
CREATE INDEX idx_collab_to ON agent_collaboration(agent_to);
CREATE INDEX idx_collab_timestamp ON agent_collaboration(timestamp);
```

---

## 🔧 CONSOLIDATED MCP TOOLS (12 Total)

### **Existing Task Management Tools (6)**
1. ✅ `get_available_tasks` - Query tasks for agent
2. ✅ `claim_task` - Claim a task
3. ✅ `update_progress` - Update task progress
4. ✅ `complete_task` - Mark task complete
5. ✅ `get_dashboard` - Project dashboard
6. ✅ `get_agent_status` - Agent status

### **New Intelligence Tools (6)**
7. 🆕 `agent_connect` - Register connection (automatic)
8. 🆕 `agent_heartbeat` - Heartbeat ping (every 30s)
9. 🆕 `agent_disconnect` - Close session (automatic)
10. 🆕 `get_agent_timeline` - Activity history
11. 🆕 `get_swarm_dashboard` - Real-time swarm view
12. 🆕 `get_analytics` - Performance analytics

**All registered in single `src/tools/index.ts`**

---

## 📦 ENHANCED PACKAGE.JSON

```json
{
  "name": "@localbrain/task-registry",
  "version": "2.0.0",
  "description": "Unified MCP task registry + agent intelligence",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "migrate": "tsx scripts/migrate-database.ts",
    "dashboard": "tsx src/dashboard/server.ts",
    "load-tasks": "tsx scripts/load-localbrain-tasks.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "better-sqlite3": "^11.0.0",
    "express": "^4.18.2",
    "ws": "^8.16.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.9",
    "@types/express": "^4.17.21",
    "@types/node": "^20.0.0",
    "@types/ws": "^8.5.10",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

---

## 🔄 ENHANCED CLIENT - AUTOMATIC INTELLIGENCE

```typescript
// 04_AGENT_FRAMEWORK/mcp-integration/TaskRegistryClient.ts (ENHANCED)

import { v4 as uuidv4 } from 'uuid';
import { getMachineId } from './utils';

export class TaskRegistryClient {
  private sessionId: string;
  private agent: string;
  private heartbeatInterval: NodeJS.Timeout;
  private connected: boolean = false;

  constructor(agentLetter: string) {
    this.agent = agentLetter;
    this.connect();
  }

  private async connect() {
    // 1. Spawn MCP server (existing)
    this.spawnServer();

    // 2. Register session (NEW - automatic)
    this.sessionId = await this.registerSession();

    // 3. Start heartbeat (NEW - automatic)
    this.startHeartbeat();

    this.connected = true;
    console.log(`✅ Agent ${this.agent} connected - Session ${this.sessionId}`);
  }

  private async registerSession() {
    const response = await this.call('agent_connect', {
      agent: this.agent,
      model: this.detectModel(),
      project: 'LocalBrain',
      machineId: getMachineId()
    });

    return response.sessionId;
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(async () => {
      if (!this.connected) return;

      await this.call('agent_heartbeat', {
        sessionId: this.sessionId,
        currentActivity: this.getCurrentActivity()
      });
    }, 30000); // Every 30 seconds
  }

  // Existing methods now with automatic activity logging
  async claimTask(taskId: string) {
    await this.logActivity('CLAIM', taskId);
    return await this.call('claim_task', { taskId, agent: this.agent });
  }

  async updateProgress(taskId: string, percentage: number, files: string[], notes: string) {
    await this.logActivity('UPDATE', taskId, { percentage, files, notes });
    return await this.call('update_progress', { taskId, percentage, files, notes });
  }

  async completeTask(taskId: string, deliverables: string[], minutes: number) {
    await this.logActivity('COMPLETE', taskId, { deliverables, minutes });
    return await this.call('complete_task', { taskId, deliverables, minutes });
  }

  private async logActivity(type: string, taskId?: string, details?: any) {
    // Automatically logged in database via MCP
    // No manual tracking needed!
  }

  disconnect() {
    clearInterval(this.heartbeatInterval);
    this.connected = false;

    this.call('agent_disconnect', { sessionId: this.sessionId });
    this.server.kill();

    console.log(`👋 Agent ${this.agent} disconnected - Session ${this.sessionId}`);
  }
}
```

**Key: Client automatically handles ALL intelligence tracking!**

---

## 🎯 IMPLEMENTATION SEQUENCE

### **Phase 1: Database Migration** (30 min)
```bash
# 1. Create migration script
scripts/migrate-database.ts

# 2. Add intelligence tables
migrations/002_agent_intelligence.sql

# 3. Run migration
npm run migrate

# Result: registry.db now has 6 tables (1 existing + 5 new)
```

### **Phase 2: Intelligence Layer** (2 hours)
```bash
# 1. Create intelligence modules
src/intelligence/SessionManager.ts
src/intelligence/ActivityLogger.ts
src/intelligence/PresenceTracker.ts
src/intelligence/MetricsAggregator.ts
src/intelligence/AnalyticsEngine.ts

# 2. Add intelligence tools
src/tools/intelligence/agentConnect.ts
src/tools/intelligence/agentHeartbeat.ts
src/tools/intelligence/agentDisconnect.ts
src/tools/intelligence/getAgentTimeline.ts
src/tools/intelligence/getSwarmDashboard.ts
src/tools/intelligence/getAnalytics.ts

# 3. Update tools index
src/tools/index.ts (register all 12 tools)
```

### **Phase 3: Client Enhancement** (1 hour)
```bash
# Update existing client
04_AGENT_FRAMEWORK/mcp-integration/TaskRegistryClient.ts

# Add automatic features:
- Session registration on connect
- Heartbeat every 30s
- Activity logging (all operations)
- Graceful disconnect
```

### **Phase 4: Dashboard** (2 hours)
```bash
# Create dashboard server
src/dashboard/server.ts

# Create UI
src/dashboard/public/index.html
src/dashboard/public/app.js
src/dashboard/public/styles.css

# Add API routes
src/dashboard/routes/*.ts
```

### **Phase 5: Testing** (1 hour)
```bash
# Test intelligence tracking
npm run test:intelligence

# Test dashboard
npm run dashboard

# Test full flow with client
npm run test:e2e
```

**Total Implementation Time: ~6-7 hours**

---

## ✅ SUCCESS CRITERIA

1. **Single Database**: All 6 tables in registry.db
2. **12 MCP Tools**: All registered and working
3. **Automatic Tracking**: Client logs all activities without manual code
4. **Live Dashboard**: Real-time agent status at localhost:3000
5. **Zero Fragmentation**: ONE MCP server, ONE database, ONE client

---

## 🚀 LAUNCH COMMANDS

```bash
# Start unified MCP server
cd 01_CODEBASES/mcp-servers/localbrain-task-registry
npm run dev

# Start dashboard (separate terminal)
npm run dashboard

# Agents connect (automatic intelligence tracking)
const client = new TaskRegistryClient('A');
```

**Everything consolidated into SINGLE unified system!**

---

**Architect**: Agent D + Lech
**Date**: 2025-10-08
**Status**: 🎯 READY TO IMPLEMENT
**Impact**: REVOLUTIONARY - Unified MCP with complete intelligence
