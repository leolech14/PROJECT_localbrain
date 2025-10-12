//
//  StateBridge.swift
//  LocalBrain
//
//  Purpose: Zero-downtime bridge between legacy views and new widgets
//  Created: 2025-10-06 (Migration Day!)
//  Based on: scf.07_WIDGET_COMPATIBILITY_LAYER.md specification
//

import Foundation
import SwiftUI
import Combine

@Observable
class StateBridge {
    // MARK: - Legacy State Tracking
    private var legacyStates: [String: Any] = [:]
    private var widgetStates: [String: WidgetState] = [:]
    private var stateMappings: [String: StateMapping] = [:]

    // MARK: - Synchronization
    private var cancellables = Set<AnyCancellable>()
    private let syncQueue = DispatchQueue(label: "statebridge.sync", qos: .userInitiated)

    // MARK: - Initialization
    init() {
        setupStateMappings()
        startStateSyncLoop()
        print("🌉 StateBridge initialized - ready for zero-downtime migration")
    }

    // MARK: - Public Interface
    func registerLegacyView(_ viewType: String, state: Any) {
        syncQueue.async {
            self.legacyStates[viewType] = state
            print("📝 Registered legacy state for: \(viewType)")
        }
    }

    func registerWidget(_ widgetType: String, state: WidgetState) {
        syncQueue.async {
            self.widgetStates[widgetType] = state
            print("🧩 Registered widget state for: \(widgetType)")
        }
    }

    func synchronizeStates(legacyType: String, widgetType: String) async {
        await withCheckedContinuation { continuation in
            syncQueue.async {
                guard let legacyState = self.legacyStates[legacyType],
                      let mapping = self.stateMappings[legacyType] else {
                    print("⚠️ Cannot sync - missing legacy state or mapping")
                    continuation.resume()
                    return
                }

                let widgetState = self.transformLegacyToWidget(legacyState, mapping: mapping)
                self.widgetStates[widgetType] = widgetState

                print("🔄 Synchronized \(legacyType) → \(widgetType)")
                continuation.resume()
            }
        }
    }

    // MARK: - State Transformation
    private func transformLegacyToWidget(_ legacyState: Any, mapping: StateMapping) -> WidgetState {
        var widgetData: [String: Any] = [:]

        // Apply field mappings
        for (legacyPath, widgetPath) in mapping.fieldMappings {
            if let value = extractNestedValue(legacyState, path: legacyPath) {
                setNestedValue(&widgetData, path: widgetPath, value: value)
            }
        }

        // Apply transformations
        for transformation in mapping.transformations {
            widgetData = transformation(widgetData, legacyState)
        }

        return WidgetState(
            type: mapping.widgetType,
            version: "2.0.0",
            data: widgetData,
            metadata: StateMetadata(
                source: "legacy-bridge",
                transformedAt: Date(),
                originalType: mapping.legacyType
            )
        )
    }

    // MARK: - File Explorer State Handling
    func registerFileExplorerState(currentPath: URL, selectedFiles: [URL]) {
        let legacyState = FileExplorerLegacyState(
            currentPath: currentPath,
            selectedItems: selectedFiles,
            viewMode: "list",
            sortBy: "name"
        )

        registerLegacyView("FileBrowserView", state: legacyState)
    }

    func getFileExplorerWidgetState() -> WidgetState? {
        return widgetStates["file-explorer"]
    }

    // MARK: - Terminal State Handling
    func registerTerminalState(session: TerminalSession, buffer: [String]) {
        let legacyState = TerminalLegacyState(
            session: session,
            buffer: buffer,
            currentCommand: "",
            cursorPosition: 0
        )

        registerLegacyView("LeftTerminalDrawer", state: legacyState)
    }

    func getTerminalWidgetState() -> WidgetState? {
        return widgetStates["terminal"]
    }

    // MARK: - Chat State Handling
    func registerChatState(messages: [ChatMessage], currentProvider: String) {
        let legacyState = ChatLegacyState(
            messages: messages,
            currentProvider: currentProvider,
            isTyping: false
        )

        registerLegacyView("ChatView", state: legacyState)
    }

    func getChatWidgetState() -> WidgetState? {
        return widgetStates["ai-chat"]
    }

    // MARK: - Utility Methods
    private func extractNestedValue(_ object: Any, path: String) -> Any? {
        let keys = path.split(separator: ".")
        var current: Any = object

        for key in keys {
            if let dict = current as? [String: Any],
               let value = dict[String(key)] {
                current = value
            } else if let array = current as? [Any],
                      let index = Int(key),
                      index < array.count {
                current = array[index]
            } else {
                return nil
            }
        }

        return current
    }

    private func setNestedValue(_ dictionary: inout [String: Any], path: String, value: Any) {
        let keys = path.split(separator: ".")
        var current: inout [String: Any] = dictionary

        for (index, key) in keys.enumerated() {
            let keyString = String(key)

            if index == keys.count - 1 {
                current[keyString] = value
            } else {
                if current[keyString] == nil {
                    current[keyString] = [String: Any]()
                }
                current = &current[keyString] as! [String: Any]
            }
        }
    }

    private func setupStateMappings() {
        // File Explorer Mapping
        stateMappings["FileBrowserView"] = StateMapping(
            legacyType: "FileBrowserView",
            widgetType: "file-explorer",
            fieldMappings: [
                "currentPath": "currentPath",
                "selectedItems": "selectedFiles",
                "viewMode": "viewMode",
                "sortBy": "sortBy"
            ],
            transformations: [
                { data, legacy in
                    // Transform URL paths to strings
                    var transformedData = data
                    if let path = (legacy as? FileExplorerLegacyState)?.currentPath {
                        transformedData["currentPath"] = path.path
                    }
                    return transformedData
                }
            ]
        )

        // Terminal Mapping
        stateMappings["LeftTerminalDrawer"] = StateMapping(
            legacyType: "LeftTerminalDrawer",
            widgetType: "terminal",
            fieldMappings: [
                "session.id": "sessionId",
                "session.shell": "shell",
                "buffer": "output",
                "currentCommand": "currentCommand"
            ],
            transformations: []
        )

        // Chat Mapping
        stateMappings["ChatView"] = StateMapping(
            legacyType: "ChatView",
            widgetType: "ai-chat",
            fieldMappings: [
                "messages": "messages",
                "currentProvider": "currentProvider",
                "isTyping": "isTyping"
            ],
            transformations: [
                { data, legacy in
                    // Transform message format
                    var transformedData = data
                    if let messages = legacy as? [ChatMessage] {
                        transformedData["messages"] = messages.map { msg in
                            [
                                "id": msg.id,
                                "content": msg.content,
                                "role": msg.role,
                                "timestamp": msg.timestamp
                            ]
                        }
                    }
                    return transformedData
                }
            ]
        )

        print("🗺️ State mappings configured for \(stateMappings.count) view types")
    }

    private func startStateSyncLoop() {
        Timer.publish(every: 1.0, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.performPeriodicSync()
            }
            .store(in: &cancellables)
    }

    private func performPeriodicSync() {
        syncQueue.async {
            // Check for state changes and sync as needed
            for (legacyType, widgetType) in [
                ("FileBrowserView", "file-explorer"),
                ("LeftTerminalDrawer", "terminal"),
                ("ChatView", "ai-chat")
            ] {
                if self.legacyStates[legacyType] != nil && self.widgetStates[widgetType] == nil {
                    Task {
                        await self.synchronizeStates(legacyType: legacyType, widgetType: widgetType)
                    }
                }
            }
        }
    }
}

// MARK: - Supporting Models
struct WidgetState {
    let type: String
    let version: String
    var data: [String: Any]
    let metadata: StateMetadata
}

struct StateMetadata {
    let source: String
    let transformedAt: Date
    let originalType: String
}

struct StateMapping {
    let legacyType: String
    let widgetType: String
    let fieldMappings: [String: String]
    let transformations: [( inout [String: Any], Any) -> [String: Any]]
}

// Legacy State Models
struct FileExplorerLegacyState {
    let currentPath: URL
    let selectedItems: [URL]
    let viewMode: String
    let sortBy: String
}

struct TerminalLegacyState {
    let session: TerminalSession
    let buffer: [String]
    let currentCommand: String
    let cursorPosition: Int
}

struct ChatLegacyState {
    let messages: [ChatMessage]
    let currentProvider: String
    let isTyping: Bool
}

// Mock Models (to be replaced with actual LocalBrain models)
struct TerminalSession {
    let id: String
    let shell: String
    let workingDirectory: String
}

struct ChatMessage {
    let id: String
    let content: String
    let role: String
    let timestamp: Date
}