# LocalBrain SCAFFOLD Universal Template

---
## ===== SCAFFOLD IDENTITY =====
title: "[Scaffold Name] - [Visual/Structural Description]"
scaffold_id: "[unique_identifier]"
type: "scaffold"
category: "structural"

## ===== SWIFTUI IMPLEMENTATION =====
swiftui_view: "[ViewName]"
swift_file: "LocalBrain/Views/[FileName].swift"
view_type: "[window|panel|drawer|overlay|control]"

## ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "dev"
state: "minimal"
seat: "mvp"

## ===== AVAILABILITY AND ACCESS =====
phase_availability: "always"
priority: "critical"
macos_version: "14.0+"
native_controls: true

## ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "Core layout implemented and tested"
    - "SwiftUI rendering working"
    - "Basic responsiveness functional"
  to_intermediate_i2:
    - "UX polish complete"
    - "Accessibility compliant"
    - "Dark mode support"
  to_intermediate_i3:
    - "Advanced animations working"
    - "Edge cases handled"
    - "Performance optimized"
  to_complete:
    - "Production deployment validated"
    - "All states working"
    - "Design system compliance"

## ===== OBSERVABILITY =====
observability:
  spec_events:
    - "[scaffold_name].render.success"
    - "[scaffold_name].interaction.performed"
  performance_metrics:
    - "render_time_ms"
    - "frame_rate"
  spec_validation:
    - "LB-[SCAFFOLD]-XXX.spec.md"

## ===== SECURITY REQUIREMENTS =====
security:
  user_interaction: true
  sensitive_data_display: false
  accessibility_required: true
  voiceover_support: true

## ===== TECHNICAL METADATA =====
dependencies: []
swiftui_modifiers: []
macos_apis: []
last_updated: "YYYY-MM-DD"
version: "1.0.0"
maintainer: "LocalBrain Team"

## ===== AGENTIC INTEGRATION =====
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: true
  requires_approval: false

agent_boundaries:
  allowed_operations: ["read_layout", "propose_changes"]
  forbidden_operations: ["modify_structure", "bypass_design"]
  escalation_triggers: ["layout_corruption", "accessibility_violation"]
---

# [Scaffold Name] - [Visual/Structural Description]

## Purpose

**Why this scaffold exists - structural/visual foundation.**

**Must contain:**
- Philosophy of use (why this scaffold is necessary)
- Clear boundaries (what scaffold GUARANTEES vs what modules decide)

**Must NOT contain:**
- Specific features of modules using the scaffold

**Format:** 1-2 paragraphs + bullets for "out of scope"

---

## Primary Features

**UI/UX patterns provided by this scaffold.**

**Must contain:**
- Visual hierarchy rules
- Layout constraints
- Interaction patterns
- Accessibility guarantees

**Format:**
```markdown
- **Visual Feature:** Description of visual pattern
- **Interaction Feature:** Description of interaction pattern
- **Accessibility Feature:** VoiceOver, keyboard nav, contrast
```

---

## Architecture

**SwiftUI view hierarchy and layout structure.**

**Must contain:**
- SwiftUI view composition
- Layout system (HStack/VStack/ZStack/Grid)
- State management (@State, @ObservedObject, @EnvironmentObject)
- View lifecycle

**Format:**
```markdown
[1 paragraph overview]

\`\`\`mermaid
graph TD
  A[RootView] --> B[ContentView]
  A --> C[OverlayView]
\`\`\`

**SwiftUI Structure:**
- RootView: Window container
- ContentView: Main layout
- OverlayView: Floating elements

**State Management:**
- @State for local UI state
- @ObservedObject for shared state
- @EnvironmentObject for app-wide state
```

---

## Contracts

**SwiftUI view protocols and bindings.**

**Format:**
```swift
// View Protocol
struct ScaffoldView: View {
    @ObservedObject var model: ScaffoldModel
    @State private var localState: Bool = false

    var body: some View {
        // View body
    }
}

// Model Protocol
@MainActor
class ScaffoldModel: ObservableObject {
    @Published var state: StateType
    @Published var config: ConfigType

    func updateState() {
        // Update logic
    }
}

// Configuration
struct ScaffoldConfig {
    let layout: LayoutType
    let theme: ThemeType
    let accessibility: AccessibilityConfig
}
```

---

## Sub-Components & Behavior

**UI component breakdown and interactions.**

**Format:**
```markdown
### ComponentName (SwiftUI View)

- **Purpose:** What it displays/enables
- **Behavior:** How user interacts with it
- **SwiftUI Type:** View | ViewModifier | PreferenceKey
- **MainActor:** Yes (all SwiftUI views)
- **Props:**
\`\`\`swift
struct ComponentProps {
    let title: String
    let action: () -> Void
    @Binding var isPresented: Bool
}
\`\`\`
- **Responsive:** macOS window resizing behavior
```

---

## State Progression & Promotion Gates

**Scaffold maturity levels and criteria.**

**Format:**
```markdown
### Current State: minimal

### Minimal State
**Definition:** Basic layout that renders correctly
**Requirements:**
- [ ] SwiftUI view structure implemented
- [ ] Basic layout working
- [ ] Renders without errors
- [ ] Accessibility labels present

### Intermediate I1 State
**Definition:** Polished UX with interactions
**Requirements:**
- [ ] All interactions working
- [ ] Animations smooth
- [ ] Dark mode support
- [ ] VoiceOver functional

### Intermediate I2 State
**Definition:** Advanced features and optimization
**Requirements:**
- [ ] Performance optimized (<16ms frame time)
- [ ] Complex animations working
- [ ] Edge cases handled
- [ ] Accessibility compliance verified

### Intermediate I3 State
**Definition:** Production-ready with full polish
**Requirements:**
- [ ] All states tested
- [ ] Cross-window behavior working
- [ ] Memory leaks fixed
- [ ] Design system compliance

### Complete State
**Definition:** Battle-tested production scaffold
**Requirements:**
- [ ] Zero visual bugs
- [ ] All window sizes supported
- [ ] Accessibility audit passed
- [ ] Performance SLA met

## Promotion Gates
- **Minimal→I1:** Renders correctly + basic interactions + accessibility labels
- **I1→I2:** UX polish + dark mode + VoiceOver working
- **I2→I3:** Performance optimized + edge cases + compliance
- **I3→Complete:** Production validated + zero bugs + SLA met
```

---

## Production Implementation

**How to build and deploy this SwiftUI scaffold.**

**Format:**
```markdown
### Production-Ready Implementation

\`\`\`swift
// SwiftUI View Implementation
struct ProductionScaffold: View {
    @StateObject private var model = ScaffoldModel()
    @Environment(\\.colorScheme) private var colorScheme

    var body: some View {
        VStack {
            // Layout implementation
        }
        .frame(minWidth: 800, minHeight: 600)
        .background(backgroundColor)
        .accessibility(label: Text("Main Window"))
    }

    private var backgroundColor: Color {
        colorScheme == .dark ? Color.black : Color.white
    }
}

// Observable Model
@MainActor
class ScaffoldModel: ObservableObject {
    @Published var state: StateType

    init() {
        // Initialize
    }
}
\`\`\`

**SwiftUI Modifiers:**
- `.frame(minWidth:minHeight:)` - Window constraints
- `.background()` - Theme support
- `.accessibility()` - VoiceOver support
- `.onAppear()` - Lifecycle hooks

**Testing:**
1. Preview: Use Xcode SwiftUI previews
2. UI Test: `xcodebuild test -scheme LocalBrainUITests`
3. Accessibility: Xcode Accessibility Inspector
```

---

## Security & Compliance

**UI security and accessibility compliance.**

**Format:**
```markdown
**Security Controls:**
- User input validation: [yes/no]
- Sensitive data masking: [yes/no]
- Secure text entry: [yes/no]

**macOS Accessibility:**
- VoiceOver support: Required
- Keyboard navigation: Full support
- High contrast mode: Supported
- Reduced motion: Respected

**Compliance:**
- WCAG 2.1 Level AA: Target
- macOS HIG compliance: Required
- SwiftUI best practices: Enforced
```

---

## Testing Strategy

**UI testing approach and scenarios.**

**Format:**
```markdown
**Test Scenarios:**

1. **Scenario: Basic Rendering**
   - Given: App launches
   - When: Scaffold view appears
   - Then: Layout renders correctly
   - Spec: `LB-SCAFFOLD-001.spec.md`
   - Command: `xcodebuild test -scheme LocalBrainUITests -only-testing:ScaffoldRenderingTests`

2. **Scenario: Dark Mode**
   - Given: Scaffold is visible
   - When: User toggles dark mode
   - Then: Colors update correctly
   - Spec: `LB-SCAFFOLD-002.spec.md`

3. **Scenario: Accessibility**
   - Given: VoiceOver is enabled
   - When: User navigates scaffold
   - Then: All elements are accessible
   - Spec: `LB-SCAFFOLD-003.spec.md`

**SwiftUI Preview Testing:**
\`\`\`swift
#Preview {
    ScaffoldView()
        .preferredColorScheme(.dark)
}

#Preview("Light Mode") {
    ScaffoldView()
        .preferredColorScheme(.light)
}
\`\`\`
```

---

## Success Criteria, Performance & Observability

**Visual quality and performance targets.**

**Format:**
```markdown
| Metric | Target | Window | Source |
|--------|--------|--------|--------|
| Frame Rate | 60fps | Continuous | Instruments |
| Render Time | <16ms | Per frame | SpecProbe |
| Memory Usage | <50MB | Per window | Xcode Memory Graph |
| Accessibility | 100% | All elements | Accessibility Inspector |

**SLOs:**
- Performance: 60fps for smooth animations
- Render time: <16ms per frame for responsive UI
- Accessibility: 100% VoiceOver coverage

**Observability:**
- SpecProbe events: [list]
- Xcode Instruments: Time Profiler, SwiftUI profiling
- Accessibility Inspector: Full audit
```

---

## Agent Integration

**How agents interact with UI scaffolds.**

**Format:**
```markdown
**Agent Capabilities:**
- Agents can read scaffold state
- Agents can propose layout changes
- Agents CANNOT directly modify SwiftUI views

**Agent Boundaries:**
- Cannot modify view hierarchy directly
- Cannot bypass accessibility requirements
- Cannot violate macOS HIG guidelines

**Approval Workflow:**
- UI changes: Require human design review
- Layout tweaks: Auto-approved if within constraints
- Major redesign: Multi-stakeholder approval
```

---

## Integrations & References

**Dependencies and design system links.**

**Format:**
```markdown
### Dependencies:
- **Design System:** [[scf.DESIGN_SYSTEM]]
- **Theme:** [[cfg.THEME_CONFIG]]

### SwiftUI Integration:
- **Views Used:** [List of child views]
- **Modifiers Applied:** [List of custom modifiers]

### macOS Integration:
- **Window Management:** NSWindow, WindowGroup
- **Appearance:** NSAppearance, @Environment(\\.colorScheme)

### Implementation Order:
- **Build After:** [[scf.DESIGN_SYSTEM]]
- **Build Before:** [[feature_modules]]

### See Also:
- **Design Guidelines:** [[gov.SWIFTUI_GUIDELINES]]
- **Accessibility:** [[cfg.ACCESSIBILITY_STANDARDS]]
- **Testing:** [[ops.UI_TESTING]]
```

---

# 📋 SCAFFOLD UNIVERSAL TEMPLATE

**This template defines the UNIVERSAL TRUTH for all SCAFFOLD specification files in LocalBrain.**

**Use this as:**
- ✅ Template for creating new UI scaffold specs
- ✅ Checklist for SwiftUI view design
- ✅ Standard for consistent macOS UI patterns
- ✅ Normative guide for all 2-scf/* files

**Total Standard Sections:** 12
**Required:** Purpose, Features, Architecture, Contracts, Production Implementation
**SwiftUI-Specific:** View hierarchy, state management, accessibility, dark mode

---

**This is the CANONICAL SCAFFOLD SPECIFICATION TEMPLATE for LocalBrain.** 📋✅
