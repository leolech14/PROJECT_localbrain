---
role: Agent C
title: "Backend Services — Connectors, Policy Engine, Ledger IO"
inputs:
  - Open Finance connectors report (Belvo/Pluggy)
  - DR‑0031 Policy/Spending design
  - Change‑Set Ledger spec
success_criteria:
  - Read‑only link flow (FAPI OAuth) with Preview→Confirm; Consent records persisted
  - Policy evaluator decisions surfaced to UI (ALLOW/HITL/MSIG/DENY)
  - All writes mediated via Change‑Set (idempotency keys, versioning)
handoffs_to: [Agent D (IPC), Agent A (UI), Agent E (docs)]
---

## Tasks
- Implement connectors base class; webhook+poll symmetry; provenance tags; dedupe.
- Policy‑as‑Code evaluator — pure function; cache usage windows; kill‑switch listener.
- Change‑Set client SDK (draft→approve→apply), evidence pack struct; optimistic lock.
- Emit observability signals; Sentry, metrics; unit+integration tests in CI.