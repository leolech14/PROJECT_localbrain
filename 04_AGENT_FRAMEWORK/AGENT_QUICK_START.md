# 🚀 AGENT QUICK START - Get Working in 30 Seconds

**For**: All Agents (A, B, C, D, E, F)
**Time**: 30 seconds to first task
**Result**: Immediate clarity on what to build

---

## ⚡ 3-STEP SETUP (30 Seconds)

### Step 1: Install Auto-Dispatch (One-Time, 10 seconds)
```bash
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
npm install
npm run build
```

### Step 2: Set Your Agent ID (5 seconds)
```bash
export AGENT_ID=C  # Change to your agent: A, B, C, D, E, or F
```

### Step 3: See Your Task (5 seconds)
```bash
node dist/cli.js
```

**DONE! You now see exactly what to build.** ✅

---

## 🎯 WHAT YOU'LL SEE

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 AGENT C - BACKEND SERVICES SPECIALIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR CURRENT TASK:
📋 T018 - RAG Index for Specifications
⏱️  Day 7 (8 hours)
🎯 P1-HIGH Priority
✅ Dependencies: T003 (all complete)

WHAT YOU'RE BUILDING:
  - RAG index for /02_SPECBASES/LocalBrain/**
  - 800-char chunking system
  - Search API (≤10ms)
  - Index refresh pipeline

FILES TO CREATE:
  1. src/services/RAGIndex.ts
  2. src/services/ChunkingSystem.ts
  3. src/api/SearchAPI.ts
  4. src/services/RefreshPipeline.ts

ACCEPTANCE CRITERIA:
  [ ] RAG index built from all specs
  [ ] Search API responding ≤10ms
  [ ] Chunking optimized
  [ ] Refresh pipeline automated

LOCATION:
  01_CODEBASES/backend/rag/

⚡ READY TO START!

When complete, commit with: "T018: [description]"
System will auto-detect completion.
```

---

## 💻 INTEGRATION OPTIONS

### Option 1: Command Alias (Recommended)
Add to your `~/.zshrc` or `~/.bashrc`:
```bash
# Agent Auto-Dispatch
export AGENT_ID=C  # Set your agent ID
alias task='cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch && node dist/cli.js'
alias tasks='cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch && node dist/cli.js --list'
```

Then reload: `source ~/.zshrc`

**Usage**:
```bash
task     # See your current task
tasks    # See all your tasks
```

### Option 2: Claude Code CLI Startup Hook
Create `~/.claude/startup.sh`:
```bash
#!/bin/bash
# Auto-show task when Claude Code starts
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
node dist/cli.js $AGENT_ID
```

Make executable:
```bash
chmod +x ~/.claude/startup.sh
```

Add to Claude config to run on startup.

### Option 3: Gemini CLI Integration
Add to Gemini profile/config:
```bash
# In your Gemini startup script
export AGENT_ID=E  # Gemini = Agent E
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
node dist/cli.js
```

---

## 🔄 WORKFLOW (After Setup)

### 1. Check Your Task
```bash
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
node dist/cli.js
```

### 2. Start Working
- Read the task description
- Create the files listed
- Implement according to acceptance criteria
- Test your implementation

### 3. Commit When Done
```bash
git add -A
git commit -m "T018: RAG Index for specifications with 800-char chunking

- Implemented ChromaDB vector store
- Created smart chunking system (800 char max)
- Built search API (<10ms response time)
- Added file watcher for auto-refresh
- Tests passing with 95% coverage

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 4. System Auto-Detects Completion
The auto-dispatch system monitors git commits and:
- ✅ Detects task completion (sees "T018" in commit message)
- ✅ Updates CENTRAL_TASK_REGISTRY.md (marks COMPLETE)
- ✅ Unblocks dependent tasks automatically
- ✅ Assigns you next task

### 5. Get Next Task
```bash
node dist/cli.js
```

**Repeat!** 🔄

---

## 🎯 AGENT-SPECIFIC SETUP

### Agent A - UI Velocity Specialist (GLM-4.6)
```bash
export AGENT_ID=A
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
node dist/cli.js
```

**Your Tasks**: Frontend components, React/SwiftUI, UI implementation

### Agent B - Design System Specialist (Sonnet-4.5)
```bash
export AGENT_ID=B
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
node dist/cli.js
```

**Your Tasks**: OKLCH colors, accessibility, design tokens, component library

### Agent C - Backend Services Specialist (GLM-4.6)
```bash
export AGENT_ID=C
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
node dist/cli.js
```

**Your Tasks**: API development, database design, backend services
**CURRENT TASK**: T018 - RAG Index for Specifications ✅

### Agent D - Integration Specialist (Sonnet-4.5)
```bash
export AGENT_ID=D
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
node dist/cli.js
```

**Your Tasks**: Swift ↔ Electron IPC bridge, multi-platform coordination

### Agent E - Ground Supervisor (Gemini 2.5 Pro)
```bash
export AGENT_ID=E
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
node dist/cli.js
```

**Your Tasks**: Coherence checking, knowledge management, cross-agent coordination

### Agent F - Strategic Supervisor (ChatGPT-5)
```bash
export AGENT_ID=F
# Not currently in CLI - uses zip iteration system
```

**Your Role**: Strategic guidance, instruction-set generation, validation

---

## 🛠️ ADVANCED USAGE

### See All Your Tasks (with status)
```bash
node dist/cli.js --list
```

**Output**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 AGENT C - BACKEND SERVICES SPECIALIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR TASKS (5 total):

✅ AVAILABLE (1):
  T018: RAG Index for Specifications (P1)

🔄 IN PROGRESS (0):

🟡 CLAIMED (0):

🔒 BLOCKED (2):
  T020: Advanced Search Features (waiting on: T018)
  T021: Multi-language Support (waiting on: T018)
```

### Check Task From Any Directory
```bash
# Create an alias
alias mytask='cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch && node dist/cli.js'

# Use anywhere
mytask
```

### Programmatic Integration (for other tools)
```typescript
import { getNextTask } from './dispatcher.js';

const task = getNextTask('C');
if (task) {
  console.log(`Work on: ${task.id} - ${task.title}`);
}
```

---

## 🐛 TROUBLESHOOTING

### "Cannot find module" error
```bash
# Rebuild the system
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
npm install
npm run build
```

### "AGENT_ID not set" error
```bash
# Set your agent ID
export AGENT_ID=C  # Or A, B, D, E, F
```

### "No tasks available" message
**Possible reasons**:
1. All your tasks are complete ✅ (Great job!)
2. Your tasks are IN_PROGRESS (Keep working!)
3. Your tasks are BLOCKED (Check dependencies)

**Check manually**:
```bash
node dist/cli.js --list  # See all your tasks
```

### Path issues
```bash
# Make sure you're in the right directory
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch

# Verify files exist
ls -la dist/cli.js
```

---

## 📊 COMPARISON: Before vs After

### ❌ BEFORE (Complex MCP System)
```bash
# 1. Start MCP server
cd 01_CODEBASES/mcp-servers/localbrain-task-registry
npm run build
node dist/index.js

# 2. Open another terminal
# 3. Use MCP client
# 4. Query available tasks
# 5. Choose a task from list
# 6. Claim the task
# 7. Find specifications manually
# 8. Start working

Time: 5+ minutes, multiple terminals, confusion
```

### ✅ AFTER (Auto-Dispatch System)
```bash
export AGENT_ID=C
node dist/cli.js

Time: 10 seconds, one command, crystal clear
```

---

## 🎉 SUCCESS CHECKLIST

After setup, you should be able to:
- [ ] Run `node dist/cli.js` and see your task
- [ ] See task description and acceptance criteria
- [ ] See files you need to create
- [ ] Know exactly where to put code
- [ ] Start working immediately

If all checked ✅ → **You're ready to work!**

---

## 📞 GETTING HELP

### Check the docs
- **Architecture**: `REVOLUTIONARY_SIMPLE_ARCHITECTURE.md`
- **Task Registry**: `CENTRAL_TASK_REGISTRY.md`
- **This Guide**: `AGENT_QUICK_START.md`

### Common Questions

**Q: Can I work on multiple tasks?**
A: System shows you ONE highest-priority task. Focus on that.

**Q: How do I see other tasks?**
A: Use `--list` flag: `node dist/cli.js --list`

**Q: What if I finish my task?**
A: Commit with task ID in message. System auto-assigns next task.

**Q: How do I know task is complete?**
A: Check all acceptance criteria. Commit. System verifies via git.

**Q: Can I skip a task?**
A: The system assigns highest priority. If truly blocked, talk to Lech.

---

## 🚀 READY TO START!

**Your 30-second checklist**:
1. ✅ Install: `cd agent-dispatch && npm install && npm run build`
2. ✅ Set ID: `export AGENT_ID=C`
3. ✅ See task: `node dist/cli.js`
4. ✅ Start working!

**That's it. No complexity. No confusion. Just work.** 🎯

---

**Built with revolutionary simplicity by Agent D (Sonnet-4.5)**
**Philosophy**: The best system is the one you don't think about
**Result**: 10-second path to productivity
