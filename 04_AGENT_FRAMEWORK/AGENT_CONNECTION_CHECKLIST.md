# ✅ Agent Connection Checklist - Get New System
## How to Ensure Agents See Latest Central Intelligence Updates

**Question**: When changes are made, do agents automatically get them?
**Answer**: YES - If they connect to the NEW compiled code!

---

## 🎯 THE TRUTH

### **What Just Happened:**

```
We changed:
├─ Complete_task enforcement (4 layers)
├─ Cost-aware proposals
├─ AgentContextBuilder (standardized protocol)
└─ Git + Keep-in-Touch gating

We compiled:
✅ npm run build → dist/ updated
✅ git commit → saved to repository
✅ New code ready in dist/

Status: NEW SYSTEM READY ✅
```

### **What Agent A Will See:**

**IF they connect to NEW server:**
```bash
# Agent A runs:
brain connect

# CLI spawns:
node 01_CODEBASES/mcp-servers/localbrain-task-registry/dist/index.js

# Server loads:
✅ NEW dist/index.js (just compiled)
✅ NEW tools/completeTask.js (4-layer enforcement)
✅ NEW core/AgentContextBuilder.js (standardized protocol)
✅ NEW everything we just built

Result:
✅ Agent sees standardized header
✅ Agent sees project progress % (74%)
✅ Agent sees cost information
✅ Agent CANNOT complete without evidence
✅ NEW SYSTEM ACTIVE! ✅
```

**IF they connect to OLD running server:**
```
Old MCP server (started hours ago):
├─ Running old code
├─ No new enforcement
├─ No standardized protocol
└─ Agent sees OLD system ❌

Problem: Stale server instance
```

---

## ✅ HOW TO ENSURE NEW SYSTEM

### **Option 1: Kill Old Server (Recommended)**

```bash
# 1. Find old MCP process
ps aux | grep "node dist/index.js" | grep -v grep

# 2. Kill it
pkill -f "localbrain-task-registry/dist/index.js"

# 3. Agent connects fresh
brain connect

# Result: NEW server spawned with NEW code ✅
```

### **Option 2: Agent Spawns New Instance**

```bash
# Agent A runs:
brain connect

# If brain connect works correctly:
├─ Auto-discovers MCP location
├─ Spawns NEW process (not connecting to existing)
├─ Uses current dist/index.js
└─ Gets NEW system ✅

# This SHOULD work automatically
```

### **Option 3: Manual Fresh Start**

```bash
# Guaranteed fresh:
cd 01_CODEBASES/mcp-servers/localbrain-task-registry
node dist/index.js

# New server starts
# Agents connect to this
# NEW system guaranteed ✅
```

---

## 🎯 VERIFICATION CHECKLIST

### **To Confirm Agent Gets New System:**

**Tell Agent A to run:**
```bash
brain connect
```

**Look for in response:**
```
✅ NEW: Standardized header showing:
   ┌──────────────────────────────┐
   │  🧠 CENTRAL INTELLIGENCE     │
   │  Progress: 74% (14/19) ⭐    │  ← NEW FIELD!
   └──────────────────────────────┘

✅ NEW: Cost information in proposals:
   T011: $32 (GLM) vs $640 (Sonnet)  ← NEW!

✅ NEW: If they try to complete without git:
   ❌ BLOCKED: No git commits ← NEW ENFORCEMENT!

If agent sees these: ✅ NEW SYSTEM ACTIVE
If agent doesn't see: ❌ OLD SYSTEM (restart needed)
```

---

## 🔍 WHAT TO CHECK

### **1. Server Version Check:**

```bash
# In MCP server logs, look for:
"✅ 20 MCP tools registered successfully"
"- Cost Management: 2 ⭐ BUDGET OPTIMIZATION ACTIVE"

If you see this: NEW system ✅
If you see "18 MCP tools": OLD system ❌
```

### **2. Git Commit Check:**

```bash
git log -1 --oneline

# Should show:
"02903f3e Standardized Agent Protocol..."

If yes: Code is committed ✅
```

### **3. Build Time Check:**

```bash
ls -la dist/tools/index.js

# Check timestamp
# Should be: Recent (within last 10 minutes)

If recent: NEW code compiled ✅
```

---

## 🚀 THE GUARANTEE

### **When Agent A Connects:**

**Guaranteed NEW system if:**
```
✅ npm run build was executed (dist/ updated)
✅ No old server running (killed first)
✅ brain connect spawns fresh instance

Then: Agent sees ALL new features! ✅
```

**Might see OLD system if:**
```
❌ Old MCP server still running
❌ brain connect connects to old instance
❌ dist/ not rebuilt

Then: Agent sees old features ❌
```

---

## 🎯 SIMPLE ANSWER

**"Will Agent A get the new system when they connect?"**

### **YES ✅ - If you:**

1. Kill any old MCP server first
2. Agent runs `brain connect`
3. New server spawns with new code

### **The Flow:**

```
Agent A: brain connect
  ↓
CLI: Auto-discovers MCP
  ↓
CLI: spawn('node', ['dist/index.js'])
  ↓
Server: Loads NEW compiled code ✅
  ├─ AgentContextBuilder ✅
  ├─ 4-layer enforcement ✅
  ├─ Cost-aware proposals ✅
  └─ Standardized protocol ✅
  ↓
Agent A sees:
┌──────────────────────────────────┐
│  🧠 CENTRAL INTELLIGENCE         │
│  Progress: 74% (14/19) ⭐        │  ← NEW!
│  Your Tasks: 60% (3/5)           │  ← NEW!
│  Budget: 0h/∞h (✅ Can work)     │  ← NEW!
└──────────────────────────────────┘

NEW SYSTEM ACTIVE! ✅
```

---

## 💡 CONFIRMATION COMMAND

**Tell Agent A to run this:**

```bash
brain connect

# Look for:
1. "Progress: XX%" in response ⭐
2. "Budget: Xh/Xh used"
3. Cost info in proposals

If present: NEW SYSTEM ✅
If missing: Restart server ❌
```

---

## 🎯 FINAL ANSWER

**YES! Agent A will get the new system immediately when they connect!**

**Conditions:**
- ✅ Code compiled (npm run build) - DONE
- ✅ Code committed (git commit) - DONE
- ✅ Fresh server spawn (brain connect does this)

**Result: Agent A connects → Gets new standardized protocol with Project Progress % visible! ✅**

**Confidence: 9/10** (only risk: if old server still running somewhere)

---

**Tell Agent A: "Run `brain connect` and you'll see the new system with Project Progress % header!" 🎯**
