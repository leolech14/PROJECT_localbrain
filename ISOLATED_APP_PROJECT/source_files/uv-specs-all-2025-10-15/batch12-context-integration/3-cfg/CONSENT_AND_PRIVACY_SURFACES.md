---
spec_id: CONSENT_AND_PRIVACY_SURFACES
title: Consent & Privacy Surfaces
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
  events_namespace: uv.consent.and.privacy.surfaces
  metrics_prefix: uv.consent.and.privacy.surfaces
risks:
  - id: R-CONSENT_AND_PRIVACY_SURFACES-1
    desc: Fragmented UX across modules; discoverability gaps
    mitigation: Shared patterns, command palette entries, onboarding tours, metrics-informed iteration
category: 3-cfg
flavor: reference
updated: '2025-10-15'
---

## Principles
- Explicit opt‑in; clear value; reversible at any time; minimal data; redaction by default.

## Surfaces
- **First-run modal** with choices (Off/On granular), links to policy; defaults Off.
- **Settings** reflect state; quick toggle; explain sampling and categories.
- **Per-feature prompts** (e.g., crash reports) with clear scope and persistence choice.

## Data
- No PII; file paths redacted; provider keys never transmitted; metrics aggregated/sampled.

## Observability
- `uv.consent.prompt.shown|accepted|declined`, category toggles.

## Acceptance
- Consent decisions persisted; exports reflect redaction; disabling stops further sends immediately.

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
