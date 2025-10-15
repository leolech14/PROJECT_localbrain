---
spec_id: OPERATORS_PANEL
title: Operators Panel (Discovery, Status, Cancel)
version: 0.1.0
owner: Leo
status: draft
batch: 7
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference UX flows & keyboard maps attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.operators.panel
  metrics_prefix: uv.operators.panel
risks:
  - id: R-OPERATORS_PANEL-1
    desc: Inconsistent operator behavior across layer kinds
    mitigation: Single Operator model + conformance tests per kind
category: 2-scf
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Discover operators, show running ones with statuses and afford cancel/rollback.

## Sections
- **Discover**: searchable list with categories and hotkeys.
- **Running**: active operators with progress; cancel buttons; logs link.
- **History**: recent ops with undo/redo and details.

## Observability
- `uv.ui.ops.search`, `uv.ui.ops.cancel`, `uv.ui.ops.undo|redo`.

## Acceptance
- Search over 200+ operators < 50 ms; cancel stops importer or long ops within 500 ms.

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
