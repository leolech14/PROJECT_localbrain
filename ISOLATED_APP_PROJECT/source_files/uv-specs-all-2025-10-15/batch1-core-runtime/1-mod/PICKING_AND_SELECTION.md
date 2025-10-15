---
spec_id: PICKING_AND_SELECTION
title: Picking & Selection
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
  events_namespace: uv.picking.and.selection
  metrics_prefix: uv.picking.and.selection
risks:
  - id: R-PICKING_AND_SELECTION-1
    desc: "Interface drift vs. electron/web constraints"
    mitigation: "Lock TS types; IPC contracts with version keys"
---

## Strategy
- **Phase 1 (Core)**: Use Cesium's `scene.pick()` / `drillPick()` for all Cesium-native layers
  (Entities, Models, 3D Tiles, Imagery features).
- **HUD/Custom Overlays**: DOM/canvas hit-test tree with z-order awareness.
- **Phase 2 (Optional)**: Custom ID-buffer for bespoke primitives (offscreen framebuffer).

## API
```ts
pick(screen: {x:number,y:number}, opts?: { drill?: boolean }): Promise<PickResult|null>
```

## PickResult
- `layerId`, `kind`, `featureId`, `positionWorld`, `attributes` (subset), `normal?`.

## Selection
- Single/multi/brush modes; brush generates a 2D region → project into scene for sets.

## Events
- `uv.pick.hit`, `uv.select.changed` (added[], removed[], layerId).

## Failure
- No depth info for HUD; fall back to overlay positions; show "no hit" indicators.
