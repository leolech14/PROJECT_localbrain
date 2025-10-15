---
spec_id: TEST_STRATEGY
title: Test Strategy
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
  events_namespace: uv.test.strategy
  metrics_prefix: uv.test.strategy
risks:
  - id: R-TEST_STRATEGY-1
    desc: Flaky GPU tests and non-deterministic snapshots
    mitigation: Deterministic seeds, tolerance windows, device matrix, retries
category: 5-ops
flavor: reference
updated: '2025-10-15'
---

## Purpose
Guarantee correctness and performance using layered testing with deterministic baselines.

## Layers
- **Unit**: functions, adapters, schema validators.
- **Integration**: importer pipelines, tile manager, link-brush propagation.
- **E2E**: user workflows (drag-drop → style → export).
- **Snapshot (visual)**: UI components and style panels.
- **GPU Golden**: render frames compared via SSIM/ΔE with tolerances and masks.
- **Benchmarks**: perf scenes recorded and gated.

## Data
- Use `5-ops/SAMPLE_DATASETS` (Batch 2) + synthetic generators with seeds.

## Policy
- Tests parallelized; flake retries limited; slow tests labelled; per-PR smoke + nightly full.

## Observability
- `uv.test.start|end`, `uv.test.snapshot.diff`, `uv.test.gpu.ssim`.

## Acceptance
- Stable pass on CI with < 1% retries; coverage and perf budgets met.

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
