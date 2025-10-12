---
spec_id: LB-MEM-005
title: Memory service retrieves ingested facts with citations
version: 1.0.0
owners: [memory]
status: ready
platforms: [electron, ios, web]
priority: p0
probes_required: ["memory.query", "memory.ingest"]
acceptance_criteria:
  - ac_id: AC-0401
    text: After ingesting a doc containing 'checksum 7E2A-A1', querying later returns that phrase with source path.
tests:
  - id: T-MEM-001
    platforms: [electron]
    steps:
      - action: app.launch
      - action: memory.ingest
        params: { text: "The checksum is 7E2A-A1", source: "test", path: "/tmp/doc.txt" }
      - action: memory.query
        params: { q: "checksum" }
      - action: assert
        params: { ac_id: AC-0401, kind: output_contains, text: "7E2A-A1" }
assertions:
  - ac_id: AC-0401
    kind: output_contains
    text: "7E2A-A1"
---
Body.
