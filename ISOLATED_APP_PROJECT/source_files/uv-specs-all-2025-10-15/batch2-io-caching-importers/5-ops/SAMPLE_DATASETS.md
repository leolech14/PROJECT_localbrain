---
spec_id: SAMPLE_DATASETS
title: Sample Datasets & Scenes
version: 0.1.0
owner: Leo
status: draft
batch: 2
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to Batch 0/1 resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference importer notes/prototypes attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.sample.datasets
  metrics_prefix: uv.sample.datasets
risks:
  - id: R-SAMPLE_DATASETS-1
    desc: Large file handling and UI stalls
    mitigation: Workers, chunked IO, staged commits, cancellation
category: 5-ops
flavor: reference
updated: '2025-10-15'
---

## Purpose
Canonical datasets used in demos, tests, and performance gates.

## Organization
- `samples/imagery/*` — small XYZ/WMTS endpoints (public/open)
- `samples/terrain/*` — quantized-mesh configs
- `samples/3dtiles/*` — small city block tilesets
- `samples/vector/*` — GeoJSON/TopoJSON samples
- `samples/raster/*` — small COGs, banded
- `samples/mesh/*` — GLB models with PBR
- `samples/pointcloud/*` — small LAZ + converted EPT/3D Tiles
- `samples/tables/*` — CSV/Parquet/Arrow tables
- `samples/volume/*` — slice stacks for Phase 1

Each entry includes: `id`, `description`, `size`, `license`, `attribution`, `expected layer`.

## Acceptance
- All samples load via drag & drop; perf scenes exercise the budgets.

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
