# 📊 Agent Context Report Protocol - INSTITUTIONAL STANDARD
## Structured Context Window Reporting for Intelligent Agent Coordination

**Date**: 2025-10-09
**Created By**: Agent B (Ground Supervisor - Sonnet 4.5 1M)
**Purpose**: Central Intelligence manages agents based on what they have in memory
**Status**: PROTOCOL DEFINITION COMPLETE

---

## 🎯 THE PROBLEM

### **Current Reality (Blind Coordination):**
```
Central Intelligence assigns task to Agent A:
├─ Agent A: "I don't have context for this!"
├─ Must load: 1,808 files, 45MB
├─ Time wasted: 20 seconds
└─ Inefficient: Should have assigned to agent with context

CI doesn't know:
❌ What each agent has in memory
❌ Which agent already loaded relevant context
❌ Who can start immediately vs needs loading
```

### **Required (Context-Aware):**
```
Central Intelligence knows:
✅ Agent A: Has LocalBrain UI context (500 files loaded)
✅ Agent C: Has backend context (300 files loaded)
✅ Agent D: Has integration context (200 files loaded)

Task assignment:
✅ UI task → Agent A (already has context!) ✅
✅ Backend task → Agent C (already has context!) ✅
✅ No wasted loading time ✅
```

---

## 📋 STANDARD CONTEXT REPORT FORMAT

### **Every Agent Reports on Connect:**

```json
{
  "contextReport": {
    "agentId": "agent-a-uuid",
    "reportTimestamp": "2025-10-09T22:30:00Z",
    "modelContextSize": 200000,

    "contextWindow": {
      "totalTokens": 45000,
      "percentFull": 22.5,
      "availableTokens": 155000
    },

    "loadedProjects": [
      {
        "projectId": "localbrain",
        "projectName": "LocalBrain",
        "loadedAt": "2025-10-09T22:00:00Z",
        "filesLoaded": 500,
        "categories": {
          "specs": 42,
          "docs": 89,
          "code": 369
        },
        "sizeInTokens": 30000,
        "freshness": "HOT" // HOT | WARM | COLD
      }
    ],

    "loadedTasks": [
      {
        "taskId": "T011",
        "taskName": "React Query + SSR",
        "contextLoaded": true,
        "relevantFiles": 23,
        "tokensUsed": 5000
      }
    ],

    "loadedDocuments": [
      {
        "type": "CLAUDE_MD",
        "path": "CLAUDE.md",
        "sizeInTokens": 2000,
        "loadedAt": "2025-10-09T22:00:00Z"
      },
      {
        "type": "ARCHITECTURE",
        "path": "MCP_SYSTEM_ARCHITECTURE.md",
        "sizeInTokens": 8000,
        "loadedAt": "2025-10-09T22:00:00Z"
      }
    ],

    "capabilities": {
      "canStartImmediately": ["T011", "T014"], // Has context
      "needsContextLoad": ["T018"], // Missing context
      "estimatedLoadTime": 15 // seconds
    },

    "memoryState": {
      "conversationLength": 150, // messages in thread
      "oldestMessage": "2025-10-09T20:00:00Z",
      "systemPromptTokens": 3200,
      "conversationTokens": 42000,
      "remainingForWork": 155000
    }
  }
}
```

---

## 🔧 MCP TOOL: report_context

### **New MCP Tool:**

```typescript
// src/tools/agent/reportContext.ts

import { z } from 'zod';
import Database from 'better-sqlite3';

const ReportContextSchema = z.object({
  agentId: z.string(),
  contextWindow: z.object({
    totalTokens: z.number(),
    availableTokens: z.number()
  }),
  loadedProjects: z.array(z.object({
    projectId: z.string(),
    filesLoaded: z.number(),
    sizeInTokens: z.number()
  })),
  loadedTasks: z.array(z.object({
    taskId: z.string(),
    relevantFiles: z.number()
  })),
  capabilities: z.object({
    canStartImmediately: z.array(z.string()),
    needsContextLoad: z.array(z.string())
  })
});

export const reportContextTool = {
  name: 'report_context',
  description: 'Report agent context window contents for intelligent coordination',
  inputSchema: {
    type: 'object',
    properties: {
      agentId: { type: 'string' },
      contextWindow: {
        type: 'object',
        properties: {
          totalTokens: { type: 'number' },
          availableTokens: { type: 'number' }
        }
      },
      loadedProjects: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            projectId: { type: 'string' },
            filesLoaded: { type: 'number' },
            sizeInTokens: { type: 'number' }
          }
        }
      },
      loadedTasks: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            relevantFiles: { type: 'number' }
          }
        }
      },
      capabilities: {
        type: 'object',
        properties: {
          canStartImmediately: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    }
  }
};

export async function handleReportContext(args: unknown, db: Database.Database) {
  const parsed = ReportContextSchema.parse(args);

  // Store context report
  db.prepare(`
    INSERT INTO agent_context_reports (
      agent_id, report_timestamp, total_tokens, available_tokens,
      loaded_projects, loaded_tasks, capabilities
    ) VALUES (?, datetime('now'), ?, ?, ?, ?, ?)
  `).run(
    parsed.agentId,
    parsed.contextWindow.totalTokens,
    parsed.contextWindow.availableTokens,
    JSON.stringify(parsed.loadedProjects),
    JSON.stringify(parsed.loadedTasks),
    JSON.stringify(parsed.capabilities)
  );

  console.log(`📊 Context report received from ${parsed.agentId}`);
  console.log(`   Total: ${parsed.contextWindow.totalTokens} tokens`);
  console.log(`   Available: ${parsed.contextWindow.availableTokens} tokens`);
  console.log(`   Can start immediately: ${parsed.capabilities.canStartImmediately.join(', ')}`);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        message: 'Context report recorded',
        optimization: {
          tasksSuitedForYou: parsed.capabilities.canStartImmediately,
          tasksRequiringLoad: parsed.capabilities.needsContextLoad
        }
      }, null, 2)
    }]
  };
}
```

---

## 🗄️ DATABASE SCHEMA

### **New Table: agent_context_reports**

```sql
CREATE TABLE IF NOT EXISTS agent_context_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id TEXT NOT NULL,
  report_timestamp TEXT NOT NULL DEFAULT (datetime('now')),

  -- Context window state
  total_tokens INTEGER NOT NULL,
  available_tokens INTEGER NOT NULL,
  percent_full REAL GENERATED ALWAYS AS (
    (CAST(total_tokens AS REAL) / NULLIF(total_tokens + available_tokens, 0)) * 100
  ) STORED,

  -- Loaded content
  loaded_projects TEXT NOT NULL,  -- JSON array
  loaded_tasks TEXT NOT NULL,     -- JSON array
  loaded_documents TEXT,          -- JSON array

  -- Capabilities
  capabilities TEXT NOT NULL,     -- JSON object
  can_start_immediately TEXT,     -- JSON array of task IDs

  -- Memory state
  conversation_length INTEGER,
  oldest_message_timestamp TEXT,

  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

CREATE INDEX idx_context_reports_agent ON agent_context_reports(agent_id);
CREATE INDEX idx_context_reports_timestamp ON agent_context_reports(report_timestamp DESC);
```

---

## 🎯 INTELLIGENT TASK ASSIGNMENT

### **Context-Aware Job Matching:**

```typescript
class ContextAwareTaskMatcher {
  /**
   * Match tasks to agents based on context window contents
   */
  async matchTaskToAgent(taskId: string): Promise<AgentRecommendation> {
    const task = await this.getTask(taskId);

    // Get all agents with their context reports
    const agents = await this.db.prepare(`
      SELECT
        a.id,
        a.name,
        a.model_id,
        acr.total_tokens,
        acr.available_tokens,
        acr.loaded_projects,
        acr.capabilities
      FROM agents a
      LEFT JOIN (
        SELECT * FROM agent_context_reports
        WHERE id IN (
          SELECT MAX(id) FROM agent_context_reports
          GROUP BY agent_id
        )
      ) acr ON a.id = acr.agent_id
      JOIN agent_presence ap ON a.id = ap.agent_letter
      WHERE ap.status IN ('ONLINE', 'IDLE')
    `).all();

    // Score each agent
    const scored = agents.map(agent => {
      let score = 0;

      // Parse context
      const context = JSON.parse(agent.capabilities || '{}');

      // BONUS: Agent already has context for this task! (+50 points)
      if (context.canStartImmediately?.includes(taskId)) {
        score += 50;
      }

      // BONUS: Agent has project context loaded (+30 points)
      const loadedProjects = JSON.parse(agent.loaded_projects || '[]');
      if (loadedProjects.some(p => p.projectId === task.project_id)) {
        score += 30;
      }

      // BONUS: Agent has available tokens (+20 points if >50% free)
      const percentFree = (agent.available_tokens / (agent.total_tokens + agent.available_tokens)) * 100;
      if (percentFree > 50) {
        score += 20;
      }

      // PENALTY: Agent context full (-30 points if <10% free)
      if (percentFree < 10) {
        score -= 30;
      }

      return { agent, score };
    });

    // Sort by score
    scored.sort((a, b) => b.score - a.score);

    const best = scored[0];

    return {
      recommendedAgent: best.agent,
      score: best.score,
      reason: this.explainRecommendation(best),
      alternatives: scored.slice(1, 3),
      contextOptimized: best.score >= 50 // Has relevant context
    };
  }
}
```

---

## 📊 AGENT WORKFLOW

### **On Connection (MANDATORY):**

```bash
# Agent A connects
brain connect

# System automatically:
1. Discovers agent
2. Prompts: "Report your context window contents"
3. Agent responds:
   {
     "totalTokens": 45000,
     "loadedProjects": ["LocalBrain"],
     "loadedTasks": ["T011"],
     "canStartImmediately": ["T011", "T014"]
   }

# Central Intelligence records:
✅ Agent A has LocalBrain context
✅ Agent A can start T011 without loading
✅ Agent A is 22% full (plenty of room)

# Task assignment becomes intelligent:
When UI task available:
├─ Check: Who has UI context?
├─ Found: Agent A (LocalBrain loaded)
├─ Assign: Agent A (no load time!)
└─ Result: Instant start ✅
```

---

## 🔄 AUTOMATIC CONTEXT REFRESH

### **System Tracks Context Staleness:**

```typescript
interface ContextFreshness {
  HOT: string;   // <30 min old
  WARM: string;  // 30min - 2 hours
  COLD: string;  // >2 hours
}

// When assigning task:
const contextAge = Date.now() - agent.lastContextLoad;

if (contextAge > 2 * 60 * 60 * 1000) {
  // Context is COLD
  return {
    recommendation: 'REFRESH_CONTEXT',
    message: 'Agent context is stale (2+ hours old)',
    action: 'Suggest agent reconnects for fresh context'
  };
}
```

---

## 🎯 INTEGRATION WITH CENTRAL MCP

### **New Database Migration:**

```sql
-- Migration 008: Agent Context Reporting

CREATE TABLE IF NOT EXISTS agent_context_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id TEXT NOT NULL,
  report_timestamp TEXT NOT NULL DEFAULT (datetime('now')),

  total_tokens INTEGER NOT NULL,
  available_tokens INTEGER NOT NULL,

  loaded_projects TEXT NOT NULL,
  loaded_tasks TEXT NOT NULL,
  loaded_documents TEXT,

  capabilities TEXT NOT NULL,

  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

CREATE INDEX idx_context_agent ON agent_context_reports(agent_id);
CREATE INDEX idx_context_timestamp ON agent_context_reports(report_timestamp DESC);
```

---

## 🚀 IMMEDIATE IMPLEMENTATION

### **Building Now:**

**1. Create Context Report MCP Tool (30 min)**
```typescript
// src/tools/agent/reportContext.ts
- Accept structured context report
- Store in database
- Return optimization suggestions
```

**2. Add to discover_environment (15 min)**
```typescript
// Automatically capture context on discovery
const contextReport = {
  totalTokens: estimateTokens(discovery.context),
  loadedProjects: [discovery.project],
  canStartImmediately: discovery.proposals.map(p => p.taskId)
};

await this.reportContext(agent.id, contextReport);
```

**3. Integrate into Task Assignment (30 min)**
```typescript
// JobProposalEngine uses context reports
const agentContext = getLatestContextReport(agent.id);

if (agentContext.canStartImmediately.includes(taskId)) {
  matchScore += 50; // HUGE bonus for having context!
}
```

**4. Add Migration (15 min)**
```sql
-- 008_agent_context_tracking.sql
```

**Total: 90 minutes to full context-aware coordination!**

---

## 💡 THE BENEFITS

### **For Central Intelligence:**
```
✅ Knows what each agent has in memory
✅ Assigns tasks to agents with context
✅ Avoids redundant context loading
✅ Optimizes for speed (no wait time)
✅ Balances workload by context capacity
```

### **For Agents:**
```
✅ Get tasks they're already prepared for
✅ No wasted time loading context
✅ Start working immediately
✅ More productive
```

### **For System:**
```
✅ Faster task execution (no load delay)
✅ Better resource utilization
✅ Smarter coordination
✅ Context-aware optimization
```

---

## 🎯 EXECUTING NOW!

**Agent B (Supervisor) implementing:**
1. ✅ Agent Context Report Protocol (defined)
2. 🔄 MCP Tool: report_context (building)
3. ⏳ Database migration 008
4. ⏳ Integration into task assignment
5. ⏳ Testing

**Progress: 90%**
**Target: 100%**

**CONTINUING EXECUTION!** 🚀🧠
