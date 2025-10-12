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

@Observable
class GridWidgetManager {
    // MARK: - Core Properties
    var widgets: [GridWidget] = []
    var gridSize: CGSize = CGSize(width: 1200, height: 800)
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
        snapToGrid(widget)
        checkCollisions(widget)
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
        // Simple resolution: move widget1 to nearest available position
        let newPosition = findAvailablePosition(for: widget1.size, avoiding: widget2)
        widget1.position = newPosition
        snapToGrid(widget1)
    }

    // MARK: - Position Management
    private func findAvailablePosition(for size: CGSize, avoiding avoidWidget: GridWidget? = nil) -> CGPoint {
        // Try positions in a grid pattern
        for y in stride(from: 0, to: gridSize.height - size.height, by: gridSizeUnit) {
            for x in stride(from: 0, to: gridSize.width - size.width, by: gridSizeUnit) {
                let position = CGPoint(x: x, y: y)
                let testWidget = GridWidget(id: "test", type: "test", position: position, size: size)

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
    func addLegacyView(_ viewType: String, at position: CGPoint) -> GridWidget {
        let widget = GridWidget(
            id: UUID().uuidString,
            type: viewType,
            position: position,
            size: CGSize(width: 400, height: 300)
        )

        addWidget(widget)
        return widget
    }
}

// MARK: - Grid Widget Model
struct GridWidget: Identifiable {
    let id: String
    let type: String
    var position: CGPoint
    var size: CGSize
    var isVisible: Bool = true
    var isMinimized: Bool = false
    var zIndex: Int = 0
    var metadata: [String: Any] = [:]

    init(id: String, type: String, position: CGPoint, size: CGSize) {
        self.id = id
        self.type = type
        self.position = position
        self.size = size
    }
}