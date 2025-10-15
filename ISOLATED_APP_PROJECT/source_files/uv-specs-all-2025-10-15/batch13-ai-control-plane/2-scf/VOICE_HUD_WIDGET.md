---
spec_id: VOICE_HUD_WIDGET
title: Voice HUD Widget (Preview • Do • Explain)
version: 0.1.0
owner: Leo
status: draft
batch: 13
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Security model, scopes, and prompts validated
  i3:
    - Golden plans and audit examples attached; schema validators
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.voice.hud.widget
  metrics_prefix: uv.voice.hud.widget
risks:
  - id: R-VOICE_HUD_WIDGET-1
    desc: Over-broad AI control or misinterpretation of UI state
    mitigation: Role-scoped sessions, dry-run previews, explain/confirm gates, audit
category: 2-scf
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Provide a small, non-blocking widget that shows transcript, intents, plan chips, and status.

## UI
- Transcript with timestamps; action **chips** per intent and overall **Plan**.
- Buttons: **Preview**, **Do**, **Explain**, **Cancel**.
- Status icons: role, scopes, rate-limit state.

## Behavior
- Always **preview first** (unless safe and whitelisted). Tooltip shows diffs summary.
- **Explain** renders plan steps in friendly language with links to controls.

## Performance
- Open ≤ 16 ms; chip clicks ≤ 50 ms; renders off main thread where possible.

## Observability
- `uv.ai.hud.opened|closed`, `uv.ai.hud.preview|commit|explain|cancel`.

## Acceptance
- Users can follow/override plan reliably; dangerous ops demand extra confirmation and reason.

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
