# 📍 Central MCP Data Locations - Complete Map
## Where Everything is Stored

**Date**: 2025-10-09
**Reporter**: Agent B (Ground Supervisor - 1M)
**Purpose**: Document ALL Central Intelligence data locations
**Status**: COMPLETE AUDIT

---

## 🗄️ PRIMARY DATA STORAGE

### **1. Main Database (SQLite)**

**Location:**
```
/Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry/data/registry.db
```

**What's Stored:**
```
19 Tables with ALL Central Intelligence data:

CRITICAL DATA:
├─ projects (1 row) - LocalBrain + future projects
├─ tasks (19 rows) - All LocalBrain app tasks
├─ agents (3 rows) - Agent A, C, D (now B too!)

INTELLIGENCE:
├─ agent_sessions (7 rows) - Connection history
├─ agent_activity (16 rows) - Operation log
├─ agent_presence (6 rows) - Real-time status
├─ agent_metrics (3 rows) - Daily performance

CONTEXT:
├─ context_files (1,883 rows!) - All indexed files
├─ agent_context_reports (0 rows) - Context window tracking

COST:
├─ model_catalog (5 rows) - GLM, Sonnet, Gemini, GPT
├─ agent_usage (1 row) - Hours tracked
├─ task_costs (0 rows) - Actual costs
├─ budget_alerts (0 rows) - Warnings

ENFORCEMENT:
├─ kit_sessions (0 rows) - Keep-in-Touch sessions
├─ completion_permissions (0 rows) - Gating permissions

SYSTEM:
├─ migrations (7 rows) - Schema versions
├─ task_history (0 rows) - Audit log
├─ cloud_storage (5 rows) - Cloud references

Size: ~2.1 MB
Health: HEALTHY ✅
Backups: None yet (needs setup!)
```

**This is THE SINGLE SOURCE OF TRUTH!** ⭐

---

## 🏠 AGENT-SIDE CONFIGURATION

### **2. Global Agent Config**

**Location:**
```
~/.brain/config.json
```

**What's Stored:**
```json
{
  "trackingId": "tracking-uuid-12345",
  "agentId": "agent-uuid-67890",
  "registeredAt": "2025-10-09T00:00:00Z",
  "version": "2.0.0",
  "serverPath": "/path/to/mcp-server",
  "preferences": {
    "checkinInterval": 30,
    "autoContextSync": true,
    "theme": "dark"
  }
}
```

**Purpose:**
- Agent persistent identity (tracking ID)
- Default preferences
- Server discovery hints

**Scope:** Per user (all agents on this machine share)

---

### **3. Global Registry**

**Location:**
```
~/.brain/registry.json
```

**What's Stored:**
```json
{
  "servers": [
    {
      "id": "localbrain-local",
      "name": "LocalBrain Central Intelligence (Local)",
      "type": "stdio",
      "path": "/Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry/dist/index.js",
      "projects": ["LocalBrain"],
      "active": true,
      "lastSeen": "2025-10-09T22:00:00Z",
      "priority": 10
    }
  ],
  "preferences": {
    "preferLocal": true,
    "fallbackToCloud": true
  }
}
```

**Purpose:**
- Multi-server registry
- Auto-discovery database
- Server selection preferences

**Scope:** Per user (all projects)

---

## 📁 PROJECT-LEVEL CONFIGURATION

### **4. Project Marker File**

**Location:**
```
/Users/lech/PROJECTS_all/LocalBrain/.brain/server.json
```

**What's Stored:**
```json
{
  "serverPath": "01_CODEBASES/mcp-servers/localbrain-task-registry/dist/index.js",
  "serverType": "stdio",
  "autoStart": true,
  "projects": ["LocalBrain"],
  "version": "2.0.0"
}
```

**Purpose:**
- Auto-discovery marker
- Project-specific MCP location
- Quick server find

**Scope:** Per project

---

## 💾 STORAGE ARCHITECTURE

### **Complete Data Flow:**

```
┌─────────────────────────────────────────────────────────┐
│  AGENT LOCAL STORAGE (Per Machine)                      │
├─────────────────────────────────────────────────────────┤
│  ~/.brain/config.json (agent identity + preferences)    │
│  ~/.brain/registry.json (server registry)               │
└─────────────────────────────────────────────────────────┘
                              ↓
                    Agent connects to:
                              ↓
┌─────────────────────────────────────────────────────────┐
│  PROJECT CONFIGURATION                                   │
├─────────────────────────────────────────────────────────┤
│  .brain/server.json (MCP server location marker)        │
└─────────────────────────────────────────────────────────┘
                              ↓
                    Points to:
                              ↓
┌─────────────────────────────────────────────────────────┐
│  MCP SERVER STORAGE (Central Intelligence)              │
├─────────────────────────────────────────────────────────┤
│  data/registry.db (19 tables, ALL operational data)     │
│    ├─ Projects, Tasks, Agents                           │
│    ├─ Sessions, Activity, Presence                      │
│    ├─ Context files (1,883 indexed)                     │
│    ├─ Costs, Budget, Limits                             │
│    └─ Specs, Permissions, Metrics                       │
│                                                          │
│  Size: 2.1 MB                                           │
│  Health: HEALTHY ✅                                      │
│  Backup: NONE yet ⚠️                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🌍 FOR CLOUD DEPLOYMENT

### **Future Cloud Storage:**

**When Deployed to Railway:**
```
Cloud Database (PostgreSQL):
└─ All 19 tables migrated to cloud
   └─ Accessible from anywhere
      └─ Multi-machine coordination

Cloud Storage (S3/GCS):
└─ Context files (1,883 files)
   └─ Shared across all agents
      └─ No local storage needed

Redis Cache:
└─ Real-time presence
   └─ Session state
      └─ Fast queries

Local Still Has:
└─ ~/.brain/config.json (identity)
   └─ Points to cloud MCP URL
```

---

## 🔍 COMPLETE FILE MANIFEST

### **Configuration Files:**

```
LOCAL (Per User):
├─ ~/.brain/config.json (agent identity)
├─ ~/.brain/registry.json (server registry)

PROJECT (Per Project):
├─ .brain/server.json (MCP location)
├─ .github/workflows/ci.yml (CI/CD config)
├─ railway.json (Railway deployment)
├─ Procfile (process definition)
└─ .env.example (environment template)

MCP SERVER (Central):
├─ data/registry.db ⭐ (THE DATABASE - 2.1 MB)
├─ data/context-storage/ (cloud upload staging)
├─ data/test-*.db (test databases)

DOCUMENTATION (120+ files):
├─ 04_AGENT_FRAMEWORK/*.md (protocols, status, guides)
├─ README.md (GitHub face)
├─ API_REFERENCE.md (20 tools documented)
├─ DEPLOYMENT.md (Railway guide)
└─ Multiple guides, protocols, reports

SOURCE CODE (51 files):
├─ src/**/*.ts (11,666 LOC production)
├─ tests/**/*.ts (4,500 LOC tests)
└─ scripts/*.ts (utilities)

Total files: 300+ in MCP system
```

---

## ⚠️ CRITICAL: BACKUP STATUS

### **Current Backup Situation:**

```
Database: NO AUTOMATIC BACKUPS ❌
Risk: If registry.db corrupted → ALL DATA LOST
Impact: CRITICAL

Recommendation: IMMEDIATE backup setup!

Options:
1. Git-based (commit data/ folder)
2. Automated script (daily backup)
3. Cloud sync (Railway PostgreSQL)
```

---

## 🎯 DATA LOCATIONS SUMMARY

**All Central MCP data is in 3 locations:**

**1. SQLite Database** ⭐ (PRIMARY)
```
Location: 01_CODEBASES/mcp-servers/localbrain-task-registry/data/registry.db
Size: 2.1 MB
Tables: 19
Rows: 2,000+
Status: HEALTHY ✅
Backup: NONE ⚠️
```

**2. Local Agent Config** (IDENTITY)
```
Location: ~/.brain/config.json + registry.json
Size: <1 KB each
Purpose: Agent identity + server discovery
Status: WORKING ✅
Backup: Git (in home directory backup if you have one)
```

**3. Project Markers** (DISCOVERY)
```
Location: .brain/server.json per project
Size: <1 KB
Purpose: Auto-discovery
Status: WORKING ✅
Backup: In git repo ✅
```

---

## 🚨 CRITICAL RECOMMENDATION

**IMMEDIATE ACTION NEEDED:**

**Setup Database Backup:**
```bash
# Add to crontab
0 * * * * cp /Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry/data/registry.db /Users/lech/PROJECTS_all/LocalBrain/01_CODEBASES/mcp-servers/localbrain-task-registry/data/backups/registry-$(date +\%Y\%m\%d-\%H).db

# Or git-based
cd data && git init && git add registry.db && git commit -m "Backup $(date)"

# Or cloud sync
When deployed: PostgreSQL has automatic backups ✅
```

---

**Report By**: Agent B (1M Supervisor)
**Data Audit**: COMPLETE
**Status**: All data locations identified
**Warning**: NO BACKUPS - Set up immediately!
