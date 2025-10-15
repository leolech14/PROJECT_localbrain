---
spec_id: SCIENTIFIC_MODE_BRIDGE
title: Scientific Mode Bridge (vtk.js link)
version: 0.1.0
owner: Leo
status: draft
batch: 6
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Golden snapshots, transfer-function presets, and test volumes attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.scientific.mode.bridge
  metrics_prefix: uv.scientific.mode.bridge
risks:
  - id: R-SCIENTIFIC_MODE_BRIDGE-1
    desc: Cross-engine camera/selection drift and depth interop
    mitigation: Linked state via adapters; no Z-buffer sharing; explicit conversions with tests
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Provide a **linked** scientific view (vtk.js) for full 3D volume rendering and advanced
scientific widgets, while keeping the main viewer simple and fast.

## Responsibilities
- Manage a separate render surface with **vtk.js** for volume ray-march and slice widgets.
- Synchronize **project state** (sources, transforms, transfer functions) between views.
- Map **camera** between Cesium ⇄ vtk.js (ellipsoid/world ↔ Cartesian local frame).
- Propagate **selections** and **probes** bidirectionally via the Link‑Brush engine.

## Camera mapping
- Define a local **ENU** frame at a volume anchor; convert Cesium camera (lon/lat/height + heading/pitch/roll) into vtk.js camera (position, focalPoint, viewUp) and back.
- Round-trip error thresholds: position ≤ 1e-3 * bbox diagonal; angular ≤ 0.5°.

## Data plumbing
- Volumes supplied as typed arrays / SharedArrayBuffers; chunked loaders for Zarr/NetCDF.
- Transfer function presets shared as JSON (see below).

## Transfer function JSON
```json
{
  "name": "ct-soft-tissue",
  "stops": [
    {"x": 0.00, "rgba": [0,0,0,0]},
    {"x": 0.25, "rgba": [0.2,0.2,0.7,0.3]},
    {"x": 0.50, "rgba": [0.9,0.9,0.9,0.6]},
    {"x": 1.00, "rgba": [1,1,1,1]}
  ]
}
```

## Events
- `uv.scimode.open|close`, `uv.scimode.tf.changed`, `uv.scimode.sample.step.changed`, `uv.scimode.render.ms`, `uv.scimode.error`.

## Acceptance
- Camera round-trip within epsilon; TF presets apply identically in both views; selections and probes mirror across views within 50 ms.

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
