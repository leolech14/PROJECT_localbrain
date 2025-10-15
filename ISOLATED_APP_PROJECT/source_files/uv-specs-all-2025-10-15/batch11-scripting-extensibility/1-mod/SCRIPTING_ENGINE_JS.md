---
spec_id: SCRIPTING_ENGINE_JS
title: Scripting Engine (Sandboxed JS)
version: 0.1.0
owner: Leo
status: draft
batch: 11
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Security model reviewed; capability grants enumerated
  i3:
    - Reference sandbox & two sample plugins implemented
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency/security audits passed
observability:
  events_namespace: uv.scripting.engine.js
  metrics_prefix: uv.scripting.engine.js
risks:
  - id: R-SCRIPTING_ENGINE_JS-1
    desc: Script/plugin escaping sandbox or overusing resources
    mitigation: Hard sandbox, caps/timeouts, permissions prompts, code review/signing
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Execute user scripts safely to automate tasks, create derived layers, or react to events.

## Sandbox
- Isolated runtime (e.g., SES/realms or VM-like worker) with **no direct DOM/Electron** access.
- Allowed globals: subset of JS, `uv` API facade, standard math/array, timers (throttled).
- **Caps**: CPU time per run (default 200 ms), memory cap, network disabled by default.
- **I/O** through explicit `uv.fs`, `uv.net` facades that route to **Permissions Service**.

## Facade API (TS)
```ts
type Uv = {
  scene: {
    addLayer(desc: LayerDescriptor): Promise<string>;
    getLayers(): LayerDescriptor[];
    updateLayer(id: string, patch: Partial<LayerDescriptor>): Promise<void>;
    removeLayer(id: string): Promise<void>;
    select(q: SelectionQuery): Promise<SelectionSet>;
  };
  table: {
    load(src: any, opts?:any): Promise<TableHandle>;
    query(sql: string): Promise<TableHandle>;
  };
  style: {
    ramp(kind:"linear"|"quantile"|"equal", opts:any): any;
  };
  events: {
    on(pattern: string, handler: (e:any)=>void): Unsub;
    emit(name: string, payload:any): void;
  };
  fs: {
    read(path:string, opts?:any): Promise<ArrayBuffer|string>;
    write(path:string, data:any, opts?:any): Promise<void>;
  };
  net: {
    fetch(url:string, opts?:any): Promise<ResponseHandle>; // requires net.request grant
  };
  util: { log: (...args:any[])=>void, now: ()=>number };
};
```

## Lifecycle
- **Compile**: pre-parse with size/time cap; store bytecode if supported.
- **Execute**: within worker; structured-clone inputs/outputs.
- **Terminate**: cooperative & hard kill on caps; emit `uv.script.guard`.

## Permissions
- Per-script capability grants (fs.read/write paths, net domains, table access).
- Session vs persistent grants; prompts come from Permissions Service (Batch 9).

## Packaging
- Scripts saved as `.uvscript.js` with manifest header specifying required caps.

## Observability
- `uv.script.exec.start|end|error|guard`, `uv.script.perm.request|decision`

## Acceptance
- Hello-world and small data transforms run within caps; denied actions are clear and logged.

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
