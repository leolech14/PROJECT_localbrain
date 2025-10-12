# 📋 Standardized Agent-Central Communication Protocol
## Every Response Includes Complete Agent Context

**Date**: 2025-10-09
**Purpose**: Standardize what agents see on EVERY Central Intelligence response
**Status**: PROTOCOL DEFINITION COMPLETE

---

## 🎯 THE STANDARD HEADER

### **Every MCP Response Includes:**

```
┌─────────────────────────────────────────────────────────────┐
│  🧠 CENTRAL INTELLIGENCE - Agent Context                    │
├─────────────────────────────────────────────────────────────┤
│  Agent ID: agent-d-uuid-12345                               │
│  Model: claude-sonnet-4-5 (1M context)                      │
│  Role: Integration Specialist                               │
│  Project: LocalBrain                                        │
│  Project Progress: 74% (14/19 tasks complete)               │
│  Your Tasks: 3 complete, 1 claimed, 0 available            │
│  Budget: 2.5h used / 5h daily limit (50%)                  │
│  Status: ✅ ACTIVE                                          │
└─────────────────────────────────────────────────────────────┘

[Response content follows...]
```

---

## 📊 REQUIRED FIELDS (8 Fields - Always Present)

### **1. Agent ID** (UUID)
```json
{
  "agentContext": {
    "agentId": "agent-d-uuid-12345",
    "trackingId": "tracking-uuid-67890"
  }
}
```

**Purpose**: Confirm identity across sessions
**Source**: `agents` table
**Example**: "agent-d-uuid-12345"

---

### **2. Model Confirmation** (String)
```json
{
  "agentContext": {
    "modelId": "claude-sonnet-4-5",
    "modelName": "Claude Sonnet 4.5 (1M)",
    "contextSize": 1000000,
    "costPerHour": 40
  }
}
```

**Purpose**: Agent knows what model they're running
**Source**: `model_catalog` table
**Example**: "claude-sonnet-4-5 (1M context, $40/hr)"

---

### **3. Current Role** (String)
```json
{
  "agentContext": {
    "role": "Integration Specialist",
    "roleId": "role-uuid",
    "swarmName": "System Integration Team",
    "assignedAt": "2025-10-09T00:00:00Z"
  }
}
```

**Purpose**: Agent knows their specialization
**Source**: `agent_roles` table + `swarms` table
**Example**: "Integration Specialist (System Integration Team)"

---

### **4. Current Project** (Object)
```json
{
  "agentContext": {
    "project": {
      "id": "localbrain",
      "name": "LocalBrain",
      "type": "COMMERCIAL_APP",
      "path": "/Users/lech/PROJECTS_all/LocalBrain"
    }
  }
}
```

**Purpose**: Agent knows where they are
**Source**: `projects` table
**Example**: "LocalBrain (COMMERCIAL_APP)"

---

### **5. Project Progress** (Percentage)
```json
{
  "agentContext": {
    "projectProgress": {
      "percentage": 74,
      "tasksComplete": 14,
      "tasksTotal": 19,
      "tasksInProgress": 1,
      "tasksClaimed": 3,
      "tasksBlocked": 2
    }
  }
}
```

**Purpose**: Official completion metric - THE KEY INDICATOR
**Source**: `tasks` table aggregated by `project_id`
**Calculation**: `(tasksComplete / tasksTotal) × 100`
**Example**: "74% (14/19 tasks complete)"

---

### **6. Agent Task Summary** (Object)
```json
{
  "agentContext": {
    "yourTasks": {
      "complete": 3,
      "claimed": 1,
      "inProgress": 0,
      "available": 0,
      "blocked": 1,
      "currentTask": "T019",
      "completionRate": "75%" // (3/4 assigned tasks done)
    }
  }
}
```

**Purpose**: Agent knows their personal progress
**Source**: `tasks` table filtered by `agent`
**Example**: "3 complete, 1 claimed (75% of your tasks done)"

---

### **7. Budget Status** (Object)
```json
{
  "agentContext": {
    "budget": {
      "hoursUsedToday": 2.5,
      "dailyLimit": 5,
      "hoursRemaining": 2.5,
      "percentUsed": 50,
      "estimatedCost": 100,
      "canWork": true,
      "alert": null
    }
  }
}
```

**Purpose**: Agent knows usage limits
**Source**: `agent_usage` + `model_catalog` tables
**Example**: "2.5h / 5h used today (50%)"

---

### **8. System Status** (Health)
```json
{
  "agentContext": {
    "systemStatus": {
      "health": "HEALTHY",
      "onlineAgents": 3,
      "totalAgents": 6,
      "timestamp": "2025-10-09T19:30:00Z"
    }
  }
}
```

**Purpose**: Agent knows system state
**Source**: `agent_presence` table + health checks
**Example**: "HEALTHY (3/6 agents online)"

---

## 📋 COMPLETE STANDARD RESPONSE FORMAT

### **Every MCP Tool Response:**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "agentContext": {
      "agentId": "agent-d-uuid-12345",
      "trackingId": "tracking-uuid-67890",
      "modelId": "claude-sonnet-4-5",
      "modelName": "Claude Sonnet 4.5 (1M)",
      "contextSize": 1000000,
      "costPerHour": 40,

      "role": "Integration Specialist",
      "swarmName": "System Integration Team",

      "project": {
        "id": "localbrain",
        "name": "LocalBrain",
        "type": "COMMERCIAL_APP",
        "path": "/Users/lech/PROJECTS_all/LocalBrain"
      },

      "projectProgress": {
        "percentage": 74,
        "tasksComplete": 14,
        "tasksTotal": 19,
        "breakdown": "14 done, 1 in progress, 3 claimed, 1 blocked"
      },

      "yourTasks": {
        "complete": 3,
        "claimed": 1,
        "available": 0,
        "currentTask": "T019",
        "completionRate": "75%"
      },

      "budget": {
        "hoursUsedToday": 2.5,
        "dailyLimit": 5,
        "percentUsed": 50,
        "canWork": true
      },

      "systemStatus": {
        "health": "HEALTHY",
        "onlineAgents": 3,
        "timestamp": "2025-10-09T19:30:00Z"
      }
    },

    "content": [{
      "type": "text",
      "text": "[Actual response data...]"
    }]
  },
  "id": 1
}
```

---

## 🎯 IMPLEMENTATION

### **Create AgentContextBuilder:**

```typescript
// src/core/AgentContextBuilder.ts

import Database from 'better-sqlite3';

export interface AgentContext {
  agentId: string;
  trackingId: string;
  modelId: string;
  modelName: string;
  contextSize: number;
  costPerHour: number;

  role: string;
  swarmName: string | null;

  project: {
    id: string;
    name: string;
    type: string;
    path: string;
  };

  projectProgress: {
    percentage: number;
    tasksComplete: number;
    tasksTotal: number;
    breakdown: string;
  };

  yourTasks: {
    complete: number;
    claimed: number;
    available: number;
    currentTask: string | null;
    completionRate: string;
  };

  budget: {
    hoursUsedToday: number;
    dailyLimit: number | null;
    percentUsed: number;
    canWork: boolean;
    alert?: string;
  };

  systemStatus: {
    health: string;
    onlineAgents: number;
    timestamp: string;
  };
}

export class AgentContextBuilder {
  constructor(private db: Database.Database) {}

  /**
   * Build complete agent context for response
   */
  buildContext(agentId: string, projectId: string): AgentContext {
    // 1. Agent Info
    const agent = this.db.prepare(`
      SELECT a.*, m.name as model_name, m.context_size, m.cost_per_hour
      FROM agents a
      JOIN model_catalog m ON a.model_id = m.model_id
      WHERE a.id = ?
    `).get(agentId) as any;

    // 2. Role Info
    const role = this.db.prepare(`
      SELECT ar.role_name, s.name as swarm_name
      FROM agent_roles ar
      LEFT JOIN swarms s ON ar.swarm_id = s.id
      WHERE ar.agent_id = ? AND ar.project_id = ? AND ar.active = 1
      ORDER BY ar.assigned_at DESC LIMIT 1
    `).get(agentId, projectId) as any;

    // 3. Project Info
    const project = this.db.prepare(`
      SELECT * FROM projects WHERE id = ?
    `).get(projectId) as any;

    // 4. Project Progress (KEY METRIC!)
    const progress = this.db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'COMPLETE' THEN 1 ELSE 0 END) as complete,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'CLAIMED' THEN 1 ELSE 0 END) as claimed,
        SUM(CASE WHEN status = 'BLOCKED' THEN 1 ELSE 0 END) as blocked
      FROM tasks
      WHERE project_id = ?
    `).get(projectId) as any;

    const percentage = Math.round((progress.complete / progress.total) * 100);

    // 5. Agent's Personal Tasks
    const agentTasks = this.db.prepare(`
      SELECT
        SUM(CASE WHEN status = 'COMPLETE' THEN 1 ELSE 0 END) as complete,
        SUM(CASE WHEN status = 'CLAIMED' THEN 1 ELSE 0 END) as claimed,
        SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available,
        (SELECT id FROM tasks WHERE agent = ? AND status IN ('CLAIMED', 'IN_PROGRESS') ORDER BY priority LIMIT 1) as current_task
      FROM tasks
      WHERE agent = ? AND project_id = ?
    `).get(agent.name, agent.name, projectId) as any;

    const agentTotal = (agentTasks.complete || 0) + (agentTasks.claimed || 0) + (agentTasks.available || 0);
    const agentCompletionRate = agentTotal > 0 ? Math.round((agentTasks.complete / agentTotal) * 100) : 0;

    // 6. Budget Status
    const today = new Date().toISOString().split('T')[0];
    const usage = this.db.prepare(`
      SELECT COALESCE(SUM(hours_used), 0) as hours
      FROM agent_usage
      WHERE agent_id = ? AND date = ?
    `).get(agentId, today) as { hours: number };

    const dailyLimit = agent.daily_hour_limit;
    const percentUsed = dailyLimit ? Math.round((usage.hours / dailyLimit) * 100) : 0;

    // 7. System Status
    const systemHealth = this.db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM agent_presence WHERE status IN ('ONLINE', 'IDLE')) as online,
        (SELECT COUNT(*) FROM agent_presence) as total
      FROM agent_presence LIMIT 1
    `).get() as any;

    // Build complete context
    return {
      agentId: agent.id,
      trackingId: agent.tracking_id,
      modelId: agent.model_id,
      modelName: agent.model_name || agent.model_id,
      contextSize: agent.context_size || 200000,
      costPerHour: agent.cost_per_hour || 0,

      role: role?.role_name || 'UNASSIGNED',
      swarmName: role?.swarm_name || null,

      project: {
        id: project.id,
        name: project.name,
        type: project.type,
        path: project.path
      },

      projectProgress: {
        percentage,
        tasksComplete: progress.complete,
        tasksTotal: progress.total,
        breakdown: `${progress.complete} done, ${progress.in_progress} in progress, ${progress.claimed} claimed, ${progress.blocked} blocked`
      },

      yourTasks: {
        complete: agentTasks.complete || 0,
        claimed: agentTasks.claimed || 0,
        available: agentTasks.available || 0,
        currentTask: agentTasks.current_task,
        completionRate: `${agentCompletionRate}%`
      },

      budget: {
        hoursUsedToday: usage.hours,
        dailyLimit,
        percentUsed,
        canWork: dailyLimit ? usage.hours < dailyLimit : true,
        alert: dailyLimit && percentUsed > 80 ? `⚠️ ${percentUsed}% of daily limit used` : undefined
      },

      systemStatus: {
        health: 'HEALTHY', // TODO: Get from HealthChecker
        onlineAgents: systemHealth.online,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Format context as readable header
   */
  formatHeader(context: AgentContext): string {
    const lines = [
      '┌─────────────────────────────────────────────────────────────┐',
      '│  🧠 CENTRAL INTELLIGENCE - Agent Context                    │',
      '├─────────────────────────────────────────────────────────────┤',
      `│  Agent: ${context.modelName.padEnd(48)} │`,
      `│  Role: ${context.role.padEnd(49)} │`,
      `│  Project: ${context.project.name.padEnd(46)} │`,
      `│  Progress: ${context.projectProgress.percentage}% (${context.projectProgress.tasksComplete}/${context.projectProgress.tasksTotal} tasks)${' '.repeat(35 - context.projectProgress.tasksComplete.toString().length - context.projectProgress.tasksTotal.toString().length)} │`,
      `│  Your Tasks: ${context.yourTasks.completionRate} complete${' '.repeat(35)} │`,
      `│  Budget: ${context.budget.hoursUsedToday.toFixed(1)}h/${context.budget.dailyLimit || '∞'}h used${' '.repeat(35)} │`,
      `│  Status: ${context.systemStatus.health}${' '.repeat(45)} │`,
      '└─────────────────────────────────────────────────────────────┘'
    ];

    return lines.join('\n');
  }
}
```

---

## 🔧 INTEGRATION INTO ALL MCP TOOLS

### **Pattern to Apply:**

```typescript
// Before (old pattern):
export async function handleDiscoverEnvironment(args, db) {
  const result = await discovery.discoverEnvironment(args);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(result)
    }]
  };
}

// After (new standard pattern):
export async function handleDiscoverEnvironment(args, db) {
  const result = await discovery.discoverEnvironment(args);

  // BUILD AGENT CONTEXT ⭐
  const contextBuilder = new AgentContextBuilder(db);
  const agentContext = contextBuilder.buildContext(result.agent.id, result.project.id);

  return {
    agentContext,  // ⭐ STANDARD HEADER
    content: [{
      type: 'text',
      text: JSON.stringify({
        ...result,
        _header: contextBuilder.formatHeader(agentContext)  // Readable version
      })
    }]
  };
}
```

---

## 📊 STANDARDIZED RESPONSE EXAMPLES

### **Example 1: discover_environment Response**

```json
{
  "agentContext": {
    "agentId": "agent-a-uuid",
    "modelId": "glm-4.6",
    "modelName": "GLM-4.6",
    "costPerHour": 2,
    "role": "UI Specialist",
    "project": {
      "name": "LocalBrain",
      "type": "COMMERCIAL_APP"
    },
    "projectProgress": {
      "percentage": 74,
      "tasksComplete": 14,
      "tasksTotal": 19
    },
    "yourTasks": {
      "complete": 2,
      "claimed": 1,
      "currentTask": "T011"
    },
    "budget": {
      "hoursUsedToday": 0,
      "dailyLimit": null,
      "canWork": true
    }
  },
  "content": [{
    "type": "text",
    "text": "{\"proposals\": [...]}"
  }]
}
```

**Agent sees immediately:**
- Who: GLM-4.6, UI Specialist
- Where: LocalBrain, 74% complete
- What: T011 claimed, 2 tasks done
- Budget: Unlimited (no daily limit)

---

### **Example 2: claim_task Response**

```json
{
  "agentContext": {
    // ... standard 8 fields ...
    "projectProgress": {
      "percentage": 74,  // UNCHANGED
      "tasksComplete": 14,
      "tasksTotal": 19
    }
  },
  "content": [{
    "type": "text",
    "text": "{\"success\": true, \"taskId\": \"T011\"}"
  }]
}
```

**Agent sees:**
- Claimed T011 successfully
- Project still 74% (this task not done yet)
- Can track progress as they work

---

### **Example 3: complete_task Response**

```json
{
  "agentContext": {
    // ... standard fields ...
    "projectProgress": {
      "percentage": 79,  // UPDATED! (was 74%, now 79%)
      "tasksComplete": 15,  // Was 14, now 15
      "tasksTotal": 19
    },
    "yourTasks": {
      "complete": 3,  // Was 2, now 3
      "claimed": 0,   // Was 1, now 0
      "completionRate": "100%"  // All your tasks done!
    }
  },
  "content": [{
    "type": "text",
    "text": "{\"success\": true, \"unblocked\": [\"T014\"]}"
  }]
}
```

**Agent sees immediately:**
- Project jumped 74% → 79% (you made impact!)
- You're now 100% complete (all your tasks done!)
- T014 unlocked for someone else

---

## 🎯 THE KEY METRIC: PROJECT PROGRESS %

### **Why This is THE Most Important Field:**

```
Agent Context Header:
┌─────────────────────────────────────────────┐
│  Project: LocalBrain                        │
│  Progress: 74% (14/19) ⭐ KEY INDICATOR     │
└─────────────────────────────────────────────┘

Why critical:
✅ Official completion metric
✅ Single source of truth
✅ Easy to understand (74% = almost 3/4 done)
✅ Shows impact (goes up when you complete tasks)
✅ Team-wide visibility (everyone sees same number)
✅ Progress tracking (74% → 79% = 5% gain!)

This ONE number tells you:
- How far we've come
- How much is left
- Your impact
- Team velocity
```

---

## 📋 PROTOCOL CONSOLIDATION

### **ALL Agent-Central Communications Follow This Pattern:**

**1. Agent Connects:**
```
Request: discover_environment
Response:
  ├─ agentContext (8 fields) ⭐
  ├─ proposals (job matches)
  └─ _header (formatted text)

Agent sees:
"You are Agent A (GLM-4.6)
 Role: UI Specialist
 Project: LocalBrain (74% complete)
 Your tasks: 2/3 done (67%)
 Recommended: T011 (95% match, $32 cost)"
```

**2. Agent Claims Task:**
```
Request: claim_task T011
Response:
  ├─ agentContext ⭐
  └─ success: true

Agent sees:
"Project: 74% (unchanged - task just claimed)
 Your tasks: Now 3 claimed
 T011 is yours!"
```

**3. Agent Updates Progress:**
```
Request: update_progress T011 50%
Response:
  ├─ agentContext ⭐
  └─ updated status

Agent sees:
"Project: Still 74% (task in progress)
 T011: 50% done
 Keep going!"
```

**4. Agent Completes:**
```
Request: complete_task T011
Response:
  ├─ agentContext ⭐
  │  └─ projectProgress: 79% (was 74%!) ⭐
  └─ success + verification

Agent sees:
"✅ VERIFIED!
 Project: 74% → 79% (+5% impact!)
 Your tasks: 3/3 done (100%)
 Unblocked: T014
 Great work!"
```

---

## 🎯 BENEFITS OF STANDARDIZATION

### **For Agents:**

```
EVERY response shows:
✅ Who you are (no confusion)
✅ Where you are (project context)
✅ What's the progress (74% - key metric!)
✅ Your personal status (3/3 done)
✅ Budget remaining (can you keep working?)
✅ System health (is everything OK?)

Result:
- Complete situational awareness
- No confusion
- Always oriented
- Know impact of actions
```

### **For System:**

```
EVERY response verified:
✅ Agent ID confirmed (correct agent)
✅ Project confirmed (correct context)
✅ Progress calculated (official metric)
✅ Budget checked (within limits)

Result:
- Consistency
- Verifiability
- Accountability
```

### **For You (Human):**

```
EVERY agent response shows:
✅ Official progress % (74%)
✅ Tasks done/total (14/19)
✅ Who did what
✅ Budget status

Result:
- Quick status check
- No ambiguity
- Clear accountability
- Easy to track
```

---

## 🚀 IMPLEMENTATION PRIORITY

### **Phase 1: Create AgentContextBuilder** (1 hour)

```typescript
// src/core/AgentContextBuilder.ts
- Implement buildContext()
- Implement formatHeader()
- Query all 8 required fields
- Test with real data
```

### **Phase 2: Integrate into All Tools** (2 hours)

```
Update 20 MCP tools:
├─ discover_environment ⭐
├─ claim_task ⭐
├─ update_progress ⭐
├─ complete_task ⭐
├─ get_dashboard
├─ ... all 20 tools

Each tool: Add agentContext to response
Time: 6 minutes per tool × 20 = 2 hours
```

### **Phase 3: Update CLI to Display Header** (1 hour)

```typescript
// packages/brain-cli/src/lib/mcp-client.ts

private displayAgentContext(context: AgentContext) {
  console.log(this.formatHeader(context));
  console.log('');
}

// Call after every MCP response
const response = await this.client.callTool(...);
if (response.agentContext) {
  this.displayAgentContext(response.agentContext);
}
```

---

## 📊 THE STANDARD (Summary)

### **EVERY Agent-Central Communication Includes:**

```
┌─────────────────────────────────────────────────────────────┐
│  🧠 CENTRAL INTELLIGENCE - Agent Context                    │
├─────────────────────────────────────────────────────────────┤
│  1. Agent ID: Who you are                                   │
│  2. Model: What model you're running                        │
│  3. Role: Your specialization                               │
│  4. Project: Where you are                                  │
│  5. Progress: XX% (Y/Z tasks) ⭐ KEY METRIC                 │
│  6. Your Tasks: Personal status                             │
│  7. Budget: Hours remaining                                 │
│  8. System: Health status                                   │
└─────────────────────────────────────────────────────────────┘

MANDATORY: All 8 fields, every response
FORMAT: Consistent JSON structure
DISPLAY: Formatted header + data
PURPOSE: Complete situational awareness
```

---

## 🎯 IMPLEMENTATION TIME

**Total: 4 hours**
- AgentContextBuilder: 1 hour
- Integrate into 20 tools: 2 hours
- Update CLI display: 1 hour

**Result**: Every agent always knows their complete context! ✅

**Should I implement AgentContextBuilder now?** 🚀
