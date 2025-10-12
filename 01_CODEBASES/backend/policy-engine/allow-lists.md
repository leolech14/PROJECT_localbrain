# Tool Allow-Lists Structure Design

**Purpose**: Define comprehensive allow-list system for agent tool and capability governance
**Status**: Design Specification - Ready for Implementation
**Agent**: C (Backend Services Specialist)
**Priority**: P0 - Critical for Agent Safety

## 📋 Overview

The allow-list system provides fine-grained control over what tools, capabilities, and operations each agent can access. This is a fundamental safety mechanism that prevents agents from exceeding their intended scope or accessing unauthorized functionality.

## 🎯 Design Principles

1. **Explicit Allow-List**: Default deny, explicit allow only
2. **Role-Based**: Group tools by agent roles and capabilities
3. **Context-Aware**: Different allow-lists for different contexts
4. **Dynamic**: Allow-lists can be updated at runtime
5. **Auditable**: All allow-list changes are logged and tracked

## 🏗️ Allow-List Structure

### Agent Role Definitions

```json
{
  "agentRoles": {
    "UI_VELOCITY_SPECIALIST": {
      "agentIds": ["A"],
      "description": "Frontend component development and UI implementation",
      "baseCapabilities": ["ui_design", "component_creation", "layout_management"]
    },
    "DESIGN_SYSTEM_SPECIALIST": {
      "agentIds": ["B"],
      "description": "Design system development and accessibility compliance",
      "baseCapabilities": ["design_tokens", "accessibility", "visual_validation"]
    },
    "BACKEND_SERVICES_SPECIALIST": {
      "agentIds": ["C"],
      "description": "Backend services and policy enforcement",
      "baseCapabilities": ["schema_validation", "policy_enforcement", "data_management"]
    },
    "INTEGRATION_SPECIALIST": {
      "agentIds": ["D"],
      "description": "System integration and cross-platform communication",
      "baseCapabilities": ["ipc_bridge", "protocol_translation", "system_testing"]
    }
  }
}
```

### Tool Categories

```json
{
  "toolCategories": {
    "UI_OPERATIONS": {
      "description": "User interface component operations",
      "tools": [
        "CREATE_COMPONENT",
        "UPDATE_COMPONENT",
        "DELETE_COMPONENT",
        "MOVE_COMPONENT",
        "RESIZE_COMPONENT",
        "RENAME_COMPONENT",
        "CHANGE_PROPERTY",
        "ADD_CHILD",
        "REMOVE_CHILD",
        "REORDER_CHILDREN"
      ]
    },
    "SYSTEM_OPERATIONS": {
      "description": "System-level operations",
      "tools": [
        "FILE_READ",
        "FILE_WRITE",
        "FILE_DELETE",
        "DIRECTORY_CREATE",
        "DIRECTORY_DELETE",
        "PROCESS_EXECUTE",
        "NETWORK_REQUEST",
        "DATABASE_QUERY",
        "DATABASE_WRITE",
        "CACHE_ACCESS"
      ]
    },
    "IPC_OPERATIONS": {
      "description": "Inter-process communication operations",
      "tools": [
        "SEND_MESSAGE",
        "RECEIVE_MESSAGE",
        "BROADCAST_MESSAGE",
        "REGISTER_HANDLER",
        "UNREGISTER_HANDLER",
        "ESTABLISH_CONNECTION",
        "CLOSE_CONNECTION"
      ]
    },
    "VALIDATION_OPERATIONS": {
      "description": "Validation and compliance operations",
      "tools": [
        "SCHEMA_VALIDATE",
        "POLICY_EVALUATE",
        "ACCESSIBILITY_CHECK",
        "PERFORMANCE_TEST",
        "SECURITY_SCAN",
        "COMPATIBILITY_CHECK"
      ]
    },
    "AGENT_COORDINATION": {
      "description": "Agent-to-agent coordination operations",
      "tools": [
        "HANDOFF_TASK",
        "REQUEST_ASSISTANCE",
        "SHARE_CONTEXT",
        "NEGOTIATE_RESOURCE",
        "SYNC_STATE",
        "COLLABORATE",
        "ESCALATE_ISSUE"
      ]
    }
  }
}
```

### Agent-Specific Allow-Lists

#### Agent A (UI Velocity Specialist)

```json
{
  "allowLists": {
    "agentA": {
      "agentId": "A",
      "roleId": "UI_VELOCITY_SPECIALIST",
      "version": "1.0.0",
      "lastUpdated": "2025-10-08T13:30:00Z",
      "contexts": {
        "UI_DEVELOPMENT": {
          "description": "Normal UI component development",
          "allowedTools": {
            "UI_OPERATIONS": [
              "CREATE_COMPONENT",
              "UPDATE_COMPONENT",
              "MOVE_COMPONENT",
              "RESIZE_COMPONENT",
              "CHANGE_PROPERTY",
              "ADD_CHILD",
              "REMOVE_CHILD",
              "REORDER_CHILDREN"
            ],
            "VALIDATION_OPERATIONS": [
              "SCHEMA_VALIDATE",
              "ACCESSIBILITY_CHECK"
            ],
            "AGENT_COORDINATION": [
              "REQUEST_ASSISTANCE",
              "SHARE_CONTEXT",
              "HANDOFF_TASK"
            ]
          },
          "restrictions": {
            "maxComponentsPerSession": 100,
            "maxComponentDepth": 10,
            "forbiddenComponents": ["SystemRoot", "SecurityManager"],
            "sensitiveProperties": ["password", "token", "apiKey"]
          }
        },
        "UI_SANDBOX": {
          "description": "Sandboxed UI development with restrictions",
          "allowedTools": {
            "UI_OPERATIONS": [
              "CREATE_COMPONENT",
              "UPDATE_COMPONENT",
              "MOVE_COMPONENT",
              "CHANGE_PROPERTY"
            ],
            "VALIDATION_OPERATIONS": [
              "SCHEMA_VALIDATE"
            ]
          },
          "restrictions": {
            "maxComponentsPerSession": 20,
            "maxComponentDepth": 5,
            "forbiddenComponents": ["*", "all"],
            "allowedComponentTypes": ["Button", "Input", "Container", "Text"],
            "readOnlyProperties": ["id", "type", "parentId"]
          }
        }
      }
    }
  }
}
```

#### Agent B (Design System Specialist)

```json
{
  "allowLists": {
    "agentB": {
      "agentId": "B",
      "roleId": "DESIGN_SYSTEM_SPECIALIST",
      "version": "1.0.0",
      "lastUpdated": "2025-10-08T13:30:00Z",
      "contexts": {
        "DESIGN_DEVELOPMENT": {
          "description": "Design system development and token management",
          "allowedTools": {
            "SYSTEM_OPERATIONS": [
              "FILE_READ",
              "FILE_WRITE",
              "DIRECTORY_CREATE"
            ],
            "VALIDATION_OPERATIONS": [
              "SCHEMA_VALIDATE",
              "ACCESSIBILITY_CHECK",
              "PERFORMANCE_TEST"
            ],
            "UI_OPERATIONS": [
              "CREATE_COMPONENT",
              "UPDATE_COMPONENT",
              "CHANGE_PROPERTY"
            ]
          },
          "restrictions": {
            "allowedFileTypes": [".json", ".css", ".scss", ".js", ".ts", ".md"],
            "allowedDirectories": ["design/", "tokens/", "styles/"],
            "forbiddenFiles": ["*.secret", "*.key", "*.pem"],
            "maxFileSize": "10MB"
          }
        },
        "ACCESSIBILITY_VALIDATION": {
          "description": "Accessibility compliance checking",
          "allowedTools": {
            "VALIDATION_OPERATIONS": [
              "ACCESSIBILITY_CHECK",
              "SCHEMA_VALIDATE",
              "COMPATIBILITY_CHECK"
            ],
            "SYSTEM_OPERATIONS": [
              "FILE_READ",
              "NETWORK_REQUEST"
            ]
          },
          "restrictions": {
            "allowedWCAGLevels": ["AA", "AAA"],
            "allowedContrastChecks": ["APCA", "WCAG2"],
            "maxTestDuration": "30s"
          }
        }
      }
    }
  }
}
```

#### Agent C (Backend Services Specialist)

```json
{
  "allowLists": {
    "agentC": {
      "agentId": "C",
      "roleId": "BACKEND_SERVICES_SPECIALIST",
      "version": "1.0.0",
      "lastUpdated": "2025-10-08T13:30:00Z",
      "contexts": {
        "POLICY_ENFORCEMENT": {
          "description": "Policy evaluation and enforcement",
          "allowedTools": {
            "VALIDATION_OPERATIONS": [
              "POLICY_EVALUATE",
              "SCHEMA_VALIDATE",
              "SECURITY_SCAN"
            ],
            "SYSTEM_OPERATIONS": [
              "DATABASE_QUERY",
              "CACHE_ACCESS",
              "FILE_READ"
            ],
            "AGENT_COORDINATION": [
              "ESCALATE_ISSUE",
              "SYNC_STATE",
              "NEGOTIATE_RESOURCE"
            ]
          },
          "restrictions": {
            "allowedDatabases": ["policies", "schemas", "audit_log"],
            "allowedTables": ["policies", "rules", "decisions", "violations"],
            "forbiddenOperations": ["DATABASE_WRITE"],
            "maxQueryTime": "5s"
          }
        },
        "SCHEMA_MANAGEMENT": {
          "description": "Schema definition and validation",
          "allowedTools": {
            "SYSTEM_OPERATIONS": [
              "FILE_READ",
              "FILE_WRITE",
              "DIRECTORY_CREATE"
            ],
            "VALIDATION_OPERATIONS": [
              "SCHEMA_VALIDATE",
              "COMPATIBILITY_CHECK"
            ]
          },
          "restrictions": {
            "allowedFileTypes": [".json", ".schema", ".md"],
            "allowedDirectories": ["schemas/", "policies/", "validation/"],
            "maxSchemaSize": "1MB",
            "allowedSchemaVersions": ["draft-07", "draft-2019-09"]
          }
        }
      }
    }
  }
}
```

#### Agent D (Integration Specialist)

```json
{
  "allowLists": {
    "agentD": {
      "agentId": "D",
      "roleId": "INTEGRATION_SPECIALIST",
      "version": "1.0.0",
      "lastUpdated": "2025-10-08T13:30:00Z",
      "contexts": {
        "IPC_BRIDGE_DEVELOPMENT": {
          "description": "IPC bridge development and testing",
          "allowedTools": {
            "IPC_OPERATIONS": [
              "SEND_MESSAGE",
              "RECEIVE_MESSAGE",
              "REGISTER_HANDLER",
              "UNREGISTER_HANDLER",
              "ESTABLISH_CONNECTION",
              "CLOSE_CONNECTION"
            ],
            "SYSTEM_OPERATIONS": [
              "FILE_READ",
              "FILE_WRITE",
              "PROCESS_EXECUTE"
            ],
            "VALIDATION_OPERATIONS": [
              "SCHEMA_VALIDATE",
              "COMPATIBILITY_CHECK"
            ]
          },
          "restrictions": {
            "allowedProtocols": ["webkit", "electron", "node-ipc"],
            "allowedMessageTypes": ["UI_INTENT", "ACK", "ERROR", "HEARTBEAT"],
            "maxMessageSize": "1MB",
            "allowedEndpoints": ["localhost:*", "127.0.0.1:*"]
          }
        },
        "SYSTEM_TESTING": {
          "description": "Integration and system testing",
          "allowedTools": {
            "VALIDATION_OPERATIONS": [
              "PERFORMANCE_TEST",
              "COMPATIBILITY_CHECK",
              "SCHEMA_VALIDATE"
            ],
            "SYSTEM_OPERATIONS": [
              "PROCESS_EXECUTE",
              "NETWORK_REQUEST",
              "FILE_READ"
            ],
            "IPC_OPERATIONS": [
              "SEND_MESSAGE",
              "RECEIVE_MESSAGE",
              "BROADCAST_MESSAGE"
            ]
          },
          "restrictions": {
            "allowedTestTypes": ["unit", "integration", "performance"],
            "maxTestDuration": "300s",
            "allowedNetworkHosts": ["localhost", "127.0.0.1"],
            "forbiddenOperations": ["DATABASE_WRITE", "FILE_DELETE"]
          }
        }
      }
    }
  }
}
```

## 🔧 Allow-List Enforcement Engine

### Core Components

```javascript
class AllowListEngine {
    constructor(allowListRegistry, policyEngine) {
        this.registry = allowListRegistry;
        this.policyEngine = policyEngine;
        this.cache = new Map();
    }

    // Check if agent is allowed to perform operation
    isAllowed(agentId, operation, context) {
        const cacheKey = `${agentId}:${operation}:${context.contextType}`;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const decision = this.evaluateAllowList(agentId, operation, context);
        this.cache.set(cacheKey, decision);

        return decision;
    }

    // Evaluate allow-list rules
    evaluateAllowList(agentId, operation, context) {
        const allowList = this.registry.getAllowList(agentId, context.contextType);

        if (!allowList) {
            return {
                allowed: false,
                reason: `No allow-list found for agent ${agentId} in context ${context.contextType}`
            };
        }

        // Check tool category allowance
        const toolCategory = this.categorizeOperation(operation);
        if (!allowList.allowedTools[toolCategory]?.includes(operation)) {
            return {
                allowed: false,
                reason: `Operation ${operation} not in allow-list for ${toolCategory}`
            };
        }

        // Check restrictions
        const restrictionCheck = this.checkRestrictions(allowList, operation, context);
        if (!restrictionCheck.allowed) {
            return restrictionCheck;
        }

        return { allowed: true };
    }

    // Check operation-specific restrictions
    checkRestrictions(allowList, operation, context) {
        const restrictions = allowList.restrictions;

        // Component count restrictions
        if (restrictions.maxComponentsPerSession && context.componentCount) {
            if (context.componentCount >= restrictions.maxComponentsPerSession) {
                return {
                    allowed: false,
                    reason: `Component limit ${restrictions.maxComponentsPerSession} exceeded`
                };
            }
        }

        // Forbidden components
        if (restrictions.forbiddenComponents?.includes(context.componentType)) {
            return {
                allowed: false,
                reason: `Component type ${context.componentType} is forbidden`
            };
        }

        // File operation restrictions
        if (restrictions.allowedFileTypes && context.filePath) {
            const fileExt = path.extname(context.filePath);
            if (!restrictions.allowedFileTypes.includes(fileExt)) {
                return {
                    allowed: false,
                    reason: `File type ${fileExt} not allowed`
                };
            }
        }

        return { allowed: true };
    }

    // Update allow-list at runtime
    updateAllowList(agentId, contextType, updates) {
        const allowList = this.registry.getAllowList(agentId, contextType);
        const updatedList = { ...allowList, ...updates };

        this.registry.setAllowList(agentId, contextType, updatedList);
        this.invalidateCache(agentId, contextType);

        // Log the change
        this.auditLog.log({
            type: "ALLOW_LIST_UPDATE",
            agentId,
            contextType,
            updates,
            timestamp: new Date(),
            updatedBy: "system"
        });
    }
}
```

### Allow-List Registry

```javascript
class AllowListRegistry {
    constructor() {
        this.allowLists = new Map();
        this.roles = new Map();
        this.categories = new Map();
    }

    // Register agent allow-list
    registerAllowList(agentId, allowList) {
        this.allowLists.set(`${agentId}:${allowList.contextType}`, allowList);
    }

    // Get allow-list for agent in context
    getAllowList(agentId, contextType) {
        return this.allowLists.get(`${agentId}:${contextType}`);
    }

    // Get all allow-lists for agent
    getAgentAllowLists(agentId) {
        const agentLists = {};
        for (const [key, allowList] of this.allowLists.entries()) {
            if (key.startsWith(`${agentId}:`)) {
                const contextType = key.split(':')[1];
                agentLists[contextType] = allowList;
            }
        }
        return agentLists;
    }

    // Validate allow-list structure
    validateAllowList(allowList) {
        const schema = require('./allow-list-schema.json');
        const ajv = new Ajv();
        const validate = ajv.compile(schema);

        return validate(allowList);
    }
}
```

## 📊 Allow-List Examples

### Example 1: Agent A Creating Button Component

```javascript
const context = {
    agentId: "A",
    operation: "CREATE_COMPONENT",
    contextType: "UI_DEVELOPMENT",
    componentType: "Button",
    componentCount: 15,
    properties: {
        text: "Click me",
        color: "blue"
    }
};

const decision = allowListEngine.isAllowed("A", "CREATE_COMPONENT", context);
// Result: { allowed: true }
```

### Example 2: Agent A Attempting Forbidden Operation

```javascript
const context = {
    agentId: "A",
    operation: "DELETE_COMPONENT",
    contextType: "UI_SANDBOX",
    componentType: "SystemRoot",
    componentCount: 5
};

const decision = allowListEngine.isAllowed("A", "DELETE_COMPONENT", context);
// Result: { allowed: false, reason: "Operation DELETE_COMPONENT not in allow-list" }
```

### Example 3: Agent B Exceeding Component Limit

```javascript
const context = {
    agentId: "A",
    operation: "CREATE_COMPONENT",
    contextType: "UI_SANDBOX",
    componentCount: 20, // Already at limit
    componentType: "Button"
};

const decision = allowListEngine.isAllowed("A", "CREATE_COMPONENT", context);
// Result: { allowed: false, reason: "Component limit 20 exceeded" }
```

## 🔒 Security Considerations

### Access Control
- Allow-list updates require authentication and authorization
- All allow-list changes are logged with user attribution
- Emergency kill-switch to disable all agent operations

### Validation
- Allow-list structure validation against schema
- Runtime validation of allow-list consistency
- Periodic audits of allow-list configurations

### Auditing
- Complete audit trail of allow-list checks and decisions
- Logging of denied operations with full context
- Regular security reviews of allow-list configurations

## 🚀 Implementation Roadmap

### Phase 1: Core Allow-List System
- Allow-List Registry implementation
- Basic enforcement engine
- Agent role definitions

### Phase 2: Advanced Features
- Context-aware allow-lists
- Dynamic allow-list updates
- Restriction engine

### Phase 3: Security & Auditing
- Audit logging system
- Access control for allow-list management
- Security validation

### Phase 4: Tooling & Monitoring
- Allow-list management UI
- Performance monitoring
- Compliance reporting

---

**Dependencies**: T003 Policy Schema ✅, T007 Policy DSL ✅
**Database Requirements**: Allow-list storage, audit logging, change tracking
**Integration**: All agents (A, B, C, D), T015 (Kill-Switch), T010 (Ledger)