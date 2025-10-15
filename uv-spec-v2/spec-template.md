---
# v2 front matter (validated in CI)
id: uv-XXXX
title: "<Spec Title>"
status: draft # draft|proposed|accepted|deprecated
owner: "@team/owner"
created: "2025-10-15"
updated: "2025-10-15"
flavor: codegen # codegen|reference

artifacts:
  package: "packages/<pkg-name>"
  paths:
    - "src/<feature>/index.ts"
  symbols:
    - "<ExportedSymbol>"
  tests:
    unit: ["packages/<pkg-name>/src/**/__tests__/*.test.ts"]
    integration: ["apps/desktop/**/__tests__/*.(test|spec).ts"]
    e2e: ["apps/desktop/e2e/**/*.spec.ts"]
    gpu_snapshot: ["packages/**/__snapshots__/**/*.gpu.json"]
    benchmarks: ["packages/**/__bench__/**/*.bench.ts"]

performance_budgets:
  fps_min: 60
  frame_time_ms_p95_max: 16.7
  js_heap_mb_max: 512
  gpu_mem_mb_max: 2048
  shader_compile_ms_p95_max: 50
  tile_load_ms_p95_max: 150
  initial_bundle_kb_max: 900

observability:
  metrics_prefix: "uv"
  events:
    - name: "uv.hillshade.apply"
      when: "User toggles hillshade"
      payload:
        layerId: "string"
        intensity: "number"
      level: "info"
      sample_rate: 1.0
      privacy: "none"

# Optional additional metadata (free-form)
tags: ["layers", "hillshade", "rendering"]
depends_on: ["uv-AAAA", "uv-BBBB"]
---

## 1. Problem Statement
<What problem does this spec solve?>

## 2. Background & Context
<Relevant history, related specs, constraints, prior art>

## 3. Goals & Non‑Goals
<What success looks like; what’s explicitly out of scope>

## 4. Scope & Dependencies
<Boundaries, systems touched, migrations, external deps>

## 5. Interfaces (Types & Contracts)
<Types, APIs, protocol messages; code blocks recommended>

## 6. Architecture & Components
<Modules, packages, responsibilities, diagrams>

## 7. Data Flow / Algorithms
<Core flows and algorithms; pseudo-code is fine>

## 8. Implementation Recipe (Ingredients + Steps + Stubs)
- Ingredients: <packages, libs, datasets>
- Steps: <1..N>
- Stubs: <files & symbols to scaffold>

## 9. Artifacts & Code Map
<Brief table linking front matter artifacts → actual code locations>

## 10. Test Plan
<Map `artifacts.tests.*` to concrete test runner targets and commands>

## 11. Performance & Budgets
<How the perf harness measures + expected thresholds from front matter>

## 12. Observability (Events & Metrics)
<Event schemas, metric names from `metrics_prefix`, dashboards, alerts>

## 13. Acceptance Criteria & Rollout
<Definition of Done, rollout/flags, risk matrix, backout, owners>