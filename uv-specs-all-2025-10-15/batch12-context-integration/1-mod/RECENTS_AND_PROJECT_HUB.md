---
spec_id: RECENTS_AND_PROJECT_HUB
title: Recents & Project Hub
version: 0.1.0
owner: Leo
status: draft
batch: 12
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference flows and screenshots attached; copy reviewed"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.recents.and.project.hub
  metrics_prefix: uv.recents.and.project.hub
risks:
  - id: R-RECENTS_AND_PROJECT_HUB-1
    desc: "Fragmented UX across modules; discoverability gaps"
    mitigation: "Shared patterns, command palette entries, onboarding tours, metrics-informed iteration"
---

## Purpose
Provide a **home screen** to continue work quickly and discover templates.

## Components
- **Recents**: last N projects/scenes with thumbnails, tags, last-opened, size, provider hints.
- **Favorites/Pins**: curated list; rename; add notes.
- **Templates**: ready-made scene recipes (lite/core/pro); open with provider prompts.

## Search
- Name, tags, provider, layer kinds; fuzzy match; keyboard-first navigation.

## Persistence
- Thumbnails rendered from view recipes; stored in app cache; invalidated on scene change.

## Observability
- `uv.hub.opened|search|open|pin|template.opened`

## Acceptance
- Recents render < 300 ms; opening a recent scene rehydrates within parity gates.
