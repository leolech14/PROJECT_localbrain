---
spec_id: FILE_EXPLORER_AND_PREVIEW
title: File Explorer & Preview
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
  events_namespace: uv.file.explorer.and.preview
  metrics_prefix: uv.file.explorer.and.preview
risks:
  - id: R-FILE_EXPLORER_AND_PREVIEW-1
    desc: "Fragmented UX across modules; discoverability gaps"
    mitigation: "Shared patterns, command palette entries, onboarding tours, metrics-informed iteration"
---

## Purpose
Provide an integrated **File Explorer** with type-aware previews and tight coupling to
drag-and-drop and the Layer API.

## Features
- Browse local (scoped) and recent project directories; favorites/pins.
- **Previews**: quick metadata (rows/features, CRS, size), thumbnails for raster/image/mesh,
  schema for tables, attribution hints for providers.
- **Actions**: open, drag-to-canvas (creates layer), open-in-finder, reveal-on-disk,
  import via specific importer (context menu).

## Search & tags
- Full-text over filenames and tags; filters by kind (vector/mesh/raster/table/tiles).
- Tagging per item; tags included in Project Hub search.

## Performance
- Virtualized lists; background hash & thumbnail workers; caching; debounce search.

## Observability
- `uv.explorer.opened|search|preview`, `uv.explorer.drag.start|end`

## Acceptance
- Search 5k items < 150 ms; preview open < 200 ms; drag-to-canvas creates correct layer with defaults.
