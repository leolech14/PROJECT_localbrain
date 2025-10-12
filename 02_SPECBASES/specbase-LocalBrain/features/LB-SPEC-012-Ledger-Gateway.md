---
type: Spec
status: Draft
module: DataIntegrity
owner: Agent C (Backend)
version: 0.1
---

# API Surface (HTTP/gRPC)
- `POST /ledger/changes`  // create draft {idempotencyKey, entity, patch, evidence}
- `POST /ledger/changes/{id}/approve`  // multi-sig aware
- `POST /ledger/changes/{id}/apply`    // atomic apply + hash append
- `GET  /ledger/changes/{id}`          // status + evidence bundle

# Contracts
- **Idempotency:** unique key per proposed change; safe retries. 
- **Optimistic locking:** `entityVersion` gate at apply.
- **Evidence packs:** rationale, inputs, tool results, trace IDs attached.

# UI Integration
- Approval Tray consumes `GET …/changes?state=draft`.
- Each row shows: diff, rationale, required signers, hash link.

# DoD
- Prisma schema + mocks; contract tests for idempotency & version conflicts.
- UI demo: create→approve→apply path with hash shown in UI footer.