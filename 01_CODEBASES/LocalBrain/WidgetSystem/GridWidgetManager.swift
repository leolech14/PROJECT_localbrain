//
//  GridWidgetManager.swift
//  LocalBrain
//
//  Purpose: Core widget positioning and layout management system
//  Created: 2025-10-06 (Migration Day!)
//  Based on: scf.04_GRID_LAYOUT.md specification
//

import SwiftUI
import Foundation
import Combine

class GridWidgetManager: ObservableObject {
    // MARK: - Core Properties
    @Published var widgets: [GridWidget] = []
    @Published var gridSize: CGSize = CGSize(width: 1200, height: 800)
    var snapThreshold: CGFloat = 20
    var minWidgetSize: CGSize = CGSize(width: 200, height: 150)
    var maxWidgetSize: CGSize = CGSize(width: 800, height: 600)

    // MARK: - Grid Configuration
    private let gridSizeUnit: CGFloat = 40
    private var isDragging = false
    private var draggedWidget: GridWidget?

    // MARK: - Widget Management
    func addWidget(_ widget: GridWidget) {
        // Ensure unique position
        let availablePosition = findAvailablePosition(for: widget.size)
        widget.position = availablePosition

        widgets.append(widget)
        snapToGrid(widget)

        print("🎯 Added widget: \(widget.type) at position \(availablePosition)")
    }

    func removeWidget(_ widget: GridWidget) {
        widgets.removeAll { $0.id == widget.id }
        print("🗑️ Removed widget: \(widget.type)")
    }

    func moveWidget(_ widget: GridWidget, to position: CGPoint) {
        let newPosition = constrainPosition(position, for: widget.size)
        widget.position = newPosition
        // Temporarily disable snapToGrid and checkCollisions during active drag for smoother movement
        // These will be applied on drag end in finalizeWidgetPosition
    }

    func finalizeWidgetPosition(_ widget: GridWidget) {
        snapToGrid(widget)
        checkCollisions(widget) // Re-enable collision check after drag ends
    }

    func resizeWidget(_ widget: GridWidget, to size: CGSize) {
        let constrainedSize = constrainSize(size)
        widget.size = constrainedSize
        checkCollisions(widget)
    }

    // MARK: - Grid Snapping
    private func snapToGrid(_ widget: GridWidget) {
        let snappedX = round(widget.position.x / gridSizeUnit) * gridSizeUnit
        let snappedY = round(widget.position.y / gridSizeUnit) * gridSizeUnit

        widget.position = CGPoint(x: snappedX, y: snappedY)
    }

    // MARK: - Collision Detection
    private func checkCollisions(_ widget: GridWidget) {
        for otherWidget in widgets {
            if otherWidget.id != widget.id {
                if widgetsCollide(widget, otherWidget) {
                    resolveCollision(between: widget, and: otherWidget)
                }
            }
        }
    }

    private func widgetsCollide(_ widget1: GridWidget, _ widget2: GridWidget) -> Bool {
        let frame1 = CGRect(origin: widget1.position, size: widget1.size)
        let frame2 = CGRect(origin: widget2.position, size: widget2.size)
        return frame1.intersects(frame2)
    }

    private func resolveCollision(between widget1: GridWidget, and widget2: GridWidget) {
        // Attempt to shift widget2 to make space for widget1
        // This is a simplified dynamic shifting. A more robust solution would involve a full grid packing algorithm.

        let directionX = widget1.position.x < widget2.position.x ? 1 : -1
        let directionY = widget1.position.y < widget2.position.y ? 1 : -1

        // Try shifting widget2 horizontally
        var shiftedPosition = CGPoint(x: widget2.position.x + CGFloat(directionX) * gridSizeUnit, y: widget2.position.y)
        if !wouldCollide(widget: widget1, with: widget2, at: shiftedPosition) {
            widget2.position = shiftedPosition
            snapToGrid(widget2)
            return
        }

        // Try shifting widget2 vertically
        shiftedPosition = CGPoint(x: widget2.position.x, y: widget2.position.y + CGFloat(directionY) * gridSizeUnit)
        if !wouldCollide(widget: widget1, with: widget2, at: shiftedPosition) {
            widget2.position = shiftedPosition
            snapToGrid(widget2)
            return
        }

        // Fallback: if shifting widget2 doesn't work, move widget1 to an available position
        let newPosition = findAvailablePosition(for: widget1.size, avoiding: widget2)
        widget1.position = newPosition
        snapToGrid(widget1)
    }

    private func wouldCollide(widget: GridWidget, with otherWidget: GridWidget, at newPosition: CGPoint) -> Bool {
        let originalPosition = otherWidget.position
        otherWidget.position = newPosition // Temporarily set new position for collision check
        let collision = widgetsCollide(widget, otherWidget)
        otherWidget.position = originalPosition // Revert to original position
        return collision
    }

    // MARK: - Position Management
    private func findAvailablePosition(for size: CGSize, avoiding avoidWidget: GridWidget? = nil) -> CGPoint {
        // Try positions in a grid pattern
        for y in stride(from: 0, to: gridSize.height - size.height, by: gridSizeUnit) {
            for x in stride(from: 0, to: gridSize.width - size.width, by: gridSizeUnit) {
                let position = CGPoint(x: x, y: y)
                let testWidget = GridWidget(
                    id: UUID(),
                    type: .fileExplorer, // dummy type for collision testing
                    title: "test",
                    position: position,
                    size: size,
                    zIndex: 0
                )

                if let avoid = avoidWidget {
                    if !widgetsCollide(testWidget, avoid) {
                        return position
                    }
                } else {
                    var hasCollision = false
                    for widget in widgets {
                        if widgetsCollide(testWidget, widget) {
                            hasCollision = true
                            break
                        }
                    }
                    if !hasCollision {
                        return position
                    }
                }
            }
        }

        // Fallback: return origin if no position found
        return CGPoint.zero
    }

    private func constrainPosition(_ position: CGPoint, for size: CGSize) -> CGPoint {
        let maxX = gridSize.width - size.width
        let maxY = gridSize.height - size.height

        return CGPoint(
            x: max(0, min(position.x, maxX)),
            y: max(0, min(position.y, maxY))
        )
    }

    private func constrainSize(_ size: CGSize) -> CGSize {
        return CGSize(
            width: max(minWidgetSize.width, min(size.width, maxWidgetSize.width)),
            height: max(minWidgetSize.height, min(size.height, maxWidgetSize.height))
        )
    }

    // MARK: - Legacy Integration
    func addLegacyView(_ viewType: WidgetType, at position: CGPoint) -> GridWidget {
        let widget = GridWidget(
            id: UUID(),
            type: viewType,
            title: viewType.displayName,
            position: position,
            size: viewType.defaultSize,
            zIndex: widgets.count + 1
        )

        addWidget(widget)
        return widget
    }
}

// MARK: - Grid Widget Model
class GridWidget: Identifiable, ObservableObject {
    let id: UUID
    let type: WidgetType
    @Published var position: CGPoint
    @Published var size: CGSize
    @Published var isVisible: Bool = true
    @Published var isMinimized: Bool = false
    var zIndex: Int
    var title: String
    var metadata: [String: Any] = [:]

    init(id: UUID, type: WidgetType, title: String, position: CGPoint, size: CGSize, zIndex: Int) {
        self.id = id
        self.type = type
        self.title = title
        self.position = position
        self.size = size
        self.zIndex = zIndex
    }
}

// MARK: - Widget Type Enumeration
enum WidgetType: String, CaseIterable {
    case fileExplorer = "file_explorer"
    case terminal = "terminal"
    case aiChat = "ai_chat"
    case taskManager = "task_manager"
    case contextPool = "context_pool"
    case metrics = "metrics"

    var displayName: String {
        switch self {
        case .fileExplorer: return "File Explorer"
        case .terminal: return "Terminal"
        case .aiChat: return "AI Chat"
        case .taskManager: return "Task Manager"
        case .contextPool: return "Context Pool"
        case .metrics: return "Metrics"
        }
    }

    var icon: String {
        switch self {
        case .fileExplorer: return "folder.fill"
        case .terminal: return "terminal.fill"
        case .aiChat: return "message.fill"
        case .taskManager: return "checklist"
        case .contextPool: return "doc.on.doc.fill"
        case .metrics: return "chart.bar.fill"
        }
    }

    var defaultSize: CGSize {
        switch self {
        case .fileExplorer: return CGSize(width: 300, height: 400)
        case .terminal: return CGSize(width: 400, height: 300)
        case .aiChat: return CGSize(width: 600, height: 700)
        case .taskManager: return CGSize(width: 350, height: 450)
        case .contextPool: return CGSize(width: 300, height: 400)
        case .metrics: return CGSize(width: 500, height: 350)
        }
    }
}