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

# batch11-scripting-extensibility — Scripting & Extensibility (optional Pro)

This batch makes the viewer programmable and extensible while keeping security tight.
It defines the **JS scripting engine** (sandboxed), an optional **Python bridge**, a
**plugin model** (data readers, renderers, operators, palette commands), and a
**scripting policy** for permissions & prompts.

**Reading order**
1. `1-mod/SCRIPTING_ENGINE_JS.md`
2. `1-mod/PLUGIN_MODEL.md`
3. `1-mod/PYTHON_BRIDGE.md` (optional; behind feature flag)
4. `3-cfg/SCRIPTING_POLICY.md`

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
