---
type: Spec
id: LB-015
title: "Kill‑Switch & Policy Refusal UX (ACP Integration)"
module: "Safety"
status: "Draft"
owners: ["Agent E (policy)", "Agent A (UI)"]
created: 2025-10-08
acceptance:
  - "Global kill-switch halts AI‑initiated UI actions ≤ 300ms end‑to‑end."
  - "All ACP refusals render a consistent badge/toast with reason code + 'Why'."
  - "UI shows 'Resume' when lock clears; logs a single de‑duplicated event."
---

## Purpose
Surface **safety decisions** in the UI: global kill‑switch, allow/deny/HITL/MSIG results, and schema/tool failures, with consistent visuals and explainability.

## Refusal Codes (ACP → UI)
- `POLICY_DENIED`
- `HITL_REQUIRED`
- `MSIG_REQUIRED`
- `KILL_SWITCH_ACTIVE`
- `SCHEMA_INVALID`
- `TOOL_NOT_ALLOWED`
- `RATE_LIMITED`
- `CONTEXT_SCOPE_VIOLATION`

## Visual Surfaces
- **Global Banner** (when kill‑switch on): sticky top, semantic "danger" tokens; includes clock since lock.
- **Toast** (transient refusals): stacks, auto‑dismiss; “Why?” opens Evidence Drawer.
- **Inline Badge** near the action origin (e.g., Proposal tile), with reason code.

## Behavior
- Each refused ACP envelope still emits a **trace id** + **reason** for audit.
- When kill‑switch toggles **on**, UI disables AI controls and **rejects** incoming ACP envelopes locally with `KILL_SWITCH_ACTIVE`.
- When toggled **off**, a one‑time **Resume** prompt appears; pending items remain Draft.

## Telemetry
- `ui.safety.refusal` {code, agentId, intent, entity, traceId}
- `ui.safety.killSwitch` {state, latencyMs}

## DoD
- Banner/Toast/Badge comps shipped; keyboard + screen reader support.
- Latency measurement harness proving ≤ 300ms fan‑out.
- Visual regression snapshots for primary themes.