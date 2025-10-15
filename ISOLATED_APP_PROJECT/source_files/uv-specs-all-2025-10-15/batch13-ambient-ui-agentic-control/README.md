---
spec_id: README
title: README
version: 0.1.0
owner: Leo
status: draft
batch: '?'
category: 3-cfg
flavor: reference
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

# batch13-ambient-ui-agentic-control — Ambient UI & Agentic Control

This batch formalizes Leo's underwater ambient space and the widget-based desktop for the
viewer shell, and specifies the LocalBrain agent bridge so voice/LLM can plan → dry-run → execute
deterministically using the existing Operator/Permissions/Event Bus frameworks.

**Reading order**
1. `1-mod/AMBIENT_SCENE.md`
2. `1-mod/WIDGET_SYSTEM.md`
3. `1-mod/AGENT_BRIDGE.md`
4. `1-mod/INTENT_SCHEMA.md`
5. `2-scf/SIDEBAR_AND_WIDGET_DOCK.md`
6. `2-scf/VOICE_UI_AND_TRANSCRIPTS.md`
7. `3-cfg/AGENT_PERMISSIONS_AND_GUARDS.md`
8. `5-ops/PLANNER_VALIDATION_AND_SAFETY.md`

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
