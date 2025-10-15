---
spec_id: AGENT_PERMISSIONS_AND_GUARDS
title: Agent Permissions & Guards
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
  events_namespace: uv.agent.permissions.and.guards
  metrics_prefix: uv.agent.permissions.and.guards
risks:
  - id: R-AGENT_PERMISSIONS_AND_GUARDS-1
    desc: Agent actions that surprise the user or violate policy
    mitigation: Dry-run, explicit confirmations, capability grants, undo-first policy
category: 3-cfg
flavor: reference
updated: '2025-10-15'
---

## Purpose
Constrain what the agent can do and where, integrated with the Permissions Service (Batch 9).

## Grants
- Capabilities: op.*, panel.*, layer.*, file.open, net.request, etc.
- Scopes: session/persistent; revoke anytime; audit logs.

## Guards
- Dry-run inspections (counts, bytes touched, providers contacted).
- Rate limits: max ops/min; network domains allowlist; memory guard.
- Execution fences: require explicit confirmation phrases for destructive ops.

## Observability
- `uv.agent.grant|revoke`, `uv.agent.guard.triggered`

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
