---
spec_id: LB-REALTIME-006
title: Realtime session starts, calls at least one tool, ends
required_events:
- realtime.session.start
- realtime.tool.call
- realtime.session.end
acceptance:
- session.start before tool.call; session.end present
---

# Realtime session starts, calls at least one tool, ends

**Objective:** Validate runtime events and acceptance rules.

**How to run:**
```bash
export LB_SPEC_COVERAGE_DIR=./spec-logs-example
node ./specctl/dist/specctl.js run --logs "$LB_SPEC_COVERAGE_DIR/**/*.jsonl" --specs "./SPEC/features/LB-REALTIME-006.spec.md"
```
