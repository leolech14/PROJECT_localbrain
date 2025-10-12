---
role: Agent B
title: "Design System — OKLCH, APCA, Tokens, WCAG 2.2 AA"
inputs:
  - a11y-oklch-apca guidance & tokens
  - UI Shell/Panes from Agent A
success_criteria:
  - Token scales (OKLCH) and typography ramps documented
  - APCA CI plugin blocks below‑threshold text
  - Contrast proofs for dynamic states (focus/hover/disabled)
handoffs_to: [Agent A components, Agent E docs site]
---

## Tasks
- Define color ramps (OKLCH L 0.98→0.12), role mapping (bg, text, borders, status).
- Create **APCA contracts**: badge, chip, button, table, drawer; verify Lc thresholds in CI.
- Ship **Design Primer** and token JSON for runtime consumption.