---
spec_id: AGENT_BRIDGE
title: Agent Bridge (LocalBrain ↔ UV Operators)
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
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Prototype notes and golden flows attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.agent.bridge
  metrics_prefix: uv.agent.bridge
risks:
  - id: R-AGENT_BRIDGE-1
    desc: Agent actions that surprise the user or violate policy
    mitigation: Dry-run, explicit confirmations, capability grants, undo-first policy
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Let LocalBrain (voice/LLM) plan and execute actions deterministically using typed intents
mapped to Operators, Panels, and Layer API. No direct DOM control.

## Architecture
- Intent Ingress: voice/ASR → NLU → intent candidates (with confidence & slots).
- Planner: LLM proposes a Plan JSON (sequence/graph of typed actions) referencing cataloged tools (Operators).
- Validator: checks permissions, schemas, invariants; produces a dry-run diff.
- Executor: dispatches to Operators; each step undoable; emits events.
- Audit: logs all intents, plans, dry-runs, decisions.

## Events
- `uv.agent.intent`, `uv.agent.plan`, `uv.agent.dryrun`, `uv.agent.execute`, `uv.agent.undo`, `uv.agent.deny`.

## Contracts
- No hidden code execution; only tool catalog actions with JSON schemas.
- Undo-first: every stateful action must have an invertible patch; destructive ops require explicit confirmation.

## Acceptance
- Voice-to-plan with dry-run preview; execution gated by Permissions; logs reflect each stage.

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
