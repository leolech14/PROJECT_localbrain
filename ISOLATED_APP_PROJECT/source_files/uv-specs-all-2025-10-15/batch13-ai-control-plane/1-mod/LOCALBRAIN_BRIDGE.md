---
spec_id: LOCALBRAIN_BRIDGE
title: LocalBrain Bridge (Tooling & Sessions)
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
  events_namespace: uv.localbrain.bridge
  metrics_prefix: uv.localbrain.bridge
risks:
  - id: R-LOCALBRAIN_BRIDGE-1
    desc: Over-broad AI control or misinterpretation of UI state
    mitigation: Role-scoped sessions, dry-run previews, explain/confirm gates, audit
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Provide the boundary between the voice/chat app (LocalBrain) and UV, exposing **tools** (UV‑Intent),
**sessions** with roles/scopes, and **plan** compilation.

## Tools
- `add_layer`, `style_layer`, `navigate`, `toggle_layer`, `fit_to_layer`, `query_table`, `create_chart`, `link_brush`, `export_image`, ... (see UV_INTENT_SCHEMA).

## Sessions
```ts
openSession(role: Role, scopes: string[]): SessionToken
closeSession(token: SessionToken): void
```
- Role determines allowed Operators and UCC controls.

## Plans
```ts
compile(intents: UVIntent[], token: SessionToken): Plan
preview(plan: Plan): DiffSummary[]
commit(plan: Plan): CommitResult
explain(plan: Plan): string
```
- **Signed** with app key; audit events emitted with CID.

## Observability
- `uv.ai.session.open|close`, `uv.ai.tool.call`, `uv.ai.plan.*`.

## Acceptance
- A Lite role cannot delete layers or change providers; attempts are denied with clear reasons.

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
