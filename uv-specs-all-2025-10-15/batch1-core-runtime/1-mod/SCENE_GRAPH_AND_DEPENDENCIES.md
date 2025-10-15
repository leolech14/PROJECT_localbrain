---
spec_id: SCENE_GRAPH_AND_DEPENDENCIES
title: Scene Graph & Dependencies
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
  events_namespace: uv.scene.graph.and.dependencies
  metrics_prefix: uv.scene.graph.and.dependencies
risks:
  - id: R-SCENE_GRAPH_AND_DEPENDENCIES-1
    desc: "Interface drift vs. electron/web constraints"
    mitigation: "Lock TS types; IPC contracts with version keys"
---

## Purpose
Incremental updates without stuttering; predictable undo/redo.

## Model
Minimal depsgraph with typed nodes: `LayerData`, `GpuBuffers`, `Material`, `Transform`, `Camera`.

```
LayerData --(invalidates)--> GpuBuffers --(binds)--> Material --> Draw
          \--> Transform --------------------------/
```

## Rules
- Data change invalidates GPU buffers (rebuild on worker if possible).
- Style change rebinds materials only (no data rebuild).
- Transform change updates matrices; no data rewrite.
- Camera change triggers culling/LOD recompute only.

## Undo/Redo
Command-based; only data-bearing ops store diffs. Transform ops store small payloads.
