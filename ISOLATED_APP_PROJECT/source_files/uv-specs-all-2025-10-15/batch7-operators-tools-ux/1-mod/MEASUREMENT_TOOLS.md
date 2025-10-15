---
spec_id: MEASUREMENT_TOOLS
title: Measurement Tools
version: 0.1.0
owner: Leo
status: draft
batch: 7
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference UX flows & keyboard maps attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.measurement.tools
  metrics_prefix: uv.measurement.tools
risks:
  - id: R-MEASUREMENT_TOOLS-1
    desc: Inconsistent operator behavior across layer kinds
    mitigation: Single Operator model + conformance tests per kind
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Distance, area, angle, and height tools with globe-aware geodesic math and per-layer
sampling for height/raster/volume values.

## Tools
- **Distance**: planar (2D) and geodesic (globe); segment breakdown.
- **Area**: polygon area; planar & geodesic; ring handling for holes.
- **Angle**: between segments or absolute bearing.
- **Height**: delta between terrain heights or mesh points; vertical probe.

## Data probes
- Terrain height sampling; raster pixel values; volume voxel values when slice present.

## UX
- Sticky tool bar; ESC cancels; Enter commits to Annotation layer.
- Units from Transform/Scene settings; copy-to-clipboard with formatted strings.

## Observability
- `uv.measure.start|update|commit|cancel`, `uv.measure.sample`.

## Acceptance
- Geodesic distance within 0.5% of ellipsoidal reference; area within 1% for typical polygons.

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
