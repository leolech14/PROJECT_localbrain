# LocalBrain MODULE Universal Template

---
## ===== MODULE IDENTITY =====
title: "[Module Name] - [Brief Description]"
module_id: "[unique_identifier]"
type: "module"
category: "[actor|service|manager|engine|bridge]"

## ===== SWIFT IMPLEMENTATION =====
swift_actor: "[ActorName or ClassName]"
swift_file: "LocalBrain/[Path]/[FileName].swift"
spec_probe_events: ["event.namespace.*"]

## ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "dev"  # dev | qa | prod
state: "minimal"  # minimal | i1 | i2 | i3 | complete
seat: "mvp"       # prototype | mvp | scale

## ===== AVAILABILITY AND ACCESS =====
phase_availability: "[always|post_onboarding|unlockable|expert]"
priority: "[critical|high|medium|low]"
macos_entitlements: []  # e.g., ["com.apple.security.device.audio-input"]
xcode_target: "LocalBrain"  # app | tests | extension

## ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "Core actor/service implemented and tested"
    - "Event emission working via SpecProbe"
    - "Basic integration with Orchestrator"
  to_intermediate_i2:
    - "Reliability and error handling complete"
    - "Performance benchmarks met"
    - "Advanced features implemented"
  to_intermediate_i3:
    - "Integration breadth achieved"
    - "Advanced capabilities operational"
    - "Comprehensive spec coverage"
  to_complete:
    - "Production deployment validated"
    - "All features fully operational"
    - "Performance SLA met"

## ===== OBSERVABILITY =====
observability:
  spec_events:
    - "[module_name].operation.start"
    - "[module_name].operation.success"
    - "[module_name].operation.error"
  metrics_captured:
    - "duration_ms"
    - "success_count"
    - "error_count"
  spec_validation:
    - "LB-[MODULE]-XXX.spec.md"

## ===== SECURITY REQUIREMENTS =====
security:
  keychain_required: false
  sandbox_permissions: []
  api_key_access: []  # ["ANTHROPIC_API_KEY", "OPENAI_API_KEY"]
  user_data_access: false
  network_access: false
  file_system_access: "none"  # none | read | write | full

## ===== TECHNICAL METADATA =====
dependencies: []  # Other modules this depends on
integrations: []  # External systems (MCP, APIs)
swift_protocols: []  # Implemented protocols
last_updated: "YYYY-MM-DD"
version: "1.0.0"
maintainer: "LocalBrain Team"

## ===== AGENTIC INTEGRATION =====
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: true
  requires_approval: false

agent_boundaries:
  allowed_operations: ["read_state", "query_data"]
  forbidden_operations: ["modify_state", "bypass_security"]
  escalation_triggers: ["error_rate_high", "performance_degraded"]
---

# [Module Name] - [Brief Description]

## Purpose

**What this module solves and its clear boundaries.**

**Must contain:**
- Objective in 1-2 paragraphs explaining the "why" this module exists
- "Out of scope" in bullets (what this module does NOT do)

**Must NOT contain:**
- Implementation details (go in Architecture)
- Execution commands (go in Production Implementation)

---

## Primary Features

**Capability commitments - what this module delivers.**

**Must contain:**
- 5-10 bullets in format "**Feature Name:** Description (1-2 lines)"
- Each bullet is a measurable functional promise

**Format:**
```markdown
- **Feature Name:** Clear description of capability
- **Feature Name:** Clear description of capability
```

---

## Architecture

**Internal structure of the module and its flows.**

**Must contain:**
- Mermaid diagram showing internal components
- Bullets describing main components and architectural decisions
- Internal data flow

**Swift-specific:**
- Actor isolation boundaries
- Async/await patterns
- Main actor requirements

**Format:**
```markdown
[1 paragraph overview]

\`\`\`mermaid
graph TD
  A[Component] --> B[Component]
\`\`\`

**Components:**
- Component A (Actor): Description
- Component B (Service): Description

**Swift Patterns:**
- Actor isolation: [description]
- Concurrency model: [description]
```

---

## Contracts

**Formal I/O - Swift protocols, structs, events.**

**Must contain:**
- Swift protocol definitions
- Struct/enum types for DTOs
- SpecProbe event schemas

**Format:**
```swift
// Actor/Service Protocol
actor ModuleName {
    func operation(param: Type) async throws -> Result
}

// Input/Output Types
struct InputDTO {
    let field: Type
}

struct OutputDTO {
    let field: Type
}

// SpecProbe Events
// Event: "module.operation.start"
// Payload: { "id": .string, "params": .object }

// Event: "module.operation.success"
// Payload: { "id": .string, "result": .object, "duration_ms": .number }
```

---

## Sub-Components & Behavior

**Decomposition into smaller parts and behaviors.**

**Format:**
```markdown
### ComponentName (Actor/Class/Struct)

- **Purpose:** What it does
- **Behavior:** How it works
- **Swift Type:** Actor | Class | Struct | Enum
- **Concurrency:** MainActor | Sendable | isolated
- **Integration:** How it connects to parent module
```

---

## State Progression & Promotion Gates

**Module maturity: Minimal → I1 → I2 → I3 → Complete**

**Format:**
```markdown
### Current State: minimal

### Minimal State
**Definition:** Basic functionality that works end-to-end
**Requirements:**
- [ ] Core actor/service structure implemented
- [ ] Basic functionality operational
- [ ] SpecProbe events emitted
- [ ] Unit tests passing

### Intermediate I1 State
**Definition:** Reliable core with error handling
**Requirements:**
- [ ] Error handling comprehensive
- [ ] Integration with Orchestrator working
- [ ] Spec validation passing
- [ ] Performance baseline established

### Intermediate I2 State
**Definition:** Advanced features and optimization
**Requirements:**
- [ ] Advanced features implemented
- [ ] Performance optimized
- [ ] Comprehensive test coverage
- [ ] Documentation complete

### Intermediate I3 State
**Definition:** Production-ready with full integration
**Requirements:**
- [ ] Cross-module integration complete
- [ ] Edge cases handled
- [ ] Security audit passed
- [ ] Monitoring instrumented

### Complete State
**Definition:** Battle-tested production module
**Requirements:**
- [ ] Zero critical bugs
- [ ] SLA compliance verified
- [ ] Production telemetry validated
- [ ] Knowledge transfer complete

## Promotion Gates
- **Minimal→I1:** Core working + events emitting + tests passing
- **I1→I2:** Error handling + performance baseline + integration working
- **I2→I3:** Advanced features + comprehensive testing + security audit
- **I3→Complete:** Production deployment + SLA met + zero criticals
```

---

## Production Implementation

**How to build, run, and operate this module in production.**

**Must contain:**
- Xcode build steps
- Swift compiler requirements
- macOS version requirements
- Environment setup

**Format:**
```markdown
### Production-Ready Implementation

\`\`\`swift
// Implementation class/actor
actor ProductionModule: ModuleProtocol {
    func initialize() async throws {
        // Initialization logic
    }

    func execute(params: Params) async throws -> Result {
        // Main logic
        await SpecProbe.shared.emit("module.operation.start", ["id": .string(id)])
        defer {
            await SpecProbe.shared.emit("module.operation.end", ["id": .string(id)])
        }
        // ...
    }
}
\`\`\`

**Build Steps:**
1. Build: `xcodebuild -scheme LocalBrain -configuration Release`
2. Test: `xcodebuild test -scheme LocalBrainTests`
3. Archive: `xcodebuild archive -scheme LocalBrain -archivePath ./build/LocalBrain.xcarchive`

**Environment Requirements:**
- macOS: 14.0+
- Xcode: 15.0+
- Swift: 5.9+
- Entitlements: [list if any]
```

---

## Security & Compliance

**Security guarantees: AuthN, AuthZ, encryption, audit.**

**Format:**
```markdown
**Security Controls:**
- Keychain access: [yes/no] - [purpose]
- Sandbox permissions: [list]
- API key requirements: [list from Keychain]
- Data encryption: [at rest / in transit / none]
- Audit logging: [via SpecRecorder / none]

**macOS-Specific:**
- App Sandbox: [enabled/disabled]
- Hardened Runtime: [enabled/disabled]
- Notarization: [required/not required]
- Entitlements: [list]
```

---

## Testing Strategy

**Test approach and scenarios for this module.**

**Format:**
```markdown
**Test Scenarios:**

1. **Scenario Name:** Description
   - Given: Initial condition
   - When: Action performed
   - Then: Expected result
   - Spec: `LB-MODULE-XXX.spec.md`
   - Command: `xcodebuild test -scheme LocalBrainTests -only-testing:ModuleNameTests`

2. **Scenario Name:** Description
   [Same pattern]

**Spec Validation:**
- Spec file: `SPEC/features/LB-[MODULE]-XXX.spec.md`
- Required events: [list]
- Success criteria: [list]
```

---

## Success Criteria, Performance & Observability

**Measurable targets and telemetry.**

**Format:**
```markdown
| Metric | Target | Window | Source |
|--------|--------|--------|--------|
| Response Time | <100ms p95 | Per operation | SpecProbe duration_ms |
| Success Rate | >99% | 1 hour | SpecProbe events |
| Error Rate | <1% | 1 hour | SpecProbe error events |

**SLOs:**
- Latency: <100ms p95 for responsive UX
- Reliability: >99% success rate
- Availability: Module responds within 1s on cold start

**Observability:**
- SpecProbe events: [list]
- SpecRecorder logs: `LB_SPEC_COVERAGE_DIR/*.jsonl`
- Validation: Executable specs in `SPEC/features/`
```

---

## Agent Integration

**How autonomous agents interact with this module.**

**Format:**
```markdown
**Agent Capabilities:**
- Agents can read module state
- Agents can propose changes via Change-Set
- Agents can trigger operations (within policy limits)

**Agent Boundaries:**
- Cannot directly modify actor state
- Cannot bypass security policies
- Cannot access Keychain directly

**Approval Workflow:**
- Low-risk operations: Auto-approved (logged)
- Medium-risk: Require human approval
- High-risk: Blocked (system critical)
```

---

## Integrations & References

**Dependencies, data flows, and cross-references.**

**Format:**
```markdown
### Dependencies:
- **Core Infrastructure:** [[mod.ORCHESTRATOR]], [[mod.DATA_POOL]]
- **Swift Protocols:** [[ProtocolName]]

### Data Flows:
- **Receives Data From:** [[source_modules]]
- **Sends Data To:** [[destination_modules]]
- **Emits Events:** [[event.namespace.*]]

### Integration Points:
- **Orchestrated By:** [[mod.ORCHESTRATOR]]
- **Coordinates With:** [[peer_modules]]

### Implementation Order:
- **Build After:** [[dependencies]]
- **Build Before:** [[dependents]]

### See Also:
- **Architecture:** [[gov.SWIFT_ARCHITECTURE]]
- **Specs:** [[gov.SPEC_SYSTEM]]
- **Implementation:** [[gov.IMPLEMENTATION_ROADMAP]]
```

---

# 📋 MODULE UNIVERSAL TEMPLATE

**This template defines the UNIVERSAL TRUTH for all MODULE specification files in LocalBrain.**

**Use this as:**
- ✅ Template for creating new module specs
- ✅ Checklist for reviewing existing modules
- ✅ Standard for AI agents writing specifications
- ✅ Normative guide for consistency across all 1-mod/* files

**Total Standard Sections:** 12
**Required:** Purpose, Features, Contracts, State Progression, Production Implementation
**Swift-Specific:** Actor isolation, SpecProbe events, Xcode build steps

---

**This is the CANONICAL MODULE SPECIFICATION TEMPLATE for LocalBrain.** 📋✅
