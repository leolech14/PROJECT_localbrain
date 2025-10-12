---
spec_id: LB-ORCH-CORE-001
title: "Central Intelligence orchestrates inputs \u2192 context \u2192 agents \u2192\
  \ response"
required_events:
- orch.input.received
- orch.context.selected
- orch.agents.deployed
- orch.response.emitted
acceptance:
- At least one orch.input.received
- Exactly one orch.response.emitted per input
---

# Central Intelligence orchestrates inputs → context → agents → response

**Objective:** Validate runtime events and acceptance rules.

**How to run:**
```bash
export LB_SPEC_COVERAGE_DIR=./spec-logs-example
node ./specctl/dist/specctl.js run --logs "$LB_SPEC_COVERAGE_DIR/**/*.jsonl" --specs "./SPEC/features/LB-ORCH-CORE-001.spec.md"
```
