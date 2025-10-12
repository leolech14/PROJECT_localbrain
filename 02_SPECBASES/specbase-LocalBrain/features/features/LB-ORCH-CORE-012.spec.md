---
spec_id: LB-ORCH-CORE-012
title: Central orchestrator emits plan/execute/synthesize phases
version: 1.0.0
owners: [orchestration]
status: ready
platforms: [electron, ios]
priority: p0
probes_required: ["ci.respond"]
acceptance_criteria:
  - ac_id: AC-1101
    text: For a complex request, orchestrator emits at least two phase markers (plan and execute) before final synthesis.
tests:
  - id: T-ORCH-CORE-001
    platforms: [electron]
    steps:
      - action: app.launch
      - action: say
        params: { text: "Find README, extract key points, and draft a summary." }
      - action: assert
        params: { ac_id: AC-1101, kind: event_occurs, event: "ci.respond" }
assertions:
  - ac_id: AC-1101
    kind: event_occurs
    event: "ci.respond"
---
Implementation note: keep phases lightweight; streaming text continues uninterrupted.
