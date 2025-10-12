---
spec_id: LB-VOICE-INDICATOR-UI-001
title: VoiceIndicator renders and reacts to audio metrics
required_events:
- VoiceIndicatorView.render.success
- voice.metrics
acceptance:
- render.success present; voice.metrics amplitude > 0 observed
---

# VoiceIndicator renders and reacts to audio metrics

**Objective:** Validate runtime events and acceptance rules.

**How to run:**
```bash
export LB_SPEC_COVERAGE_DIR=./spec-logs-example
node ./specctl/dist/specctl.js run --logs "$LB_SPEC_COVERAGE_DIR/**/*.jsonl" --specs "./SPEC/features/LB-VOICE-INDICATOR-UI-001.spec.md"
```
