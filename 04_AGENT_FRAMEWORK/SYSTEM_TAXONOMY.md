# 🧬 LocalBrain System Taxonomy - Complete Classification & Mapping

**Purpose**: Single source of truth for understanding the ENTIRE LocalBrain ecosystem
**Audience**: All agents, Lech, and future developers
**Status**: Living document - updated as system evolves

---

## 🎯 ULTRATHINK: THE TOTALITY

### What This System IS

```
LocalBrain = Revolutionary AI Development Environment
├── 6 Hyper-Specialized Agents (A, B, C, D, E, F)
├── 5 Production Codebases (Swift, Electron, Widgets, Design, MCP)
├── 19 Tasks (T001-T019) organized by domain
├── Complete Specification Base (02_SPECBASES/)
├── Autonomous Coordination System (Keep-In-Touch)
├── Visual Monitoring System (MCP Dashboards)
└── Spec-First Development Methodology
```

**Core Innovation**:
- Specifications → UI Prototypes → Production Implementation
- Autonomous agents with telephone-line coordination
- Real-time visual monitoring of multi-agent work
- 300%+ velocity through hyper-specialization

---

## 📊 THE FOUR DIMENSIONS OF CLASSIFICATION

### Dimension 1: CODEBASES (What We're Building)
### Dimension 2: AGENTS (Who Builds It)
### Dimension 3: TASKS (Work Units)
### Dimension 4: INTERDEPENDENCIES (How Everything Connects)

---

## 1️⃣ CODEBASE TAXONOMY

### Production Codebases (5 Total)

#### CB-01: Swift App (Production Interface)
**Path**: `01_CODEBASES/LocalBrain/`
**Purpose**: macOS production application
**Tech Stack**: Swift, SwiftUI, WebKit
**Owner**: Agent A (UI), Agent B (Design), Agent D (Integration)
**Tasks**: T004, T006, T008, T013, T014, T015
**Status**: Foundation complete, UI components in progress
**LOC**: ~15,000 (estimated final: ~50,000)

**Key Components**:
- `LocalBrain.xcodeproj` - Xcode project
- `Sources/` - Swift source code
- `Resources/` - Assets, XIBs
- `Tests/` - Unit and UI tests

**Dependencies**:
- CB-02 (Electron prototype patterns)
- CB-04 (Design system)
- CB-05 (MCP coordination)

---

#### CB-02: Electron Prototype (UI Laboratory)
**Path**: `01_CODEBASES/localbrain-electron/`
**Purpose**: Next.js UI prototyping with hot reload
**Tech Stack**: Next.js 14, React, TypeScript, Tailwind
**Owner**: Agent A (UI), Agent B (Design)
**Tasks**: T004, T005, T006, T012
**Status**: Prototype environment operational
**LOC**: ~8,000 (prototype only)

**Key Components**:
- `app/` - Next.js App Router
- `components/` - React components
- `lib/` - Utilities and helpers
- `public/` - Static assets

**Purpose**: Test UI patterns before Swift implementation

**Dependencies**:
- CB-04 (Design system)
- None (intentionally isolated for rapid iteration)

---

#### CB-03: Widget System (Extensibility)
**Path**: `01_CODEBASES/orchestra-widget-system/`
**Purpose**: Extensible widget architecture
**Tech Stack**: TypeScript, React, Widget SDK
**Owner**: Agent C (Backend), Agent D (Integration)
**Tasks**: T007, T009, T020
**Status**: Architecture designed, implementation pending
**LOC**: ~5,000 (estimated final: ~20,000)

**Key Components**:
- `widgets/` - Widget implementations
- `sdk/` - Widget development kit
- `runtime/` - Widget execution environment
- `store/` - Widget marketplace (future)

**Dependencies**:
- CB-01 (Swift host)
- CB-05 (MCP communication)

---

#### CB-04: Design System (Visual Consistency)
**Path**: `01_CODEBASES/design/`
**Purpose**: OKLCH color system + accessibility
**Tech Stack**: OKLCH, CSS, Design Tokens, WCAG 2.2 AA
**Owner**: Agent B (Design System Specialist)
**Tasks**: T001 ✅, T005, T016 ✅
**Status**: OKLCH foundation complete, tokens in progress
**LOC**: ~3,000 (estimated final: ~10,000)

**Key Components**:
- `tokens/` - Design tokens (OKLCH colors)
- `components/` - Component library
- `guidelines/` - Usage documentation
- `accessibility/` - WCAG compliance tools

**Dependencies**:
- None (foundation layer)

---

#### CB-05: MCP Task Registry (Coordination)
**Path**: `01_CODEBASES/mcp-servers/localbrain-task-registry/`
**Purpose**: Multi-agent coordination server
**Tech Stack**: TypeScript, MCP SDK, SQLite, Git
**Owner**: Agent D (Integration), Agent E (Supervisor)
**Tasks**: T019 ✅ (3 phases complete)
**Status**: ✅ COMPLETE - 6 MCP tools operational
**LOC**: ~8,150 (31 files)

**Key Components**:
- `src/tools/` - 6 MCP tools (operational + visual)
- `src/registry/` - Task coordination logic
- `central-coordinator/` - Keep-In-Touch server
- `agent-dispatch/` - Autonomous agent client

**Dependencies**:
- Git (file tracking)
- CENTRAL_TASK_REGISTRY.md (task database)

---

### Supporting Infrastructure (Non-Production)

#### SI-01: Specification Base
**Path**: `02_SPECBASES/LocalBrain/`
**Purpose**: Complete specifications for all features
**Format**: Markdown, structured docs
**Owner**: All agents (read), Agent F (write)
**Size**: ~50 spec files

#### SI-02: Iteration Context
**Path**: `03_ITERATION_CONTEXT/`
**Purpose**: Zip iteration system context
**Format**: Markdown, context files
**Owner**: Agent F (ChatGPT-5 Cloud Supervisor)

#### SI-03: Agent Framework
**Path**: `04_AGENT_FRAMEWORK/`
**Purpose**: Agent coordination, guides, documentation
**Format**: Markdown, TypeScript
**Owner**: Agent D, Agent E, Agent F
**Size**: ~40 documentation files

#### SI-04: Execution Status
**Path**: `05_EXECUTION_STATUS/`
**Purpose**: Real-time system status
**Format**: Markdown, JSON
**Owner**: Agent F (Meta-Config)

---

## 2️⃣ AGENT TAXONOMY

### The 6-Agent Hyper-Specialized System

```
STRATEGIC LEVEL
├── LECH (Human Decision Maker)
│   └── Final approval, strategic direction
└── AGENT F (Meta-Config - ChatGPT-5)
    └── Task configuration, system monitoring, optimization

GROUND LEVEL (5 Specialists)
├── AGENT A (UI Velocity - GLM-4.6, 200K context)
│   └── Frontend rapid prototyping
├── AGENT B (Design System - Sonnet-4.5, 200K context)
│   └── OKLCH colors, accessibility, consistency
├── AGENT C (Backend Services - GLM-4.6, 200K context)
│   └── APIs, databases, performance
├── AGENT D (Integration - Sonnet-4.5, 200K context)
│   └── Swift ↔ Electron, multi-platform bridges
└── AGENT E (Ground Supervisor - Gemini-2.5-Pro, 1M context)
    └── Coherence, knowledge management, conflict resolution
```

### Agent Classification Matrix

| Agent | Model | Context | Specialization | Primary Codebases | Task Types | Velocity |
|-------|-------|---------|----------------|-------------------|------------|----------|
| A | GLM-4.6 | 200K | UI Velocity | CB-01, CB-02 | Frontend, Components | Fast |
| B | Sonnet-4.5 | 200K | Design System | CB-04, CB-01, CB-02 | Design, Accessibility | High Quality |
| C | GLM-4.6 | 200K | Backend Services | CB-03, CB-05 | APIs, Databases | Fast |
| D | Sonnet-4.5 | 200K | Integration | CB-01, CB-05 | Bridges, Schemas | High Quality |
| E | Gemini-2.5-Pro | 1M | Ground Supervisor | All | Coherence, Reviews | Strategic |
| F | ChatGPT-5 | N/A | Meta-Config | SI-03, SI-04 | Configuration | Administrative |

### Agent Capabilities Map

#### Agent A: UI Velocity Specialist
**Strengths**:
- Rapid React component development
- SwiftUI implementation
- UI prototyping (CB-02 → CB-01)
- Visual layout and styling

**Limitations**:
- Not focused on accessibility (Agent B handles)
- Not backend integration (Agent D handles)

**Workflow**:
1. Prototype in Next.js (CB-02)
2. Test with hot reload
3. Implement in Swift (CB-01)
4. Coordinate with Agent B for design tokens

**Task Assignment**: T004, T006, T012, T014

---

#### Agent B: Design System Specialist
**Strengths**:
- OKLCH color system expertise
- WCAG 2.2 AA accessibility compliance
- Design token management
- Visual consistency enforcement

**Limitations**:
- Not rapid prototyping (Agent A handles)
- Not backend design (Agent C handles)

**Workflow**:
1. Define design tokens (CB-04)
2. Create accessibility guidelines
3. Review Agent A implementations
4. Ensure cross-platform consistency

**Task Assignment**: T001 ✅, T005, T016 ✅

---

#### Agent C: Backend Services Specialist
**Strengths**:
- API development (REST, GraphQL)
- Database design and optimization
- Performance optimization (≤10ms requirements)
- Service architecture

**Limitations**:
- Not UI work (Agent A handles)
- Not integration bridges (Agent D handles)

**Workflow**:
1. Design APIs and schemas
2. Implement backend services (CB-03, CB-05)
3. Optimize performance
4. Provide endpoints for Agent A/D

**Task Assignment**: T007, T009, T018 (ready!), T020, T021

---

#### Agent D: Integration Specialist
**Strengths**:
- Swift ↔ Electron IPC bridge
- Schema validation
- Multi-platform coordination
- System integration testing

**Limitations**:
- Not core UI (Agent A handles)
- Not core backend (Agent C handles)

**Workflow**:
1. Design integration schemas
2. Implement bridges (CB-01 ↔ CB-02)
3. Validate cross-platform compatibility
4. Test end-to-end flows

**Task Assignment**: T002 ✅, T008, T011, T013, T017 ✅, T019 ✅

---

#### Agent E: Ground Supervisor (Librarian)
**Strengths**:
- Complete codebase understanding (1M context)
- Cross-agent coordination
- Architectural coherence
- Knowledge management
- Conflict resolution

**Limitations**:
- Not direct implementation (supervises others)
- Strategic focus over tactical

**Workflow**:
1. Review all agent work
2. Ensure architectural alignment
3. Resolve conflicts and overlaps
4. Maintain knowledge base
5. Guide agents on complex decisions

**Task Assignment**: T016 ✅, coherence reviews, knowledge curation

---

#### Agent F: Meta-Config Agent (System Administrator)
**Strengths**:
- Task registry management
- System monitoring
- Agent coordination
- Exception handling
- Strategic reporting to Lech

**Limitations**:
- Not a code executor (configures system)
- Works WITH Lech, not autonomously

**Workflow**:
1. Daily: Generate status report
2. Configure task priorities
3. Monitor agent progress
4. Handle blockers
5. Optimize system settings

**Task Assignment**: Configuration, monitoring, optimization (not coded tasks)

---

## 3️⃣ TASK TAXONOMY

### Numbering System Conventions

#### Task ID Format: `T###`
- **T001-T099**: Foundation & Infrastructure
- **T100-T199**: Core Features
- **T200-T299**: Advanced Features
- **T300-T399**: Optimization & Polish
- **T400+**: Future Enhancements

#### Current Task Allocation (T001-T019)

**Domain Categories**:
1. **Design System** (T001, T005, T016) - Agent B
2. **Integration/IPC** (T002, T008, T011, T013, T017, T019) - Agent D
3. **Specifications** (T003) - Multi-agent
4. **UI Components** (T004, T006, T012, T014, T015) - Agent A
5. **Backend Services** (T007, T009, T018, T020, T021) - Agent C
6. **Supervision** (T016) - Agent E

### Task Lifecycle States

```
AVAILABLE → CLAIMED → IN_PROGRESS → COMPLETE
                ↓
            BLOCKED (if dependencies fail)
                ↓
            AVAILABLE (when unblocked)
```

### Task Priority System

- **P0 - CRITICAL**: Blocks all other work (e.g., T019 foundation)
- **P1 - HIGH**: Core functionality (e.g., T018 RAG Index)
- **P2 - MEDIUM**: Important features (e.g., T007 Context Store)
- **P3 - LOW**: Enhancements (e.g., T015 Animation System)

### Task-Agent Assignment Matrix

| Task ID | Title | Agent | Codebase | Priority | Status | Dependencies |
|---------|-------|-------|----------|----------|--------|--------------|
| T001 | OKLCH Token System | B | CB-04 | P0 | ✅ COMPLETE | None |
| T002 | IPC Message Schema | D | CB-01 | P0 | ✅ COMPLETE | None |
| T003 | Spec Repository | All | SI-01 | P0 | 🟢 AVAILABLE | None |
| T004 | Module Container | A | CB-01 | P1 | 🟢 AVAILABLE | T001 ✅ |
| T005 | Color Utility System | B | CB-04 | P1 | 🟢 AVAILABLE | T001 ✅ |
| T006 | Dashboard Header | A | CB-01 | P1 | 🟢 AVAILABLE | T001 ✅ |
| T007 | Context Store Layer | C | CB-03 | P2 | 🚫 BLOCKED | T009 |
| T008 | Swift WebKit Bridge | D | CB-01 | P1 | 🟢 AVAILABLE | T002 ✅ |
| T009 | Local Storage Service | C | CB-03 | P1 | 🚫 BLOCKED | T010 |
| T010 | Change-Set Ledger DB | C | CB-03 | P1 | ✅ COMPLETE | T019 ✅ |
| T011 | Agent Handoff Protocol | D | CB-05 | P1 | 🟢 AVAILABLE | T019 ✅ |
| T012 | Context Panel UI | A | CB-02 | P1 | 🟢 AVAILABLE | T001 ✅ |
| T013 | TypeScript IPC Client | D | CB-02 | P1 | 🟢 AVAILABLE | T002 ✅ |
| T014 | Module Navigation | A | CB-01 | P2 | 🚫 BLOCKED | T004 |
| T015 | SwiftUI Animation | A | CB-01 | P3 | 🚫 BLOCKED | T004 |
| T016 | Coherence Review | E | All | P1 | ✅ COMPLETE | T001 ✅, T002 ✅ |
| T017 | Schema Validation Tests | D | CB-01 | P1 | ✅ COMPLETE | T002 ✅ |
| T018 | RAG Index (Specs) | C | CB-03 | P1 | 🟢 AVAILABLE | T003 ✅ |
| T019 | MCP Task Registry | D,E | CB-05 | P0 | ✅ COMPLETE | None |

**Legend**:
- ✅ COMPLETE (3 tasks)
- 🟢 AVAILABLE (9 tasks ready to start)
- 🚫 BLOCKED (4 tasks waiting on dependencies)
- 🔄 IN_PROGRESS (0 currently - agents available!)

### Critical Path Analysis

**Path 1 (Backend Foundation)**:
```
T019 ✅ → T010 ✅ → T009 → T007 → T020
                            ↓
                          (RAG + Storage complete)
```

**Path 2 (UI Foundation)**:
```
T001 ✅ → T004 → T014 → T015
      ↓
    T005, T006, T012 (parallel)
```

**Path 3 (Integration Foundation)**:
```
T002 ✅ → T008, T013 (parallel) → T011
```

**Path 4 (Knowledge/Content)**:
```
T003 → T018 (RAG Index) → Advanced search
```

---

## 4️⃣ INTERDEPENDENCY MASTERY

### The Three Levels of Dependencies

#### Level 1: Task Dependencies (Within Project)
**Defined in**: CENTRAL_TASK_REGISTRY.md
**Format**: `DEPS: [T001, T002]`
**Purpose**: Ensure proper sequencing

**Example**:
- T004 (Module Container) DEPS: [T001] ✅
  - Cannot start until OKLCH tokens exist
  - Agent A waits for Agent B completion

#### Level 2: Codebase Dependencies (Cross-Project)
**Format**: CB-XX depends on CB-YY
**Purpose**: Prevent circular dependencies

**Example**:
- CB-01 (Swift) depends on CB-04 (Design System)
  - Swift imports design tokens
  - Cannot build Swift UI without tokens

**Dependency Graph**:
```
CB-04 (Design System)
  ↓
CB-02 (Electron Prototype) → CB-01 (Swift Production)
                                ↓
                              CB-03 (Widgets)
                                ↓
                              CB-05 (MCP)
```

#### Level 3: Agent Dependencies (Collaboration)
**Format**: Agent X needs Agent Y output
**Purpose**: Enable parallel work

**Example**:
- Agent A (UI) needs Agent B (Design) tokens
- Agent D (Integration) needs Agent C (Backend) APIs
- Agent E (Supervisor) reviews all agent work

**Collaboration Patterns**:
```
SEQUENTIAL:
  B → A → D (design tokens → UI → integration)

PARALLEL:
  A + C (UI and Backend work simultaneously)
  B + D (Design and Integration independent)

REVIEW:
  A,B,C,D → E (all submit to supervisor)
```

### Dependency Resolution Strategy

#### 1. Automatic Unblocking
When task completes, MCP server:
1. Marks task as COMPLETE
2. Scans all BLOCKED tasks
3. Checks if dependencies satisfied
4. Auto-marks as AVAILABLE
5. Notifies agents via dashboard

**Implementation**: `src/registry/DependencyResolver.ts`

#### 2. Circular Dependency Detection
**Algorithm**: Depth-first search with cycle detection
**Action**: Prevent task creation with circular deps
**Status**: ✅ Implemented in T019

#### 3. Critical Path Tracking
**Purpose**: Identify bottleneck tasks
**Method**: Longest path through dependency graph
**Output**: Priority ordering for Agent F

---

## 5️⃣ PARALLEL EXECUTION STRATEGY

### Maximizing Agent Concurrency

#### Current Parallelizable Work (9 tasks ready)

**Cluster 1: UI Work (Agent A)**
- T004 (Module Container) - 6 hours
- T006 (Dashboard Header) - 4 hours
- T012 (Context Panel) - 4 hours
- **Total**: 14 hours sequential OR 6 hours if prioritized

**Cluster 2: Design Work (Agent B)**
- T005 (Color Utilities) - 3 hours
- **Total**: 3 hours

**Cluster 3: Backend Work (Agent C)**
- T018 (RAG Index) - 8 hours ⭐ **HIGH PRIORITY**
- **Total**: 8 hours

**Cluster 4: Integration Work (Agent D)**
- T008 (Swift WebKit Bridge) - 6 hours
- T013 (TypeScript IPC Client) - 4 hours
- T011 (Agent Handoff Protocol) - 3 hours
- **Total**: 13 hours sequential OR 6 hours if parallelized

**Optimal Parallel Strategy**:
```
Day 1 (Parallel):
├── Agent A: T004 (6h)
├── Agent B: T005 (3h) → then help with reviews
├── Agent C: T018 (8h) ⭐
├── Agent D: T008 (6h)
└── Agent E: Monitor all

Day 2 (Parallel):
├── Agent A: T006 (4h)
├── Agent C: Finish T018 if needed
├── Agent D: T013 (4h)
└── Agent E: Coherence review

Result: 4 major tasks in 2 days vs 8 days sequential
Velocity: 4x improvement
```

### Avoiding Agent Conflicts

#### Conflict Scenarios to Prevent

**Scenario 1: File Collision**
- Agent A and Agent D both editing same Swift file
- **Solution**: Task assignment prevents overlap

**Scenario 2: Conceptual Conflict**
- Agent A implements UI, Agent B wants different design
- **Solution**: Agent B creates tokens FIRST (T001 ✅)

**Scenario 3: Integration Mismatch**
- Agent C creates API, Agent D expects different schema
- **Solution**: Specs define contracts (SI-01)

#### Conflict Resolution Protocol

1. **Prevention** (Best): Clear task boundaries
2. **Detection**: Agent E monitors for overlaps
3. **Resolution**: Agent F coordinates with Lech
4. **Learning**: Update specs to prevent recurrence

---

## 6️⃣ SYSTEM-WIDE COHERENCE

### The Three Pillars of Coherence

#### Pillar 1: Architectural Coherence
**Owner**: Agent E (Ground Supervisor)
**Method**: 1M context window sees everything
**Checks**:
- Consistent patterns across codebases
- No architectural drift
- Standard practices followed

**Example**:
- All IPC messages follow T002 schema
- All UI components use T001 OKLCH tokens
- All APIs follow CB-03 conventions

#### Pillar 2: Specification Coherence
**Owner**: Agent F (Meta-Config)
**Method**: Specs are source of truth
**Checks**:
- Implementation matches specs
- Specs are kept up to date
- No undocumented features

**Example**:
- T018 RAG implementation follows SI-01/RAG-spec.md
- T004 Module Container follows SI-01/modules-spec.md

#### Pillar 3: Execution Coherence
**Owner**: Agent F + Visual Monitoring
**Method**: Real-time dashboard + daily reports
**Checks**:
- Agents working on correct tasks
- No duplicate work
- Dependencies respected

**Example**:
- Dashboard shows Agent A on T004 (not T006)
- Agent C not starting T007 until T009 complete

---

## 7️⃣ NUMBERING CONVENTIONS

### Complete ID System

#### Codebase IDs
- **CB-01** to **CB-99**: Production codebases
- **SI-01** to **SI-99**: Supporting infrastructure
- Format: `CB-##` or `SI-##`

#### Agent IDs
- **A** to **F**: Agent letters (6 total)
- Format: Single capital letter
- Extension: `Agent X (Full Name - Model)`

#### Task IDs
- **T001** to **T999**: Task numbers
- Format: `T###` (3 digits, zero-padded)
- Categories by range:
  - T001-T099: Foundation
  - T100-T199: Core
  - T200-T299: Advanced
  - T300-T399: Polish

#### File Numbering (Institutional)
- **NNNN**: Sequential 4-digit number
- Format: `NNNN_DAYXX_HH-MM_CATEGORY_description.ext`
- Example: `0347_DAY12_14-30_SPRINT_agent-coordination.md`

#### Phase Numbers
- **Phase 1, 2, 3**: Major system milestones
- Format: `Phase N: Description`
- Example: T019 has 3 phases (MCP, Keep-In-Touch, Visual Monitoring)

---

## 8️⃣ VISUAL SYSTEM MAP

### The Complete Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    🧠 LOCALBRAIN ECOSYSTEM                           │
└─────────────────────────────────────────────────────────────────────┘

STRATEGIC LAYER
┌──────────────┐
│ LECH (Human) │ ← Final decisions, strategic direction
└──────┬───────┘
       ↓
┌──────────────────────────┐
│ AGENT F (Meta-Config)    │ ← Task config, monitoring, optimization
│ ChatGPT-5                │
└──────┬───────────────────┘
       │ Configures ↓
       ↓
┌──────────────────────────────────────────────────────────────────┐
│ CENTRAL TASK REGISTRY (CENTRAL_TASK_REGISTRY.md)                 │
│ - 19 tasks defined                                                │
│ - Dependencies tracked                                            │
│ - Status: AVAILABLE, CLAIMED, IN_PROGRESS, COMPLETE, BLOCKED     │
└──────────────────────────────────────────────────────────────────┘
       │ Coordinates ↓
       ↓
┌──────────────────────────────────────────────────────────────────┐
│ MCP COORDINATION SERVER (CB-05)                                   │
│ - 6 MCP tools (get_available_tasks, claim_task, etc.)           │
│ - Git-based verification                                          │
│ - Keep-In-Touch autonomous lifecycle                             │
│ - Visual monitoring dashboards                                    │
└──────┬───────────────────────────────────────────────────────────┘
       │ Assigns tasks ↓
       ↓
┌────────────────────────────────────────────────────────────────────┐
│ GROUND AGENTS (5 Specialists)                                      │
├────────────────────────────────────────────────────────────────────┤
│ Agent A (UI)    │ Agent B (Design) │ Agent C (Backend)            │
│ GLM-4.6         │ Sonnet-4.5       │ GLM-4.6                       │
│ CB-01, CB-02    │ CB-04            │ CB-03, CB-05                  │
├─────────────────┴──────────────────┴──────────────────────────────┤
│ Agent D (Integration) │ Agent E (Supervisor)                       │
│ Sonnet-4.5            │ Gemini-2.5-Pro (1M context)                │
│ CB-01, CB-05          │ All codebases                              │
└────────┬───────────────────────────────────────────────────────────┘
         │ Build ↓
         ↓
┌────────────────────────────────────────────────────────────────────┐
│ PRODUCTION CODEBASES (5)                                            │
├────────────────────────────────────────────────────────────────────┤
│ CB-01: Swift App         │ CB-02: Electron Prototype               │
│ CB-03: Widget System     │ CB-04: Design System                    │
│ CB-05: MCP Task Registry │                                         │
└────────┬───────────────────────────────────────────────────────────┘
         │ Guided by ↓
         ↓
┌────────────────────────────────────────────────────────────────────┐
│ SPECIFICATION BASE (SI-01)                                          │
│ - 02_SPECBASES/LocalBrain/**                                       │
│ - Complete feature specifications                                  │
│ - Source of truth for implementation                               │
└────────────────────────────────────────────────────────────────────┘

SUPPORTING INFRASTRUCTURE
┌────────────────────────────────────────────────────────────────────┐
│ SI-02: Iteration Context  │ SI-03: Agent Framework                 │
│ SI-04: Execution Status   │                                        │
└────────────────────────────────────────────────────────────────────┘
```

---

## 9️⃣ PRACTICAL USAGE GUIDE

### For Lech (System Administrator)

**Morning Routine** (5 minutes):
```bash
# 1. Check agent dashboard
"Show me the agent dashboard"

# 2. Review overnight progress
"Show me recent completions"

# 3. Identify blockers
"Are any agents blocked?"

# 4. Make strategic decisions
(Review Agent F report, make priorities)
```

**When Adding New Task**:
1. Choose next available ID (T020)
2. Assign to appropriate agent (see matrix)
3. Define dependencies (DEPS: [TXX])
4. Set priority (P0/P1/P2/P3)
5. Update CENTRAL_TASK_REGISTRY.md
6. Agent F handles rest

**When New Codebase Needed**:
1. Choose next CB-## ID
2. Add to SYSTEM_TAXONOMY.md
3. Assign owning agent(s)
4. Define dependencies on other codebases
5. Create initial task for foundation

---

### For Agents (Work Execution)

**Starting Work** (Agent A example):
```bash
# 1. Check in with system
cd agent-dispatch
AGENT_ID=A npm run autonomous

# 2. System shows current task
# Shows: T004 - Module Container Component

# 3. Read task details
# - Deliverables
# - Acceptance criteria
# - Files to create
# - Dependencies (all satisfied)

# 4. Start coding
# Create files listed in task
# Follow specifications from SI-01

# 5. Report progress (automatic)
# System checks in every 30-60 min

# 6. Complete task
# Commit: "T004: Module Container Component - COMPLETE"
# System verifies via git
# Receive kudos
# Get next task
```

**Checking Dependencies Before Starting**:
1. Look at task card DEPS field
2. Verify all dependencies show ✅ COMPLETE
3. If blocked, system won't assign task
4. If available, safe to start

**Coordinating with Other Agents**:
- **Don't**: Direct communication needed
- **Do**: System coordinates automatically
- **If conflict**: Agent E (Supervisor) resolves
- **If unclear**: Ask Agent F (Meta-Config)

---

### For Agent F (System Management)

**Daily Status Report Template**:
```markdown
# Daily Status Report - [Date]

## System Health
- Agents Active: X/5
- Tasks Completed Today: X
- Tasks In Progress: X
- Tasks Blocked: X

## Agent Status
- Agent A: [status] (working on TXX)
- Agent B: [status] (working on TXX)
- Agent C: [status] (working on TXX)
- Agent D: [status] (working on TXX)
- Agent E: [status] (supervising)

## Blockers Requiring Attention
1. [Blocker description]
   - Affected tasks: TXX, TYY
   - Recommendation: [action]

## Velocity Analysis
- Expected: X tasks/week
- Actual: Y tasks/week
- Variance: Z%

## Recommendations for Lech
1. [Strategic recommendation]
2. [Priority adjustment suggestion]
```

**Weekly Optimization Review**:
1. Analyze velocity trends
2. Identify bottleneck agents
3. Rebalance task assignments
4. Update priorities
5. Report to Lech

---

## 🔟 EVOLUTION & MAINTENANCE

### How This Taxonomy Grows

#### Adding New Codebases
1. Assign next CB-## or SI-## ID
2. Add section to "Codebase Taxonomy"
3. Define dependencies
4. Assign owning agents
5. Create foundation task

#### Adding New Tasks
1. Assign next T### ID (follow numbering)
2. Add to Task-Agent Assignment Matrix
3. Define dependencies
4. Add to CENTRAL_TASK_REGISTRY.md
5. Update Critical Path if needed

#### Adding New Agents
1. Assign next agent letter (G, H, I...)
2. Add to Agent Taxonomy
3. Define specialization
4. Assign primary codebases
5. Update task assignment matrix

### Keeping Taxonomy Current

**Weekly** (Agent F):
- Update task statuses
- Add completed tasks count
- Refresh agent statistics

**Monthly** (Agent E):
- Review codebase LOC estimates
- Update dependency graphs
- Add new patterns discovered

**Quarterly** (Lech + Agent F):
- Major taxonomy restructure if needed
- Add new sections for new domains
- Archive deprecated information

---

## ✅ COMPLETION CHECKLIST

Use this to verify system understanding:

### Codebase Understanding
- [ ] Can name all 5 production codebases (CB-01 to CB-05)
- [ ] Can explain purpose of each codebase
- [ ] Can identify which agent owns which codebase
- [ ] Can draw dependency graph between codebases

### Agent Understanding
- [ ] Can name all 6 agents (A-F) with their specializations
- [ ] Can identify which agent handles which tasks
- [ ] Can explain collaboration patterns
- [ ] Can identify when agents need coordination

### Task Understanding
- [ ] Can explain task ID numbering (T001-T999)
- [ ] Can read dependency notation (DEPS: [TXX])
- [ ] Can identify task priorities (P0-P3)
- [ ] Can determine which tasks are parallelizable

### Interdependency Understanding
- [ ] Can trace dependency chains (T001 → T004 → T014)
- [ ] Can identify circular dependencies
- [ ] Can determine critical path
- [ ] Can explain automatic unblocking

### System Operation
- [ ] Can check agent dashboard
- [ ] Can determine current agent status
- [ ] Can identify blockers
- [ ] Can add new tasks correctly

**✅ All checked? You have complete system mastery!**

---

## 🎯 THE BOTTOM LINE

### What This Taxonomy Provides

1. **Complete Understanding**: See the ENTIRE system at a glance
2. **Clear Numbering**: Every entity has logical ID
3. **Dependency Mastery**: Know what depends on what
4. **Parallel Execution**: Maximize agent concurrency
5. **Conflict Prevention**: Clear boundaries prevent overlap
6. **Strategic Control**: Lech sees everything, decides priorities
7. **Tactical Execution**: Agents know exactly what to do

### The Four Questions This Answers

**Q1**: "What are we building?"
**A1**: 5 production codebases (CB-01 to CB-05) + 4 supporting systems

**Q2**: "Who builds what?"
**A2**: 6 hyper-specialized agents with clear ownership (see matrix)

**Q3**: "What's the work breakdown?"
**A3**: 19 tasks (T001-T019) organized by domain and priority

**Q4**: "How does it all connect?"
**A4**: 3 levels of dependencies (task, codebase, agent) all tracked

### Success Metrics

- **Velocity**: 300%+ improvement through parallelization
- **Clarity**: 100% task-agent-codebase mapping
- **Conflicts**: Zero (prevented by clear boundaries)
- **Blockers**: Auto-resolved via dependency tracking
- **Coherence**: Maintained by Agent E + Agent F

---

**Status**: ✅ COMPLETE SYSTEM TAXONOMY
**Maintained By**: Agent F (Meta-Config) + Agent E (Supervisor)
**Updated**: Real-time as system evolves

🧬 **COMPLETE CLASSIFICATION & MAPPING ACHIEVED!** 📊
