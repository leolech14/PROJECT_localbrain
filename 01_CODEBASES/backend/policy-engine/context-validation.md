# Context Scope Validation Rules Design

**Purpose**: Define comprehensive context validation system for policy enforcement
**Status**: Design Specification - Ready for Implementation
**Agent**: C (Backend Services Specialist)
**Priority**: P0 - Critical for Agent Governance and Security

## 📋 Overview

Context scope validation ensures that agent operations are only performed within appropriate contexts, environments, and boundaries. This system provides fine-grained control over where, when, and how agents can operate based on situational awareness and business rules.

## 🎯 Design Goals

1. **Multi-Dimensional**: Validate across agent, operation, environment, and resource dimensions
2. **Hierarchical**: Support nested contexts and inheritance rules
3. **Dynamic**: Context rules can adapt based on system state and external conditions
4. **Performant**: <10ms context validation time
5. **Comprehensive**: Cover all aspects of agent operation context

## 🏗️ Context Model

### Context Dimensions

```javascript
const ContextModel = {
    // Agent Context
    agent: {
        id: "A|B|C|D",
        role: "UI_VELOCITY_SPECIALIST|DESIGN_SYSTEM_SPECIALIST|BACKEND_SERVICES_SPECIALIST|INTEGRATION_SPECIALIST",
        capabilities: ["capability1", "capability2"],
        permissions: ["permission1", "permission2"],
        sessionId: "session_identifier",
        userId: "user_identifier"
    },

    // Operation Context
    operation: {
        type: "CREATE_COMPONENT|UPDATE_COMPONENT|DELETE_COMPONENT|...",
        category: "UI_OPERATIONS|SYSTEM_OPERATIONS|IPC_OPERATIONS|...",
        target: {
            componentId: "component_identifier",
            componentType: "Button|Input|Container|...",
            resourcePath: "/path/to/resource",
            resourceType: "file|database|cache|..."
        },
        properties: {
            sensitive: true|false,
            destructive: true|false,
            reversible: true|false
        }
    },

    // Environment Context
    environment: {
        type: "DEVELOPMENT|STAGING|PRODUCTION",
        region: "us-east-1|us-west-2|...",
        cluster: "cluster_name",
        namespace: "namespace_name",
        version: "system_version",
        features: ["feature_flag1", "feature_flag2"]
    },

    // Temporal Context
    temporal: {
        timestamp: "ISO_8601_timestamp",
        timezone: "timezone_identifier",
        businessHours: true|false,
        dayOfWeek: "MON|TUE|...|SUN",
        timeOfDay: "MORNING|AFTERNOON|EVENING|NIGHT",
        seasonality: "PEAK|NORMAL|LOW"
    },

    // Session Context
    session: {
        id: "session_identifier",
        duration: "seconds",
        operations: {
            total: "number",
            byType: {
                "CREATE_COMPONENT": 5,
                "UPDATE_COMPONENT": 10
            }
        },
        resources: {
            components: {
                created: 15,
                modified: 8,
                deleted: 2
            },
            memory: "bytes_used",
            cpu: "percentage_used"
        }
    },

    // System Context
    system: {
        load: {
            cpu: "percentage",
            memory: "percentage",
            disk: "percentage",
            network: "percentage"
        },
        health: {
            overall: "HEALTHY|DEGRADED|UNHEALTHY",
            services: {
                "database": "HEALTHY",
                "cache": "DEGRADED",
                "api": "HEALTHY"
            }
        },
        alerts: {
            active: "number",
            critical: "number",
            warnings: "number"
        }
    }
};
```

### Context Hierarchy

```javascript
const ContextHierarchy = {
    // Global context (applies to all operations)
    global: {
        constraints: {
            maxConcurrentAgents: 4,
            maxSystemLoad: 0.8,
            emergencyMode: false
        }
    },

    // Environment context (applies to specific environments)
    environment: {
        production: {
            constraints: {
                maxOperationsPerMinute: 100,
                requiredApprovals: ["SECURITY", "BUSINESS"],
                auditLevel: "FULL",
                allowedOperations: ["READ", "UPDATE"], // No DELETE in production
                maintenanceWindows: [
                    { start: "02:00", end: "04:00", timezone: "UTC", days: ["SUN"] }
                ]
            }
        },
        development: {
            constraints: {
                maxOperationsPerMinute: 1000,
                requiredApprovals: [],
                auditLevel: "MINIMAL",
                allowedOperations: ["*"], // All operations allowed
                experimentalFeatures: true
            }
        }
    },

    // Agent context (applies to specific agents)
    agent: {
        A: {
            allowedContexts: ["UI_DEVELOPMENT", "UI_SANDBOX"],
            forbiddenContexts: ["BACKEND_OPERATIONS", "SYSTEM_ADMIN"],
            capabilities: ["ui_design", "component_creation"],
            constraints: {
                maxComponentsPerSession: 100,
                maxComponentDepth: 10,
                allowedComponentTypes: ["Button", "Input", "Container", "Grid"]
            }
        },
        B: {
            allowedContexts: ["DESIGN_DEVELOPMENT", "ACCESSIBILITY_VALIDATION"],
            forbiddenContexts: ["PRODUCTION_DEPLOYMENT", "DATABASE_ADMIN"],
            capabilities: ["design_tokens", "accessibility"],
            constraints: {
                maxTokenChangesPerHour: 20,
                allowedFileTypes: [".json", ".css", ".scss"],
                allowedDirectories: ["design/", "tokens/"]
            }
        },
        C: {
            allowedContexts: ["POLICY_ENFORCEMENT", "SCHEMA_MANAGEMENT"],
            forbiddenContexts: ["UI_OPERATIONS", "USER_FACING"],
            capabilities: ["policy_evaluation", "schema_validation"],
            constraints: {
                maxPolicyEvaluationsPerSecond: 100,
                allowedDatabases: ["policies", "schemas"],
                readOnlyOperations: true
            }
        },
        D: {
            allowedContexts: ["IPC_BRIDGE_DEVELOPMENT", "SYSTEM_TESTING"],
            forbiddenContexts: ["USER_DATA_ACCESS", "PRODUCTION_MODIFICATIONS"],
            capabilities: ["ipc_bridge", "system_testing"],
            constraints: {
                maxIPCMessagesPerSecond: 20,
                allowedTestTypes: ["unit", "integration"],
                allowedEndpoints: ["localhost", "127.0.0.1"]
            }
        }
    },

    // Operation context (applies to specific operations)
    operation: {
        CREATE_COMPONENT: {
            allowedEnvironments: ["DEVELOPMENT", "STAGING"],
            requiredPermissions: ["component_create"],
            constraints: {
                maxPerSession: 50,
                maxDepth: 10,
                validationRequired: true
            }
        },
        DELETE_COMPONENT: {
            allowedEnvironments: ["DEVELOPMENT"],
            requiredPermissions: ["component_delete", "admin_approval"],
            constraints: {
                businessHoursOnly: true,
                confirmationRequired: true,
                backupRequired: true
            }
        },
        DATABASE_WRITE: {
            allowedEnvironments: ["DEVELOPMENT", "STAGING"],
            requiredPermissions: ["database_write", "admin_approval"],
            constraints: {
                allowedTables: ["staging_*", "test_*"],
                maxRecordsPerOperation: 1000,
                transactionRequired: true
            }
        }
    }
};
```

## 🔧 Context Validation Engine

### Core Validator

```javascript
class ContextValidator {
    constructor(contextRules, policyEngine) {
        this.rules = contextRules;
        this.policyEngine = policyEngine;
        this.cache = new Map();
        this.metrics = new ValidationMetrics();
    }

    async validateContext(agentId, operation, context) {
        const startTime = performance.now();

        try {
            // Build full context object
            const fullContext = await this.buildContext(agentId, operation, context);

            // Check cache first
            const cacheKey = this.buildCacheKey(fullContext);
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            // Validate all dimensions
            const validations = await Promise.all([
                this.validateAgentContext(fullContext),
                this.validateOperationContext(fullContext),
                this.validateEnvironmentContext(fullContext),
                this.validateTemporalContext(fullContext),
                this.validateSessionContext(fullContext),
                this.validateSystemContext(fullContext)
            ]);

            const decision = this.combineValidations(validations);

            // Cache result
            this.cache.set(cacheKey, decision);
            setTimeout(() => this.cache.delete(cacheKey), 60000); // 1 minute cache

            const latency = performance.now() - startTime;
            this.metrics.recordValidation(fullContext, decision, latency);

            return decision;
        } catch (error) {
            this.metrics.recordError(agentId, operation, error);
            throw error;
        }
    }

    async validateAgentContext(context) {
        const agentRules = this.rules.agent[context.agent.id];
        if (!agentRules) {
            return { allowed: false, reason: `No rules defined for agent ${context.agent.id}` };
        }

        // Check allowed contexts
        if (agentRules.allowedContexts && !agentRules.allowedContexts.includes(context.operation.contextType)) {
            return {
                allowed: false,
                reason: `Agent ${context.agent.id} not allowed in context ${context.operation.contextType}`
            };
        }

        // Check forbidden contexts
        if (agentRules.forbiddenContexts && agentRules.forbiddenContexts.includes(context.operation.contextType)) {
            return {
                allowed: false,
                reason: `Agent ${context.agent.id} forbidden in context ${context.operation.contextType}`
            };
        }

        // Check capabilities
        if (agentRules.capabilities && context.operation.requiredCapabilities) {
            const hasCapabilities = context.operation.requiredCapabilities.every(
                cap => agentRules.capabilities.includes(cap)
            );
            if (!hasCapabilities) {
                return {
                    allowed: false,
                    reason: `Agent ${context.agent.id} lacks required capabilities`
                };
            }
        }

        return { allowed: true };
    }

    async validateOperationContext(context) {
        const operationRules = this.rules.operation[context.operation.type];
        if (!operationRules) {
            return { allowed: true }; // No restrictions if no rules defined
        }

        // Check environment restrictions
        if (operationRules.allowedEnvironments && !operationRules.allowedEnvironments.includes(context.environment.type)) {
            return {
                allowed: false,
                reason: `Operation ${context.operation.type} not allowed in ${context.environment.type}`
            };
        }

        // Check required permissions
        if (operationRules.requiredPermissions) {
            const hasPermissions = operationRules.requiredPermissions.every(
                perm => context.agent.permissions.includes(perm)
            );
            if (!hasPermissions) {
                return {
                    allowed: false,
                    reason: `Operation ${context.operation.type} requires additional permissions`
                };
            }
        }

        return { allowed: true };
    }

    async validateEnvironmentContext(context) {
        const envRules = this.rules.environment[context.environment.type.toLowerCase()];
        if (!envRules) {
            return { allowed: true }; // No restrictions if no rules defined
        }

        // Check maintenance windows
        if (envRules.constraints.maintenanceWindows) {
            const isInMaintenanceWindow = this.checkMaintenanceWindow(
                context.temporal,
                envRules.constraints.maintenanceWindows
            );
            if (isInMaintenanceWindow) {
                return {
                    allowed: false,
                    reason: `Operation not allowed during maintenance window`
                };
            }
        }

        // Check allowed operations
        if (envRules.constraints.allowedOperations && !envRules.constraints.allowedOperations.includes("*")) {
            if (!envRules.constraints.allowedOperations.includes(context.operation.type)) {
                return {
                    allowed: false,
                    reason: `Operation ${context.operation.type} not allowed in ${context.environment.type}`
                };
            }
        }

        return { allowed: true };
    }

    async validateTemporalContext(context) {
        // Check business hours restrictions
        const businessHoursRules = this.findBusinessHoursRules(context);
        if (businessHoursRules && businessHoursRules.businessHoursOnly && !context.temporal.businessHours) {
            return {
                allowed: false,
                reason: `Operation only allowed during business hours`
            };
        }

        // Check day-of-week restrictions
        if (businessHoursRules && businessHoursRules.allowedDays) {
            if (!businessHoursRules.allowedDays.includes(context.temporal.dayOfWeek)) {
                return {
                    allowed: false,
                    reason: `Operation not allowed on ${context.temporal.dayOfWeek}`
                };
            }
        }

        return { allowed: true };
    }

    async validateSessionContext(context) {
        const agentRules = this.rules.agent[context.agent.id];
        if (!agentRules || !agentRules.constraints) {
            return { allowed: true };
        }

        // Check session limits
        if (agentRules.constraints.maxOperationsPerSession) {
            const totalOps = Object.values(context.session.operations.byType).reduce((sum, count) => sum + count, 0);
            if (totalOps >= agentRules.constraints.maxOperationsPerSession) {
                return {
                    allowed: false,
                    reason: `Session operation limit exceeded`
                };
            }
        }

        // Check resource usage
        if (agentRules.constraints.maxComponentsPerSession && context.session.resources.components) {
            const totalComponents = Object.values(context.session.resources.components).reduce((sum, count) => sum + count, 0);
            if (totalComponents >= agentRules.constraints.maxComponentsPerSession) {
                return {
                    allowed: false,
                    reason: `Session component limit exceeded`
                };
            }
        }

        return { allowed: true };
    }

    async validateSystemContext(context) {
        // Check system load
        if (context.system.load.cpu > 0.9) {
            return {
                allowed: false,
                reason: `System CPU load too high (${context.system.load.cpu}%)`
            };
        }

        if (context.system.load.memory > 0.9) {
            return {
                allowed: false,
                reason: `System memory load too high (${context.system.load.memory}%)`
            };
        }

        // Check system health
        if (context.system.health.overall !== "HEALTHY") {
            return {
                allowed: false,
                reason: `System health is ${context.system.health.overall}`
            };
        }

        // Check for critical alerts
        if (context.system.alerts.critical > 0) {
            return {
                allowed: false,
                reason: `System has ${context.system.alerts.critical} critical alerts`
            };
        }

        return { allowed: true };
    }

    combineValidations(validations) {
        // If any validation fails, deny
        const failed = validations.find(v => !v.allowed);
        if (failed) {
            return {
                allowed: false,
                reason: failed.reason,
                details: validations
            };
        }

        return {
            allowed: true,
            reason: "All context validations passed",
            details: validations
        };
    }

    checkMaintenanceWindow(temporal, maintenanceWindows) {
        const now = new Date(temporal.timestamp);
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
        const currentDay = temporal.dayOfWeek;

        for (const window of maintenanceWindows) {
            if (window.days.includes(currentDay)) {
                const startTime = window.start;
                const endTime = window.end;

                // Handle windows that cross midnight
                if (startTime > endTime) {
                    if (currentTime >= startTime || currentTime <= endTime) {
                        return true;
                    }
                } else {
                    if (currentTime >= startTime && currentTime <= endTime) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
```

### Context Builder

```javascript
class ContextBuilder {
    async buildContext(agentId, operation, providedContext) {
        const systemContext = await this.gatherSystemContext();
        const sessionContext = await this.gatherSessionContext(agentId);
        const environmentContext = await this.gatherEnvironmentContext();
        const temporalContext = this.buildTemporalContext();

        return {
            agent: {
                id: agentId,
                role: await this.getAgentRole(agentId),
                capabilities: await this.getAgentCapabilities(agentId),
                permissions: await this.getAgentPermissions(agentId),
                sessionId: sessionContext.id,
                userId: sessionContext.userId
            },
            operation: {
                type: operation.type,
                category: this.categorizeOperation(operation.type),
                target: operation.target,
                properties: this.analyzeOperationProperties(operation)
            },
            environment: environmentContext,
            temporal: temporalContext,
            session: sessionContext,
            system: systemContext,
            user: providedContext.user || {}
        };
    }

    async gatherSystemContext() {
        return {
            load: {
                cpu: await this.getCpuUsage(),
                memory: await this.getMemoryUsage(),
                disk: await this.getDiskUsage(),
                network: await this.getNetworkUsage()
            },
            health: {
                overall: await this.getOverallHealth(),
                services: await this.getServiceHealth()
            },
            alerts: {
                active: await this.getActiveAlerts(),
                critical: await this.getCriticalAlerts(),
                warnings: await this.getWarningAlerts()
            }
        };
    }

    async gatherSessionContext(agentId) {
        const sessionId = this.getCurrentSessionId(agentId);
        return {
            id: sessionId,
            duration: await this.getSessionDuration(sessionId),
            operations: {
                total: await this.getOperationCount(sessionId),
                byType: await this.getOperationCountByType(sessionId)
            },
            resources: {
                components: await this.getComponentCounts(sessionId),
                memory: await this.getSessionMemoryUsage(sessionId),
                cpu: await this.getSessionCpuUsage(sessionId)
            }
        };
    }

    buildTemporalContext() {
        const now = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        return {
            timestamp: now.toISOString(),
            timezone,
            businessHours: this.isBusinessHours(now),
            dayOfWeek: this.getDayOfWeek(now),
            timeOfDay: this.getTimeOfDay(now),
            seasonality: this.getSeasonality(now)
        };
    }

    isBusinessHours(date) {
        const hour = date.getHours();
        const day = date.getDay();
        return day >= 1 && day <= 5 && hour >= 9 && hour < 17; // Mon-Fri, 9-5
    }

    getDayOfWeek(date) {
        const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        return days[date.getDay()];
    }

    getTimeOfDay(date) {
        const hour = date.getHours();
        if (hour < 6) return "NIGHT";
        if (hour < 12) return "MORNING";
        if (hour < 18) return "AFTERNOON";
        return "EVENING";
    }

    getSeasonality(date) {
        const month = date.getMonth();
        const hour = date.getHours();

        // Simple heuristic based on time of day and day of week
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isWorkHours = hour >= 9 && hour < 17;

        if (isWeekend || !isWorkHours) return "LOW";
        if (hour >= 10 && hour <= 16) return "PEAK";
        return "NORMAL";
    }
}
```

## 📊 Context Validation Rules

### Agent-Specific Rules

#### Agent A Context Rules

```json
{
  "agentContextRules": {
    "A": {
      "allowedContexts": [
        "UI_DEVELOPMENT",
        "UI_SANDBOX",
        "COMPONENT_TESTING"
      ],
      "forbiddenContexts": [
        "BACKEND_OPERATIONS",
        "DATABASE_ADMIN",
        "SYSTEM_ADMIN",
        "PRODUCTION_DEPLOYMENT"
      ],
      "constraints": {
        "maxComponentsPerSession": 100,
        "maxComponentDepth": 10,
        "maxOperationsPerHour": 200,
        "allowedComponentTypes": [
          "Button", "Input", "Container", "Grid", "Text", "Image"
        ],
        "forbiddenOperations": [
          "DELETE_COMPONENT",
          "RESET_LAYOUT",
          "MODIFY_SYSTEM_CONFIG"
        ],
        "sessionTimeout": 3600,
        "requireApprovalFor": [
          "CREATE_COMPONENT.complex",
          "MODIFY_LAYOUT.grid"
        ]
      },
      "environmentRestrictions": {
        "DEVELOPMENT": {
          "allowedOperations": ["*"],
          "maxOperationsPerMinute": 50
        },
        "STAGING": {
          "allowedOperations": ["READ", "CREATE_COMPONENT", "UPDATE_COMPONENT"],
          "maxOperationsPerMinute": 20
        },
        "PRODUCTION": {
          "allowedOperations": ["READ"],
          "maxOperationsPerMinute": 5
        }
      }
    }
  }
}
```

#### Agent B Context Rules

```json
{
  "agentContextRules": {
    "B": {
      "allowedContexts": [
        "DESIGN_DEVELOPMENT",
        "ACCESSIBILITY_VALIDATION",
        "TOKEN_MANAGEMENT"
      ],
      "forbiddenContexts": [
        "UI_OPERATIONS",
        "BACKEND_DEPLOYMENT",
        "USER_DATA_ACCESS"
      ],
      "constraints": {
        "maxTokenChangesPerHour": 20,
        "maxAccessibilityTestsPerMinute": 10,
        "allowedFileTypes": [".json", ".css", ".scss", ".js", ".ts", ".md"],
        "allowedDirectories": ["design/", "tokens/", "styles/", "docs/"],
        "forbiddenFiles": ["*.secret", "*.key", "*.pem", "*.prod"],
        "maxFileSize": "10MB",
        "requireValidationFor": ["token_changes", "accessibility_updates"]
      }
    }
  }
}
```

### Operation Context Rules

```json
{
  "operationContextRules": {
    "CREATE_COMPONENT": {
      "allowedAgents": ["A", "B"],
      "allowedEnvironments": ["DEVELOPMENT", "STAGING"],
      "requiredContexts": ["UI_DEVELOPMENT", "DESIGN_DEVELOPMENT"],
      "constraints": {
        "maxPerSession": 50,
        "maxDepth": 10,
        "validationRequired": true,
        "parentComponentRequired": true,
        "forbiddenTypes": ["SystemRoot", "SecurityManager", "DatabaseConnection"]
      }
    },
    "DELETE_COMPONENT": {
      "allowedAgents": ["A"],
      "allowedEnvironments": ["DEVELOPMENT"],
      "requiredContexts": ["UI_SANDBOX"],
      "constraints": {
        "businessHoursOnly": true,
        "confirmationRequired": true,
        "backupRequired": true,
        "adminApprovalRequired": true,
        "forbiddenTypes": ["*"],
        "allowedTypes": ["Button", "Input", "Text"]
      }
    },
    "POLICY_EVALUATE": {
      "allowedAgents": ["C"],
      "allowedEnvironments": ["*"],
      "requiredContexts": ["POLICY_ENFORCEMENT"],
      "constraints": {
        "maxPerSecond": 100,
        "complexityLimit": "medium",
        "auditRequired": true
      }
    },
    "SEND_MESSAGE": {
      "allowedAgents": ["D"],
      "allowedEnvironments": ["*"],
      "requiredContexts": ["IPC_BRIDGE_DEVELOPMENT", "SYSTEM_TESTING"],
      "constraints": {
        "maxPerSecond": 20,
        "maxMessageSize": "1MB",
        "allowedEndpoints": ["localhost", "127.0.0.1"],
        "encryptionRequired": false
      }
    }
  }
}
```

### Environment Context Rules

```json
{
  "environmentContextRules": {
    "DEVELOPMENT": {
      "generalConstraints": {
        "maxConcurrentAgents": 4,
        "maxSystemLoad": 0.8,
        "allowExperimentalFeatures": true,
        "auditLevel": "MINIMAL"
      },
      "allowedOperations": ["*"],
      "agentRestrictions": {
        "A": { "maxOperationsPerMinute": 50 },
        "B": { "maxOperationsPerMinute": 30 },
        "C": { "maxOperationsPerMinute": 100 },
        "D": { "maxOperationsPerMinute": 40 }
      }
    },
    "STAGING": {
      "generalConstraints": {
        "maxConcurrentAgents": 2,
        "maxSystemLoad": 0.6,
        "allowExperimentalFeatures": false,
        "auditLevel": "STANDARD"
      },
      "allowedOperations": ["READ", "CREATE", "UPDATE"],
      "agentRestrictions": {
        "A": { "maxOperationsPerMinute": 20 },
        "B": { "maxOperationsPerMinute": 15 },
        "C": { "maxOperationsPerMinute": 50 },
        "D": { "maxOperationsPerMinute": 20 }
      },
      "requiredApprovals": {
        "DELETE_COMPONENT": ["TEAM_LEAD"],
        "POLICY_EVALUATE": ["SECURITY"]
      }
    },
    "PRODUCTION": {
      "generalConstraints": {
        "maxConcurrentAgents": 1,
        "maxSystemLoad": 0.4,
        "allowExperimentalFeatures": false,
        "auditLevel": "FULL"
      },
      "allowedOperations": ["READ"],
      "maintenanceWindows": [
        {
          "start": "02:00",
          "end": "04:00",
          "timezone": "UTC",
          "days": ["SUN"]
        }
      ],
      "requiredApprovals": {
        "*": ["SECURITY", "BUSINESS", "OPERATIONS"]
      }
    }
  }
}
```

## 📊 Usage Examples

### Example 1: Agent A Creating Component in Development

```javascript
const context = await contextValidator.validateContext("A", {
    type: "CREATE_COMPONENT",
    target: {
        componentType: "Button",
        parentId: "container_123"
    }
}, {
    environment: "DEVELOPMENT",
    contextType: "UI_DEVELOPMENT"
});

// Result: { allowed: true, reason: "All context validations passed" }
```

### Example 2: Agent A Attempting Delete in Production

```javascript
const context = await contextValidator.validateContext("A", {
    type: "DELETE_COMPONENT",
    target: {
        componentId: "btn_123"
    }
}, {
    environment: "PRODUCTION",
    contextType: "UI_DEVELOPMENT"
});

// Result: {
//   allowed: false,
//   reason: "Operation DELETE_COMPONENT not allowed in PRODUCTION"
// }
```

### Example 3: System Load Protection

```javascript
// Simulate high system load
const context = await contextValidator.validateContext("A", {
    type: "CREATE_COMPONENT"
}, {
    environment: "DEVELOPMENT",
    systemContext: {
        load: { cpu: 0.95, memory: 0.9 }
    }
});

// Result: {
//   allowed: false,
//   reason: "System CPU load too high (95%)"
// }
```

## 🔧 Implementation Considerations

### Performance Optimization

1. **Context Caching**: Cache context data with TTL
2. **Rule Indexing**: Index rules by agent, operation, and environment
3. **Parallel Validation**: Validate dimensions in parallel
4. **Smart Updates**: Only revalidate when relevant context changes

### Security Considerations

1. **Context Isolation**: Prevent agents from manipulating context
2. **Audit Trail**: Log all context validation decisions
3. **Tamper Detection**: Validate integrity of context data
4. **Privilege Escalation**: Prevent unauthorized context changes

### Monitoring & Alerting

1. **Validation Metrics**: Track validation latency and success rates
2. **Context Monitoring**: Monitor system and session context changes
3. **Alert Thresholds**: Alert on unusual context patterns
4. **Compliance Reporting**: Generate reports for audit purposes

## 🚀 Implementation Roadmap

### Phase 1: Core Context Validation
- Context model and builder
- Basic validation engine
- Agent and operation rules

### Phase 2: Advanced Features
- Environment and temporal validation
- System context integration
- Performance optimization

### Phase 3: Security & Monitoring
- Audit logging
- Security hardening
- Monitoring and alerting

### Phase 4: Tooling & Management
- Context validation UI
- Rule management system
- Compliance reporting

---

**Dependencies**: T003 Policy Schema ✅, T007 Policy DSL ✅, T007 Allow-Lists ✅, T007 Rate Limiting ✅
**Database Requirements**: Context storage, validation logs, rule management
**Integration**: All agents (A, B, C, D), system monitoring, environment management