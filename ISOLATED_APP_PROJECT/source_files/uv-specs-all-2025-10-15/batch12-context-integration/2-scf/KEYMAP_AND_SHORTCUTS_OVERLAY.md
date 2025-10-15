---
spec_id: KEYMAP_AND_SHORTCUTS_OVERLAY
title: Keymap & Shortcuts Overlay
version: 0.1.0
owner: Leo
status: draft
batch: 12
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference flows and screenshots attached; copy reviewed"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.keymap.and.shortcuts.overlay
  metrics_prefix: uv.keymap.and.shortcuts.overlay
risks:
  - id: R-KEYMAP_AND_SHORTCUTS_OVERLAY-1
    desc: "Fragmented UX across modules; discoverability gaps"
    mitigation: "Shared patterns, command palette entries, onboarding tours, metrics-informed iteration"
---

## Purpose
Expose and edit shortcuts in a **hold-to-view overlay** and a full settings page.

## Overlay
- Hold `?` to show overlay; sections by area (camera, selection, tools, panels).
- Context-aware: shows current conflicts; offers quick rebind.

## Editing
- Keymap in Settings (Batch 8); import/export; profile presets (Blender‑style, GIS‑style).

## Observability
- `uv.keymap.overlay.opened|closed`, `uv.keymap.rebind`

## Acceptance
- Overlay appears within 16 ms; rebind updates command palette and tooltips instantly.
