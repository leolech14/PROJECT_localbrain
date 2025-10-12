# ⚡ KEEP-IN-TOUCH SYSTEM - Quick Start & Verification

**Purpose**: Bulletproof instructions to get the system running and verify it works
**Time**: 5 minutes to operational system

---

## 🔍 ULTRATHINK VERIFICATION

### System Architecture Review

```
┌─────────────────────────────────────────┐
│ CENTRAL COORDINATOR                     │
│ - Express server (port 3000)            │
│ - Reads CENTRAL_TASK_REGISTRY.md        │
│ - Assigns tasks to agents               │
│ - Issues kudos                          │
│ - Manages releases                      │
└────────────────┬────────────────────────┘
                 ↓ HTTP POST (JSON)
┌─────────────────────────────────────────┐
│ AUTONOMOUS AGENT                        │
│ - Checks in (GET task)                  │
│ - Claims task (START work)              │
│ - Updates progress (REPORT)             │
│ - Completes task (SUBMIT + wait kudos)  │
│ - Gets released (STOP)                  │
└─────────────────────────────────────────┘
```

### Critical Dependencies

**Central Coordinator needs**:
1. ✅ Express (HTTP server)
2. ✅ CORS (cross-origin requests)
3. ✅ Task parser (from agent-dispatch)
4. ✅ CENTRAL_TASK_REGISTRY.md (task database)

**Agent needs**:
1. ✅ node-fetch (HTTP client)
2. ✅ AgentClient class
3. ✅ Running coordinator (HTTP endpoint)

### Potential Failure Points

1. **Port 3000 in use** → Coordinator won't start
2. **Missing dependencies** → npm install required
3. **TypeScript not compiled** → npm run build required
4. **Wrong paths** → Coordinator can't find task-parser
5. **No tasks** → Agent gets released immediately

---

## 🚀 STEP-BY-STEP STARTUP

### Step 1: Install Dependencies (One-Time)

```bash
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK

# Install coordinator dependencies
cd central-coordinator
npm install
cd ..

# Install agent dependencies
cd agent-dispatch
npm install
cd ..
```

**Expected Result**: `node_modules/` folders created in both directories

### Step 2: Build TypeScript (One-Time or After Changes)

```bash
# Build coordinator
cd central-coordinator
npm run build
# Creates: dist/server.js

# Build agent system
cd ../agent-dispatch
npm run build
# Creates: dist/agent-client.js, dist/cli-autonomous.js

cd ..
```

**Expected Result**: `dist/` folders with compiled JavaScript

### Step 3: Verify Coordinator Can Start

```bash
# Start coordinator (will auto-install/build if needed)
./start-coordinator.sh
```

**Expected Output**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 CENTRAL COORDINATOR - Keep-In-Touch System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Server running on port 3000
📡 Endpoint: http://localhost:3000/coordinator
📊 Status: http://localhost:3000/status

Ready to manage agent lifecycles!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If it fails**:
- Check if port 3000 is in use: `lsof -ti :3000`
- Kill existing process: `kill $(lsof -ti :3000)`
- Try again

### Step 4: Test Coordinator Status

```bash
# In another terminal
curl http://localhost:3000/status | jq

# Or if jq not installed:
curl http://localhost:3000/status
```

**Expected Response**:
```json
{
  "timestamp": "2025-10-08T...",
  "agents": {},
  "system": {
    "totalTasks": 19,
    "completed": 3,
    "inProgress": 0,
    "available": 12,
    "blocked": 4
  }
}
```

**✅ If you see this, coordinator is working!**

### Step 5: Start Agent (Demo Mode)

```bash
cd agent-dispatch

# Start Agent C in demo mode (fast updates for testing)
AGENT_ID=C npm run autonomous:demo
```

**Expected Output (within 10 seconds)**:
```
============================================================
🤖 Agent C - BACKEND SERVICES SPECIALIST
============================================================

Starting autonomous lifecycle...
Connected to: http://localhost:3000/coordinator

------------------------------------------------------------
🔄 Cycle 1: Checking in with Central Coordinator...
------------------------------------------------------------

✅ TASK ASSIGNED

📋 T018 - RAG Index for Specifications
🎯 Priority: P1
⏱️  Estimated: 8 hours
🔗 Dependencies: None (ready to start)

📝 WHAT TO BUILD:
   RAG index for specifications...

✅ ACCEPTANCE CRITERIA:
   1. RAG index built from all specs
   2. Search API responding ≤10ms
   ...

📝 Claiming task...

✅ Task T018 is yours! Good luck Agent C!
📋 UPDATE with progress regularly, COMPLETE when done

💻 Working on task...
```

**✅ If you see this, agent is working autonomously!**

### Step 6: Watch Agent Progress

Agent will automatically:
- Report 25% progress after 3 seconds
- Report 50% progress after 6 seconds
- Report 75% progress after 9 seconds
- Complete after 12 seconds
- Receive kudos
- Check in for next task

**Watch for**:
```
📊 Great progress Agent C! 25% complete on T018.
💪 You're off to a great start!

📊 Great progress Agent C! 50% complete on T018.
💪 Nice momentum! Keep it up!

📦 Task complete! Reporting to coordinator...

🎉 KUDOS:
🎉 OUTSTANDING WORK Agent C! T018 completed right on time!
Your contribution moves the entire project forward. Excellent work!

📈 Impact: Moved project forward
⚡ Velocity: 105% of estimate

🔄 Cycle 2: Checking in with Central Coordinator...
```

**✅ If you see kudos, the complete system is working!**

---

## 📋 VERIFICATION CHECKLIST

Run through this checklist to confirm everything works:

### Pre-Flight Checks

- [ ] Node.js installed: `node --version` (should be v18+)
- [ ] npm installed: `npm --version`
- [ ] Port 3000 available: `lsof -ti :3000` (should be empty)

### Coordinator Checks

- [ ] Dependencies installed: `ls central-coordinator/node_modules` (should exist)
- [ ] Built successfully: `ls central-coordinator/dist/server.js` (should exist)
- [ ] Server starts: `./start-coordinator.sh` (no errors)
- [ ] Status endpoint works: `curl http://localhost:3000/status` (returns JSON)

### Agent Checks

- [ ] Dependencies installed: `ls agent-dispatch/node_modules/node-fetch` (should exist)
- [ ] Built successfully: `ls agent-dispatch/dist/agent-client.js` (should exist)
- [ ] Can start agent: `AGENT_ID=C npm run autonomous:demo` (no immediate crash)
- [ ] Agent connects: Watch for "Checking in with Central Coordinator..." message
- [ ] Agent gets task: Watch for "TASK ASSIGNED" message
- [ ] Agent claims task: Watch for "Task T018 is yours!" message
- [ ] Agent updates progress: Watch for "Great progress!" messages
- [ ] Agent completes: Watch for "🎉 KUDOS:" message
- [ ] Agent gets next or release: Watch for next cycle or "AGENT RELEASE"

### Full System Check

- [ ] Coordinator running in Terminal 1
- [ ] Agent running in Terminal 2
- [ ] Agent completing full lifecycle (CHECK-IN → CLAIM → UPDATE → COMPLETE → KUDOS)
- [ ] Status endpoint shows agent activity: `curl http://localhost:3000/status`

**✅ All checked? System is OPERATIONAL!**

---

## 🐛 TROUBLESHOOTING

### Problem: Port 3000 already in use

**Solution**:
```bash
# Find process using port 3000
lsof -ti :3000

# Kill it
kill $(lsof -ti :3000)

# Try again
./start-coordinator.sh
```

### Problem: "Cannot find module 'node-fetch'"

**Solution**:
```bash
cd agent-dispatch
npm install
npm run build
```

### Problem: "Cannot find module '../agent-dispatch/src/task-parser.js'"

**Solution**:
```bash
# Coordinator needs agent-dispatch to be built
cd agent-dispatch
npm run build
cd ../central-coordinator
npm run build
```

### Problem: Agent gets "Failed to connect to Central Coordinator"

**Solution**:
1. Verify coordinator is running: `curl http://localhost:3000/status`
2. Check coordinator logs in Terminal 1
3. Verify COORDINATOR_URL is correct (default: http://localhost:3000/coordinator)

### Problem: Agent immediately gets released (no tasks)

**Solution**:
This is actually CORRECT behavior if:
- All tasks for that agent are complete
- All available tasks are blocked by dependencies
- No tasks assigned to that agent

Check registry: `cat CENTRAL_TASK_REGISTRY.md | grep "Agent C"`

---

## ⚡ QUICK COMMANDS

### Start Everything
```bash
# Terminal 1: Coordinator
./start-coordinator.sh

# Terminal 2: Agent C (demo mode)
cd agent-dispatch && AGENT_ID=C npm run autonomous:demo

# Terminal 3: Agent A (demo mode)
cd agent-dispatch && AGENT_ID=A npm run autonomous:demo

# Terminal 4: Watch status
watch -n 2 'curl -s http://localhost:3000/status | jq'
```

### Stop Everything
```bash
# Stop agents: Ctrl+C in each terminal

# Stop coordinator: Ctrl+C in coordinator terminal

# Or kill all:
pkill -f "node dist/server.js"
pkill -f "node dist/cli-autonomous.js"
```

### Reset System
```bash
# Stop everything
pkill -f "node dist/"

# Clean build artifacts (optional)
rm -rf central-coordinator/dist agent-dispatch/dist

# Rebuild
cd central-coordinator && npm run build
cd ../agent-dispatch && npm run build

# Start fresh
./start-coordinator.sh
```

---

## 🎯 WHAT SUCCESS LOOKS LIKE

### Terminal 1 (Coordinator)
```
🧠 CENTRAL COORDINATOR - Keep-In-Touch System
✅ Server running on port 3000
Ready to manage agent lifecycles!

📨 Received: CHECK_IN from Agent C
✅ Assigning T018 to Agent C
✅ Agent C claimed T018
📊 Agent C: T018 at 25%
📊 Agent C: T018 at 50%
📊 Agent C: T018 at 75%
🎉 Agent C completed T018! Velocity: 105%
📨 Received: CHECK_IN from Agent C
✅ Assigning T020 to Agent C
```

### Terminal 2 (Agent C)
```
🤖 Agent C - BACKEND SERVICES SPECIALIST
Starting autonomous lifecycle...

🔄 Cycle 1: Checking in...
✅ TASK ASSIGNED: T018
📝 Claiming task...
✅ Task T018 is yours!
💻 Working on task...
📊 Great progress! 25% complete
📊 Great progress! 50% complete
📊 Great progress! 75% complete
📦 Task complete! Reporting...

🎉 KUDOS:
OUTSTANDING WORK Agent C! T018 completed right on time!

🔄 Cycle 2: Checking in...
✅ TASK ASSIGNED: T020
```

### Terminal 3 (Status Monitor)
```json
{
  "agents": {
    "C": {
      "status": "working",
      "currentTask": "T018",
      "tasksCompleted": 1,
      "lastCheckIn": "2025-10-08T...",
      "velocity": "115%"
    }
  },
  "system": {
    "totalTasks": 19,
    "completed": 4,
    "inProgress": 1,
    "available": 11
  }
}
```

---

## ✅ SYSTEM VERIFIED

If you see all of the above:
- ✅ Coordinator is managing agent lifecycles
- ✅ Agents are working autonomously
- ✅ Progress is being tracked
- ✅ Kudos are being issued
- ✅ Tasks are being completed
- ✅ System is fully operational

**🚀 The Keep-In-Touch system is WORKING!**

---

**Next**: See "HOW_TO_TELL_AGENTS.md" for instructions on onboarding each agent to the system.
