---
spec_id: DOCUMENTATION_PLAN
title: Documentation Plan
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
  events_namespace: uv.documentation.plan
  metrics_prefix: uv.documentation.plan
risks:
  - id: R-DOCUMENTATION_PLAN-1
    desc: "Flaky GPU tests and non-deterministic snapshots"
    mitigation: "Deterministic seeds, tolerance windows, device matrix, retries"
---

## Purpose
Ship a discoverable docs site with versioned API, tutorials, and sample scenes.

## Structure
- **Getting Started**, **Concepts** (Scene/Layer/Style/Transform), **How‑tos**, **Reference** (Schema/API), **Samples** (downloadable `.uvscene.json`).

## Tooling
- Static site (Docusaurus/MkDocs); versioned; search; link check; size budgets.
- Snippets verified in CI (doctests where feasible).

## Samples
- Curated scenes per batch; screenshots; expected outputs for tests.

## Observability
- `uv.docs.build.start|end`, `uv.docs.linkcheck.fail`.

## Acceptance
- Docs build without broken links; sample scenes open and reproduce screenshots.
