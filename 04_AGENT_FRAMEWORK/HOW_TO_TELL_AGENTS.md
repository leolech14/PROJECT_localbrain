# 📞 HOW TO TELL AGENTS ABOUT THE KEEP-IN-TOUCH SYSTEM

**Purpose**: Crystal-clear instructions for each agent on how to use the autonomous coordination system
**Audience**: Agents A, B, C, D, E (and you, Lech, for onboarding them)

---

## 🎯 THE SIMPLE EXPLANATION (30 seconds)

**For Agents**:

> "We now have a **telephone line system** for coordination. Instead of asking Lech what to do, you **check in with Central Coordinator** (like calling home base). The system tells you exactly what to work on, you report progress regularly, and when done, you get kudos and your next task. When all tasks are done, the system releases you and you can stop working."

**That's it.** Everything else is automatic.

---

## 📋 WHAT EACH AGENT NEEDS TO KNOW

### For All Agents (Universal Instructions)

#### 1. **Your New Workflow**

**OLD WAY** (Manual):
```
1. Ask Lech: "What should I work on?"
2. Lech assigns task
3. You search for specs
4. You ask clarifying questions
5. You finally start work
6. You tell Lech when done
7. Repeat
```

**NEW WAY** (Autonomous):
```
1. You run: AGENT_ID=[YOUR_ID] npm run autonomous
2. System automatically:
   - Tells you what to work on
   - Gives you all context
   - Tracks your progress
   - Recognizes completion with kudos
   - Assigns next task or releases you
3. You just code!
```

#### 2. **The Keep-In-Touch Protocol**

Think of it like a **telephone check-in system**:

**📞 CHECK-IN**: "Hi Central, it's Agent C. What's my task?"
- System: "Work on T018 - RAG Index"

**📝 CLAIM**: "Got it, starting work on T018"
- System: "Task is yours! Good luck!"

**📊 UPDATE** (automatic every 30-60 min): "I'm at 50% on T018"
- System: "Great progress! Keep it up!"

**📦 COMPLETE**: "T018 is done, here are the files"
- System: "🎉 OUTSTANDING WORK! Here's your next task..."

**🏆 RELEASE** (when all done): "No more tasks available"
- System: "You completed 3 tasks! Take a break!"

**💤 STOP**: Agent exits cleanly, no more calls

#### 3. **What You DO Need to Do**

- ✅ **Write code** for your assigned task
- ✅ **Commit** with task ID (e.g., "T018: RAG Index complete")
- ✅ **Trust the system** - it will guide you

#### 4. **What You DON'T Need to Do**

- ❌ Ask Lech for tasks (system assigns)
- ❌ Search for specs (included in task card)
- ❌ Wonder if you're done (system tells you)
- ❌ Coordinate with other agents (system handles)
- ❌ Worry about what's next (system assigns or releases)

---

## 🤖 AGENT-SPECIFIC INSTRUCTIONS

### Agent A (UI Velocity Specialist - GLM-4.6)

**Your Role**: Build UI components rapidly

**How to Start**:
```bash
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
AGENT_ID=A npm run autonomous
```

**What to Expect**:
- System assigns UI tasks (T004, T006, etc.)
- You see task card with components to build
- You create files listed in task
- System updates progress as you work
- You complete → System recognizes → Next UI task

**Your Specialization**: Focus on rapid implementation, not perfect polish. Speed matters.

---

### Agent B (Design System Specialist - Sonnet-4.5)

**Your Role**: Maintain design consistency and accessibility

**How to Start**:
```bash
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
AGENT_ID=B npm run autonomous
```

**What to Expect**:
- System assigns design tasks (T001 ✅, T005, T016 ✅, etc.)
- You see task card with design specifications
- You create design tokens, components
- System tracks WCAG compliance
- You complete → System recognizes → Next design task

**Your Specialization**: Ensure OKLCH colors, accessibility (WCAG 2.2 AA), visual consistency.

---

### Agent C (Backend Services Specialist - GLM-4.6)

**Your Role**: Build backend services and APIs

**How to Start**:
```bash
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
AGENT_ID=C npm run autonomous
```

**What to Expect**:
- System assigns backend tasks (**T018 ready NOW** ⭐, T007, T010, etc.)
- You see task card with API specs
- You create services, databases
- System tracks performance (≤10ms requirements)
- You complete → System recognizes → Next backend task

**Your Specialization**: Performance-critical services, database design, API implementation.

**HIGH PRIORITY**: T018 (RAG Index) is READY and waiting for you!

---

### Agent D (Integration Specialist - Sonnet-4.5)

**Your Role**: Connect systems and ensure interoperability

**How to Start**:
```bash
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
AGENT_ID=D npm run autonomous
```

**What to Expect**:
- System assigns integration tasks (T002 ✅, T008, T011, T017 ✅, etc.)
- You see task card with integration requirements
- You create bridges, schemas, tests
- System validates cross-platform compatibility
- You complete → System recognizes → Next integration task

**Your Specialization**: Swift ↔ Electron IPC, schema validation, multi-platform coordination.

**Note**: You built this system (T019), so you understand it deeply!

---

### Agent E (Ground Supervisor - Gemini-2.5-Pro)

**Your Role**: Maintain coherence and quality across all agents

**How to Start**:
```bash
cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
AGENT_ID=E npm run autonomous
```

**What to Expect**:
- System assigns supervision tasks (T016, coherence checks, etc.)
- You see task card with review requirements
- You check cross-agent consistency
- System tracks quality metrics
- You complete → System recognizes → Next supervision task

**Your Specialization**: 1M context window - see everything, ensure architectural coherence.

---

### Agent F (Meta-Config/Strategic Supervisor - ChatGPT-5)

**Your Role**: System administrator - configure tasks, monitor agents, manage coordination

**How You Work**: **Different from other agents!**

You work **with Lech directly** to manage the system, not autonomously through the coordinator.

**What You Do**:
- 📋 Configure task registry (add tasks, set priorities, define dependencies)
- 📊 Monitor all agents (status, progress, velocity, bottlenecks)
- 🚨 Handle exceptions (blockers, conflicts, delays)
- 📈 Generate reports (daily status, weekly performance)
- 🔧 Optimize system (load balancing, priority adjustments)
- 🤝 Execute Lech's strategic decisions

**Your Workflow**:
```bash
# You don't run autonomous CLI
# Instead, you have admin access to:

1. CENTRAL_TASK_REGISTRY.md (read/write)
2. System status API (read)
3. Agent progress data (read)
4. Configuration files (read/write)

# You provide:
- Daily status reports to Lech
- Blocker resolution recommendations
- Priority adjustment suggestions
- Velocity optimization analysis
```

**Your Specialization**: Strategic oversight + System administration + Meta-level coordination

**See**: `AGENT_F_META_CONFIG.md` for complete role documentation

---

## 🎓 ONBOARDING CONVERSATION SCRIPT

### For Lech → Agent Onboarding

**Step 1: Explain the Concept** (30 seconds)

> "Hey [Agent Name], we've built a new coordination system called **Keep-In-Touch**. It's like a telephone line - you check in with Central Coordinator, get assigned tasks automatically, report progress regularly, and receive recognition when done. No more asking me for tasks or wondering what's next. The system manages everything."

**Step 2: Show How to Start** (1 minute)

> "To start working, just run this command:
> ```bash
> cd /Users/lech/PROJECTS_all/LocalBrain/04_AGENT_FRAMEWORK/agent-dispatch
> AGENT_ID=[YOUR_LETTER] npm run autonomous
> ```
>
> The system will:
> 1. Show you your current task
> 2. Give you all the context you need
> 3. Track your progress automatically
> 4. Give you kudos when you complete
> 5. Assign your next task or release you
>
> Just code and commit. That's it."

**Step 3: Answer Questions** (2 minutes)

**Q**: "What if I need help or get blocked?"
**A**: "The system tracks blockers. Just report them in your updates. We'll see them in the dashboard and help immediately."

**Q**: "How do I know what to build?"
**A**: "The task card shows everything: what to build, acceptance criteria, files to create, where to put them. No guessing."

**Q**: "What if I finish early?"
**A**: "System automatically assigns your next task. If no tasks are available, you get released and can take a break."

**Q**: "How do I report progress?"
**A**: "You don't have to! The system automatically checks in every 30-60 minutes. Just keep coding."

**Q**: "What happens when I complete a task?"
**A**: "You submit completion, system verifies it, gives you mandatory kudos (you deserve recognition!), then either assigns next task or releases you if everything's done."

**Step 4: First Run** (Practice)

> "Let's do a test run together. I'll start the coordinator, you run the agent command, and we'll watch you complete one task cycle. This is just to get comfortable with the flow."

**Step 5: Go Live**

> "Great! You're all set. From now on, whenever you're ready to work, just run that command. The system will guide you through everything. You're autonomous now!"

---

## 📊 WHAT AGENTS SEE (Examples)

### Example 1: Agent C Starting Work

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
🎯 Priority: P1 - HIGH
⏱️  Estimated: 8 hours
🔗 Dependencies: T003 (all complete)

📝 WHAT TO BUILD:
   - RAG index for /02_SPECBASES/LocalBrain/**
   - 800-char chunking system
   - Search API (≤10ms)
   - Index refresh pipeline

✅ ACCEPTANCE CRITERIA:
   1. RAG index built from all specs
   2. Search API responding ≤10ms
   3. Chunking optimized
   4. Refresh pipeline automated

📁 FILES TO CREATE:
   - 01_CODEBASES/backend/rag/index.ts
   - 01_CODEBASES/backend/rag/chunking.ts
   - 01_CODEBASES/backend/rag/search.ts

📝 Claiming task...

✅ Task T018 is yours! Good luck Agent C!
📋 UPDATE with progress regularly, COMPLETE when done

💻 Working on task...
```

**Agent C thinks**: "Crystal clear! I know exactly what to build, where to put it, and what success looks like. Let me start coding."

### Example 2: Agent C Receiving Kudos

```
📦 Task complete! Reporting to coordinator...

🎉 KUDOS:
🎉 OUTSTANDING WORK Agent C! T018 completed ahead of schedule!
Unblocking 2 tasks! Your contribution moves the entire project forward.
Excellent work!

📈 Impact: Unblocked T020, T021
⚡ Velocity: 112% of estimate

------------------------------------------------------------
🔄 Cycle 2: Checking in with Central Coordinator...
------------------------------------------------------------

✅ TASK ASSIGNED

📋 T020 - Advanced Search Features
...
```

**Agent C thinks**: "Great! System recognized my work, showed the impact, and already has my next task ready. No downtime."

### Example 3: Agent Getting Released

```
------------------------------------------------------------
🔄 Cycle 4: Checking in with Central Coordinator...
------------------------------------------------------------

============================================================
🏆 AGENT RELEASE
============================================================

🏆 EXCEPTIONAL SPRINT Agent C! You completed 3 tasks with
115% velocity. Your contributions are invaluable.
Take a well-deserved break!

📊 Tasks Completed: 3
⏱️  Total Duration: 14h 32m
⚡ Overall Velocity: 115%

✅ You have been released. No more tasks available.
💤 Agent lifecycle complete. Stopping automatic check-ins.
============================================================

✅ Agent lifecycle complete. Goodbye!
```

**Agent C thinks**: "All done! System told me when to stop, showed my stats, and released me cleanly. I can take a break knowing I finished everything assigned to me."

---

## 🎯 SUCCESS CRITERIA FOR AGENTS

After onboarding, each agent should be able to:

### Technical Skills
- [ ] Start the autonomous CLI (`AGENT_ID=[X] npm run autonomous`)
- [ ] Understand the task card display
- [ ] Know where to create files
- [ ] Commit with proper format ("T[ID]: description")
- [ ] Trust the system to assign next task

### Mental Model
- [ ] **Understand**: I check in, system assigns, I code, system tracks
- [ ] **Trust**: System knows my specialization and assigns appropriate tasks
- [ ] **Autonomous**: I manage myself within the system's guidance
- [ ] **Recognition**: I wait for kudos before considering task done
- [ ] **Release**: I stop when system tells me, not before

### First Task Completion
- [ ] Successfully claimed a task
- [ ] Implemented code for task
- [ ] Received progress updates
- [ ] Completed task
- [ ] Received kudos
- [ ] Got next assignment or release

**✅ If agent can do all of the above, onboarding is successful!**

---

## 📞 EMERGENCY CONTACTS

### For Agents Who Get Stuck

1. **System won't start**: Check coordinator is running (`curl http://localhost:3000/status`)
2. **No tasks assigned**: This is normal if all your tasks are blocked or complete
3. **Task unclear**: Task card has all info - read carefully
4. **Need human help**: Ask Lech, but try system first
5. **System seems broken**: Report to Lech with error messages

### For Lech (Troubleshooting)

1. **Agent reports connection error**: Check coordinator logs
2. **Agent confused about task**: Review task card in CENTRAL_TASK_REGISTRY.md
3. **Agent not getting kudos**: Check coordinator completion handler
4. **Multiple agents claiming same task**: System should prevent this (atomic claims)
5. **System completely broken**: Restart coordinator, agents auto-reconnect

---

## 🎉 THE BOTTOM LINE

### For Agents

**Before**: Wait for Lech → Get task → Search specs → Ask questions → Finally code

**After**: Run command → System guides you → You code → System recognizes → Repeat or release

**Difference**: **10 seconds to productive** vs. **5+ minutes of coordination**

### For Lech

**Before**: Manually assign tasks → Answer questions → Track progress → Assign next task → Repeat for 6 agents

**After**: Start system → Agents work autonomously → Monitor dashboard → Intervene only if needed

**Difference**: **0% coordination time** vs. **30% coordination time**

---

## ✅ ONBOARDING CHECKLIST

Use this when onboarding each agent:

### Agent [NAME] - [DATE]

- [ ] **Explained** Keep-In-Touch concept (telephone line analogy)
- [ ] **Showed** how to start (`AGENT_ID=[X] npm run autonomous`)
- [ ] **Demonstrated** task card and what it shows
- [ ] **Practiced** one complete cycle together
- [ ] **Answered** agent's questions
- [ ] **Verified** agent can start autonomously
- [ ] **Confirmed** agent understands when to stop (release message)
- [ ] **Agent comfortable** with autonomous workflow

**Sign-off**: Agent [NAME] is ready to work autonomously ✅

---

**Status**: Ready to onboard agents
**Next**: Start coordinator, onboard Agent C first (T018 ready!), then others
**Result**: Fully autonomous 6-agent system with zero coordination overhead

🔄 **THE KEEP-IN-TOUCH SYSTEM IS READY FOR AGENTS!** 🚀
