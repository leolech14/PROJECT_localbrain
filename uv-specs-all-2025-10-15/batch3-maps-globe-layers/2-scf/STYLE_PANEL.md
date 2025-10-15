---
spec_id: STYLE_PANEL
title: Style Panel (Symbolizers, Ramps, Transfer Functions)
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
  events_namespace: uv.style.panel
  metrics_prefix: uv.style.panel
risks:
  - id: R-STYLE_PANEL-1
    desc: "Provider variance (styles, quotas, CORS)"
    mitigation: "Tile Source Manager + Network Rules; fallback providers and offline cache"
---

## Purpose
Provide a schema-driven style editor covering vector/mesh/raster basics used in maps & globe.

## Controls
- Color pickers with perceptual ramps (OKLCH-aware); numeric sliders with units; enum dropdowns; transfer function widget.
- Visibility conditions from schema; inline docs; presets per layer.

## Vector
- Symbol pickers, ramps (linear/quantile/equal intervals), legends with bins and counts.

## Raster
- Band mapping selector; histogram with draggable min/max/percentile handles; colormap preview.

## Mesh (for context)
- PBR material editor (base/metal/rough/emissive/normal); cull mode; wireframe toggle.

## Observability
- `uv.style.panel.opened`, `uv.style.preset.saved|loaded`

## Acceptance
- Editing common properties re-renders under 50 ms; presets apply under 100 ms.
