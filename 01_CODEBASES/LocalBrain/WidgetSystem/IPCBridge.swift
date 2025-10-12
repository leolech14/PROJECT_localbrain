//
//  IPCBridge.swift
//  LocalBrain
//
//  Purpose: Swift ↔ Electron/Next.js IPC Bridge with WKWebView message handling
//  Task: T008 - Swift WebKit Bridge Foundation
//  Agent: D (Integration Specialist, Sonnet-4.5)
//  Created: 2025-10-08
//  Schema Version: 1.0 (based on T002 IPC Message Schema Contracts)
//

import Foundation
import WebKit
import Combine

// MARK: - IPC Message Types

/// Base protocol for all IPC messages
protocol IPCMessage: Codable {
    var type: String { get }
    var traceId: String { get }
    var timestamp: String { get }
    var version: String { get }
}

/// UI Intent Message (Swift → Web or Web → Swift)
struct UIIntentMessage: IPCMessage {
    let type: String = "UI_INTENT"
    let traceId: String
    let timestamp: String
    let version: String
    let source: MessageSource
    let payload: UIIntentPayload
    let context: MessageContext?

    enum MessageSource: String, Codable {
        case swift
        case web
    }

    struct UIIntentPayload: Codable {
        let intent: String
        let target: Target
        let parameters: [String: AnyCodable]?
        let metadata: IntentMetadata?

        struct Target: Codable {
            let type: String
            let id: String
            let selector: String?
        }

        struct IntentMetadata: Codable {
            let priority: Priority?
            let timeout: Int?
            let retryable: Bool?
            let idempotencyKey: String?

            enum Priority: String, Codable {
                case low, normal, high, critical
            }
        }
    }

    struct MessageContext: Codable {
        let userId: String?
        let sessionId: String?
        let agentId: String?
        let permissions: [String]?
    }
}

/// Acknowledgement Message (ACK/NACK)
struct AckNackMessage: IPCMessage {
    let type: String // "ACK" or "NACK"
    let traceId: String
    let timestamp: String
    let version: String
    let status: Status
    let result: Result?
    let error: ErrorDetails?
    let diagnostics: Diagnostics?

    struct Status: Codable {
        let code: Int
        let message: String
        let category: String?
    }

    struct Result: Codable {
        let data: AnyCodable?
        let metadata: ResultMetadata?

        struct ResultMetadata: Codable {
            let processingTime: Double?
            let affectedElements: [String]?
        }
    }

    struct ErrorDetails: Codable {
        let code: String
        let message: String
        let details: [String: AnyCodable]?
        let retryable: Bool?
        let retryAfter: Int?
    }

    struct Diagnostics: Codable {
        let requestDuration: Double?
        let queueTime: Double?
        let source: String?
    }
}

/// Error Message (critical failures)
struct ErrorMessage: IPCMessage {
    let type: String = "ERROR"
    let traceId: String
    let timestamp: String
    let version: String
    let error: ErrorInfo
    let diagnostics: ErrorDiagnostics?

    struct ErrorInfo: Codable {
        let code: String
        let severity: Severity
        let message: String
        let details: [String: AnyCodable]?
        let recovery: RecoveryInfo?

        enum Severity: String, Codable {
            case warning, error, critical
        }

        struct RecoveryInfo: Codable {
            let retryable: Bool
            let retryAfter: Int?
            let fallbackAction: String?
        }
    }

    struct ErrorDiagnostics: Codable {
        let stackTrace: String?
        let context: [String: AnyCodable]?
        let timestamp: String
    }
}

/// Heartbeat Message (connection health)
struct HeartbeatMessage: IPCMessage {
    let type: String = "HEARTBEAT"
    let traceId: String
    let timestamp: String
    let version: String
    let source: String
    let health: HealthStatus
    let metrics: Metrics?
    let capabilities: [String]?

    struct HealthStatus: Codable {
        let status: Status
        let uptime: Int

        enum Status: String, Codable {
            case healthy, degraded, unhealthy
        }
    }

    struct Metrics: Codable {
        let messagesSent: Int
        let messagesReceived: Int
        let errorCount: Int
        let averageLatency: Double?
        let queueDepth: Int?
    }
}

// MARK: - AnyCodable Helper

struct AnyCodable: Codable {
    let value: Any

    init(_ value: Any) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()

        if let bool = try? container.decode(Bool.self) {
            value = bool
        } else if let int = try? container.decode(Int.self) {
            value = int
        } else if let double = try? container.decode(Double.self) {
            value = double
        } else if let string = try? container.decode(String.self) {
            value = string
        } else if let array = try? container.decode([AnyCodable].self) {
            value = array.map { $0.value }
        } else if let dict = try? container.decode([String: AnyCodable].self) {
            value = dict.mapValues { $0.value }
        } else {
            value = NSNull()
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()

        switch value {
        case let bool as Bool:
            try container.encode(bool)
        case let int as Int:
            try container.encode(int)
        case let double as Double:
            try container.encode(double)
        case let string as String:
            try container.encode(string)
        case let array as [Any]:
            try container.encode(array.map { AnyCodable($0) })
        case let dict as [String: Any]:
            try container.encode(dict.mapValues { AnyCodable($0) })
        default:
            try container.encodeNil()
        }
    }
}

// MARK: - IPC Bridge Main Class

class IPCBridge: NSObject, WKScriptMessageHandler, ObservableObject {
    // MARK: - Properties

    private let syncQueue = DispatchQueue(label: "ipcbridge.sync", qos: .userInitiated)
    private var cancellables = Set<AnyCancellable>()
    private var messageHandlers: [String: (UIIntentMessage) async -> AckNackMessage] = [:]
    private var webView: WKWebView?

    // Connection Health
    @Published var connectionHealth: HeartbeatMessage.HealthStatus.Status = .healthy
    @Published var lastHeartbeat: Date?

    // Metrics
    private var messagesSent: Int = 0
    private var messagesReceived: Int = 0
    private var errorCount: Int = 0
    private var latencies: [Double] = []
    private let startTime = Date()

    // MARK: - Initialization

    override init() {
        super.init()
        setupDefaultHandlers()
        startHealthMonitoring()
        print("🌉 IPCBridge initialized - ready for Swift ↔ Web communication")
    }

    // MARK: - WKWebView Integration

    func attachToWebView(_ webView: WKWebView) {
        self.webView = webView

        // Register message handler for web → Swift messages
        webView.configuration.userContentController.add(self, name: "ipcBridge")

        print("🔌 IPCBridge attached to WKWebView")
    }

    func detachFromWebView() {
        webView?.configuration.userContentController.removeScriptMessageHandler(forName: "ipcBridge")
        webView = nil
        print("🔌 IPCBridge detached from WKWebView")
    }

    // MARK: - WKScriptMessageHandler Protocol

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        syncQueue.async { [weak self] in
            guard let self = self else { return }

            let startTime = Date()
            self.messagesReceived += 1

            // Parse incoming message
            guard let messageData = self.parseMessage(message.body) else {
                self.sendError(
                    traceId: UUID().uuidString,
                    code: "INVALID_MESSAGE_FORMAT",
                    message: "Failed to parse incoming message"
                )
                return
            }

            // Handle different message types
            Task {
                switch messageData.type {
                case "UI_INTENT":
                    await self.handleUIIntent(messageData.rawJSON, startTime: startTime)

                case "HEARTBEAT":
                    await self.handleHeartbeat(messageData.rawJSON)

                case "ACK", "NACK":
                    await self.handleAcknowledgement(messageData.rawJSON)

                default:
                    self.sendError(
                        traceId: messageData.traceId ?? UUID().uuidString,
                        code: "UNKNOWN_MESSAGE_TYPE",
                        message: "Unknown message type: \(messageData.type)"
                    )
                }
            }
        }
    }

    // MARK: - Message Parsing

    private func parseMessage(_ body: Any) -> (type: String, traceId: String?, rawJSON: Data)? {
        guard let dict = body as? [String: Any],
              let type = dict["type"] as? String else {
            return nil
        }

        let traceId = dict["traceId"] as? String

        // Convert to JSON data for proper decoding
        guard let jsonData = try? JSONSerialization.data(withJSONObject: dict, options: []) else {
            return nil
        }

        return (type: type, traceId: traceId, rawJSON: jsonData)
    }

    // MARK: - Message Handlers

    private func handleUIIntent(_ jsonData: Data, startTime: Date) async {
        do {
            let intent = try JSONDecoder().decode(UIIntentMessage.self, from: jsonData)

            print("📨 Received UI Intent: \(intent.payload.intent) → \(intent.payload.target.type):\(intent.payload.target.id)")

            // Route to appropriate handler
            if let handler = messageHandlers[intent.payload.intent] {
                let response = await handler(intent)
                sendAcknowledgement(response)

                // Record latency
                let latency = Date().timeIntervalSince(startTime) * 1000 // ms
                latencies.append(latency)
            } else {
                // No handler registered - send NACK
                let nack = createNack(
                    traceId: intent.traceId,
                    code: 404,
                    message: "No handler registered for intent: \(intent.payload.intent)",
                    errorCode: "HANDLER_NOT_FOUND"
                )
                sendAcknowledgement(nack)
            }

        } catch {
            print("❌ Failed to decode UI Intent: \(error)")
            errorCount += 1
            sendError(
                traceId: UUID().uuidString,
                code: "SCHEMA_VALIDATION_FAILED",
                message: "Failed to validate UI Intent: \(error.localizedDescription)"
            )
        }
    }

    private func handleHeartbeat(_ jsonData: Data) async {
        do {
            let heartbeat = try JSONDecoder().decode(HeartbeatMessage.self, from: jsonData)

            await MainActor.run {
                self.connectionHealth = heartbeat.health.status
                self.lastHeartbeat = Date()
            }

            // Respond with our own heartbeat
            sendHeartbeat()

        } catch {
            print("⚠️ Failed to decode Heartbeat: \(error)")
        }
    }

    private func handleAcknowledgement(_ jsonData: Data) async {
        do {
            let ack = try JSONDecoder().decode(AckNackMessage.self, from: jsonData)
            print("✅ Received \(ack.type): \(ack.status.message) (traceId: \(ack.traceId))")

        } catch {
            print("⚠️ Failed to decode ACK/NACK: \(error)")
        }
    }

    // MARK: - Send Messages to Web

    func sendUIIntent(_ intent: UIIntentMessage) {
        syncQueue.async { [weak self] in
            guard let self = self else { return }

            do {
                let jsonData = try JSONEncoder().encode(intent)
                guard let jsonString = String(data: jsonData, encoding: .utf8) else {
                    print("❌ Failed to convert intent to JSON string")
                    return
                }

                // Send to web via evaluateJavaScript
                let script = "window.ipcBridge.receiveMessage(\(jsonString))"

                DispatchQueue.main.async {
                    self.webView?.evaluateJavaScript(script) { result, error in
                        if let error = error {
                            print("❌ Failed to send UI Intent to web: \(error)")
                            self.errorCount += 1
                        } else {
                            self.messagesSent += 1
                            print("📤 Sent UI Intent: \(intent.payload.intent)")
                        }
                    }
                }

            } catch {
                print("❌ Failed to encode UI Intent: \(error)")
                self.errorCount += 1
            }
        }
    }

    func sendAcknowledgement(_ ack: AckNackMessage) {
        syncQueue.async { [weak self] in
            guard let self = self else { return }

            do {
                let jsonData = try JSONEncoder().encode(ack)
                guard let jsonString = String(data: jsonData, encoding: .utf8) else {
                    print("❌ Failed to convert ACK/NACK to JSON string")
                    return
                }

                let script = "window.ipcBridge.receiveMessage(\(jsonString))"

                DispatchQueue.main.async {
                    self.webView?.evaluateJavaScript(script) { result, error in
                        if let error = error {
                            print("❌ Failed to send ACK/NACK to web: \(error)")
                        } else {
                            self.messagesSent += 1
                            print("📤 Sent \(ack.type): \(ack.status.message)")
                        }
                    }
                }

            } catch {
                print("❌ Failed to encode ACK/NACK: \(error)")
            }
        }
    }

    func sendError(traceId: String, code: String, message: String, severity: ErrorMessage.ErrorInfo.Severity = .error) {
        let error = ErrorMessage(
            traceId: traceId,
            timestamp: ISO8601DateFormatter().string(from: Date()),
            version: "1.0",
            error: ErrorMessage.ErrorInfo(
                code: code,
                severity: severity,
                message: message,
                details: nil,
                recovery: ErrorMessage.ErrorInfo.RecoveryInfo(
                    retryable: code != "SCHEMA_VALIDATION_FAILED",
                    retryAfter: 1000,
                    fallbackAction: nil
                )
            ),
            diagnostics: nil
        )

        syncQueue.async { [weak self] in
            guard let self = self else { return }

            do {
                let jsonData = try JSONEncoder().encode(error)
                guard let jsonString = String(data: jsonData, encoding: .utf8) else { return }

                let script = "window.ipcBridge.receiveMessage(\(jsonString))"

                DispatchQueue.main.async {
                    self.webView?.evaluateJavaScript(script) { _, _ in
                        self.messagesSent += 1
                    }
                }

            } catch {
                print("❌ Failed to encode ERROR message: \(error)")
            }
        }
    }

    func sendHeartbeat() {
        let uptime = Int(Date().timeIntervalSince(startTime))
        let avgLatency = latencies.isEmpty ? nil : latencies.reduce(0, +) / Double(latencies.count)

        let heartbeat = HeartbeatMessage(
            traceId: UUID().uuidString,
            timestamp: ISO8601DateFormatter().string(from: Date()),
            version: "1.0",
            source: "swift",
            health: HeartbeatMessage.HealthStatus(
                status: connectionHealth,
                uptime: uptime
            ),
            metrics: HeartbeatMessage.Metrics(
                messagesSent: messagesSent,
                messagesReceived: messagesReceived,
                errorCount: errorCount,
                averageLatency: avgLatency,
                queueDepth: 0
            ),
            capabilities: [
                "ui-intent-handling",
                "schema-validation",
                "error-recovery",
                "health-monitoring"
            ]
        )

        syncQueue.async { [weak self] in
            guard let self = self else { return }

            do {
                let jsonData = try JSONEncoder().encode(heartbeat)
                guard let jsonString = String(data: jsonData, encoding: .utf8) else { return }

                let script = "window.ipcBridge.receiveMessage(\(jsonString))"

                DispatchQueue.main.async {
                    self.webView?.evaluateJavaScript(script) { _, _ in
                        self.messagesSent += 1
                    }
                }

            } catch {
                print("❌ Failed to encode HEARTBEAT: \(error)")
            }
        }
    }

    // MARK: - Handler Registration

    func registerHandler(for intent: String, handler: @escaping (UIIntentMessage) async -> AckNackMessage) {
        messageHandlers[intent] = handler
        print("📌 Registered handler for intent: \(intent)")
    }

    func unregisterHandler(for intent: String) {
        messageHandlers.removeValue(forKey: intent)
        print("📌 Unregistered handler for intent: \(intent)")
    }

    // MARK: - Default Handlers

    private func setupDefaultHandlers() {
        // openPanel handler
        registerHandler(for: "openPanel") { intent in
            return self.createAck(
                traceId: intent.traceId,
                code: 200,
                message: "Panel opened successfully",
                data: ["panelId": intent.payload.target.id, "visible": true]
            )
        }

        // closePanel handler
        registerHandler(for: "closePanel") { intent in
            return self.createAck(
                traceId: intent.traceId,
                code: 200,
                message: "Panel closed successfully",
                data: ["panelId": intent.payload.target.id, "visible": false]
            )
        }

        // togglePanel handler
        registerHandler(for: "togglePanel") { intent in
            return self.createAck(
                traceId: intent.traceId,
                code: 200,
                message: "Panel toggled successfully",
                data: ["panelId": intent.payload.target.id]
            )
        }
    }

    // MARK: - Health Monitoring

    private func startHealthMonitoring() {
        Timer.publish(every: 5.0, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.checkConnectionHealth()
            }
            .store(in: &cancellables)
    }

    private func checkConnectionHealth() {
        guard let lastBeat = lastHeartbeat else {
            connectionHealth = .unhealthy
            return
        }

        let timeSinceLastBeat = Date().timeIntervalSince(lastBeat)

        if timeSinceLastBeat > 30 {
            connectionHealth = .unhealthy
        } else if timeSinceLastBeat > 15 {
            connectionHealth = .degraded
        } else {
            connectionHealth = .healthy
        }

        // Send heartbeat every 5 seconds
        sendHeartbeat()
    }

    // MARK: - Helper Methods

    private func createAck(traceId: String, code: Int, message: String, data: [String: Any]? = nil) -> AckNackMessage {
        return AckNackMessage(
            type: "ACK",
            traceId: traceId,
            timestamp: ISO8601DateFormatter().string(from: Date()),
            version: "1.0",
            status: AckNackMessage.Status(
                code: code,
                message: message,
                category: "success"
            ),
            result: data.map {
                AckNackMessage.Result(
                    data: AnyCodable($0),
                    metadata: nil
                )
            },
            error: nil,
            diagnostics: nil
        )
    }

    private func createNack(traceId: String, code: Int, message: String, errorCode: String) -> AckNackMessage {
        return AckNackMessage(
            type: "NACK",
            traceId: traceId,
            timestamp: ISO8601DateFormatter().string(from: Date()),
            version: "1.0",
            status: AckNackMessage.Status(
                code: code,
                message: message,
                category: "validation_error"
            ),
            result: nil,
            error: AckNackMessage.ErrorDetails(
                code: errorCode,
                message: message,
                details: nil,
                retryable: false,
                retryAfter: nil
            ),
            diagnostics: nil
        )
    }
}
