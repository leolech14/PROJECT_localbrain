---
spec_id: OPERATORS_AND_UNDO
title: Operators & Undo Model
version: 0.1.0
owner: Leo
status: draft
batch: 7
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference UX flows & keyboard maps attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.operators.and.undo
  metrics_prefix: uv.operators.and.undo
risks:
  - id: R-OPERATORS_AND_UNDO-1
    desc: "Inconsistent operator behavior across layer kinds"
    mitigation: "Single Operator model + conformance tests per kind"
---

## Purpose
Define a unified **Operator** pattern for all user actions (with preview/cancel/undo/redo),
ensuring deterministic updates and consistent UI/observability.

## Model
```ts
type OperatorState = "idle"|"preview"|"applied"|"canceled";
interface Operator<TParams, TUndoPayload> {
  id: string;
  label: string;
  params: TParams;
  preview(params: TParams): PreviewResult;            // non-destructive, transient
  apply(params: TParams): TUndoPayload;               // commits; returns undo payload
  undo(payload: TUndoPayload): void;                  // revert
  redo(payload: TUndoPayload): void;                  // re-apply
}
```
- **Non-destructive previews** render via transient overlays/HUD, never mutating scene state.
- **Apply** is atomic; a single history entry per operator (even if many internal changes).

## Examples
- `op.style.patch` (layerId, patch) → undo = inverse patch
- `op.transform.edit` (matrix delta) → undo = inverse transform matrix
- `op.filter.sql` (layerId, sql) → undo = previous filter
- `op.selection.brush` (ids) → no undo entry (ephemeral), but `op.selection.commit` can persist

## History
- Bounded stack with memory caps; compress adjacent compatible edits (e.g., many style patches → one entry).
- Cross-scene safety: history clears on project change unless explicitly preserved.

## Events
- `uv.op.start|preview|apply|cancel|undo|redo` with `{id, layerId?, cost_ms}`.

## Acceptance
- Replay history yields identical visual state; cancel always restores pre-op state exactly.
