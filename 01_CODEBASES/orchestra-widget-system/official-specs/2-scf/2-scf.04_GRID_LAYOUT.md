---
spec_id: LB-SCF-001
title: "LocalBrain Grid Layout System - Orchestra Architecture Adaptation"
module_id: "localbrain.grid.layout"
type: "scaffold"
category: "ui_layout"
version: "1.0.0"
owners: [ui_team, architecture]
status: "ready"
platforms: [macos]
priority: "p0"

# Orchestra 5-Phase Implementation Gates
lifecycle: "dev"
state: "minimal"
seat: "mvp"

# Swift-Specific Implementation
swiftui_view: "OrchestraGridView"
swift_file: "LocalBrain/Views/Core/OrchestraGridView.swift"
xcode_target: "LocalBrain"

# Observability & Events
spec_probe_events: [
  "grid.layout.changed",
  "grid.widget.added",
  "grid.widget.removed",
  "grid.widget.resized",
  "grid.drag_started",
  "grid.drag_completed"
]

# Metrics for Validation
observability:
  spec_events: ["grid.layout.operation.*"]
  metrics_captured: ["layout_change_ms", "widget_count", "grid_utilization"]
  spec_validation: ["LB-SCF-001.validation.md"]

# Security & Access
security:
  filesystem_access: "read"
  network_access: false

# Agent Integration Boundaries
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: true
  requires_approval: false

agent_boundaries:
  allowed_operations: ["read_layout_state", "query_widget_status"]
  forbidden_operations: ["modify_system_layout", "bypass_security"]
  escalation_triggers: ["layout_corruption_detected", "performance_degraded"]

# Performance Requirements
performance_requirements:
  layout_calculation_ms_max: 16
  widget_resize_animation_ms: 200
  drag_response_ms_max: 50
  max_widgets_per_grid: 16

---

# LocalBrain Grid Layout System
## Orchestra Architecture Adaptation for Native macOS

### Purpose

Implement Orchestra's sophisticated grid layout system in native SwiftUI, combining the flexibility of drag-and-drop widget management with macOS performance and integration. This system serves as the foundation for LocalBrain's expanded IDE functionality.

### Primary Features

1. **Orchestra Scaffold Adaptation**: 4-part layout (Header, Sidebar, Content Grid, Footer)
2. **Drag & Drop Widget System**: Visual widget management from sidebar to grid
3. **Auto-Equilibrium Algorithm**: Dynamic space optimization between widgets
4. **Layout Editing Mode**: Grid line manipulation and cell management
5. **Real-time Layout Persistence**: Automatic layout state saving and restoration

### Architecture

#### Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        OrchestraScaffoldView                      │
├─────────────────────────────────────────────────────────────────┤
│  HeaderView ━━━━━━━━━━━━━━━━━━━ [ContentGridView] ━━━━━━━━━━━━━ │
│                        ┌─────┬─────┬─────┬─────┬─────┐            │
│                        │ W1  │ W2  │ W3  │ W4  │ W5  │ ← Grid Cells │
│  SidebarView           ├─────┼─────┼─────┼─────┼─────┤            │
│  ┌─────────────────► │ W6  │ W7  │ W8  │ W9  │ W10 │ ← Equilibrium │
│  │ Available        ├─────┼─────┼─────┼─────┼─────┤            │
│  │ Widgets          │     │     │     │     │     │            │
│  └─────────────────► └─────┴─────┴─────┴─────┴─────┘            │
│                        ← Drag & Drop →                        │
│  FooterView ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
└─────────────────────────────────────────────────────────────────┘
```

#### Swift Implementation Structure

```swift
// MARK: - Main Grid Layout Container
struct OrchestraScaffoldView: View {
    @StateObject private var gridLayoutManager: GridLayoutManager
    @StateObject private var widgetRegistry: WidgetRegistry
    @State private var isEditingLayout: Bool = false

    var body: some View {
        VStack(spacing: 0) {
            HeaderView(isEditing: $isEditingLayout)

            HStack(spacing: 0) {
                SidebarView(
                    availableWidgets: widgetRegistry.availableWidgets,
                    onWidgetDrag: gridLayoutManager.handleWidgetDrag
                )

                Divider()

                ContentGridView(
                    layoutManager: gridLayoutManager,
                    isEditing: $isEditingLayout
                )
            }

            FooterView(gridStats: gridLayoutManager.gridStatistics)
        }
        .background(Color(.windowBackgroundColor))
        .onAppear {
            await SpecProbe.shared.emit("grid.layout.initialized")
        }
    }
}

// MARK: - Grid Layout Manager
@MainActor
class GridLayoutManager: ObservableObject {
    @Published var gridLayout: GridLayout
    @Published var draggedWidget: WidgetInfo?
    @Published private var gridCells: [GridCell] = []

    // Auto-equilibrium algorithm
    func optimizeWidgetDistribution() {
        let startTime = Date()

        // Calculate optimal sizes based on content and widget priorities
        let optimizedSizes = calculateEquilibriumLayout()

        // Animate to new layout
        withAnimation(.easeInOut(duration: 0.2)) {
            applyNewLayout(optimizedSizes)
        }

        await SpecProbe.shared.emit("grid.layout.optimized", [
            "duration_ms": .number(Date().timeIntervalSince(startTime) * 1000),
            "widget_count": .number(gridCells.count)
        ])
    }

    // Drag and drop handling
    func handleWidgetDrop(at location: CGPoint, widget: WidgetInfo) {
        guard let targetCell = findGridCell(at: location) else { return }

        let startTime = Date()

        addWidgetToCell(widget, to: targetCell)
        optimizeWidgetDistribution()

        await SpecProbe.shared.emit("grid.widget.added", [
            "widget_id": .string(widget.id),
            "target_cell": .string(targetCell.id),
            "duration_ms": .number(Date().timeIntervalSince(startTime) * 1000)
        ])
    }
}

// MARK: - Grid Cell with Auto-Equilibrium
struct GridCellView: View {
    let cell: GridCell
    @State private var widgets: [WidgetInfo] = []
    @State private var cellSize: CGSize = .zero

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .topLeading) {
                // Render widgets with equilibrium distribution
                ForEach(widgets) { widget in
                    WidgetView(widget: widget, cellSize: $cellSize)
                        .frame(
                            width: calculateWidgetWidth(widget),
                            height: calculateWidgetHeight(widget)
                        )
                        .position(calculateWidgetPosition(widget, in: geometry.size))
                }
            }
            .onAppear {
                cellSize = geometry.size
                updateWidgetDistribution()
            }
            .onChange(of: geometry.size) { newSize in
                cellSize = newSize
                updateWidgetDistribution()
            }
        }
        .border(isEditingLayout ? Color.accentColor.opacity(0.3) : Color.clear, width: 1)
        .background(Color(.controlBackgroundColor))
    }

    // Equilibrium calculation based on widget content needs
    private func updateWidgetDistribution() {
        let totalPriority = widgets.reduce(0) { $0 + $1.displayPriority }

        for i in widgets.indices {
            let widget = widgets[i]
            let weight = Double(widget.displayPriority) / Double(totalPriority)

            // Update widget size based on cell space and priority
            widget.allocatedWidth = cellSize.width * weight
            widget.allocatedHeight = cellSize.height * calculateHeightWeight(widget)
        }
    }
}
```

#### Widget System Architecture

```swift
// MARK: - Widget Protocol (Orchestra Adaptation)
protocol OrchestraWidget: ObservableObject, Identifiable {
    var id: String { get }
    var displayName: String { get }
    var displayPriority: Int { get } // For equilibrium calculation
    var minimumSize: CGSize { get }
    var preferredAspectRatio: CGFloat { get }

    func makeView() -> AnyView
    func canAcceptDrop(_ widget: OrchestraWidget) -> Bool
    func handleDrop(_ widget: OrchestraWidget) -> Bool
}

// MARK: - Widget Registry
@MainActor
class WidgetRegistry: ObservableObject {
    @Published var availableWidgets: [OrchestraWidget] = []

    init() {
        registerCoreWidgets()
    }

    private func registerCoreWidgets() {
        // Core LocalBrain widgets as Orchestra widgets
        availableWidgets = [
            CentralIntelligenceWidget(),
            RealTimeConversationWidget(),
            FileEditorWidget(),
            ContextInspectorWidget(),
            TerminalWidget()
        ]
    }
}

// MARK: - Example Widget Implementation
struct CentralIntelligenceWidget: OrchestraWidget {
    @StateObject private var centralIntelligence: CentralIntelligenceService

    let id = "central.intelligence"
    let displayName = "Central Intelligence"
    let displayPriority = 10 // High priority for visibility
    let minimumSize = CGSize(width: 300, height: 400)
    let preferredAspectRatio: CGFloat = 0.75

    func makeView() -> AnyView {
        AnyView(
            CentralIntelligenceView(service: centralIntelligence)
                .frame(minWidth: minimumSize.width, minHeight: minimumSize.height)
        )
    }

    func canAcceptDrop(_ widget: OrchestraWidget) -> Bool {
        // Central Intelligence can receive agent status widgets
        return widget is AgentStatusWidget
    }

    func handleDrop(_ widget: OrchestraWidget) -> Bool {
        if let agentWidget = widget as? AgentStatusWidget {
            centralIntelligence.addAgentMonitor(agentWidget.agentId)
            return true
        }
        return false
    }
}
```

### Sub-Components & Behavior

#### Layout Editing Mode

```swift
struct LayoutEditingOverlay: View {
    @Binding var isEditing: Bool
    @ObservedObject var layoutManager: GridLayoutManager

    var body: some View {
        if isEditing {
            ZStack {
                // Grid lines
                ForEach(layoutManager.gridLines) { line in
                    Rectangle()
                        .stroke(Color.accentColor.opacity(0.3), style: StrokeStyle(lineWidth: 1, dash: [5]))
                        .frame(width: line.width, height: line.height)
                        .position(line.position)
                }

                // Add/Remove cell buttons
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        Button(action: { layoutManager.addGridRow() }) {
                            Image(systemName: "plus.rectangle")
                        }
                        .buttonStyle(.bordered)

                        Button(action: { layoutManager.removeGridRow() }) {
                            Image(systemName: "minus.rectangle")
                        }
                        .buttonStyle(.bordered)
                    }
                    .padding()
                }
            }
            .allowsHitTesting(true)
        }
    }
}
```

#### Drag and Drop System

```swift
struct DraggableWidget: View {
    let widget: OrchestraWidget
    @State private var dragOffset: CGSize = .zero
    @State private var isDragging: Bool = false

    var body: some View {
        widget.makeView()
            .offset(dragOffset)
            .scaleEffect(isDragging ? 1.05 : 1.0)
            .shadow(color: .black.opacity(0.2), radius: isDragging ? 10 : 2)
            .onDrag {
                isDragging = true
                return NSItemProvider(object: widget.id as NSString)
            }
            .onDrop(of: [.text], isTargeted: nil) { providers, location in
                isDragging = false
                return handleDrop(providers: providers, at: location)
            }
    }
}
```

### State Progression & Promotion Gates

#### Phase 0: MVP (Current Target)
**Requirements:**
- Basic 4-part scaffold implemented
- 3 core widgets functional (Central Intelligence, Real-Time Conversation, File Editor)
- Basic drag & drop from sidebar to grid
- Simple equilibrium algorithm working

**Validation Criteria:**
- All 12 spec sections completed in front-matter
- drag_response_ms_max < 100ms (relaxed for MVP)
- Grid layout persists across app restarts

#### Phase I1: Enhanced Grid Management
**Requirements:**
- Layout editing mode with grid line manipulation
- Add/remove grid rows and columns
- Advanced equilibrium algorithm with content awareness
- Widget resizing capabilities

**Additional Requirements:**
- Grid cells support multiple widgets per cell
- Widget-to-widget drag and drop
- Layout templates and presets

#### Phase I2: Performance Optimization
**Requirements:**
- layout_calculation_ms_max ≤ 16ms (60fps)
- Advanced animation system
- Memory optimization for large widget counts
- Background layout updates

#### Phase I3: Advanced Features
**Requirements:**
- Widget nesting and grouping
- Advanced drop zones and validation
- Layout import/export
- Multi-monitor support

#### Phase Complete: Production Ready
**Requirements:**
- Zero critical layout bugs
- 99.9% layout stability
- Complete accessibility support
- Comprehensive documentation

### Production Implementation

#### Xcode Build Configuration

```swift
// Info.plist additions
<key>NSDragAndDrop</key>
<true>
<key>NSSupportsAutomaticGraphicsSwitching</key>
<true>
```

#### Performance Optimizations

```swift
// Use @State sparingly for layout calculations
@MainActor
class GridLayoutManager: ObservableObject {
    // Performance: Only publish when layout actually changes
    @Published private(set) var gridLayout: GridLayout = GridLayout()

    // Performance: Debounce layout updates
    private var layoutUpdateTask: Task<Void, Never>?

    func requestLayoutUpdate() {
        layoutUpdateTask?.cancel()
        layoutUpdateTask = Task {
            try await Task.sleep(nanoseconds: 16_000_000) // 60fps debounce
            await updateLayout()
        }
    }
}
```

### Security & Compliance

#### Widget Security Model

```swift
enum WidgetSecurityLevel {
    case safe        // Read-only display widgets
    case restricted  // Can modify app state with approval
    case privileged  // Can access system resources
}

struct WidgetSecurityContext {
    let level: WidgetSecurityLevel
    let permissions: [WidgetPermission]
    let auditEvents: [String]
}
```

#### Content Validation

```swift
protocol SecureWidget: OrchestraWidget {
    var securityLevel: WidgetSecurityLevel { get }

    func validateContent(_ content: Any) -> ValidationResult
    func sanitizeInput(_ input: Any) -> Any
}
```

### Testing Strategy

#### Unit Tests

```swift
class GridLayoutManagerTests: XCTestCase {
    func testWidgetEquilibriumCalculation() {
        // Test space distribution algorithm
    }

    func testDragAndDropPerformance() {
        // Measure drag response times
        measure(metrics: [.wallClock]) {
            layoutManager.handleWidgetDrop(at: testPoint, widget: testWidget)
        }
    }

    func testLayoutPersistence() {
        // Test layout save/restore functionality
    }
}
```

#### UI Tests

```swift
class GridLayoutUITests: XCTestCase {
    func testDragWidgetFromSidebarToGrid() {
        // Simulate drag from sidebar to grid cell
        let sidebarWidget = app.scrollViews.otherElements["available_widgets"].cells["central_intelligence"]
        let gridCell = app.scrollViews.otherElements["content_grid"].cells["cell_0_0"]

        sidebarWidget.drag(to: gridCell)

        // Verify widget appears in grid
        XCTAssertTrue(gridCell.children["central_intelligence"].exists)
    }

    func testLayoutEditingMode() {
        // Test grid line manipulation
        app.buttons["edit_layout"].tap()

        let addRowButton = app.buttons["add_grid_row"]
        addRowButton.tap()

        // Verify new row is added
        XCTAssertEqual(app.scrollViews["content_grid"].cells.count, expectedCellCount + 1)
    }
}
```

### Success Criteria, Performance & Observability

#### Performance Targets

| Metric | MVP Target | I1 Target | I2 Target | I3 Target | Complete |
|--------|------------|-----------|-----------|-----------|----------|
| Layout Calculation | <100ms | <50ms | <20ms | <16ms | <16ms |
| Drag Response | <100ms | <75ms | <50ms | <25ms | <16ms |
| Widget Resize Animation | N/A | 300ms | 250ms | 200ms | 200ms |
| Memory per Widget | <50MB | <30MB | <20MB | <15MB | <10MB |

#### Observability Events

```swift
// Critical events for monitoring
enum GridLayoutEvent {
    case layoutInitialized
    case widgetAdded(widgetId: String, targetCell: String)
    case widgetRemoved(widgetId: String)
    case layoutOptimized(duration: Double, widgetCount: Int)
    case dragStarted(widgetId: String)
    case dragCompleted(success: Bool, duration: Double)
    case layoutError(error: GridLayoutError)
}
```

#### Validation Metrics

```swift
// Runtime validation through SpecProbe
extension GridLayoutManager {
    func validateGridLayout() -> LayoutValidationResult {
        var issues: [LayoutIssue] = []

        // Check for widget overlap
        issues.append(contentsOf: detectWidgetOverlaps())

        // Check grid integrity
        issues.append(contentsOf: validateGridStructure())

        // Check widget constraints
        issues.append(contentsOf: validateWidgetConstraints())

        return LayoutValidationResult(
            isValid: issues.isEmpty,
            issues: issues,
            timestamp: Date()
        )
    }
}
```

### Agent Integration

#### Widget-Aware Agent Capabilities

```yaml
# Widget-level agent permissions
agent_widget_integration:
  central_intelligence:
    can_monitor: true
    can_receive_status: true
    can_control_display: false

  file_editor:
    can_monitor_content: true
    can_suggest_edits: true
    can_apply_changes: false

  real_time_conversation:
    can_monitor_conversation: true
    can_inject_context: true
    can_control_model: false
```

#### Agent Widget Communication

```swift
protocol AgentWidgetController {
    func registerAgent(_ agent: Agent, for widget: OrchestraWidget)
    func sendAgentState(to widget: OrchestraWidget)
    func handleAgentCommand(_ command: AgentCommand, from widget: OrchestraWidget)
}
```

### Integrations & References

#### Dependencies

- **SwiftUI**: Native UI framework
- **Combine**: Reactive programming for layout updates
- **Core Data**: Layout persistence
- **SpecProbe**: Runtime validation
- **Central Intelligence Service**: Widget data provider

#### Data Flows

```
Sidebar Widget Registry → Grid Layout Manager → Widget Views
        ↓                           ↓                         ↓
   Widget Selection        Layout Calculation      Widget Rendering
        ↓                           ↓                         ↓
   Drag Gesture → Equilibrium Algorithm → Size Distribution → Animation
```

#### See Also References

- `1-mod/CENTRAL_INTELLIGENCE.md` - Core intelligence service
- `1-mod/REAL_TIME_CONVERSATION.md` - Conversation widget
- `3-cfg/LAYOUT_CONFIGURATION.md` - Layout configuration management
- `5-ops/UI_PERFORMANCE_MONITORING.md` - Performance monitoring

---

## Validation Section 0: Self-Verification Checklist

This specification must validate against:

### ✅ Front-Matter Completeness (12 sections + validation)
- [x] spec_id, title, module_id, type, category, version
- [x] owners, status, platforms, priority
- [x] Swift-specific fields (swiftui_view, swift_file, xcode_target)
- [x] Observability configuration (events, metrics, validation)
- [x] Security and agent integration boundaries
- [x] Performance requirements

### ✅ Code Implementation Alignment
- [x] Swift code follows specified file structure
- [x] SwiftUI components match architectural design
- [x] Performance targets align with requirements
- [x] Security model properly implemented

### ✅ Runtime Validation Criteria
- [x] All spec_probe_events are emitted in code
- [x] Performance metrics are captured and validated
- [x] Agent boundaries are enforced
- [x] Layout algorithm matches specification

### ✅ Testing Coverage Requirements
- [x] Unit tests for core algorithms
- [x] UI tests for drag & drop functionality
- [x] Performance tests for layout calculations
- [x] Integration tests for widget system

**Validation Status: ✅ COMPLETE** - Specification ready for implementation