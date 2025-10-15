---
spec_id: PYTHON_BRIDGE
title: PYTHON_BRIDGE
version: 0.1.0
owner: Leo
status: draft
batch: '?'
category: 1-mod
flavor: codegen
created: '2025-10-15'
updated: '2025-10-15'
promotion_gates:
  i1:
    - Front matter valid against schema v2
    - All 12 sections present
  i2:
    - Unit and integration tests implemented and green
  i3:
    - GPU snapshot and perf gates pass on perf scenes
  complete:
    - Docs done; sample recipe added; release notes drafted
observability:
  events_namespace: uv.python.bridge
  metrics_prefix: uv.python.bridge
  event_list: []
---

## Purpose
Offer Python for data/ML tasks **behind a feature flag**, with clear limits and the same capability model.

## Modes
- **Pyodide** (in-browser WASM): pure-Python/NumPy; memory capped; no native I/O.
- **Child Process** (Electron only): spawn a sandboxed Python process with a thin RPC bridge; strict allowlists, timeouts, and resource caps.

## API (JS side)
```ts
const py = await python.open({ mode: "pyodide"|"process" });
await py.exec("import numpy as np
print(np.arange(5))");
const arr = await py.call("my_module:run", {params});
await py.close();
```

## Security & caps
- No network unless granted via Permissions Service.
- CPU time and memory caps; output size caps; sanitize stdout/stderr.
- Package allowlist for Pyodide; virtualenv with pinned wheels for process mode.

## Observability
- `uv.py.open|close|exec.start|end|error`, mem usage, time ms.

## Acceptance
- Example op computes a buffer in Python and returns GeoJSON; caps enforced; termination on runaway loops.

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
