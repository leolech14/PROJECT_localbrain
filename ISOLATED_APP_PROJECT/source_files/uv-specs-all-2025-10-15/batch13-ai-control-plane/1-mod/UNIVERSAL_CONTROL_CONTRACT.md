---
spec_id: UNIVERSAL_CONTROL_CONTRACT
title: Universal Control Contract (UCC)
version: 0.1.0
owner: Leo
status: draft
batch: 13
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Security model, scopes, and prompts validated
  i3:
    - Golden plans and audit examples attached; schema validators
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.universal.control.contract
  metrics_prefix: uv.universal.control.contract
risks:
  - id: R-UNIVERSAL_CONTROL_CONTRACT-1
    desc: Over-broad AI control or misinterpretation of UI state
    mitigation: Role-scoped sessions, dry-run previews, explain/confirm gates, audit
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Expose **any UI control** (slider, toggle, select, color, text, gizmo, button) as a **stable,
addressable action surface** for the AI, with typed parameters, pre/post conditions, and dry-run.

## Control Capability Descriptor (CCD)
```ts
type CCD = {
  controlId: string;                 // stable path: e.g., "panel.style.raster.hillshade.intensity"
  widgetId: string;                   // owning widget
  label: string;
  kind: "slider"|"toggle"|"select"|"color"|"text"|"button"|"gizmo";
  paramsSchema: JSONSchema;           // typed params (e.g., {value:number,min,max,units})
  affects: Array<"style"|"data"|"transform"|"camera"|"export"|"settings">;
  destructive?: boolean;              // e.g., delete/reset
  preconditions?: string[];           // e.g., active layer kind == "raster"
  postconditions?: string[];          // sanity checks after apply
  previewable: boolean;               // supports dry-run
  version: string;
}
```

## Actions
```ts
simulate(controlId, params) -> DiffSummary
act(controlId, params) -> ApplyResult
explain(controlId) -> HumanText
focus(controlId) -> void // highlights & scrolls into view
```

## Contracts
- **Stability**: `controlId` is versioned and stable across minor releases (document breaking changes).
- **Dry-run**: `simulate` returns a **DiffSummary** with metrics/labels; **no state mutation**.
- **Side-effects**: CCD `affects` aligns with Operator kinds for undo granularity.
- **A11y/UX**: `focus` brings control on-screen and shows a safe highlight.

## Observability
- `uv.ai.control.reflect`, `uv.ai.control.simulate|act|explain|focus`.

## Acceptance
- For a given slider, AI can preview a param and commit with correct bounds/clamping; undo works; CCD enumerates constraints.

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
