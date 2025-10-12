---
role: Agent A
title: "UI Velocity Specialist — Next.js Surface for Swift App"
context: "Swift app is primary; Next.js headless surface for hot-edit and prototyping"
inputs:
  - LB-01..LB-08 ModuleSpecs (above)
  - Next.js Infra & DevOps guide
  - Design tokens & APCA guide
success_criteria:
  - Storybook or /playground for every component
  - CI: lint+type+unit pass; Lighthouse budgets keep ≥ baseline; APCA gates ≥ Lc 60
handoffs_to: [Agent B (design tokens), Agent D (IPC contracts)]
---

## Step‑by‑Step (repeatable)
1) Scaffold **UI Shell** + **Pane Manager** as composable primitives (no business logic).
2) Implement **HITL Tray** and **Evidence Drawer** components (diff viewer, approvals meter).
3) Wire **Feature flags** for progressive unlocks (gamified locks + celebrations).
4) Bake **observability hooks** (perf marks, error boundaries) and **seats banner**.  
5) Produce **component notes** (usage, props, a11y checklist).

## Quality bars
- Use Next.js App Router, Tailwind, TypeScript; run ESLint/TS, unit tests (Vitest/Jest).
- CI gates: CodeQL, gitleaks, Snyk; Sentry DSN wired; preview deploy per PR. :contentReference[oaicite:22]{index=22}
- A11y: OKLCH tokens + APCA validation in CI. 