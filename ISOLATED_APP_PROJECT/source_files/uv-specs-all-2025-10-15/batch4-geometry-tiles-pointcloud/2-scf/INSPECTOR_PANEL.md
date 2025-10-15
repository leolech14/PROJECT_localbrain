---
spec_id: INSPECTOR_PANEL
title: Inspector Panel
version: 0.1.0
owner: Leo
status: draft
batch: 4
created: 2025-10-15
promotion_gates:
  i1:
    - "Sections stubbed; cross-links to Batches 0–3 resolved"
    - "Interfaces, events, and examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference snapshots/test scenes attached; importer notes updated"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.inspector.panel
  metrics_prefix: uv.inspector.panel
risks:
  - id: R-INSPECTOR_PANEL-1
    desc: "Huge datasets (tiles/point clouds) creating VRAM pressure"
    mitigation: "LOD/SSE, density controls, eviction, and HUD warnings"
---

## Purpose
Expose properties/attributes/metadata of the selected entity (feature, mesh, tileset, raster sample).

## Behavior
- Show **Type**, **Layer**, **ID**, **Bounds**, **CRS**, **Vertex/Face counts** (meshes), **Attributes** (key/value).
- Copy-to-clipboard; search filter; attribute export (CSV/JSON) of selection.
- Live preview: small thumbnails for textures/materials; colormap previews.

## Controls
- Read-only for source-bound attributes; editable where layer exposes writable props (e.g., display name).
- Context actions: isolate/solo, zoom-to, add to annotation, export selection.

## Observability
- `uv.ui.inspector.opened`, `uv.ui.inspector.copied`, `uv.ui.inspector.exported`

## Acceptance
- 10k-attribute features remain responsive via virtualization; copy/export under 150 ms.
