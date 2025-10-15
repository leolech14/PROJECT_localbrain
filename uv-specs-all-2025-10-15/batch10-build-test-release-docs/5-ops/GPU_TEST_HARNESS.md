---
spec_id: GPU_TEST_HARNESS
title: GPU Test Harness (Golden Images)
version: 0.1.0
owner: Leo
status: draft
batch: 10
created: 2025-10-15
promotion_gates:
  i1:
    - "Sections stubbed; cross-links to prior batches resolved"
    - "Pipelines/interfaces named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Budgets/gates aligned to Batch 0 performance targets"
  i3:
    - "Reference CI configs and harness stubs attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.gpu.test.harness
  metrics_prefix: uv.gpu.test.harness
risks:
  - id: R-GPU_TEST_HARNESS-1
    desc: "Flaky GPU tests and non-deterministic snapshots"
    mitigation: "Deterministic seeds, tolerance windows, device matrix, retries"
---

## Purpose
Validate rendering deterministically across a support matrix using image-based tests.

## Approach
- Deterministic camera paths; random seeds fixed; time-based effects disabled in tests.
- Capture frames at fixed resolution; compare to **goldens** using SSIM and color ΔE.
- Mask HUD overlays and subpixel text; tolerate device-specific epsilon.

## Tolerances
- SSIM ≥ 0.995 typical; ΔE2000 p95 ≤ 1.5; allow small masked areas for known nondeterminism.

## Infrastructure
- macOS Apple Silicon runners; two hardware bins (M1/M3).
- Artifact store for goldens; versioned by scene + renderer hash + profile.

## Observability
- `uv.test.gpu.capture`, `uv.test.gpu.compare`, metrics: ssim, deltaE, render ms.

## Acceptance
- Flake rate ≤ 0.5%; rerun single retry allowed; failing diffs include side-by-side images.
