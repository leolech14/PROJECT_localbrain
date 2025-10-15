---
spec_id: PLANNER_VALIDATION_AND_SAFETY
title: Planner Validation & Safety Playbook
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
  events_namespace: uv.planner.validation.and.safety
  metrics_prefix: uv.planner.validation.and.safety
risks:
  - id: R-PLANNER_VALIDATION_AND_SAFETY-1
    desc: "Agent actions that surprise the user or violate policy"
    mitigation: "Dry-run, explicit confirmations, capability grants, undo-first policy"
---

## Purpose
Guarantee deterministic execution and user control when an LLM proposes actions.

## Stages
1. Parse: map utterance → typed intent(s); confidence and rationale.
2. Plan: propose steps using only catalog tools; include invariants and expected diffs.
3. Validate: schema + permissions + invariants; compute dry-run; surface preview.
4. Confirm: explicit user consent (or policy auto-consent for safe ops).
5. Execute: dispatch to Operators; capture undo patches.
6. Audit: record all stages with correlation IDs; allow export.

## Failure modes & responses
- Ambiguity → ask clarifying question with multiple-choice intents.
- Rejection by guard → show reason and how to grant/adjust.
- Partial failure → rollback using undo patches.

## Metrics
- Plan success rate, guard rejection rate, undo rollback success, mean intent latency.
