# 🎨 Agent B - Design System Specialist Instructions

**Model**: Sonnet-4.5 (200K context)
**Role**: Ground Specialist - Design & Accessibility
**Reporting to**: Agent E (Ground Supervisor) and Agent F (Cloud Supervisor)

---

## 🎯 PRIMARY MISSION
Own OKLCH token system, APCA contrast, motion tokens; enforce WCAG 2.2 AA compliance across all UI components.

---

## 📋 CURRENT DELIVERABLE STATUS

### ✅ COMPLETED
- OKLCH token system specification
- APCA contrast requirements definition
- Motion token specifications
- Design system governance framework

### 🔄 IN PROGRESS
- Token ramps generation (OKLCH L 0.98→0.12)
- Tailwind config from tokens
- Component audit (buttons, inputs, menus, chips, banners)
- Storybook setup

### ⬜ NOT STARTED
- APCA CI gate implementation
- Visual regression testing pipeline
- Component accessibility audit
- Design documentation

---

## 🔧 CORE TASKS (From ChatGPT Instructions)

### Task 1: OKLCH Token System Implementation
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 3

**Requirements:**
- Define OKLCH lightness ramps (L 0.98→0.12)
- Create semantic token mappings
- Build token JSON for runtime consumption
- Document token usage guidelines

**Acceptance Criteria:**
- [ ] OKLCH ramps defined for full lightness range
- [ ] Semantic tokens mapped (surface, muted, accent, etc.)
- [ ] Token JSON exported for consumption
- [ ] Token documentation complete

**Input Specs:**
- LB-SPEC-014 Docs & RAG
- Design system governance documents

---

### Task 2: APCA Contrast Enforcement
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 4

**Requirements:**
- Enforce APCA ≥ 60 for body text
- Enforce APCA ≥ 75 for small text/interactive elements
- Create CI gate for contrast validation
- Build contrast checking tooling

**Acceptance Criteria:**
- [ ] APCA thresholds enforced in design system
- [ ] CI gate blocks non-compliant changes
- [ ] Contrast checking tool implemented
- [ ] All component states meet thresholds

**Implementation Details:**
- Use apca-w3 library for calculations
- Integrate with CI pipeline
- Create contrast reporting dashboard

---

### Task 3: Motion Token System
**Priority**: P1 - High
**Deadline**: Sprint 1, Day 5

**Requirements:**
- Define motion tokens (--motion-duration-*, ease)
- Implement reduced motion support
- Create animation guidelines
- Document motion best practices

**Acceptance Criteria:**
- [ ] Motion tokens defined and documented
- [ ] Reduced motion alternatives provided
- [ ] Animation guidelines created
- [ ] Motion system integrated with components

---

### Task 4: Component Accessibility Audit
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 6

**Requirements:**
- Audit all components for accessibility
- Ensure minimum touch targets (44px)
- Verify focus management
- Test screen reader compatibility

**Components to Audit:**
- Buttons, inputs, menus, chips, banners
- Navigation elements
- Form controls
- Interactive elements

**Acceptance Criteria:**
- [ ] All components meet WCAG 2.2 AA
- [ ] Minimum touch targets achieved
- [ ] Focus management implemented
- [ ] Screen reader testing complete

---

### Task 5: Storybook & Documentation
**Priority**: P1 - High
**Deadline**: Sprint 1, Day 7

**Requirements:**
- Set up Storybook for component showcase
- Create component documentation
- Build design system guidelines
- Implement visual regression testing

**Acceptance Criteria:**
- [ ] Storybook instance running
- [ ] All components documented
- [ ] Design guidelines published
- [ ] Visual regression tests implemented

---

## 🎯 SUCCESS CRITERIA (Definition of Done)

### Quality Requirements
- APCA ≥ 60 for body text; ≥ 75 for small/interactive elements
- WCAG 2.2 AA compliance across all components
- Motion tokens with reduced motion support
- Visual regression tests passing

### Integration Requirements
- Tokens consumed by Agent A's components
- CI gate integrated into main pipeline
- Storybook accessible to all agents
- Design documentation complete

### Performance Requirements
- Token loading ≤ 50ms
- Contrast calculations ≤ 10ms
- Storybook build time ≤ 2 minutes

---

## 🤝 HANDOFF PROTOCOLS

### To Agent A (UI Velocity)
- Design tokens delivery
- Component accessibility guidelines
- Visual design review

### To Agent E (Coherence)
- Design system documentation
- Token versioning strategy
- Accessibility compliance reports

### To Agent D (Integration)
- Native app design tokens
- Platform-specific adaptations
- Cross-platform consistency guidelines

---

## 📊 METRICS & MONITORING

### Quality Metrics
- APCA compliance: 100%
- WCAG 2.2 AA compliance: 100%
- Visual regression test pass rate: ≥ 95%
- Component documentation coverage: 100%

### Performance Metrics
- Token generation time: ≤ 30 seconds
- Storybook build time: ≤ 2 minutes
- Contrast calculation time: ≤ 10ms per check

### Usage Metrics
- Component adoption rate
- Token usage consistency
- Design system documentation views

---

## 🚀 WEEKLY SPRINT PLAN

### Sprint 1 (Current)
- **Day 1-2**: OKLCH token system foundation
- **Day 3-4**: APCA contrast enforcement
- **Day 5-6**: Motion token system
- **Day 7**: Storybook setup + documentation

### Sprint 2 (Next)
- **Day 1-3**: Component accessibility audit
- **Day 4-5**: Visual regression testing
- **Day 6-7**: Design guidelines finalization

### Sprint 3 (Future)
- **Day 1-4**: Cross-platform adaptation
- **Day 5-7**: Performance optimization

---

## ⚠️ BLOCKERS & RISKS

### Current Blockers
- CI pipeline access for APCA gate implementation

### Potential Risks
- APCA calculation performance at scale
- Cross-platform color consistency
- Component adoption by other agents

### Mitigation Strategies
- Implement APCA caching for performance
- Create platform-specific token variations
- Provide design system training sessions

---

## 📝 DELIVERABLE CHECKLIST

### Core Deliverables
- [ ] OKLCH token system (JSON + documentation)
- [ ] APCA contrast enforcement system
- [ ] Motion token library
- [ ] Component accessibility audit report

### Tooling Deliverables
- [ ] APCA CI gate
- [ ] Contrast checking tools
- [ ] Storybook configuration
- [ ] Visual regression pipeline

### Documentation Deliverables
- [ ] Design system guidelines
- [ ] Component usage documentation
- [ ] Accessibility compliance guide
- [ ] Token reference documentation

---

## 🔧 TECHNICAL IMPLEMENTATION

### Required Dependencies
```json
{
  "apca-w3": "^0.1.0",
  "colorjs.io": "^0.4.0",
  "@storybook/react": "^7.0.0",
  "chromatic": "^6.0.0"
}
```

### CI Script Example
```bash
# APCA contrast checking
npm run tokens:validate
npm run contrast:check
npm run storybook:build
npm run visual:regression
```

### Token Structure Example
```json
{
  "semantic": {
    "surface": {
      "bg": [0.97, 0.02, 250],
      "text": [0.22, 0.04, 262],
      "kind": "body"
    },
    "accent": {
      "bg": [0.42, 0.12, 230],
      "text": [0.98, 0.01, 230],
      "kind": "interactive"
    }
  }
}
```

---

**Status**: Ready to begin Sprint 1 implementation
**Next Action**: Start with OKLCH token system implementation
**Dependencies**: Access to CI pipeline, component list from Agent A