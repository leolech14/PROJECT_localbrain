---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 13)
version: 0.1.0
owner: Leo
status: draft
batch: 13
created: 2025-10-15T00:00:00.000Z
category: 3-cfg
flavor: reference
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
  events_namespace: uv.implementation.report
  metrics_prefix: uv.implementation.report
  event_list: []
---

## Scope
Ambient Scene (underwater), Widget System & Dock, LocalBrain Agent Bridge (intent→action),
Intent Schema (typed), Voice UI & transcripts, Agent permissions/guards, Planner validation & safety.

## Acceptance demos (for 'complete')
1. **Ambient Idle** — Empty scene shows underwater ambient at ≤ 1.5 ms GPU/frame p95; reduced-motion disables caustics/particles.
2. **Widget Play** — Create 4 widgets (Chart, Logs, Style, Mini‑Map); drag/snap, resize; layout persists in project; FPS ≥ 45 while dragging.
3. **Voice Intent** — User says: "Show me buildings over 50 meters in downtown SF". Agent plan: open tileset → apply height filter → fly camera → open inspector. Dry‑run visible; execute after consent; undo works.
4. **Deterministic Plan** — Ambiguous utterance triggers clarifying prompt with two options; agent proposes Plan JSON; user picks; plan re‑validates; execution logs to `uv.agent.*` and Permissions prompts are honored.
5. **Safety & Guards** — Agent attempts net request to non‑allowlisted host: blocked; user can grant in Extensions/Permissions; retry succeeds; logs/audit reflect decisions.

## Perf/UX gates
- Widget drag latency < 16 ms p95; snap decisions < 8 ms; layout commit < 50 ms.
- ASR partials → intent candidate < 200 ms p95 locally; “execute” only after finalization.
- Agent dry‑run render < 120 ms; plan JSON < 4 KB typical; undo/redo < 30 ms.

## Observability checks
- `uv.ambient.enabled|quality.changed`, `uv.widget.create|move|resize|close`, `uv.agent.intent|plan|dryrun|execute|undo|deny`, `uv.voice.partial|final`.
- Metrics: ambient shader ms, widget layout ops/s, intent latency, plan success rate, denied actions count.

## Risks & mitigations
- Surprising actions → undo‑first policy, dry‑run previews, capability grants; speech-only execution requires explicit “do it” phrase.
- Voice privacy → on‑device ASR by default; redaction toggles; audit logs.

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
