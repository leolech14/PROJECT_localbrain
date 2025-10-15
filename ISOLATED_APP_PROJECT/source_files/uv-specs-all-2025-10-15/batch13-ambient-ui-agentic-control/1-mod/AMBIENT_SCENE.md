---
spec_id: AMBIENT_SCENE
title: Ambient Scene (Underwater Background)
version: 0.1.0
owner: Leo
status: draft
batch: 13
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Prototype notes and golden flows attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.ambient.scene
  metrics_prefix: uv.ambient.scene
risks:
  - id: R-AMBIENT_SCENE-1
    desc: "Agent actions that surprise the user or violate policy"
    mitigation: "Dry-run, explicit confirmations, capability grants, undo-first policy"
---

## Purpose
Replace empty backgrounds with a subtle underwater ambience that conveys depth without distracting from content.

## Visual design
- Layers: gradient depth fog, slow caustics, sparse particles (parallax), optional god‑rays.
- Controls: intensity (0..1), motion (0..1), color theme (OKLCH-based), reduced-motion toggle.
- Modes: paused when any heavy scene renders; minimal mode for low-power.

## Implementation
- Single full‑screen pass (offscreen) → composited behind scene.
- Normal-mapped caustics from 3D noise; temporal smoothing to avoid shimmer; particle field with fixed budget.
- Target GPU cost ≤ 1.5 ms p95 at 2k viewport (budgeted).

## Accessibility
- Respect system reduce motion; provide color-blind safe presets.

## Observability
- `uv.ambient.enabled`, `uv.ambient.quality.changed`, `uv.ambient.ms`

## Acceptance
- Idle view holds frame budget; toggling ambient has no visual artifacts or z-fighting.
