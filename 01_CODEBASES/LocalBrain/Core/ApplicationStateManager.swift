//
//  ApplicationStateManager.swift
//  LocalBrain
//
//  "The Queen" orchestrator - unified application state management
//  Centralized state machine with action dispatching and event handling
//
//  Created by Agent B - Frontend Evolution Track
//  Date: 2025-10-05
//

import Foundation
import SwiftUI
import Combine

// MARK: - Application State

public enum ApplicationState: String, CaseIterable {
    case idle = "idle"
    case thinking = "thinking"
    case processing = "processing"
    case executing = "executing"
    case error = "error"
    case paused = "paused"
    case listening = "listening"
    case speaking = "speaking"

    var displayName: String {
        switch self {
        case .idle: return "Ready"
        case .thinking: return "Thinking"
        case .processing: return "Processing"
        case .executing: return "Executing"
        case .error: return "Error"
        case .paused: return "Paused"
        case .listening: return "Listening"
        case .speaking: return "Speaking"
        }
    }

    var isProcessing: Bool {
        switch self {
        case .thinking, .processing, .executing: return true
        default: return false
        }
    }

    var canCancel: Bool {
        switch self {
        case .thinking, .processing, .executing: return true
        default: return false
        }
    }
}

// MARK: - Action Type

enum ActionType: String, CaseIterable, Codable {
    case message = "message"
    case voiceRecording = "voice_recording"
    case codeExecution = "code_execution"
    case dockerOperation = "docker_operation"
    case fileOperation = "file_operation"
    case contextSearch = "context_search"
    case systemOperation = "system_operation"

    var displayName: String {
        switch self {
        case .message: return "Message"
        case .voiceRecording: return "Voice Recording"
        case .codeExecution: return "Code Execution"
        case .dockerOperation: return "Docker Operation"
        case .fileOperation: return "File Operation"
        case .contextSearch: return "Context Search"
        case .systemOperation: return "System Operation"
        }
    }

    var icon: String {
        switch self {
        case .message: return "message"
        case .voiceRecording: return "mic"
        case .codeExecution: return "terminal"
        case .dockerOperation: return "cube.box"
        case .fileOperation: return "folder"
        case .contextSearch: return "magnifyingglass"
        case .systemOperation: return "gear"
        }
    }

    var color: Color {
        switch self {
        case .message: return .blue
        case .voiceRecording: return .green
        case .codeExecution: return .purple
        case .dockerOperation: return .orange
        case .fileOperation: return .indigo
        case .contextSearch: return .cyan
        case .systemOperation: return .gray
        }
    }
}

// MARK: - Action Status

enum ActionStatus: String, CaseIterable, Codable {
    case pending = "pending"
    case executing = "executing"
    case success = "success"
    case failed = "failed"
    case cancelled = "cancelled"

    var displayName: String {
        switch self {
        case .pending: return "Pending"
        case .executing: return "Executing"
        case .success: return "Success"
        case .failed: return "Failed"
        case .cancelled: return "Cancelled"
        }
    }
}

// MARK: - Action State

struct ActionState: Identifiable, Codable {
    let id: UUID
    let type: ActionType
    let description: String
    let timestamp: Date
    var status: ActionStatus
    var result: String = ""
    var canRetry: Bool = false
    var progress: Double? = nil
    var metadata: [String: String] = [:]

    init(type: ActionType, description: String) {
        self.id = UUID()
        self.type = type
        self.description = description
        self.timestamp = Date()
        self.status = .pending
    }
}

// MARK: - Application State Manager

@MainActor
class ApplicationStateManager: ObservableObject {

    static let shared = ApplicationStateManager()

    // MARK: - Published State
    @Published var currentState: ApplicationState = .idle
    @Published var currentOperation: String = ""
    @Published var currentProgress: Double? = nil
    @Published var actionHistory: [ActionState] = []
    @Published var canUndo: Bool = false
    @Published var canRedo: Bool = false

    // MARK: - Private State
    private var eventBus = AppEventBus.shared
    private var undoStack: [ActionState] = []
    private var redoStack: [ActionState] = []
    private var currentActions: [UUID: ActionState] = [:]
    private var stateTransitionHistory: [(ApplicationState, Date)] = []
    private var processingStartTime: Date?
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Initialization

    private init() {
        setupEventListeners()
        print("👑 ApplicationStateManager initialized - 'The Queen' is ready")
    }

    // MARK: - Public Interface

    func dispatchAction(_ action: ActionState) {
        // Add to history
        actionHistory.append(action)
        currentActions[action.id] = action

        // Update UI state based on action type
        updateStateForAction(action)

        // Publish action event
        eventBus.publish(AppEvent(name: "action.started", payload: [
            "actionId": action.id.uuidString,
            "type": action.type.rawValue,
            "description": action.description
        ]))

        // Execute action
        Task {
            await executeAction(action)
        }

        print("👑 Action dispatched: \(action.type.displayName) - \(action.description)")
    }

    private func executeAction(_ action: ActionState) async {
        // Placeholder for actual action execution logic
        print("👑 Executing action: \(action.description)")
        // This is where the logic for calling other services (e.g., AI, Docker) would go.
        // For now, we'll just simulate completion.
        try? await Task.sleep(nanoseconds: 1_000_000_000) // Simulate work
        completeAction(id: action.id, result: "Action completed (simulated)", success: true)
    }

    func updateActionProgress(id: UUID, progress: Double) {
        guard var action = currentActions[id] else { return }
        action.progress = progress
        currentActions[id] = action
        currentProgress = progress

        eventBus.publish("action.updated", payload: [
            "actionId": action.id.uuidString,
            "type": action.type.rawValue,
            "description": action.description,
            "progress": action.progress ?? 0
        ])
    }

    func completeAction(id: UUID, result: String = "", success: Bool = true) {
        guard var action = currentActions[id] else { return }

        action.result = result
        action.status = success ? .success : .failed
        action.canRetry = !success

        currentActions[id] = action
        currentProgress = nil

        // Move to undo stack
        undoStack.append(action)
        redoStack.removeAll()

        updateUndoRedoState()

        // Check if all actions are complete
        eventBus.publish(AppEvent(name: "action.completed", payload: [
            "actionId": action.id.uuidString,
            "status": action.status.rawValue,
            "result": action.result
        ]))
    }

    func cancelAction(id: UUID) {
        guard var action = currentActions[id] else { return }

        action.status = .cancelled
        currentActions[id] = action

        eventBus.publish(AppEvent(name: "action.cancelled", payload: [
            "actionId": action.id.uuidString,
            "status": action.status.rawValue
        ]))
    }

    func cancelCurrentOperation() {
        guard currentState.canCancel else { return }

        // Cancel all current actions
        for (id, action) in currentActions {
            if action.status == .pending || action.status == .executing {
                cancelAction(id: id)
            }
        }

        updateState(.idle, operation: "Operation cancelled")
    }

    func undo() {
        guard let action = undoStack.popLast() else { return }

        redoStack.append(action)
        updateUndoRedoState()

        // Undo logic would depend on action type
        eventBus.publish(AppEvent(name: "undo.performed", payload: [
            "actionId": action.id.uuidString,
            "description": action.description
        ]))

        print("👑 Undo action: \(action.description)")
    }

    func redo() {
        guard let action = redoStack.popLast() else { return }

        undoStack.append(action)
        updateUndoRedoState()

        // Redo logic would depend on action type
        eventBus.publish(AppEvent(name: "redo.performed", payload: [
            "actionId": action.id.uuidString,
            "description": action.description
        ]))

        print("👑 Redo action: \(action.description)")
    }

    func clearHistory() {
        actionHistory.removeAll()
        undoStack.removeAll()
        redoStack.removeAll()
        currentActions.removeAll()
        updateUndoRedoState()

        eventBus.publish(AppEvent(name: "history.cleared"))
    }

    func forceReset() {
        clearHistory()
        currentState = .idle
        currentOperation = ""
        currentProgress = nil
        stateTransitionHistory.removeAll()

        eventBus.publish(AppEvent(name: "state.reset"))
    }

    func logCurrentState() {
        let stateInfo = """
        👑 Current State Information:
        State: \(currentState.displayName)
        Operation: \(currentOperation)
        Active Actions: \(currentActions.count)
        History Count: \(actionHistory.count)
        Can Undo: \(canUndo)
        Can Redo: \(canRedo)
        """
        print(stateInfo)
    }

    // MARK: - Computed Properties

    var totalProcessingTime: TimeInterval {
        guard let startTime = processingStartTime else { return 0 }
        return Date().timeIntervalSince(startTime)
    }

    var successRate: Double {
        let completedActions = actionHistory.filter { $0.status.isCompleted }
        guard !completedActions.isEmpty else { return 1.0 }
        let successfulActions = completedActions.filter { $0.status == .success }
        return Double(successfulActions.count) / Double(completedActions.count)
    }

    // MARK: - Private Methods

    private func setupEventListeners() {
        eventBus.publisher
            .sink { [weak self] event in
                Task { @MainActor in
                    self?.handleGenericEvent(event)
                }
            }
            .store(in: &cancellables)
    }

    private func handleGenericEvent(_ event: AppEvent) {
        switch event.name {
        case "voice.recordingStarted":
            handleVoiceEvent(event)
        case "voice.recordingStopped":
            handleVoiceEvent(event)
        case "voice.transcriptionCompleted":
            handleVoiceEvent(event)
        case "message.sending":
            handleMessageEvent(event)
        case "message.received":
            handleMessageEvent(event)
        case "message.failed":
            handleMessageEvent(event)
        case "error.occurred":
            handleErrorEvent(event)
        case "docker.containerCreated":
            handleDockerEvent(event)
        case "docker.containerStarted":
            handleDockerEvent(event)
        case "docker.executionStarted":
            handleDockerEvent(event)
        case "docker.executionCompleted":
            handleDockerEvent(event)
        default:
            break
        }
    }

    private func updateStateForAction(_ action: ActionState) {
        switch action.type {
        case .message:
            if currentOperation.isEmpty {
                updateState(.thinking, operation: "Processing message")
            }
        case .voiceRecording:
            updateState(.processing, operation: "Recording voice")
        case .codeExecution:
            updateState(.executing, operation: "Executing code")
        case .dockerOperation:
            updateState(.executing, operation: "Docker operation")
        case .fileOperation:
            updateState(.processing, operation: "File operation")
        case .contextSearch:
            updateState(.processing, operation: "Searching context")
        case .systemOperation:
            updateState(.processing, operation: "System operation")
        }
    }

    private func updateState(_ newState: ApplicationState, operation: String) {
        let previousState = currentState
        currentState = newState
        currentOperation = operation

        if newState.isProcessing && previousState != .idle {
            // Already processing, don't reset start time
        } else if newState.isProcessing {
            processingStartTime = Date()
        } else {
            processingStartTime = nil
            currentProgress = nil
        }

        // Record state transition
        stateTransitionHistory.append((newState, Date()))

        // Publish state change event
        eventBus.publish(AppEvent(name: "state.changed", payload: [
            "from": previousState.rawValue,
            "to": newState.rawValue,
            "operation": operation
        ]))

        print("👑 State transition: \(previousState.displayName) → \(newState.displayName)")
    }

    private func completeCurrentOperation(success: Bool) {
        if success {
            updateState(.idle, operation: "")
        } else {
            updateState(.error, operation: "Operation failed")
        }

        currentActions.removeAll()
    }

    private func updateUndoRedoState() {
        canUndo = !undoStack.isEmpty
        canRedo = !redoStack.isEmpty
    }

    // MARK: - Event Handlers

    private func handleVoiceEvent(_ event: AppEvent) {
        switch event.name {
        case "voice.recordingStarted":
            let action = ActionState(type: .voiceRecording, description: "Voice recording started")
            dispatchAction(action)
        case "voice.recordingStopped":
            if let action = currentActions.values.first(where: { $0.type == .voiceRecording && $0.status != .success }) {
                completeAction(id: action.id, result: "Recording completed", success: true)
            }
        case "voice.transcriptionCompleted":
            if let action = currentActions.values.first(where: { $0.type == .voiceRecording && $0.status != .success }) {
                completeAction(id: action.id, result: "Transcription completed", success: true)
            }
        default:
            break
        }
    }

    private func handleMessageEvent(_ event: AppEvent) {
        switch event.name {
        case "message.sending":
            let action = ActionState(type: .message, description: "Sending message")
            dispatchAction(action)
        case "message.received":
            if let action = currentActions.values.first(where: { $0.type == .message && $0.status != .success }) {
                completeAction(id: action.id, result: "Message received", success: true)
            }
        case "message.failed":
            if let action = currentActions.values.first(where: { $0.type == .message && $0.status != .failed }) {
                completeAction(id: action.id, result: "Message failed", success: false)
            }
        default:
            break
        }
    }

    private func handleErrorEvent(_ event: AppEvent) {
        if let errorMessage = event.payload?["message"] as? String {
            updateState(.error, operation: "Error: \(errorMessage)")
        } else {
            updateState(.error, operation: "An unknown error occurred")
        }
    }

    private func handleDockerEvent(_ event: AppEvent) {
        switch event.name {
        case "docker.containerCreated":
            let action = ActionState(type: .dockerOperation, description: "Container created")
            dispatchAction(action)
        case "docker.containerStarted":
            if let action = currentActions.values.first(where: { $0.type == .dockerOperation && $0.status != .success }) {
                completeAction(id: action.id, result: "Container started", success: true)
            }
        case "docker.executionStarted":
            let action = ActionState(type: .codeExecution, description: "Code execution started")
            dispatchAction(action)
        case "docker.executionCompleted":
            if let action = currentActions.values.first(where: { $0.type == .codeExecution && $0.status != .success }) {
                completeAction(id: action.id, result: "Execution completed", success: true)
            }
        default:
            break
        }
    }
}

// MARK: - ActionStatus Extensions

extension ActionStatus {
    var isCompleted: Bool {
        switch self {
        case .success, .failed, .cancelled: return true
        case .pending, .executing: return false
        }
    }
}

// MARK: - Event Protocol

/// Base protocol for application state events
protocol Event {
    var timestamp: Date { get }
}

extension Event {
    var timestamp: Date { Date() }
}

// MARK: - Event Types

struct ActionEvent: Event {
    let action: ActionState
}

struct StateChangeEvent: Event {
    let from: ApplicationState
    let to: ApplicationState
    let operation: String
}

struct UndoEvent: Event {
    let action: ActionState
}

struct RedoEvent: Event {
    let action: ActionState
}

struct ClearHistoryEvent: Event {}

struct StateResetEvent: Event {}