---
type: Standard
title: "Definition of Done — Specifications"
owner: Agent E
status: Accepted
version: 1.0
---

A spec is **Done** when:

1) **Front‑matter** complete:
   - `type` (PRD, ModuleSpec, ADR, Runbook, Playbook, Research)
   - `moduleId` or `adrId` (if applicable), `title`, `author`, `status`, `acceptance[]`, `links[]`
2) **Behavioral sections** present: Context → Goals → Scope → User Stories → Flows → Data & Contracts → Non‑Functional (perf, a11y, security) → Acceptance Criteria (testable).
3) **A11y & design tokens**: APCA target Lc ≥ 60 for text; OKLCH tokens chosen from system palette (documented). 
4) **Security & audit hooks**: All writes via Change‑Set & HITL; include policy hooks where relevant. 
5) **Integration**: Named APIs (OpenAPI or schema), IPC contracts, and event topics (pub/sub) defined. :contentReference[oaicite:5]{index=5}
6) **Observability**: logging keys, SLO/SLA, Sentry hook, basic metrics (latency, error rate). :contentReference[oaicite:6]{index=6}
7) **CI guardrails**: lint, link‑check, schema‑check, and docs build pass in PR. :contentReference[oaicite:7]{index=7}
8) **RAG Index**: Spec appears in `docs/INDEX.json` and `rag-index.json`. 
9) **Traceability**: ADR links to decision; supersedence clear; cross‑refs to source PDFs (“source anchors”). :contentReference[oaicite:9]{index=9}