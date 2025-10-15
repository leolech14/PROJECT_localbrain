---
spec_id: VOLUME_LAYER
title: Volume Layer (Slices & Quick Isosurface)
version: 0.1.0
owner: Leo
status: draft
batch: 6
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Golden snapshots, transfer-function presets, and test volumes attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.volume.layer
  metrics_prefix: uv.volume.layer
risks:
  - id: R-VOLUME_LAYER-1
    desc: "Cross-engine camera/selection drift and depth interop"
    mitigation: "Linked state via adapters; no Z-buffer sharing; explicit conversions with tests"
---

## Purpose
Provide **quick-look** volumetric visualization inside the main viewer (Cesium) using
orthogonal **slices** and a **simple isosurface** path. Heavy ray-marching is delegated
to Scientific Mode.

## Inputs
- Files: **NIfTI** (`.nii`, `.nii.gz`), **DICOM** series (via importer), **NetCDF**, **HDF5**, **Zarr**.
- For large arrays, importer precomputes **overview levels** (mipmaps) and metadata (spacing, units).

## Data model
```ts
type VolumeInfo = {
  dims: [nx, ny, nz]; spacing: [sx, sy, sz]; origin: [ox, oy, oz];
  valueUnit?: string; valueRange?: [min,max]; time?: number[]; channels?: string[];
  transform: TransformSpec; // CRS/axis/units
};
```
- Slices address volume in **i/j/k** (index space) with transform → world.

## Rendering (main viewer)
- **Slices**: axial/coronal/sagittal planes as textured quads; sampling: nearest|linear; window/level controls.
- **Isosurface (quick)**: marching cubes **in a worker** → glTF mesh; material from style; optional decimation on large grids.

## Style
- Transfer function editor (1D) for slice mapping (grayscale or ramp with alpha).
- Slice thickness (slab sampling) and interpolation; brightness/contrast; value clamp.

## Interactions
- **Probe** tool: voxel value at cursor; shows physical coords using spacing and origin.
- **Linked selection**: slice extent highlighted when selection on a 3D object intersects volume bounds.

## Performance
- 256² slice updates must be < 50 ms UI→draw; textures uploaded via ImageBitmap when possible.
- Isosurface mesh generation target < 800 ms on 128³; progress events every 200 ms.

## Observability
- `uv.volume.slice.changed`, `uv.volume.iso.changed`, `uv.volume.probe`, `uv.volume.warn`.

## Acceptance
- Three orthogonal slices responsive; iso slider produces mesh within gate; probe stable and correct with unit conversion.
