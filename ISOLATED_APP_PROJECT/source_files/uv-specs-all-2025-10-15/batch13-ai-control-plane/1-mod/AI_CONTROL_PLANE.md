---
spec_id: AI_CONTROL_PLANE
title: AI Control Plane (Planner, Executor, Observer)
version: 0.1.0
owner: Leo
status: draft
batch: 13
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Security model, scopes, and prompts validated"
  i3:
    - "Golden plans and audit examples attached; schema validators"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.ai.control.plane
  metrics_prefix: uv.ai.control.plane
risks:
  - id: R-AI_CONTROL_PLANE-1
    desc: "Over-broad AI control or misinterpretation of UI state"
    mitigation: "Role-scoped sessions, dry-run previews, explain/confirm gates, audit"
---

## Purpose
Bridge natural-language intents to deterministic Operators and UI control actions with
**preview/commit** semantics, scopes, and audit trails.

## Components
- **Interpreter** (LLM) → produces `UVIntent[]` (typed).
- **Planner** → validates, binds IDs, downscopes to role, compiles a **Plan** (sequence/DAG).
- **Executor** → runs Operators or invokes **UCC** actions; supports **dry-run** diffs and commit.
- **Observer** → summarizes state/events for LLM; redacted; rate-limited.
- **Session** → ephemeral token with role, scopes, expiry; maps to **AI User** principal.

## Plan
```ts
type Plan = { id: CID; steps: Step[]; createdAt: number; role: Role; preview: DiffSummary[] };
type Step = OpStep | ControlStep;
type OpStep = { kind:"op", id:string, params:any };
type ControlStep = { kind:"control", controlId:string, action:string, params:any };
```
- Each Plan is **signed** (ed25519) with app key; replayable for audit.

## Flow
1. Interpreter emits intents → Planner binds & compiles Plan.
2. Executor **dry-runs** steps to compute **diff** (UCC supports simulate).
3. HUD shows **Preview / Do / Explain**.
4. On commit, Operators mutate state; undo/redo integrated.

## Observability
- `uv.ai.intent`, `uv.ai.plan.start|end`, `uv.ai.preview|commit`, `uv.ai.denied`.

## Acceptance
- Multi-step plans execute deterministically; undo reverts; audit reproduces.
