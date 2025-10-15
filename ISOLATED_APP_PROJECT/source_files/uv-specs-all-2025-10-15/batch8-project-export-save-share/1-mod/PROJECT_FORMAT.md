---
spec_id: PROJECT_FORMAT
title: Project Format (.uvscene.json)
version: 0.1.0
owner: Leo
status: draft
batch: 8
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Golden artifacts and schema validators included"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.project.format
  metrics_prefix: uv.project.format
risks:
  - id: R-PROJECT_FORMAT-1
    desc: "Schema drift or lossy exports"
    mitigation: "Schema versioning; validators; golden round-trip tests"
---

## Purpose
Define a **stable, versioned** JSON format that captures the entire state needed to
reproduce a view: layers, sources, styles, transforms, selections, camera/bookmarks,
charts, presets/recipes, and environment hints.

## File
- Extension: `.uvscene.json`
- Encoding: UTF‑8; comments disallowed; `$schema` and `version` required.

## Versioning
- SemVer: `uvsceneVersion` (e.g., `1.0.0`); breaking changes bump major.
- `$schema`: URL to JSON‑Schema for this version; shipped in app and available offline.
- **Migrations**: from older versions via deterministic transformers (recorded in logs).

## Top‑level shape (excerpt)
```json
{
  "$schema": "https://uv.dev/schema/uvscene-1.0.0.json",
  "uvsceneVersion": "1.0.0",
  "createdAt": "2025-10-15T10:00:00Z",
  "appVersion": "0.1.0",
  "profile": "pro",
  "environment": { "providersProfile": "default" },
  "camera": { "mode": "3D", "position": [..], "orientation": [..], "fov": 50 },
  "bookmarks": [{ "name": "A", "camera": {..} }],
  "layers": [ /* LayerDescriptor[] per Batch 1 API */ ],
  "charts": [ /* Chart layer descriptors & mappings */ ],
  "selections": { "sets": [/* SelectionSet summaries */] },
  "presets": { "panels": {..}, "recipes": {..} }
}
```

## Rules
- **No secrets**: provider keys live in OS keychain; we store provider **ids**, not secrets.
- **Paths**: store relative paths and content hashes for local files; remote URLs with headers by id (see providers).
- **Determinism**: order is preserved; numeric tolerances documented for camera/transform.

## Validation
- JSON‑Schema validators run on save/load; warnings surfaced in Logs/Perf panel.

## Observability
- `uv.project.save|load`, `uv.project.migrate`
