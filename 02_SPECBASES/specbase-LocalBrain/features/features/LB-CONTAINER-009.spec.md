---
spec_id: LB-CONTAINER-009
title: Container bridge routes doc processing
version: 1.0.0
owners: [runtime]
status: draft
platforms: [electron]
priority: p3
probes_required: ["container.bridge"]
acceptance_criteria:
  - ac_id: AC-0801
    text: With container running, doc.process() returns equal or better reliability than host mode.
assertions:
  - ac_id: AC-0801
    kind: event_occurs
    event: "container.bridge.ready"
---
Body.
