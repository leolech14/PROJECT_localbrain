---
spec_id: CI_CD_PIPELINE
title: CI/CD Pipeline
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
  events_namespace: uv.ci.cd.pipeline
  metrics_prefix: uv.ci.cd.pipeline
risks:
  - id: R-CI_CD_PIPELINE-1
    desc: "Flaky GPU tests and non-deterministic snapshots"
    mitigation: "Deterministic seeds, tolerance windows, device matrix, retries"
---

## Purpose
Automate quality and releases with clear stages, caching, and artifact management.

## Stages
1. **Lint & Typecheck** — ESLint/TS; schema lint (JSON Schemas).
2. **Unit** — fast unit tests, coverage thresholds.
3. **E2E** — Playwright/Cypress; headless Electron runs; screenshots for regressions.
4. **GPU Harness** — headful GPU tests on macOS runners with Apple Silicon.
5. **Benchmarks** — load perf scenes; record frame/IO/cache metrics; enforce gates.
6. **Package & Sign** — build artifacts; sign/notarize.
7. **Promote** — publish to channel (canary/beta/stable); upload symbols; create release notes.
8. **Docs** — build docs site; validate links; publish preview.

## Caching
- Node modules cache keyed by lockfile; build cache for intermediate artifacts; golden images as artifacts.

## Secrets
- Stored in CI vault (Keychain on macOS runners if needed); never printed; rotated regularly.

## Observability
- `uv.ci.stage.start|end`, `uv.ci.cache.hit|miss`, `uv.ci.artifact.uploaded`.

## Acceptance
- Full pipeline completes on a clean runner; all artifacts present; gates evaluated and enforced.
