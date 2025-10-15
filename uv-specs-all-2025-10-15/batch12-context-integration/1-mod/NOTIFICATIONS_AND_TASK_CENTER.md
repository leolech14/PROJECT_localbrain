---
spec_id: NOTIFICATIONS_AND_TASK_CENTER
title: Notifications & Task Center
version: 0.1.0
owner: Leo
status: draft
batch: 12
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference flows and screenshots attached; copy reviewed"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.notifications.and.task.center
  metrics_prefix: uv.notifications.and.task.center
risks:
  - id: R-NOTIFICATIONS_AND_TASK_CENTER-1
    desc: "Fragmented UX across modules; discoverability gaps"
    mitigation: "Shared patterns, command palette entries, onboarding tours, metrics-informed iteration"
---

## Purpose
Offer **non-intrusive notifications** and a **Task Center** as the single source of truth for
long-running jobs (imports, exports, encoding, downloads).

## Notifications
- Toasts with dedupe; stacked by kind; click-through to details; do-not-disturb toggle.

## Task Center
- Job rows with progress, ETA, controls (pause/resume/cancel), logs; correlation IDs link to Logs panel.
- Persist recent jobs per project; export NDJSON for audits.

## Performance
- Update at 2–4 Hz; virtualized lists; backpressure-aware UI.

## Observability
- `uv.task.add|progress|pause|resume|cancel|end|error`, `uv.notify.show|hide|dedupe`

## Acceptance
- Cancelling jobs frees resources promptly; deduping eliminates duplicate toasts under stress tests.
