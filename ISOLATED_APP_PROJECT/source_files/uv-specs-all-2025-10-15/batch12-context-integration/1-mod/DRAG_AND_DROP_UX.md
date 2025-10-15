---
spec_id: DRAG_AND_DROP_UX
title: Drag-and-Drop UX (Flows & Conflict Resolution)
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
  events_namespace: uv.drag.and.drop.ux
  metrics_prefix: uv.drag.and.drop.ux
risks:
  - id: R-DRAG_AND_DROP_UX-1
    desc: "Fragmented UX across modules; discoverability gaps"
    mitigation: "Shared patterns, command palette entries, onboarding tours, metrics-informed iteration"
---

## Purpose
Design the **end-to-end drop experience** with confident classification, progress, and cancellation,
integrated with Batch 2 IO & Importers.

## Flows
1. **Single file** → sniff → native or importer → layer with defaults → toast + inspector link.
2. **Mixed drop** → group into jobs; show progress per job; allow cancel; partial success handling.
3. **URL drop/paste** → treat like file; apply Network Rules; warn on cross-origin or missing headers.

## Conflict resolution
- CRS mismatch → prompt transform/anchor; offer bake or keep external.
- Large file → preview sample; suggest importer/decimation; enforce caps.
- Provider requires key → open Settings→Providers; retry after key set.

## UI affordances
- Drop-target highlights zones (canvas vs panel for import-only actions).
- Progress in **Task Center**; toasts for milestones; logs for details.

## Observability
- `uv.drop.sniff`, `uv.drop.job.start|progress|end|cancel|error`

## Acceptance
- Mixed 5-file drop stays responsive; classification accuracy ≥ 99% on canonical set; cancels release memory < 500 ms.
