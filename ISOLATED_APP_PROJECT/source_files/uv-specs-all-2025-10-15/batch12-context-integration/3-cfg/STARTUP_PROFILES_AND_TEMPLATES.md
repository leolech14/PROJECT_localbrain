---
spec_id: STARTUP_PROFILES_AND_TEMPLATES
title: Startup Profiles & Templates
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
  events_namespace: uv.startup.profiles.and.templates
  metrics_prefix: uv.startup.profiles.and.templates
risks:
  - id: R-STARTUP_PROFILES_AND_TEMPLATES-1
    desc: Fragmented UX across modules; discoverability gaps
    mitigation: Shared patterns, command palette entries, onboarding tours, metrics-informed iteration
category: 3-cfg
flavor: reference
updated: '2025-10-15'
---

## Purpose
Let users launch into a tailored workspace quickly (Lite/Core/Pro) and start from ready
**templates** that reflect common tasks.

## Profiles
- Lite/Core/Pro map to Feature Flags (Batch 0) and panels availability; user can switch anytime.

## Templates
- JSON recipe files with thumbnail; open from Project Hub; resolve providers; prompt for keys.

## Observability
- `uv.startup.profile.selected`, `uv.template.created|opened`

## Acceptance
- Switching profile reloads flags safely; template opens with all panels preconfigured.

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
