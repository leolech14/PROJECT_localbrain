---
spec_id: FILE_EXPLORER_AND_PREVIEW
title: File Explorer & Preview
version: 0.1.0
owner: Leo
status: draft
batch: 12
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference flows and screenshots attached; copy reviewed
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.file.explorer.and.preview
  metrics_prefix: uv.file.explorer.and.preview
risks:
  - id: R-FILE_EXPLORER_AND_PREVIEW-1
    desc: Fragmented UX across modules; discoverability gaps
    mitigation: Shared patterns, command palette entries, onboarding tours, metrics-informed iteration
category: 1-mod
flavor: codegen
updated: '2025-10-15'
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
