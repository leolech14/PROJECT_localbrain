# Agent Coordination Framework

## 🎯 Agent Architecture Overview

### Final Agent Configuration (ChatGPT-5 Defined)
- **Agent A — GLM‑4.6**: Terminal & Code Edits (Ground Agent)
- **Agent B — Sonnet 4.5**: Specs/UX/Test Plans (Ground Agent)
- **Agent C — Gemini 2.5 Pro**: Long‑Context Librarian & RAG (Ground Supervisor)
- **Supervisor — ChatGPT‑5**: Router + Policy Gatekeeper + HITL (Cloud Supervisor)

## 🔄 Parallel Execution Model

### Agent A & B Parallel Workflow
```
🤖 Agent A (GLM-4.6)                    🎨 Agent B (Sonnet 4.5)
├── Code Implementation                  ├── Specification Writing
├── Terminal Operations                  ├── UX Design System
├── File Management                      ├── Test Plan Creation
├── Technical Solutions                  ├── Component Documentation
└── System Integration                   └── Design Maintenance

🔄 Working in Parallel on Different Aspects 🔄
                ↓
        📚 Agent C (Gemini 2.5 Pro) - Local Oversight
                ↓
        ☁️ ChatGPT-5 - Strategic Supervision
```

## 📋 Agent Responsibilities Matrix

### Agent A (GLM-4.6) - Technical Execution
**Domain**: Code, Terminal, System Integration

**Core Responsibilities**:
- ✅ Edit, create, and modify code files
- ✅ Execute terminal commands and system operations
- ✅ Manage directory structure and file organization
- ✅ Implement technical solutions and architecture
- ✅ Handle build processes and deployment
- ✅ Debug and troubleshoot technical issues
- ✅ Integrate APIs and third-party services

**Current Capabilities**:
- ✅ Full file system access (read/write/edit/delete)
- ✅ Terminal command execution
- ✅ Code compilation and building
- ✅ Package management and dependency handling
- ✅ Database operations and migrations
- ✅ API testing and integration

### Agent B (Sonnet 4.5) - Design & Specification
**Domain**: Specifications, UX/UI, Testing

**Core Responsibilities**:
- ✅ Write and edit specification documents
- ✅ Design and maintain UI/UX systems
- ✅ Create comprehensive test plans
- ✅ Document component behaviors and interactions
- ✅ Design user flows and interaction patterns
- ✅ Create accessibility compliance documentation
- ✅ Maintain design system consistency

**Current Capabilities**:
- ✅ Document creation and editing
- ✅ Design system development
- ✅ Component specification writing
- ✅ User story and acceptance criteria creation
- ✅ Test case design and documentation
- ✅ Accessibility guideline implementation

### Agent C (Gemini 2.5 Pro) - Local Supervision
**Domain**: 1M Context Analysis, Quality Assurance, RAG

**Core Responsibilities**:
- ✅ Comprehensive codebase analysis with 1M token context
- ✅ Cross-reference identification between components
- ✅ Quality assurance and validation oversight
- ✅ Knowledge organization and RAG system management
- ✅ Pattern recognition and inconsistency detection
- ✅ Local validation of agent work
- ✅ Librarian functions across entire project

**Current Capabilities**:
- ✅ 1M token context window for complete project awareness
- ✅ Large-scale code analysis and pattern detection
- ✅ Cross-document reference mapping
- ✅ Quality gate validation
- ✅ Knowledge base management
- ✅ Local file editing and creation

### ChatGPT-5 - Strategic Supervision
**Domain**: Strategy, Policy, Coordination, HITL

**Core Responsibilities**:
- ✅ Route tasks to appropriate ground agents
- ✅ Make policy decisions and validate technical choices
- ✅ Provide strategic project direction
- ✅ Coordinate parallel execution between agents
- ✅ Request human input for critical decisions (HITL)
- ✅ Define success criteria and validation metrics
- ✅ Maintain project alignment with business goals

**Access Pattern**:
- ✅ Curated context via compressed supervision directory
- ✅ Strategic oversight without direct file access
- ✅ Decision-making based on comprehensive context package
- ✅ Human-in-the-loop integration for critical choices

## 🚀 Task Assignment Protocol

### Parallel Task Assignment
```
1. ChatGPT-5 analyzes current status and needs
2. Defines parallel tasks for Agents A & B
3. Agent C provides local oversight with full context
4. Agents A & B execute in parallel on different aspects
5. Agent C validates work and identifies integration needs
6. ChatGPT-5 reviews results and assigns next tasks
```

### Task Type Classification
**Agent A Tasks** (Technical Implementation):
- Code writing and modification
- System configuration and setup
- API integration and database operations
- Build processes and deployment
- Technical debugging and troubleshooting

**Agent B Tasks** (Design & Specification):
- Specification document creation/editing
- UI/UX design system development
- Test plan creation and documentation
- User flow design and interaction patterns
- Accessibility and compliance documentation

**Agent C Tasks** (Oversight & Validation):
- Cross-reference analysis between A & B work
- Quality assurance and compliance checking
- Pattern detection and inconsistency identification
- Knowledge base organization and maintenance
- Integration point validation

**ChatGPT-5 Tasks** (Strategy & Coordination):
- Strategic project direction setting
- Task routing and agent coordination
- Policy decision making
- Critical choice escalation to human
- Success criteria definition and validation

## 🔄 Communication Protocol

### Agent Communication Flow
```
Ground Agents (A & B) → Agent C → ChatGPT-5 → Human (if needed)
        ↓                    ↓           ↓
   Progress Updates → Local Validation → Strategic Decisions
        ↓                    ↓           ↓
   Technical Issues → Quality Checks → Policy Guidance
        ↓                    ↓           ↓
   Completion Reports → Integration Review → HITL Requests
```

### Status Reporting
**Daily**: Agents A & B update task progress
**Continuous**: Agent C provides local oversight
**As Needed**: ChatGPT-5 makes strategic decisions
**Critical**: Human input requested for major decisions

### Escalation Triggers
**To Agent C**:
- Cross-component integration issues
- Quality or compliance concerns
- Pattern detection and analysis needed
- Local validation requirements

**To ChatGPT-5**:
- Strategic direction questions
- Policy and priority decisions
- Agent coordination conflicts
- Critical architectural choices

**To Human (Lech)**:
- Major business or product decisions
- Resource allocation priorities
- Timeline and scope adjustments
- Critical technical trade-offs

## 📊 Success Metrics

### Agent Performance Metrics
**Agent A (Technical)**:
- Code implementation quality and correctness
- Build success rate and deployment reliability
- Technical issue resolution time
- Integration and API functionality

**Agent B (Design)**:
- Specification completeness and clarity
- Design system consistency and usability
- Test plan coverage and effectiveness
- Documentation quality and accuracy

**Agent C (Oversight)**:
- Cross-reference accuracy and completeness
- Quality issue detection rate
- Pattern recognition effectiveness
- Integration validation success

**ChatGPT-5 (Strategy)**:
- Task assignment appropriateness and clarity
- Strategic decision quality and alignment
- Agent coordination effectiveness
- Project goal achievement rate

## 🎯 Current Task Assignment

### Immediate Priorities (This Week)
**Agent A (GLM-4.6)**:
1. Implement Agent Communication Panel (02_SIDEBAR.md spec)
2. Add Basic Security Model (authentication, permissions)
3. Complete Search Functionality (global search with suggestions)

**Agent B (Sonnet 4.5)**:
1. Refine UI Component Specifications (detailed component docs)
2. Complete Design System Documentation (consistent patterns)
3. Create Comprehensive Test Plans (coverage for implemented features)

**Agent C (Gemini 2.5 Pro)**:
1. Cross-reference Agent A & B work for integration points
2. Validate implementation against Orchestra Blue specifications
3. Maintain project knowledge base and context organization

**ChatGPT-5**:
1. Review current status and provide strategic direction
2. Validate task assignments and agent coordination approach
3. Make policy decisions on implementation priorities
4. Request human input on critical architectural choices

---

**This framework ensures clear separation of concerns while maintaining effective coordination between all agents.**