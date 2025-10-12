//
//  WidgetCentralCanvasView.swift
//  LocalBrain
//
//  Widget-based canvas replacing Orchestra legacy canvas
//  Uses new Widget System from v2.0.0 specification
//
//  Created: 2025-10-06 (Widget System Integration Day!)
//  Migration: Replaces CentralCanvasView with Grid Widget Architecture
//

import SwiftUI

struct WidgetCentralCanvasView: View {
    @EnvironmentObject private var M: AppModel
    @StateObject private var gridManager = GridWidgetManager()
    @StateObject private var stateBridge = StateBridge()
    @State private var showingAddWidget = false
    @State private var draggedWidget: GridWidget? = nil

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Beautiful grid background (3D depth maintained from Orchestra)
                canvasBackground

                // Render all widgets
                ForEach(gridManager.widgets.sorted { $0.zIndex < $1.zIndex }) { widget in
                    DraggableWidgetView(
                        widget: widget,
                        gridManager: gridManager
                    )
                }

                // Empty state with instructions
                if gridManager.widgets.isEmpty {
                    emptyState
                }

                // Add Widget Button (Floating Action Button)
                VStack {
                    HStack {
                        Spacer()

                        Button(action: { showingAddWidget = true }) {
                            HStack(spacing: 6) {
                                Image(systemName: "plus")
                                    .font(.system(size: 14, weight: .semibold))
                                Text("Add Widget")
                                    .font(.system(size: 13, weight: .semibold))
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(Color.acc)
                            .foregroundColor(.white)
                            .clipShape(Capsule())
                            .shadow(color: Color.acc.opacity(0.3), radius: 8, x: 0, y: 4)
                        }
                        .buttonStyle(.plain)
                        .padding(.trailing, 20)
                        .padding(.top, 12)
                    }
                    Spacer()
                }
            }
            .onAppear {
                gridManager.gridSize = geometry.size
                initializeDefaultWidgets()
            }
            .onChange(of: geometry.size) { oldValue, newValue in
                gridManager.gridSize = newValue
            }
            .sheet(isPresented: $showingAddWidget) {
                WidgetPickerView(
                    gridManager: gridManager,
                    onWidgetAdded: { showingAddWidget = false }
                )
            }
        }
        .coordinateSpace(name: "widgetCanvas")
    }

    // MARK: - Canvas Background (Beautiful 3D Grid from Orchestra)
    private var canvasBackground: some View {
        ZStack {
            // Base layer
            Rectangle()
                .fill(
                    RadialGradient(
                        colors: [
                            Color.bg1,
                            Color.bg1.opacity(0.98),
                            Color.bg1.opacity(0.95)
                        ],
                        center: .center,
                        startRadius: 0,
                        endRadius: 600
                    )
                )

            // Widget grid pattern
            Canvas { context, size in
                let gridSize: CGFloat = 20

                // Main grid lines
                context.stroke(
                    Path { path in
                        for x in stride(from: 0, through: size.width, by: gridSize) {
                            path.move(to: CGPoint(x: x, y: 0))
                            path.addLine(to: CGPoint(x: x, y: size.height))
                        }
                        for y in stride(from: 0, through: size.height, by: gridSize) {
                            path.move(to: CGPoint(x: 0, y: y))
                            path.addLine(to: CGPoint(x: size.width, y: y))
                        }
                    },
                    with: .color(Color.hair.opacity(0.2)),
                    lineWidth: 0.5
                )

                // Anchor points for widgets
                let anchorSize: CGFloat = 60
                for x in stride(from: anchorSize, through: size.width - anchorSize, by: anchorSize * 1.5) {
                    for y in stride(from: anchorSize, through: size.height - anchorSize, by: anchorSize * 1.5) {
                        context.fill(
                            Path(ellipseIn: CGRect(
                                x: x - 2,
                                y: y - 2,
                                width: 4,
                                height: 4
                            )),
                            with: .color(Color.hair.opacity(0.3))
                        )
                    }
                }
            }

            // Ambient lighting
            Canvas { context, size in
                let gradient = Gradient(colors: [
                    Color.acc.opacity(0.02),
                    Color.clear
                ])
                let centerPoint = CGPoint(x: size.width / 2, y: size.height / 2)
                let rect = CGRect(origin: .zero, size: size)
                context.fill(Path(rect), with: .radialGradient(
                    gradient,
                    center: centerPoint,
                    startRadius: 0,
                    endRadius: 300
                ))
            }
        }
    }

    // MARK: - Empty State
    private var emptyState: some View {
        VStack(spacing: 24) {
            Image(systemName: "square.grid.3x3")
                .font(.system(size: 60))
                .foregroundStyle(Color.tx2.opacity(0.3))

            Text("Widget Canvas")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundStyle(Color.tx1)

            Text("Click '+ Add Widget' to begin")
                .font(.subheadline)
                .foregroundStyle(Color.tx2)

            Button("Add Your First Widget") {
                showingAddWidget = true
            }
            .font(.subheadline)
            .foregroundStyle(Color.acc)
            .padding(.horizontal, 20)
            .padding(.vertical, 10)
            .background(Color.acc.opacity(0.1))
            .clipShape(Capsule())
            .buttonStyle(.plain)
        }
        .padding(40)
    }

    // MARK: - Initialize Default Widgets
    private func initializeDefaultWidgets() {
        // Only initialize if no widgets exist
        guard gridManager.widgets.isEmpty else { return }

        // Add File Explorer Widget (top-left)
        let fileExplorer = GridWidget(
            id: UUID(),
            type: .fileExplorer,
            title: "File Explorer",
            position: CGPoint(x: 50, y: 50),
            size: CGSize(width: 300, height: 400),
            zIndex: 1
        )
        gridManager.addWidget(fileExplorer)

        // Add Terminal Widget (bottom-left)
        let terminal = GridWidget(
            id: UUID(),
            type: .terminal,
            title: "Terminal",
            position: CGPoint(x: 50, y: 500),
            size: CGSize(width: 300, height: 250),
            zIndex: 1
        )
        gridManager.addWidget(terminal)

        // Add AI Chat Widget (right side)
        let chat = GridWidget(
            id: UUID(),
            type: .aiChat,
            title: "AI Chat",
            position: CGPoint(x: 400, y: 50),
            size: CGSize(width: 600, height: 700),
            zIndex: 1
        )
        gridManager.addWidget(chat)
    }
}

// MARK: - Draggable Widget View
struct DraggableWidgetView: View {
    let widget: GridWidget
    let gridManager: GridWidgetManager

    @State private var isDragging = false
    @State private var initialDragOffset: CGSize = .zero // Store initial offset

    var body: some View {
        VStack(spacing: 0) {
            // Widget Header
            HStack(spacing: 8) {
                Image(systemName: widget.type.icon)
                    .font(.caption)
                    .foregroundStyle(Color.acc)

                Text(widget.title)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Color.tx1)

                Spacer()

                // Widget Controls
                Button(action: { gridManager.removeWidget(widget) }) {
                    Image(systemName: "xmark")
                        .font(.caption2)
                        .foregroundStyle(Color.tx2)
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color.bg2)
            .gesture(
                DragGesture(coordinateSpace: .named("widgetCanvas"))
                    .onChanged { value in
                        if !isDragging { // On first touch of drag
                            isDragging = true
                            initialDragOffset = CGSize(width: value.startLocation.x - widget.position.x,
                                                       height: value.startLocation.y - widget.position.y)
                        }
                        let newPosition = CGPoint(x: value.location.x - initialDragOffset.width,
                                                  y: value.location.y - initialDragOffset.height)
                        gridManager.moveWidget(widget, to: newPosition)
                    }
                    .onEnded { _ in
                        isDragging = false
                        initialDragOffset = .zero // Reset offset
                        gridManager.finalizeWidgetPosition(widget) // New function to snap and check collisions
                    }
            )

            // Widget Content
            widgetContent
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color.bg1)
        }
        .frame(width: widget.size.width, height: widget.size.height)
        .position(widget.position)
        .background(Color.bg2)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(isDragging ? Color.acc : Color.hair, lineWidth: isDragging ? 2 : 1)
        )
        .shadow(color: Color.black.opacity(isDragging ? 0.3 : 0.15), radius: isDragging ? 12 : 4, x: 0, y: isDragging ? 8 : 2)
        .scaleEffect(isDragging ? 1.02 : 1.0)
        .animation(.easeInOut(duration: 0.2), value: isDragging)
    }

    @ViewBuilder
    private var widgetContent: some View {
        switch widget.type {
        case .fileExplorer:
            FileExplorerWidget()
        case .terminal:
            TerminalWidgetPlaceholder()
        case .aiChat:
            AIChatWidgetPlaceholder()
        case .taskManager:
            TaskManagerWidgetPlaceholder()
        case .contextPool:
            ContextPoolWidgetPlaceholder()
        case .metrics:
            MetricsWidgetPlaceholder()
        }
    }
}

// MARK: - Widget Picker
struct WidgetPickerView: View {
    let gridManager: GridWidgetManager
    let onWidgetAdded: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            Text("Add Widget")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundStyle(Color.tx1)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 16) {
                ForEach(WidgetType.allCases, id: \.self) { type in
                    Button(action: {
                        addWidget(type: type)
                    }) {
                        VStack(spacing: 12) {
                            Image(systemName: type.icon)
                                .font(.system(size: 32))
                                .foregroundStyle(Color.acc)

                            Text(type.displayName)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundStyle(Color.tx1)
                                .multilineTextAlignment(.center)
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 100)
                        .background(Color.bg2)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.hair, lineWidth: 1)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 20)

            Button("Cancel") {
                onWidgetAdded()
            }
            .font(.subheadline)
            .foregroundStyle(Color.tx2)
            .buttonStyle(.plain)
        }
        .padding(24)
        .frame(width: 500, height: 400)
        .background(Color.bg1)
    }

    private func addWidget(type: WidgetType) {
        let widget = GridWidget(
            id: UUID(),
            type: type,
            title: type.displayName,
            position: CGPoint(x: 300, y: 200), // Center-ish position
            size: type.defaultSize,
            zIndex: gridManager.widgets.count + 1
        )
        gridManager.addWidget(widget)
        onWidgetAdded()
    }
}

// MARK: - Placeholder Widgets (To be implemented)
struct TerminalWidgetPlaceholder: View {
    var body: some View {
        VStack {
            Text("Terminal Widget")
                .font(.caption)
                .foregroundStyle(Color.tx2)
            Text("Coming soon")
                .font(.caption2)
                .foregroundStyle(Color.tx2)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.bg1)
    }
}

struct AIChatWidgetPlaceholder: View {
    var body: some View {
        VStack {
            Text("AI Chat Widget")
                .font(.caption)
                .foregroundStyle(Color.tx2)
            Text("Coming soon")
                .font(.caption2)
                .foregroundStyle(Color.tx2)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.bg1)
    }
}

struct TaskManagerWidgetPlaceholder: View {
    var body: some View {
        VStack {
            Text("Task Manager Widget")
                .font(.caption)
                .foregroundStyle(Color.tx2)
            Text("Coming soon")
                .font(.caption2)
                .foregroundStyle(Color.tx2)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.bg1)
    }
}

struct ContextPoolWidgetPlaceholder: View {
    var body: some View {
        VStack {
            Text("Context Pool Widget")
                .font(.caption)
                .foregroundStyle(Color.tx2)
            Text("Coming soon")
                .font(.caption2)
                .foregroundStyle(Color.tx2)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.bg1)
    }
}

struct MetricsWidgetPlaceholder: View {
    var body: some View {
        VStack {
            Text("Metrics Widget")
                .font(.caption)
                .foregroundStyle(Color.tx2)
            Text("Coming soon")
                .font(.caption2)
                .foregroundStyle(Color.tx2)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.bg1)
    }
}

#Preview {
    WidgetCentralCanvasView()
        .environmentObject(AppModel())
        .frame(width: 1200, height: 800)
}
