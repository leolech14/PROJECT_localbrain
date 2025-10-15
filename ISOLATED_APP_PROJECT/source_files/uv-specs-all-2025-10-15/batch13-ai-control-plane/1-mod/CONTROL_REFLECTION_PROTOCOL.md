---
spec_id: CONTROL_REFLECTION_PROTOCOL
title: Control Reflection Protocol (CRP)
version: 0.1.0
owner: Leo
status: draft
batch: 13
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Security model, scopes, and prompts validated
  i3:
    - Golden plans and audit examples attached; schema validators
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.control.reflection.protocol
  metrics_prefix: uv.control.reflection.protocol
risks:
  - id: R-CONTROL_REFLECTION_PROTOCOL-1
    desc: Over-broad AI control or misinterpretation of UI state
    mitigation: Role-scoped sessions, dry-run previews, explain/confirm gates, audit
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Enumerate and query controls exposed to AI; provide metadata, schemas, and safe actions.

## API
```ts
listControls(scope?:{widgetId?:string, panel?:string}) -> CCD[]
getControl(controlId) -> CCD
resolve(labelOrPath) -> controlId[]           // disambiguation returns list
subscribeControls(handler:(ev)=>void) -> Unsub
```
- Reflection is **read-only**; actions go through UCC.

## Performance
- Cache per widget version; incremental updates on panel changes; target ≤ 30 ms for `listControls` in common panels.

## Observability
- `uv.ai.control.reflect`, with counts and durations.

## Acceptance
- Querying the Style panel returns CCDs with correct schemas and constraints; resolve handles fuzzy matches with prompts when needed.

## 1. Purpose & Outcomes
TBD


## 2. Context & Dependencies
TBD


## 3. Public API (Types & Contracts)
TBD


## 4. Data & State Model
TBD


## 5. Algorithms & Control Flow
TBD


## 6. UI & Controls (UCC/CCD)
TBD


## 7. Observability (Events & Metrics)
TBD


## 8. Performance Budget & Fallbacks
TBD


## 9. Security, Privacy & Permissions
TBD


## 10. Acceptance Demos & Test Plan
TBD


## 11. Implementation Recipe (Ingredients & Steps)
TBD


## 12. Integration Checklist & Promotion Gates
TBD
