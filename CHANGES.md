# CHANGES — ITERATION_03 Closeout

## Added (Specs)
- 010 UI Shell & Orchestration
- 011 Agent Control Protocol v0.2
- 012 Ledger Gateway (draft/approve/apply)
- 013 Open Finance (BR) MVP path
- 014 Docs & RAG (INDEX.json + rag-index.json)
- 015 Kill‑Switch & Refusal UX
- 016 Terminal Sandbox (read‑only, replay)
- 017 Approval Tray UX (multi‑sig, evidence)
- 018 Banking Preview/Diff UX

## Added (CI & Scripts)
- `.github/workflows/ci-ux-apca.yml`
- `.github/workflows/ci-docs-rag.yml`
- `.github/workflows/ci-seats-proof.yml`
- `.github/workflows/ci-policy-tests.yml`
- `scripts/check-apca-tokens.mjs`
- `scripts/build-rag-index.mjs`, `scripts/check-rag-freshness.mjs`
- `scripts/seats-proof.mjs`

## Added (Schemas)
- `docs/api/schemas/*`: ui.intent, ipc.bridge, router.trace, evidence.router, acp.refusal, approval.item, evidence.pack, terminal.transcript, approval.tray.state

## Added (UI Components)
- Approval Tray (list/detail/evidence)
- Terminal Transcript Viewer
- Router Trace Chips
- Consent Banner + Modal

## Added (Policy & Runbooks)
- `policies/examples/policy.examples.json`
- `packages/policy/src/evaluator.ts` + tests
- `docs/runbooks/RB-consent-expiry-revocation.md`

## Added (Demo)
- `05_EXECUTION_STATUS/ITERATION_03/DEMO_SCRIPT_MVP.md`
- `.../demo/seed-intents.json`, `.../demo/run-demo.mjs`