---
spec_id: PRESET_SYSTEM
title: Preset System (Panels & View Recipes)
version: 0.1.0
owner: Leo
status: draft
batch: 7
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference UX flows & keyboard maps attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.preset.system
  metrics_prefix: uv.preset.system
risks:
  - id: R-PRESET_SYSTEM-1
    desc: "Inconsistent operator behavior across layer kinds"
    mitigation: "Single Operator model + conformance tests per kind"
---

## Purpose
Save/Load **per-panel presets** and **full view recipes** (scene state) reproducibly.

## Presets
- Scope: Style, Data, Transform, Camera, Compare, Chart settings.
- Store: JSON with schema version; human-readable; diff-friendly.
- Location: project folder or user library with references.

## View recipes
- Snapshot Scene: layers (sources, styles, transforms), camera, HUD/compare settings.
- Shareable as JSON; can be applied partially or fully.

## Observability
- `uv.preset.saved|loaded|imported|exported`, `uv.viewrecipe.shared|applied`.

## Acceptance
- Preset apply < 100 ms for typical layer; view recipe rehydrates the scene deterministically.
