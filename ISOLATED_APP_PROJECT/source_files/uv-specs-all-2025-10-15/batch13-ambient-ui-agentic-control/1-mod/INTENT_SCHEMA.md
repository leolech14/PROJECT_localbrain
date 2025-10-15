---
spec_id: INTENT_SCHEMA
title: Intent & Action Schema (Typed, Deterministic)
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
  events_namespace: uv.intent.schema
  metrics_prefix: uv.intent.schema
risks:
  - id: R-INTENT_SCHEMA-1
    desc: "Agent actions that surprise the user or violate policy"
    mitigation: "Dry-run, explicit confirmations, capability grants, undo-first policy"
---

## Purpose
Define typed intents and actions as JSON schemas to bridge NLU and Operators safely.

## Intent (example)
```
{
  "intent": "layer.filter",
  "confidence": 0.82,
  "slots": {
    "layerRef": "downtown_buildings",
    "predicate": {"field":"height_m","op":">","value":50}
  },
  "utterance": "show me buildings over 50 meters in downtown"
}
```

## Plan (example)
```
{
  "version":"1.0",
  "id":"plan-173",
  "steps":[
    {"tool":"layer.select", "args":{"match":{"name":"San Francisco 3D Buildings"}}},
    {"tool":"layer.filter", "args":{"predicate":{"field":"height_m","op":">","value":50}}},
    {"tool":"camera.fly", "args":{"bookmark":"downtown_sf"}},
    {"tool":"panel.open", "args":{"id":"INSPECTOR"}}
  ],
  "confirm":"required"
}
```

## Tool Catalog
- Each tool has id, JSON Schema for args, sideEffects, undoPatch, permissions needed.
- Catalog exported to the agent; versioned with app.

## Validation
- Schema validation; permission check; dry-run computes affected counts and preview diffs.

## Observability
- `uv.agent.plan.validated`, `uv.agent.plan.rejected`.
