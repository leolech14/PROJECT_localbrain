---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 12)
version: 0.1.0
owner: Leo
status: draft
batch: 12
created: 2025-10-15
---

## Scope
File explorer & previews, drag-and-drop UX, recents & project hub, notifications/task center,
error handling & recovery patterns, onboarding/help, keymap overlay, consent/privacy surfaces,
startup profiles & templates.

## Acceptance demos (for 'complete')
1. **Explorer Basics** — Browse local/project files; preview GeoJSON/GLB/COG/CSV with metadata; drag from explorer to canvas; perf stays ≥ 45 FPS.
2. **Drop Flow** — Drop mixed files (GeoJSON, GLB, CSV, COG); sniffer classifies; conflicts resolved; progress & cancel; UI responsive.
3. **Project Hub** — Open recent scenes; pin/favorite; search by name/tag; thumbnails load from cached recipes.
4. **Task Center** — Importer and export jobs appear; progress, pause/resume, cancel; notifications deduplicated; audit trail export to NDJSON.
5. **Recovery** — Simulate importer error; toast + details link; one-click retry; logs show correlation ID; scene state preserved.
6. **Onboarding & Keymap** — First-run tour; open keymap overlay (hold `?`); shortcut edits persist; command palette lists updated bindings.
7. **Consent Surface** — Telemetry off by default; explicit opt-in dialog; privacy policy link; settings reflect decision; events sampled accordingly.
8. **Startup Templates** — Create scene from template (Map + Terrain + Layers panel presets); recipe saved; providers prompts handled.

## Perf gates
- Explorer search < 150 ms for 5k items; previews open < 200 ms; recents page < 300 ms.
- Task center updates at 2–4 Hz without jank; notification rendering < 16 ms.
- Consent modal open/close < 100 ms; tour overlays maintain ≥ 45 FPS.

## Observability checks
- Events: `uv.explorer.*`, `uv.drop.*`, `uv.hub.*`, `uv.task.*`, `uv.error.*`, `uv.onboarding.*`, `uv.keymap.overlay.*`, `uv.consent.*`.
- Metrics: explorer query latency, preview open ms, drop classify accuracy, task queue depth, retry counts, consent rate.

## Risks & mitigations
- Over-notification → dedupe & bundle; task-center as source of truth.
- Privacy concerns → explicit consent, redaction, easy opt-out.