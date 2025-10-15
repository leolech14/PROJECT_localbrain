---
spec_id: EVENT_BUS_AND_AGENTS
title: Event Bus & Agents
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
  events_namespace: uv.event.bus.and.agents
  metrics_prefix: uv.event.bus.and.agents
risks:
  - id: R-EVENT_BUS_AND_AGENTS-1
    desc: "Excessive telemetry causing perf or privacy regressions"
    mitigation: "Sampling, redaction, consent; budgets enforced at compile-time"
---

## Purpose
A lightweight **event bus** to subscribe to viewer events and forward selected ones to **agents**
(webhooks, local scripts) with backpressure and signing.

## Bus model
- Namespaces (e.g., `uv.render.*`, `uv.layer.*`, `uv.io.*`).
- Subscribers with filters and QoS (at-most-once / at-least-once semantics where applicable).
- Backpressure: bounded queues; drop-old policy with counters when saturated.

## Webhooks
- HMAC signature with shared secret; retry with exponential backoff; jitter; circuit breaker.
- Rate limits per endpoint; allow/deny lists; payload redaction options.

## Local agents
- Optional: JS scripting (Batch 11) can register handlers; sandboxed with timeouts.

## API (TS)
```ts
subscribe(pattern: string, handler: (e: Event)=>void, opts?:{qos?:string,maxQueue?:number}): Unsub
publish(e: Event): void
registerWebhook(id, url, secret, filter): void
```

## Observability
- `uv.agent.subscribed|unsubscribed`, `uv.agent.delivery.success|fail`, `uv.agent.drop`
- Metrics: queue depths, delivery latency p95, failure rate.

## Acceptance
- Burst of 10k events delivers within 2s with no UI jank; drops counted and visible when queues saturate.
