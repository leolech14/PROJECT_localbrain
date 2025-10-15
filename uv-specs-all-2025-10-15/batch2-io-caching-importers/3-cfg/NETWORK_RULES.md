---
spec_id: NETWORK_RULES
title: Network Rules & Policies
version: 0.1.0
owner: Leo
status: draft
batch: 2
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to Batch 0/1 resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference importer notes/prototypes attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.network.rules
  metrics_prefix: uv.network.rules
risks:
  - id: R-NETWORK_RULES-1
    desc: "Large file handling and UI stalls"
    mitigation: "Workers, chunked IO, staged commits, cancellation"
---

## Purpose
Control who we talk to, how, and with what headers/auth.

## Allowlist & modes
- Allowlist of domains/patterns; **offline mode** (deny network) and **captive mode** (only local providers).

## Headers/tokens
- Per-domain header injection; token storage via OS keychain; renewal hooks.

## CORS
- Preflight handling guidance; suggest local proxy when needed (dev).

## Telemetry
- Opt-in only; anonymized; redact file paths; include explicit user consent in Settings.

## Acceptance
- Requests to non-allowlisted domains blocked with user-visible errors.
