---
spec_id: ONBOARDING_AND_HELP
title: Onboarding & Help (Tour, Tips, Docs Links)
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
  events_namespace: uv.onboarding.and.help
  metrics_prefix: uv.onboarding.and.help
risks:
  - id: R-ONBOARDING_AND_HELP-1
    desc: Fragmented UX across modules; discoverability gaps
    mitigation: Shared patterns, command palette entries, onboarding tours, metrics-informed iteration
category: 2-scf
flavor: codegen
updated: '2025-10-15'
---

## Objectives
Make first 10 minutes productive: explain canvas, layers, panel schema, and command palette.

## Elements
- **First-run tour**: 5–7 steps; keyboard-first; reduced motion variant.
- **Context tips**: subtle hints the first time you open a panel or use a tool.
- **Help panel**: searchable docs; deep links to website; sample scenes open in one click.

## Integration
- Command Palette exposes commands for tour, tips, and help searches.

## Observability
- `uv.onboarding.tour.start|end|skip`, `uv.help.search`

## Acceptance
- Tour completion rate tracked; help search < 100 ms; tips never block interactions.

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
