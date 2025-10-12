# Backend Schema Contracts - T003

**Status**: 🟡 IN PROGRESS - Agent C (Backend Services Specialist)
**Started**: 2025-10-08 12:05:00 UTC (Sprint 1, Day 1)
**Priority**: P0 - CRITICAL PATH ⚡

## 📋 Overview

This directory contains the JSON Schema contracts for validating all backend data structures in LocalBrain. These schemas ensure type safety, data consistency, and proper validation across the entire system.

## 🗂️ Schema Files

### 1. Scene Diff Schema (`scene-diff.schema.json`)
**Purpose**: Defines the structure for UI scene changes and component modifications
**Key Features**:
- 10 operation types (CREATE, UPDATE, DELETE, MOVE, RESIZE, etc.)
- Component targeting by ID, selector, or JSON path
- Operation-specific data validation
- Conflict resolution metadata
- Agent attribution and session tracking

**Validation Targets**:
- Agent A's Grid System modifications
- Component property changes
- Layout transformations
- Scene state transitions

### 2. Policy Schema (`policy.schema.json`)
**Purpose**: Defines policy-as-code structures for agent governance
**Key Features**:
- 9 rule types (ALLOW_LIST, RATE_LIMIT, SCHEMA_VALIDATION, etc.)
- Agent and context scoping
- Flexible action definitions
- Consequence handling and escalation
- Version-controlled policy management

**Validation Targets**:
- Agent capability enforcement
- Resource usage limits
- Time-based restrictions
- Permission checking
- Schema compliance validation

### 3. Agent I/O Schema (`agent-io.schema.json`)
**Purpose**: Defines the universal I/O contract for all agent communications
**Key Features**:
- 9 message types (REQUEST, RESPONSE, NOTIFICATION, ERROR, etc.)
- Directional flow tracking (INBOUND, OUTBOUND, INTERNAL)
- Correlation ID support for request/response pairing
- Payload type validation
- Metadata enrichment and tagging

**Validation Targets**:
- Inter-agent communications
- System notifications
- Error handling
- Coordination messages
- Handoff protocols

## 🔧 Schema Validation Middleware Architecture

### Design Overview

The schema validation middleware provides a unified validation layer for all data entering and leaving the LocalBrain backend system.

### Core Components

```javascript
// Validation Engine
class SchemaValidationEngine {
  - ajv: JSON Schema validator instance
  - schemaRegistry: Schema version management
  - validationCache: Performance optimization
  - errorReporter: Detailed error reporting
}

// Middleware Layer
class ValidationMiddleware {
  - validateRequest(req, res, next)
  - validateResponse(req, res, next)
  - validateAgentIO(data, agentId)
  - validatePolicy(policy, context)
  - validateSceneDiff(diff, agentId)
}

// Error Handler
class ValidationErrorHandler {
  - formatValidationError(error)
  - logValidationFailure(data, schema, errors)
  - generateErrorResponse(errors)
  - notifyAgentOfViolation(agentId, violation)
}
```

### Validation Flow

1. **Request Validation** (Inbound)
   - Identify message type from Agent I/O schema
   - Validate payload structure
   - Check policy compliance
   - Apply rate limiting and security rules

2. **Business Logic Processing**
   - Scene diff operations validated against Scene Diff schema
   - Policy checks against Policy schema
   - Agent capability verification

3. **Response Validation** (Outbound)
   - Validate response format
   - Ensure policy compliance
   - Apply data sanitization if needed

### Performance Considerations

- **Schema Caching**: Pre-compile schemas on startup
- **Validation Caching**: Cache validation results for identical inputs
- **Async Validation**: Non-blocking validation for large payloads
- **Batch Validation**: Validate multiple items together when possible

### Integration Points

- **Agent D (Integration)**: IPC message validation
- **Agent A (UI)**: Scene diff validation
- **Agent B (Design)**: Policy and compliance validation
- **Agent C (Backend)**: Core validation engine

## 📊 Usage Examples

### Validating Agent I/O

```javascript
import { validateAgentIO } from './validation-middleware';

const agentMessage = {
  id: "msg_123",
  timestamp: "2025-10-08T12:30:00Z",
  agentId: "A",
  type: "REQUEST",
  direction: "OUTBOUND",
  payload: {
    operation: "CREATE_COMPONENT",
    parameters: { componentType: "Button" }
  }
};

const result = await validateAgentIO(agentMessage);
if (result.valid) {
  // Process the message
} else {
  // Handle validation errors
  console.error(result.errors);
}
```

### Validating Scene Diff

```javascript
import { validateSceneDiff } from './validation-middleware';

const sceneDiff = {
  id: "diff_456",
  timestamp: "2025-10-08T12:35:00Z",
  agentId: "A",
  operations: [{
    type: "CREATE_COMPONENT",
    target: { componentId: "btn_123" },
    data: {
      componentType: "Button",
      parentId: "container_456",
      initialProps: { text: "Click me" }
    }
  }]
};

const result = await validateSceneDiff(sceneDiff);
if (result.valid) {
  // Apply the scene diff
} else {
  // Reject invalid changes
}
```

## 🚨 Validation Error Handling

### Error Categories

1. **Schema Validation Errors**: Structural validation failures
2. **Policy Violations**: Policy rule violations
3. **Type Mismatches**: Data type inconsistencies
4. **Missing Required Fields**: Required data not provided
5. **Format Validation**: Invalid data formats

### Error Response Format

```json
{
  "valid": false,
  "errors": [
    {
      "path": "$.operations[0].data.componentType",
      "message": "must be a valid component type",
      "code": "ENUM_VALIDATION_FAILED",
      "schema": "scene-diff.schema.json"
    }
  ],
  "validatedAt": "2025-10-08T12:40:00Z"
}
```

## 🔄 Schema Versioning

### Version Strategy
- **Semantic Versioning**: Use `major.minor.patch` format
- **Backward Compatibility**: Maintain backward compatibility for minor versions
- **Migration Paths**: Provide migration guides for major version changes
- **Deprecation Warnings**: Warn about deprecated schema usage

### Schema Registry

```javascript
const schemaRegistry = {
  "scene-diff": {
    "current": "1.0.0",
    "supported": ["1.0.0"],
    "deprecated": [],
    "schemas": {
      "1.0.0": "./scene-diff.schema.json"
    }
  },
  "policy": {
    "current": "1.0.0",
    "supported": ["1.0.0"],
    "deprecated": [],
    "schemas": {
      "1.0.0": "./policy.schema.json"
    }
  }
};
```

## 🔐 Security Considerations

### Input Sanitization
- Remove potentially dangerous content
- Limit payload sizes to prevent DoS attacks
- Validate against injection attacks

### Access Control
- Schema access based on agent permissions
- Rate limiting for validation requests
- Audit logging for all validation attempts

### Data Privacy
- Redact sensitive information in error messages
- Secure storage of schema definitions
- Controlled access to schema metadata

## 📈 Performance Metrics

### Validation Performance Targets
- **Schema Compilation**: <10ms per schema
- **Validation Latency**: <5ms for average payload
- **Memory Usage**: <100MB for validator engine
- **Throughput**: 1000+ validations per second

### Monitoring
- Validation success/failure rates
- Performance metrics by schema type
- Error distribution analysis
- Cache hit/miss ratios

## 🚀 Next Steps

### Immediate (T003 Completion)
- [x] Scene diff schema implemented
- [x] Policy schema implemented
- [x] Agent I/O validation schemas defined
- [x] Middleware architecture documented

### Follow-up Tasks (Dependent on Database Decision)
- **T007**: Policy Engine implementation using these schemas
- **T010**: Change-Set Ledger with schema validation
- **T015**: Kill-Switch with policy schema enforcement
- **T018**: RAG Index with agent I/O validation

### Integration Requirements
- Complete validation middleware implementation
- Performance testing and optimization
- Integration with Agent D's IPC contracts
- CI/CD pipeline integration for schema validation

---

## 📝 Development Notes

- All schemas follow JSON Schema Draft 7 specification
- Schema validation will use AJV (Another JSON Schema Validator)
- Schemas are designed to be database-agnostic
- Each schema includes comprehensive validation rules and error handling
- Modular design allows for easy extension and modification

**Dependencies**: None (database decision pending for implementation)
**Blocking**: T007, T010, T015 (awaiting database technology decision)