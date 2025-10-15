---
spec_id: UV_INTENT_SCHEMA
title: UV Intent Schema (Function-Calling)
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
  events_namespace: uv.uv.intent.schema
  metrics_prefix: uv.uv.intent.schema
risks:
  - id: R-UV_INTENT_SCHEMA-1
    desc: Over-broad AI control or misinterpretation of UI state
    mitigation: Role-scoped sessions, dry-run previews, explain/confirm gates, audit
category: 3-cfg
flavor: reference
updated: '2025-10-15'
---

## Purpose
Provide a **typed schema** for LLM tool-calling that safely maps to Operators/UCC actions.

## Design
- JSON-Schema for each tool; explicit enums, numeric bounds, units.
- Ambiguity resolved via **clarifying questions** or CRP `resolve()`; otherwise **denied**.

## Core intents (non-exhaustive)
- `add_layer`, `style_layer`, `navigate`, `fit_to_layer`, `toggle_layer`, `query_table`, `create_chart`, `link_brush`, `set_param`, `run_operator`, `save_project`, `export_image`, `record_video`.

## Safety
- Default to **preview**; destructive intents require explicit `confirm:true` and reason.
- Rate limits per session.

## Observability
- `uv.ai.intent`, with parsed params and confidence (redacted where needed).

## Acceptance
- Schema validates; malformed intents rejected; planner compiles only if all IDs/params resolve.

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
