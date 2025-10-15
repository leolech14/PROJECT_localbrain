---
spec_id: PYTHON_BRIDGE
title: Python Bridge (Optional: Pyodide or Child Process)
version: 0.1.0
owner: Leo
status: draft
batch: 11
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Security model reviewed; capability grants enumerated"
  i3:
    - "Reference sandbox & two sample plugins implemented"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency/security audits passed"
observability:
  events_namespace: uv.python.bridge
  metrics_prefix: uv.python.bridge
risks:
  - id: R-PYTHON_BRIDGE-1
    desc: "Script/plugin escaping sandbox or overusing resources"
    mitigation: "Hard sandbox, caps/timeouts, permissions prompts, code review/signing"
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
