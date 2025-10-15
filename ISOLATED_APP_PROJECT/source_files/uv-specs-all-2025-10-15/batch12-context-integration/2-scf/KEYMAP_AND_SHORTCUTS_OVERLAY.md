---
spec_id: KEYMAP_AND_SHORTCUTS_OVERLAY
title: Keymap & Shortcuts Overlay
version: 0.1.0
owner: Leo
status: draft
batch: 12
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference flows and screenshots attached; copy reviewed
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.keymap.and.shortcuts.overlay
  metrics_prefix: uv.keymap.and.shortcuts.overlay
risks:
  - id: R-KEYMAP_AND_SHORTCUTS_OVERLAY-1
    desc: Fragmented UX across modules; discoverability gaps
    mitigation: Shared patterns, command palette entries, onboarding tours, metrics-informed iteration
category: 2-scf
flavor: codegen
updated: '2025-10-15'
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
