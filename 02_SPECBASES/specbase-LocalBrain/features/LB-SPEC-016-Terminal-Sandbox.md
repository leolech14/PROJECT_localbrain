---
type: Spec
id: LB-016
title: "Terminal Sandbox — Read‑Only, Replayable, Evidenced"
module: "Workbench"
status: "Draft"
owners: ["Agent D (integration)","Agent C (backend)"]
acceptance:
  - "Default mode is read‑only; privileged ops require HITL."
  - "Session transcript captured with SHA‑256 and replay support."
  - "Policy denies known‑bad commands (blocklist) and network calls."
---

## Modes
- **Read‑only**: `cat`, `ls`, `grep`, `git status/log`, `node --version`, etc.
- **Elevated (HITL)**: package installs, writes, process mgmt — requires approved Proposal.

## Contracts
- `term.open({cwd})` → sessionId
- `term.run({sessionId, cmd, args, envWhitelist})` → streamed output
- `term.close({sessionId})`
- Transcript saved as **newline‑delimited events**; hash stored in ledger evidence.

## Safety
- Allow‑list + regex **blocklist** (rm -rf, curl|bash, chmod 777…)
- Enforce timeouts; kill on runaway.
- Env var redaction; no unscoped tokens.

## Replay
- `term.replay({sessionId, from, to})` re-emits events for evidence/QA.

## DoD
- Fixtures for common commands; blocked commands test.
- Transcript hash verified; replay parity check (byte‑for‑byte).