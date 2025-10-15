---
spec_id: PLUGIN_MODEL
title: Plugin Model (Readers, Renderers, Operators, Commands)
version: 0.1.0
owner: Leo
status: draft
batch: 11
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Security model reviewed; capability grants enumerated
  i3:
    - Reference sandbox & two sample plugins implemented
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency/security audits passed
observability:
  events_namespace: uv.plugin.model
  metrics_prefix: uv.plugin.model
risks:
  - id: R-PLUGIN_MODEL-1
    desc: Script/plugin escaping sandbox or overusing resources
    mitigation: Hard sandbox, caps/timeouts, permissions prompts, code review/signing
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Allow third-parties (including you) to extend the viewer via **capability-based plugins**.

## Plugin kinds
- **Data Reader**: decode a new file format to canonical structures (Arrow, GeoJSON).
- **Layer Renderer**: provide a new Layer kind or override styling for an existing one (flagged).
- **Operator**: new tools that mutate data/style/transform with undo.
- **Command**: add palette commands mapped to actions.

## Manifest
```json
{
  "name": "@acme/uv-plugin-buffer",
  "version": "1.0.0",
  "uv": {
    "apis": ["operator"],
    "caps": ["fs.read", "net.request"],
    "contributions": {
      "operators": [{"id":"op.vector.buffer","label":"Buffer","paramsSchema":{...}}],
      "readers": [{"id":"reader.customcsv","ext":[".ccsv"],"mime":["text/x-ccsv"]}],
      "commands": [{"id":"cmd.acme.hello","title":"ACME Hello"}]
    }
  },
  "signature": "..."  // optional signing block
}
```

## Loading & isolation
- Loaded into **plugin worker** with the same sandbox as scripts; communicates via message ports.
- No direct DOM/Electron; must use `uv` facade.
- **Trust levels**: signed (trusted), unsigned (prompt), local dev (dev mode only).

## Lifecycle
- Discover → Validate manifest → Prompt caps → Load worker → Register contributions.
- Disable/enable/uninstall via Settings; persistent trust remembered.

## UI integration
- Operators appear in **Operators Panel** and **Command Palette** with category & search tags.
- Readers register with Sniffers (Batch 2) and show source in Data Panel when triggered.

## Observability
- `uv.plugin.install|enable|disable|error`, load ms, rejected caps.

## Acceptance
- Sample reader/operator plugins install and operate within caps; undo/redo works; palette discovery instant.

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
