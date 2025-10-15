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

# batch13-ai-control-plane — AI Control Plane & Universal Control Contract

This batch introduces a **deterministic AI control layer** that can safely drive **any control**
in the Universal Viewer via a typed **Universal Control Contract (UCC)**. It connects voice/chat
(LocalBrain) to Operators and **exposes UI controls** through a reflection protocol with roles,
scopes, and audit. It includes the **Voice HUD** and a full **intent schema**.

**Reading order**
1. `1-mod/AI_CONTROL_PLANE.md`
2. `1-mod/UNIVERSAL_CONTROL_CONTRACT.md`
3. `1-mod/CONTROL_REFLECTION_PROTOCOL.md`
4. `1-mod/LOCALBRAIN_BRIDGE.md`
5. `3-cfg/UV_INTENT_SCHEMA.md`
6. `3-cfg/AI_POLICY_LIMITS.md`
7. `4-gov/AI_USER_ACCESS_AND_ROLES.md`
8. `2-scf/VOICE_HUD_WIDGET.md`

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
