---
spec_id: IO_AND_SNIFFERS
title: IO & Sniffers
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
  events_namespace: uv.io.and.sniffers
  metrics_prefix: uv.io.and.sniffers
risks:
  - id: R-IO_AND_SNIFFERS-1
    desc: Large file handling and UI stalls
    mitigation: Workers, chunked IO, staged commits, cancellation
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Identify data kind and route to the correct **Layer** or **Importer** quickly and safely.

## Inputs
- File drops (FileSystemHandle/File objects)
- URLs (user enters URL or pastes)
- Provider presets (from `3-cfg/PROVIDERS.md`)

## Detection strategy
1. **Magic bytes** (preferred): GLB ("glTF"), TIFF ("II*\x00"/"MM\x00*"), LAS/LAZ ("LASF"), Shapefile header (9994), Parquet ("PAR1"), Arrow ("ARROW1"), GZip, ZIP.
2. **Extension** (fallback): `.geojson`, `.topojson`, `.mvt`, `.pmtiles`, `.mbtiles`, `.csv`, `.nc`, `.h5`, `.nii`.
3. **Content probing** (sample): NDJSON first lines, CSV delimiter sniff, GeoJSON "type".

## Routing table (examples)
- **GeoJSON/TopoJSON** → Vector Layer (native)
- **GLB/GLTF** → Mesh Layer (native)
- **COG/GeoTIFF/TIFF** → Raster Layer (native if georeferenced; else Image Layer)
- **CSV/Parquet/Arrow** → Table → Chart2D/Vector (points) with mapping UI
- **Shapefile/LAZ/E57/MBTiles/PMTiles/NetCDF/HDF5/NIfTI** → Importer pipeline

## Sniffer API (TS)
```ts
type SniffKind = "vector"|"mesh"|"raster"|"image"|"table"|"tiles"|"tiles3d"|"unknown";
type SniffResult = { kind: SniffKind; fmt: string; confidence: number; handler: string };

async function sniff(input: File|URL|string): Promise<SniffResult>;
```

## Safety & limits
- Size thresholds for eager reading; switch to streamed/chunked parsing beyond 32MB.
- All parsing happens in **Workers**; main thread receives structured clone or transferable handles.

## Events
- `uv.io.sniff` (fmt, size, confidence), `uv.io.error`

## Acceptance
- 99% correct classification on canonical samples; wrong types degrade safely.

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
