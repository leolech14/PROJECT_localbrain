---
spec_id: PRIVACY_AND_DATA_CLASSIFICATION
title: Privacy & Data Classification (Governance)
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
  events_namespace: uv.privacy.and.data.classification
  metrics_prefix: uv.privacy.and.data.classification
risks:
  - id: R-PRIVACY_AND_DATA_CLASSIFICATION-1
    desc: "Excessive telemetry causing perf or privacy regressions"
    mitigation: "Sampling, redaction, consent; budgets enforced at compile-time"
---

## Purpose
Provide clear **data classes** and handling rules that the app and specs comply with.

## Classes
- **Public** — sample datasets, telemetry without PII.
- **Internal** — typical project files, attributes not identifying individuals.
- **Sensitive** — any PII/PHI or regulated content; stricter prompts/log redaction.
- **Secrets** — tokens/keys; never persisted in projects or logs; OS keychain only.

## Rules
- Redact paths/usernames by default in logs; opt-in verbose with warning.
- Telemetry sampling disabled for Sensitive scenes unless explicitly enabled.
- Exports of data/models include a **provenance footer** (source hashes, time).

## Acceptance
- Classification banner visible per project; toggling class adjusts logging/sampling immediately.
