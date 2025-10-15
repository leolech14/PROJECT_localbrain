---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 8)
version: 0.1.0
owner: Leo
status: draft
batch: 8
created: 2025-10-15
---

## Scope
Project format (`.uvscene.json`) with schema/versioning, export subsystem (images/video/data/models),
shareable view recipes, Settings panel, Logs/Perf panel.

## Acceptance demos (for 'complete')
1. **Round‑Trip** — Save `.uvscene.json` for a scene with map+mesh+chart; close and re‑open; visual parity within golden tolerance.
2. **Image Export** — Export PNG and EXR (with/without HUD); EXR opens with correct linear data; attribution optionally included.
3. **Video Export** — Record a 10‑second camera path to MP4 (H.264) and WebM (VP9/AV1); dropped frames < 1% and audio (if present) stays in sync (±20 ms).
4. **Data Export** — Filtered table → CSV and Parquet; selected features → GeoJSON; 3D iso‑mesh → glTF/PLY; imports clean in reference tools.
5. **Recipe Share** — Generate a `view://` recipe JSON; importing on another machine reproduces view (with provider key prompts).

## Perf gates
- Save/load `.uvscene.json` < 200 ms for 50 layers; validation < 50 ms.
- Image export (4k) < 400 ms; video encoding in worker keeps UI long tasks p95 < 50 ms.
- Data export of 1M filtered rows streams at ≥ 80 MB/s to disk (SSD).

## Observability checks
- `uv.project.save|load`, `uv.export.image|video|data|model`, `uv.recipe.share|open`, `uv.panel.logs.opened`.
- Metrics: project size, save/load ms, encoder ms, dropped frames, export throughput.

## Risks & mitigations
- Schema drift — semver + `$schema` URL + migration rules; validators in CI.
- Provider keys — use OS keychain; never embed; prompt on recipe import.