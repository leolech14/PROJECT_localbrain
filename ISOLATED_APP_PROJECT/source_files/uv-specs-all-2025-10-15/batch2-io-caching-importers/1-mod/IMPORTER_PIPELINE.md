---
spec_id: IMPORTER_PIPELINE
title: Importer Pipeline
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
  events_namespace: uv.importer.pipeline
  metrics_prefix: uv.importer.pipeline
risks:
  - id: R-IMPORTER_PIPELINE-1
    desc: Large file handling and UI stalls
    mitigation: Workers, chunked IO, staged commits, cancellation
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Support many formats by converting **non-native** inputs to runtime-friendly products.

## Model
- **Tasks** run in a **Worker pool**; each task emits progress and supports cancel.
- **Products**: GeoJSON/FlatGeobuf for vectors; EPT/3D Tiles (pnts) for point clouds; tilesets/COGs for rasters; slice stacks for volumes.

## API
```ts
type ImportJob = {
  id: string; src: File|URL; target: "vector"|"pointcloud"|"raster"|"volume"|"tiles";
  opts?: Record<string, any>;
};
type ImportEvents =
  | {type:"start", id}
  | {type:"progress", id, pct:number, msg?:string}
  | {type:"artifact", id, href:string, kind:string}
  | {type:"end", id, ok:true}
  | {type:"error", id, message:string};

function submit(job: ImportJob): Observable<ImportEvents>;
function cancel(id: string): void;
```

## Pipelines (examples)
- **Shapefile → GeoJSON/FlatGeobuf**: parse DBF+SHP, reproject, write FGB; stream to layer.
- **LAZ/E57 → EPT or 3D Tiles pnts**: detect density; for small sets, decode in-memory; large → external tool path.
- **MBTiles → provider**: serve tiles over local URL scheme; cache integration.
- **NetCDF/HDF5/NIfTI → tiles/slices**: generate overview pyramids; Phase 1 supports 2D slices.

## Concurrency & memory
- Chunked reads; zero-copy buffers; spill to `imports/` on large artifacts.
- Backpressure: UI pauses preview if worker queue > N or heap exceeds threshold.

## Observability
- `uv.io.import.start|progress|artifact|end|cancel|error`
- Metrics: CPU time, peak memory, artifact size.

## Acceptance
- Cancel stops IO and releases memory within 500 ms.
- Progress events at least every 250 ms under load.

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
