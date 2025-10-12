---
spec_id: LB-PROVIDERS-001
title: Providers config loads and validates schema
required_events:
- config.loaded
- config.validated
acceptance:
- config.validated == true
---

# Providers config loads and validates schema

**Objective:** Validate runtime events and acceptance rules.

**How to run:**
```bash
export LB_SPEC_COVERAGE_DIR=./spec-logs-example
node ./specctl/dist/specctl.js run --logs "$LB_SPEC_COVERAGE_DIR/**/*.jsonl" --specs "./SPEC/features/LB-PROVIDERS-001.spec.md"
```
