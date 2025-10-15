---
spec_id: BUILD_AND_SIGNING
title: Build & Signing
version: 0.1.0
owner: Leo
status: draft
batch: 10
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - Sections stubbed; cross-links to prior batches resolved
    - Pipelines/interfaces named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Budgets/gates aligned to Batch 0 performance targets
  i3:
    - Reference CI configs and harness stubs attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.build.and.signing
  metrics_prefix: uv.build.and.signing
risks:
  - id: R-BUILD_AND_SIGNING-1
    desc: Flaky GPU tests and non-deterministic snapshots
    mitigation: Deterministic seeds, tolerance windows, device matrix, retries
category: 5-ops
flavor: reference
updated: '2025-10-15'
---

## Purpose
Produce deterministic, reproducible builds that are signed and (on macOS) notarized,
with artifacts and symbols published for debugging.

## Build system
- **Node/Electron** app with lockfile; `npm ci` (or `pnpm i --frozen-lockfile`).
- Compiler flags pinned; environment variables scrubbed; reproducible timestamps via SOURCE_DATE_EPOCH.

## Codesign & notarize (macOS)
- Use Developer ID Application cert; entitlements limited (sandbox + file access as needed).
- Staple notarization tickets; verify with `spctl --assess`.

## Artifacts
- App bundle, installer (DMG/PKG), symbol files (dSYMs), source maps, license files.

## Determinism checklist
- Freeze dependency versions; strip non-deterministic metadata; canonicalize zip ordering.
- Verify with hash compare in CI step.

## Observability
- `uv.build.start|end`, `uv.build.artifact`, `uv.sign.start|end`, `uv.notarize.start|end`.

## Acceptance
- Two builds on same runner → identical hashes (excluding time stamps in container formats).

## 1. Purpose & Outcomes
TBD


## 2. Context & Dependencies
TBD


## 3. Public API (Types & Contracts)
TBD


## 4. Data & State Model
TBD


## 5. Algorithms & Control Flow
TBD


## 6. UI & Controls (UCC/CCD)
TBD


## 7. Observability (Events & Metrics)
TBD


## 8. Performance Budget & Fallbacks
TBD


## 9. Security, Privacy & Permissions
TBD


## 10. Acceptance Demos & Test Plan
TBD


## 11. Implementation Recipe (Ingredients & Steps)
TBD


## 12. Integration Checklist & Promotion Gates
TBD
