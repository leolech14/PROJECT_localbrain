---
spec_id: VIEW_RECIPE_LINKS
title: View Recipe Links (Share/Import)
version: 0.1.0
owner: Leo
status: draft
batch: 8
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Golden artifacts and schema validators included"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.view.recipe.links
  metrics_prefix: uv.view.recipe.links
risks:
  - id: R-VIEW_RECIPE_LINKS-1
    desc: "Schema drift or lossy exports"
    mitigation: "Schema versioning; validators; golden round-trip tests"
---

## Purpose
Allow users to share a **compact recipe** that replays a view without bundling data.
Recipes reference providers and public URLs, plus embedded small snippets.

## Format
- MIME: `application/uv-recipe+json` or URL form `uv-view://<base64url-json>`
- Contains: camera, active layers (by id), style deltas, filters/mappings, bookmarks.
- References: provider ids, public URLs, or relative paths; **no secrets**.

## Import behavior
- Validate schema; prompt to configure missing providers/keys.
- Attempt to locate local equivalents for relative paths; report missing artifacts.
- Offer to resolve styles/filters against current dataset schemas.

## Security
- Treat recipes as untrusted; no code; size caps; strip unknown fields.
- Show diff preview before applying to current scene.

## Observability
- `uv.recipe.share|open`, `uv.recipe.resolve.*`

## Acceptance
- Opening a recipe reproduces the view within tolerances (camera/style/filters) on a machine with suitable providers.
