---
spec_id: EXTERNAL_TOOLING
title: External Tooling (Optional)
version: 0.1.0
owner: Leo
status: draft
batch: 2
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to Batch 0/1 resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference importer notes/prototypes attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.external.tooling
  metrics_prefix: uv.external.tooling
risks:
  - id: R-EXTERNAL_TOOLING-1
    desc: Large file handling and UI stalls
    mitigation: Workers, chunked IO, staged commits, cancellation
category: 5-ops
flavor: reference
updated: '2025-10-15'
---

## Purpose
Leverage system-installed tools for heavy conversions without bloating the app.

## Tools
- **PDAL** — point cloud filters; writers for EPT/3D Tiles
- **GDAL** — raster/vector transforms; COG creation
- **FFmpeg** — video encoding for recorder (if needed)

## Wrapper model
- Spawned in sandboxed child process; timeouts; resource limits.
- Stdout parsed for progress; stderr captured in logs; artifacts written to `cache/imports/`.

## Security
- Paths validated; no shell interpolation; explicit allowlist of commands and flags.

## Acceptance
- LAZ→EPT pipeline completes for 5–10GB datasets with progress and resumable artifacts.

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
