---
spec_id: LB-CLAUDE-CLI-005
title: Claude Code CLI process emits stdout and ends successfully
required_events:
- claudecli.start
- claudecli.stdout
- claudecli.end
acceptance:
- exit_code == 0 on claudecli.end
---

# Claude Code CLI process emits stdout and ends successfully

**Objective:** Validate runtime events and acceptance rules.

**How to run:**
```bash
export LB_SPEC_COVERAGE_DIR=./spec-logs-example
node ./specctl/dist/specctl.js run --logs "$LB_SPEC_COVERAGE_DIR/**/*.jsonl" --specs "./SPEC/features/LB-CLAUDE-CLI-005.spec.md"
```
