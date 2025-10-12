---
spec_id: LB-ORCH-002
title: Orchestrator schedules multi-step document processing while narration continues
version: 1.0.0
owners: [orchestration]
status: ready
platforms: [electron, ios]
priority: p0
probes_required: ["orchestrator.task", "tts.stream"]
acceptance_criteria:
  - ac_id: AC-0101
    text: Creating dependent tasks emits Queued→Running→Completed in order per task.
  - ac_id: AC-0102
    text: TTS narration continues during background task execution without gaps >1500ms.
tests:
  - id: T-ORCH-001
    platforms: [electron]
    steps:
      - action: app.launch
      - action: say
        params: { text: "Process the latest PDF in Downloads and summarize it." }
      - action: probe.expect
        params: { event: "orchestrator.task", where: "state == 'queued'", count_gte: 2 }
      - action: assert
        params: { ac_id: AC-0102, kind: duration_leq, metric: "tts.gap_ms_max", duration_ms: 1500 }
assertions:
  - ac_id: AC-0101
    kind: event_occurs
    event: "orchestrator.task.completed"
  - ac_id: AC-0102
    kind: duration_leq
    metric: "tts.gap_ms_max"
    duration_ms: 1500
---
Body.
