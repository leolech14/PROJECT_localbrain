---
spec_id: REALTIME_INGEST
title: Realtime Ingest
version: 0.1.0
owner: Leo
status: draft
batch: 2
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to Batch 0/1 resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference importer notes/prototypes attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.realtime.ingest
  metrics_prefix: uv.realtime.ingest
risks:
  - id: R-REALTIME_INGEST-1
    desc: Large file handling and UI stalls
    mitigation: Workers, chunked IO, staged commits, cancellation
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Append streaming data (WS/SSE/MQTT/RTSP*) into layers without stalling the UI.

## Connectors
- **WebSocket**: JSON/CSV frames; heartbeat & reconnect.
- **SSE**: event streams; backoff.
- **MQTT**: topic subscriptions; QoS1; batch to frames.
- (*RTSP for video is out-of-scope; use native video element + MSE in Video Layer*)

## Buffering & backpressure
- Ring buffer per stream; size by time or count; drop-old or throttle producer.
- Snapshot-to-table for chart layers; coalesce updates at ~60Hz max.

## Schema
- Producer registers schema (fields, types, time index); dynamic field discovery allowed with warnings.

## Security
- Token/header injection via Network Rules; no eval in payloads; size/time caps.

## Events & metrics
- `uv.rt.open|close|msg|drop`, queue depth, msg/s, bytes/s.

## Acceptance
- 10Hz @ 10kB/frame for 60s without UI jank; memory stable within 5%.

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
