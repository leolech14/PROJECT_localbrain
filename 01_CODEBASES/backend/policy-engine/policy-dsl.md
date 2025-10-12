# Policy DSL (Domain Specific Language) Design

**Purpose**: Human-readable policy definition language for LocalBrain agent governance
**Status**: Design Specification - Ready for Implementation
**Agent**: C (Backend Services Specialist)
**Schema**: Based on T003 Policy Schema

## 📋 Overview

The Policy DSL provides a declarative, human-readable syntax for defining governance policies that control agent behavior, resource access, and system interactions. It translates business rules into executable policy enforcement.

## 🎯 Design Goals

1. **Human Readable**: Policies should be understandable by non-technical stakeholders
2. **Expressive**: Support complex rule combinations and conditions
3. **Composable**: Policies can be combined and extended
4. **Testable**: Policies can be unit tested and validated
5. **Performant**: Efficient evaluation at runtime

## 📝 DSL Syntax

### Basic Structure

```policy
policy "Agent A UI Constraints" {
    version = "1.0.0"
    priority = 100
    enabled = true

    scope {
        agents = ["A"]
        contexts = ["UI"]
        components = ["Button", "Input", "Grid"]
    }

    rules {
        # Allow-list specific UI operations
        allow_ui_operations {
            type = ALLOW_LIST
            operations = [
                "CREATE_COMPONENT",
                "UPDATE_COMPONENT",
                "MOVE_COMPONENT",
                "RESIZE_COMPONENT"
            ]

            conditions {
                component_types = ["Button", "Input", "Container", "Grid"]
                max_components_per_session = 50
            }

            action {
                allow = ["Button", "Input", "Container", "Grid"]
                block = true
            }
        }

        # Rate limiting for component creation
        component_creation_rate_limit {
            type = RATE_LIMIT
            operations = ["CREATE_COMPONENT"]

            conditions {
                agent = "A"
                time_window = "60s"
            }

            action {
                max_requests = 10
                time_window = 60
                strategy = "SLIDING_WINDOW"
            }

            consequences {
                action = "WARN"
                message = "Component creation rate limit exceeded"
                escalation {
                    to = "AGENT_E"
                    threshold = 3
                    time_window = 300
                }
            }
        }

        # Resource usage limits
        memory_usage_limit {
            type = RESOURCE_LIMIT
            operations = ["ALL"]

            action {
                resource = "memory"
                limit = 512
                unit = "MB"
            }

            consequences {
                action = "BLOCK"
                message = "Memory usage limit exceeded"
            }
        }

        # Time-based access control
        business_hours_only {
            type = TIME_WINDOW
            operations = ["DELETE_COMPONENT", "CHANGE_PROPERTY"]

            action {
                start = "09:00"
                end = "17:00"
                timezone = "UTC"
                days = ["MON", "TUE", "WED", "THU", "FRI"]
            }

            consequences {
                action = "BLOCK"
                message = "Destructive operations only allowed during business hours"
            }
        }

        # Schema validation for UI props
        ui_props_validation {
            type = SCHEMA_VALIDATION
            operations = ["CHANGE_PROPERTY", "CREATE_COMPONENT"]

            action {
                schema = "ui-props.schema.json"
                strict = true
            }

            consequences {
                action = "BLOCK"
                message = "UI properties must conform to schema"
            }
        }
    }
}
```

### Language Elements

#### Policy Declaration
```policy
policy "Policy Name" {
    # Required metadata
    version = "semantic.version"
    priority = 0-1000
    enabled = true|false

    # Optional metadata
    description = "Human readable description"
    tags = ["tag1", "tag2"]

    # Scope definition
    scope { ... }

    # Rules definition
    rules { ... }
}
```

#### Scope Definition
```policy
scope {
    # Agent targeting (empty = all agents)
    agents = ["A", "B", "C", "D"]

    # Context areas
    contexts = ["UI", "BACKEND", "INTEGRATION", "ALL"]

    # Component targeting (empty = all components)
    components = ["Button", "Input", "Grid"]

    # Custom conditions
    custom {
        environment = "production"
        feature_flags = ["new_ui_system"]
    }
}
```

#### Rule Definition
```policy
rule_name {
    type = ALLOW_LIST|DENY_LIST|RATE_LIMIT|SCHEMA_VALIDATION|
           PERMISSION_CHECK|RESOURCE_LIMIT|TIME_WINDOW|
           CONTEXT_VALIDATION

    # Conditions that trigger this rule
    conditions {
        operations = ["OPERATION_TYPE", ...]
        agent = "A"
        component = "Button"
        property = "color"

        # Custom expression language
        custom = "agent.role == 'ui_specialist' AND context.environment == 'development'"
    }

    # Actions to take
    actions {
        # Allow/Deny lists
        allow = ["item1", "item2"]
        deny = ["forbidden_item"]

        # Rate limiting
        max_requests = 100
        time_window = 60
        strategy = "SLIDING_WINDOW"

        # Resource limits
        resource = "memory"
        limit = 512
        unit = "MB"

        # Time windows
        start = "09:00"
        end = "17:00"
        timezone = "UTC"
        days = ["MON", "TUE", "WED", "THU", "FRI"]

        # Schema validation
        schema = "path/to/schema.json"
        strict = true
    }

    # Consequences of violations
    consequences {
        action = "BLOCK"|"WARN"|"LOG"|"ESCALATE"|"QUARANTINE"
        message = "Human readable message"

        escalation {
            to = "AGENT_E"|"AGENT_F"|"USER"|"SYSTEM"
            threshold = 3
            time_window = 300
        }
    }
}
```

### Expression Language

For complex conditions, the DSL supports an expression language:

```policy
conditions {
    # Basic comparisons
    custom = "agent.id == 'A' AND operation.type == 'CREATE_COMPONENT'"

    # String operations
    custom = "component.type startsWith 'Button' AND context.environment in ['prod', 'staging']"

    # Numeric operations
    custom = "resource.memory_usage > 0.8 AND resource.cpu_usage < 0.9"

    # Time operations
    custom = "timestamp.hour >= 9 AND timestamp.hour <= 17"

    # List operations
    custom = "operation.type in ['CREATE', 'UPDATE'] AND agent.permissions contains 'ui_edit'"

    # Nested conditions
    custom = """
        (agent.id == 'A' AND context.area == 'UI') OR
        (agent.id == 'C' AND context.area == 'BACKEND')
    """
}
```

### Built-in Functions

```policy
conditions {
    # Agent capabilities
    custom = "has_capability(agent, 'ui_design')"

    # Resource checks
    custom = "resource_usage(agent, 'memory') < 0.8"

    # Time functions
    custom = "is_business_hours(timestamp, 'UTC')"

    # Session checks
    custom = "session_duration(agent) < 3600"

    # History checks
    custom = "operation_count(agent, 'CREATE_COMPONENT', timeframe='1h') < 20"
}
```

## 🔧 Implementation Architecture

### Parser Pipeline

1. **Lexical Analysis**: Tokenize DSL text into tokens
2. **Syntax Parsing**: Build Abstract Syntax Tree (AST)
3. **Semantic Analysis**: Validate rules and references
4. **Code Generation**: Convert AST to executable policy objects

### Evaluation Engine

```javascript
class PolicyEngine {
    // Parse DSL into executable policy
    parse(dslText) -> PolicyObject

    // Evaluate policy against context
    evaluate(policy, context) -> Decision

    // Batch evaluation for performance
    evaluateBatch(policies, contexts) -> Decisions[]
}

class Decision {
    allowed: boolean
    reason: string
    consequences: Consequence[]
    metadata: object
}
```

### Caching Strategy

- **Policy Cache**: Cache compiled policies (TTL: 1 hour)
- **Decision Cache**: Cache decisions for identical contexts (TTL: 5 minutes)
- **Expression Cache**: Cache evaluated expressions (TTL: 10 minutes)

## 📊 Example Policies

### Agent A UI Restrictions
```policy
policy "Agent A UI Sandbox" {
    version = "1.0.0"
    priority = 200
    enabled = true

    scope {
        agents = ["A"]
        contexts = ["UI"]
    }

    rules {
        # Restrict destructive operations
        safe_ui_only {
            type = DENY_LIST
            operations = ["DELETE_COMPONENT", "RESET_LAYOUT"]

            action {
                deny = ["DELETE_COMPONENT", "RESET_LAYOUT"]
            }

            consequences {
                action = "BLOCK"
                message = "Destructive operations not allowed in sandbox"
            }
        }

        # Component count limit
        component_limit {
            type = RESOURCE_LIMIT
            operations = ["CREATE_COMPONENT"]

            action {
                resource = "component_count"
                limit = 20
                unit = "count"
            }

            consequences {
                action = "WARN"
                message = "Approaching component limit"
            }
        }
    }
}
```

### Agent C Backend Security
```policy
policy "Agent C Database Access" {
    version = "1.0.0"
    priority = 500
    enabled = true

    scope {
        agents = ["C"]
        contexts = ["BACKEND"]
        components = ["database", "api"]
    }

    rules {
        # Database write restrictions
        db_write_protection {
            type = PERMISSION_CHECK
            operations = ["DATABASE_WRITE"]

            conditions {
                custom = "has_permission(agent, 'db_write') AND context.environment == 'production'"
            }

            consequences {
                action = "BLOCK"
                message = "Database write access requires explicit permission"
                escalation {
                    to = "AGENT_E"
                    threshold = 1
                    time_window = 0
                }
            }
        }

        # API rate limiting
        api_rate_limit {
            type = RATE_LIMIT
            operations = ["API_CALL"]

            action {
                max_requests = 1000
                time_window = 3600
                strategy = "SLIDING_WINDOW"
            }

            consequences {
                action = "ESCALATE"
                message = "API rate limit exceeded"
            }
        }
    }
}
```

### Cross-Agent Coordination
```policy
policy "Agent Handoff Validation" {
    version = "1.0.0"
    priority = 300
    enabled = true

    scope {
        agents = ["A", "B", "C", "D"]
        contexts = ["ALL"]
    }

    rules {
        handoff_validation {
            type = CONTEXT_VALIDATION
            operations = ["HANDOFF"]

            conditions {
                custom = """
                    validate_handoff(
                        from_agent = agent.id,
                        to_agent = context.target_agent,
                        task_type = context.task_type,
                        state = context.task_state
                    )
                """
            }

            consequences {
                action = "BLOCK"
                message = "Handoff validation failed"
            }
        }
    }
}
```

## 🧪 Testing Framework

### Unit Tests
```javascript
describe("Policy DSL", () => {
    test("should parse simple allow-list policy", () => {
        const dsl = `
            policy "Test Policy" {
                version = "1.0.0"
                scope { agents = ["A"] }
                rules {
                    allow_ui {
                        type = ALLOW_LIST
                        action { allow = ["Button", "Input"] }
                    }
                }
            }
        `;

        const policy = engine.parse(dsl);
        expect(policy.rules[0].type).toBe("ALLOW_LIST");
        expect(policy.rules[0].action.allow).toEqual(["Button", "Input"]);
    });

    test("should evaluate rate limit correctly", () => {
        const context = {
            agentId: "A",
            operation: "CREATE_COMPONENT",
            timestamp: new Date()
        };

        const decision = engine.evaluate(rateLimitPolicy, context);
        expect(decision.allowed).toBe(true);
    });
});
```

### Integration Tests
```javascript
describe("Policy Integration", () => {
    test("should block agent A from deleting components", async () => {
        const result = await agentA.performOperation({
            type: "DELETE_COMPONENT",
            componentId: "btn_123"
        });

        expect(result.success).toBe(false);
        expect(result.reason).toContain("not allowed in sandbox");
    });
});
```

## 📈 Performance Considerations

### Optimization Strategies

1. **Policy Precompilation**: Compile DSL to optimized bytecode
2. **Decision Caching**: Cache decisions with smart invalidation
3. **Rule Indexing**: Index rules by operation type for fast lookup
4. **Parallel Evaluation**: Evaluate independent rules in parallel
5. **Lazy Loading**: Load policies on-demand with caching

### Monitoring Metrics

- Policy evaluation latency (target: <50ms p95)
- Cache hit rates (target: >90%)
- Rule match distribution
- Decision outcome statistics
- Error rates and types

## 🚀 Implementation Roadmap

### Phase 1: Core DSL Parser
- Lexical analyzer and tokenizer
- AST builder and validator
- Basic policy object model

### Phase 2: Evaluation Engine
- Rule matching engine
- Expression evaluator
- Decision builder

### Phase 3: Advanced Features
- Caching layer
- Performance optimization
- Monitoring and metrics

### Phase 4: Tooling
- DSL linter and formatter
- Policy validation tools
- Testing framework

---

**Dependencies**: T003 Policy Schema ✅
**Database Requirements**: Policy storage, rule caching, decision logging
**Integration**: Agent D (IPC contracts), Agent E (Coordination), T010 (Ledger)