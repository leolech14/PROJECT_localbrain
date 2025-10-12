# Claude Agent Instructions - LocalBrain + Orchestra Blue

## 🎯 Project Overview

**LocalBrain + Orchestra Blue** - Revolutionary AI-powered development environment implementing **spec-first development with UI prototyping refinement**.

## 🏗️ Architecture

**Core Applications:**
- **Swift App**: macOS production interface (`01_CODEBASES/LocalBrain/`)
- **Next.js Prototype**: UI laboratory with hot reload (`01_CODEBASES/localbrain-electron/`)
- **Widget System**: Extensible widget architecture (`01_CODEBASES/orchestra-widget-system/`)
- **Design System**: OKLCH color system + accessibility (`01_CODEBASES/design/`)
- **MCP Task Registry**: 6-agent coordination server (`01_CODEBASES/mcp-servers/localbrain-task-registry/`)

**Agent Coordination:**
- **Task Registry Server**: MCP-based coordination with Git verification + Real-time progress
- **Sniper Gun Server**: Cloud-hosted semantic HTML component analysis (24/7 online)
- **Client Wrappers**:
  - TaskRegistryClient for coordination (`04_AGENT_FRAMEWORK/mcp-integration/`)
  - SniperGunClient for code analysis (`04_AGENT_FRAMEWORK/mcp-integration/SniperGunClient.ts`)
- **Central Registry**: Official task list (`04_AGENT_FRAMEWORK/CENTRAL_TASK_REGISTRY.md`)
- **Architecture Docs**:
  - MCP System Architecture (`04_AGENT_FRAMEWORK/MCP_SYSTEM_ARCHITECTURE.md`)
  - Sniper Gun Integration (`04_AGENT_FRAMEWORK/mcp-integration/`)

## 📋 Current Status: 30% Compliance

**Critical Gaps:**
- ❌ Agent Communication Panel (P1-Critical) - No interface for agent coordination
- ❌ Security & Permissions (P1-Critical) - No authentication framework
- 🟡 Search Functionality (P2-High) - Users cannot find information
- 🟡 Module Navigation Logic (P2-High) - Navigation difficulties

## 🤖 6-Agent Hyper-Specialized System

### **Ground Agents (5 specialists with 200K-1M context):**

#### **Agent A & C - GLM-4.6 (200K context) - Worker Specialists**
- **Agent A**: UI Velocity Specialist
  - Frontend components, React/SwiftUI development
  - Rapid prototyping, interface implementation
  - Design system application
  - **Sniper Gun Integration**: Uses SniperGunClient for HTML component analysis (@html:form, @component:modal)

- **Agent C**: Backend Services Specialist
  - API development, database operations
  - Service architecture, data management
  - Infrastructure implementation
  - **Sniper Gun Integration**: Uses SniperGunClient for component extraction and refactoring

#### **Agent B & D - Sonnet-4.5 (200K context) - Integration Specialists**
- **Agent B**: Design System Specialist
  - OKLCH color system, accessibility (WCAG 2.2 AA)
  - Component library, visual consistency
  - UI/UX architecture
  - **Sniper Gun Integration**: Uses SniperGunClient for design impact analysis

- **Agent D**: Integration Specialist
  - Swift ↔ Electron IPC bridge
  - Multi-platform coordination
  - System integration & testing
  - **Sniper Gun Integration**: Uses SniperGunClient for semantic code analysis

#### **Agent E - Gemini-2.5-Pro (1M context) - Ground Supervisor/Librarian**
- **Role**: Coherence Specialist & Ground Supervisor
- **Responsibilities**:
  - Complete codebase understanding (1M context)
  - Cross-agent coordination & conflict resolution
  - Knowledge management & architectural coherence
  - General librarian tasks & context preservation
  - Ground-level supervision of 4 worker agents

### **Cloud Supervisor (Strategic oversight):**

#### **Agent F - ChatGPT-5 - Strategic Supervisor**
- **Role**: Cloud Supervisor & Instruction Provider
- **Responsibilities**:
  - Strategic guidance & roadmap planning
  - Instruction-set generation for each agent
  - Clear step-by-step task lists with success criteria
  - Definition of Done validation
  - Zip iteration system orchestration
  - High-level architectural decisions

### **Human Decision Maker:**
- **Lech**: HITL (Human-in-the-Loop) Decision Maker
  - Final approval authority
  - Strategic direction
  - Critical decision validation

### **Expected Velocity**: 300%+ increase through hyper-specialization

## 🚀 Development Workflow

### Spec-First Development with UI Prototyping:
```
Natural Language Requirements → Complete Spec Base → UI Prototype Refinement → Final Implementation
```

### Zip Iteration System:
```
1. Ground Agents work on LocalBrain directory
2. Compress entire repo → zip file
3. Upload zip to ChatGPT-5 (Cloud Supervisor)
4. ChatGPT-5 audits, provides instructions, edits
5. ChatGPT-5 returns SAME zip with edits applied
6. Extract zip → continue development
7. Repeat cycle (always maintaining full content)
```

**Key Principles:**
- ✅ **Full content preservation** - Never loses information
- ✅ **Convention respect** - Maintains directory structure
- ✅ **Edit tracking** - All changes documented
- ✅ **Iteration continuity** - Seamless cycle continuation
- ✅ **Fast compression** - Quick upload/download cycles

### Testing Environment:
- **Next.js Prototype**: `cd 01_CODEBASES/localbrain-electron && npm run dev`
- **Swift App**: Open `01_CODEBASES/LocalBrain/LocalBrain.xcodeproj`

## 📁 Directory Structure

```
LocalBrain/
├── 01_CODEBASES/          # Functional code
├── 02_SPECBASES/         # Complete specifications
├── 03_ITERATION_CONTEXT/ # Iteration context
├── 04_AGENT_FRAMEWORK/   # Agent coordination
└── 05_EXECUTION_STATUS/  # Real status
```

## 🎯 Agent Separation of Concerns

### **Clear Boundaries:**
- **GLM-4.6 (A+C)**: Worker tasks - UI & Backend implementation
- **Sonnet-4.5 (B+D)**: Specialist tasks - Design system & Integration
- **Gemini-2.5-Pro (E)**: Ground supervision - Coherence & Knowledge management (1M context)
- **ChatGPT-5 (F)**: Strategic supervision - Instructions & Validation

### **Your Role as Ground Agent:**
- **Follow instructions** from ChatGPT-5 (Cloud Supervisor)
- **Respect specialization** boundaries between agents
- **Coordinate with Agent E** (Ground Supervisor) for coherence
- **Document all work** for iteration tracking
- **Maintain full content** across all edits

## 🎯 Guidelines

### When Working on Code:
1. **Read Before Edit** - Understand existing patterns
2. **Follow Existing Architecture** - Maintain consistency
3. **Update Specifications** - Keep specs in sync with implementation
4. **Test Changes** - Ensure functionality
5. **Coordinate with other agents** - Respect separation of concerns

### When Working on UI:
1. **Use Next.js Prototype** - Test patterns before implementation
2. **Follow Design System** - Maintain visual consistency (Agent B territory)
3. **Validate in Swift** - Ensure patterns work in production
4. **Document Patterns** - Update specs with validated patterns

### When Using Sniper Gun (All Agents):
1. **Initialize Client** - `import { SniperGunClient } from './mcp-integration/SniperGunClient.js'`
2. **Health Check First** - `await sniperGun.healthCheck()` to verify server availability
3. **Scan Before Query** - `await sniperGun.scanComponents(scriptPath)` to index components
4. **Use Semantic Queries** - Examples: `@html:form`, `@component:modal`, `@method:_generate_*`
5. **Analyze Impact** - Always `await sniperGun.impactAnalysis()` before making changes
6. **Apply Surgical Edits** - Use precise line ranges for targeted modifications
7. **Extract When Needed** - Use `sniperGun.extractComponent()` for large component refactoring

**🎯 Agent-Specific Sniper Gun Usage:**
- **Agent A (UI)**: Find and update UI components with `@html:form AND @component:modal`
- **Agent B (Design)**: Analyze design impact with `sniperGun.impactAnalysis()`
- **Agent C (Backend)**: Extract complex components with `sniperGun.extractComponent()`
- **Agent D (Integration)**: Coordinate cross-component changes with semantic queries

### For Critical Decisions:
1. **Consult Specifications** - Check `02_SPECBASES/` for requirements
2. **Review Agent Framework** - Check `04_AGENT_FRAMEWORK/` for coordination
3. **Consider Iteration Context** - Check `03_ITERATION_CONTEXT/` for current priorities
4. **Await Cloud Supervisor guidance** - ChatGPT-5 provides strategic direction

## 🔒 Security Guidelines

- **Never hardcode API keys** - Use proper credential management
- **Follow design system** - Ensure accessibility compliance
- **Validate implementations** - Test against specifications
- **Document changes** - Update relevant documentation

---

**Focus on implementing according to specifications while maintaining the revolutionary spec-first development methodology.**