---
spec_id: TRANSFORM_PANEL
title: Transform Panel (CRS, Axis, Units, Align)
version: 0.1.0
owner: Leo
status: draft
batch: 4
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - Sections stubbed; cross-links to Batches 0–3 resolved
    - Interfaces, events, and examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference snapshots/test scenes attached; importer notes updated
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.transform.panel
  metrics_prefix: uv.transform.panel
risks:
  - id: R-TRANSFORM_PANEL-1
    desc: Huge datasets (tiles/point clouds) creating VRAM pressure
    mitigation: LOD/SSE, density controls, eviction, and HUD warnings
category: 2-scf
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Make spatial hygiene explicit and easy: CRS selection, axis swizzle, units, alignment, and model matrix.

## Controls
- **CRS selector** (searchable EPSG); warnings on reprojection cost; show units.
- **Axis mapping** dropdown (XYZ permutations); **Units** (linear/angular).
- **Align to**: center, floor-to-ground, fit-to-layer; **Snap**: grid, vertex/edge/face, geographic.
- Matrix editor with reset/apply; deterministic "Fit to Layer" button.

## Behavior
- Changes create **Transform** patches for the Layer; undo/redo supported.
- Badges in HUD reflect CRS/units; tooltips explain applied transforms.

## Observability
- `uv.ui.transform.changed`, `uv.ui.transform.fit`, `uv.ui.transform.snap`

## Acceptance
- Fit-to-layer positions camera correctly on globe and local scenes; axis swizzle applies without geometry rewrite.

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
