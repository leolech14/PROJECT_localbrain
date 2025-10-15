---
spec_id: SUPPORT_MATRIX
title: Support Matrix (OS/Hardware/Providers)
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
  events_namespace: uv.support.matrix
  metrics_prefix: uv.support.matrix
risks:
  - id: R-SUPPORT_MATRIX-1
    desc: Flaky GPU tests and non-deterministic snapshots
    mitigation: Deterministic seeds, tolerance windows, device matrix, retries
category: 5-ops
flavor: reference
updated: '2025-10-15'
---

## Purpose
Declare and test the environments we support and where we degrade gracefully.

## OS & Hardware
- macOS 14+ (Apple Silicon). Known caveats documented for Intel Macs and Windows/Linux (future).
- GPU features: WebGL2 baseline; optional WebGPU flags (future).

## Providers
- Imagery/vector/terrain/3D tiles endpoints validated; attribution requirements listed.

## Degradations
- Post‑effects disabled on low‑end; volume scientific mode prompts when caps exceeded.

## Acceptance
- Matrix captured as a living table; CI nightly sweep on representative runners.

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
