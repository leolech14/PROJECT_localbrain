# 🚀 CENTRAL INTELLIGENCE - Quick Reference Guide
## Doppler-Simple Commands for Universal Agent Orchestration

**Version**: 2.0
**Status**: 📋 REFERENCE GUIDE

---

## 🎯 ONE-TIME SETUP

### **Installation (Global)**
```bash
# Install CLI tool globally (like Doppler)
npm install -g @lech/brain-cli

# Verify installation
brain --version
# → @lech/brain-cli v2.0.0
```

### **Authentication (One-Time)**
```bash
# Login to Central Intelligence
brain auth login
# → Enter your email: lech@example.com
# → Enter your API key: brain_xxxxxxxxxxxxxx
# → ✅ Authenticated successfully!

# Store API key in environment (recommended)
export BRAIN_API_KEY="brain_xxxxxxxxxxxxxx"

# Or use config file
brain config set apiKey "brain_xxxxxxxxxxxxxx"
```

---

## 📋 DAILY WORKFLOW COMMANDS

### **1. Connect as Agent (Auto-Identification)**
```bash
# System automatically identifies you and activates your role
brain connect

# System response:
# ✅ Authenticated as Agent D
# 🔍 Detected project: LocalBrain
# 🎯 Assigned role: Integration Specialist
# 📋 Available tasks: 5 tasks
# ⏱️  Keep-in-touch: Check-in required every 30 min
# 🤖 Recommended model: claude-sonnet-4-5 (1M context)
# 📚 Context loaded: 150 files (12MB)
# ✅ Ready to work!
```

### **2. View Available Tasks**
```bash
# List all available tasks for your role
brain task list

# Response:
# 📋 Available Tasks (5):
#
# T020: Implement authentication system (P0-Critical)
#   ├─ Effort: 8 hours
#   ├─ Dependencies: None
#   └─ Best practices: TEST_BEFORE_COMMIT, DOCUMENT_CHANGES
#
# T021: Build dashboard UI (P1-High)
#   ├─ Effort: 16 hours
#   ├─ Dependencies: T020
#   └─ Best practices: WCAG_AA_COMPLIANCE
#
# ...

# Filter by priority
brain task list --priority P0

# Filter by dependencies
brain task list --ready  # Only tasks with satisfied dependencies
```

### **3. Claim a Task**
```bash
# Claim task T020
brain task claim T020

# Response:
# ✅ Task T020 claimed
# 📋 Task: Implement authentication system
# 📚 Relevant context loaded:
#    - 15 specs
#    - 8 documentation files
#    - 23 code examples
# ⏱️  Keep-in-touch activated
#    - Next check-in due: 8:30 PM (30 minutes)
# 🎯 Best practices required:
#    - TEST_BEFORE_COMMIT (blocking)
#    - DOCUMENT_CHANGES (blocking)
# ✅ You can start working now!
```

### **4. Regular Check-Ins (Every 30 Minutes)**
```bash
# Check in with progress update
brain checkin "Implemented JWT authentication, writing tests"

# Response:
# ✅ Check-in received
# 📊 Progress recorded
# ⏱️  Next check-in due: 9:00 PM
# 💡 Tip: You're making good progress! Keep going.

# Check in with progress percentage
brain checkin "70% complete, all tests passing" --progress 70

# Emergency check-in (if stuck)
brain checkin "Blocked on database connection issue" --blocked
```

### **5. Update Task Progress**
```bash
# Update task progress
brain task update T020 50%

# With details
brain task update T020 75% --files "auth.ts,auth.test.ts" --notes "JWT implementation complete"

# Response:
# ✅ Progress updated
# 📊 Task T020: 75% complete
# 📁 Files: auth.ts, auth.test.ts
# 📝 Notes: JWT implementation complete
# ⏱️  Keep-in-touch status: On track
```

### **6. Complete a Task (Keep-in-Touch Enforced)**
```bash
# Attempt to complete task
brain task complete T020

# Response (if check-in needed):
# ⏱️  Keep-in-touch check required first!
# Please run: brain checkin <message>

# After check-in, try again:
brain task complete T020

# Response:
# 🔍 Validating completion...
# ✓ Tests passing: YES
# ✓ Documentation updated: YES
# ✓ Best practices followed: YES
# ⏳ Requesting stand-by permission from Central Intelligence...
#
# [30 seconds later]
#
# ✅ Stand-by permission granted!
# ✅ Task T020 completed successfully
# 🎉 Unlocked dependent tasks: T025, T026
# 📊 Your velocity: 150% (excellent!)
# 🏆 Next task suggestion: T021 (Build dashboard UI)
```

---

## 🌐 MULTI-PROJECT COMMANDS

### **Create New Project**
```bash
# Create new project
brain project create AudioAnalyzer

# Response:
# ✅ Project created: AudioAnalyzer
# 🔍 Analyzing project type: Audio Processing Tool
# 🎯 Suggested roles:
#    - Audio Processing Specialist
#    - UI Specialist
#    - Backend Specialist
# 📋 Template tasks loaded: 15 tasks
# 🤖 Recommended models:
#    - claude-sonnet-4-5 (for complex audio analysis)
#    - gpt-4-turbo (for UI/UX design)
# 📚 Context directory created: AudioAnalyzer/context/
```

### **List Projects**
```bash
# List all projects
brain project list

# Response:
# 📁 Your Projects (3):
#
# 1. LocalBrain (Active)
#    ├─ Role: Integration Specialist
#    ├─ Tasks: 19 total, 5 available, 8 completed
#    └─ Last active: 2 minutes ago
#
# 2. AudioAnalyzer
#    ├─ Role: Not assigned
#    ├─ Tasks: 15 total, 15 available, 0 completed
#    └─ Last active: Never
#
# 3. Gov.br Platform
#    ├─ Role: Backend Specialist
#    ├─ Tasks: 42 total, 3 available, 12 completed
#    └─ Last active: 3 days ago
```

### **Switch Projects**
```bash
# Switch to different project
brain project switch AudioAnalyzer

# Response:
# ✅ Switched to AudioAnalyzer
# 🔍 No role assigned yet
# 📋 Would you like to:
#    1. Auto-assign role based on capabilities
#    2. Manually select role
#
# Select option: 1
#
# 🎯 Auto-assigned role: Audio Processing Specialist
# 📋 Available tasks: 8 tasks ready
# 📚 Context loaded: AudioAnalyzer context files
# ✅ Ready to work on AudioAnalyzer!
```

---

## 📚 CONTEXT MANAGEMENT COMMANDS

### **Upload Context Files**
```bash
# Upload entire directory
brain context upload ./specs

# Response:
# 🔍 Scanning directory: ./specs
# 📊 Found 47 files:
#    - 23 specs (*.md)
#    - 15 docs (*.pdf)
#    - 9 code examples (*.ts, *.tsx)
# 📤 Uploading to cloud storage...
# ✅ Upload complete (12.3 MB in 8 seconds)
# 🔍 Indexing for search...
# ✅ Indexed 47 files
# 📚 Context available for all agents

# Upload specific file
brain context upload ./spec-base-architecture.md

# Upload with tags
brain context upload ./ui-specs --tags "ui,design,specs"
```

### **Search Context**
```bash
# Search context files
brain context search "authentication flow"

# Response:
# 🔍 Found 8 matching files:
#
# 1. auth-spec.md (95% match)
#    "Authentication flow using JWT tokens with..."
#
# 2. security-guidelines.md (87% match)
#    "Best practices for authentication in..."
#
# ...

# Get specific context file
brain context get auth-spec.md
```

### **Sync Context (Automatic)**
```bash
# Automatic sync of local changes to cloud
brain context sync

# Response:
# 🔄 Syncing local context to cloud...
# 📊 Changes detected:
#    - 3 new files
#    - 5 modified files
#    - 1 deleted file
# 📤 Uploading changes...
# ✅ Sync complete
# 📚 All agents have access to updated context
```

---

## 👥 AGENT & TEAM COMMANDS

### **View Agent Status**
```bash
# View your own status
brain agent status

# Response:
# 👤 Agent D (Integration Specialist)
# 📊 Status: ONLINE
# 🎯 Current project: LocalBrain
# 📋 Current task: T020 (In Progress - 75%)
# ⏱️  Keep-in-touch: Last check-in 5 minutes ago (✅ On track)
# 🤖 Model: claude-sonnet-4-5 (1M context)
# 📊 Today's stats:
#    - Tasks completed: 3
#    - Active time: 4.5 hours
#    - Velocity: 140%

# View other agent status
brain agent status B

# Response:
# 👤 Agent B (Design System Specialist)
# 📊 Status: ONLINE
# 🎯 Current project: LocalBrain
# 📋 Current task: T022 (Available)
# ⏱️  Keep-in-touch: Last check-in 12 minutes ago (✅ On track)
# 🤖 Model: claude-sonnet-4-5
```

### **View Team Dashboard**
```bash
# View entire team status
brain team dashboard

# Response:
# 📊 LocalBrain Team Dashboard
#
# 🟢 Online (4):
#    ├─ Agent A (UI Specialist) - Working on T023
#    ├─ Agent B (Design Specialist) - Available
#    ├─ Agent D (Integration) - Working on T020
#    └─ Agent E (Supervisor) - Monitoring
#
# 🔴 Offline (2):
#    ├─ Agent C (Backend) - Last seen 2 hours ago
#    └─ Agent F (Strategic) - Last seen 1 day ago
#
# 📋 Tasks:
#    ├─ Total: 19
#    ├─ Completed: 8 (42%)
#    ├─ In Progress: 4 (21%)
#    ├─ Available: 5 (26%)
#    └─ Blocked: 2 (11%)
#
# 🎯 Sprint Progress: 42% complete (Day 3 of 7)
```

---

## 🛠️ ADVANCED COMMANDS

### **Model Recommendations**
```bash
# Get model recommendation for current task
brain model recommend

# Response:
# 🤖 Recommended Model for T020:
#
# Best Match: claude-sonnet-4-5 (Score: 92/100)
#    ✓ Context size: 1M tokens (sufficient for 150 files)
#    ✓ Capabilities: Backend, Integration, Testing
#    ✓ Historical success: 95% for similar tasks
#    ✓ Cost efficiency: $0.015 per 1K tokens
#
# Alternatives:
#    2. gpt-4-turbo (Score: 85/100)
#    3. gemini-2-pro (Score: 78/100)
```

### **Best Practices Check**
```bash
# Check best practices before completion
brain best-practices check

# Response:
# 🔍 Checking best practices for T020...
#
# ✅ TEST_BEFORE_COMMIT: PASS
#    - 15 tests passing
#    - Coverage: 85%
#
# ✅ DOCUMENT_CHANGES: PASS
#    - README updated
#    - API docs generated
#
# ⚠️  CODE_REVIEW: WARNING
#    - No peer review recorded
#    - Recommendation: Request review before completion
#
# ✅ SECURITY_AUDIT: PASS
#    - No security vulnerabilities detected
#
# 🎯 Overall: Ready to complete (1 warning)
```

### **Emergency Commands**
```bash
# Emergency: Need immediate help
brain emergency --issue "Critical bug in production"

# Escalate stuck task
brain task escalate T020 --reason "Blocked on infrastructure issue"

# Request human intervention
brain human request --urgent "Need strategic decision on architecture"
```

---

## 🔧 CONFIGURATION COMMANDS

### **View Configuration**
```bash
# View current configuration
brain config show

# Response:
# ⚙️  Current Configuration:
#
# 📊 General:
#    - API Key: brain_****...****
#    - Current Project: LocalBrain
#    - Default Role: Integration Specialist
#
# ⏱️  Keep-in-Touch:
#    - Check-in interval: 30 minutes
#    - Auto-approval timeout: 60 seconds
#    - Grace period: 1.5x interval
#
# 🎯 Preferences:
#    - Auto-context sync: enabled
#    - Notification level: normal
#    - CLI theme: dark
```

### **Update Configuration**
```bash
# Update check-in interval
brain config set checkinInterval 45

# Enable/disable auto-sync
brain config set autoContextSync false

# Set default project
brain config set defaultProject LocalBrain
```

---

## 📖 HELP & DOCUMENTATION

### **Get Help**
```bash
# General help
brain help

# Command-specific help
brain task help
brain context help
brain agent help

# Quick tips
brain tips

# Full documentation
brain docs open
```

---

## 🎯 COMMON WORKFLOWS

### **Start of Day Workflow**
```bash
1. brain connect                       # Connect and get activated
2. brain task list --ready            # See available tasks
3. brain task claim T020              # Claim highest priority task
4. [Work on task]
5. brain checkin "Making progress"    # Check in every 30 min
```

### **Task Completion Workflow**
```bash
1. [Finish implementation]
2. brain best-practices check         # Verify best practices
3. brain task update T020 100%        # Update to 100%
4. brain checkin "Task complete"      # Final check-in
5. brain task complete T020           # Complete task
6. brain task list --ready            # Get next task
```

### **Multi-Project Workflow**
```bash
1. brain project list                 # See all projects
2. brain project switch AudioAnalyzer # Switch project
3. brain task list                    # See new project tasks
4. brain task claim T101              # Claim task in new project
5. [Work on task]
6. brain project switch LocalBrain    # Switch back
```

---

## 💡 PRO TIPS

### **Productivity**
- Use `brain connect` at start of every session
- Set `BRAIN_API_KEY` in your shell profile for auto-auth
- Enable `autoContextSync` to keep context updated
- Use `brain task list --ready` to see only actionable tasks

### **Keep-in-Touch**
- Check in every 25-30 minutes (before timeout)
- Include meaningful progress updates
- Use `--blocked` flag if stuck
- Keep-in-touch ensures quality and coordination

### **Context Management**
- Upload context early in project lifecycle
- Tag files for better searchability
- Use `brain context search` before asking questions
- Auto-sync keeps everyone updated

### **Best Practices**
- Run `brain best-practices check` before completion
- Fix blocking violations before completing
- Request peer review for critical changes
- Document significant decisions

---

## 🚨 TROUBLESHOOTING

### **Can't connect?**
```bash
# Verify authentication
brain auth status

# Re-authenticate
brain auth login

# Check network
brain ping
```

### **Task completion blocked?**
```bash
# Check keep-in-touch status
brain agent status

# Check in if needed
brain checkin "Ready to complete"

# Check best practices
brain best-practices check
```

### **Context not loading?**
```bash
# Verify context upload
brain context list

# Re-upload if needed
brain context upload ./specs --force

# Check sync status
brain context sync --status
```

---

**Quick Reference Created By**: Agent D
**System Version**: 2.0 (Central Intelligence)
**Last Updated**: 2025-10-08

**Remember**: Brain is as simple as Doppler - one command connects you, identifies your role, loads your context, and gets you working. The system handles coordination, best practices, and quality automatically!
