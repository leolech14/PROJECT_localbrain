# Agent Intelligence & Observability System
## Real-Time Multi-Agent Activity Tracking

**Vision Date**: 2025-10-08
**Architect**: Lech + Agent D
**Status**: 🎯 DESIGN PHASE
**Purpose**: Complete visibility into agent behavior, patterns, and performance

---

## 🎯 THE VISION

**Every agent interaction tracked, analyzed, and visualized in real-time.**

```
┌─────────────────────────────────────────────────────────┐
│ AGENT INTELLIGENCE DASHBOARD                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🟢 Agent A (GLM-4.6)        ONLINE  [Last seen: 2m ago] │
│    └─ Working on: T004 (Grid System Foundation)         │
│    └─ Progress: 75% • Started: 1h 23m ago               │
│    └─ Session: 1h 45m • Tasks today: 3 complete         │
│                                                         │
│ 🟢 Agent B (Sonnet-4.5)     ONLINE  [Last seen: 30s]    │
│    └─ Status: IDLE (all tasks complete)                 │
│    └─ Available for: Architecture, Design tasks         │
│    └─ Session: 45m • Tasks today: 0 (waiting)           │
│                                                         │
│ 🟢 Agent C (GLM-4.6)        ONLINE  [Last seen: 1m]     │
│    └─ Working on: T018 (RAG Index)                      │
│    └─ Progress: 40% • Started: 32m ago                  │
│    └─ Session: 1h 12m • Tasks today: 1 complete         │
│                                                         │
│ 🔴 Agent D (Sonnet-4.5)     OFFLINE [Last seen: 2h]     │
│    └─ Last activity: Completed T019                     │
│    └─ Total today: 1 task • Velocity: 180 min/task     │
│                                                         │
│ 🟡 Agent E (Gemini-2.5-Pro) IDLE    [Last seen: 15m]    │
│    └─ Monitoring mode (no active tasks)                 │
│    └─ Session: 3h 22m • Coordination checks: 12         │
│                                                         │
│ 🔴 Agent F (ChatGPT-5)      OFFLINE [Last seen: 1d]     │
│    └─ Strategic supervisor (not daily active)           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA EXTENSION

### **New Tables for Agent Intelligence**

```sql
-- Agent Sessions (track connections)
CREATE TABLE agent_sessions (
  id TEXT PRIMARY KEY,                      -- UUID for session
  agent_letter TEXT NOT NULL,               -- A, B, C, D, E, F
  agent_model TEXT NOT NULL,                -- GLM-4.6, Sonnet-4.5, etc.
  project_id TEXT NOT NULL,                 -- LocalBrain, PROJECT_minerals, etc.
  connected_at TEXT NOT NULL,               -- ISO timestamp
  disconnected_at TEXT,                     -- NULL if still active
  last_heartbeat TEXT NOT NULL,             -- Last activity timestamp
  ip_address TEXT,                          -- Connection source
  machine_id TEXT,                          -- Unique machine identifier
  session_duration_minutes INTEGER,         -- Auto-calculated on disconnect
  total_queries INTEGER DEFAULT 0,          -- Queries made during session
  tasks_claimed INTEGER DEFAULT 0,          -- Tasks claimed during session
  tasks_completed INTEGER DEFAULT 0,        -- Tasks completed during session
  status TEXT DEFAULT 'ACTIVE'              -- ACTIVE, IDLE, DISCONNECTED
);

-- Agent Activity Log (every MCP operation)
CREATE TABLE agent_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,                 -- Links to agent_sessions
  agent_letter TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  activity_type TEXT NOT NULL,              -- CONNECT, QUERY, CLAIM, UPDATE, COMPLETE, HEARTBEAT
  task_id TEXT,                             -- NULL for non-task activities
  details TEXT,                             -- JSON with activity details
  duration_ms INTEGER,                      -- Time taken for operation
  FOREIGN KEY (session_id) REFERENCES agent_sessions(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- Agent Presence (current status)
CREATE TABLE agent_presence (
  agent_letter TEXT PRIMARY KEY,            -- A, B, C, D, E, F
  status TEXT NOT NULL,                     -- ONLINE, IDLE, OFFLINE
  current_session_id TEXT,                  -- Current active session
  current_task_id TEXT,                     -- Currently working on
  last_seen TEXT NOT NULL,                  -- Last activity timestamp
  online_since TEXT,                        -- When current session started
  total_sessions_today INTEGER DEFAULT 0,
  total_active_time_minutes INTEGER DEFAULT 0,
  tasks_today INTEGER DEFAULT 0,
  FOREIGN KEY (current_session_id) REFERENCES agent_sessions(id),
  FOREIGN KEY (current_task_id) REFERENCES tasks(id)
);

-- Agent Performance Metrics (aggregated)
CREATE TABLE agent_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_letter TEXT NOT NULL,
  metric_date TEXT NOT NULL,                -- Date for daily aggregation
  total_sessions INTEGER DEFAULT 0,
  total_active_minutes INTEGER DEFAULT 0,
  tasks_claimed INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  average_task_minutes REAL,
  velocity_score REAL,                      -- Tasks/hour
  quality_score REAL,                       -- Based on rework, bugs, etc.
  collaboration_score REAL,                 -- Based on cross-agent coordination
  UNIQUE(agent_letter, metric_date)
);

-- Agent Collaboration Events
CREATE TABLE agent_collaboration (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  agent_from TEXT NOT NULL,                 -- Initiating agent
  agent_to TEXT NOT NULL,                   -- Target agent
  collaboration_type TEXT NOT NULL,         -- HANDOFF, REVIEW, ASSIST, COORDINATE
  task_id TEXT,                             -- Related task
  details TEXT,                             -- JSON with collaboration details
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
```

---

## 🔧 ENHANCED MCP TOOLS

### **New MCP Tools for Agent Intelligence**

#### **1. agent_connect** (Automatic on connection)
```typescript
{
  name: "agent_connect",
  description: "Register agent connection and create session",
  inputSchema: {
    type: "object",
    properties: {
      agent: { type: "string", enum: ["A", "B", "C", "D", "E", "F"] },
      model: { type: "string" },        // GLM-4.6, Sonnet-4.5, etc.
      project: { type: "string" },      // LocalBrain, etc.
      machineId: { type: "string" }     // Unique machine identifier
    },
    required: ["agent", "model", "project"]
  }
}

// Returns:
{
  sessionId: "uuid",
  welcomeMessage: "Welcome Agent A! You have 2 tasks available.",
  currentStatus: { /* agent presence data */ }
}
```

#### **2. agent_heartbeat** (Every 30 seconds)
```typescript
{
  name: "agent_heartbeat",
  description: "Send heartbeat to maintain presence",
  inputSchema: {
    type: "object",
    properties: {
      sessionId: { type: "string" },
      currentActivity: { type: "string" }  // IDLE, WORKING, REVIEWING, etc.
    },
    required: ["sessionId"]
  }
}
```

#### **3. get_agent_status** (Enhanced with intelligence)
```typescript
{
  name: "get_agent_status",
  description: "Get detailed status for agent or all agents",
  inputSchema: {
    type: "object",
    properties: {
      agent: { type: "string" },        // Specific agent or null for all
      includeMetrics: { type: "boolean", default: true },
      includeHistory: { type: "boolean", default: false }
    }
  }
}

// Returns:
{
  agents: [
    {
      letter: "A",
      status: "ONLINE",
      lastSeen: "2025-10-08T12:34:56Z",
      currentTask: "T004",
      sessionDuration: "1h 45m",
      tasksToday: 3,
      velocity: 2.1,  // tasks per hour
      availableFor: ["UI", "Frontend"]
    }
  ]
}
```

#### **4. get_swarm_dashboard** (Real-time coordination view)
```typescript
{
  name: "get_swarm_dashboard",
  description: "Get real-time view of entire agent swarm",
  inputSchema: {
    type: "object",
    properties: {
      project: { type: "string" }       // Filter by project
    }
  }
}

// Returns:
{
  project: "LocalBrain",
  totalAgents: 6,
  agentsOnline: 3,
  agentsIdle: 1,
  agentsOffline: 2,
  totalTasks: 19,
  tasksInProgress: 2,
  tasksCompleteToday: 5,
  swarmVelocity: 1.8,  // Average tasks/hour across all agents
  agents: [ /* detailed agent status */ ],
  recentActivity: [ /* last 10 activities */ ]
}
```

#### **5. get_agent_timeline** (Historical activity)
```typescript
{
  name: "get_agent_timeline",
  description: "Get activity timeline for agent",
  inputSchema: {
    type: "object",
    properties: {
      agent: { type: "string", required: true },
      startDate: { type: "string" },   // ISO date
      endDate: { type: "string" },
      limit: { type: "number", default: 100 }
    },
    required: ["agent"]
  }
}

// Returns timeline of all activities
```

---

## 🎯 AUTOMATIC SESSION TRACKING

### **Connection Flow with Intelligence**

```typescript
// When agent connects (automatic)
class TaskRegistryClient {
  constructor(agentLetter: string) {
    this.agent = agentLetter;
    this.model = detectModel();  // Auto-detect (GLM-4.6, Sonnet-4.5, etc.)
    this.machineId = getMachineId();

    // 1. Connect to MCP server
    this.server = spawn('node', ['dist/index.js']);

    // 2. Register session
    this.sessionId = await this.registerSession();

    // 3. Start heartbeat (every 30s)
    this.startHeartbeat();

    // 4. Log connection
    console.log(`✅ Agent ${this.agent} connected - Session ${this.sessionId}`);
  }

  private async registerSession() {
    const response = await this.call('agent_connect', {
      agent: this.agent,
      model: this.model,
      project: 'LocalBrain',
      machineId: this.machineId
    });

    return response.sessionId;
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(async () => {
      await this.call('agent_heartbeat', {
        sessionId: this.sessionId,
        currentActivity: this.currentActivity
      });
    }, 30000); // Every 30 seconds
  }

  // Track activity for each operation
  async claimTask(taskId: string) {
    this.currentActivity = 'CLAIMING';
    await this.logActivity('CLAIM', taskId);

    const result = await this.call('claim_task', { taskId, agent: this.agent });

    this.currentActivity = 'WORKING';
    return result;
  }

  private async logActivity(type: string, taskId?: string) {
    await this.call('log_activity', {
      sessionId: this.sessionId,
      activityType: type,
      taskId,
      timestamp: new Date().toISOString()
    });
  }

  disconnect() {
    // Stop heartbeat
    clearInterval(this.heartbeatInterval);

    // Log disconnection
    this.call('agent_disconnect', { sessionId: this.sessionId });

    // Kill server
    this.server.kill();
  }
}
```

---

## 📊 REAL-TIME DASHBOARD

### **Live Agent Dashboard (HTML + WebSocket)**

```typescript
// 01_CODEBASES/mcp-servers/localbrain-task-registry/src/dashboard/index.ts

import express from 'express';
import { WebSocketServer } from 'ws';
import { AgentIntelligence } from '../intelligence/AgentIntelligence';

const app = express();
const wss = new WebSocketServer({ port: 3001 });

// Serve dashboard HTML
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

// Broadcast agent updates every 5 seconds
setInterval(() => {
  const intelligence = new AgentIntelligence();
  const swarmStatus = intelligence.getSwarmDashboard();

  wss.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'SWARM_UPDATE',
      data: swarmStatus
    }));
  });
}, 5000);

app.listen(3000, () => {
  console.log('📊 Agent Intelligence Dashboard: http://localhost:3000/dashboard');
});
```

### **Dashboard UI (Real-time updates)**

```html
<!-- dashboard.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Agent Intelligence Dashboard</title>
  <style>
    .agent-card {
      border: 2px solid #333;
      padding: 20px;
      margin: 10px;
      border-radius: 8px;
    }
    .agent-online { border-color: #00ff00; }
    .agent-idle { border-color: #ffaa00; }
    .agent-offline { border-color: #ff0000; }
  </style>
</head>
<body>
  <h1>🎯 Multi-Agent Intelligence Dashboard</h1>
  <div id="agents"></div>

  <script>
    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);

      if (update.type === 'SWARM_UPDATE') {
        renderAgents(update.data.agents);
      }
    };

    function renderAgents(agents) {
      const container = document.getElementById('agents');
      container.innerHTML = agents.map(agent => `
        <div class="agent-card agent-${agent.status.toLowerCase()}">
          <h2>${agent.status === 'ONLINE' ? '🟢' : agent.status === 'IDLE' ? '🟡' : '🔴'}
              Agent ${agent.letter} (${agent.model})</h2>
          <p><strong>Status:</strong> ${agent.status}</p>
          <p><strong>Last Seen:</strong> ${timeAgo(agent.lastSeen)}</p>
          ${agent.currentTask ? `
            <p><strong>Working on:</strong> ${agent.currentTask.name}</p>
            <p><strong>Progress:</strong> ${agent.currentTask.progress}%</p>
          ` : '<p><em>No active task</em></p>'}
          <p><strong>Session:</strong> ${agent.sessionDuration}</p>
          <p><strong>Tasks Today:</strong> ${agent.tasksToday}</p>
          <p><strong>Velocity:</strong> ${agent.velocity} tasks/hour</p>
        </div>
      `).join('');
    }

    function timeAgo(timestamp) {
      const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000);
      if (seconds < 60) return `${seconds}s ago`;
      if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
      return `${Math.floor(seconds/3600)}h ago`;
    }
  </script>
</body>
</html>
```

---

## 📈 ANALYTICS & INSIGHTS

### **Agent Performance Analytics**

```typescript
// Weekly performance report
class AgentAnalytics {
  async generateWeeklyReport(agent: string) {
    const metrics = await db.query(`
      SELECT
        DATE(metric_date) as date,
        total_sessions,
        total_active_minutes,
        tasks_completed,
        velocity_score,
        quality_score
      FROM agent_metrics
      WHERE agent_letter = ?
        AND metric_date >= DATE('now', '-7 days')
      ORDER BY metric_date
    `, [agent]);

    return {
      agent,
      period: 'Last 7 days',
      totalSessions: sum(metrics, 'total_sessions'),
      totalActiveHours: sum(metrics, 'total_active_minutes') / 60,
      totalTasksCompleted: sum(metrics, 'tasks_completed'),
      averageVelocity: average(metrics, 'velocity_score'),
      averageQuality: average(metrics, 'quality_score'),
      trend: calculateTrend(metrics),
      dailyBreakdown: metrics
    };
  }

  async getSwarmInsights() {
    return {
      mostActiveAgent: await this.getMostActiveAgent(),
      highestVelocity: await this.getHighestVelocity(),
      collaborationPatterns: await this.getCollaborationPatterns(),
      bottlenecks: await this.detectBottlenecks(),
      recommendations: await this.generateRecommendations()
    };
  }
}
```

---

## 🚀 IMPLEMENTATION PHASES

### **Phase 1: Basic Tracking** (Immediate)
- [x] Session creation on connection
- [x] Heartbeat system (every 30s)
- [x] Activity logging (all MCP operations)
- [x] Agent presence table

### **Phase 2: Intelligence** (Next)
- [ ] Performance metrics aggregation
- [ ] Real-time dashboard
- [ ] Historical analytics
- [ ] Behavioral pattern detection

### **Phase 3: Advanced** (Future)
- [ ] Predictive analytics (predict agent availability)
- [ ] Anomaly detection (unusual behavior)
- [ ] Auto-scaling recommendations
- [ ] Cross-project correlation

---

## 📊 CLI COMMANDS FOR INTELLIGENCE

```bash
# See all agent status
mcp-registry agents status

# Watch specific agent
mcp-registry agents watch A

# View agent timeline
mcp-registry agents timeline D --today

# Generate performance report
mcp-registry agents report B --weekly

# See swarm dashboard
mcp-registry dashboard --live

# Export analytics
mcp-registry analytics export --format csv --agent A
```

---

## 🎯 INTELLIGENCE QUERIES

```sql
-- Who's online right now?
SELECT agent_letter, status, last_seen, current_task_id
FROM agent_presence
WHERE status = 'ONLINE'
ORDER BY agent_letter;

-- Agent activity in last hour
SELECT agent_letter, activity_type, task_id, timestamp
FROM agent_activity
WHERE timestamp > datetime('now', '-1 hour')
ORDER BY timestamp DESC;

-- Top performers this week
SELECT
  agent_letter,
  SUM(tasks_completed) as total_tasks,
  AVG(velocity_score) as avg_velocity,
  AVG(quality_score) as avg_quality
FROM agent_metrics
WHERE metric_date >= DATE('now', '-7 days')
GROUP BY agent_letter
ORDER BY total_tasks DESC;

-- Detect idle agents
SELECT agent_letter, last_seen,
  ROUND((JULIANDAY('now') - JULIANDAY(last_seen)) * 24 * 60) as minutes_idle
FROM agent_presence
WHERE status != 'OFFLINE'
  AND last_seen < datetime('now', '-30 minutes');
```

---

## 🌟 STRATEGIC VALUE

**This system provides:**

1. **Real-time Visibility**: See all agent activity instantly
2. **Performance Tracking**: Measure agent productivity and quality
3. **Bottleneck Detection**: Identify coordination issues
4. **Resource Optimization**: Allocate work based on availability
5. **Behavioral Insights**: Understand agent patterns
6. **Operational Intelligence**: Data-driven swarm management

**It's like Google Analytics for your AI agent swarm!** 📊

---

**Architect**: Agent D (Integration Specialist)
**Date**: 2025-10-08
**Status**: 🎯 DESIGN COMPLETE - Ready for implementation
**Impact**: REVOLUTIONARY - Complete agent observability and intelligence
