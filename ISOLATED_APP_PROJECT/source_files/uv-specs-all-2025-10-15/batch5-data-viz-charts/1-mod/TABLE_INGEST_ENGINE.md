---
spec_id: TABLE_INGEST_ENGINE
title: Table Ingest Engine (Arrow/Parquet/CSV)
version: 0.1.0
owner: Leo
status: draft
batch: 5
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference snapshots and golden plots attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.table.ingest.engine
  metrics_prefix: uv.table.ingest.engine
risks:
  - id: R-TABLE_INGEST_ENGINE-1
    desc: "Large table memory usage and cross-view selection cost"
    mitigation: "Columnar views, sampling, indexed joins, bitsets, and throttled events"
---

## Purpose
Load columnar data efficiently, infer schema, and provide zero-copy views to layers
and charts. Supports Arrow/Parquet (preferred) and CSV/TSV/NDJSON (converted).

## Inputs & formats
- **Arrow IPC/Feather** (`.arrow/.feather`): direct columnar mapping.
- **Parquet** (`.parquet`): columnar; predicate pushdown where available.
- **CSV/TSV** (`.csv/.tsv`): streamed parse; types inferred; optional schema hints.
- **NDJSON/JSON**: schema inferred from sample; nested objects flattened by rules.

## APIs
```ts
type TableId = string;
type LoadOpts = { sampleRows?: number; columns?: string[]; timezone?: string; };
type Expr = string; // SQL or expression language

loadTable(input: File|URL, opts?: LoadOpts): Promise<TableId>;
getSchema(id: TableId): Promise<Schema>;
getColumnView(id: TableId, col: string): Promise<ColumnView>; // typed array / dictionary
filterTable(id: TableId, expr: Expr): Promise<TableId>;        // derived table
joinTable(left: TableId, right: TableId, on: JoinSpec): Promise<TableId>;
summarize(id: TableId, cols: string[]): Promise<Summary>;      // min/max/quantiles/hist
```

## Implementation
- **Workers** for parse/IO (Arrow/Parquet/CSV); main thread receives transferables.
- **DuckDB-WASM** for SQL filters/joins; or expression engine for simple predicates.
- **Column pruning**: only materialize needed columns for layers/charts.
- **Virtual columns**: computed fields via expressions cached as lazy views.
- **Sampling**: sample-first preview; full materialization deferred.

## Memory & performance
- Limit heap per table; spill to temp if needed.
- Reuse typed array buffers; dictionary encoding for categoricals.
- Maintain row-index ↔ feature-id maps for linking.

## Observability
- `uv.table.ingest.start|progress|end|error`
- Metrics: rows, cols, bytes, parse ms, SQL ms.

## Acceptance
- 10M rows: schema in < 1s; first 100k preview < 1.5s (worker); filter (simple predicate) on 1M < 200 ms.
