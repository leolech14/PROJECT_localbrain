---
type: Plan
title: "LocalBrain Spec Consolidation — Orchestra → LocalBrain"
owner: Agent E (Coherence)
reviewers: Lech (HITL), Agents A–D
status: Proposed
created: 2025-10-08
version: 1.0
goals:
  - Single source of truth under 02_SPECBASES/LocalBrain
  - ≥50 completed specs (Definition of Done applied)
  - Delete Orchestra spec base post-migration with preservation of history
success_metrics:
  - Coverage Map shows 100% migration of “kept” items
  - RAG index passes referential integrity (no dead IDs)
---

## 0) Snapshot
- Tag current repo and export `/03_ITERATION_CONTEXT/_archives/ORCHESTRA_SNAPSHOT_ITO2/`.
- Freeze Orchestra specs to read-only while migrating.

## 1) Inventory & Map
- Build **Spec Map** CSV: id, title, source_path, target_path, decision {KEEP, MERGE, RETIRE}, reason.
- Extract from Orchestra (140 docs) and LocalBrain (33 docs). Agent E produces `/02_SPECBASES/LocalBrain/_maps/spec-map.csv` and `/docs/INDEX.json` entries.

## 2) Migration Rubric
- KEEP: move verbatim, update front-matter.
- MERGE: create composite spec with “Source anchors” list and supersede ADR.
- RETIRE: write a one-paragraph rationale and add to “Deprecated” index.

## 3) Docs‑as‑Code controls
- Enforce “no merge without docs” and CODEOWNERS for `/02_SPECBASES` and `/docs`. Preview builds for each PR. :contentReference[oaicite:0]{index=0}

## 4) RAG Index alignment
- Rebuild `docs/rag-index.json` on every merge. Ensure chunk IDs reflect new paths. 

## 5) ADRs & Supersedence
- For each MERGE/RETIRE, write/update ADR (Accepted/Superseded). Keep chronological ADR log.

## 6) Decommission
- When Coverage Map = 100% and test “spec references → file” passes, delete Orchestra tree in a single PR (history preserved by git tag).