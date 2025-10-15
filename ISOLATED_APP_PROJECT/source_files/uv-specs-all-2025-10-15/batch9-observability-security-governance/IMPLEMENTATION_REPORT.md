---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 9)
version: 0.1.0
owner: Leo
status: draft
batch: 9
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
Profiler & Metrics, Event Bus & Agents, Permissions Service; governance docs for licenses/providers,
risk register, and privacy/data classification.

## Acceptance demos (for 'complete')
1. **Golden Frame Trace** — Capture `uv.render.frame` with per-pass breakdown; export profile; verify budgets and sampling.
2. **IO Trace** — Record `uv.io.*` for a tile-heavy scene; cache hit ≥ 0.6; p95 tile latency under threshold; logs redact file paths.
3. **Permission Wall** — Access a non-allowlisted URL; request blocked with actionable prompt; audit log entry created; allow-once works.
4. **Agent Hook** — External webhook receives `uv.layer.added` and `uv.export.image.end` with signed payload; rate limit enforced.
5. **License Surfacing** — Provider attributions visible; HUD credit toggle works; offline mode shows cached license blurb; policy lints pass in CI.
6. **Risk Drill** — One risk escalates; owner, mitigation, and status updated; surfaced in Logs/Perf warnings pane.

## Perf gates
- Telemetry sampling cost < 1 ms/frame (p95) at default rate; memory overhead of ring buffers < 64 MB.
- Event bus dispatch p95 < 2 ms per burst of 500 events; backpressure applied above thresholds.

## Observability checks
- Events: `uv.render.frame`, `uv.io.*`, `uv.tiles.*`, `uv.op.*`, `uv.export.*`, `uv.perm.*`, `uv.agent.*`.
- Metrics: frame time, draw calls, IO latency p95, cache hit rate, permission prompts, webhook latency.

## Risks & mitigations
- Log volume — sampling with dynamic throttles; redaction; feature flags for noisy subsystems.
- Permission fatigue — sensible defaults and granular scopes with remember-for-session.

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
