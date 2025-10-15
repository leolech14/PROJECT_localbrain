---
spec_id: AI_POLICY_LIMITS
title: AI Policy Limits (Scopes, Rate, Dangerous Ops)
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
  events_namespace: uv.ai.policy.limits
  metrics_prefix: uv.ai.policy.limits
risks:
  - id: R-AI_POLICY_LIMITS-1
    desc: Over-broad AI control or misinterpretation of UI state
    mitigation: Role-scoped sessions, dry-run previews, explain/confirm gates, audit
category: 3-cfg
flavor: reference
updated: '2025-10-15'
---

## Purpose
Constrain AI capabilities via **roles**, **scopes**, and **limits** to protect users and data.

## Roles (suggested)
- **Analyst-Lite**: read, style, navigate, charts; no deletes; no provider changes.
- **Analyst-Core**: Analyst-Lite + import/export, table queries (offline/local).
- **Editor**: all above + layer create/delete; provider switches with prompt.
- **Admin**: all + settings/cache/network rules changes (prompts).

## Limits
```yaml
per_session:
  max_preview_per_min: 60
  max_commit_per_min: 30
  max_plan_steps: 10
  idle_timeout_min: 15
dangerous_ops:
  require_reason: true
  confirm_twice: true
```
- Dangerous ops include: delete/export to external paths/network rule changes/app settings reset.

## Observability
- `uv.ai.denied`, `uv.ai.rate_limited`, `uv.ai.escalation.prompted`.

## Acceptance
- Limits enforced; denials logged with reason; escalation prompts behave consistently.

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
