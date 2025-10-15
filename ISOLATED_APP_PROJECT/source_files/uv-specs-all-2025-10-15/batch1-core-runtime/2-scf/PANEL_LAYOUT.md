---
spec_id: PANEL_LAYOUT
title: Panel Layout (Left Sidebar)
version: 0.1.0
owner: Leo
status: draft
batch: 1
created: 2025-10-15
promotion_gates:
  i1:
    - "Public interfaces stubbed; invariants documented"
    - "Events & metrics cataloged"
  i2:
    - "Worked example with sample data"
    - "Contract tests specified"
  i3:
    - "Performance and memory budgets verified on canonical scenes"
    - "Failure modes & UX errors defined"
  complete:
    - "Adopted with passing gates; docs and samples merged"
observability:
  events_namespace: uv.panel.layout
  metrics_prefix: uv.panel.layout
risks:
  - id: R-PANEL_LAYOUT-1
    desc: "Interface drift vs. electron/web constraints"
    mitigation: "Lock TS types; IPC contracts with version keys"
---

## Tabs
- Layers / Inspector / Style / Data / Transform / Camera / Operators / Perf / Settings

## Schema-driven
- Controls are generated from the UI schema; visibility conditions respected.

## Interaction
- Selecting an entity focuses its Inspector section.
- Presets per panel; global "View Recipe" snapshots all panels.

## Keyboard & A11y
- Tab order predictable; command palette (⇧⌘P) for actions; focus outlines.
