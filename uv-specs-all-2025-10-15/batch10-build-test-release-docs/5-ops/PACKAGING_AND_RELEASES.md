---
spec_id: PACKAGING_AND_RELEASES
title: Packaging & Releases
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
  events_namespace: uv.packaging.and.releases
  metrics_prefix: uv.packaging.and.releases
risks:
  - id: R-PACKAGING_AND_RELEASES-1
    desc: "Flaky GPU tests and non-deterministic snapshots"
    mitigation: "Deterministic seeds, tolerance windows, device matrix, retries"
---

## Purpose
Deliver signed installers and updates across channels with symbolication and crash reporting.

## Channels
- `canary` → internal, daily; `beta` → external cohort; `stable` → GA.
- Cohort sizes & rollout percentages configurable.

## Packaging
- Electron builder config; universal binaries; DMG/PKG for macOS; auto-update prepared.

## Crash reporting
- Capture minidumps + source maps; symbol server; privacy redaction; user opt-in.

## Release notes
- Generated from commits + conventional changelog; upgrade guides for breaking changes.

## Observability
- `uv.release.publish|promote`, `uv.crash.reported|symbolicated`.

## Acceptance
- Auto-update roundtrip validated; crash symbolication demonstrated from synthetic crash.
