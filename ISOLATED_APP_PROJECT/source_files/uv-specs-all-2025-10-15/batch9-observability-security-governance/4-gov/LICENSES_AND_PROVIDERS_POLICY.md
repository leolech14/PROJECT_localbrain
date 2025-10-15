---
spec_id: LICENSES_AND_PROVIDERS_POLICY
title: Licenses & Providers Policy (Governance)
version: 0.1.0
owner: Leo
status: draft
batch: 9
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to Batches 0–8 resolved
    - Interfaces, events, and metrics named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Golden traces/snapshots attached; policy checklists completed
    - Observability wiring verified end-to-end
  complete:
    - All gates green; consistency checks passed; living links in INDEX
observability:
  events_namespace: uv.licenses.and.providers.policy
  metrics_prefix: uv.licenses.and.providers.policy
risks:
  - id: R-LICENSES_AND_PROVIDERS_POLICY-1
    desc: Excessive telemetry causing perf or privacy regressions
    mitigation: Sampling, redaction, consent; budgets enforced at compile-time
category: 4-gov
flavor: reference
updated: '2025-10-15'
---

## Purpose
Document and enforce provider attribution, license surfacing, and third‑party notices.

## Providers
- Attribution requirements in HUD and exports; text and logos; offline posture.
- Key handling: OS keychain; never in `.uvscene.json` or recipes; redaction in logs.

## Third-party code
- SPDX IDs in a `THIRD_PARTY_NOTICES` registry; surfaces in Settings and export metadata.
- License scanner (CI) validates that binaries ship correct notices.

## Compliance
- Map data license nuances (e.g., ODbL/CC-BY/© credits); example strings; placement rules.
- CI policy lints: fail when missing attributions for configured providers.

## Acceptance
- HUD shows correct credits; exports optionally embed credits; CI lints pass on fixtures.

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
