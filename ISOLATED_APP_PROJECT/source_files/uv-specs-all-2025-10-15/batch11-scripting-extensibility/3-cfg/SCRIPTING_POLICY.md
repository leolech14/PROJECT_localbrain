---
spec_id: SCRIPTING_POLICY
title: Scripting Policy (Permissions, Trust, Signing)
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
  events_namespace: uv.scripting.policy
  metrics_prefix: uv.scripting.policy
risks:
  - id: R-SCRIPTING_POLICY-1
    desc: Script/plugin escaping sandbox or overusing resources
    mitigation: Hard sandbox, caps/timeouts, permissions prompts, code review/signing
category: 3-cfg
flavor: reference
updated: '2025-10-15'
---

## Goals
Protect users while enabling power: explicit capability prompts, trust levels, signing,
and auditability.

## Trust levels
- **Trusted**: signed by a known key or local dev mode; fewer prompts.
- **Prompted**: unsigned or unknown origin; per-cap prompts required.
- **Blocked**: disallowed APIs or invalid signature; cannot run.

## Permissions
- Caps mirror Permissions Service scopes: `fs.read`, `fs.write`, `net.request`, `net.websocket`, `keychain.*`, `table.access`, `scene.mutate`.
- Grants: once / session / always; visible in Settings with revoke.

## Signing
- Optional signing for plugins/scripts; include public key fingerprint in manifest.
- Verify on install and on update; show signer identity.

## Audit
- All exec/perm events logged; exportable NDJSON with correlation IDs.
- Rate limits: max scripts/min; max outbound requests/min when net is granted.

## Defaults
- Scripting OFF by default in Lite/Core; ON (with prompts) in Pro profile.

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
