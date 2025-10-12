---
type: Spec
status: Draft
module: Docs
owner: Agent E (Coherence)
version: 0.1
---

# Structure
/docs/
  /overview/
  /modules/
  /adr/
  /runbooks/
  /playbooks/
  /api/
  /index.md
  INDEX.json       // registry

# Content Model
- YAML front-matter: title, type, module, status, tags.
- Templates: PRD, ADR (Nygard), Runbook, Playbook.

# RAG Build
- `scripts/build-rag-index.ts`: gray-matter parse, ~800-char chunks, tagged, `updatedAt`.
- Output: `docs/rag-index.json` with `{id, moduleId, text, tags, updatedAt}`.

# DoD
- CI job builds + lints docs; artifact uploaded.
- One example PRD, one ADR, one runbook included.