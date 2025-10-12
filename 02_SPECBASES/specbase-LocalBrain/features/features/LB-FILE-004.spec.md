---
spec_id: LB-FILE-004
title: File explorer preview and read access
version: 1.0.0
owners: [files]
status: ready
platforms: [electron, ios]
priority: p1
probes_required: ["files.read"]
acceptance_criteria:
  - ac_id: AC-0301
    text: '"Show README.md" previews the file within 1000ms.'
  - ac_id: AC-0302
    text: Reading a file emits a files.read event with path and byte count.
tests:
  - id: T-FILE-001
    platforms: [electron]
    steps:
      - action: app.launch
      - action: say
        params: { text: "Show README.md" }
      - action: assert
        params: { ac_id: AC-0301, kind: ui_visible, selector: "[data-testid=file-preview]" }
assertions:
  - ac_id: AC-0302
    kind: event_occurs_any
    event: ["files.read", "files.search"]
---
Body.
