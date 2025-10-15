---
spec_id: LAYER_API
title: Layer API & Contracts
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
  events_namespace: uv.layer.api
  metrics_prefix: uv.layer.api
risks:
  - id: R-LAYER_API-1
    desc: Interface drift vs. electron/web constraints
    mitigation: Lock TS types; IPC contracts with version keys
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Unified interface for all layer types so the left panel and renderer interact predictably.

## Core Types
```ts
export interface LayerDesc {
  id: string;
  kind: LayerKind;
  data: DataSpec;
  style: StyleSpec;
  transform: TransformSpec;
  interactions: InteractionSpec;
  metadata?: Record<string, any>;
}

export interface DataSpec {
  source: FileSource | UrlSource | TilesetSource | TableSource;
  schema?: Schema;              // attributes & types
  filters?: string[];           // SQL/expr
  lod?: LODPolicy;
  timeIndex?: TimeSpec;
}

export interface StyleSpec {
  opacity?: number;
  zOrder?: number;
  // Extensions per kind:
  vector?: VectorStyle;
  raster?: RasterStyle;
  mesh?: MeshPbr;
  pointCloud?: PointCloudStyle;
  chart?: ChartStyle;
}

export interface TransformSpec {
  crs?: string;                 // e.g., EPSG:4326
  axisSwizzle?: "XYZ"|"XZY"|"YXZ"|"YZX"|"ZXY"|"ZYX";
  units?: { linear?: "m"|"ft"; angular?: "deg"|"rad" };
  modelMatrix?: number[];       // 4x4 column-major
}

export interface InteractionSpec {
  pickable?: boolean;
  hoverFields?: string[];
  selectionMode?: "single"|"multi"|"brush";
  brushLink?: boolean;
}
```

## Lifecycle Hooks
- `prepare(desc) → PreparedLayer` (worker-friendly)
- `commit(prepared) → LayerHandle` (main thread)
- `dispose(handle)`

## Versioning
- `apiVersion: 1` in project files; breaking changes bump major and ship a migrator.

## Contract Tests (examples)
- Add vector layer → pick feature → hover tooltip contains declared fields.
- Update style.color ramp → draw state updates within 2 frames.
- Change transform.axisSwizzle → object axes update without data rewrite.

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
