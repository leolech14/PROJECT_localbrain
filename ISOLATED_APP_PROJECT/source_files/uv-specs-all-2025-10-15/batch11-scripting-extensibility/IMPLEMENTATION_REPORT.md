---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 11)
version: 0.1.0
owner: Leo
status: draft
batch: 11
created: 2025-10-15
---

## Scope
JS scripting engine (sandboxed), plugin model (capability-based), optional Python bridge,
and scripting policy (permissions, prompts, signing/trust levels).

## Acceptance demos (for 'complete')
1. **Hello Script** — Run a JS script that adds a vector layer and styles it; execution completes under 100 ms and emits `uv.script.exec.end`.
2. **Operator Plugin** — Install a plugin that adds `op.vector.buffer`; appears in Operators Panel and Command Palette; runs and produces a new layer; undo/redo works.
3. **Reader Plugin** — Install a plugin that reads a custom CSV dialect → Arrow; drag & drop triggers sniffer handoff; table appears; policy shows capability grant.
4. **Permission Guard** — Script attempts `fetch` to non-allowlisted host → denied with prompt; approving for session allows; audit log shows decision.
5. **Resource Caps** — While loop exceeding time cap is terminated; memory cap exceeded triggers `uv.script.guard` with actionable message.
6. **Python Bridge (flagged)** — (Optional) Run a Python op via Pyodide or child process; returns results to JS; respects memory/time caps.

## Perf gates
- Script startup < 50 ms; small script exec < 30 ms (p95) excluding IO.
- Plugin discovery < 200 ms; palette entries populate < 100 ms.
- Overhead of sandbox disabled path ~0% (no impact when scripting off).

## Observability checks
- Events: `uv.script.exec.start|end|error|guard`, `uv.plugin.install|enable|disable`, `uv.perm.request|decision`, `uv.py.exec.*` (if enabled).
- Metrics: scripts run, avg exec ms, terminations, memory spikes, plugin load ms.

## Risks & mitigations
- Supply chain & user scripts — signing/trust levels, allowlist manifests, capability prompts, rate-limited fetch, no DOM access, structured clone for data passage.