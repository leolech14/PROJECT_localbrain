//
//  AppEventBus.swift
//  LocalBrain
//
//  Unified event system for frontend-backend communication
//  Replaces fragmented NotificationCenter and SpecProbe systems
//
//  Created by Claude Code Team (Backend Track A)
//  Date: 2025-10-05
//

import Foundation
import Combine

// MARK: - App Event Bus

/// Unified event bus for all application events
/// Replaces NotificationCenter and SpecProbe with a single, structured system
public final class AppEventBus: ObservableObject {

    // MARK: - Singleton
    public static let shared = AppEventBus()

    // MARK: - Published Events
    private let eventSubject = PassthroughSubject<AppEvent, Never>()

    /// Public publisher for UI components to subscribe to
    public var publisher: AnyPublisher<AppEvent, Never> {
        eventSubject.eraseToAnyPublisher()
    }

    // MARK: - Private State
    private var eventHistory: [AppEvent] = []
    private let maxHistoryCount = 1000
    private let historyQueue = DispatchQueue(label: "app.eventbus.history", attributes: .concurrent)

    // MARK: - Initialization
    private init() {
        print("📡 AppEventBus initialized")
    }

    // MARK: - Public Event Publishing

    /// Publish an event to the bus
    /// - Parameter event: The event to publish
    public func publish(_ event: AppEvent) {
        // Add to history
        historyQueue.async(flags: .barrier) { [weak self] in
            self?.addToHistory(event)
        }

        // Publish to subscribers
        eventSubject.send(event)

        // Log important events
        if event.isImportant {
            print("📡 Event: \(event.name) \(event.payload?.description ?? "")")
        }
    }

    /// Convenience method for simple events
    /// - Parameters:
    ///   - name: Event name
    ///   - payload: Optional payload dictionary
    public func publish(_ name: String, payload: [String: Any]? = nil) {
        let event = AppEvent(name: name, payload: payload)
        publish(event)
    }

    // MARK: - Event History

    /// Get recent events from history
    /// - Parameters:
    ///   - count: Maximum number of events to return
    ///   - filter: Optional event name filter
    /// - Returns: Array of recent events
    public func getRecentEvents(count: Int = 50, filter: String? = nil) -> [AppEvent] {
        return historyQueue.sync {
            let events = eventHistory.suffix(count)
            if let filter = filter {
                return events.filter { $0.name == filter }
            }
            return Array(events)
        }
    }

    /// Get events in date range
    /// - Parameters:
    ///   - from: Start date
    ///   - to: End date
    /// - Returns: Events within date range
    public func getEvents(from: Date, to: Date) -> [AppEvent] {
        return historyQueue.sync {
            return eventHistory.filter { event in
                event.timestamp >= from && event.timestamp <= to
            }
        }
    }

    /// Clear event history
    public func clearHistory() {
        historyQueue.async(flags: .barrier) { [weak self] in
            self?.eventHistory.removeAll()
        }
    }

    // MARK: - Event Subscriptions

    /// Subscribe to specific event types
    /// - Parameters:
    ///   - names: Event names to subscribe to
    ///   - handler: Event handler closure
    /// - Returns: Cancellable subscription
    public func subscribe(to names: String..., handler: @escaping (AppEvent) -> Void) -> AnyCancellable {
        return publisher
            .filter { names.contains($0.name) }
            .sink { event in
                handler(event)
            }
    }

    /// Subscribe to events with pattern matching
    /// - Parameters:
    ///   - pattern: Pattern to match event names
    ///   - handler: Event handler closure
    /// - Returns: Cancellable subscription
    public func subscribe(matching pattern: String, handler: @escaping (AppEvent) -> Void) -> AnyCancellable {
        return publisher
            .filter { $0.name.contains(pattern) }
            .sink { event in
                handler(event)
            }
    }

    // MARK: - Private Methods

    private func addToHistory(_ event: AppEvent) {
        eventHistory.append(event)

        // Maintain history size limit
        if eventHistory.count > maxHistoryCount {
            eventHistory.removeFirst(eventHistory.count - maxHistoryCount)
        }
    }
}

// MARK: - Connection Event

public struct ConnectionEvent {
    public enum EventType: String, CaseIterable, Codable {
        case message = "message"
        case voice = "voice"
        case llm = "llm"
        case docker = "docker"
        case system = "system"
        case error = "error"
        case success = "success"
        case processing = "processing"
        case thinking = "thinking"
        case responding = "responding"
        case listening = "listening"
        case connected = "service.connected"
        case disconnected = "service.disconnected"
        case criticalError = "error.critical"
        case userAction = "user.action"

        public var displayName: String {
            switch self {
            case .message: return "Message"
            case .voice: return "Voice"
            case .llm: return "LLM"
            case .docker: return "Docker"
            case .system: return "System"
            case .error: return "Error"
            case .success: return "Success"
            case .processing: return "Processing"
            case .thinking: return "Thinking"
            case .responding: return "Responding"
            case .listening: return "Listening"
            case .connected: return "Connected"
            case .disconnected: return "Disconnected"
            case .criticalError: return "Critical Error"
            case .userAction: return "User Action"
            }
        }
    }
}

// MARK: - App Event

/// Structured application event
public struct AppEvent: Equatable {
    public let id = UUID()
    public let name: String
    public let payload: [String: Any]?
    public let timestamp: Date

    public init(name: String, payload: [String: Any]? = nil) {
        self.name = name
        self.payload = payload
        self.timestamp = Date()
    }

    /// Check if event is important enough to log
    public var isImportant: Bool {
        return name.hasPrefix("error.") ||
               name.hasPrefix("security.") ||
               name.contains("completed") ||
               name.contains("started") ||
               name.contains("critical")
    }

    /// Get payload value safely
    /// - Parameter key: Payload key
    /// - Returns: Value if present and correct type
    public func payloadValue<T>(_ key: String, as type: T.Type) -> T? {
        return payload?[key] as? T
    }

    public static func == (lhs: AppEvent, rhs: AppEvent) -> Bool {
        return lhs.id == rhs.id
    }
}

// MARK: - Predefined Events

extension AppEvent {

    // MARK: - Debug Events (for Integration Handshake)
    public static let debugHeartbeat = "debug.heartbeat"

    // MARK: - User Action Events
    public static let userMessageSent = "user.message.sent"
    public static let voiceListeningStarted = "voice.listening.started"
    public static let voiceListeningStopped = "voice.listening.stopped"
    public static let codeExecutionRequested = "code.execution.requested"
    public static let providerChanged = "provider.changed"
    public static let conversationCleared = "conversation.cleared"
    public static let contextItemAdded = "context.item.added"
    public static let contextItemRemoved = "context.item.removed"
    public static let memorySearchRequested = "memory.search.requested"
    public static let undoRequested = "undo.requested"
    public static let redoRequested = "redo.requested"

    // MARK: - AI Response Events
    public static let aiResponseStarted = "ai.response.started"
    public static let aiResponseChunk = "ai.response.chunk"
    public static let aiResponseCompleted = "ai.response.completed"
    public static let aiResponseError = "ai.response.error"

    // MARK: - System State Events
    public static let stateChanged = "state.changed"
    public static let errorOccurred = "error.occurred"
    public static let criticalError = "error.critical"

    // MARK: - Backend Service Events
    public static let voiceLevelUpdated = "voice.level.updated"
    public static let voiceTranscriptionCompleted = "voice.transcription.completed"
    public static let dockerContainersUpdated = "docker.containers.updated"
    public static let undoHistoryUpdated = "undo.history.updated"

}
