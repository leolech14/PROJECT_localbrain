---
role: Agent D
title: "Swift ↔ Web IPC Bridge & Runtime Contracts"
inputs:
  - ModuleSpecs LB‑01..LB‑04
  - Orchestrator routing rules
success_criteria:
  - Typed IPC contracts for: pane control, file ops, link-out, consent redirect, approvals
  - Sandbox: tool allow‑lists; schema‑first I/O; entity‑scoped memory
handoffs_to: [Agent A, Agent C]
---

## Tasks
- Define JSON schemas for IPC messages; validate on both ends.
- Enforce tool allow‑lists; refuse unknown action (security pattern).
- Plug **Symphony** router decisions into Swift controller for screen orchestration.