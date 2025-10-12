//
//  WidgetGridView.swift
//  LocalBrain
//
//  Purpose: Main widget grid interface with drag-and-drop
//  Created: 2025-10-06 (Migration Day!)
//  Based on: scf.04_GRID_LAYOUT.md specification
//

import SwiftUI

struct WidgetGridView: View {
    @EnvironmentObject private var gridManager: GridWidgetManager
    @EnvironmentObject private var stateBridge: StateBridge
    @State private var draggedWidget: GridWidget?
    @State private var dragOffset: CGSize = .zero
    @State private var showWidgetLibrary = false

    var body: some View {
        ZStack {
            // Grid background
            gridBackground

            // Widget canvas
            widgetCanvas

            // Widget library sheet
            if showWidgetLibrary {
                widgetLibrarySheet
            }

            // Add widget button
            addWidgetButton

            // Status bar
            statusBar
        }
        .onAppear {
            setupInitialState()
        }
    }

    // MARK: - Grid Background
    private var gridBackground: some View {
        ZStack {
            // Main background
            Color.black.opacity(0.95)

            // Grid lines
            Canvas { context, size in
                let gridSize: CGFloat = 40

                // Vertical lines
                for x in stride(from: 0, through: size.width, by: gridSize) {
                    var path = Path()
                    path.move(to: CGPoint(x: x, y: 0))
                    path.addLine(to: CGPoint(x: x, y: size.height))
                    context.stroke(path, with: .color(.white.opacity(0.1)), lineWidth: 0.5)
                }

                // Horizontal lines
                for y in stride(from: 0, through: size.height, by: gridSize) {
                    var path = Path()
                    path.move(to: CGPoint(x: 0, y: y))
                    path.addLine(to: CGPoint(x: size.width, y: y))
                    context.stroke(path, with: .color(.white.opacity(0.1)), lineWidth: 0.5)
                }
            }
        }
    }

    // MARK: - Widget Canvas
    private var widgetCanvas: some View {
        ForEach(gridManager.widgets) { widget in
            widgetView(for: widget)
        }
    }

    private func widgetView(for widget: GridWidget) -> some View {
        let isDraggingThis = draggedWidget?.id == widget.id
        let zIndex: Double = isDraggingThis ? 1000 : Double(widget.zIndex)

        return WidgetContainer(
            widget: widget,
            isDragging: isDraggingThis
        )
        .position(widget.position)
        .frame(width: widget.size.width, height: widget.size.height)
        .zIndex(zIndex)
        .onDrag {
            draggedWidget = widget
            return NSItemProvider(object: widget.id.uuidString as NSString)
        }
        .onDrop(of: [.text], delegate: WidgetDropDelegate(
            widget: widget,
            gridManager: gridManager,
            draggedWidget: $draggedWidget
        ))
    }

    // MARK: - Add Widget Button
    private var addWidgetButton: some View {
        VStack {
            HStack {
                Spacer()

                Button(action: {
                    showWidgetLibrary = true
                }) {
                    Image(systemName: "plus.rectangle.on.rectangle")
                        .font(.title2)
                        .foregroundColor(.white)
                        .frame(width: 44, height: 44)
                        .background(Color.blue.opacity(0.8))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                .padding(.trailing, 20)
                .padding(.top, 20)

                Spacer()
            }
            Spacer()
        }
    }

    // MARK: - Widget Library Sheet
    private var widgetLibrarySheet: some View {
        ZStack {
            Color.black.opacity(0.8)
                .onTapGesture {
                    showWidgetLibrary = false
                }

            VStack(spacing: 20) {
                Text("Add Widget")
                    .font(.title)
                    .foregroundColor(.white)

                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 15) {
                    WidgetLibraryItem(
                        icon: "folder",
                        name: "File Explorer",
                        type: "file-explorer"
                    ) {
                        addWidget(type: .fileExplorer)
                    }

                    WidgetLibraryItem(
                        icon: "terminal",
                        name: "Terminal",
                        type: "terminal"
                    ) {
                        addWidget(type: .terminal)
                    }

                    WidgetLibraryItem(
                        icon: "message",
                        name: "AI Chat",
                        type: "ai-chat"
                    ) {
                        addWidget(type: .aiChat)
                    }

                    WidgetLibraryItem(
                        icon: "list.bullet",
                        name: "Task Manager",
                        type: "task-manager"
                    ) {
                        addWidget(type: .taskManager)
                    }

                    WidgetLibraryItem(
                        icon: "waveform",
                        name: "Context Pool",
                        type: "context-pool"
                    ) {
                        addWidget(type: .contextPool)
                    }

                    WidgetLibraryItem(
                        icon: "globe",
                        name: "Metrics",
                        type: "metrics"
                    ) {
                        addWidget(type: .metrics)
                    }
                }

                Button("Cancel") {
                    showWidgetLibrary = false
                }
                .foregroundColor(.white)
                .padding()
            }
            .padding(30)
            .background(Color.gray.opacity(0.9))
            .cornerRadius(20)
            .frame(maxWidth: 500)
        }
    }

    // MARK: - Status Bar
    private var statusBar: some View {
        VStack {
            Spacer()
            HStack {
                Text("Widgets: \(gridManager.widgets.count)")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.7))

                Spacer()

                Text("Grid: \(Int(gridManager.gridSize.width))×\(Int(gridManager.gridSize.height))")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.7))

                Spacer()

                Text("LocalBrain v2.0.0")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.7))
            }
            .padding()
            .background(Color.black.opacity(0.5))
        }
    }

    // MARK: - Widget Management
    private func addWidget(type: WidgetType) {
        let widget = GridWidget(
            id: UUID(),
            type: type,
            title: type.displayName,
            position: CGPoint(x: 100, y: 100),
            size: CGSize(width: 400, height: 300),
            zIndex: gridManager.widgets.count
        )

        gridManager.addWidget(widget)
        showWidgetLibrary = false

        print("🎯 Added \(type) widget to grid")
    }

    private func setupInitialState() {
        // Add some default widgets for demonstration
        if gridManager.widgets.isEmpty {
            // Add File Explorer
            let fileExplorer = GridWidget(
                id: UUID(),
                type: .fileExplorer,
                title: "File Explorer",
                position: CGPoint(x: 50, y: 50),
                size: CGSize(width: 350, height: 400),
                zIndex: 0
            )
            gridManager.addWidget(fileExplorer)

            // Add Terminal
            let terminal = GridWidget(
                id: UUID(),
                type: .terminal,
                title: "Terminal",
                position: CGPoint(x: 450, y: 50),
                size: CGSize(width: 500, height: 300),
                zIndex: 1
            )
            gridManager.addWidget(terminal)

            print("🚀 Initialized default widget layout")
        }
    }
}

// MARK: - Widget Container
struct WidgetContainer: View {
    let widget: GridWidget
    let isDragging: Bool

    var body: some View {
        VStack(spacing: 0) {
            // Widget header
            widgetHeader

            // Widget content
            widgetContent
        }
        .background(Color.gray.opacity(0.9))
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(isDragging ? Color.blue : Color.gray.opacity(0.3), lineWidth: isDragging ? 2 : 1)
        )
        .scaleEffect(isDragging ? 1.05 : 1.0)
        .animation(.easeInOut(duration: 0.2), value: isDragging)
    }

    private var widgetHeader: some View {
        HStack {
            Text(widgetDisplayName)
                .font(.headline)
                .foregroundColor(.white)

            Spacer()

            Button(action: {
                // Minimize/maximize
            }) {
                Image(systemName: "minus.square")
                    .foregroundColor(.white)
            }

            Button(action: {
                // Close widget (implementation needed)
            }) {
                Image(systemName: "xmark.square")
                    .foregroundColor(.white)
            }
        }
        .padding(8)
        .background(Color.gray.opacity(0.8))
    }

    private var widgetContent: some View {
        Group {
            switch widget.type {
            case .fileExplorer:
                FileExplorerWidgetContent()
            case .terminal:
                TerminalWidgetContent()
            case .aiChat:
                AIChatWidgetContent()
            default:
                VStack {
                    Image(systemName: "cube.box")
                        .font(.largeTitle)
                        .foregroundColor(.white.opacity(0.5))
                    Text(widget.type.displayName)
                        .foregroundColor(.white.opacity(0.7))
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
    }

    private var widgetDisplayName: String {
        widget.type.displayName
    }
}

// MARK: - Widget Content Placeholders
struct FileExplorerWidgetContent: View {
    var body: some View {
        VStack {
            HStack {
                Image(systemName: "folder")
                Text("Documents")
                Spacer()
            }
            .padding()

            HStack {
                Image(systemName: "doc.text")
                Text("notes.txt")
                Spacer()
            }
            .padding(.horizontal)

            Spacer()
        }
        .foregroundColor(.white)
    }
}

struct TerminalWidgetContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("$ ls -la")
                .foregroundColor(.green)
            Text("drwxr-xr-x  5 user  staff   160 Oct  6 10:30 .")
                .foregroundColor(.white)
            Text("drwxr-xr-x  3 user  staff    96 Oct  6 10:25 ..")
                .foregroundColor(.white)
            Text("-rw-r--r--  1 user  staff  2048 Oct  6 10:30 README.md")
                .foregroundColor(.white)
            Spacer()
        }
        .padding()
        .font(.system(.caption, design: .monospaced))
    }
}

struct AIChatWidgetContent: View {
    var body: some View {
        VStack {
            HStack {
                Text("🤖 Claude:")
                    .foregroundColor(.blue)
                Spacer()
            }
            Text("How can I help you today?")
                .foregroundColor(.white)
                .padding(.horizontal)

            Spacer()

            HStack {
                TextField("Type your message...", text: .constant(""))
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                Button("Send") {
                    // Send message
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
        }
    }
}

// MARK: - Widget Library Item
struct WidgetLibraryItem: View {
    let icon: String
    let name: String
    let type: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title)
                    .foregroundColor(.white)
                Text(name)
                    .font(.caption)
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
            }
            .frame(width: 80, height: 80)
            .background(Color.blue.opacity(0.7))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Drop Delegate
struct WidgetDropDelegate: DropDelegate {
    let widget: GridWidget
    let gridManager: GridWidgetManager
    @Binding var draggedWidget: GridWidget?

    func performDrop(info: DropInfo) -> Bool {
        draggedWidget = nil
        return true
    }

    func dropEntered(info: DropInfo) {
        // Handle drop enter logic
    }

    func dropUpdated(info: DropInfo) -> DropProposal? {
        return DropProposal(operation: .move)
    }
}