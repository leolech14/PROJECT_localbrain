---
type: Spec
status: Draft
module: Ingestion
owner: Agent C (Backend)
version: 0.1
---

# Scope (MVP)
- **Read-only** links; 12 months history; near real-time webhooks + nightly poll.
- Consent record tracked; expiry/renewal UX; LGPD DSAR hooks.

# Architecture
- Connector abstraction (`PluggyConnector`, `BelvoConnector`) with common interfaces.
- Webhooks for `transactions.created` + fallback polling. 
- Token broker; widget tokens (no secrets in frontend); secure callbacks.

# Data Model
- `ConsentRecord`, `UnifiedAccount`, `UnifiedTransaction` + provenance (source IDs). 

# UI Flow
- Link → Preview (diff, dedupe) → Confirm; source badges & evidence.

# DoD
- Mock providers; golden datasets; race & dedupe tests.
- Runbook: consent expiry/revocation handling.