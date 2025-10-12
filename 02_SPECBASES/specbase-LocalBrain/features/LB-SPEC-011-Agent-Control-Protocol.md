---
type: Spec
status: Draft
module: Orchestration
owner: Agent E (Coherence)
version: 0.2
---

# Envelope
```json
{
  "id": "ulid",            // idempotency key
  "ts": "iso-8601",
  "agent": { "id": "AgentA", "role": "ui" },
  "intent": { "type": "ui.window.open", "payload": {...} },
  "entity": { "id": "personal/default" },
  "policy": { "requiresHITL": false },
  "trace": { "traceId": "..." },
  "evidence": { "reason": "why", "inputs": {...} }
}
Intent Catalog (v0.2)
UI: ui.window.(open|close|focus|split|move|resize|pin|snapshot)

Files: fs.open(path, mode), fs.reveal(path)

Browser: browser.open(url), browser.navigate(hash)

Terminal: term.run(cmd, args, cwd) // sandboxed, read-only in prototype

Chat: chat.focus, chat.insertDraft(text)

Validation & Safety
Schema-first (AJV); refuse on mismatch.

Allow-lists per agent (tool manifests); block anything not listed.

Routing: Rules→Embeddings→LLM fallback; JSON trace for explainability. 

Kill-switch: If uiFrozen=true or spendingLocked=true, refuse with code. 

Idempotency
Duplicate id → no-op + prior result echo; aligns with ledger keys. 

DoD
JSON Schema published under /specs/acp/0.2.

Contract tests: 100% of intent catalog validated; refusal cases covered.