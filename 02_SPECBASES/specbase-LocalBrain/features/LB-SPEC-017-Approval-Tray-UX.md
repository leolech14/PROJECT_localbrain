---
type: Spec
id: LB-017
title: "Approval Tray UX — Multi‑Sig with Diff Viewer & Evidence Drawer"
module: "Safety"
status: "Draft"
owners: ["Agent A (UI)","Agent C (ledger)","Lech (HITL)"]
acceptance:
  - "Drafts show as items with status, required signers, and rationale."
  - "Diff viewer supports JSON Patch, text, and file previews."
  - "MSIG thresholds enforce m‑of‑n; partial signatures visible."
---

## Anatomy
- **List**: filters by state (Draft, Pending, Ready, Applied, Rejected).
- **Tile**: title, rationale, entity, impacted area, risk tag.
- **Actions**: Approve, Reject, Request Changes; all signings logged.

## Diff Types
- **JSON Patch**: show add/replace/remove grouped by path.
- **Text**: unified view with +/- lines; optional inline comments.
- **File**: image/markdown previews; checksum banner.

## Evidence Drawer
- Envelope (agent, intent, evidence.reason)
- Related logs/telemetry (traceId)
- Attachments: transcripts, screenshots, hashes

## DoD
- Keyboardable list & actions; screen reader labels.
- Visual regression snapshots; latency for list load ≤ 120ms p95.
- Ledger integration demo: Draft→Approve→Apply with hash link.