---
spec_id: LB-DATA-POOL-011
title: Unified data pool feeds orchestrator, memory, and UI
version: 1.0.0
owners: [platform]
status: ready
platforms: [electron, ios, web]
priority: p0
probes_required: ["ci.respond", "memory.ingest", "memory.query", "log.event"]
acceptance_criteria:
  - ac_id: AC-1001
    text: Orchestrator writes a structured turn summary into the data pool after each user turn.
  - ac_id: AC-1002
    text: Memory ingest receives the summary and retrieval returns it with a source tag and path.
tests:
  - id: T-DATA-POOL-001
    platforms: [electron, ios]
    steps:
      - action: app.launch
      - action: say
        params: { text: "Summarize this session status." }
      - action: assert
        params: { ac_id: AC-1001, kind: event_occurs, event: "ci.respond" }
assertions:
  - ac_id: AC-1002
    kind: event_occurs_any
    event: ["memory.ingest", "memory.query"]
evidence:
  telemetry_dump: true
---
Rationale: A single pool (session log + vector snippets) allows all modules to "drink from the same soup".
