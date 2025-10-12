---
spec_id: LB-DATA-POOL-002
title: Data Pool accepts writes and supports ranked queries
required_events:
- pool.write
- pool.query
acceptance:
- pool.write followed by pool.query returning >=1 result
---

# Data Pool accepts writes and supports ranked queries

**Objective:** Validate runtime events and acceptance rules.

**How to run:**
```bash
export LB_SPEC_COVERAGE_DIR=./spec-logs-example
node ./specctl/dist/specctl.js run --logs "$LB_SPEC_COVERAGE_DIR/**/*.jsonl" --specs "./SPEC/features/LB-DATA-POOL-002.spec.md"
```
