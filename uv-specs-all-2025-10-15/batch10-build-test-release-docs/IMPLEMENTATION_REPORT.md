---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 10)
version: 0.1.0
owner: Leo
status: draft
batch: 10
created: 2025-10-15
---

## Scope
Deterministic builds & signing, CI/CD pipelines, test strategy & GPU harness,
benchmarks & promotion gates, packaging & release channels, docs plan, support matrix.

## Acceptance demos (for 'complete')
1. **Deterministic Build** — Two consecutive builds produce byte-identical app bundles (excluding embedded timestamps), notarized on macOS.
2. **Green Pipeline** — CI executes unit, E2E, GPU harness, and benchmarks; promotion gates evaluated; artifacts & symbols uploaded.
3. **GPU Snapshot** — Golden image test suite passes across 2 Apple GPU targets with defined tolerances (ΔE/SSIM), retrying flaky frames ≤ 1 time.
4. **Release Channel** — Publish to `canary` and `beta`, auto-update enabled; crash symbolication verified from an injected test crash.
5. **Docs Preview** — Versioned docs site builds with tutorial notebooks and sample scenes; link checks pass; size budgets enforced.

## Perf gates
- Benchmark scene frame times within Batch 0 budgets (60/30 FPS tiers).
- Cold start ≤ 2 s, warm start ≤ 1 s (p95) on target hardware.
- Installer size budgets: ≤ 150 MB (core), ≤ 250 MB (pro).

## Observability checks
- `uv.build.*`, `uv.ci.*`, `uv.test.*`, `uv.bench.*`, `uv.release.*`, `uv.docs.*` events emitted with durations and statuses.

## Risks & mitigations
- GPU non-determinism: lock drivers where possible, tolerance windows, seed RNG, disable time-based effects in tests.
- Code signing & notarization failures: step-level retries, diagnostics capture, local sign-off script.