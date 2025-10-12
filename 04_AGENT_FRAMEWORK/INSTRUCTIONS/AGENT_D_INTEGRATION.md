# 🔗 Agent D - Integration Specialist Instructions

**Model**: Sonnet-4.5 (200K context)
**Role**: Ground Specialist - System Integration
**Reporting to**: Agent E (Ground Supervisor) and Agent F (Cloud Supervisor)

---

## 🎯 PRIMARY MISSION
Implement Swift ↔ Electron/Next.js bridge plan; schema contracts; safe tool registry; seed fixtures. Ensure seamless integration between native macOS app and web-based UI lab.

---

## 📋 CURRENT DELIVERABLE STATUS

### ✅ COMPLETED
- IPC contract specifications
- Schema validation requirements
- Swift ↔ Web bridge architecture
- Integration specifications

### 🔄 IN PROGRESS
- JSON schemas for IPC messages
- Swift WebKit message handler setup
- TypeScript client implementation
- Schema validation tests

### ⬜ NOT STARTED
- End-to-end bridge implementation
- Performance optimization
- Error handling & recovery
- Integration testing suite

---

## 🔧 CORE TASKS (From ChatGPT Instructions)

### Task 1: IPC Contract Implementation
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 3

**Requirements:**
- Define JSON schemas for IPC messages
- Implement message validation on both ends
- Create message routing system
- Build error handling framework

**Acceptance Criteria:**
- [ ] IPC message schemas implemented
- [ ] Validation working on both Swift and TypeScript
- [ ] Message routing system functional
- [ ] Error handling robust

**Message Types:**
- UI_INTENT (Swift → Web)
- ACK/NACK (Web → Swift)
- ERROR (Both directions)
- HEARTBEAT (Connection monitoring)

---

### Task 2: Swift WebKit Bridge Implementation
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 4

**Requirements:**
- Implement WKWebView message handlers
- Create bidirectional communication
- Build message serialization/deserialization
- Implement connection monitoring

**Acceptance Criteria:**
- [ ] WKWebView message handler working
- [ ] Bidirectional communication established
- [ ] Message serialization working
- [ ] Connection monitoring functional

**Swift Implementation Structure:**
```swift
class WebBridge: NSObject, WKScriptMessageHandler {
    var onUIIntent: (([String: Any]) -> Void)?

    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        // Handle incoming messages from web
    }

    private func sendToWeb(_ envelope: [String: Any]) {
        // Send messages to web view
    }
}
```

---

### Task 3: TypeScript Client Implementation
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 5

**Requirements:**
- Create TypeScript client for web side
- Implement message validation
- Build event handling system
- Create promise-based API

**Acceptance Criteria:**
- [ ] TypeScript client working
- [ ] Message validation implemented
- [ ] Event handling functional
- [ ] Promise-based API complete

**Client Structure:**
```typescript
class SwiftBridgeClient {
    async postIntent(intent: UIIntent): Promise<Response>
    onMessage(callback: (message: Message) => void): void
    validateMessage(message: any): boolean
    sendAcknowledgement(traceId: string): void
}
```

---

### Task 4: Schema Validation System
**Priority**: P0 - Critical
**Deadline**: Sprint 1, Day 6

**Requirements:**
- Implement JSON schema validation
- Create validation for all message types
- Build validation error reporting
- Ensure type safety across bridge

**Acceptance Criteria:**
- [ ] JSON schema validation working
- [ ] All message types validated
- [ ] Error reporting functional
- [ ] Type safety ensured

**Validation Libraries:**
- Swift: JSONSchema (or custom implementation)
- TypeScript: Ajv for validation

---

### Task 5: Performance Optimization
**Priority**: P1 - High
**Deadline**: Sprint 1, Day 7

**Requirements:**
- Optimize message serialization
- Implement message batching
- Build connection pooling
- Monitor bridge performance

**Acceptance Criteria:**
- [ ] Message serialization optimized
- [ ] Message batching implemented
- [ ] Connection pooling working
- [ ] Performance monitoring functional

**Performance Targets:**
- Round-trip latency ≤ 50ms
- Message serialization ≤ 5ms
- Connection establishment ≤ 100ms

---

## 🎯 SUCCESS CRITERIA (Definition of Done)

### Performance Requirements
- Round-trip latency ≤ 50ms for UI intents
- Message serialization ≤ 5ms
- Connection establishment ≤ 100ms
- Error recovery ≤ 1 second

### Quality Requirements
- 100% schema validation coverage
- Zero message loss in normal operation
- Graceful error handling
- Comprehensive logging

### Integration Requirements
- Seamless Swift ↔ Web communication
- Integration with Agent Control Protocol
- Compatibility with Approval Tray
- Support for real-time updates

---

## 🤝 HANDOFF PROTOCOLS

### To Agent A (UI Velocity)
- UI intent message formats
- Event handling integration
- Performance optimization guidelines

### To Agent C (Backend Services)
- Backend API integration
- Error handling procedures
- Message routing specifications

### To Agent E (Coherence)
- Integration documentation
- Schema versioning
- Cross-platform compatibility

---

## 📊 METRICS & MONITORING

### Performance Metrics
- Message round-trip time
- Serialization/deserialization time
- Connection establishment time
- Error recovery time

### Quality Metrics
- Message validation success rate
- Error rate percentage
- Connection stability duration
- Memory usage patterns

### Integration Metrics
- UI intent success rate
- Backend API call success rate
- Real-time update latency
- Cross-platform consistency

---

## 🚀 WEEKLY SPRINT PLAN

### Sprint 1 (Current)
- **Day 1-2**: IPC contract definition
- **Day 3-4**: Swift WebKit bridge implementation
- **Day 5-6**: TypeScript client development
- **Day 7**: Schema validation + testing

### Sprint 2 (Next)
- **Day 1-3**: Performance optimization
- **Day 4-5**: Error handling improvement
- **Day 6-7**: Integration testing

### Sprint 3 (Future)
- **Day 1-4**: End-to-end testing
- **Day 5-7**: Documentation + deployment

---

## ⚠️ BLOCKERS & RISKS

### Current Blockers
- Swift project access for bridge implementation
- WebKit configuration details

### Potential Risks
- Performance bottlenecks in serialization
- Memory leaks in long-running connections
- Cross-platform compatibility issues

### Mitigation Strategies
- Implement efficient serialization algorithms
- Use connection pooling and cleanup
- Create comprehensive test suites

---

## 📝 DELIVERABLE CHECKLIST

### Core Deliverables
- [ ] IPC contract schemas
- [ ] Swift WebKit bridge
- [ ] TypeScript client
- [ ] Schema validation system
- [ ] Performance optimization

### Testing Deliverables
- [ ] Unit tests for bridge components
- [ ] Integration tests
- [ ] Performance benchmarks
- [ ] Error handling tests

### Documentation Deliverables
- [ ] IPC protocol documentation
- [ ] Integration guide
- [ ] API reference
- [ ] Troubleshooting guide

---

## 🔧 TECHNICAL IMPLEMENTATION

### Required Dependencies
```swift
// Swift
import WebKit
import Foundation
```

```json
// TypeScript
{
  "ajv": "^8.12.0",
  "uuid": "^8.3.0"
}
```

### Message Format Structure
```json
{
  "type": "UI_INTENT|ACK|ERROR|HEARTBEAT",
  "payload": {},
  "timestamp": "2025-10-08T10:00:00Z",
  "traceId": "uuid",
  "version": "1.0"
}
```

### Error Handling Strategy
```typescript
class BridgeError extends Error {
  constructor(
    message: string,
    public code: string,
    public traceId?: string
  ) {
    super(message);
  }
}
```

---

## 🔗 INTEGRATION POINTS

### With Agent A (UI Velocity)
- UI intent message handling
- Real-time UI updates
- Performance optimization
- Error propagation

### With Agent C (Backend Services)
- Backend API integration
- Data synchronization
- Error handling coordination
- Performance monitoring

### With Agent E (Coherence)
- Schema versioning
- Documentation updates
- Cross-platform compatibility
- Integration testing

---

**Status**: Ready to begin Sprint 1 implementation
**Next Action**: Start with IPC contract definition and schema creation
**Dependencies**: Swift project access, WebKit configuration details