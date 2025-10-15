---
spec_id: RISK_REGISTER
title: Risk Register (Living)
version: 0.1.0
owner: Leo
status: draft
batch: 9
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to Batches 0–8 resolved"
    - "Interfaces, events, and metrics named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Golden traces/snapshots attached; policy checklists completed"
    - "Observability wiring verified end-to-end"
  complete:
    - "All gates green; consistency checks passed; living links in INDEX"
observability:
  events_namespace: uv.risk.register
  metrics_prefix: uv.risk.register
risks:
  - id: R-RISK_REGISTER-1
    desc: "Excessive telemetry causing perf or privacy regressions"
    mitigation: "Sampling, redaction, consent; budgets enforced at compile-time"
---

## Purpose
Track material risks, owners, severities, and mitigations with links to specs and issues.

## Template
```yaml
- id: R-0001
  title: Point cloud memory pressure
  category: Performance
  severity: High
  likelihood: Medium
  owner: Leo
  mitigation: "Point budget, eviction, density controls"
  status: Tracking
  links: ["batch4-3d-geometry-tiles-pointclouds/1-mod/POINT_CLOUD_LAYER.md"]
```
## Process
- Weekly review; statuses: Tracking → Mitigated → Accepted → Closed.
- Escalations surface in Logs/Perf warnings; action items link to issues.

## Acceptance
- Risk changes reflect in UI within session; owners notified (agent/webhook optional).
