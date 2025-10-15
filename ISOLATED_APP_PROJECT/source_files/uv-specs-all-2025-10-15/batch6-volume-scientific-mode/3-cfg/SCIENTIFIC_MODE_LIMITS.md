---
spec_id: SCIENTIFIC_MODE_LIMITS
title: Scientific Mode Limits & Caps (Config)
version: 0.1.0
owner: Leo
status: draft
batch: 6
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Golden snapshots, transfer-function presets, and test volumes attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.scientific.mode.limits
  metrics_prefix: uv.scientific.mode.limits
risks:
  - id: R-SCIENTIFIC_MODE_LIMITS-1
    desc: Cross-engine camera/selection drift and depth interop
    mitigation: Linked state via adapters; no Z-buffer sharing; explicit conversions with tests
category: 3-cfg
flavor: reference
updated: '2025-10-15'
---

## Purpose
Protect performance and memory while giving clear UX for large volumes.

## Caps (defaults; override per env)
```yaml
max_voxels: 256*256*256          # warn above; require downsample/import
max_texture_bytes: 512_000_000   # ~512 MB for GPU volume texture
max_iso_grid: 128*128*128        # marching-cubes worker limit
sampling_step_range: [0.5, 3.0]  # world units per ray step (default depends on spacing)
probe_rate_limit_hz: 60          # max probes per second
```
## Behavior
- Above caps: show dialog with **downsample** and **subset** options; allow "Scientific Mode only".
- Persist user choice in project file; annotate HUD for cap-induced changes.

## Observability
- `uv.scimode.cap.warn`, `uv.scimode.cap.block`, `uv.scimode.downsample.applied`.

## Acceptance
- Caps prevent OOM; user paths are clear; reproducible results with presets stored.

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
