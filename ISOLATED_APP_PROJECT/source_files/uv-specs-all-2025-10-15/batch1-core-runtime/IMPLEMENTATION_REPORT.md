---
spec_id: IMPLEMENTATION_REPORT_B1
title: Implementation Report (Batch 1)
version: 0.1.0
owner: Leo
status: draft
batch: 1
created: 2025-10-15
promotion_gates:
  i1:
    - "Public interfaces stubbed; invariants documented"
    - "Events & metrics cataloged"
  i2:
    - "Worked example with sample data"
    - "Contract tests specified"
  i3:
    - "Performance and memory budgets verified on canonical scenes"
    - "Failure modes & UX errors defined"
  complete:
    - "Adopted with passing gates; docs and samples merged"
observability:
  events_namespace: uv.implementation.report.b1
  metrics_prefix: uv.implementation.report.b1
risks:
  - id: R-IMPLEMENTATION_REPORT_B1-1
    desc: "Interface drift vs. electron/web constraints"
    mitigation: "Lock TS types; IPC contracts with version keys"
---

## Scope
Batch 1 — Core runtime & Layer API

## Acceptance demos (for 'complete')
- Add a GeoJSON and a glTF via drag-drop → both render; picking returns attributes.
- Toggle axis swizzle on a mesh → orientation changes without data rewrite.
- Change colormap on raster → updates within 2 frames; frame time within budget.
- Save 3 camera bookmarks; replay a short camera path.

## Next
- Batch 2: IO, Caching & Importers.
