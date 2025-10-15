---
spec_id: BENCHMARKS_AND_GATES
title: Benchmarks & Promotion Gates
version: 0.1.0
owner: Leo
status: draft
batch: 10
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - Sections stubbed; cross-links to prior batches resolved
    - Pipelines/interfaces named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Budgets/gates aligned to Batch 0 performance targets
  i3:
    - Reference CI configs and harness stubs attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.benchmarks.and.gates
  metrics_prefix: uv.benchmarks.and.gates
risks:
  - id: R-BENCHMARKS_AND_GATES-1
    desc: Flaky GPU tests and non-deterministic snapshots
    mitigation: Deterministic seeds, tolerance windows, device matrix, retries
category: 5-ops
flavor: reference
updated: '2025-10-15'
---

## Purpose
Quantify performance and decide promotion eligibility objectively.

## Scenes
- **City 3D Tiles** (downtown), **Point Cloud 20M**, **Raster DEM 4k tiles**, **Vector 100k**, **1M-row Chart**.

## Metrics
- Frame time p50/p95, draw calls, VRAM; IO p95; cache hit rate; pick latency; brush propagation; tile throughput.

## Gates
- **i1**: basic scenes under budgets on target HW.
- **i2**: heavy scenes within p95 budgets; stability over 5 min.
- **i3**: full matrix (M1/M3) + offline mode; zero crashes; memory steady-state.
- **Complete**: docs/tutorials finished; release to beta passes canary cohort.

## Observability
- `uv.bench.scene.start|end`, `uv.bench.gate.pass|fail`.

## Acceptance
- Automated report artifact with trend charts; gate decisions recorded.

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
