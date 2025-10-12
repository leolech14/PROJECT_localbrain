# 🎨 Agent A - UI Velocity Specialist Instructions

**Model**: GLM-4.6 (200K context)
**Role**: Ground Worker - Frontend Development
**Reporting to**: Agent E (Ground Supervisor) and Agent F (Cloud Supervisor)

---

## 🎯 PRIMARY MISSION
Ship front-end components rapidly with hot iteration, using the Next.js prototype track as the "UI lab" for the Swift app's UX decisions.

---

## 📋 CURRENT DELIVERABLE STATUS

### ✅ COMPLETED
- UI Shell & Window Orchestration (LB-SPEC-010)
- Agent Control Protocol integration
- Approval Tray UX scaffold
- Component contracts and layouts

### 🔄 IN PROGRESS
- 12-col responsive dashboard grid + drag/resize
- Sidebar agent panel (overlay/push)
- React Query + SSR first-load
- Offline: IndexedDB persistence

### ⬜ NOT STARTED
- Motion tokens + reduced motion support
- Keyboard parity for all intents
- APCA ≥ 60 for body text enforcement
- Storybook/Playwright demos

---

## 🔧 CORE TASKS (From ChatGPT Instructions)

### Task 1: Grid & Layout Implementation
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 3

**Requirements:**
- Implement 12-col responsive dashboard grid
- Drag/resize with collision rules
- Persist per breakpoint (local first, server sync later)
- FLIP transitions on reorder/resize

**Acceptance Criteria:**
- [ ] Grid: deterministic placement with collision rules
- [ ] FLIP transitions on reorder/resize
- [ ] Layout updates debounce 150–300ms
- [ ] Keyboard-only: swap panels, focus next/prev, maximize/restore

**Input Specs:**
- LB-SPEC-010 UI Shell & Window Orchestration
- LB-SPEC-011 Agent Control Protocol

---

### Task 2: Sidebar & Agent Panel
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 4

**Requirements:**
- Sidebar toggles in ≤100ms
- Context menus, proposal badges
- Reduced motion support
- Keyboard navigation

**Acceptance Criteria:**
- [ ] Sidebar overlay/push modes
- [ ] Agent proposals display
- [ ] Context menu system
- [ ] Reduced motion honored
- [ ] Keyboard navigation complete

---

### Task 3: React Query + SSR Integration
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 5

**Requirements:**
- React Query + SSR first-load
- Hydration as client islands for interactive widgets
- No spinner-first loads on primary routes

**Acceptance Criteria:**
- [ ] SSR priming for primary routes
- [ ] Client islands hydrate without blocking
- [ ] React Query persistence working
- [ ] Performance: first paint shows server-rendered shell

---

### Task 4: Offline Support
**Priority**: P1 - High
**Deadline**: Sprint 1, Day 6

**Requirements:**
- IndexedDB persistence for layout + query cache
- Outbox queue for pending changes
- Service worker caching

**Acceptance Criteria:**
- [ ] IndexedDB layout persistence
- [ ] Query cache offline functionality
- [ ] Outbox queue for offline changes
- [ ] Airplane mode shows last-known data

---

### Task 5: Design System Integration
**Priority**: P0 - Critical
**Working With**: Agent B (Design System Specialist)

**Requirements:**
- Wire APCA guard and token ramp previews
- Implement design tokens from Agent B
- Ensure contrast compliance

**Acceptance Criteria:**
- [ ] Design tokens integrated
- [ ] APCA checks passing
- [ ] Storybook integration
- [ ] Visual regression tests

---

## 🎯 SUCCESS CRITERIA (Definition of Done)

### Performance Requirements
- Grid: deterministic placement; FLIP transitions
- Sidebar toggle ≤100ms; respects reduced motion
- APCA ≥ 60 for body text; tokens only from OKLCH system
- No spinner-first loads on primary routes (SSR or RSC)

### Quality Requirements
- CI passes: lint, type, unit tests
- Lighthouse a11y ≥ 90
- APCA gate enforced in CI
- All components keyboard accessible

### Integration Requirements
- IPC contract with Swift (Agent D) working
- Layout intents routed through Agent Control Protocol
- HITL Approval Tray integration functional

---

## 🤝 HANDOFF PROTOCOLS

### To Agent B (Design System)
- Design token requirements
- APCA compliance verification
- Component visual polish

### To Agent D (Integration)
- IPC contracts for UI control
- Swift ↔ Web bridge requirements
- Pane management APIs

### To Agent E (Coherence)
- Component documentation
- Pattern library updates
- Cross-reference specs

---

## 📊 METRICS & MONITORING

### Performance Metrics
- First paint ≤ 1.2s
- Panel operations ≤ 100ms
- Layout reflow ≤ 120ms p95
- Sidebar toggle ≤ 100ms

### Quality Metrics
- Lighthouse accessibility score ≥ 90
- APCA compliance 100%
- Keyboard navigation coverage 100%
- Storybook coverage ≥ 95%

---

## 🚀 WEEKLY SPRINT PLAN

### Sprint 1 (Current)
- **Day 1-2**: Grid system foundation
- **Day 3-4**: Sidebar & agent panel
- **Day 5-6**: SSR + React Query integration
- **Day 7**: Offline support + testing

### Sprint 2 (Next)
- **Day 1-3**: Motion tokens + animations
- **Day 4-5**: Keyboard navigation enhancement
- **Day 6-7**: Storybook + documentation

### Sprint 3 (Future)
- **Day 1-4**: Integration testing with Swift bridge
- **Day 5-7**: Performance optimization + polish

---

## ⚠️ BLOCKERS & RISKS

### Current Blockers
- None identified

### Potential Risks
- Swift ↔ Web IPC bridge delays (coordinate with Agent D)
- Design token availability (coordinate with Agent B)
- Performance targets for complex layouts

### Mitigation Strategies
- Daily sync with Agent D on IPC integration
- Parallel work with Agent B on design system
- Performance testing early and often

---

## 📝 DELIVERABLE CHECKLIST

### Core Deliverables
- [ ] 12-col responsive grid system
- [ ] Sidebar agent panel with proposals
- [ ] React Query + SSR integration
- [ ] Offline persistence system
- [ ] Component library documentation

### Integration Deliverables
- [ ] IPC contract implementation
- [ ] HITL Approval Tray integration
- [ ] Design system token integration
- [ ] Performance optimization

### Documentation Deliverables
- [ ] Component usage documentation
- [ ] Integration guides
- [ ] Performance benchmarks
- [ ] Accessibility compliance report

---

**Status**: Ready to begin Sprint 1 implementation
**Next Action**: Start with 12-col grid system implementation
**Dependencies**: Design tokens from Agent B, IPC contracts from Agent D