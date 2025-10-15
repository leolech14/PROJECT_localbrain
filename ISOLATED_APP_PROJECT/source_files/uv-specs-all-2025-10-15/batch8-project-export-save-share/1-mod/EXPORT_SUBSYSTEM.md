---
spec_id: EXPORT_SUBSYSTEM
title: Export Subsystem (Images/Video/Data/Models)
version: 0.1.0
owner: Leo
status: draft
batch: 8
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Golden artifacts and schema validators included
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.export.subsystem
  metrics_prefix: uv.export.subsystem
risks:
  - id: R-EXPORT_SUBSYSTEM-1
    desc: Schema drift or lossy exports
    mitigation: Schema versioning; validators; golden round-trip tests
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Export what you see (and what you filtered) without stalling the UI, with correct color
management, attribution, and metadata.

## Exports
### Images
- **PNG/JPEG** (sRGB) and **EXR** (linear float); with/without HUD & attribution.
- Options: DPI, transparent background, crop region, color profile tag.
- Metadata: app version, CRS, timestamp, provider credits (opt).

### Video
- Record camera paths or time sequences: **MP4 (H.264/H.265)**, **WebM (VP9/AV1)**.
- Encoder worker (WebCodecs/FFmpeg); audio passthrough (optional).
- Frame pacing synced to render loop; drop-frame accounting and stats.

### Data
- Tables: CSV/Parquet (filtered rows).
- Vectors: GeoJSON from selection or computed outputs.
- Rasters: GeoTIFF tiles (subset) or world‑file images (with caution).
- Volumetric: slice PNG stacks; **iso‑mesh glTF/PLY** exports.

### Models
- glTF/GLB export of selected meshes (baked transforms/material overrides).
- PLY for iso‑surfaces; normals and units preserved.

## Pipeline
- Offscreen render targets → encode in worker; backpressure monitored.
- Streaming writers for large CSV/Parquet; cancel/resume support for long jobs.
- File naming templates with tokens: `{scene}`, `{layer}`, `{date}`, `{time}`, `{frame}`.

## Color & profiles
- Maintain linear workflow internally; convert to sRGB for PNG/JPEG; preserve linear for EXR.
- Tone map settings included in metadata.

## Observability
- `uv.export.image|video|data|model.start|end|error`
- Metrics: encode ms, throughput MB/s, dropped frames, output bytes.

## Acceptance
- 4k PNG < 400 ms; 1080p MP4 @ 30 FPS dropped frames < 1%; CSV 1M rows in ~seconds with steady throughput.

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
