---
spec_id: LINK_BRUSH_ENGINE
title: Link Brush Engine (Cross-Layer Selection)
version: 0.1.0
owner: Leo
status: draft
batch: 5
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference snapshots and golden plots attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.link.brush.engine
  metrics_prefix: uv.link.brush.engine
risks:
  - id: R-LINK_BRUSH_ENGINE-1
    desc: Large table memory usage and cross-view selection cost
    mitigation: Columnar views, sampling, indexed joins, bitsets, and throttled events
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Propagate selections between charts and scene layers using join keys and efficient bitsets.

## Model
- **SelectionSet**: immutable bitset or index list referencing a base table.
- **JoinKey**: mapping between tables and features (e.g., `city_id`, `tile_id`, `featureId`).
- **Subscriptions**: layers/charts register to keys; engine fans out updates.

## APIs
```ts
type SelectionId = string;
registerSource(tableId: string, keys: string[]): SourceHandle;
registerTarget(target: {layerId?:string, chartId?:string}, join: JoinSpec): TargetHandle;
updateSelection(source: SourceHandle, sel: SelectionSet): void;
clearSelection(scope?: "source"|"global"): void;
```

## Semantics
- Selections are **composable**: union/intersection/diff; last-writer wins per source.
- Brush updates throttled to ~60Hz; coalesced when bursty.
- Persist/restore selection in view recipes (optional).

## Implementation
- Bitsets for large N; sparse index lists for small selections.
- Precomputed maps: row-index → feature-id for layers; dictionary-encoded join columns.
- Fallback: runtime joins via DuckDB-WASM when keys not preindexed (warn in logs).

## Observability
- `uv.brush.start|update|end`, `uv.brush.join.ms`, `uv.brush.targets.count`

## Acceptance
- Brush 50k points → map highlight under 80 ms (p95); CPU utilization < 1 core sustained.

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
