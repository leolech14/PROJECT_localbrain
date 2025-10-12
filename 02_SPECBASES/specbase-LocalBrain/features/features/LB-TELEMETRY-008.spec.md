---
spec_id: LB-TELEMETRY-008
title: Structured logs and export as NDJSON
version: 1.0.0
owners: [observability]
status: ready
platforms: [electron, ios, web]
priority: p2
probes_required: ["log.event"]
acceptance_criteria:
  - ac_id: AC-0701
    text: Each task has queued/start/end timestamps in exported NDJSON.
assertions:
  - ac_id: AC-0701
    kind: event_occurs
    event: "log.event.task_exported"
---
Body.
