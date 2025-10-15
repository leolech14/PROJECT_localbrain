---
spec_id: RENDER_CORE_ADAPTER
title: Render Core Adapter (CesiumJS)
version: 0.1.0
owner: Leo
status: draft
batch: 1
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - Public interfaces stubbed; invariants documented
    - Events & metrics cataloged
  i2:
    - Worked example with sample data
    - Contract tests specified
  i3:
    - Performance and memory budgets verified on canonical scenes
    - Failure modes & UX errors defined
  complete:
    - Adopted with passing gates; docs and samples merged
observability:
  events_namespace: uv.render.core.adapter
  metrics_prefix: uv.render.core.adapter
risks:
  - id: R-RENDER_CORE_ADAPTER-1
    desc: Interface drift vs. electron/web constraints
    mitigation: Lock TS types; IPC contracts with version keys
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Identity & Purpose
Single Cesium viewer instance that hosts all visual layers (2D, 3D, globe). Provides the
`prepare → commit → draw` lifecycle and a narrow adapter surface for layer kinds.

## Invariants
- Exactly one active `Cesium.Viewer` per window.
- All visible objects mount via layer adapters; no direct raw Cesium calls from UI.
- Prepare work is async (workers); `commit()` is atomic on main thread.
- Main loop governed by Cesium render loop; panel updates never block frame.

## Public API (TypeScript)
```ts
export type LayerKind =
  | "MapRaster" | "Vector" | "Raster"
  | "Mesh" | "Tiles3D" | "PointCloud"
  | "Chart2D" | "Annotation" | "UI";

export interface UvRenderer {
  mount(container: HTMLElement, opts: RendererOptions): Promise<void>;
  unmount(): Promise<void>;
  addLayer(desc: LayerDesc): Promise<LayerHandle>;
  updateLayer(id: string, patch: Partial<LayerDesc>): Promise<void>;
  removeLayer(id: string): Promise<void>;
  pick(screen: {x:number,y:number}, opts?: PickOpts): Promise<PickResult | null>;
  setCamera(cmd: CameraCommand): void;
  getStats(): RenderStats;
}
```

## Lifecycle
1. **prepare()** — parse/ingest in workers → transferable buffers (Arrow arrays, typed arrays).
2. **commit()** — create/replace Cesium primitives (ImageryLayer, DataSource, Model, Cesium3DTileset).
3. **draw()** — Cesium advances LOD/culling; we emit `uv.render.frame` metrics.

## Events & Metrics
- `uv.render.frame` { frame_time_ms, draw_calls, vram_mb, tiles_in_view, tiles_loading }
- `uv.layer.committed` { id, kind, counts, gpu_bytes }
- `uv.layer.failed` { id, kind, error_code, message }

## Failure Modes
- Bad data → import error with remediation link
- GPU OOM → throttle tiles; downgrade post-FX
- Network issues → retries/backoff; user-visible status in HUD

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
