---
spec_id: CACHE_AND_STORAGE
title: Cache & Storage
version: 0.1.0
owner: Leo
status: draft
batch: 2
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to Batch 0/1 resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference importer notes/prototypes attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.cache.and.storage
  metrics_prefix: uv.cache.and.storage
risks:
  - id: R-CACHE_AND_STORAGE-1
    desc: "Large file handling and UI stalls"
    mitigation: "Workers, chunked IO, staged commits, cancellation"
---

## Purpose
Make IO fast, predictable, and offline-friendly without leaks.

## Cache layout
- Root: `~/Library/Application Support/uv/cache` (platform-specific)
- Namespaces: `tiles/`, `tiles3d/`, `imagery/`, `raster/`, `models/`, `tables/`, `imports/`
- Index: `index.sqlite` (url, etag, mtime, size, sha256, last_access, headers)

## Keys & integrity
- Cache key = SHA-256 of (url + headers + variant + version)
- Store content-addressable blobs; verify on read when `must_verify`

## Policies
- Size cap (GB) and TTL (days) per namespace; global cap with LRU eviction.
- Warm prefetch lists; purge UI with stats.
- **Offline mode**: deny network; serve cache hits; annotate HUD.

## APIs
```ts
get(key): Promise<ArrayBuffer|Blob>
put(key, blob, meta): Promise<void>
stat(key): Promise<{size, last_access, hits}>
purge(query): Promise<number>
```

## Metrics & events
- `uv.cache.hit|miss`, `uv.cache.put`, `uv.cache.bytes`
- Hit rate target > 0.6 on revisit workloads.

## Acceptance
- Eviction respects namespace caps; index never corrupts (journaled; recovery tested).
