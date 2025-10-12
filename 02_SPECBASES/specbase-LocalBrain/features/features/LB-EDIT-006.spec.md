---
spec_id: LB-EDIT-006
title: Guarded self-edit applies replace blocks only when enabled
version: 1.0.0
owners: [core]
status: ready
platforms: [ios, electron, web]
priority: p0
probes_required: ["selfedit.apply"]
acceptance_criteria:
  - ac_id: AC-0501
    text: With LB_HOT_EDIT=1, a replace edit to HotEditMode.swift is applied and logged.
  - ac_id: AC-0502
    text: With LB_HOT_EDIT=0, the same edit is refused and logged with reason.
tests:
  - id: T-EDIT-001
    platforms: [ios]
    steps:
      - action: app.launch
      - action: env.set
        params: { key: "LB_HOT_EDIT", value: "1" }
      - action: selfedit.apply
        params:
          file: "Services/HotEditMode.swift"
          replace: { from: "return true", to: "return false" }
      - action: assert
        params: { ac_id: AC-0501, kind: event_occurs, event: "selfedit.apply.success" }
assertions:
  - ac_id: AC-0502
    kind: event_occurs
    event: "selfedit.apply.refused"
---
Body.
