---
spec_id: PERMISSIONS_SERVICE
title: Permissions Service
version: 0.1.0
owner: Leo
status: draft
batch: 9
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to Batches 0–8 resolved"
    - "Interfaces, events, and metrics named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Golden traces/snapshots attached; policy checklists completed"
    - "Observability wiring verified end-to-end"
  complete:
    - "All gates green; consistency checks passed; living links in INDEX"
observability:
  events_namespace: uv.permissions.service
  metrics_prefix: uv.permissions.service
risks:
  - id: R-PERMISSIONS_SERVICE-1
    desc: "Excessive telemetry causing perf or privacy regressions"
    mitigation: "Sampling, redaction, consent; budgets enforced at compile-time"
---

## Purpose
Centralize **capability prompts** and policy enforcement for file and network access, respecting
the **Network Rules** (Batch 2) and user privacy.

## Capabilities
- **File system**: open/read/write/save-as within user-granted roots; hash log; recent list sanitized.
- **Network**: allowlist by domain; per-source headers/tokens via OS keychain; offline/captive modes.
- **Devices** (future): camera/mic for capture; explicit scopes.

## UX
- Clear, minimal prompts with purpose + scope + duration (once/session/always).
- "Why am I seeing this?" link to policy; audit log surfaced in Logs/Perf panel.
- Per-project remembered grants with revocation.

## Policy
- Deny by default; granular scopes; time-limited grants; audit trail with correlation IDs.
- Configurable via `4-gov/SECURITY_AND_PRIVACY_POLICY.md` and `3-cfg/NETWORK_RULES.md` (Batch 2).

## API (TS)
```ts
requestPermission(scope: "fs"|"network"|"device", opts:{reason:string, target?:string}): Promise<Grant>
revoke(scope, target?): void
grants(): Grant[]
```

## Events
- `uv.perm.prompt`, `uv.perm.granted|denied|revoked`, `uv.perm.audit`

## Acceptance
- Non-allowlisted network call is blocked with actionable guidance; grant lifecycle observable; audit exportable.
