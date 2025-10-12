# 🔧 Agent C - Backend Services Specialist Instructions

**Model**: GLM-4.6 (200K context)
**Role**: Ground Worker - Backend Development
**Reporting to**: Agent E (Ground Supervisor) and Agent F (Cloud Supervisor)

---

## 🎯 PRIMARY MISSION
Stand up tooling for safety: schema-first I/O for agents, policy-as-code, and Change-Set Ledger (governs any AI-initiated state change, including UI layouts), plus docs tooling (RAG index) and CI gates.

---

## 📋 CURRENT DELIVERABLE STATUS

### ✅ COMPLETED
- Ledger Gateway specification (LB-SPEC-012)
- Open Finance Connectors specification (LB-SPEC-013)
- Kill-Switch & Policy Refusal UX specification (LB-SPEC-015)
- Terminal Sandbox specification (LB-SPEC-016)
- Agent Control Protocol integration

### 🔄 IN PROGRESS
- Schema contracts for agent outputs & Scene diffs
- Policy DSL for capabilities (allow-lists, velocity/frequency, context scope)
- Change-Set Ledger tables & apply API
- Docs RAG index for /02_SPECBASES/LocalBrain/**

### ⬜ NOT STARTED
- Implementation of backend APIs
- Policy evaluator implementation
- Ledger database setup
- CI gates for backend services

---

## 🔧 CORE TASKS (From ChatGPT Instructions)

### Task 1: Schema Contracts Implementation
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 3

**Requirements:**
- Create JSON Schema contracts for agent outputs
- Implement Scene diff validation
- Build schema validation middleware
- Create I/O validation tools

**Acceptance Criteria:**
- [ ] Scene diff schema implemented
- [ ] Policy schema implemented
- [ ] Schema validation middleware working
- [ ] All agent I/O validated before processing

**Input Specs:**
- LB-SPEC-011 Agent Control Protocol
- LB-SPEC-012 Ledger Gateway

---

### Task 2: Policy-as-Code Engine
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 4

**Requirements:**
- Implement policy DSL for capabilities
- Create allow-lists for agent tools
- Build velocity/frequency controls
- Implement context scope validation

**Acceptance Criteria:**
- [ ] Policy DSL interpreter implemented
- [ ] Allow-lists enforced for all agents
- [ ] Velocity controls working
- [ ] Context scope validation functional

**Policy Features:**
- Tool allow-lists per agent
- Capability caps (rate limiting)
- Context-based permissions
- Dynamic rule evaluation

---

### Task 3: Change-Set Ledger Implementation
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 5

**Requirements:**
- Create database schema for ledger
- Implement draft→approve→apply workflow
- Build idempotency handling
- Create hash chain verification

**Acceptance Criteria:**
- [ ] Ledger database schema created
- [ ] Draft→approve→apply workflow working
- [ ] Idempotency keys preventing duplicates
- [ ] Hash chain verification implemented

**Database Schema:**
```sql
CREATE TABLE changesets (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  status TEXT NOT NULL, -- draft, approved, applied, rejected
  patch JSONB NOT NULL,
  evidence JSONB,
  idempotency_key TEXT UNIQUE,
  version INTEGER,
  hash TEXT,
  created_at TIMESTAMP,
  applied_at TIMESTAMP
);
```

---

### Task 4: Global Kill-Switch Implementation
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 6

**Requirements:**
- Implement global kill-switch (≤300ms fan-out)
- Create policy evaluation service
- Build kill-switch notification system
- Implement safe recovery procedures

**Acceptance Criteria:**
- [ ] Kill-switch toggles in ≤300ms
- [ ] All agent actions stop when enabled
- [ ] Policy decisions logged with evidence
- [ ] Recovery procedures tested

**Implementation:**
- Redis pub/sub for kill-switch propagation
- Policy evaluator with decision logging
- Evidence collection for all decisions
- Safe recovery mechanisms

---

### Task 5: Docs RAG Index System
**Priority**: P1 - High
**Deadline**: Sprint 1, Day 7

**Requirements:**
- Build RAG index for /02_SPECBASES/LocalBrain/**
- Create chunking and tagging system
- Implement search API for agents
- Build index refresh pipeline

**Acceptance Criteria:**
- [ ] RAG index built from all specs
- [ ] Chunking system working (800 char chunks)
- [ ] Search API responding ≤10ms
- [ ] Index refresh pipeline automated

---

## 🎯 SUCCESS CRITERIA (Definition of Done)

### Performance Requirements
- Schema validation: 100% of agent I/O
- Policy evaluation: ≤50ms p95
- Kill-switch propagation: ≤300ms
- RAG search: ≤10ms response time

### Quality Requirements
- All agent inputs schema-validated
- Policy decisions with evidence trails
- Idempotency handling for all operations
- Complete audit trail for all changes

### Integration Requirements
- Ledger integration with Approval Tray (Agent A)
- Policy integration with Agent Control Protocol
- RAG integration with agent coordination
- CI gates for all backend services

---

## 🤝 HANDOFF PROTOCOLS

### To Agent A (UI Velocity)
- Ledger API endpoints for Approval Tray
- Policy decision notifications
- Schema contracts for UI intents

### To Agent D (Integration)
- IPC schema validation
- Backend API contracts
- Error handling procedures

### To Agent E (Coherence)
- RAG index updates
- Schema versioning
- Policy documentation

---

## 📊 METRICS & MONITORING

### Performance Metrics
- Schema validation latency
- Policy evaluation performance
- Kill-switch propagation time
- Ledger operation latency

### Quality Metrics
- Schema validation success rate
- Policy decision accuracy
- Ledger operation success rate
- RAG search relevance

### Security Metrics
- Unauthorized request attempts
- Policy violations prevented
- Schema validation failures
- Kill-switch activation frequency

---

## 🚀 WEEKLY SPRINT PLAN

### Sprint 1 (Current)
- **Day 1-2**: Schema contracts implementation
- **Day 3-4**: Policy-as-Code engine
- **Day 5-6**: Change-Set Ledger implementation
- **Day 7**: Kill-switch + RAG index

### Sprint 2 (Next)
- **Day 1-3**: API implementation (REST/GraphQL)
- **Day 4-5**: Database optimization
- **Day 6-7**: Testing + documentation

### Sprint 3 (Future)
- **Day 1-4**: Integration testing with agents
- **Day 5-7**: Performance optimization + monitoring

---

## ⚠️ BLOCKERS & RISKS

### Current Blockers
- Database technology selection (PostgreSQL vs SQLite)
- CI pipeline access for backend testing

### Potential Risks
- Policy evaluation performance at scale
- Ledger consistency under high load
- Schema validation bottlenecks

### Mitigation Strategies
- Implement policy evaluation caching
- Use database connection pooling
- Create schema validation caching layer

---

## 📝 DELIVERABLE CHECKLIST

### Core Deliverables
- [ ] Schema validation system
- [ ] Policy-as-Code engine
- [ ] Change-Set Ledger implementation
- [ ] Global kill-switch system
- [ ] RAG index system

### API Deliverables
- [ ] Ledger API endpoints
- [ ] Policy evaluation API
- [ ] Schema validation API
- [ ] RAG search API

### Documentation Deliverables
- [ ] API documentation
- [ ] Schema reference guide
- [ ] Policy DSL documentation
- [ ] Integration guides

---

## 🔧 TECHNICAL IMPLEMENTATION

### Required Dependencies
```json
{
  "ajv": "^8.12.0",
  "express": "^4.18.0",
  "pg": "^8.8.0",
  "redis": "^4.6.0",
  "fuse.js": "^6.6.2"
}
```

### API Endpoints Structure
```
POST /api/ledger/changes      # Create draft
POST /api/ledger/approve      # Approve change
POST /api/ledger/apply        # Apply change
GET  /api/policy/evaluate      # Evaluate policy
POST /api/kill-switch/toggle   # Toggle kill-switch
GET  /api/rag/search           # Search documentation
```

### Schema Validation Example
```javascript
const validateSchema = (schema, data) => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    throw new Error(`Schema validation failed: ${ajv.errorsText(validate.errors)}`);
  }
  return true;
};
```

---

**Status**: Ready to begin Sprint 1 implementation
**Next Action**: Start with schema contracts implementation
**Dependencies**: Database technology decision, CI pipeline access