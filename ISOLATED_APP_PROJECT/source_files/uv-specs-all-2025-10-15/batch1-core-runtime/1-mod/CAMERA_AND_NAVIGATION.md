---
spec_id: CAMERA_AND_NAVIGATION
title: Camera & Navigation
version: 0.1.0
owner: Leo
status: draft
batch: 1
created: 2025-10-15
promotion_gates:
  i1:
    - "Public interfaces stubbed; invariants documented"
    - "Events & metrics cataloged"
  i2:
    - "Worked example with sample data"
    - "Contract tests specified"
  i3:
    - "Performance and memory budgets verified on canonical scenes"
    - "Failure modes & UX errors defined"
  complete:
    - "Adopted with passing gates; docs and samples merged"
observability:
  events_namespace: uv.camera.and.navigation
  metrics_prefix: uv.camera.and.navigation
risks:
  - id: R-CAMERA_AND_NAVIGATION-1
    desc: "Interface drift vs. electron/web constraints"
    mitigation: "Lock TS types; IPC contracts with version keys"
---

## Modes
- 2D (map), 3D (perspective), Globe (ellipsoid). Toggle seamlessly.

## Controls
- Orbit, pan, dolly, tilt; speed scales with altitude/distance.
- Geodesic camera constraints over the globe (no poles flip).

## Bookmarks & Paths
- Named camera bookmarks with easing.
- Editable paths (keyframes); used by recording/export.

## Clipping & FOV
- Near/far auto with safety clamps; FOV saved per scene.

## Events & Metrics
- `uv.camera.changed` (pose, mode); `uv.camera.bookmark.saved`.
