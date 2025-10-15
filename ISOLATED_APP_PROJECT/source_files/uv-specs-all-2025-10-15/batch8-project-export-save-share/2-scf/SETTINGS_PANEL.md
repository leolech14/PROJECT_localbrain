---
spec_id: SETTINGS_PANEL
title: Settings Panel (App/Project/Providers/Cache/Keymap)
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
  events_namespace: uv.settings.panel
  metrics_prefix: uv.settings.panel
risks:
  - id: R-SETTINGS_PANEL-1
    desc: "Schema drift or lossy exports"
    mitigation: "Schema versioning; validators; golden round-trip tests"
---

## Purpose
Consolidate configuration in one place with safe defaults and clear controls.

## Sections
- **App**: theme, language, telemetry opt-in, accessibility defaults.
- **Project**: profile (lite/core/pro), frame targets, render toggles.
- **Providers**: endpoints, attribution display; **keys managed via OS keychain**.
- **Cache**: location, size/TTL caps, purge, offline/captive modes.
- **Keymap**: shortcut presets, conflicts resolver, export/import.

## Observability
- `uv.settings.changed`, `uv.providers.key.set|cleared`, `uv.cache.purged`, `uv.keymap.imported`.

## Acceptance
- Changing a setting applies within 100 ms or schedules a safe restart prompt.
