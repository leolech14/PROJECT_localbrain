---
spec_id: VOICE_UI_AND_TRANSCRIPTS
title: Voice UI & Transcripts
version: 0.1.0
owner: Leo
status: draft
batch: 13
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Prototype notes and golden flows attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.voice.ui.and.transcripts
  metrics_prefix: uv.voice.ui.and.transcripts
risks:
  - id: R-VOICE_UI_AND_TRANSCRIPTS-1
    desc: "Agent actions that surprise the user or violate policy"
    mitigation: "Dry-run, explicit confirmations, capability grants, undo-first policy"
---

## Purpose
Real-time voice interaction with partial and final transcripts, visible state, and control.

## Pipeline
- VAD → ASR (on-device by default) → partials stream → NLU → intent candidates (ranked).
- UI shows live transcript with entity highlights; “Say 'Do it' to execute” rule.
- Push-to-talk & wake-word options; privacy indicator when mic is active.

## Events
- `uv.voice.partial`, `uv.voice.final`, `uv.voice.error`.
- Link to Agent events for plan/execute.

## Acceptance
- Partial updates under latency budget; explicit execute phrase required for actions.
