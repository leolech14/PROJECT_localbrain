---
title: "Context Selector – Token-Budget Aware RAG"
module_id: "Context Selector"
type: "module"
category: "actor"
swift_actor: "ContextSelector"
swift_file: "LocalBrain/Services/ContextSelector.swift"
spec_probe_events: ["context.rank", "context.pack", "context.budget"]
lifecycle: "dev"
state: "minimal"
seat: "mvp"
phase_availability: "always"
priority: "critical"
xcode_target: "LocalBrain"
observability:
  spec_events: ["context.rank", "context.pack", "context.budget"]
  metrics_captured: ["duration_ms","success_count","error_count"]
  spec_validation: ["SPEC/features/ContextSelector.spec.md"]
security:
  keychain_required: false
  sandbox_permissions: []
  api_key_access: []
  user_data_access: false
  network_access: false
  file_system_access: "read"
dependencies: []
integrations: []
swift_protocols: []
last_updated: "2025-10-05"
version: "0.1.0"
maintainer: "LocalBrain Team"
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: true
  requires_approval: false
agent_boundaries:
  allowed_operations: ["read_state","query_data"]
  forbidden_operations: ["modify_state","bypass_security"]
  escalation_triggers: ["error_rate_high","performance_degraded"]
---

## Purpose

The module provides its capability as part of the Central Intelligence system. It accepts structured inputs, executes its internal logic, and emits SpecProbe events so executable specs can validate runtime behavior.

**Out of scope:**
- Business logic outside this module
- UI responsibilities
- Direct persistence concerns (handled by Data Pool)

## Primary Features
- **Capability 1:** Deterministic public API (async/await)
- **Capability 2:** Emits SpecProbe events for observability
- **Capability 3:** Error handling & cancellation
- **Capability 4:** Metrics (duration_ms, error_count)
- **Capability 5:** Unit tests & executable spec coverage

## Architecture

```mermaid
graph TD
  A[Input] --> B[Core Actor]
  B --> C[Dependencies]
  B --> D[SpecProbe]
  C --> E[Outputs]
```

**Swift Patterns:**
- Actor isolation on state
- Structured concurrency with cancellation
- Non-blocking IO

## Contracts

```swift
// Actor
actor ModuleActor {
    struct Input { let payload: String }
    struct Output { let result: String }

    func execute(_ input: Input) async throws -> Output {
        // Emit start
        await SpecProbe.shared.emit("module.operation.start", ["payload": .string(input.payload)])
        // ... perform work ...
        await SpecProbe.shared.emit("module.operation.success", ["result": .string("ok")])
        return Output(result: "ok")
    }
}
```

## State Progression & Promotion Gates
- Minimal → I1 → I2 → I3 → Complete (see template)

## Production Implementation
- Build: `xcodebuild -scheme LocalBrain -configuration Release`
- Test:  `xcodebuild test -scheme LocalBrainTests`

## Testing Strategy
- Executable spec in `SPEC/features/*.spec.md` asserts required events
