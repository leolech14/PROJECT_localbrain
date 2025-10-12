---
spec_id: LB-BROWSE-003
title: Browser control via MCP with JS evaluation and screenshot
version: 1.0.0
owners: [browser]
status: ready
platforms: [electron, web]
priority: p1
probes_required: ["browser.events"]
acceptance_criteria:
  - ac_id: AC-0201
    text: Opening a URL emits a browser.open event and succeeds within 1000ms.
  - ac_id: AC-0202
    text: Evaluating JS returns the page title for example.com.
tests:
  - id: T-BROWSE-001
    platforms: [electron]
    steps:
      - action: app.launch
      - action: browser.open
        params: { url: "https://example.com" }
      - action: browser.evaluate
        params: { js: "document.title" }
      - action: assert
        params: { ac_id: AC-0202, kind: output_contains, text: "Example Domain" }
assertions:
  - ac_id: AC-0201
    kind: event_occurs
    event: "browser.events.opened"
  - ac_id: AC-0202
    kind: output_contains
    text: "Example Domain"
---
Body.
