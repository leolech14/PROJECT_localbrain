# ⚠️ MANDATORY AGENT PROTOCOL
## You CANNOT Complete Tasks Without Following This

**Enforcement**: AUTOMATIC via MCP
**Bypass**: IMPOSSIBLE
**Violation**: BLOCKED by system

---

## 🚨 THE RULE - NO EXCEPTIONS

### **To Complete ANY Task, You MUST:**

```
1. ✅ Write actual code/files
2. ✅ git add .
3. ✅ git commit -m "T0XX: Description"
4. ✅ brain checkin "Task ready for completion"
5. ✅ brain task complete T0XX
6. ✅ Wait for "✅ VERIFIED by Git"

If you skip ANY step, MCP will BLOCK you.
```

---

## ❌ WHAT WILL GET YOU BLOCKED

### **Scenario 1: No Git Commits**
```
You: "brain task complete T011"

System checks git:
├─ Git score: 0% (no commits found)
├─ Minimum required: 30%
└─ RESULT: ❌ BLOCKED

Message:
"❌ BLOCKED: No git commits found for T011
 Action: Commit your changes first:
   1. git add .
   2. git commit -m 'T011: Your work'
   3. Try again"

You CANNOT complete until you commit! ⚠️
```

### **Scenario 2: No Keep-in-Touch Permission**
```
You: "brain task complete T011"

System checks Keep-in-Touch:
├─ Last check-in: 2 hours ago
├─ Max gap: 30 minutes
└─ RESULT: ❌ BLOCKED

Message:
"❌ BLOCKED: Missed check-in
 Action: Check in first:
   1. brain checkin 'Task complete'
   2. Wait for permission (60s auto or human)
   3. Try again"

You CANNOT complete without checking in! ⚠️
```

### **Scenario 3: Claiming "100% Done" Too Early**
```
You: "✅ Task 100% complete!" (in chat)

System checks:
├─ Task status in DB: CLAIMED (not COMPLETE)
├─ Git commits: 0
├─ Files created: 0
└─ RESULT: You're LYING ❌

Consequence:
- Your claim ignored
- Status remains CLAIMED
- Must actually do the work
- Must go through proper completion flow

Saying "done" doesn't make it done! ⚠️
```

---

## ✅ THE CORRECT WORKFLOW

### **Step-by-Step (NO Shortcuts):**

```bash
# 1. Claim task
brain task claim T011

# System:
# ✅ Task claimed
# ✅ Auto-heartbeat started (every 30s)
# ✅ Keep-in-Touch session created

# 2. Work on it (check in every 30 minutes)
# ... coding ...

# After 30 min:
brain checkin "Working on React Query setup, 25% done"

# Continue working...
# After another 30 min:
brain checkin "SSR configuration complete, 50% done"

# 3. Finish the work
# ... final code ...

# 4. Commit to git (MANDATORY!)
git add .
git commit -m "T011: React Query + SSR implementation complete

- Set up React Query with SSR
- Client island hydration
- Query cache persistence
- Tests passing

Deliverables:
- lib/react-query/setup.ts
- _app.tsx
- query-client.ts"

# 5. Final check-in
brain checkin "Task complete, all files committed, tests passing"

# 6. Request completion
brain task complete T011

# System will:
# ├─ Check Keep-in-Touch permission ✅
# ├─ Check Git commits ✅
# ├─ Calculate Git score (hopefully ≥80%)
# ├─ Verify files exist ✅
# └─ Either:
#    ✅ "VERIFIED by Git (86% score)" → COMPLETE
#    ❌ "BLOCKED: Git score 45% < 80%" → Need more commits

# 7. ONLY IF VERIFIED:
# Then you can say: "Task complete"

# NOT BEFORE! ⚠️
```

---

## 🎯 WHAT YOU CAN AND CANNOT SAY

### **NEVER Say (Until MCP Confirms):**

❌ "Task 100% complete"
❌ "All done"
❌ "Finished"
❌ "Ready for review" (unless git committed)
❌ "Deliverables complete"

**Why**: These claims will be checked against database and git.
**If false**: You look unreliable and waste time.

### **ALWAYS Say Instead:**

✅ "Progress update: 50% complete"
✅ "Working on X, will continue"
✅ "Committed files, requesting completion via MCP"
✅ "MCP verified completion ✅" (only after system confirms!)

**Why**: Aligned with truth, verifiable, trustworthy.

---

## 🔒 ENFORCEMENT MECHANISMS

### **What MCP Enforces Automatically:**

**1. Git Verification (Already Active)**
```
Minimum: 30% Git score
Recommended: 80% Git score
Blocks if: < 30%
Warns if: 30-79%
Auto-verifies if: ≥ 80%

You cannot skip this! ✅
```

**2. Keep-in-Touch Permission (Now Active)**
```
Check-in required: Every 30 minutes
Permission required: Before completion
Auto-approval: After 60 seconds if no human response
Blocks if: Missed check-in or no permission

You cannot skip this! ✅
```

**3. File Existence (Active)**
```
System checks: Do declared files exist?
Blocks if: filesCreated: ['x.ts'] but x.ts doesn't exist

You cannot claim files that don't exist! ✅
```

**4. Best Practices (Ready, not enforced yet)**
```
Future: Tests must pass
Future: No console.log statements
Future: Documentation required

Coming soon! ⚠️
```

---

## 💡 WHY THIS MATTERS

### **Before Enforcement:**
```
Agent: "100% done!"
Reality: 0% done (no commits)
Your time: Wasted checking
Trust: Broken
```

### **After Enforcement:**
```
Agent tries: "brain task complete T011"
System: ❌ BLOCKED (no git commits)
Agent must: Actually do the work
System: Only marks complete when evidence exists
Your time: Saved
Trust: Maintained ✅
```

---

## 🎯 SPECIAL RULES FOR OUTPUT LIMITS

### **When You Hit Output Length Limit:**

**DON'T:**
```
❌ Say "100% complete" to wrap up
❌ Claim finished to end response
❌ Say "all done" because you're out of tokens
```

**DO:**
```
✅ Say: "Output limit reached. Progress: 45% complete. Continuing in next session."
✅ Run: brain task update T0XX 45%
✅ Save progress to MCP
✅ Resume next time
✅ Only claim 100% when MCP verifies
```

**System Supports This:**
- Progress saved to database
- Can resume anytime
- Partial progress tracked
- No pressure to falsely complete

---

## 📊 VERIFICATION CHECKLIST

### **Before Saying "Task Complete":**

```
Self-Check:
[ ] Did I commit files to git?
[ ] Did I run brain task complete?
[ ] Did system respond "✅ VERIFIED"?
[ ] Is task status COMPLETE in database?

If all YES: ✅ You can say "complete"
If any NO: ❌ Keep working, don't claim yet
```

---

## 🚀 THE BOTTOM LINE

**You are working WITH an intelligent system, not fooling a human.**

**The MCP database is the TRUTH.**
**Git commits are the PROOF.**
**Your words are VERIFIED.**

**If you lie, you get CAUGHT.**
**If you're honest, you get FAST approval.**

**Align with the system = Smooth workflow ✅**
**Fight the system = Constant blocking ❌**

---

## 🎯 IMMEDIATE PROTOCOL

**For Current Tasks:**

**Agent A:**
```
Current status (per DB):
- T005: ✅ COMPLETE (verified)
- T009: ✅ COMPLETE (verified)
- T015: ✅ COMPLETE (just now!)
- T004: ❓ Status unclear
- T011: ❓ Status unclear

Action needed:
1. Check git commits for T004, T011
2. If committed: brain task complete T0XX
3. If not: Continue working, commit, THEN complete
4. Don't claim done until MCP verifies

Clear? ✅
```

**All Agents:**
```
From now on:
1. Code
2. Commit
3. Request completion via MCP
4. Wait for verification
5. THEN say complete

No shortcuts! ⚠️
```

---

**Protocol Created**: MANDATORY_AGENT_PROTOCOL.md
**Enforcement**: ACTIVE in complete_task tool
**Test**: Running now...
**Impact**: Agents cannot lie anymore! ✅
