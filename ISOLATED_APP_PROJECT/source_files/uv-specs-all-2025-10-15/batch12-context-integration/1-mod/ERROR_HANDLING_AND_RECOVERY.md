---
spec_id: ERROR_HANDLING_AND_RECOVERY
title: Error Handling & Recovery Patterns
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
  events_namespace: uv.error.handling.and.recovery
  metrics_prefix: uv.error.handling.and.recovery
risks:
  - id: R-ERROR_HANDLING_AND_RECOVERY-1
    desc: Fragmented UX across modules; discoverability gaps
    mitigation: Shared patterns, command palette entries, onboarding tours, metrics-informed iteration
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Philosophy
Fail **loud, actionable, and recoverable**. Preserve scene state; never freeze UI.

## Patterns
- **Toast + Details**: short message + link to Logs with correlation ID.
- **Inline Panel Errors**: display near the control causing it; offer reset.
- **Retry & Backoff**: for network/importer issues; visible status and next retry time.
- **Auto-save**: project autosaves before risky ops; restore prompt on crash recovery.

## Error taxonomy
- User errors (bad path/format), Provider errors (429/403), System errors (OOM), Importer errors (parse), Renderer errors (GPU).

## Observability
- `uv.error.reported`, `uv.error.recovered`, `uv.error.crash.recovered`

## Acceptance
- Kill importer worker mid-job → UI remains responsive; job marked failed; retry works; autosave intact.

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
