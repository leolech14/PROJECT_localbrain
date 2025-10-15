---
spec_id: SNAP_AND_ALIGN
title: Snap & Align
version: 0.1.0
owner: Leo
status: draft
batch: 7
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference UX flows & keyboard maps attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.snap.and.align
  metrics_prefix: uv.snap.and.align
risks:
  - id: R-SNAP_AND_ALIGN-1
    desc: "Inconsistent operator behavior across layer kinds"
    mitigation: "Single Operator model + conformance tests per kind"
---

## Purpose
Precise edits with grid/vertex/edge/face/feature snaps and alignment helpers.

## Snaps
- **Grid**: scene unit grid (configurable spacing); geo grid (lat/long intervals) in map modes.
- **Vertex/Edge/Face**: from Mesh/3D Tiles/Point cloud (nearest within radius). 
- **Feature**: snap to vector features (points/lines/polys) with priority rules.

## Align
- Center; floor-to-Z=0; align-to-ground; align axis to vector (principal components); match orientation to target.

## UX
- Toggle snaps with hotkeys; visual indicators (glyphs); numeric input boxes for deltas.
- Gizmos with axis locks; increments with Shift/Ctrl modifiers.

## Observability
- `uv.snap.enabled`, `uv.snap.hit`, `uv.align.applied`.

## Acceptance
- Snap hit tests < 1 ms p95; align computes in < 40 ms for typical meshes.
