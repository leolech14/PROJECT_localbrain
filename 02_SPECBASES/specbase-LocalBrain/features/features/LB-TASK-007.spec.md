---
spec_id: LB-TASK-007
title: Task runtime reports progress and terminal states
version: 1.0.0
owners: [orchestration]
status: ready
platforms: [electron, ios]
priority: p1
probes_required: ["task.event"]
acceptance_criteria:
  - ac_id: AC-0601
    text: Cancelling a parent cancels all dependents deterministically.
  - ac_id: AC-0602
    text: Every task emits a terminal state with timestamps.
tests:
  - id: T-TASK-001
    platforms: [electron]
    steps:
      - action: app.launch
      - action: task.run
        params: { name: "parent", deps: ["child1","child2"] }
      - action: task.cancel
        params: { name: "parent" }
      - action: assert
        params: { ac_id: AC-0601, kind: event_occurs, event: "task.event.cancelled" }
assertions:
  - ac_id: AC-0602
    kind: event_occurs
    event: "task.event.terminal"
---
Body.
