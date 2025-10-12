---
spec_id: LB-CONTEXT-SELECTOR-003
title: Context Selector ranks & packs within budget
required_events:
- context.rank
- context.pack
- context.budget
acceptance:
- context.pack.total_tokens <= context.budget.limit
---

# Context Selector ranks & packs within budget

**Objective:** Validate runtime events and acceptance rules.

**How to run:**
```bash
export LB_SPEC_COVERAGE_DIR=./spec-logs-example
node ./specctl/dist/specctl.js run --logs "$LB_SPEC_COVERAGE_DIR/**/*.jsonl" --specs "./SPEC/features/LB-CONTEXT-SELECTOR-003.spec.md"
```
