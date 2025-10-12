# 📘 Agent Guide: Using the LocalBrain MCP Task Registry

**For**: All Agents (A, B, C, D, E, F)
**Date**: 2025-10-08
**Status**: ✅ MCP Server Operational

---

## 🎯 WHAT IS THIS?

The **LocalBrain MCP Task Registry** is your central coordination system. It:
- Tells you which tasks are ready to work on
- Prevents multiple agents from working on the same task
- Tracks your progress in real-time
- Verifies completion using git commits
- Automatically unblocks dependent tasks

**Think of it as**: Air traffic control for 6 agents working in parallel

---

## ✅ MCP SERVER STATUS

### Installation Complete
- ✅ **Claude Code CLI**: Installed via `claude mcp add`
- ✅ **Gemini CLI**: Installed via `gemini mcp add`
- ✅ **GitHub**: Published at https://github.com/leolech14/localbrain-task-registry
- ✅ **Local Build**: `/Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry/`

### Current Issue & Solution
**Problem**: Database is empty (no tasks loaded from CENTRAL_TASK_REGISTRY.md yet)

**Solution**: We need to populate the database with tasks from the registry. The MCP server has the infrastructure, but we need to add a setup script to import tasks from CENTRAL_TASK_REGISTRY.md.

**Temporary Workflow**: Until database is populated, refer to CENTRAL_TASK_REGISTRY.md directly for task status, but use the MCP architecture for the workflow.

---

## 🔧 HOW TO USE (When Database Is Populated)

### Step 1: Query Available Tasks
Ask Claude Code or Gemini:
```
"Use localbrain-task-registry to check what tasks are available for Agent [YOUR_AGENT_ID]"
```

Example for Agent A (UI Specialist):
```
"Use localbrain-task-registry to get available tasks for Agent A"
```

**You'll get**:
```json
{
  "agent": "A",
  "availableTasks": 3,
  "tasks": [
    {
      "id": "T004",
      "title": "Grid System Foundation (UI Shell)",
      "priority": "P1",
      "timeline": "Day 2 (6 hours)",
      "dependencies": []
    },
    {
      "id": "T005",
      "title": "Design Token Integration into Grid",
      "priority": "P1",
      "timeline": "Day 3 (4 hours)",
      "dependencies": ["T001", "T004"]
    }
  ]
}
```

### Step 2: Claim a Task
```
"Use localbrain-task-registry to claim task T004 for Agent A"
```

**What happens**:
- Task status: AVAILABLE → CLAIMED
- Locked to you (other agents can't claim it)
- SQLite transaction ensures atomicity

### Step 3: Update Progress During Work
```
"Use localbrain-task-registry to update progress on T004 to 50% with files GridSystem.tsx created"
```

**What happens**:
- Task status: CLAIMED → IN_PROGRESS
- Completion: 50%
- Files tracked: ["GridSystem.tsx"]
- Live visibility for all agents

### Step 4: Complete the Task
```
"Use localbrain-task-registry to complete task T004 with files GridSystem.tsx, GridSystem.test.tsx, GridSystem.stories.tsx and velocity 320%"
```

**What happens**:
- Git verification runs (checks commits + files)
- If ≥80% verified → COMPLETE
- Dependent tasks (T005) automatically unblocked
- Your velocity recorded

---

## 👥 AGENT SPECIALIZATIONS

### Agent A - UI Velocity Specialist (GLM-4.6, 200K)
**Query**: "Get available tasks for Agent A"
**Focus**: Frontend components, React/SwiftUI, rapid prototyping

### Agent B - Design System Specialist (Sonnet-4.5, 200K)
**Query**: "Get available tasks for Agent B"
**Focus**: OKLCH colors, accessibility, component library

### Agent C - Backend Services Specialist (GLM-4.6, 200K)
**Query**: "Get available tasks for Agent C"
**Focus**: API development, database, service architecture
**Current Available**: T018 (RAG Index for Specifications)

### Agent D - Integration Specialist (Sonnet-4.5, 200K)
**Query**: "Get available tasks for Agent D"
**Focus**: Swift ↔ Electron IPC, multi-platform coordination

### Agent E - Ground Supervisor (Gemini 2.5 Pro, 1M)
**Query**: "Get available tasks for Agent E"
**Focus**: Coherence, knowledge management, cross-agent coordination

### Agent F - Strategic Supervisor (ChatGPT-5)
**Role**: Cloud supervisor providing strategic guidance
**Not currently in CLI** - Will use zip iteration system

---

## 🚨 CURRENT WORKAROUND (Until Database Populated)

### Manual Task Checking
```bash
# Check which tasks are AVAILABLE
grep "Status.*AVAILABLE" /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/CENTRAL_TASK_REGISTRY.md

# Find your agent's tasks
grep -A 5 "Agent: A" CENTRAL_TASK_REGISTRY.md | grep "Status.*AVAILABLE"
```

### Current Available Tasks
**T018 - RAG Index for Specifications** (Agent C)
- Status: 🟢 AVAILABLE
- Priority: P1 - HIGH
- Timeline: Day 7 (8 hours)
- Dependencies: T003 ✅ (complete)

**T011 - Bulk Diff API Integration** (Agent D)
- Status: 🟡 CLAIMED
- Priority: P2
- Currently in progress

---

## 🔮 WHAT NEEDS TO HAPPEN NEXT

### Priority 1: Database Population Script
We need to create a script that:
1. Reads CENTRAL_TASK_REGISTRY.md
2. Parses all tasks (T001-T019+)
3. Inserts them into the SQLite database
4. Maintains sync with markdown file

**File to create**: `01_CODEBASES/mcp-servers/localbrain-task-registry/scripts/populate-from-registry.ts`

### Priority 2: Bi-Directional Sync
- Registry markdown ↔ SQLite database
- Updates in either direction propagate
- Pre-commit hook validates sync

### Priority 3: Test with Real Tasks
Once populated:
1. Agent C claims T018
2. Updates progress at 25%, 50%, 75%
3. Completes with git verification
4. Confirms dependent tasks auto-unblock

---

## 📋 MCP TOOLS AVAILABLE

### 1. `get_available_tasks`
**What it does**: Shows you tasks ready to work on
**When to use**: Start of each work session
**Input**: Your agent ID (A, B, C, D, E, or F)

### 2. `claim_task`
**What it does**: Locks a task to you
**When to use**: Before starting work on a task
**Input**: Task ID + your agent ID

### 3. `update_task_progress`
**What it does**: Reports progress during implementation
**When to use**: Every 25% completion milestone
**Input**: Task ID, completion %, files created, notes

### 4. `complete_task`
**What it does**: Marks task done + runs git verification
**When to use**: When all acceptance criteria met
**Input**: Task ID, files created, velocity %

---

## 🎯 WORKFLOW EXAMPLE

**Scenario**: Agent C working on T018 (RAG Index)

```
1. Agent C: "Use localbrain-task-registry to get available tasks for Agent C"
   → Response: "T018 is available"

2. Agent C: "Claim T018 for Agent C"
   → Response: "✅ T018 claimed, status: AVAILABLE → CLAIMED"

3. Agent C starts work, creates RAG index files...

4. Agent C: "Update progress on T018 to 25% with files RAGIndex.ts created"
   → Response: "✅ Progress updated, status: IN_PROGRESS, 25% complete"

5. Agent C continues work, adds chunking system...

6. Agent C: "Update progress on T018 to 50% with files RAGIndex.ts, ChunkingSystem.ts created"
   → Response: "✅ Progress updated, 50% complete"

7. Agent C completes work, commits to git...

8. Agent C: "Complete T018 with files RAGIndex.ts, ChunkingSystem.ts, SearchAPI.ts and velocity 180%"
   → Response: "✅ T018 complete! Git verification: 95% ✅
                Files tracked: 3/3
                Commits found: 2
                Dependent tasks unblocked: []"
```

---

## 🐛 TROUBLESHOOTING

### "Failed to connect" Error
**Cause**: Database might be empty or server not running
**Fix**:
```bash
cd /Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry
npm run build
claude mcp list  # Verify server starts
```

### "No available tasks" Response
**Cause**: Either database empty OR all tasks for your agent are complete/blocked
**Fix**: Check CENTRAL_TASK_REGISTRY.md manually:
```bash
grep -A 5 "Agent: [YOUR_AGENT]" CENTRAL_TASK_REGISTRY.md | grep "AVAILABLE"
```

### Database Empty
**Cause**: Population script not created yet
**Temporary Fix**: Use CENTRAL_TASK_REGISTRY.md directly
**Permanent Fix**: Create population script (Priority 1 above)

---

## 📝 FOR LECH: NEXT ACTIONS

### Immediate (Today)
1. **Create population script**: Parse CENTRAL_TASK_REGISTRY.md → SQLite
2. **Run population**: Import all T001-T019 tasks
3. **Test with Agent C**: Have Agent C claim T018 via MCP

### This Week
1. **Bi-directional sync**: Registry ↔ Database
2. **Pre-commit validation**: Ensure consistency
3. **Agent training**: Each agent tests claiming/completing

### This Sprint
1. **Velocity tracking**: Measure 6-agent coordination speed
2. **Git verification**: Validate accuracy of completion detection
3. **Auto-unblocking**: Verify dependent tasks activate correctly

---

## 🎉 WHAT'S REVOLUTIONARY

### Before MCP System
- ❌ Manual coordination (agents ask each other)
- ❌ Race conditions (multiple agents on same task)
- ❌ No progress visibility
- ❌ Manual dependency checking
- ❌ No completion proof

### After MCP System
- ✅ Automatic coordination (MCP tells you what to do)
- ✅ Atomic claiming (impossible to conflict)
- ✅ Real-time progress (see each other's work)
- ✅ Auto-unblocking (dependencies resolve automatically)
- ✅ Git verification (deterministic proof)

### Expected Impact
- **300%+ velocity** through hyper-specialization
- **Zero conflicts** through atomic operations
- **Complete transparency** through real-time tracking
- **Deterministic state** through git verification

---

## 📚 ADDITIONAL RESOURCES

### Documentation
- **Architecture**: `04_AGENT_FRAMEWORK/MCP_SYSTEM_ARCHITECTURE.md`
- **Deployment**: `05_EXECUTION_STATUS/T019_MCP_DEPLOYMENT_COMPLETE.md`
- **CLI Installation**: `05_EXECUTION_STATUS/MCP_CLI_INSTALLATION_COMPLETE.md`
- **Central Registry**: `04_AGENT_FRAMEWORK/CENTRAL_TASK_REGISTRY.md`

### Code
- **MCP Server**: `01_CODEBASES/mcp-servers/localbrain-task-registry/`
- **GitHub**: https://github.com/leolech14/localbrain-task-registry
- **Client Wrapper**: `04_AGENT_FRAMEWORK/mcp-integration/TaskRegistryClient.ts`

---

## 🚀 SUMMARY FOR AGENTS

**What you need to know**:
1. MCP server is built and operational ✅
2. Currently using CLI tools to access it
3. Database needs population (temporary workaround: use CENTRAL_TASK_REGISTRY.md)
4. Your workflow: Query → Claim → Update → Complete
5. System prevents conflicts and tracks everything

**What to do now**:
- Check if tasks are available for your agent ID
- Once database populated, start using MCP tools
- Report any issues to Agent D (integration specialist)

**Bottom line**: Revolutionary infrastructure is ready. Just needs database population to be fully operational.

---

**Built by**: Agent D (Sonnet-4.5) + Agent E (Gemini 2.5 Pro)
**Status**: Operational but needs database population
**Next Step**: Create `populate-from-registry.ts` script
