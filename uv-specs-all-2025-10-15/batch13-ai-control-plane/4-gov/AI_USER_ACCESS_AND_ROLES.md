---
spec_id: AI_USER_ACCESS_AND_ROLES
title: AI User Access & Roles (Special User Contract)
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
  events_namespace: uv.ai.user.access.and.roles
  metrics_prefix: uv.ai.user.access.and.roles
risks:
  - id: R-AI_USER_ACCESS_AND_ROLES-1
    desc: "Over-broad AI control or misinterpretation of UI state"
    mitigation: "Role-scoped sessions, dry-run previews, explain/confirm gates, audit"
---

## Purpose
Define the **AI User** as a first-class principal with **role-based access** and auditable actions.

## Contract
- AI actions are attributed to `principal: "ai:<engine>"` with session token and role.
- **Grants** are explicit; persisted; revocable; show up in Logs/Perf.
- **Escalation** requires user confirmation; reasons recorded.

## RBAC mapping
- Map roles to: Operator IDs, CCD control groups, Provider operations, Export types.

## Audit & replay
- Every plan has **CID**, signature, and deterministic replay capability; export NDJSON with hashes.

## Observability
- `uv.ai.user.grant|revoke`, `uv.ai.user.escalate`, `uv.ai.audit.exported`.

## Acceptance
- Grants and revocations take effect immediately; replay reproduces outcomes on same dataset and version.
