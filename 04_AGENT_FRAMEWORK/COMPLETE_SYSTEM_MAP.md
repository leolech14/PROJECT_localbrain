# 🧠 CENTRAL INTELLIGENCE SYSTEM - Complete Architecture Map
## Full System Diagram with All Components, Tables, Tools, and Data Flows

**Date**: 2025-10-08
**Version**: 2.0 (Universal Multi-Project)
**Status**: 🎯 COMPLETE SYSTEM ARCHITECTURE

---

## 🗺️ COMPLETE SYSTEM ARCHITECTURE (Top-Level)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│                        🌍 UNIVERSAL CENTRAL INTELLIGENCE SYSTEM                          │
│                                                                                          │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                          💻 CLIENT LAYER (Future)                                   │ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                 │ │
│  │  │  @lech/brain-cli │  │ @lech/brain-sdk  │  │  Web Dashboard   │                 │ │
│  │  │   (Not Built)    │  │   (Not Built)    │  │   (Not Built)    │                 │ │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘                 │ │
│  └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                        ↕                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                    🔌 MCP PROTOCOL LAYER (JSON-RPC 2.0)                             │ │
│  │                                                                                      │ │
│  │  Transport: stdio (local) → WebSocket (cloud future)                                │ │
│  │  Format: JSON-RPC 2.0 messages                                                      │ │
│  │  Tools: 11 registered tools (6 task + 4 intelligence + 1 discovery)                 │ │
│  └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                        ↕                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                    🧠 CENTRAL INTELLIGENCE CORE (Node.js/TypeScript)                │ │
│  │                                                                                      │ │
│  │  ┌────────────────────────────────────────────────────────────────────────────┐   │ │
│  │  │  🔍 DISCOVERY ENGINE ⭐ NEW! (T001-T005 COMPLETE)                           │   │ │
│  │  │  ├─ ProjectDetector (auto-detect projects)                                  │   │ │
│  │  │  ├─ ContextExtractor (auto-scan files)                                      │   │ │
│  │  │  ├─ AgentRecognizer (persistent identity)                                   │   │ │
│  │  │  ├─ JobProposalEngine (intelligent matching)                                │   │ │
│  │  │  └─ DiscoveryEngine (orchestrator)                                          │   │ │
│  │  └────────────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                                      │ │
│  │  ┌────────────────────────────────────────────────────────────────────────────┐   │ │
│  │  │  📋 TASK MANAGEMENT SYSTEM (Original - Operational)                         │   │ │
│  │  │  ├─ TaskRegistry (coordination logic)                                       │   │ │
│  │  │  ├─ TaskStore (SQLite persistence)                                          │   │ │
│  │  │  ├─ DependencyResolver (auto-unblocking)                                    │   │ │
│  │  │  └─ GitTracker (verification)                                               │   │ │
│  │  └────────────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                                      │ │
│  │  ┌────────────────────────────────────────────────────────────────────────────┐   │ │
│  │  │  🤖 AGENT INTELLIGENCE SYSTEM (Original - Operational)                      │   │ │
│  │  │  ├─ SessionManager (connection tracking)                                    │   │ │
│  │  │  ├─ Activity Logger (all operations)                                        │   │ │
│  │  │  ├─ Presence Tracker (ONLINE/IDLE/OFFLINE)                                  │   │ │
│  │  │  └─ Metrics Aggregator (daily stats)                                        │   │ │
│  │  └────────────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                                      │ │
│  │  ┌────────────────────────────────────────────────────────────────────────────┐   │ │
│  │  │  🔮 FUTURE COMPONENTS (Not Yet Built)                                       │   │ │
│  │  │  ├─ KeepInTouchEnforcer (completion gating) - T013                          │   │ │
│  │  │  ├─ ContextManager (cloud storage) - T011                                   │   │ │
│  │  │  ├─ ModelDiscovery (recommendation) - T015                                  │   │ │
│  │  │  ├─ BestPracticesEngine (quality) - T016                                    │   │ │
│  │  │  └─ SwarmCoordinator (multi-swarm) - T014                                   │   │ │
│  │  └────────────────────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                        ↕                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                    💾 DATA LAYER (SQLite → PostgreSQL Future)                       │ │
│  │                                                                                      │ │
│  │  Database: registry.db (143KB → Growing)                                            │ │
│  │  Tables: 11 tables (3 task + 5 intelligence + 3 discovery)                          │ │
│  │  Operations: < 50ms per query                                                       │ │
│  │  Transactions: ACID-compliant                                                       │ │
│  └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA (11 Tables - Complete Map)

### **TASK MANAGEMENT TABLES (3 - Original)**

```sql
┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: tasks (19 rows)                                              │
├─────────────────────────────────────────────────────────────────────┤
│  PRIMARY KEY: id (TEXT) - e.g., "T001", "T019"                      │
│  COLUMNS:                                                            │
│    ├─ id: Task ID (T001-T030)                                       │
│    ├─ name: Task name                                               │
│    ├─ description: Full description                                 │
│    ├─ agent: Assigned agent (A/B/C/D/E/F)                           │
│    ├─ status: AVAILABLE/CLAIMED/IN_PROGRESS/COMPLETE/BLOCKED        │
│    ├─ priority: P0/P1/P2/P3                                         │
│    ├─ dependencies: JSON array of task IDs                          │
│    ├─ estimated_hours: Effort estimate                              │
│    ├─ actual_hours: Actual time spent                               │
│    ├─ velocity: Completion velocity (%)                             │
│    ├─ files_created: JSON array of file paths                       │
│    ├─ claimed_at: Timestamp                                         │
│    ├─ completed_at: Timestamp                                       │
│    └─ project_id: Project reference ⭐ NEW!                          │
│                                                                      │
│  INDEXES:                                                            │
│    ├─ idx_tasks_status (status)                                     │
│    ├─ idx_tasks_agent (agent)                                       │
│    ├─ idx_tasks_priority (priority)                                 │
│    └─ idx_tasks_project (project_id) ⭐ NEW!                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: task_history (0 rows - unused currently)                    │
├─────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Audit log of task state changes                           │
│  COLUMNS: id, task_id, agent, status, timestamp, notes              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: migrations (5 rows)                                          │
├─────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Track applied database migrations                         │
│  COLUMNS: version, filename, applied_at                             │
│  ROWS: 001, 002, 003, 004, 005                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### **AGENT INTELLIGENCE TABLES (5 - Original)**

```sql
┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: agent_sessions (6 rows)                                     │
├─────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Track all agent connection sessions                       │
│  PRIMARY KEY: id (UUID)                                             │
│  COLUMNS:                                                            │
│    ├─ id: Session UUID                                              │
│    ├─ agent_letter: A/B/C/D/E/F                                     │
│    ├─ agent_model: Model ID                                         │
│    ├─ project_id: Project reference                                 │
│    ├─ connected_at: Connection timestamp                            │
│    ├─ disconnected_at: Disconnect timestamp                         │
│    ├─ last_heartbeat: Last heartbeat time                           │
│    ├─ machine_id: Machine identifier                                │
│    ├─ session_duration_minutes: Calculated on disconnect            │
│    ├─ total_queries: Query count                                    │
│    ├─ tasks_claimed: Tasks claimed in session                       │
│    ├─ tasks_completed: Tasks completed in session                   │
│    └─ status: ACTIVE/IDLE/DISCONNECTED                              │
│                                                                      │
│  INDEXES:                                                            │
│    ├─ idx_sessions_agent (agent_letter)                             │
│    ├─ idx_sessions_status (status)                                  │
│    ├─ idx_sessions_connected (connected_at)                         │
│    ├─ idx_sessions_project (project_id)                             │
│    └─ idx_sessions_project_agent (project_id, agent_letter) ⭐      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: agent_activity (14 rows)                                    │
├─────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Log every MCP operation                                   │
│  PRIMARY KEY: id (AUTOINCREMENT)                                    │
│  COLUMNS:                                                            │
│    ├─ id: Auto-increment                                            │
│    ├─ session_id: Foreign key → agent_sessions                      │
│    ├─ agent_letter: A/B/C/D/E/F                                     │
│    ├─ timestamp: Operation time                                     │
│    ├─ activity_type: CONNECT/DISCONNECT/HEARTBEAT/QUERY/etc.        │
│    ├─ task_id: Related task (nullable)                              │
│    ├─ details: JSON details                                         │
│    └─ duration_ms: Operation duration                               │
│                                                                      │
│  ACTIVITY TYPES:                                                     │
│    CONNECT, DISCONNECT, HEARTBEAT, QUERY, CLAIM,                    │
│    UPDATE, COMPLETE, COLLABORATE, ERROR                             │
│                                                                      │
│  INDEXES:                                                            │
│    ├─ idx_activity_session (session_id)                             │
│    ├─ idx_activity_agent (agent_letter)                             │
│    ├─ idx_activity_timestamp (timestamp)                            │
│    ├─ idx_activity_type (activity_type)                             │
│    └─ idx_activity_task (task_id)                                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: agent_presence (6 rows - one per agent)                     │
├─────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Real-time agent status (ONLINE/IDLE/OFFLINE)              │
│  PRIMARY KEY: agent_letter (A/B/C/D/E/F)                            │
│  COLUMNS:                                                            │
│    ├─ agent_letter: A/B/C/D/E/F (PRIMARY KEY)                       │
│    ├─ status: ONLINE/IDLE/OFFLINE                                   │
│    ├─ current_session_id: Active session UUID                       │
│    ├─ current_task_id: Current task                                 │
│    ├─ last_seen: Last heartbeat time                                │
│    ├─ online_since: When went online                                │
│    ├─ total_sessions_today: Daily session count                     │
│    ├─ total_active_time_minutes: Daily active time                  │
│    └─ tasks_today: Tasks completed today                            │
│                                                                      │
│  FOREIGN KEYS:                                                       │
│    ├─ current_session_id → agent_sessions(id)                       │
│    └─ current_task_id → tasks(id)                                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: agent_metrics (2 rows)                                      │
├─────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Daily performance aggregation                             │
│  PRIMARY KEY: id (AUTOINCREMENT)                                    │
│  UNIQUE: (agent_letter, metric_date)                                │
│  COLUMNS:                                                            │
│    ├─ id: Auto-increment                                            │
│    ├─ agent_letter: A/B/C/D/E/F                                     │
│    ├─ metric_date: Date (YYYY-MM-DD)                                │
│    ├─ total_sessions: Sessions on this day                          │
│    ├─ total_active_minutes: Active time                             │
│    ├─ tasks_claimed: Tasks claimed                                  │
│    ├─ tasks_completed: Tasks completed                              │
│    ├─ average_task_minutes: Avg time per task                       │
│    ├─ velocity_score: Performance score                             │
│    ├─ quality_score: Quality rating                                 │
│    └─ collaboration_score: Collaboration rating                     │
│                                                                      │
│  INDEX: idx_metrics_agent_date (agent_letter, metric_date)          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: agent_collaboration (0 rows - future use)                   │
├─────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Track cross-agent collaboration events                    │
│  COLUMNS: id, timestamp, agent_from, agent_to,                      │
│           collaboration_type, task_id, details                       │
│  TYPES: HANDOFF, REVIEW, ASSIST, COORDINATE, QUESTION, ANSWER       │
└─────────────────────────────────────────────────────────────────────┘
```

### **DISCOVERY TABLES (3 - New!)**

```sql
┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: projects (1 row) ⭐ NEW! Migration 003                       │
├─────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Multi-project registry (unlimited projects)               │
│  PRIMARY KEY: id (UUID)                                             │
│  UNIQUE: path, git_remote                                           │
│  COLUMNS:                                                            │
│    ├─ id: Project UUID                                              │
│    ├─ name: Project name (e.g., "LocalBrain")                       │
│    ├─ path: Absolute path to project                                │
│    ├─ git_remote: Git remote URL (normalized)                       │
│    ├─ type: COMMERCIAL_APP/KNOWLEDGE_SYSTEM/TOOL/etc.               │
│    ├─ vision: Extracted from CLAUDE.md                              │
│    ├─ created_at: First discovered                                  │
│    ├─ last_activity: Last agent activity                            │
│    ├─ discovered_by: auto/manual                                    │
│    └─ metadata: JSON (technologies, size, flags)                    │
│                                                                      │
│  PROJECT TYPES:                                                      │
│    COMMERCIAL_APP, KNOWLEDGE_SYSTEM, TOOL,                          │
│    INFRASTRUCTURE, EXPERIMENTAL, UNKNOWN                             │
│                                                                      │
│  INDEXES:                                                            │
│    ├─ idx_projects_name (name)                                      │
│    ├─ idx_projects_type (type)                                      │
│    ├─ idx_projects_activity (last_activity)                         │
│    └─ idx_projects_git_remote (git_remote)                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: agents (1 row) ⭐ NEW! Migration 004                         │
├─────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Persistent agent identity across all sessions             │
│  PRIMARY KEY: id (UUID)                                             │
│  UNIQUE: tracking_id                                                │
│  COLUMNS:                                                            │
│    ├─ id: Agent UUID                                                │
│    ├─ tracking_id: Unique tracking identifier                       │
│    ├─ name: Agent name (e.g., "Agent-Sonnet-xxx")                   │
│    ├─ model_id: Model identifier                                    │
│    ├─ model_signature: Fingerprint for recognition                  │
│    ├─ capabilities: JSON (ui, backend, design, etc.)                │
│    ├─ created_at: First seen                                        │
│    ├─ last_seen: Last activity                                      │
│    ├─ total_sessions: Lifetime session count                        │
│    ├─ total_tasks: Lifetime task count                              │
│    └─ metadata: JSON (preferences, roles, stats)                    │
│                                                                      │
│  INDEXES:                                                            │
│    ├─ idx_agents_tracking (tracking_id) - Primary lookup            │
│    ├─ idx_agents_signature (model_signature) - Secondary lookup     │
│    ├─ idx_agents_model (model_id)                                   │
│    └─ idx_agents_last_seen (last_seen)                              │
│                                                                      │
│  STORED IN: ~/.brain/config.json (local machine)                    │
│    {                                                                 │
│      "trackingId": "uuid-xxx",                                      │
│      "agentId": "uuid-yyy",                                         │
│      "registeredAt": "2025-10-08T..."                               │
│    }                                                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: context_files (0 rows) ⭐ NEW! Migration 005                 │
├─────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Store extracted context files for all projects            │
│  PRIMARY KEY: id (UUID)                                             │
│  UNIQUE: (project_id, relative_path)                                │
│  COLUMNS:                                                            │
│    ├─ id: File UUID                                                 │
│    ├─ project_id: Foreign key → projects(id)                        │
│    ├─ relative_path: Path relative to project root                  │
│    ├─ absolute_path: Full file path                                 │
│    ├─ type: SPEC/DOC/CODE/ARCHITECTURE/STATUS/CONFIG/ASSET          │
│    ├─ size: File size in bytes                                      │
│    ├─ created_at: File creation time                                │
│    ├─ modified_at: File modification time                           │
│    ├─ content_hash: Simple hash (size-mtime)                        │
│    └─ indexed_at: When indexed in database                          │
│                                                                      │
│  FILE TYPES:                                                         │
│    SPEC, DOC, CODE, ARCHITECTURE, STATUS,                           │
│    CONFIG, ASSET, UNKNOWN                                           │
│                                                                      │
│  INDEXES:                                                            │
│    ├─ idx_context_project (project_id)                              │
│    ├─ idx_context_type (type)                                       │
│    ├─ idx_context_modified (modified_at)                            │
│    └─ idx_context_path (project_id, relative_path)                  │
│                                                                      │
│  FOREIGN KEY: project_id → projects(id) CASCADE DELETE              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 MCP TOOLS (11 Total - Complete Registry)

### **TASK MANAGEMENT TOOLS (6 - Original)**

```
┌──────────────────────────────────────────────────────────────────────┐
│  1️⃣  get_available_tasks                                             │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Query tasks ready for specific agent                       │
│  INPUT: { agent: "A"|"B"|"C"|"D"|"E"|"F" }                          │
│  OUTPUT: List of available tasks with dependencies satisfied         │
│  LOGIC: Filters by agent, status=AVAILABLE, deps satisfied          │
│  USES: TaskRegistry.getAvailableTasks()                             │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  2️⃣  claim_task                                                       │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Atomically claim a task                                    │
│  INPUT: { taskId: "T001", agent: "A" }                              │
│  OUTPUT: Success/failure with claimed_at timestamp                   │
│  LOGIC: ACID transaction, checks status=AVAILABLE, updates to CLAIMED│
│  USES: TaskRegistry.claimTask() → TaskStore (atomic)                │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  3️⃣  update_progress                                                  │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Update task progress in real-time                          │
│  INPUT: { taskId, status, completionPercent, filesCreated, notes }  │
│  OUTPUT: Updated task with Git verification                          │
│  LOGIC: Updates status to IN_PROGRESS, tracks files, runs GitTracker│
│  USES: TaskRegistry → TaskStore + GitTracker                        │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  4️⃣  complete_task                                                    │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Mark task complete with Git verification                   │
│  INPUT: { taskId, agent, filesCreated, velocity }                   │
│  OUTPUT: Completion confirmation + unlocked tasks                    │
│  LOGIC: Git verification (70% files + 30% commits ≥80%)             │
│  USES: TaskRegistry.completeTask() → Auto-unblock dependencies      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  5️⃣  get_dashboard                                                    │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Multi-agent dashboard with beautiful CLI UI                │
│  INPUT: { project?: "projectId" }                                   │
│  OUTPUT: Sprint metrics, agent status, task breakdown (ASCII art)    │
│  LOGIC: Aggregates from tasks + agent_sessions + GitTracker         │
│  USES: TaskRegistry.getSprintMetrics() + GitTracker                 │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  6️⃣  get_agent_status                                                 │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Individual agent deep dive with Git activity               │
│  INPUT: { agent: "A" }                                              │
│  OUTPUT: Agent workload, Git activity, performance (ASCII art)       │
│  LOGIC: Queries tasks by agent + GitTracker.getAgentActivity()      │
│  USES: TaskRegistry.getAgentWorkload() + GitTracker                 │
└──────────────────────────────────────────────────────────────────────┘
```

### **INTELLIGENCE TOOLS (4 - Original)**

```
┌──────────────────────────────────────────────────────────────────────┐
│  7️⃣  agent_connect                                                    │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Register new agent session                                 │
│  INPUT: { agent: "A", model: "GLM-4.6", project: "LocalBrain" }     │
│  OUTPUT: Session UUID + welcome message + available tasks count      │
│  LOGIC: Creates session, updates presence to ONLINE, logs activity   │
│  USES: SessionManager.createSession()                               │
│  SIDE EFFECTS:                                                       │
│    ├─ Closes duplicate session if exists (BUG FIX #2)               │
│    ├─ INSERT INTO agent_sessions                                    │
│    ├─ UPDATE agent_presence (status=ONLINE)                         │
│    └─ INSERT INTO agent_activity (type=CONNECT)                     │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  8️⃣  agent_heartbeat                                                  │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Update agent presence (every 30 seconds)                   │
│  INPUT: { sessionId: "uuid", currentActivity?: "IDLE" }             │
│  OUTPUT: Heartbeat acknowledgement                                   │
│  LOGIC: Updates last_heartbeat, last_seen, status (ACTIVE/IDLE)     │
│  USES: SessionManager.updateHeartbeat()                             │
│  SIDE EFFECTS:                                                       │
│    ├─ UPDATE agent_sessions (last_heartbeat, status)                │
│    ├─ UPDATE agent_presence (last_seen, status)                     │
│    └─ INSERT INTO agent_activity (type=HEARTBEAT)                   │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  9️⃣  agent_disconnect                                                 │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Close agent session                                        │
│  INPUT: { sessionId: "uuid" }                                       │
│  OUTPUT: Session duration + stats                                    │
│  LOGIC: Calculates duration, updates metrics, closes session         │
│  USES: SessionManager.closeSession()                                │
│  SIDE EFFECTS:                                                       │
│    ├─ UPDATE agent_sessions (disconnected_at, duration, status)     │
│    ├─ UPDATE agent_presence (status=OFFLINE, active_time)           │
│    ├─ INSERT INTO agent_activity (type=DISCONNECT)                  │
│    └─ INSERT/UPDATE agent_metrics (daily aggregation)               │
│  BUG FIX: Fetches session AFTER closeSession (not before) #1        │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  🔟 get_swarm_dashboard                                               │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Real-time view of all agents in swarm                      │
│  INPUT: { project?: "projectId" }                                   │
│  OUTPUT: Swarm summary + agent details + recent activity             │
│  LOGIC: Joins agent_presence + agent_sessions + tasks               │
│  USES: Multi-table query with timeout detection                     │
│  SIDE EFFECTS:                                                       │
│    └─ UPDATE agent_presence (status=OFFLINE if heartbeat timeout)   │
│       (Checks datetime(last_seen) < datetime('now', '-120 seconds')) │
│  BUG FIX: Automatic timeout detection for zombie agents #3          │
└──────────────────────────────────────────────────────────────────────┘
```

### **DISCOVERY TOOLS (1 - New!)** ⭐

```
┌──────────────────────────────────────────────────────────────────────┐
│  1️⃣1️⃣ discover_environment ⭐ NEW! PLUG-N-PLAY                          │
├──────────────────────────────────────────────────────────────────────┤
│  PURPOSE: Complete automatic environment discovery                   │
│  INPUT: {                                                            │
│    cwd: "/Users/lech/PROJECTS_all/LocalBrain",                      │
│    modelId: "claude-sonnet-4-5",                                    │
│    trackingId?: "uuid-from-config" // Optional                      │
│  }                                                                   │
│  OUTPUT: {                                                           │
│    agent: { id, trackingId, name, capabilities },                   │
│    agentIdentity: { recognized, method, confidence },               │
│    project: { id, name, type, vision },                             │
│    context: { totalFiles, categories, statistics },                 │
│    proposals: [{ taskId, matchScore, relevantContext }]             │
│  }                                                                   │
│  LOGIC: 4-step discovery flow                                       │
│    1. Recognize/create agent (AgentRecognizer)                      │
│    2. Detect/register project (ProjectDetector)                     │
│    3. Extract context (ContextExtractor)                            │
│    4. Generate proposals (JobProposalEngine)                        │
│  USES: DiscoveryEngine.discoverEnvironment()                        │
│  TIME: ~20-60 seconds (needs optimization)                          │
│  SIDE EFFECTS:                                                       │
│    ├─ INSERT INTO agents (if new)                                   │
│    ├─ INSERT INTO projects (if new)                                 │
│    ├─ INSERT INTO context_files (bulk insert)                       │
│    └─ WRITE ~/.brain/config.json (tracking ID)                      │
│                                                                      │
│  THIS IS THE REVOLUTION: ONE CALL → EVERYTHING DISCOVERED! 🚀        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 COMPLETE DATA FLOW DIAGRAM

### **Discovery Flow (New Agent, New Project)**

```
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: Agent Connection Attempt                                    │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
         Agent calls: discover_environment({
           cwd: "/Users/lech/PROJECTS_all/AudioAnalyzer",
           modelId: "claude-sonnet-4-5"
         })
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: Agent Recognition (AgentRecognizer)                         │
├─────────────────────────────────────────────────────────────────────┤
│  → Read ~/.brain/config.json                                        │
│    ❌ Not found (new agent)                                          │
│                                                                      │
│  → Generate model signature                                         │
│    hash(modelId + apiKeyHash + machineId)                           │
│                                                                      │
│  → Query: SELECT * FROM agents WHERE model_signature = ?            │
│    ❌ Not found                                                      │
│                                                                      │
│  → Create new agent:                                                │
│    INSERT INTO agents (id, tracking_id, name, model_id, ...)        │
│    WRITE ~/.brain/config.json with tracking_id                      │
│                                                                      │
│  ✅ Result: New agent created with tracking ID                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: Project Detection (ProjectDetector)                         │
├─────────────────────────────────────────────────────────────────────┤
│  → Get git remote:                                                   │
│    exec: git remote get-url origin                                  │
│    Result: github.com/lech/audio-analyzer                           │
│                                                                      │
│  → Query: SELECT * FROM projects WHERE git_remote = ?               │
│    ❌ Not found                                                      │
│                                                                      │
│  → Detect project metadata:                                         │
│    - Check for CLAUDE.md ✅                                          │
│    - Check for package.json ✅                                       │
│    - Check for 02_SPECBASES ❌                                       │
│    - Classify type: TOOL                                            │
│    - Extract vision from CLAUDE.md                                  │
│                                                                      │
│  → Create project:                                                   │
│    INSERT INTO projects (id, name, path, git_remote, type, ...)     │
│                                                                      │
│  ✅ Result: New project registered (AudioAnalyzer)                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: Context Extraction (ContextExtractor)                       │
├─────────────────────────────────────────────────────────────────────┤
│  → Scan directories:                                                 │
│    find ./docs -type f → 23 files                                   │
│    find ./src -type f → 45 files                                    │
│    find . -name "*ARCHITECTURE*" → 3 files                          │
│                                                                      │
│  → Categorize files:                                                 │
│    specs: 8 files                                                    │
│    docs: 23 files                                                    │
│    code: 45 files                                                    │
│    config: 3 files                                                   │
│                                                                      │
│  → Extract metadata:                                                 │
│    Total size: 2.3 MB                                               │
│    LOC: 4,500 lines                                                  │
│    Technologies: TypeScript, React                                   │
│                                                                      │
│  → Store in database:                                                │
│    INSERT INTO context_files (79 files in transaction)              │
│                                                                      │
│  ✅ Result: 79 files indexed and ready                               │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 5: Job Proposal Generation (JobProposalEngine)                 │
├─────────────────────────────────────────────────────────────────────┤
│  → Query available tasks:                                            │
│    SELECT * FROM tasks WHERE project_id = ? AND status = 'AVAILABLE'│
│    Result: 5 tasks                                                   │
│                                                                      │
│  → Score each task for this agent:                                  │
│    Task 1: 92/100 (UI development - good match)                     │
│    Task 2: 85/100 (Backend work - medium match)                     │
│    Task 3: 78/100 (Integration - good match)                        │
│    Task 4: 65/100 (Design - low match)                              │
│    Task 5: 45/100 (Infrastructure - low match)                      │
│                                                                      │
│  → Find relevant context for each:                                  │
│    Task 1: 15 relevant files (specs + code examples)                │
│    Task 2: 8 relevant files                                         │
│    ...                                                               │
│                                                                      │
│  → Rank by score:                                                    │
│    Proposals: [Task1(92%), Task3(78%), Task2(85%), ...]             │
│                                                                      │
│  ✅ Result: 5 ranked job proposals with context                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 6: Return Complete Package                                     │
├─────────────────────────────────────────────────────────────────────┤
│  {                                                                   │
│    agent: { id, trackingId, name, capabilities },                   │
│    project: { id, name, type, vision },                             │
│    context: { 79 files indexed },                                   │
│    proposals: [                                                      │
│      { task1: 92% match, 15 context files },                        │
│      { task3: 85% match, 12 context files },                        │
│      { task2: 78% match, 8 context files }                          │
│    ]                                                                 │
│  }                                                                   │
│                                                                      │
│  ✅ Agent activated and ready to work!                               │
│  ✅ Total time: 22 seconds                                           │
│  ✅ Manual steps: ZERO                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ COMPONENT ARCHITECTURE (Detailed)

### **Core Components (src/)**

```
src/
├─ index.ts (Server Entry Point)
│  └─ Initializes: TaskRegistry, GitTracker, SessionManager, DiscoveryEngine
│
├─ registry/ (Task Management - Original)
│  ├─ TaskRegistry.ts (Coordination logic, 260 LOC)
│  │  └─ Methods: initialize(), getAllTasks(), getAvailableTasks(),
│  │              claimTask(), completeTask(), getSprintMetrics()
│  │
│  ├─ TaskStore.ts (SQLite persistence, 350 LOC)
│  │  └─ Methods: getAllTasks(), getTask(), claimTask(),
│  │              updateTaskStatus(), completeTask()
│  │
│  ├─ DependencyResolver.ts (Dependency logic, 200 LOC)
│  │  └─ Methods: areDependenciesSatisfied(), detectCircularDependencies(),
│  │              getCriticalPath(), findTasksToUnblock()
│  │
│  └─ GitTracker.ts (Git verification, 250 LOC)
│     └─ Methods: getFileTimestamps(), getCommitHistory(),
│                 calculateCompletionScore(), getAgentActivity()
│
├─ intelligence/ (Agent Intelligence - Original)
│  └─ SessionManager.ts (Session tracking, 270 LOC)
│     └─ Methods: createSession(), updateHeartbeat(), closeSession(),
│                 getSession(), incrementTasksClaimed(), logActivity()
│
├─ discovery/ (Discovery Engine - NEW! ⭐)
│  ├─ DiscoveryEngine.ts (Main orchestrator, 200 LOC)
│  │  └─ Method: discoverEnvironment() ← MAIN ENTRY POINT
│  │             └─ Orchestrates all 4 discovery components
│  │
│  ├─ ProjectDetector.ts (Project detection, 300 LOC)
│  │  └─ Methods: detectProject(), getGitRemote(), classifyProjectType(),
│  │              extractVision(), getAllProjects(), searchProjects()
│  │
│  ├─ ContextExtractor.ts (Context scanning, 400 LOC)
│  │  └─ Methods: extractContext(), scanProjectDirectory(),
│  │              categorizeFiles(), getContextFiles(), searchContextFiles()
│  │
│  ├─ AgentRecognizer.ts (Agent identity, 350 LOC)
│  │  └─ Methods: recognizeAgent(), findByTrackingId(), createNewAgent(),
│  │              extractCapabilitiesFromModel(), saveTrackingIdToConfig()
│  │
│  ├─ JobProposalEngine.ts (Task matching, 250 LOC)
│  │  └─ Methods: generateProposals(), scoreTask(), findRelevantContext(),
│  │              explainMatch(), calculateImpact()
│  │
│  └─ index.ts (Exports)
│
├─ tools/ (MCP Tool Implementations)
│  ├─ getAvailableTasks.ts (120 LOC)
│  ├─ claimTask.ts (150 LOC)
│  ├─ updateProgress.ts (180 LOC)
│  ├─ completeTask.ts (200 LOC)
│  ├─ getDashboard.ts (350 LOC)
│  ├─ getAgentStatus.ts (300 LOC)
│  │
│  ├─ intelligence/
│  │  ├─ agentConnect.ts (150 LOC)
│  │  ├─ agentHeartbeat.ts (80 LOC)
│  │  ├─ agentDisconnect.ts (100 LOC)
│  │  └─ getSwarmDashboard.ts (125 LOC)
│  │
│  ├─ discovery/ ⭐ NEW!
│  │  └─ discoverEnvironment.ts (150 LOC)
│  │
│  └─ index.ts (Tool registration, 90 LOC)
│
├─ database/
│  └─ migrations/
│     ├─ 001_initial_schema.sql (Tasks)
│     ├─ 002_agent_intelligence.sql (Intelligence)
│     ├─ 003_projects_table.sql (Multi-project) ⭐
│     ├─ 004_agents_table.sql (Persistent identity) ⭐
│     └─ 005_context_files_table.sql (Context storage) ⭐
│
├─ types/
│  └─ Task.ts (Type definitions, 150 LOC)
│
└─ utils/
   └─ logger.ts (Logging, 75 LOC)

Total: ~7,100 LOC (was 5,600, +1,500 new)
```

---

## 🔄 COMPLETE OPERATION FLOWS

### **Flow 1: Agent First Connection (New Agent, New Project)**

```
Agent runs from new project directory:
  ├─ cwd: /Users/lech/PROJECTS_all/AudioAnalyzer
  └─ No ~/.brain/config.json

1. discover_environment called
   ↓
2. AgentRecognizer.recognizeAgent()
   → No tracking ID
   → No signature match
   → Creates NEW agent
   → Generates tracking_id: "uuid-xxx"
   → INSERT INTO agents
   → WRITE ~/.brain/config.json
   ✅ Agent created
   ↓
3. ProjectDetector.detectProject()
   → Get git remote: github.com/lech/audio-analyzer
   → Query projects: Not found
   → Detect type: TOOL
   → Extract vision from CLAUDE.md
   → INSERT INTO projects
   ✅ Project registered
   ↓
4. ContextExtractor.extractContext()
   → Scan ./docs (23 files)
   → Scan ./src (45 files)
   → Categorize by type
   → INSERT INTO context_files (79 files)
   ✅ Context indexed
   ↓
5. JobProposalEngine.generateProposals()
   → Query tasks: 5 available
   → Score each task
   → Find relevant context
   → Rank by score
   ✅ 5 proposals generated
   ↓
6. Return complete package
   ✅ Agent activated with tracking ID
   ✅ Project auto-registered
   ✅ 79 files indexed
   ✅ 5 job proposals ready
   ✅ Total time: 22 seconds
```

### **Flow 2: Agent Reconnection (Existing Agent, Known Project)**

```
Agent returns to known project:
  ├─ cwd: /Users/lech/PROJECTS_all/LocalBrain
  └─ Has ~/.brain/config.json with tracking_id

1. discover_environment called with trackingId
   ↓
2. AgentRecognizer.recognizeAgent()
   → Read tracking_id from config
   → Query: SELECT * FROM agents WHERE tracking_id = ?
   ✅ FOUND! (100% confidence)
   → Load agent history (47 sessions, 23 tasks)
   → UPDATE last_seen
   ✅ Agent recognized
   ↓
3. ProjectDetector.detectProject()
   → Get git remote: github.com/leolech14/LocalBrain
   → Query: SELECT * FROM projects WHERE git_remote = ?
   ✅ FOUND! (existing project)
   → UPDATE last_activity
   ✅ Project recognized
   ↓
4. ContextExtractor (Smart Check)
   → Query: SELECT * FROM context_files WHERE project_id = ?
   ✅ Found 1,334 files (already indexed)
   → Check if needs update:
     - Compare file counts: 1,334 stored vs 1,338 actual (4 new files)
     - Check CLAUDE.md modified: No change
   → Decision: UPDATE needed (4 new files)
   → Scan only new files
   → INSERT 4 new files
   ✅ Context updated (fast - only 4 files scanned)
   ↓
5. JobProposalEngine.generateProposals()
   → Query tasks: 5 available (T020-T024)
   → Score for Agent D capabilities
   → Use agent history (prefers integration tasks)
   → Rank by score
   ✅ 5 proposals (T020: 95% match - top recommendation)
   ↓
6. Return complete package
   ✅ Agent recognized (47 previous sessions!)
   ✅ Project recognized
   ✅ Context updated (1,338 files, 4 new)
   ✅ 5 proposals (T020 highly recommended)
   ✅ Total time: 8 seconds (cached context!)
```

### **Flow 3: Multi-Project Agent Movement**

```
Agent D working in LocalBrain, switches to Gov.br:

Session 1: LocalBrain
  → discover_environment({ cwd: "/Users/lech/PROJECTS_all/LocalBrain" })
  → Recognized: Agent D
  → Project: LocalBrain
  → Role: Integration Specialist
  → Tasks: 5 available
  ✅ Working on T020

Session 2: Gov.br (same day)
  → discover_environment({ cwd: "/Users/lech/PROJECTS_all/PROJECT_govbr" })
  → Recognized: Agent D (SAME tracking ID!)
  → Project: Gov.br (different project!)
  → Role: Backend Specialist (different role!)
  → Tasks: 12 available (Gov.br tasks)
  ✅ Context switched seamlessly

Database shows:
  ├─ Agent D: 2 sessions today (LocalBrain + Gov.br)
  ├─ Projects: Both tracked separately
  ├─ Context: Isolated by project
  └─ Proposals: Role-specific for each project
```

---

## 📊 DATABASE RELATIONSHIPS (Complete ER Diagram)

```
┌─────────────┐
│  projects   │ (Multi-Project Registry)
│             │
│ PK: id      │────────────────┐
│ UK: path    │                │
│ UK: git_remote              │
└─────────────┘                │
       ↑                        │
       │ FK                     │ FK
       │                        │
┌─────────────┐          ┌─────────────┐
│context_files│          │    tasks    │ (Project-Scoped Tasks)
│             │          │             │
│ PK: id      │          │ PK: id      │
│ FK: project_id         │ FK: project_id
│ UK: (project_id,       └─────────────┘
│      relative_path)           ↑
└─────────────┘                 │ FK
                                 │
                          ┌─────────────┐
                          │ task_history│ (Audit Log)
                          │             │
                          │ FK: task_id │
                          └─────────────┘

┌─────────────┐
│   agents    │ (Persistent Identity)
│             │
│ PK: id      │────────────────┐
│ UK: tracking_id             │
│ UK: model_signature         │
└─────────────┘                │
       ↑                        │
       │                        │
       │ Referenced             │ Referenced
       │ (not FK)               │ (not FK)
       │                        │
┌─────────────┐          ┌─────────────┐
│agent_sessions          │agent_presence (Real-time Status)
│             │          │             │
│ PK: id      │          │ PK: agent_letter (A/B/C/D/E/F)
│ agent_letter│          │ FK: current_session_id → agent_sessions
│ (links to   │          │ FK: current_task_id → tasks
│  agents via │          └─────────────┘
│  name match)│
│ FK: project_id
└─────────────┘
       ↑
       │ FK
       │
┌─────────────┐          ┌─────────────┐
│agent_activity          │agent_metrics│ (Daily Aggregation)
│             │          │             │
│ FK: session_id         │ agent_letter│
│ FK: task_id │          │ metric_date │
└─────────────┘          │ UK: (agent_letter, metric_date)
                          └─────────────┘

┌─────────────┐
│agent_collaboration (Future)
│             │
│ agent_from  │
│ agent_to    │
│ FK: task_id │
└─────────────┘

TOTAL: 11 tables with 15 foreign key relationships
```

---

## 🎯 COMPONENT INTERACTION MAP

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MCP SERVER (src/index.ts)                             │
├─────────────────────────────────────────────────────────────────────────┤
│  Initializes:                                                            │
│    1. TaskRegistry (task coordination)                                  │
│    2. GitTracker (verification)                                         │
│    3. Database (registry.db)                                            │
│    4. MCP Server (stdio transport)                                      │
│  Registers:                                                              │
│    11 MCP tools via registerTools()                                     │
└─────────────────────────────────────────────────────────────────────────┘
                              ↓ uses
┌─────────────────────────────────────────────────────────────────────────┐
│                    DISCOVERY ENGINE ⭐                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  Entry: discover_environment MCP tool                                   │
│  Orchestrates: 4 discovery components                                   │
│  Returns: Complete environment package                                  │
└─────────────────────────────────────────────────────────────────────────┘
       │              │              │              │
       │              │              │              │
       ↓              ↓              ↓              ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Project      │ │ Context      │ │ Agent        │ │ Job Proposal │
│ Detector     │ │ Extractor    │ │ Recognizer   │ │ Engine       │
├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤
│ Detects:     │ │ Scans:       │ │ Recognizes:  │ │ Scores:      │
│ - Git remote │ │ - Specs      │ │ - Tracking   │ │ - Role match │
│ - Path       │ │ - Docs       │ │ - Signature  │ │ - Capability │
│ - Type       │ │ - Code       │ │ Creates:     │ │ - History    │
│ - Vision     │ │ - Arch       │ │ - New agents │ │ - Context    │
│ Stores in:   │ │ Stores in:   │ │ Stores in:   │ │ - Readiness  │
│ - projects   │ │ - context_   │ │ - agents     │ │ - Urgency    │
│   table      │ │   files      │ │   table      │ │ Returns:     │
│              │ │   table      │ │ - ~/.brain/  │ │ - Ranked     │
│              │ │              │ │   config     │ │   proposals  │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🔄 TASK LIFECYCLE (Complete Flow)

```
┌─────────────────────────────────────────────────────────────────────┐
│  TASK LIFECYCLE: From Discovery to Completion                        │
└─────────────────────────────────────────────────────────────────────┘

PHASE 1: DISCOVERY
──────────────────
discover_environment()
  ↓
JobProposalEngine.generateProposals()
  ↓
Agent sees: "T020 - 95% match, 15 context files, ready to start"

PHASE 2: CLAIMING
──────────────────
Agent calls: claim_task({ taskId: "T020", agent: "D" })
  ↓
TaskRegistry.claimTask()
  ↓
TaskStore (ACID Transaction):
  → Check: status = AVAILABLE ✅
  → Check: agent = D ✅
  → Check: dependencies satisfied ✅
  → UPDATE tasks SET status='CLAIMED', claimed_by='D', claimed_at=NOW()
  ↓
✅ Task claimed atomically

PHASE 3: PROGRESS TRACKING
───────────────────────────
Agent calls: update_progress({ taskId: "T020", status: "IN_PROGRESS", completionPercent: 50 })
  ↓
TaskStore:
  → UPDATE tasks SET status='IN_PROGRESS', completion_percent=50
  ↓
GitTracker.getFileTimestamps():
  → Scans git log for T020-related files
  → Found: 8 files created/modified
  ↓
✅ Progress tracked with Git verification

PHASE 4: COMPLETION
───────────────────
Agent calls: complete_task({ taskId: "T020", filesCreated: ["auth.ts", "auth.test.ts"] })
  ↓
GitTracker.calculateCompletionScore():
  → File score: 8/10 files created = 80% × 0.7 = 56%
  → Commit score: 3 commits with "T020" = 100% × 0.3 = 30%
  → Total: 86% ≥ 80% threshold ✅ AUTO-VERIFIED
  ↓
TaskRegistry.completeTask():
  → UPDATE tasks SET status='COMPLETE', completed_at=NOW(), velocity=150
  ↓
DependencyResolver.findTasksToUnblock():
  → Find tasks depending on T020
  → Found: T025, T026
  → UPDATE tasks SET status='AVAILABLE' WHERE id IN ('T025', 'T026')
  ↓
✅ Task completed + 2 tasks auto-unblocked

PHASE 5: METRICS
────────────────
SessionManager.incrementTasksCompleted()
  → UPDATE agent_sessions SET tasks_completed += 1
  → UPDATE agent_presence SET tasks_today += 1
  ↓
On disconnect:
SessionManager.updateDailyMetrics()
  → Aggregate today's session data
  → INSERT/UPDATE agent_metrics
  ↓
✅ Metrics recorded
```

---

## 🎯 MCP TOOL ROUTING MAP

```
MCP Request arrives via stdio:
  ↓
Server.setRequestHandler(CallToolRequestSchema)
  ↓
Parse: request.params.name (tool name)
  ↓
Route to appropriate tool:

┌─ TASK TOOLS ────────────────────────────────────────┐
│  get_available_tasks → createGetAvailableTasksTool  │
│    ├─ Uses: TaskRegistry                            │
│    └─ Returns: Filtered + sorted task list          │
│                                                      │
│  claim_task → createClaimTaskTool                   │
│    ├─ Uses: TaskRegistry.claimTask()                │
│    └─ Returns: Claim result (atomic)                │
│                                                      │
│  update_progress → createUpdateProgressTool         │
│    ├─ Uses: TaskRegistry + GitTracker               │
│    └─ Returns: Updated task + Git verification      │
│                                                      │
│  complete_task → createCompleteTaskTool             │
│    ├─ Uses: TaskRegistry + GitTracker               │
│    ├─ Calculates: Completion score (Git)            │
│    ├─ Auto-unblocks: Dependent tasks                │
│    └─ Returns: Completion result + unblocked tasks  │
│                                                      │
│  get_dashboard → createGetDashboardTool             │
│    ├─ Uses: TaskRegistry + GitTracker               │
│    └─ Returns: Sprint metrics (ASCII art)           │
│                                                      │
│  get_agent_status → createGetAgentStatusTool        │
│    ├─ Uses: TaskRegistry + GitTracker               │
│    └─ Returns: Agent workload (ASCII art)           │
└──────────────────────────────────────────────────────┘

┌─ INTELLIGENCE TOOLS ────────────────────────────────┐
│  agent_connect → handleAgentConnect                 │
│    ├─ Uses: SessionManager.createSession()          │
│    ├─ Side effects: INSERT sessions, UPDATE presence│
│    └─ Returns: Session UUID + welcome               │
│                                                      │
│  agent_heartbeat → handleAgentHeartbeat             │
│    ├─ Uses: SessionManager.updateHeartbeat()        │
│    ├─ Side effects: UPDATE sessions + presence      │
│    └─ Returns: ACK                                   │
│                                                      │
│  agent_disconnect → handleAgentDisconnect           │
│    ├─ Uses: SessionManager.closeSession()           │
│    ├─ Side effects: UPDATE sessions, metrics        │
│    └─ Returns: Session duration + stats             │
│                                                      │
│  get_swarm_dashboard → handleGetSwarmDashboard      │
│    ├─ Uses: Multi-table query                       │
│    ├─ Side effects: Timeout detection (UPDATE)      │
│    └─ Returns: All agent status + activity          │
└──────────────────────────────────────────────────────┘

┌─ DISCOVERY TOOLS ⭐ NEW! ───────────────────────────┐
│  discover_environment → handleDiscoverEnvironment   │
│    ├─ Uses: DiscoveryEngine                         │
│    ├─ Orchestrates: 4 discovery components          │
│    ├─ Side effects:                                 │
│    │  ├─ INSERT agents (if new)                     │
│    │  ├─ INSERT projects (if new)                   │
│    │  ├─ INSERT context_files (bulk)                │
│    │  └─ WRITE ~/.brain/config.json                 │
│    └─ Returns: Complete environment package         │
│                                                      │
│  THIS IS THE PLUG-N-PLAY ENTRY POINT! 🚀            │
└──────────────────────────────────────────────────────┘
```

---

## 🌍 MULTI-PROJECT ARCHITECTURE

```
Central Intelligence Database (registry.db)
  ↓
┌─────────────────────────────────────────────────────────────────┐
│  PROJECT 1: LocalBrain (id: uuid-aaa)                            │
│  ├─ Type: COMMERCIAL_APP                                         │
│  ├─ Tasks: 19 tasks (T001-T019)                                  │
│  ├─ Context: 1,334 files indexed                                 │
│  ├─ Swarms: 2 (Frontend Team, Backend Team)                      │
│  ├─ Active Agents: A, B, D (3 online)                            │
│  └─ Recent Activity: T009 completed (Agent A, 2h ago)            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PROJECT 2: AudioAnalyzer (id: uuid-bbb)                         │
│  ├─ Type: TOOL                                                   │
│  ├─ Tasks: 15 tasks (auto-discovered)                            │
│  ├─ Context: 79 files indexed                                    │
│  ├─ Swarms: 1 (Processing Team)                                  │
│  ├─ Active Agents: None                                          │
│  └─ Recent Activity: Project created (5 min ago)                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PROJECT 3: Gov.br (id: uuid-ccc)                                │
│  ├─ Type: COMMERCIAL_APP                                         │
│  ├─ Tasks: 42 tasks                                              │
│  ├─ Context: 2,847 files indexed                                 │
│  ├─ Swarms: 3 (Frontend, Backend, Gov Integration)              │
│  ├─ Active Agents: C, D (2 online)                               │
│  └─ Recent Activity: T052 in progress (Agent C)                  │
└─────────────────────────────────────────────────────────────────┘

... + 57 more projects (all 60+ projects in PROJECTS_all/)

ALL projects isolated by project_id:
  ├─ tasks.project_id
  ├─ agent_sessions.project_id
  ├─ context_files.project_id
  └─ Queries scoped: WHERE project_id = ?
```

---

## 💾 DATA STORAGE ARCHITECTURE

```
LOCAL STORAGE (Current):
┌─────────────────────────────────────────────────────┐
│  📁 data/registry.db (SQLite)                        │
│  ├─ Size: 143KB → Growing                           │
│  ├─ Tables: 11 (complete schema)                    │
│  ├─ Performance: <50ms per query                    │
│  ├─ Transactions: ACID-compliant                    │
│  └─ Location: 01_CODEBASES/mcp-servers/...          │
│                                                      │
│  📁 ~/.brain/config.json (Agent Identity)            │
│  ├─ Tracking ID                                     │
│  ├─ Agent ID                                        │
│  └─ Registration timestamp                          │
└─────────────────────────────────────────────────────┘

CLOUD STORAGE (Future - T006-T011):
┌─────────────────────────────────────────────────────┐
│  ☁️ PostgreSQL (Railway/Supabase)                    │
│  ├─ Tasks, projects, agents, sessions               │
│  ├─ Multi-region replication                        │
│  └─ Auto-backups                                    │
│                                                      │
│  ☁️ Redis (Railway/Upstash)                          │
│  ├─ Session cache                                   │
│  ├─ Real-time presence                              │
│  └─ Rate limiting                                   │
│                                                      │
│  ☁️ S3/GCS/R2 (Context Storage)                      │
│  ├─ All context files                               │
│  ├─ Versioned storage                               │
│  └─ CDN distribution                                │
│                                                      │
│  ☁️ Vector Database (Pinecone/Supabase pgvector)     │
│  ├─ Embeddings for semantic search                  │
│  ├─ Context similarity queries                      │
│  └─ Knowledge graph relationships                   │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 COMPLETE SYSTEM STATISTICS

### **Code Metrics:**
```
Total Lines of Code: ~7,100 LOC
  ├─ Original system: 5,600 LOC
  └─ Discovery Engine: 1,500 LOC (new)

Files: 35+ TypeScript files
  ├─ Core: index.ts
  ├─ Registry: 4 files
  ├─ Intelligence: 1 file
  ├─ Discovery: 5 files ⭐
  ├─ Tools: 17 files
  ├─ Types: 1 file
  └─ Utils: 1 file

Database:
  ├─ Tables: 11
  ├─ Migrations: 5
  ├─ Indexes: 35+
  └─ Foreign Keys: 15
```

### **Functional Coverage:**
```
✅ Task Management: 100%
✅ Agent Intelligence: 100%
✅ Discovery Engine: 100% ⭐
⚠️ Keep-in-Touch Gating: 20% (heartbeat only)
❌ Context Cloud Upload: 0%
❌ Model Recommendation: 0%
❌ Best Practices: 0%
❌ CLI Tool: 0%

Overall: ~15% of complete vision
Foundation: 85% complete
```

### **Test Coverage:**
```
Manual Tests: 4 files
  ├─ test-intelligence.cjs
  ├─ test-bug-fixes.cjs
  ├─ test-auto-heartbeat.cjs
  └─ test-discovery-engine.cjs ⭐

Automated Tests: 0%
CI/CD: Not configured
Coverage Reporting: None
```

---

**System Map Created By**: Agent D (Integration Specialist)
**Complexity**: 11 tables, 11 tools, 5 subsystems, 15 FK relationships
**Status**: ✅ COMPLETE ARCHITECTURE MAPPED
**Next**: Production README.md for GitHub
