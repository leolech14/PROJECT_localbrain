---
type: Backlog
title: "LocalBrain v2.0 Spec Expansion to 50+"
owner: Agent E
status: Approved
target_count: 52
---

## Highest Priority (v2.0 MVP Critical Path)
- LB‑01 UI Shell & Navigation (Swift app + Next.js hot-edit surface) — *Complete ModuleSpec required*
- LB‑02 Window/Pane Manager with **AI screen control** (minimize/maximize/snap/swipe) — *Complete*
- LB‑03 Context Fabric & **Symphony Orchestrator** (routing, memory scopes, guardrails) — *Complete* :contentReference[oaicite:10]{index=10}
- LB‑04 Change‑Set Client + **HITL Tray** UI (draft→approve→apply, evidence drawer) — *Complete* :contentReference[oaicite:11]{index=11}
- LB‑05 Open Finance Linking Flow (Belvo/Pluggy; OAuth FAPI; Consent UI) — *Complete* :contentReference[oaicite:12]{index=12}
- LB‑06 Security‑First **Autonomous Spend** UX (DR‑0031 policy decisions: ALLOW/HITL/MSIG/DENY) — *Complete* :contentReference[oaicite:13]{index=13}
- LB‑07 Observability & QA Gates (Sentry, metrics, Lighthouse budget, CI CodeQL/gitleaks) — *Complete* :contentReference[oaicite:14]{index=14}
- LB‑08 Design System (OKLCH tokens, APCA AA, theming, dark mode semantics) — *Complete* 

## High (pre‑GA)
- LB‑09 Gmail Hub (ingest, parse, provenance, versioned parsers)
- LB‑10 Budget Viewer module (interactions, formulas)
- LB‑11 Calendar Heatmap (layers/toggles; performance limits)
- LB‑12 Interactive Chart Viewer
- LB‑13 Entity Registry & Multi‑profile (Personal vs Business), data scoping
- LB‑14 IPC: Swift ↔ Web runtime bridge (routes, events, sandbox)
- LB‑15 Local/Cloud Storage sync & offline semantics
- LB‑16 Docs Site & KB (Docusaurus/MkDocs decision, pipelines) :contentReference[oaicite:16]{index=16}
- LB‑17 Agent Ops & Onboarding (conversations, guardrails, refusal flows) :contentReference[oaicite:17]{index=17}
- LB‑18 Graph/Chip View (ownership/flow graph; perf constraints; custom view vs host) :contentReference[oaicite:18]{index=18}

## Medium (post‑MVP)
- LB‑19 Tax Intelligence (BR IRPF/MEI/ISS core rules in UI; NFS‑e surfaces) :contentReference[oaicite:19]{index=19}
- LB‑20 Reconciliation engine (bank tx ↔ receipts; matching policy) :contentReference[oaicite:20]{index=20}
- LB‑21 Roles & Sharing (invite accountant, RO/RW scopes)
- LB‑22 Mobile PWA footprint (phone‑first flows)
- LB‑23 Real‑time streaming (live listeners, websocket events)
- LB‑24 Progressive unlock (gamified tiers & feature flags) 