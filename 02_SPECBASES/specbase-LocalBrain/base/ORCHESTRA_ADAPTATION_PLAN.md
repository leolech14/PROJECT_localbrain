# Orchestra Blue → LocalBrain Spec Adaptation Plan

## Current Situation

**LocalBrain**: Swift/SwiftUI macOS desktop app with:
- SpecProbe event emission system
- Actor-based concurrency
- YAML front-matter executable specs
- ChatGPT-5 Pro delivered Iteration 7

**Orchestra Blue**: Electron/Next.js/React web app with:
- 5-category spec system (mod/scf/cfg/gov/ops)
- Comprehensive YAML front-matter
- Promotion gates & observability
- Agent-first architecture

## Goal

**Borrow Orchestra's specification discipline** while adapting to LocalBrain's Swift/macOS context:
- Keep 5-category system
- Adapt terminology from web → native macOS
- Import "Data Pool" concept as shared context store
- Maintain executable spec philosophy

---

## 5-Category Mapping for LocalBrain

### 1. **mod-** MODULE (Core Services & Actors)
**Orchestra**: Backend services, AI layers, data pools
**LocalBrain**: Swift actors and services

Examples:
- `mod.DATA_POOL.md` - Unified context storage
- `mod.VOICE_METRICS.md` - Audio processing actor
- `mod.MEMORY_RAG.md` - Vector memory service
- `mod.ORCHESTRATOR.md` - Central intelligence conductor
- `mod.TTS_SERVICE.md` - Text-to-speech actor
- `mod.STT_SERVICE.md` - Speech-to-text actor

### 2. **scf-** SCAFFOLD (SwiftUI Components & Views)
**Orchestra**: React components, layout patterns
**LocalBrain**: SwiftUI views, native macOS patterns

Examples:
- `scf.MAIN_WINDOW.md` - Primary app window layout
- `scf.FILE_DRAWER.md` - File context drawer UI
- `scf.VOICE_INDICATOR.md` - Animated eyes/voice status
- `scf.BROWSER_PANEL.md` - MCP browser integration view
- `scf.CONTROL_PANEL.md` - Settings and controls

### 3. **cfg-** CONFIGURATION (Runtime Config & Policies)
**Orchestra**: Compliance policies, business rules
**LocalBrain**: App configuration, API limits, feature flags

Examples:
- `cfg.API_PROVIDERS.md` - OpenAI/Anthropic/Gemini config
- `cfg.KEYCHAIN_SECURITY.md` - macOS Keychain credential storage
- `cfg.SPEC_EXECUTION.md` - LB_SPEC_COVERAGE_DIR policies
- `cfg.CONTEXT_LIMITS.md` - Token budget policies

### 4. **gov-** GOVERNANCE (Architecture & Standards)
**Orchestra**: Project architecture, implementation roadmaps
**LocalBrain**: Swift architecture patterns, spec standards

Examples:
- `gov.SWIFT_ARCHITECTURE.md` - Actor model, concurrency patterns
- `gov.SPEC_SYSTEM.md` - YAML executable spec standards
- `gov.EVENT_EMISSION.md` - SpecProbe/SpecRecorder conventions
- `gov.IMPLEMENTATION_ROADMAP.md` - Feature development plan

### 5. **ops-** OPERATIONS (Build, Test, Deploy)
**Orchestra**: Runtime monitoring, deployment
**LocalBrain**: Xcode build, testing, macOS distribution

Examples:
- `ops.XCODE_BUILD.md` - Swift build process
- `ops.SPEC_RUNNER.md` - Executable spec test harness
- `ops.MACOS_DISTRIBUTION.md` - App signing & notarization
- `ops.TELEMETRY.md` - SpecRecorder event collection

---

## Key Adaptations

### From Electron/Web → Swift/macOS

| Orchestra (Web) | LocalBrain (macOS) |
|-----------------|-------------------|
| TypeScript interfaces | Swift protocols & structs |
| React components | SwiftUI views |
| npm scripts | Xcode build phases |
| Environment variables | Info.plist + ProcessInfo |
| Prometheus metrics | SpecProbe event emission |
| Web dashboards | Local JSONL logs + spec validation |
| HTTP endpoints | Actor message passing |
| REST APIs | MCP tool calls |

### YAML Front-Matter Adaptations

**Keep from Orchestra**:
- `title`, `module_id`, `type`, `category`
- `lifecycle`, `state`, `priority`
- `promotion_gates` (minimal → i1 → i2 → i3 → complete)
- `observability` (metrics, alerts)
- `security` requirements
- `agent_capabilities` & `agent_boundaries`

**Add for LocalBrain**:
- `swift_actor`: Name of implementing actor/service
- `swiftui_view`: Associated SwiftUI view (if UI)
- `spec_probe_events`: List of emitted events
- `macos_entitlements`: Required app entitlements
- `xcode_target`: Build target (app vs test vs extension)

---

## Implementation Steps

### Phase 1: Structure (Immediate)
1. ✅ Create `/SPECBASE/` with 5 subdirectories
2. Create universal templates for each category
3. Port key Orchestra specs to LocalBrain context

### Phase 2: Core Specs (Week 1)
1. Write `mod.DATA_POOL.md` (the "soup")
2. Write `mod.CONTEXT_SELECTOR.md` (token-efficient selection)
3. Write `mod.ORCHESTRATOR.md` (central conductor)
4. Write `scf.FILE_DRAWER.md` (UI integration)
5. Write `gov.SPEC_SYSTEM.md` (executable spec standards)

### Phase 3: Integration Specs (Week 2)
1. Write `mod.REALTIME_VOICE.md` (OpenAI Realtime API)
2. Write `mod.HIVE_MIND.md` (multi-model coordination)
3. Write `cfg.API_PROVIDERS.md` (provider config)
4. Write `ops.SPEC_RUNNER.md` (test harness)

### Phase 4: Validation (Week 3)
1. Run all specs against current LocalBrain build
2. Identify gaps between spec and implementation
3. Update implementation OR update specs to match reality
4. Achieve >80% spec compliance

---

## Success Criteria

- [ ] All 5 category directories populated with templates
- [ ] 15+ specs written covering core LocalBrain features
- [ ] YAML front-matter includes Swift-specific fields
- [ ] Specs reference actual Swift files (with line numbers)
- [ ] SpecRunner can validate specs against implementation
- [ ] Data Pool architecture fully specified
- [ ] Hive-mind orchestration documented
- [ ] Real-time voice session flow complete

---

## Next Actions

1. **Create SPECBASE structure** with 5 directories
2. **Write universal templates** adapted for Swift/macOS
3. **Port Data Pool spec** from our earlier work
4. **Map file drawer workflow** to spec format
5. **Document hive-mind orchestration** vision
