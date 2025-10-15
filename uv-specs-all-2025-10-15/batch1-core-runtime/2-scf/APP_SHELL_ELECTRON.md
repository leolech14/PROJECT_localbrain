---
spec_id: APP_SHELL_ELECTRON
title: App Shell (Electron)
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
  events_namespace: uv.app.shell.electron
  metrics_prefix: uv.app.shell.electron
risks:
  - id: R-APP_SHELL_ELECTRON-1
    desc: "Interface drift vs. electron/web constraints"
    mitigation: "Lock TS types; IPC contracts with version keys"
---

## Purpose
Own the window, menus, drag-and-drop, FS/network permissions, and preload bridge.

## Security
- ContextIsolation on; no Node in renderer.
- Preload exposes a minimal, versioned API over IPC.
- File open dialogs & drag-drop sanitized (path, MIME).

## IPC Contract (TypeScript)
```ts
// preload.ts
export interface Bridge {
  openFiles(paths: string[]): Promise<void>;
  loadProject(path: string): Promise<Project>;
  saveProject(path: string, project: Project): Promise<void>;
  getProviders(): Promise<ProviderConfig>;
  getStats(): Promise<AppStats>;
}
```

## File Handling
- Register file associations for `.uvscene.json`.
- Drag-drop: sniff → route to importer → addLayer on commit.

## Crash & Logs
- Crash reporter (opt-in); logs written with rotation and redaction.
