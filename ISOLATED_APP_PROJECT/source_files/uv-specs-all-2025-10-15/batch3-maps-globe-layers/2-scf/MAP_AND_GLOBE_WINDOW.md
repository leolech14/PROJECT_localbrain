---
spec_id: MAP_AND_GLOBE_WINDOW
title: Map & Globe Window
version: 0.1.0
owner: Leo
status: draft
batch: 3
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference styling snapshots & test scenes attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.map.and.globe.window
  metrics_prefix: uv.map.and.globe.window
risks:
  - id: R-MAP_AND_GLOBE_WINDOW-1
    desc: "Provider variance (styles, quotas, CORS)"
    mitigation: "Tile Source Manager + Network Rules; fallback providers and offline cache"
---

## Purpose
Define the behavior of the main canvas window for 2D/3D modes and user affordances.

## UI elements
- CRS badge (click → change), scale bar, compass, zoom controls, attribution strip.
- 2D/3D toggle, terrain toggle, provider switch (quick pick from cfg/providers).

## Behavior
- Persist mode per project; copy camera/selection when toggling modes.
- Min/max zoom/tilt; optional "lock north up" and "constrain to ground".

## Accessibility
- Keyboard focus order; tooltip delays; larger hit targets for controls.

## Observability
- `uv.ui.mode.toggle`, `uv.ui.control.invoked`

## Acceptance
- Toggling 2D/3D with terrain on mid scenes stays above 45 FPS (p95) during flight.
