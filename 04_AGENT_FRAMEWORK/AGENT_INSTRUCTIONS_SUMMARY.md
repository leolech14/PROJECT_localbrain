# 🤖 LocalBrain Agent Instructions Summary

**Created**: 2025-10-08
**Created by**: Agent C (Backend Services Specialist)
**Status**: Complete - All 6 agents have detailed instructions

---

## 📋 OVERVIEW

Complete instruction sets have been created for all 6 agents in the LocalBrain ecosystem based on the ChatGPT-5 strategic guidance. Each instruction file contains:

- **Primary Mission** - Core purpose and responsibilities
- **Current Deliverable Status** - What's completed, in progress, and not started
- **Core Tasks** - Detailed task assignments from ChatGPT instructions
- **Success Criteria** - Definition of Done for each agent
- **Handoff Protocols** - How to coordinate with other agents
- **Metrics & Monitoring** - Performance and quality metrics
- **Sprint Plans** - Week-by-week execution plans
- **Blockers & Risks** - Current impediments and mitigation strategies

---

## 🎯 AGENT COORDINATION MAP

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT COORDINATION MAP                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LECH (HITL)                                                │
│    │                                                        │
│    ▼                                                        │
│  AGENT F (ChatGPT-5) - Strategic Supervisor                 │
│    │                                                        │
│    ├─────────────────────────────────────────────────────┐    │
│    │                                                   │    │
│    ▼                                                   ▼    │
│ AGENT E (Gemini) - Ground Supervisor                     │    │
│    │                                                   │    │
│    ├─────────┬─────────┬─────────┬─────────────────────┤    │
│    │         │         │         │                     │    │
│    ▼         ▼         ▼         ▼                     ▼    │
│ AGENT A    AGENT B    AGENT C    AGENT D               │    │
│ (GLM-4.6)  (Sonnet)   (GLM-4.6)  (Sonnet)             │    │
│  UI       Design    Backend    Integration               │    │
│ Velocity  System    Services   Specialist               │    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 INSTRUCTION FILES CREATED

### 1. AGENT_A_UI_VELOCITY.md
**Agent**: GLM-4.6 (UI Velocity Specialist)
**Focus**: Frontend development, rapid prototyping, Next.js UI lab
**Key Tasks**:
- 12-col responsive grid implementation
- Sidebar agent panel development
- React Query + SSR integration
- Offline support implementation
- Design system integration

**Current Status**: Sprint 1 ready, 5 core tasks defined
**Dependencies**: Design tokens from Agent B, IPC contracts from Agent D

---

### 2. AGENT_B_DESIGN_SYSTEM.md
**Agent**: Sonnet-4.5 (Design System Specialist)
**Focus**: OKLCH tokens, APCA contrast, accessibility compliance
**Key Tasks**:
- OKLCH token system implementation
- APCA contrast enforcement (≥60 body, ≥75 interactive)
- Motion token system
- Component accessibility audit
- Storybook setup and documentation

**Current Status**: Sprint 1 ready, 5 core tasks defined
**Dependencies**: Component list from Agent A, CI pipeline access

---

### 3. AGENT_C_BACKEND_SERVICES.md
**Agent**: GLM-4.6 (Backend Services Specialist)
**Focus**: APIs, ledger, policy engine, orchestration services
**Key Tasks**:
- Schema contracts implementation
- Policy-as-Code engine development
- Change-Set Ledger implementation
- Global kill-switch system
- Docs RAG index system

**Current Status**: Sprint 1 ready, 5 core tasks defined
**Dependencies**: Database technology decision, CI pipeline access

---

### 4. AGENT_D_INTEGRATION.md
**Agent**: Sonnet-4.5 (Integration Specialist)
**Focus**: Swift ↔ Web bridge, IPC contracts, system integration
**Key Tasks**:
- IPC contract implementation
- Swift WebKit bridge development
- TypeScript client implementation
- Schema validation system
- Performance optimization

**Current Status**: Sprint 1 ready, 5 core tasks defined
**Dependencies**: Swift project access, WebKit configuration

---

### 5. AGENT_E_COHERENCE.md
**Agent**: Gemini-2.5-Pro (Ground Supervisor)
**Focus**: Knowledge coherence, spec auditing, RAG management
**Key Tasks**:
- Spec consolidation execution
- RAG index management
- Cross-agent coordination
- Quality gate enforcement
- Knowledge base management

**Current Status**: Leading ITERATION_03, Sprint 1 ready
**Dependencies**: Agent coordination compliance, consolidation complexity

---

### 6. AGENT_F_SUPERVISOR.md
**Agent**: ChatGPT-5 (Strategic Supervisor)
**Focus**: Strategic planning, instruction generation, methodology validation
**Key Tasks**:
- Strategic planning and roadmap
- Agent instruction generation
- Methodology validation and improvement
- Quality assurance and validation
- HITL decision support

**Current Status**: ITERATION_03 complete, ITERATION_04 planning ready
**Dependencies**: Lech approval, ground agent readiness

---

## 🎯 TASK COMPLETENESS VERIFICATION

### ✅ FULLY CAPTURED FROM CHATGPT THREAD

#### Core Deliverables (Tasks 1-18)
- [x] Task 1: Spec Index & Taxonomy (52 specs)
- [x] Task 2: Spec Skeletons (12 P0 specs)
- [x] Task 3: Agent Instructions (A-E)
- [x] Task 4: Methodology Validation
- [x] Task 5: MVP Roadmap
- [x] Task 6: Spec Consolidation Plan
- [x] Task 7: Definition of Done
- [x] Task 8: Spec Expansion Backlog
- [x] Tasks 9-18: Additional specs and components

#### Agent-Specific Tasks
- [x] Agent A: UI velocity tasks (grid, sidebar, SSR, offline, design integration)
- [x] Agent B: Design system tasks (tokens, APCA, motion, accessibility, Storybook)
- [x] Agent C: Backend tasks (schemas, policy, ledger, kill-switch, RAG)
- [x] Agent D: Integration tasks (IPC, bridge, validation, performance)
- [x] Agent E: Coherence tasks (consolidation, RAG, coordination, quality)
- [x] Agent F: Supervision tasks (strategy, instructions, methodology, quality)

#### Success Criteria & Deliverables
- [x] Performance requirements defined for each agent
- [x] Quality requirements established
- [x] Integration requirements specified
- [x] Handoff protocols documented
- [x] Metrics & monitoring frameworks
- [x] Sprint plans with timelines
- [x] Risk assessments and mitigation strategies

---

## 🚀 IMPLEMENTATION READINESS

### Ready to Begin Sprint 1
All 6 agents have comprehensive instructions and can begin parallel execution:

#### Agent A - UI Velocity
- ✅ Clear task definitions (5 core tasks)
- ✅ Success criteria established
- ✅ Dependencies identified
- ✅ Sprint timeline defined

#### Agent B - Design System
- ✅ OKLCH token system tasks
- ✅ APCA enforcement requirements
- ✅ Component audit scope
- ✅ Quality gate integration

#### Agent C - Backend Services
- ✅ Schema validation tasks
- ✅ Policy engine requirements
- ✅ Ledger implementation plan
- ✅ RAG index system

#### Agent D - Integration
- ✅ IPC contract specifications
- ✅ Bridge implementation tasks
- ✅ Performance targets
- ✅ Validation requirements

#### Agent E - Coherence
- ✅ Consolidation execution plan
- ✅ RAG management tasks
- ✅ Coordination framework
- ✅ Quality enforcement

#### Agent F - Supervision
- ✅ Strategic oversight framework
- ✅ Instruction generation system
- ✅ Quality validation process
- ✅ Decision support structure

---

## 📊 COORDINATION REQUIREMENTS

### Daily Coordination
- **Standup**: All agents report progress and blockers
- **Conflict Resolution**: Agent E facilitates resolution
- **Quality Assurance**: Agent F validates adherence to strategic direction

### Weekly Coordination
- **Sprint Review**: Assess progress against success criteria
- **Sprint Planning**: Adjust priorities and resources
- **Architecture Review**: Validate coherence and consistency

### Phase Transitions
- **Decision Gates**: Lech approves major transitions
- **Quality Validation**: All agents must meet DoD requirements
- **Strategic Alignment**: Agent F ensures alignment with vision

---

## ⚠️ CRITICAL DEPENDENCIES

### Technical Dependencies
- **Database Technology**: Agent C needs PostgreSQL/SQLite decision
- **CI Pipeline Access**: Agents B, C need pipeline access for quality gates
- **Swift Project Access**: Agent D needs access to Swift codebase
- **WebKit Configuration**: Agent D needs WebKit setup details

### Coordination Dependencies
- **Design Tokens**: Agent A depends on Agent B for token delivery
- **IPC Contracts**: Agent A depends on Agent D for bridge integration
- **Schema Validation**: Agent D depends on Agent C for schema definitions
- **Architecture Decisions**: All agents depend on Agent E for coherence

### Resource Dependencies
- **Development Environment**: All agents need proper development setup
- **Testing Infrastructure**: Comprehensive testing environments needed
- **Documentation Systems**: RAG and documentation systems operational
- **Monitoring Tools**: Performance and quality monitoring tools

---

## 🎯 NEXT STEPS

### Immediate Actions (Today)
1. **Review Instruction Files**: All agents review their detailed instructions
2. **Confirm Dependencies**: Identify and resolve any blocking dependencies
3. **Setup Development Environments**: Ensure all agents have required tools
4. **Begin Sprint 1**: Start execution of defined tasks

### This Week
1. **Daily Standups**: Begin coordination framework
2. **Task Execution**: Parallel execution of Sprint 1 tasks
3. **Progress Monitoring**: Track against success criteria
4. **Blocker Resolution**: Address impediments quickly

### Next Sprint
1. **Sprint Review**: Assess Sprint 1 completion
2. **Sprint Planning**: Adjust tasks and priorities
3. **Architecture Review**: Validate coherence and integration
4. **Phase Transition**: Prepare for implementation phase

---

## 📞 CONTACT & COORDINATION

### Agent Roles & Contacts
- **Agent F** (ChatGPT-5): Strategic supervision, overall coordination
- **Agent E** (Gemini): Ground supervision, day-to-day coordination
- **Agent C** (GLM-4.6): Backend services, technical coordination
- **Agent A** (GLM-4.6): UI development, frontend coordination
- **Agent B** (Sonnet-4.5): Design system, quality coordination
- **Agent D** (Sonnet-4.5): Integration, system coordination

### Communication Protocols
- **Strategic Decisions**: Lech → Agent F → All agents
- **Technical Coordination**: Agent E → All agents
- **Specialist Coordination**: Peer-to-peer with Agent E oversight
- **Issue Escalation**: Agent → Agent E → Agent F → Lech

---

**Status**: ✅ COMPLETE - All 6 agents have comprehensive instruction files
**Verification**: All ChatGPT thread tasks captured and distributed
**Readiness**: All agents ready to begin Sprint 1 execution
**Next Action**: Begin parallel Sprint 1 implementation phase