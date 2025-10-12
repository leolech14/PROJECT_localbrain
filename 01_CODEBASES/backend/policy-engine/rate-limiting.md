# Velocity/Frequency Control System Design

**Purpose**: Advanced rate limiting and velocity control for agent operations
**Status**: Design Specification - Ready for Implementation
**Agent**: C (Backend Services Specialist)
**Priority**: P0 - Critical for System Stability and Safety

## 📋 Overview

The velocity/frequency control system prevents agent overload, ensures fair resource allocation, and protects against accidental or malicious rapid operations. It implements sophisticated rate limiting algorithms with configurable policies and real-time monitoring.

## 🎯 Design Goals

1. **Multi-Dimensional**: Rate limit by agent, operation, resource, and context
2. **Adaptive**: Dynamic adjustment based on system load and performance
3. **Granular**: Support for multiple rate limiting strategies
4. **Performant**: <1ms evaluation time for rate limit checks
5. **Observable**: Comprehensive metrics and alerting

## 🏗️ Rate Limiting Architecture

### Core Components

```javascript
class RateLimitEngine {
    constructor(redis, config) {
        this.redis = redis;
        this.config = config;
        this.strategies = new Map();
        this.metrics = new RateLimitMetrics();
        this.alerts = new AlertManager();
    }

    // Primary rate limit check
    async checkRateLimit(identifier, operation, context) {
        const startTime = performance.now();

        try {
            const policies = await this.getPolicies(identifier, operation, context);
            const decisions = await Promise.all(
                policies.map(policy => this.evaluatePolicy(policy, identifier, operation, context))
            );

            const decision = this.combineDecisions(decisions);
            const latency = performance.now() - startTime;

            this.metrics.recordCheck(identifier, operation, decision, latency);

            return decision;
        } catch (error) {
            this.metrics.recordError(identifier, operation, error);
            throw error;
        }
    }

    // Evaluate single rate limit policy
    async evaluatePolicy(policy, identifier, operation, context) {
        const strategy = this.strategies.get(policy.strategy);
        if (!strategy) {
            throw new Error(`Unknown rate limit strategy: ${policy.strategy}`);
        }

        const key = this.buildKey(identifier, operation, policy);
        const result = await strategy.check(key, policy, context);

        return {
            policyId: policy.id,
            allowed: result.allowed,
            remaining: result.remaining,
            resetTime: result.resetTime,
            reason: result.reason
        };
    }
}
```

### Rate Limiting Strategies

#### 1. Sliding Window Algorithm

```javascript
class SlidingWindowStrategy {
    async check(key, policy, context) {
        const now = Date.now();
        const windowStart = now - policy.timeWindow * 1000;

        // Remove expired entries
        await this.redis.zremrangebyscore(key, 0, windowStart);

        // Count current requests in window
        const currentCount = await this.redis.zcard(key);

        if (currentCount >= policy.maxRequests) {
            const oldestRequest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
            const resetTime = oldestRequest.length > 0 ?
                parseInt(oldestRequest[0][1]) + policy.timeWindow * 1000 :
                now + policy.timeWindow * 1000;

            return {
                allowed: false,
                remaining: 0,
                resetTime,
                reason: `Sliding window limit ${policy.maxRequests}/${policy.timeWindow}s exceeded`
            };
        }

        // Add current request
        await this.redis.zadd(key, now, this.generateRequestId());
        await this.redis.expire(key, policy.timeWindow + 1);

        return {
            allowed: true,
            remaining: policy.maxRequests - currentCount - 1,
            resetTime: now + policy.timeWindow * 1000
        };
    }
}
```

#### 2. Token Bucket Algorithm

```javascript
class TokenBucketStrategy {
    async check(key, policy, context) {
        const now = Date.now();
        const bucket = await this.getBucket(key, policy);

        // Add tokens based on refill rate
        const timePassed = (now - bucket.lastRefill) / 1000;
        const tokensToAdd = timePassed * policy.refillRate;
        bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);
        bucket.lastRefill = now;

        if (bucket.tokens < 1) {
            const timeToRefill = (1 - bucket.tokens) / policy.refillRate;
            return {
                allowed: false,
                remaining: 0,
                resetTime: now + timeToRefill * 1000,
                reason: `Token bucket exhausted, ${timeToRefill.toFixed(2)}s to refill`
            };
        }

        bucket.tokens -= 1;
        await this.saveBucket(key, bucket);

        return {
            allowed: true,
            remaining: Math.floor(bucket.tokens),
            resetTime: now + (bucket.capacity - bucket.tokens) / policy.refillRate * 1000
        };
    }

    async getBucket(key, policy) {
        const bucket = await this.redis.hgetall(key);

        if (!bucket.tokens) {
            return {
                tokens: policy.capacity,
                capacity: policy.capacity,
                refillRate: policy.refillRate,
                lastRefill: Date.now()
            };
        }

        return {
            tokens: parseFloat(bucket.tokens),
            capacity: parseFloat(bucket.capacity),
            refillRate: parseFloat(bucket.refillRate),
            lastRefill: parseInt(bucket.lastRefill)
        };
    }
}
```

#### 3. Fixed Window Algorithm

```javascript
class FixedWindowStrategy {
    async check(key, policy, context) {
        const now = Date.now();
        const windowStart = Math.floor(now / (policy.timeWindow * 1000)) * policy.timeWindow * 1000;
        const windowKey = `${key}:${windowStart}`;

        const currentCount = await this.redis.incr(windowKey);
        await this.redis.expire(windowKey, policy.timeWindow + 1);

        if (currentCount > policy.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: windowStart + (policy.timeWindow + 1) * 1000,
                reason: `Fixed window limit ${policy.maxRequests}/${policy.timeWindow}s exceeded`
            };
        }

        return {
            allowed: true,
            remaining: policy.maxRequests - currentCount,
            resetTime: windowStart + policy.timeWindow * 1000
        };
    }
}
```

## 📊 Rate Limit Policies

### Agent-Specific Policies

#### Agent A (UI Velocity Specialist)

```json
{
  "rateLimitPolicies": {
    "agentA": {
      "agentId": "A",
      "policies": [
        {
          "id": "ui-component-creation",
          "name": "UI Component Creation Rate Limit",
          "strategy": "SLIDING_WINDOW",
          "operations": ["CREATE_COMPONENT"],
          "maxRequests": 50,
          "timeWindow": 60,
          "burstAllowance": 10,
          "conditions": {
            "contexts": ["UI_DEVELOPMENT", "UI_SANDBOX"],
            "componentTypes": ["*"],
            "maxComponentComplexity": "medium"
          },
          "consequences": {
            "action": "WARN",
            "message": "UI component creation rate limit approaching",
            "escalation": {
              "to": "AGENT_E",
              "threshold": 3,
              "timeWindow": 300
            }
          }
        },
        {
          "id": "ui-property-changes",
          "name": "UI Property Changes Rate Limit",
          "strategy": "TOKEN_BUCKET",
          "operations": ["CHANGE_PROPERTY"],
          "capacity": 100,
          "refillRate": 10,
          "conditions": {
            "contexts": ["UI_DEVELOPMENT"],
            "sensitiveProperties": ["id", "type", "parentId"]
          },
          "consequences": {
            "action": "BLOCK",
            "message": "UI property changes rate limit exceeded"
          }
        },
        {
          "id": "layout-operations",
          "name": "Layout Operations Rate Limit",
          "strategy": "SLIDING_WINDOW",
          "operations": ["MOVE_COMPONENT", "RESIZE_COMPONENT", "REORDER_CHILDREN"],
          "maxRequests": 30,
          "timeWindow": 60,
          "conditions": {
            "contexts": ["UI_DEVELOPMENT"],
            "gridOperations": true
          },
          "consequences": {
            "action": "WARN",
            "message": "Layout operations rate limit exceeded"
          }
        }
      ]
    }
  }
}
```

#### Agent B (Design System Specialist)

```json
{
  "rateLimitPolicies": {
    "agentB": {
      "agentId": "B",
      "policies": [
        {
          "id": "design-token-updates",
          "name": "Design Token Updates Rate Limit",
          "strategy": "TOKEN_BUCKET",
          "operations": ["CHANGE_PROPERTY", "FILE_WRITE"],
          "capacity": 20,
          "refillRate": 2,
          "conditions": {
            "contexts": ["DESIGN_DEVELOPMENT"],
            "fileTypes": [".json", ".css", ".scss"],
            "paths": ["tokens/", "styles/"]
          },
          "consequences": {
            "action": "BLOCK",
            "message": "Design token updates rate limit exceeded",
            "escalation": {
              "to": "AGENT_E",
              "threshold": 1,
              "timeWindow": 0
            }
          }
        },
        {
          "id": "accessibility-checks",
          "name": "Accessibility Checks Rate Limit",
          "strategy": "SLIDING_WINDOW",
          "operations": ["ACCESSIBILITY_CHECK"],
          "maxRequests": 100,
          "timeWindow": 60,
          "conditions": {
            "contexts": ["ACCESSIBILITY_VALIDATION"]
          },
          "consequences": {
            "action": "WARN",
            "message": "Accessibility checks rate limit exceeded"
          }
        }
      ]
    }
  }
}
```

#### Agent C (Backend Services Specialist)

```json
{
  "rateLimitPolicies": {
    "agentC": {
      "agentId": "C",
      "policies": [
        {
          "id": "policy-evaluations",
          "name": "Policy Evaluations Rate Limit",
          "strategy": "TOKEN_BUCKET",
          "operations": ["POLICY_EVALUATE"],
          "capacity": 1000,
          "refillRate": 100,
          "conditions": {
            "contexts": ["POLICY_ENFORCEMENT"],
            "complexity": ["simple", "medium"]
          },
          "consequences": {
            "action": "LOG",
            "message": "Policy evaluation rate limit exceeded"
          }
        },
        {
          "id": "schema-validations",
          "name": "Schema Validations Rate Limit",
          "strategy": "SLIDING_WINDOW",
          "operations": ["SCHEMA_VALIDATE"],
          "maxRequests": 500,
          "timeWindow": 60,
          "conditions": {
            "contexts": ["SCHEMA_MANAGEMENT"],
            "schemaSizes": ["small", "medium"]
          },
          "consequences": {
            "action": "WARN",
            "message": "Schema validation rate limit exceeded"
          }
        }
      ]
    }
  }
}
```

#### Agent D (Integration Specialist)

```json
{
  "rateLimitPolicies": {
    "agentD": {
      "agentId": "D",
      "policies": [
        {
          "id": "ipc-messages",
          "name": "IPC Messages Rate Limit",
          "strategy": "TOKEN_BUCKET",
          "operations": ["SEND_MESSAGE", "RECEIVE_MESSAGE"],
          "capacity": 200,
          "refillRate": 20,
          "conditions": {
            "contexts": ["IPC_BRIDGE_DEVELOPMENT", "SYSTEM_TESTING"],
            "messageTypes": ["UI_INTENT", "ACK", "ERROR", "HEARTBEAT"],
            "messageSizes": ["small", "medium"]
          },
          "consequences": {
            "action": "BLOCK",
            "message": "IPC message rate limit exceeded"
          }
        },
        {
          "id": "process-execution",
          "name": "Process Execution Rate Limit",
          "strategy": "FIXED_WINDOW",
          "operations": ["PROCESS_EXECUTE"],
          "maxRequests": 10,
          "timeWindow": 60,
          "conditions": {
            "contexts": ["SYSTEM_TESTING"],
            "processTypes": ["test", "build"]
          },
          "consequences": {
            "action": "BLOCK",
            "message": "Process execution rate limit exceeded"
          }
        }
      ]
    }
  }
}
```

### Global System Policies

```json
{
  "globalPolicies": [
    {
      "id": "system-wide-protection",
      "name": "System Wide Protection",
      "strategy": "SLIDING_WINDOW",
      "operations": ["*"],
      "maxRequests": 10000,
      "timeWindow": 60,
      "conditions": {
        "agents": ["*"],
        "contexts": ["*"]
      },
      "consequences": {
        "action": "BLOCK",
        "message": "System wide rate limit exceeded",
        "escalation": {
          "to": "AGENT_F",
          "threshold": 1,
          "timeWindow": 0
        }
      }
    },
    {
      "id": "emergency-throttle",
      "name": "Emergency Throttle",
      "strategy": "TOKEN_BUCKET",
      "operations": ["*"],
      "capacity": 100,
      "refillRate": 10,
      "conditions": {
        "systemLoad": "high",
        "emergency": true
      },
      "consequences": {
        "action": "BLOCK",
        "message": "Emergency throttling active"
      }
    }
  ]
}
```

## 🔧 Implementation Details

### Key Building

```javascript
class KeyBuilder {
    buildKey(identifier, operation, policy) {
        const parts = [
            'ratelimit',
            identifier.agentId || 'global',
            identifier.sessionId || 'nosession',
            operation,
            policy.id
        ];

        if (identifier.context) {
            parts.push(identifier.context);
        }

        if (identifier.resource) {
            parts.push(identifier.resource);
        }

        return parts.join(':');
    }
}

// Example keys:
// ratelimit:A:session123:CREATE_COMPONENT:ui-component-creation:UI_DEVELOPMENT
// ratelimit:C:nosession:POLICY_EVALUATE:policy-evaluations:POLICY_ENFORCEMENT
// ratelimit:global:nosession:*:system-wide-protection:ALL
```

### Policy Evaluation

```javascript
class PolicyEvaluator {
    async getPolicies(identifier, operation, context) {
        const policies = [];

        // Add agent-specific policies
        const agentPolicies = await this.getAgentPolicies(identifier.agentId);
        policies.push(...agentPolicies.filter(p => this.matchesOperation(p, operation)));

        // Add global policies
        const globalPolicies = await this.getGlobalPolicies();
        policies.push(...globalPolicies.filter(p => this.matchesOperation(p, operation)));

        // Filter by conditions
        return policies.filter(p => this.matchesConditions(p, context));
    }

    matchesConditions(policy, context) {
        const conditions = policy.conditions || {};

        // Check context match
        if (conditions.contexts && !conditions.contexts.includes(context.contextType)) {
            return false;
        }

        // Check agent match
        if (conditions.agents && !conditions.agents.includes('*') &&
            !conditions.agents.includes(context.agentId)) {
            return false;
        }

        // Check system conditions
        if (conditions.systemLoad && this.getSystemLoad() !== conditions.systemLoad) {
            return false;
        }

        return true;
    }

    combineDecisions(decisions) {
        // If any policy denies, deny
        const denied = decisions.find(d => !d.allowed);
        if (denied) {
            return {
                allowed: false,
                reason: denied.reason,
                policyId: denied.policyId,
                remaining: 0,
                resetTime: denied.resetTime
            };
        }

        // Find the most restrictive remaining count
        const minRemaining = Math.min(...decisions.map(d => d.remaining));
        const latestReset = Math.max(...decisions.map(d => d.resetTime));

        return {
            allowed: true,
            reason: "All rate limit policies passed",
            policyIds: decisions.map(d => d.policyId),
            remaining: minRemaining,
            resetTime: latestReset
        };
    }
}
```

### Metrics and Monitoring

```javascript
class RateLimitMetrics {
    constructor() {
        this.counters = new Map();
        this.histograms = new Map();
        this.alerts = new AlertManager();
    }

    recordCheck(identifier, operation, decision, latency) {
        // Update counters
        this.incrementCounter(`ratelimit.checks.total`, { agent: identifier.agentId, operation });
        this.incrementCounter(`ratelimit.checks.${decision.allowed ? 'allowed' : 'blocked'}`,
                              { agent: identifier.agentId, operation });

        // Update latency histogram
        this.recordHistogram('ratelimit.check.latency', latency, { agent: identifier.agentId });

        // Check for alerts
        this.checkAlerts(identifier, operation, decision);
    }

    checkAlerts(identifier, operation, decision) {
        const blockRate = this.getBlockRate(identifier.agentId, operation);
        if (blockRate > 0.1) { // 10% block rate threshold
            this.alerts.trigger({
                type: 'HIGH_BLOCK_RATE',
                agentId: identifier.agentId,
                operation,
                blockRate,
                timestamp: new Date()
            });
        }

        if (!decision.allowed && decision.policyId) {
            this.alerts.trigger({
                type: 'RATE_LIMIT_VIOLATION',
                agentId: identifier.agentId,
                operation,
                policyId: decision.policyId,
                reason: decision.reason,
                timestamp: new Date()
            });
        }
    }

    getMetrics() {
        return {
            totalChecks: this.getCounter('ratelimit.checks.total'),
            allowedChecks: this.getCounter('ratelimit.checks.allowed'),
            blockedChecks: this.getCounter('ratelimit.checks.blocked'),
            averageLatency: this.getHistogram('ratelimit.check.latency').average,
            p95Latency: this.getHistogram('ratelimit.check.latency').p95,
            activeAlerts: this.alerts.getActiveAlerts()
        };
    }
}
```

## 📊 Usage Examples

### Example 1: Agent A Creating Components

```javascript
const identifier = {
    agentId: "A",
    sessionId: "session123"
};

const operation = "CREATE_COMPONENT";
const context = {
    contextType: "UI_DEVELOPMENT",
    componentType: "Button"
};

const decision = await rateLimitEngine.checkRateLimit(identifier, operation, context);
// Result: { allowed: true, remaining: 49, resetTime: 1672531200000 }
```

### Example 2: Rate Limit Exceeded

```javascript
// After 50 component creations in 60 seconds
const decision = await rateLimitEngine.checkRateLimit(identifier, operation, context);
// Result: {
//   allowed: false,
//   remaining: 0,
//   resetTime: 1672531260000,
//   reason: "Sliding window limit 50/60s exceeded"
// }
```

### Example 3: Multiple Policy Evaluation

```javascript
// Operation matches multiple policies
const decision = await rateLimitEngine.checkRateLimit(identifier, "CHANGE_PROPERTY", context);
// Result combines all applicable policies, using most restrictive limits
```

## 🚨 Emergency Controls

### System-Wide Kill Switch

```javascript
class EmergencyControls {
    async enableEmergencyThrottle(reason) {
        const emergencyPolicy = {
            id: "emergency-throttle",
            enabled: true,
            reason,
            enabledAt: new Date(),
            enabledBy: "system"
        };

        await this.redis.set('emergency:throttle', JSON.stringify(emergencyPolicy));
        this.alerts.trigger({
            type: 'EMERGENCY_THROTTLE_ENABLED',
            reason,
            timestamp: new Date()
        });
    }

    async disableEmergencyThrottle() {
        await this.redis.del('emergency:throttle');
        this.alerts.trigger({
            type: 'EMERGENCY_THROTTLE_DISABLED',
            timestamp: new Date()
        });
    }

    async isEmergencyThrottleActive() {
        const policy = await this.redis.get('emergency:throttle');
        return policy ? JSON.parse(policy) : null;
    }
}
```

### Adaptive Rate Limiting

```javascript
class AdaptiveRateLimiting {
    async adjustPoliciesBasedOnLoad() {
        const systemLoad = await this.getSystemLoad();

        if (systemLoad > 0.8) {
            // Reduce rate limits by 50% under high load
            await this.scaleAllPolicies(0.5, "High system load detected");
        } else if (systemLoad < 0.3) {
            // Increase rate limits by 25% under low load
            await this.scaleAllPolicies(1.25, "Low system load detected");
        }
    }

    async scaleAllPolicies(factor, reason) {
        const policies = await this.getAllPolicies();

        for (const policy of policies) {
            policy.maxRequests = Math.floor(policy.maxRequests * factor);
            if (policy.capacity) {
                policy.capacity = Math.floor(policy.capacity * factor);
            }
            if (policy.refillRate) {
                policy.refillRate = Math.floor(policy.refillRate * factor);
            }
        }

        await this.saveUpdatedPolicies(policies);
        this.auditLog.log({
            type: "ADAPTIVE_SCALING",
            factor,
            reason,
            timestamp: new Date()
        });
    }
}
```

## 🔧 Configuration Management

```javascript
const rateLimitConfig = {
    // Redis configuration
    redis: {
        host: 'localhost',
        port: 6379,
        db: 0,
        keyPrefix: 'localbrain:ratelimit:',
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3
    },

    // Default strategy configuration
    defaultStrategy: 'SLIDING_WINDOW',

    // Performance settings
    cache: {
        policyCacheSize: 1000,
        decisionCacheSize: 10000,
        cacheTTL: 300 // 5 minutes
    },

    // Monitoring
    metrics: {
        enabled: true,
        interval: 10000, // 10 seconds
        retention: 86400 // 24 hours
    },

    // Alerts
    alerts: {
        enabled: true,
        channels: ['log', 'webhook'],
        thresholds: {
            blockRate: 0.1, // 10%
            errorRate: 0.05, // 5%
            latency: 100 // 100ms
        }
    },

    // Emergency controls
    emergency: {
        autoThrottle: true,
        loadThreshold: 0.9,
        throttleFactor: 0.1 // Reduce to 10% under emergency
    }
};
```

## 🚀 Implementation Roadmap

### Phase 1: Core Rate Limiting
- Basic rate limiting strategies (sliding window, token bucket)
- Redis-based storage
- Policy evaluation engine

### Phase 2: Advanced Features
- Multi-dimensional rate limiting
- Adaptive rate limiting
- Emergency controls

### Phase 3: Monitoring & Observability
- Comprehensive metrics
- Alerting system
- Performance optimization

### Phase 4: Tooling & Management
- Policy management UI
- Real-time monitoring dashboard
- Automated policy tuning

---

**Dependencies**: T003 Policy Schema ✅, T007 Policy DSL ✅, T007 Allow-Lists ✅
**Database Requirements**: Redis for rate limit storage, policy storage, metrics storage
**Integration**: All agents (A, B, C, D), T015 (Kill-Switch), monitoring systems