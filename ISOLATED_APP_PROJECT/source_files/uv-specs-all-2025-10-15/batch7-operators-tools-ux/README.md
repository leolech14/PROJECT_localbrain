---
spec_id: README
title: README
version: 0.1.0
owner: Leo
status: draft
batch: '?'
category: 2-scf
flavor: codegen
created: '2025-10-15'
updated: '2025-10-15'
promotion_gates:
  i1:
    - Front matter valid against schema v2
    - All 12 sections present
  i2:
    - Unit and integration tests implemented and green
  i3:
    - GPU snapshot and perf gates pass on perf scenes
  complete:
    - Docs done; sample recipe added; release notes drafted
observability:
  events_namespace: uv.readme
  metrics_prefix: uv.readme
  event_list: []
---

# batch7-operators-tools-ux — Operators, Tools & UX

This batch delivers the **hands of the app**: the Operator model with undo/redo,
measurement tools, snapping & alignment, compare tools, camera paths/recording, and
the UX scaffolding (Layers panel, Operators panel, Command Palette).

**Reading order**
1. `1-mod/OPERATORS_AND_UNDO.md`
2. `1-mod/MEASUREMENT_TOOLS.md`
3. `1-mod/SNAP_AND_ALIGN.md`
4. `1-mod/COMPARE_TOOLS.md`
5. `1-mod/CAMERA_PATHS_AND_RECORDING.md`
6. `1-mod/PRESET_SYSTEM.md`
7. `2-scf/LAYERS_PANEL.md`
8. `2-scf/OPERATORS_PANEL.md`
9. `2-scf/COMMAND_PALETTE.md`

See `IMPLEMENTATION_REPORT.md` for acceptance demos and promotion gates.

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
