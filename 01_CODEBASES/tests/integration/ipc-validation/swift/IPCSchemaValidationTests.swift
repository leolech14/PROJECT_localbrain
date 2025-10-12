/**
 * Swift Schema Validation Tests
 * ==============================
 *
 * Task: T017 - Schema Validation System Testing
 * Agent: D (Integration Specialist)
 * Tests: IPCBridge message validation against T002 schemas
 */

import XCTest
import WebKit
@testable import LocalBrain

class IPCSchemaValidationTests: XCTestCase {

    var bridge: IPCBridge!
    var mockWebView: WKWebView!

    override func setUp() {
        super.setUp()
        mockWebView = WKWebView()
        bridge = IPCBridge(webView: mockWebView)
    }

    override func tearDown() {
        bridge = nil
        mockWebView = nil
        super.tearDown()
    }

    // MARK: - Valid Message Tests

    func testValidUIIntentMessage() throws {
        let json = """
        {
            "type": "UI_INTENT",
            "traceId": "test-001",
            "timestamp": "2025-10-08T15:30:00.000Z",
            "version": "1.0",
            "source": "web",
            "payload": {
                "intent": "openPanel",
                "target": {
                    "type": "sidebar",
                    "id": "agent-proposals-panel"
                },
                "parameters": {
                    "width": 400
                },
                "metadata": {
                    "priority": "high",
                    "timeout": 5000,
                    "retryable": true
                }
            }
        }
        """

        let data = json.data(using: .utf8)!
        let message = try JSONDecoder().decode(UIIntentMessage.self, from: data)

        XCTAssertEqual(message.type, .uiIntent)
        XCTAssertEqual(message.traceId, "test-001")
        XCTAssertEqual(message.payload.intent, "openPanel")
        XCTAssertEqual(message.payload.target.id, "agent-proposals-panel")
    }

    func testValidACKMessage() throws {
        let json = """
        {
            "type": "ACK",
            "traceId": "test-001",
            "timestamp": "2025-10-08T15:30:00.150Z",
            "version": "1.0",
            "status": {
                "code": 200,
                "message": "Panel opened successfully",
                "category": "success"
            },
            "result": {
                "data": {
                    "panelId": "agent-proposals-panel",
                    "opened": true
                }
            }
        }
        """

        let data = json.data(using: .utf8)!
        let message = try JSONDecoder().decode(AckNackMessage.self, from: data)

        XCTAssertEqual(message.type, .ack)
        XCTAssertEqual(message.status.code, 200)
        XCTAssertEqual(message.status.message, "Panel opened successfully")
    }

    func testValidNACKMessage() throws {
        let json = """
        {
            "type": "NACK",
            "traceId": "test-002",
            "timestamp": "2025-10-08T15:30:01.000Z",
            "version": "1.0",
            "status": {
                "code": 400,
                "message": "Invalid message format",
                "category": "validation_error"
            },
            "error": {
                "code": "SCHEMA_VALIDATION_FAILED",
                "message": "Missing required field: payload.target.id",
                "retryable": false
            }
        }
        """

        let data = json.data(using: .utf8)!
        let message = try JSONDecoder().decode(AckNackMessage.self, from: data)

        XCTAssertEqual(message.type, .nack)
        XCTAssertEqual(message.status.code, 400)
        XCTAssertNotNil(message.error)
    }

    func testValidERRORMessage() throws {
        let json = """
        {
            "type": "ERROR",
            "traceId": "test-003",
            "timestamp": "2025-10-08T15:30:02.000Z",
            "version": "1.0",
            "error": {
                "code": "BRIDGE_CONNECTION_LOST",
                "severity": "critical",
                "message": "Lost connection to Swift bridge",
                "recovery": {
                    "retryable": true,
                    "retryAfter": 5000,
                    "fallbackAction": "Reconnect to Swift bridge"
                }
            }
        }
        """

        let data = json.data(using: .utf8)!
        let message = try JSONDecoder().decode(ErrorMessage.self, from: data)

        XCTAssertEqual(message.type, .error)
        XCTAssertEqual(message.error.code, "BRIDGE_CONNECTION_LOST")
        XCTAssertEqual(message.error.severity, .critical)
    }

    func testValidHEARTBEATMessage() throws {
        let json = """
        {
            "type": "HEARTBEAT",
            "traceId": "test-004",
            "timestamp": "2025-10-08T15:30:05.000Z",
            "version": "1.0",
            "source": "swift",
            "health": {
                "status": "healthy",
                "uptime": 3600
            },
            "metrics": {
                "messagesSent": 150,
                "messagesReceived": 145,
                "errorCount": 2,
                "averageLatency": 45.5,
                "queueDepth": 0
            }
        }
        """

        let data = json.data(using: .utf8)!
        let message = try JSONDecoder().decode(HeartbeatMessage.self, from: data)

        XCTAssertEqual(message.type, .heartbeat)
        XCTAssertEqual(message.health.status, .healthy)
        XCTAssertEqual(message.health.uptime, 3600)
    }

    // MARK: - Invalid Message Tests

    func testRejectMissingType() {
        let json = """
        {
            "traceId": "test-invalid-001",
            "timestamp": "2025-10-08T15:30:00.000Z",
            "version": "1.0"
        }
        """

        let data = json.data(using: .utf8)!
        XCTAssertThrowsError(try JSONDecoder().decode(UIIntentMessage.self, from: data))
    }

    func testRejectInvalidMessageType() {
        let json = """
        {
            "type": "INVALID_TYPE",
            "traceId": "test-invalid-002",
            "timestamp": "2025-10-08T15:30:00.000Z",
            "version": "1.0"
        }
        """

        let data = json.data(using: .utf8)!
        XCTAssertThrowsError(try JSONDecoder().decode(UIIntentMessage.self, from: data))
    }

    func testRejectUIIntentMissingPayload() {
        let json = """
        {
            "type": "UI_INTENT",
            "traceId": "test-invalid-004",
            "timestamp": "2025-10-08T15:30:00.000Z",
            "version": "1.0",
            "source": "web"
        }
        """

        let data = json.data(using: .utf8)!
        XCTAssertThrowsError(try JSONDecoder().decode(UIIntentMessage.self, from: data))
    }

    func testRejectUIIntentMissingTarget() {
        let json = """
        {
            "type": "UI_INTENT",
            "traceId": "test-invalid-005",
            "timestamp": "2025-10-08T15:30:00.000Z",
            "version": "1.0",
            "source": "web",
            "payload": {
                "intent": "openPanel"
            }
        }
        """

        let data = json.data(using: .utf8)!
        XCTAssertThrowsError(try JSONDecoder().decode(UIIntentMessage.self, from: data))
    }

    func testRejectACKMissingStatus() {
        let json = """
        {
            "type": "ACK",
            "traceId": "test-invalid-007",
            "timestamp": "2025-10-08T15:30:00.000Z",
            "version": "1.0"
        }
        """

        let data = json.data(using: .utf8)!
        XCTAssertThrowsError(try JSONDecoder().decode(AckNackMessage.self, from: data))
    }

    func testRejectERRORMissingErrorField() {
        let json = """
        {
            "type": "ERROR",
            "traceId": "test-invalid-009",
            "timestamp": "2025-10-08T15:30:00.000Z",
            "version": "1.0"
        }
        """

        let data = json.data(using: .utf8)!
        XCTAssertThrowsError(try JSONDecoder().decode(ErrorMessage.self, from: data))
    }

    // MARK: - Performance Tests

    func testValidationPerformance() throws {
        let json = """
        {
            "type": "UI_INTENT",
            "traceId": "perf-test",
            "timestamp": "2025-10-08T15:30:00.000Z",
            "version": "1.0",
            "source": "web",
            "payload": {
                "intent": "openPanel",
                "target": {
                    "type": "sidebar",
                    "id": "test"
                }
            }
        }
        """

        let data = json.data(using: .utf8)!

        measure {
            for _ in 0..<100 {
                _ = try? JSONDecoder().decode(UIIntentMessage.self, from: data)
            }
        }
    }

    func testSerializationPerformance() throws {
        let message = UIIntentMessage(
            type: .uiIntent,
            traceId: "perf-test",
            timestamp: ISO8601DateFormatter().string(from: Date()),
            version: "1.0",
            source: .swift,
            payload: UIIntentPayload(
                intent: "openPanel",
                target: IntentTarget(type: "sidebar", id: "test")
            )
        )

        measure {
            for _ in 0..<100 {
                _ = try? JSONEncoder().encode(message)
            }
        }
    }

    // MARK: - Round-Trip Tests

    func testRoundTripSerialization() throws {
        let originalMessage = UIIntentMessage(
            type: .uiIntent,
            traceId: "roundtrip-test",
            timestamp: "2025-10-08T15:30:00.000Z",
            version: "1.0",
            source: .swift,
            payload: UIIntentPayload(
                intent: "openPanel",
                target: IntentTarget(type: "sidebar", id: "test"),
                parameters: ["width": 400]
            )
        )

        // Encode
        let data = try JSONEncoder().encode(originalMessage)

        // Decode
        let decodedMessage = try JSONDecoder().decode(UIIntentMessage.self, from: data)

        // Verify
        XCTAssertEqual(originalMessage.traceId, decodedMessage.traceId)
        XCTAssertEqual(originalMessage.payload.intent, decodedMessage.payload.intent)
        XCTAssertEqual(originalMessage.payload.target.id, decodedMessage.payload.target.id)
    }
}
