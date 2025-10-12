---
spec_id: LB-AGENT-DEPLOY-004
title: "Agent deploy \u2192 progress \u2192 complete lifecycle"
required_events:
- agent.deploy
- agent.progress
- agent.complete
acceptance:
- deploy occurs before complete
---

# Agent deploy → progress → complete lifecycle

**Objective:** Validate runtime events and acceptance rules.

**How to run:**
```bash
export LB_SPEC_COVERAGE_DIR=./spec-logs-example
node ./specctl/dist/specctl.js run --logs "$LB_SPEC_COVERAGE_DIR/**/*.jsonl" --specs "./SPEC/features/LB-AGENT-DEPLOY-004.spec.md"
```
