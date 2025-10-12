# 🧠 HOW IT ALL WORKS TOGETHER
## Complete Integration Flow - Central Intelligence System

**Date**: 2025-10-09
**Purpose**: Explain how every component integrates
**Status**: COMPLETE SYSTEM INTEGRATION MAP

---

## 🎯 THE BIG PICTURE - End-to-End Flow

```
AGENT (Terminal) → CLI Tool → MCP Protocol → MCP Server → Core Components → Database
     ↓                ↓            ↓              ↓              ↓              ↓
 GLM-4.6          brain       JSON-RPC 2.0    14 Tools      Discovery      SQLite
   User         connect         stdio         handlers      TaskRegistry   11 tables
                                                            HealthChecker
                                                            KeepInTouch
```

---

## 🔄 COMPLETE WORKFLOW - Step by Step

### **SCENARIO: Agent A Starts Working on LocalBrain**

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Agent Opens Terminal                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
Agent A (GLM-4.6) in terminal:
$ cd /Users/lech/PROJECTS_all/LocalBrain
$ brain connect

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: CLI Tool Activates                                      │
└─────────────────────────────────────────────────────────────────┘

CLI (packages/brain-cli/dist/cli.js):
├─ Reads config from ~/.brain/config.json
├─ Gets tracking ID (if exists)
├─ Spawns MCP server process:
│  spawn('node', ['dist/index.js'], {
│    cwd: '/Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry'
│  })
└─ Creates stdio transport (stdin/stdout)

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: MCP Server Starts                                       │
└─────────────────────────────────────────────────────────────────┘

MCP Server (01_CODEBASES/mcp-servers/localbrain-task-registry/dist/index.js):
├─ Opens database: data/registry.db (SQLite)
├─ Initializes TaskRegistry
├─ Initializes GitTracker
├─ Initializes DiscoveryEngine
├─ Initializes SessionManager
├─ Initializes HealthChecker
├─ Initializes KeepInTouchEnforcer
├─ Registers 18 MCP tools
└─ Listens on stdio (JSON-RPC 2.0)

Console Output:
"🚀 Starting LocalBrain Task Registry MCP Server...
 ✅ 18 MCP tools registered successfully
 🎯 MCP Server running and ready for agent connections"

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: CLI Calls discover_environment MCP Tool                 │
└─────────────────────────────────────────────────────────────────┘

CLI sends JSON-RPC request via stdin:
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "discover_environment",
    "arguments": {
      "cwd": "/Users/lech/PROJECTS_all/LocalBrain",
      "modelId": "glm-4.6",
      "trackingId": "uuid-from-config-or-null"
    }
  }
}

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: MCP Server Routes to discover_environment Handler       │
└─────────────────────────────────────────────────────────────────┘

src/tools/index.ts → registerTools():
├─ Finds tool by name: "discover_environment"
├─ Calls: handleDiscoverEnvironment(args, db)
└─ Located in: src/tools/discovery/discoverEnvironment.ts

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: Discovery Engine Activates                              │
└─────────────────────────────────────────────────────────────────┘

DiscoveryEngine.discoverEnvironment():

SUB-STEP 6A: Agent Recognition
├─ AgentRecognizer.recognizeAgent()
├─ Checks: ~/.brain/config.json for tracking ID
├─ OR: Queries database by model signature
├─ FOUND: "Agent-GLM-xxx" (90% confidence)
├─ Loads: 47 previous sessions, stats
└─ UPDATE: agents table (last_seen)

Database Query:
SELECT * FROM agents WHERE tracking_id = 'uuid-xxx'
→ Returns: Complete agent record

SUB-STEP 6B: Project Detection
├─ ProjectDetector.detectProject()
├─ Executes: git remote get-url origin
├─ Returns: "github.com/leolech14/LocalBrain"
├─ Queries: SELECT * FROM projects WHERE git_remote = ?
├─ FOUND: LocalBrain (COMMERCIAL_APP)
└─ UPDATE: projects table (last_activity)

SUB-STEP 6C: Context Extraction
├─ ContextExtractor.extractContext()
├─ Checks: needsUpdate() - compares file counts
├─ Decision: FROM CACHE (1,808 files already indexed)
├─ Queries: SELECT * FROM context_files WHERE project_id = ?
├─ Returns: 1,808 files (specs, docs, code)
└─ Time: 2 seconds (cached!)

SUB-STEP 6D: Job Proposals
├─ JobProposalEngine.generateProposals()
├─ Queries: SELECT * FROM tasks WHERE project_id = ? AND status = 'AVAILABLE'
├─ Scores: Each task 0-100% match
│  ├─ Role match (30%)
│  ├─ Capability match (25%)
│  ├─ History match (15%)
│  ├─ Context available (15%)
│  ├─ Readiness (10%)
│  └─ Urgency (5%)
├─ Ranks: By total score
└─ Returns: Top 5 proposals

Example Scoring:
T011 for Agent A (UI Specialist):
├─ Role: 30 (UI task)
├─ Capability: 25 (has UI capability)
├─ History: 12 (completed 4 UI tasks before)
├─ Context: 15 (23 relevant files found)
├─ Readiness: 10 (dependencies satisfied)
├─ Urgency: 5 (P0 priority)
└─ TOTAL: 97/100 = 97% MATCH!

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 7: MCP Server Returns Response                             │
└─────────────────────────────────────────────────────────────────┘

Response sent via stdout (JSON-RPC 2.0):
{
  "jsonrpc": "2.0",
  "result": {
    "content": [{
      "type": "text",
      "text": "{
        \"agent\": {
          \"id\": \"uuid\",
          \"trackingId\": \"uuid\",
          \"name\": \"Agent-GLM-xxx\",
          \"capabilities\": { ... }
        },
        \"project\": {
          \"name\": \"LocalBrain\",
          \"type\": \"COMMERCIAL_APP\"
        },
        \"context\": {
          \"totalFiles\": 1808,
          \"categories\": { ... }
        },
        \"proposals\": [
          {
            \"taskId\": \"T011\",
            \"taskName\": \"React Query + SSR\",
            \"matchScore\": 97,
            \"relevantContext\": { ... }
          }
        ]
      }"
    }]
  },
  "id": 1
}

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 8: CLI Displays Beautiful Output                           │
└─────────────────────────────────────────────────────────────────┘

Terminal shows:
✅ Connected as Agent-GLM-xxx
✅ Project: LocalBrain (COMMERCIAL_APP)
✅ Context: 1,808 files indexed

📋 Top Recommendations:
🥇 T011: React Query + SSR (97% match) - READY
   Effort: 16h | Context: 23 files

Would you like to claim T011? (y/n)

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 9: Agent Claims Task                                       │
└─────────────────────────────────────────────────────────────────┘

Agent types: y

CLI sends:
{
  "method": "tools/call",
  "params": {
    "name": "claim_task",
    "arguments": {
      "taskId": "T011",
      "agent": "A"
    }
  }
}

                              ↓
MCP Server → claim_task handler:
├─ src/tools/claimTask.ts
├─ Calls: TaskRegistry.claimTask('T011', 'A')
├─ TaskRegistry calls TaskStore.claimTask()
│
└─ TaskStore (ATOMIC TRANSACTION):
   BEGIN TRANSACTION
   ├─ Check: task.status = 'AVAILABLE' ✅
   ├─ Check: task.agent = 'A' ✅
   ├─ Check: dependencies satisfied ✅
   ├─ UPDATE tasks SET
   │    status = 'CLAIMED',
   │    claimed_by = 'A',
   │    claimed_at = NOW()
   │  WHERE id = 'T011'
   │    AND status = 'AVAILABLE'  -- Prevents race condition!
   ├─ Check: affected rows = 1 ✅
   └─ COMMIT

Database after:
T011 | React Query | A | CLAIMED | P0 | claimed_at: 2025-10-09 02:00:00

                              ↓
Response:
{
  "success": true,
  "claimedAt": "2025-10-09T02:00:00Z"
}

CLI shows:
✅ Task T011 claimed successfully!
📚 Loading relevant context (23 files)...
🚀 You can start working now!

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 10: Agent Works on Task (Auto-Heartbeat Running)           │
└─────────────────────────────────────────────────────────────────┘

While agent codes:

TaskRegistryClient (auto-heartbeat every 30 seconds):
setInterval(() => {
  MCP call: agent_heartbeat
  └─ SessionManager.updateHeartbeat()
     ├─ UPDATE agent_sessions (last_heartbeat)
     ├─ UPDATE agent_presence (status = 'ONLINE', last_seen)
     └─ INSERT agent_activity (type = 'HEARTBEAT')
}, 30000)

Database updates every 30s:
agent_presence: A | ONLINE | 2025-10-09 02:05:30
agent_sessions: session-uuid | last_heartbeat: 2025-10-09 02:05:30
agent_activity: HEARTBEAT | A | 2025-10-09 02:05:30

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 11: Self-Healing Monitors (Background)                     │
└─────────────────────────────────────────────────────────────────┘

HealthChecker runs periodically:

Every 5 minutes:
├─ Check for zombie agents (no heartbeat >5 min)
│  └─ UPDATE agent_presence SET status = 'OFFLINE'
│     WHERE last_seen < NOW() - 300 seconds
│
├─ Check for stuck tasks (IN_PROGRESS >24 hours)
│  └─ Report for review
│
├─ Clean up old activity logs (>50K entries)
│  └─ DELETE FROM agent_activity
│     WHERE id NOT IN (last 10,000)
│
└─ Unblock ready tasks
   └─ UPDATE tasks SET status = 'AVAILABLE'
      WHERE dependencies all COMPLETE

All automatic! No human intervention!

                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 12: Agent Completes Task (Keep-in-Touch Gating)            │
└─────────────────────────────────────────────────────────────────┘

Agent finishes coding and runs:
$ brain task complete T011

CLI flow:
├─ Step 1: Check in first
│  └─ Call: agent_checkin
│     └─ KeepInTouchEnforcer.checkIn()
│        ├─ UPDATE kit_sessions (last_check_in, missed = 0)
│        └─ INSERT agent_activity (CHECK_IN)
│
├─ Step 2: Request permission
│  └─ Call: request_completion_permission
│     └─ KeepInTouchEnforcer.checkPermission()
│        ├─ Check: last check-in < 30 min ago ✅
│        ├─ Check: permission exists? NO
│        ├─ INSERT completion_permissions (status = 'PENDING')
│        └─ Return: BLOCKED (wait 60s for auto-approval)
│
├─ Step 3: Wait for permission (60 seconds)
│  CLI shows: "⏳ Waiting for approval (auto in 60s)..."
│
├─ Step 4: Auto-approval triggers
│  └─ KeepInTouchEnforcer (timeout check):
│     ├─ requested_at + 60s < NOW() ✅
│     ├─ UPDATE completion_permissions
│     │  SET status = 'GRANTED', granted_by = 'AUTO'
│     └─ Return: PERMISSION GRANTED ✅
│
└─ Step 5: Complete task
   └─ Call: complete_task
      └─ TaskRegistry.completeTask('T011', 'A')

                              ↓
GitTracker Verification:
├─ getFileTimestamps(['ReactQuery.tsx', 'SSR.tsx'])
│  └─ git log --name-status
│     Returns: 8/10 files created = 80%
│
├─ getCommitHistory('T011')
│  └─ git log --grep="T011"
│     Returns: 3 commits = 100%
│
└─ calculateCompletionScore()
   ├─ File score: 80% × 0.7 = 56%
   ├─ Commit score: 100% × 0.3 = 30%
   ├─ Total: 86% ≥ 80% threshold
   └─ RESULT: AUTO-VERIFIED ✅

                              ↓
TaskStore (ATOMIC TRANSACTION):
BEGIN TRANSACTION
├─ UPDATE tasks SET
│    status = 'COMPLETE',
│    completed_at = NOW(),
│    velocity = 150,
│    files_created = '["ReactQuery.tsx", ...]'
│  WHERE id = 'T011' AND claimed_by = 'A'
│
├─ DependencyResolver.findTasksToUnblock('T011')
│  └─ SELECT * FROM tasks WHERE dependencies LIKE '%T011%'
│     Found: T014 (IndexedDB)
│
├─ UPDATE tasks SET status = 'AVAILABLE'
│  WHERE id = 'T014'  -- Auto-unblock!
│
└─ COMMIT

Database after:
T011 | Complete | A | velocity: 150
T014 | Available | A | (was BLOCKED, now ready!)

                              ↓
Response chain:
TaskStore → TaskRegistry → complete_task handler → MCP response → CLI

CLI shows:
✅ Task T011 completed!
🎉 Auto-verified by Git (86% score)
🔓 Unlocked: T014 (IndexedDB Offline Persistence)
📊 Your velocity: 150% (excellent!)

💡 Next recommendation: T014 (88% match)
   Claim it? (y/n)
```

---

## 🧩 COMPONENT INTEGRATION MATRIX

### **How Each Component Connects to Others:**

```
┌─────────────────┐
│   CLI TOOL      │ (User Interface)
│ brain connect   │
└────────┬────────┘
         │ spawns process + stdio
         ↓
┌─────────────────┐
│  MCP SERVER     │ (Coordinator)
│  src/index.ts   │
└────────┬────────┘
         │ uses
         ├───────────────────────────────┬────────────────────┬────────────┐
         ↓                               ↓                    ↓            ↓
┌────────────────┐  ┌─────────────────┐  ┌────────────────┐  ┌──────────────┐
│DiscoveryEngine │  │  TaskRegistry   │  │ SessionManager │  │HealthChecker │
└───┬────────────┘  └────┬────────────┘  └───┬────────────┘  └──┬───────────┘
    │ uses               │ uses              │ uses             │ uses
    ├──────────┬─────────┼────────┬──────────┼─────────┬────────┤
    ↓          ↓         ↓        ↓          ↓         ↓        ↓
┌─────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐ ┌──────┐ ┌─────────┐
│ Project │ │Agent │ │Task  │ │Dep   │ │Keep    │ │Git   │ │Auto     │
│Detector │ │Recog │ │Store │ │Resolv│ │InTouch │ │Track │ │Recovery │
└────┬────┘ └──┬───┘ └──┬───┘ └──┬───┘ └───┬────┘ └──┬───┘ └────┬────┘
     │         │        │        │         │         │         │
     └─────────┴────────┴────────┴─────────┴─────────┴─────────┘
                              │
                     ALL USE DATABASE
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SQLite Database                               │
│                  data/registry.db                                │
├─────────────────────────────────────────────────────────────────┤
│  11 Tables:                                                      │
│  ├─ projects (multi-project registry)                           │
│  ├─ agents (persistent identity)                                │
│  ├─ tasks (task definitions)                                    │
│  ├─ agent_sessions (connection history)                         │
│  ├─ agent_presence (real-time status)                           │
│  ├─ agent_activity (complete audit log)                         │
│  ├─ context_files (extracted context)                           │
│  ├─ kit_sessions (keep-in-touch)                                │
│  ├─ completion_permissions (gating)                             │
│  └─ ... more                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW - How Information Moves

### **Flow 1: Agent → Database**

```
Agent action: brain connect
   ↓
CLI → MCP call: discover_environment
   ↓
DiscoveryEngine orchestrates:
   ├─ AgentRecognizer → SELECT FROM agents → FOUND or INSERT
   ├─ ProjectDetector → SELECT FROM projects → FOUND or INSERT
   ├─ ContextExtractor → SELECT FROM context_files → CACHED
   └─ JobProposalEngine → SELECT FROM tasks → SCORES & RANKS
   ↓
All components READ/WRITE same database
   ↓
Response flows back: MCP → CLI → Terminal
```

### **Flow 2: Multiple Agents (Coordination)**

```
Agent A (Terminal 1): brain connect
Agent C (Terminal 2): brain connect

BOTH connect to SAME MCP server
   ↓
MCP Server maintains SINGLE database
   ↓
Agent A claims T011:
├─ UPDATE tasks SET status='CLAIMED', claimed_by='A'
├─ ATOMIC transaction prevents Agent C from claiming same task
└─ Database state: T011 | CLAIMED | A

Agent C tries to claim T011:
├─ TaskStore.claimTask() checks status
├─ status = 'CLAIMED' (not AVAILABLE)
├─ Return: {success: false, error: 'Task already claimed'}
└─ Agent C sees different available tasks

NO RACE CONDITIONS! ✅
```

### **Flow 3: Self-Healing (Autonomous)**

```
Background timer (every 5 minutes):
   ↓
HealthChecker.performHealthCheck():
   ├─ Query: SELECT * FROM agent_presence WHERE status='ONLINE'
   │         AND last_seen < NOW() - 300 seconds
   │  Found: Agent B (zombie - no heartbeat)
   │
   ├─ Auto-heal:
   │  UPDATE agent_presence SET status='OFFLINE' WHERE agent_letter='B'
   │
   ├─ Query: SELECT * FROM tasks WHERE status='IN_PROGRESS'
   │         AND claimed_at < NOW() - 24 hours
   │  Found: None (all tasks fresh)
   │
   └─ Query: SELECT COUNT(*) FROM agent_activity
      Found: 15,234 entries
      Action: DELETE old entries, keep last 10,000

All automatic! Database stays healthy!
```

---

## 🔌 MCP PROTOCOL LAYER - How Communication Works

### **JSON-RPC 2.0 Format:**

```
REQUEST (CLI → MCP Server):
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "claim_task",      ← Tool name
    "arguments": {             ← Tool arguments
      "taskId": "T011",
      "agent": "A"
    }
  }
}

                    ↓ stdio (stdin)

MCP SERVER ROUTING:
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Find tool by name
  const tool = allTools.find(t => t.name === name);

  // Execute handler
  return await tool.handler(args);
});

                    ↓

TOOL HANDLER:
export async function handleClaimTask(args, db) {
  // Validate with Zod
  const parsed = ClaimTaskArgsSchema.parse(args);

  // Execute business logic
  const result = await registry.claimTask(parsed.taskId, parsed.agent);

  // Return MCP response
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(result)
    }]
  };
}

                    ↓ stdio (stdout)

RESPONSE (MCP Server → CLI):
{
  "jsonrpc": "2.0",
  "result": {
    "content": [{
      "type": "text",
      "text": "{\"success\":true,\"claimedAt\":\"...\"}"
    }]
  },
  "id": 1
}

                    ↓

CLI parses and displays:
✅ Task claimed successfully!
```

---

## 🔗 18 MCP TOOLS - What Each Does

### **Task Management Tools (6):**

```
1. get_available_tasks
   Input: { agent: "A" }
   Flow: CLI → MCP → TaskRegistry.getAvailableTasks() → Database query
   Output: Filtered list of available tasks
   Uses: TaskRegistry, DependencyResolver

2. claim_task
   Input: { taskId: "T011", agent: "A" }
   Flow: CLI → MCP → TaskStore.claimTask() → ATOMIC UPDATE
   Output: Success + timestamp
   Uses: TaskRegistry, TaskStore (ACID transaction)

3. update_progress
   Input: { taskId, status, percent, files, notes }
   Flow: CLI → MCP → TaskStore → GitTracker
   Output: Updated task + Git verification
   Uses: TaskRegistry, TaskStore, GitTracker

4. complete_task
   Input: { taskId, agent, files, velocity }
   Flow: CLI → MCP → GitTracker.verify() → TaskStore → DependencyResolver
   Output: Completion + unblocked tasks
   Uses: TaskRegistry, GitTracker, DependencyResolver

5. get_dashboard
   Input: { project?: "uuid" }
   Flow: CLI → MCP → TaskRegistry.getSprintMetrics()
   Output: Sprint stats, agent status (ASCII art)
   Uses: TaskRegistry, GitTracker

6. get_agent_status
   Input: { agent: "A" }
   Flow: CLI → MCP → TaskRegistry.getAgentWorkload()
   Output: Agent tasks, Git activity (ASCII art)
   Uses: TaskRegistry, GitTracker
```

### **Intelligence Tools (4):**

```
7. agent_connect
   Input: { agent, model, project }
   Flow: CLI → MCP → SessionManager.createSession()
   Output: Session UUID + welcome
   Side Effects: INSERT sessions, UPDATE presence, INSERT activity

8. agent_heartbeat
   Input: { sessionId, currentActivity }
   Flow: Auto-called every 30s → SessionManager.updateHeartbeat()
   Output: ACK
   Side Effects: UPDATE sessions + presence

9. agent_disconnect
   Input: { sessionId }
   Flow: CLI exit → SessionManager.closeSession()
   Output: Duration + stats
   Side Effects: UPDATE sessions, INSERT metrics

10. get_swarm_dashboard
    Input: { project?: "uuid" }
    Flow: CLI → MCP → Multi-table join
    Output: All agents + recent activity
    Side Effects: Auto zombie cleanup
```

### **Discovery Tools (5):**

```
11. discover_environment ⭐ MAIN ENTRY
    Input: { cwd, modelId, trackingId }
    Flow: CLI → MCP → DiscoveryEngine (orchestrates 4 sub-components)
    Output: Complete environment package
    Side Effects: INSERT agents, projects, context_files

12. upload_context
    Input: { projectId, files }
    Flow: CLI → MCP → ContextManager.uploadToCloud()
    Output: Upload status
    Side Effects: Files to S3/GCS (future) or local storage

13. search_context
    Input: { projectId, query }
    Flow: CLI → MCP → ContextManager.searchContext()
    Output: Matching files
    Uses: context_files table + vector search (future)

14. retrieve_context
    Input: { projectId, fileId }
    Flow: CLI → MCP → ContextManager.downloadFromCloud()
    Output: File content
    Uses: Cloud storage or database

15. get_context_stats
    Input: { projectId }
    Flow: CLI → MCP → ContextManager.getStats()
    Output: Storage stats, file counts
    Uses: context_files table
```

### **Health Tools (1):**

```
16. get_system_health
    Input: { autoHeal: true }
    Flow: CLI → MCP → HealthChecker.performHealthCheck()
    Output: Health status + recovery actions
    Side Effects: AUTO-HEALS detected issues!
    Uses: All tables for health checks
```

### **Keep-in-Touch Tools (2):**

```
17. agent_checkin ⭐ CRITICAL
    Input: { sessionId, agentId, activity, progress }
    Flow: CLI → MCP → KeepInTouchEnforcer.checkIn()
    Output: ACK + next check-in time
    Side Effects: UPDATE kit_sessions, INSERT activity

18. request_completion_permission ⭐ CRITICAL
    Input: { taskId, agentId, sessionId }
    Flow: complete_task → MCP → KeepInTouchEnforcer.checkPermission()
    Output: GRANTED or BLOCKED
    Side Effects: INSERT/UPDATE completion_permissions
    Behavior: BLOCKS task completion until approved!
```

---

## 🗄️ DATABASE - Central Coordination Hub

### **All Components Share Same Database:**

```
projects table:
├─ Written by: ProjectDetector
├─ Read by: DiscoveryEngine, TaskRegistry, ContextExtractor
└─ Purpose: Multi-project registry

agents table:
├─ Written by: AgentRecognizer
├─ Read by: DiscoveryEngine, SessionManager
└─ Purpose: Persistent agent identity

tasks table:
├─ Written by: TaskStore, UniversalTaskRegistry
├─ Read by: TaskRegistry, DependencyResolver, JobProposalEngine
└─ Purpose: Task definitions + status

agent_sessions table:
├─ Written by: SessionManager
├─ Read by: Intelligence tools, HealthChecker
└─ Purpose: Connection lifecycle

agent_presence table:
├─ Written by: SessionManager
├─ Read by: get_swarm_dashboard, HealthChecker
└─ Purpose: Real-time agent status

agent_activity table:
├─ Written by: ALL MCP operations
├─ Read by: Audit queries, analytics
└─ Purpose: Complete operation log

context_files table:
├─ Written by: ContextExtractor
├─ Read by: ContextManager, JobProposalEngine
└─ Purpose: Indexed project context

kit_sessions table:
├─ Written by: KeepInTouchEnforcer
├─ Read by: Completion gating checks
└─ Purpose: Check-in tracking

completion_permissions table:
├─ Written by: KeepInTouchEnforcer
├─ Read by: complete_task handler
└─ Purpose: Completion gating ⭐

ALL TABLES = SINGLE SOURCE OF TRUTH
NO DUPLICATION
ACID TRANSACTIONS
REFERENTIAL INTEGRITY
```

---

## ⚡ PARALLEL AGENT COORDINATION

### **How Multiple Agents Work Together:**

```
TIME: 10:00 AM
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ Agent A (Terminal 1) │  │ Agent C (Terminal 2) │  │ Agent D (Terminal 3) │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
         │                          │                          │
         │ brain connect            │ brain connect            │ brain connect
         │                          │                          │
         └──────────────┬───────────┴──────────────┬───────────┘
                        ↓                          ↓
              ┌─────────────────────────────────────────┐
              │     SAME MCP Server Process             │
              │     SAME SQLite Database                │
              └─────────────────────────────────────────┘
                        ↓                          ↓
              ┌─────────────────┐      ┌─────────────────┐
              │ Agent A Session │      │ Agent C Session │
              │ session-uuid-a  │      │ session-uuid-c  │
              └─────────────────┘      └─────────────────┘

Database State at 10:00 AM:
agent_presence:
├─ A | ONLINE | session-uuid-a | T011 | 10:00:00
└─ C | ONLINE | session-uuid-c | T018 | 10:00:00

tasks:
├─ T011 | CLAIMED | A
└─ T018 | CLAIMED | C

TIME: 10:30 AM - Both agents working
┌──────────────────────┐  ┌──────────────────────┐
│ Agent A              │  │ Agent C              │
│ Heartbeat every 30s  │  │ Heartbeat every 30s  │
│ Working on T011      │  │ Working on T018      │
└──────────────────────┘  └──────────────────────┘
         │                          │
         │ agent_heartbeat          │ agent_heartbeat
         └──────────────┬───────────┘
                        ↓
              ┌─────────────────────┐
              │ SessionManager      │
              │ Updates both:       │
              │ - last_heartbeat    │
              │ - last_seen         │
              │ - status (ONLINE)   │
              └─────────────────────┘

Database State at 10:30 AM:
agent_presence:
├─ A | ONLINE | last_seen: 10:30:00
└─ C | ONLINE | last_seen: 10:30:00

agent_activity (last 10 entries):
├─ HEARTBEAT | A | 10:30:00
├─ HEARTBEAT | C | 10:30:00
├─ HEARTBEAT | A | 10:29:30
├─ HEARTBEAT | C | 10:29:30
└─ ...

TIME: 12:00 PM - Agent A completes first
┌──────────────────────┐
│ Agent A              │
│ brain task complete  │
└──────────────────────┘
         │
         │ complete_task
         ↓
KeepInTouchEnforcer.checkPermission():
├─ Check: last check-in < 30 min? ✅
├─ Check: permission exists? NO
├─ Action: INSERT completion_permissions (PENDING)
└─ Return: BLOCKED (wait 60s)

Agent A waits 60 seconds...
   ↓
Auto-approval triggers:
├─ UPDATE completion_permissions SET status='GRANTED'
└─ Return: PERMISSION GRANTED

TaskRegistry.completeTask():
├─ UPDATE tasks SET status='COMPLETE' WHERE id='T011'
├─ DependencyResolver.findTasksToUnblock('T011')
│  └─ Found: T014 depends on T011
├─ UPDATE tasks SET status='AVAILABLE' WHERE id='T014'
└─ COMMIT

Database State at 12:00 PM:
tasks:
├─ T011 | COMPLETE | A | completed_at: 12:00
├─ T014 | AVAILABLE | A | (was BLOCKED, now AVAILABLE!)
└─ T018 | CLAIMED | C | (still working)

Agent A terminal shows:
✅ Task T011 completed!
🎉 Unlocked: T014
💡 Claim T014? (y/n)

Meanwhile, Agent C unaffected:
├─ Still working on T018
├─ Heartbeat still running
└─ Database coordinating automatically

NO CONFLICTS! ✅
NO MANUAL COORDINATION NEEDED! ✅
```

---

## 🎯 THE MAGIC - How It All Stays Synchronized

### **Single Source of Truth:**

```
ONE Database = ONE Truth
├─ All agents read from same tables
├─ All components write to same tables
├─ ACID transactions prevent conflicts
├─ Foreign keys maintain integrity
└─ Indexes ensure performance

Example - Task Claiming:
┌─ Agent A attempts claim T011
│  TaskStore executes:
│  BEGIN TRANSACTION
│  UPDATE tasks SET status='CLAIMED'
│  WHERE id='T011' AND status='AVAILABLE'
│  → Rows affected: 1 ✅
│  COMMIT
│
└─ Agent C attempts claim T011 (1ms later)
   TaskStore executes:
   BEGIN TRANSACTION
   UPDATE tasks SET status='CLAIMED'
   WHERE id='T011' AND status='AVAILABLE'
   → Rows affected: 0 ❌ (already CLAIMED!)
   ROLLBACK
   Return: {success: false}

Atomic operations ensure:
✅ Only ONE agent can claim
✅ NO race conditions
✅ NO conflicts
✅ Database always consistent
```

### **Auto-Unblocking:**

```
When Agent A completes T011:

DependencyResolver.findTasksToUnblock('T011'):
├─ Query: Find all tasks with T011 in dependencies
│  SELECT * FROM tasks
│  WHERE dependencies LIKE '%"T011"%'
│
├─ Found: T014 (depends on T011)
│
├─ Check: Are T014's other dependencies satisfied?
│  T014 dependencies: ["T011"]
│  T011 status: COMPLETE ✅
│  All satisfied: YES ✅
│
└─ Action: UPDATE tasks SET status='AVAILABLE' WHERE id='T014'

Result: T014 automatically becomes available!
Agent A can claim it immediately!
NO manual unblocking needed! ✅
```

---

## 🏗️ LAYERED ARCHITECTURE - How Abstractions Work

```
LAYER 1: USER INTERFACE
├─ CLI Tool (brain command)
└─ Future: Web Dashboard

LAYER 2: MCP PROTOCOL
├─ JSON-RPC 2.0 messages
├─ stdio transport (local) or WebSocket (cloud future)
└─ Standard protocol (any MCP client can connect)

LAYER 3: MCP TOOLS (18 tools)
├─ Request validation (Zod schemas)
├─ Business logic delegation
└─ Response formatting

LAYER 4: CORE COMPONENTS
├─ DiscoveryEngine (orchestrates discovery)
├─ TaskRegistry (task coordination)
├─ SessionManager (agent tracking)
├─ HealthChecker (self-healing)
└─ KeepInTouchEnforcer (completion gating)

LAYER 5: SUB-COMPONENTS
├─ ProjectDetector, ContextExtractor, AgentRecognizer, JobProposalEngine
├─ TaskStore, DependencyResolver, GitTracker
└─ Auto-recovery mechanisms

LAYER 6: DATA LAYER
├─ SQLite database (11 tables)
├─ ACID transactions
├─ Referential integrity
└─ Performance indexes

Each layer only talks to adjacent layers!
Clean separation!
Easy to test!
Easy to replace!
```

---

## 💡 THE SEAMLESS EXPERIENCE (When Complete)

### **What Agent Experiences:**

```
$ brain connect

Behind the scenes (ALL AUTOMATIC):
├─ CLI spawns MCP server
├─ MCP server opens database
├─ discover_environment called
│  ├─ AgentRecognizer: "Oh, this is Agent A (recognized!)"
│  ├─ ProjectDetector: "This is LocalBrain project"
│  ├─ ContextExtractor: "Context already indexed (cached)"
│  └─ JobProposalEngine: "Best match: T014 (88%)"
├─ Response flows back through MCP → CLI
└─ Beautiful output displayed

Agent sees:
✅ Ready to work on T014! Claim it? (y/n)

Agent types: y

Behind the scenes:
├─ claim_task MCP call
├─ TaskStore atomic UPDATE
├─ Database: T014 | CLAIMED | A
└─ Auto-heartbeat starts (30s intervals)

Agent codes for 2 hours...

Behind the scenes (AUTOMATIC):
├─ Heartbeat every 30 seconds (no agent action)
├─ Presence updated (A | ONLINE)
├─ Activity logged
└─ Health checks running

Agent finishes:
$ brain task complete

Behind the scenes:
├─ Check-in validated
├─ Permission requested
├─ Wait 60s or human approval
├─ Git verification (86% score)
├─ Task marked COMPLETE
├─ Dependent tasks unblocked
└─ Metrics updated

Agent sees:
✅ Complete! Unlocked T020. Next?

ALL COORDINATION AUTOMATIC!
ALL STATE IN DATABASE!
ALL COMPONENTS SYNCHRONIZED!
```

---

## 🎯 ANSWER: HOW DOES IT ALL WORK TOGETHER?

### **Simple Answer:**

**ONE DATABASE connects everything.**

- CLI talks to MCP Server (stdio)
- MCP Server uses Core Components
- Core Components use Database
- Database is single source of truth
- All agents coordinate via same database
- All state synchronized automatically

### **The Flow:**

```
Agent Action → CLI → MCP → Components → Database
                                           ↓
Database State Updated ← ← ← ← ← ← ← ← ← ←
                                           ↓
Other Agents See Changes Immediately (next query)
```

### **The Magic:**

✅ **Atomic operations** - No race conditions
✅ **Single database** - No sync issues
✅ **MCP protocol** - Standard communication
✅ **Auto-heartbeat** - Automatic presence
✅ **Self-healing** - Automatic recovery
✅ **Auto-unblocking** - Automatic coordination
✅ **Git verification** - Automatic validation

**Result**: Everything stays synchronized automatically! 🎯

---

**Created By**: Agent D
**Purpose**: Explain complete system integration
**Status**: ✅ COMPLETE MAP
