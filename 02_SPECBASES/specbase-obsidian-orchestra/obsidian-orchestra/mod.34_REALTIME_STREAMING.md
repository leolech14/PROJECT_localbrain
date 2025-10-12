---
# ===== MODULE IDENTITY =====
title: "Real-Time Streaming - WebSocket/SSE"
module_id: "realtime_streaming"
type: "default"
category: "default"

# ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "dev"
state: "minimal"
seat: "mvp"

# ===== AVAILABILITY AND ACCESS =====
phase_availability: "post_onboarding"
priority: "high"
agent_accessible: false
user_configurable: true

# ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "WebSocket connections stable"
    - "Basic real-time updates working"
    - "Fallback mechanisms operational"
  to_intermediate_i2:
    - "Connection pooling optimized"
    - "Presence detection active"
    - "Reconnection logic robust"
  to_intermediate_i3:
    - "Advanced streaming features complete"
    - "Performance at scale validated"
    - "Complete monitoring operational"
  to_complete:
    - "Production deployment validated"
    - "All real-time features working"
    - "Performance SLA met"

# ===== OBSERVABILITY =====
observability:
  metrics:
    - "realtime_streaming.active_connections"
    - "realtime_streaming.message_latency_ms"
    - "realtime_streaming.reconnection_rate"
  alerts:
    - "realtime_streaming.connection_drop_high"
    - "realtime_streaming.latency_degraded"
  dashboards:
    - "realtime_streaming_health"
    - "realtime_streaming_performance"

# ===== SECURITY REQUIREMENTS =====
security:
  authentication_required: true
  authorization_level: "user"
  data_classification: "confidential"
  encryption_at_rest: false
  encryption_in_transit: true
  audit_logging: false
  rate_limiting: true
  input_validation: "strict"

# ===== TECHNICAL METADATA =====
dependencies: ["websocket", "redis"]
integrations: ["socket.io", "redis_pubsub"]
api_contracts: ["/ws", "/events"]
last_updated: "2025-10-01"
version: "1.0.0"
maintainer: "Orchestra.blue Team"

# ===== AGENTIC INTEGRATION =====
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: false
  requires_approval: false

agent_boundaries:
  allowed_operations: ["subscribe_to_updates"]
  forbidden_operations: ["broadcast_events", "disconnect_users"]
  escalation_triggers: ["excessive_subscriptions"]
---

# 34 Real-Time Streaming - WebSocket/SSE

## Purpose

Real-Time Streaming provides live data updates to the UI eliminating polling, enabling instant dashboard updates when transactions occur, agent actions complete, or financial data changes.

## Primary Features

- **WebSocket Connections:** Persistent bidirectional communication
- **Server-Sent Events (SSE):** Fallback for restrictive networks
- **Entity-Scoped Subscriptions:** Subscribe only to own entity's updates
- **Connection Health Monitoring:** Auto-reconnect with exponential backoff
- **Message Queueing:** Offline message buffering and replay

## Architecture

### Real-Time Flow

```
Frontend ←→ WebSocket Server ←→ Redis Pub/Sub ←→ Backend Services
    ↓              ↓                    ↓                ↓
Subscriptions  Connection Pool    Event Topics    Event Publishers
Per Entity     Load Balanced      Per Entity      (Data Pool, Agents)
```

### Core Components

1. **WebSocket Server**
   - Socket.IO server with Redis adapter
   - Connection authentication via JWT
   - Entity-scoped room management
   - Heartbeat/ping-pong for health

2. **Subscription Manager**
   - Per-user subscription registry
   - Entity-level event filtering
   - Topic-based routing
   - Subscription lifecycle management

3. **Connection Pool Manager**
   - Load balancing across server instances
   - Connection state synchronization (Redis)
   - Graceful failover
   - Connection limit enforcement

4. **Message Queue**
   - Offline message buffering (Redis)
   - Message replay on reconnection
   - Guaranteed delivery tracking
   - TTL and cleanup policies

## Contracts

### WebSocket Protocol

```typescript
interface WebSocketConnection {
  connectionId: string
  userId: string
  entityId: string
  subscriptions: Subscription[]
  connectedAt: Date
  lastActivity: Date
}

interface Subscription {
  topic: string
  filters?: {
    types?: string[]
    sources?: string[]
    minAmount?: number
  }
}

// Client → Server messages
interface ClientMessage {
  type: 'subscribe' | 'unsubscribe' | 'ping'
  topic?: string
  filters?: SubscriptionFilters
}

// Server → Client messages
interface ServerMessage {
  type: 'event' | 'pong' | 'error'
  topic?: string
  data?: any
  timestamp: Date
}
```

### Real-Time Events

```typescript
interface RealTimeEvents {
  // Transaction events
  'transactions.new': {
    transactionId: string
    amount: number
    merchant: string
    category?: string
  }

  // Agent events
  'agent.action.completed': {
    agentId: string
    action: string
    result: any
  }

  // Data updates
  'balance.updated': {
    accountId: string
    newBalance: number
    change: number
  }

  // System events
  'sync.completed': {
    source: string
    recordsUpdated: number
  }
}
```

### SSE Fallback

```typescript
interface SSEConnection {
  endpoint: '/events'
  method: 'GET'
  headers: {
    'Accept': 'text/event-stream'
    'Authorization': 'Bearer {token}'
  }
}

interface SSEMessage {
  id: string
  event: string
  data: string // JSON stringified
  retry: number // Reconnection delay
}
```

## Production Implementation

### WebSocket Server Setup

```typescript
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'

export class RealtimeStreamingServer {
  private io: Server
  private pubsub: RedisPubSub

  async initialize(httpServer: any) {
    // Socket.IO with Redis adapter for multi-instance
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS,
        credentials: true
      },
      transports: ['websocket', 'polling']
    })

    // Redis adapter for horizontal scaling
    const pubClient = createRedisClient()
    const subClient = pubClient.duplicate()
    this.io.adapter(createAdapter(pubClient, subClient))

    // Authentication middleware
    this.io.use(async (socket, next) => {
      const token = socket.handshake.auth.token
      try {
        const user = await this.verifyToken(token)
        socket.data.userId = user.id
        socket.data.entityId = user.currentEntityId
        next()
      } catch (error) {
        next(new Error('Authentication failed'))
      }
    })

    // Connection handling
    this.io.on('connection', (socket) => {
      this.handleConnection(socket)
    })
  }

  private handleConnection(socket: Socket) {
    const { userId, entityId } = socket.data

    // Join entity-specific room
    socket.join(`entity:${entityId}`)

    // Handle subscriptions
    socket.on('subscribe', (topic: string) => {
      this.subscribe(socket, topic)
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      this.handleDisconnect(socket)
    })

    // Heartbeat
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() })
    })
  }

  private async subscribe(socket: Socket, topic: string) {
    const { entityId } = socket.data

    // Entity-scoped topic
    const scopedTopic = `${topic}:entity:${entityId}`

    // Subscribe to Redis Pub/Sub
    await this.pubsub.subscribe(scopedTopic, (message) => {
      socket.emit('event', {
        topic,
        data: message,
        timestamp: new Date()
      })
    })

    // Track subscription
    socket.data.subscriptions = socket.data.subscriptions || []
    socket.data.subscriptions.push(scopedTopic)
  }
}
```

### Event Publisher Integration

```typescript
export class DataPoolEventPublisher {
  constructor(private redis: RedisClient) {}

  async publishTransactionAdded(transaction: Transaction): Promise<void> {
    const entityTopic = `transactions.new:entity:${transaction.entityId}`

    // Publish to Redis (WebSocket servers listen)
    await this.redis.publish(entityTopic, JSON.stringify({
      transactionId: transaction.id,
      amount: transaction.amount,
      merchant: transaction.merchant,
      category: transaction.category,
      timestamp: new Date()
    }))
  }

  async publishAgentActionCompleted(action: AgentAction): Promise<void> {
    const entityTopic = `agent.action.completed:entity:${action.entityId}`

    await this.redis.publish(entityTopic, JSON.stringify({
      agentId: action.agentId,
      action: action.type,
      result: action.result,
      timestamp: new Date()
    }))
  }
}
```

### SSE Fallback Implementation

```typescript
export class SSEStreamController {
  async handleSSEConnection(req: Request, res: Response) {
    // Verify authentication
    const user = await this.authenticateRequest(req)

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Entity-scoped subscription
    const subscription = await this.pubsub.subscribe(
      `*:entity:${user.entityId}`,
      (event) => {
        res.write(`id: ${event.id}\n`)
        res.write(`event: ${event.type}\n`)
        res.write(`data: ${JSON.stringify(event.data)}\n\n`)
      }
    )

    // Heartbeat every 30s
    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n')
    }, 30000)

    // Cleanup on disconnect
    req.on('close', () => {
      clearInterval(heartbeat)
      subscription.unsubscribe()
    })
  }
}
```

## Related Modules

### **Dependencies:**
- **Core Infrastructure:** [[14_NERVOUS_SYSTEM]] (event bus), [[15_SECURITY_FABRIC]]
- **Required Services:** [[13_USER_IDENTITY]] (auth), Redis Pub/Sub

### **Data Flows:**
- **Receives Events From:** [[10_DATA_POOL]], [[12_AGENT_LAYER]], ALL modules publishing events
- **Sends Updates To:** [[00_MAIN_PAGE]], [[04_GRID_VIEW_CANVAS]], ALL frontend components

### **Agent Coordination:**
- **Orchestrated By:** [[0.3_ORCHESTRATOR_MAESTRO]]
- **Coordinates With:** [[14_NERVOUS_SYSTEM]] (event routing)

### **User Journey:**
- **Previous Step:** User viewing dashboard/modules
- **Next Step:** Instant updates without refresh

### **Implementation Order:**
- **Build After:** [[14_NERVOUS_SYSTEM]], [[10_DATA_POOL]]
- **Build Before:** Production deployment (critical for UX)

## See Also
- **Architecture:** [[gov.PROJECT_ARCHITECTURE]]
- **Security:** [[gov.SECURITY_TESTING]]
- **Implementation:** [[gov.IMPLEMENTATION_ROADMAP]]

---
