# 🔗 LocalBrain IPC Message Contracts

**Version**: 1.0
**Created**: 2025-10-08 (Sprint 1, Day 1)
**Owner**: Agent D (Integration Specialist)
**Status**: Active - Foundation Complete

---

## 📋 Overview

This directory contains **platform-agnostic JSON Schema contracts** for Inter-Process Communication (IPC) between Swift (macOS native app) and Web (Electron/Next.js UI).

**Purpose**: Ensure type-safe, validated communication across the Swift ↔ Web bridge.

---

## 🎯 Message Types

### **1. UI_INTENT** (`ui-intent.schema.json`)
**Direction**: Bidirectional (Swift ↔ Web)
**Purpose**: Request UI actions (open panel, resize, update layout, etc.)

**Key Fields**:
- `intent`: Action to perform (openPanel, closePanel, togglePanel, etc.)
- `target`: UI element to operate on (panel, sidebar, widget, grid, etc.)
- `parameters`: Intent-specific data (width, height, position, animation, etc.)
- `metadata`: Priority, timeout, retryable, idempotencyKey

**Example Use Cases**:
- Swift app requests web UI to open agent proposal panel
- Web UI requests Swift to update native window layout
- Agent automation triggers sidebar display

---

### **2. ACK/NACK** (`acknowledgement.schema.json`)
**Direction**: Response to UI_INTENT
**Purpose**: Acknowledge success (ACK) or failure (NACK)

**ACK Response**:
- `status.code`: 200-299 (HTTP-like success codes)
- `result.data`: Operation result data
- `result.metadata`: Processing time, affected elements

**NACK Response**:
- `status.code`: 400-499 (client error) or 500-599 (server error)
- `error.code`: Machine-readable error code
- `error.message`: Human-readable error message
- `error.retryable`: Whether operation can be retried

**Example Use Cases**:
- Web UI acknowledges panel opened successfully
- Swift acknowledges layout update applied
- Web UI rejects proposal display due to permissions

---

### **3. ERROR** (`error.schema.json`)
**Direction**: Bidirectional (Swift ↔ Web ↔ Bridge)
**Purpose**: Report critical failures or unexpected conditions

**Error Categories**:
- `connection`: Bridge connection issues
- `serialization`: Message encoding/decoding failures
- `validation`: Schema validation failures
- `protocol`: Version mismatches
- `handler`: Handler exceptions
- `permission`: Permission check failures
- `rate_limit`: Rate limiting
- `resource`: Resource exhaustion
- `internal`: Internal bridge errors

**Recovery Information**:
- `recovery.retryable`: Can operation be retried?
- `recovery.retryAfter`: Suggested retry delay (ms)
- `recovery.fallbackAction`: Suggested fallback
- `recovery.userMessage`: User-friendly message

**Example Use Cases**:
- Bridge connection lost unexpectedly
- Message failed schema validation
- Handler threw uncaught exception
- Rate limit exceeded

---

### **4. HEARTBEAT** (`heartbeat.schema.json`)
**Direction**: Bidirectional (Swift ↔ Web)
**Purpose**: Monitor bridge connection health and capabilities

**Health Status**:
- `healthy`: Normal operation
- `degraded`: Experiencing issues but operational
- `unhealthy`: Critical issues, may disconnect

**Metrics Included**:
- `messagesSent/Received`: Total message counts
- `errorCount`: Total errors encountered
- `averageLatency`: Round-trip latency (ms)
- `pendingMessages`: Awaiting response
- `queueDepth`: Messages in processing queue

**Capabilities**:
- `supportedIntents`: List of supported UI intent types
- `features`: Feature flags (offline_support, real_time_updates, etc.)
- `protocolVersion`: IPC protocol version

**Example Use Cases**:
- Detect connection degradation
- Monitor bridge performance
- Capability negotiation
- Connection health dashboard

---

## 🔒 Validation Rules

### **Required Fields (ALL Messages)**:
- ✅ `type`: Message type (UI_INTENT, ACK, NACK, ERROR, HEARTBEAT)
- ✅ `traceId`: UUID for request tracing
- ✅ `timestamp`: ISO 8601 timestamp
- ✅ `version`: Schema version (e.g., "1.0")

### **Validation Libraries**:

**Swift**: Use native `Codable` + custom validation
```swift
struct IPCMessage: Codable {
    let type: MessageType
    let traceId: UUID
    let timestamp: Date
    let version: String
    // ...
}

func validateMessage(_ message: IPCMessage) throws {
    guard message.version == "1.0" else {
        throw ValidationError.versionMismatch
    }
    // Additional validation...
}
```

**TypeScript**: Use [Ajv](https://ajv.js.org/) for JSON Schema validation
```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(uiIntentSchema);
if (!validate(message)) {
    throw new ValidationError(validate.errors);
}
```

---

## 🎯 Performance Targets

### **Latency**:
- ✅ Round-trip latency: ≤ 50ms (target)
- ✅ Message serialization: ≤ 5ms
- ✅ Schema validation: ≤ 10ms
- ✅ Connection establishment: ≤ 100ms

### **Reliability**:
- ✅ Message delivery: 100% (with retry)
- ✅ Schema validation: 100% coverage
- ✅ Error recovery: ≤ 1 second

### **Monitoring**:
- Track round-trip times via `traceId`
- Monitor error rates by category
- Measure heartbeat response times
- Track queue depths and pending messages

---

## 🔗 Integration Points

### **Swift Side** (`LocalBrain/WidgetSystem/IPCBridge.swift`):
```swift
class IPCBridge: NSObject, WKScriptMessageHandler {
    func userContentController(_ controller: WKUserContentController,
                                didReceive message: WKScriptMessage) {
        guard let dict = message.body as? [String: Any],
              let type = dict["type"] as? String else {
            sendError(.messageDeserializationFailed)
            return
        }

        // Validate against schema
        // Route to appropriate handler
        // Send ACK/NACK response
    }

    func sendIntent(_ intent: UIIntent) {
        let message = encodeMessage(intent)
        webView.evaluateJavaScript("window.ipcBridge.receiveMessage(\(message))")
    }
}
```

### **Web Side** (`localbrain-ui/lib/swift-bridge/client.ts`):
```typescript
class SwiftBridgeClient {
    async postIntent(intent: UIIntent): Promise<AckNackMessage> {
        const message = this.createMessage('UI_INTENT', intent);
        this.validateMessage(message, uiIntentSchema);

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Timeout waiting for ACK'));
            }, intent.metadata?.timeout || 5000);

            this.pendingRequests.set(message.traceId, { resolve, reject, timeout });
            this.sendToSwift(message);
        });
    }

    private handleAckNack(response: AckNackMessage) {
        const pending = this.pendingRequests.get(response.traceId);
        if (pending) {
            clearTimeout(pending.timeout);
            pending.resolve(response);
            this.pendingRequests.delete(response.traceId);
        }
    }
}
```

---

## 🚨 Error Handling Strategy

### **Error Severity Levels**:
1. **Low**: Informational, no action required
2. **Medium**: Degraded functionality, fallback available
3. **High**: Critical functionality affected, user notice required
4. **Critical**: Bridge failure, immediate reconnection needed

### **Retry Strategy**:
```typescript
async function sendWithRetry(message: UIIntent, maxRetries = 3): Promise<AckNack> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await bridgeClient.postIntent(message);
        } catch (error) {
            if (!error.retryable || attempt === maxRetries) {
                throw error;
            }
            await delay(error.retryAfter || 1000 * attempt);
        }
    }
}
```

### **Fallback Actions**:
- **Connection Lost**: Attempt reconnection, show offline mode
- **Validation Failed**: Log error, request retry with corrected data
- **Handler Exception**: Isolate error, continue processing other messages
- **Timeout**: Mark as failed, retry if retryable
- **Rate Limited**: Queue message, retry after delay

---

## 📊 Monitoring & Debugging

### **Trace IDs**:
Every message has a `traceId` (UUID) for end-to-end tracing:
```
UI_INTENT (traceId: abc-123)
  → ACK (traceId: abc-123) [success]

UI_INTENT (traceId: def-456)
  → NACK (traceId: def-456) [failure]
  → ERROR (traceId: def-456) [details]
```

### **Logging Strategy**:
```swift
// Swift side
logger.debug("IPC: Sent UI_INTENT", metadata: [
    "traceId": message.traceId,
    "intent": message.payload.intent,
    "target": message.payload.target.id
])
```

```typescript
// Web side
console.log('[IPC]', {
    direction: 'received',
    type: message.type,
    traceId: message.traceId,
    timestamp: message.timestamp
});
```

### **Metrics Collection**:
- Message counts by type
- Latency histograms (p50, p95, p99)
- Error rates by category
- Connection uptime and reconnection frequency
- Queue depths over time

---

## 🎯 Next Steps (T008, T013)

### **T008 - Swift WebKit Bridge Implementation**:
- Implement `WKScriptMessageHandler` using these schemas
- Add message validation on Swift side
- Implement connection monitoring with HEARTBEAT
- Build error recovery mechanisms

### **T013 - TypeScript Client Implementation**:
- Create `SwiftBridgeClient` class using these schemas
- Implement Ajv validation
- Build promise-based API with timeout handling
- Add event subscription system

### **T017 - Schema Validation Testing**:
- Unit tests for all schema validations
- Integration tests for Swift ↔ Web round-trips
- Performance benchmarks (latency, throughput)
- Error handling tests (connection loss, timeouts, etc.)

---

## 📝 Schema Versioning

**Current Version**: 1.0
**Breaking Changes**: Increment major version (1.0 → 2.0)
**Backward-Compatible Changes**: Increment minor version (1.0 → 1.1)

**Version Negotiation**:
- HEARTBEAT messages include `protocolVersion`
- Both sides check version compatibility
- Send ERROR if version mismatch detected

---

## 🤝 Coordination

**Dependencies**:
- T002 (this task) ✅ COMPLETE
- Unblocks: T008 (Swift Bridge), T013 (TypeScript Client), T017 (Testing)

**Contact**:
- Questions: Agent E (Ground Supervisor)
- Swift Integration: Agent D (Integration Specialist)
- Web Integration: Agent A (UI Velocity Specialist)

---

**Last Updated**: 2025-10-08 (Sprint 1, Day 1)
**Status**: Foundation complete, ready for implementation (T008, T013)
**Next**: Swift WebKit bridge using these schemas
