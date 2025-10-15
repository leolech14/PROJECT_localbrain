---
spec_id: SCIENTIFIC_MODE_WINDOW
title: Scientific Mode Window (Controls & UX)
version: 0.1.0
owner: Leo
status: draft
batch: 6
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Golden snapshots, transfer-function presets, and test volumes attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.scientific.mode.window
  metrics_prefix: uv.scientific.mode.window
risks:
  - id: R-SCIENTIFIC_MODE_WINDOW-1
    desc: Cross-engine camera/selection drift and depth interop
    mitigation: Linked state via adapters; no Z-buffer sharing; explicit conversions with tests
category: 2-scf
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Define the UI/UX for the scientific view: controls, layout, and behaviors consistent with
the left-panel schema model.

## UI elements
- **Transfer function editor** (histogram + control points); **sampling step** slider; **opacity scale**.
- **Slice widgets**: draggable planes (axial/coronal/sagittal), lock orthogonality toggle.
- **Iso value** slider (if iso tool enabled); export buttons (PNG/GLB).
- **Camera**: bookmarks shared with the main viewer; "match main camera" button.
- **Status**: dims, spacing, units, memory estimate, FPS.

## Shortcuts & a11y
- Same keymap family; focus order; tooltips; reduced motion support.

## Observability
- `uv.scimode.ui.opened`, `uv.scimode.ui.control.changed`, `uv.scimode.export`.

## Acceptance
- TF edits re-render within 2 frames; slice drag remains ≥ 45 FPS; export works and embeds current TF.

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
