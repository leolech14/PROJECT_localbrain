# 🎯 LocalBrain Quick Reference Matrix

**Purpose**: One-page visual reference for the entire system
**Usage**: Print this, pin it, refer to it constantly

---

## 📊 THE COMPLETE MATRIX

### Agent → Task → Codebase Mapping

| Agent | Specialization | Model | Tasks | Codebases | Current Work |
|-------|---------------|-------|-------|-----------|--------------|
| **A** | UI Velocity | GLM-4.6 | T004, T006, T012, T014, T015 | CB-01, CB-02 | ⏸️ Idle (4 ready) |
| **B** | Design System | Sonnet-4.5 | T001✅, T005, T016✅ | CB-04 | ⏸️ Idle (1 ready) |
| **C** | Backend Services | GLM-4.6 | T007, T009, T018, T020, T021 | CB-03, CB-05 | ⏸️ Idle (1 ready) |
| **D** | Integration | Sonnet-4.5 | T002✅, T008, T011, T013, T017✅, T019✅ | CB-01, CB-05 | ⏸️ Idle (3 ready) |
| **E** | Ground Supervisor | Gemini-2.5-Pro | T016✅, Reviews | All | 🏁 Released |
| **F** | Meta-Config | ChatGPT-5 | Config, Monitor | SI-03, SI-04 | 📋 Managing |

---

## 🗺️ Codebase Ownership Matrix

| Codebase | Path | Primary Agent | Supporting Agents | Status | LOC |
|----------|------|---------------|-------------------|--------|-----|
| **CB-01** | Swift App | A, D | B, E | 🔄 In Progress | ~15,000 |
| **CB-02** | Electron Prototype | A | B | ✅ Operational | ~8,000 |
| **CB-03** | Widget System | C | D | 📋 Designed | ~5,000 |
| **CB-04** | Design System | B | A | 🔄 In Progress | ~3,000 |
| **CB-05** | MCP Registry | D, E | All | ✅ Complete | ~8,150 |

---

## 📋 Task Status at a Glance

### ✅ Complete (3 tasks)
- T001: OKLCH Token System (Agent B)
- T002: IPC Message Schema (Agent D)
- T016: Coherence Review (Agent E)
- T017: Schema Validation Tests (Agent D)
- T019: MCP Task Registry (Agent D, E) - 3 phases!

### 🟢 Available (9 tasks - Ready to Start!)
- **T004**: Module Container (Agent A) - 6h
- **T005**: Color Utility System (Agent B) - 3h
- **T006**: Dashboard Header (Agent A) - 4h
- **T008**: Swift WebKit Bridge (Agent D) - 6h
- **T011**: Agent Handoff Protocol (Agent D) - 3h
- **T012**: Context Panel UI (Agent A) - 4h
- **T013**: TypeScript IPC Client (Agent D) - 4h
- **T018**: RAG Index for Specs (Agent C) - 8h ⭐ **HIGH PRIORITY**

### 🚫 Blocked (4 tasks - Waiting on Dependencies)
- T007: Context Store → needs T009
- T009: Local Storage → needs T010 ✅ (should unblock!)
- T014: Module Navigation → needs T004
- T015: SwiftUI Animation → needs T004

---

## 🎯 Priority Heat Map

```
P0 (CRITICAL - Foundation)
├── T001 ✅ OKLCH Token System
├── T002 ✅ IPC Message Schema
└── T019 ✅ MCP Task Registry

P1 (HIGH - Core Functionality)
├── T004 🟢 Module Container (6h)
├── T005 🟢 Color Utilities (3h)
├── T006 🟢 Dashboard Header (4h)
├── T008 🟢 Swift WebKit Bridge (6h)
├── T011 🟢 Agent Handoff Protocol (3h)
├── T012 🟢 Context Panel UI (4h)
├── T013 🟢 TypeScript IPC Client (4h)
└── T018 🟢 RAG Index ⭐ (8h)

P2 (MEDIUM - Important Features)
├── T007 🚫 Context Store (blocked)
├── T009 🚫 Local Storage (should be unblocked!)
└── T014 🚫 Module Navigation (blocked)

P3 (LOW - Enhancements)
└── T015 🚫 SwiftUI Animation (blocked)
```

---

## ⚡ Parallel Execution Plan

### Optimal Day 1 (All agents working simultaneously)

```
┌─────────────────────────────────────────────────────────┐
│ MORNING (0-4 hours)                                      │
├─────────────────────────────────────────────────────────┤
│ Agent A: T004 Module Container (0-6h)                   │
│ Agent B: T005 Color Utilities (0-3h) → review          │
│ Agent C: T018 RAG Index ⭐ (0-8h)                       │
│ Agent D: T008 Swift WebKit Bridge (0-6h)               │
│ Agent E: Monitor all agents                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ AFTERNOON (4-8 hours)                                    │
├─────────────────────────────────────────────────────────┤
│ Agent A: Finish T004 (4-6h) → Start T006 (6-10h)       │
│ Agent B: Review Agent A work (3-4h) → Idle             │
│ Agent C: Finish T018 (4-8h) ✅                          │
│ Agent D: Finish T008 (4-6h) → Start T013 (6-10h)       │
│ Agent E: Coherence checks                               │
└─────────────────────────────────────────────────────────┘

END OF DAY:
✅ Completed: T004, T005, T008, T018 (4 major tasks)
🔄 In Progress: T006, T013
📈 Velocity: 4x improvement vs sequential
```

---

## 🔗 Dependency Chains

### Chain 1: Backend Foundation
```
T019 ✅ → T010 ✅ → T009 (unblock!) → T007 → Advanced features
```

### Chain 2: UI Foundation
```
T001 ✅ → T004 (start!) → T014 → T015
      ↓
    T005, T006, T012 (parallel)
```

### Chain 3: Integration
```
T002 ✅ → T008, T013 (parallel) → T011
```

### Chain 4: Knowledge/RAG
```
T003 → T018 ⭐ (start!) → T020, T021
```

---

## 📞 Quick Commands

### For Lech (Monitoring)
```bash
# Morning standup (10 seconds)
"Show me the agent dashboard"

# Check specific agent (5 seconds)
"What is Agent C working on?"

# Identify problems (5 seconds)
"Are any agents blocked?"

# Review progress (5 seconds)
"Show me recent completions"
```

### For Agents (Working)
```bash
# Start autonomous work
cd agent-dispatch
AGENT_ID=C npm run autonomous

# System shows current task automatically
# Just code and commit!
```

### For Agent F (Configuration)
```bash
# Update task priority
# Edit CENTRAL_TASK_REGISTRY.md
# Change "Priority: P2" → "Priority: P1"

# Monitor system health
curl http://localhost:3000/status | jq

# Generate daily report
# Use dashboard data + velocity analysis
```

---

## 🎨 Agent Color Coding (For Visual Recognition)

```
🔵 Agent A - UI Velocity (GLM-4.6)
🟣 Agent B - Design System (Sonnet-4.5)
🟢 Agent C - Backend Services (GLM-4.6)
🟡 Agent D - Integration (Sonnet-4.5)
🔴 Agent E - Ground Supervisor (Gemini-2.5-Pro)
⚪ Agent F - Meta-Config (ChatGPT-5)
```

**Usage**: When viewing dashboard, instantly recognize agent by color!

---

## 🚨 Critical Alerts

### Immediate Action Needed
1. **T009 should unblock** → T010 is complete ✅
   - Action: Verify dependency resolution
   - Agent: C (Backend)

2. **T018 is HIGH PRIORITY** → Start immediately
   - Action: Assign to Agent C
   - Impact: Unblocks RAG features

### Monitoring Priorities
- Watch Agent C velocity on T018 (8-hour task)
- Ensure T004 completes (unblocks T014, T015)
- Track parallel work on Day 1

---

## 📊 System Health Metrics

### Current Status (Live)
- **Tasks Total**: 19
- **Completed**: 5 (26%)
- **Available**: 9 (47%)
- **Blocked**: 4 (21%)
- **In Progress**: 0 (0%) ← **Agents ready to work!**

### Velocity Targets
- **Target**: 4 tasks/week (all agents working)
- **Current**: TBD (agents starting work)
- **Predicted**: 6-8 tasks/week (with parallelization)

### Bottleneck Analysis
- **Current bottleneck**: T009 → T007 chain
- **Solution**: Unblock T009 (T010 complete!)
- **Impact**: Opens entire backend path

---

## 🎯 Today's Focus (Recommended)

### Top Priority (Start These NOW)
1. **T018** (Agent C) - RAG Index ⭐
   - Why: HIGH PRIORITY, enables search features
   - Duration: 8 hours
   - Blockers: None

2. **T004** (Agent A) - Module Container
   - Why: Unblocks T014, T015
   - Duration: 6 hours
   - Blockers: None

3. **T008** (Agent D) - Swift WebKit Bridge
   - Why: Core integration layer
   - Duration: 6 hours
   - Blockers: None

### Secondary Priority
4. **T005** (Agent B) - Color Utilities (3h)
5. **T013** (Agent D) - TypeScript IPC Client (4h)

**Result**: 5 tasks in progress, massive parallel work!

---

## ✅ Quick Decision Matrix

### Should I Start This Task?

**Check 1**: Is task status 🟢 AVAILABLE?
- ✅ Yes → Continue
- ❌ No → Stop (blocked or in progress)

**Check 2**: Am I the assigned agent?
- ✅ Yes → Continue
- ❌ No → Check with Agent F

**Check 3**: Do I have capacity?
- ✅ Yes → Start work!
- ❌ No → Finish current task first

**Check 4**: Is it high priority?
- ✅ P1 → Start immediately
- 🟡 P2 → After P1 tasks
- 🔵 P3 → Last priority

---

## 🔮 Next 7 Days Forecast

### Week 1 Plan
```
Day 1-2: T004, T005, T008, T018 (Foundation tasks)
Day 3-4: T006, T011, T013 (Integration tasks)
Day 5:   T009 (unblocked), T012 (UI task)
Day 6-7: T007 (unblocked), Reviews

Result: 9 tasks complete (47% → 74% project completion)
```

### Success Criteria
- ✅ T018 complete (RAG foundation)
- ✅ T004 complete (UI foundation)
- ✅ All P1 tasks started
- ✅ Zero idle agents
- ✅ 4x velocity vs sequential

---

**Last Updated**: Real-time (via visual monitoring system)
**Maintained By**: Agent F (Meta-Config) + MCP Dashboard
**Usage**: Pin this, refer constantly, update as tasks complete

🎯 **ONE-PAGE SYSTEM MASTERY ACHIEVED!** 📊
