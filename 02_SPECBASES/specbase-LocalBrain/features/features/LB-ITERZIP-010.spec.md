---
spec_id: LB-ITERZIP-010
title: Iteration ZIP packaging policy
version: 1.0.0
owners: [release]
status: ready
platforms: [web, electron, ios]
priority: p2
probes_required: []
acceptance_criteria:
  - ac_id: AC-0901
    text: Iteration N package contains only new context under context/iteration_N/ plus complete codebase.
assertions:
  - ac_id: AC-0901
    kind: event_occurs
    event: "release.iteration_packaged"
---
Body.
