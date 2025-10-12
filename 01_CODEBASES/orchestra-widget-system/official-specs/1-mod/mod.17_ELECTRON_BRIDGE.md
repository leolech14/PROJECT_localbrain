# ===== MODULE IDENTITY =====
title: "Electron Bridge - Frontend-Backend Communication"
module_id: "mod.17_electron_bridge"
type: "module"
category: "bridge"

# ===== SYSTEMATIC SCAFFOLDING =====
lifecycle: "dev"
state: "minimal"
seat: "mvp"

# ===== AVAILABILITY AND ACCESS =====
phase_availability: "always"
priority: "critical"
agent_accessible: true
user_configurable: false

# ===== PROMOTION GATES =====
promotion_gates:
  to_intermediate_i1:
    - "Reliably transports messages between renderer and main processes."
    - "Implements request-response pattern with proper error handling."
    - "Supports streaming data transfer for real-time updates."
  to_complete:
    - "Provides type-safe communication contracts."
    - "Implements security boundaries and permission checks."
    - "Supports file transfer and binary data handling."

# ===== OBSERVABILITY =====
observability:
  metrics:
    - "electron_bridge.message.duration_ms"
    - "electron_bridge.message.error_rate"
    - "electron_bridge.active_connections"
  alerts:
    - "electron_bridge.connection.timeout"
    - "electron_bridge.security.violation"
  dashboards:
    - "electron_bridge_health"

# ===== SECURITY REQUIREMENTS =====
security:
  authentication_required: true
  authorization_level: "system"
  data_classification: "internal"
  encryption_in_transit: true
  audit_logging: true

# ===== TECHNICAL METADATA =====
dependencies: []
integrations: ["all frontend modules", "all backend modules"]
last_updated: "2025-10-06"
version: "1.0.0"
maintainer: "Lech/Claude"

# ===== AGENTIC INTEGRATION =====
agent_capabilities:
  can_read: true
  can_write: false
  can_propose_changes: false
  requires_approval: false
---

# 17. Electron Bridge - Frontend-Backend Communication

## Purpose

To act as the **secure, type-safe communication layer** between the frontend (React renderer process) and backend (Electron main process). It provides a unified API for all inter-process communication, ensuring that frontend modules can securely invoke backend services and receive responses.

**Out of Scope:**
- Business logic implementation (provides communication, not functionality)
- Direct API calls to external services (routes to backend modules)
- File system operations (relays to backend persistence services)

---

## Primary Features

- **Message Passing:** Provides request-response and event-driven communication patterns between processes.

- **Type Safety:** Enforces TypeScript interfaces for all messages, preventing runtime errors.

- **Security Layer:** Implements authentication and authorization checks for all cross-process communication.

- **Streaming Support:** Handles real-time data streams (e.g., AI responses, file uploads) efficiently.

- **Error Handling:** Centralizes error handling and provides meaningful error messages to the frontend.

- **Connection Management:** Manages the lifecycle of IPC connections and handles reconnection scenarios.

---

## Architecture

The Electron Bridge operates as a bidirectional communication layer that translates frontend API calls into backend service invocations.

```mermaid
graph TD
    subgraph Renderer Process (Frontend)
        A[React Components] --> B[Frontend API Layer]
        B --> C[Electron Bridge Client]
    end

    subgraph Main Process (Backend)
        D[Electron Bridge Server] --> E[Backend Services]
        E --> F[Context Engine]
        E --> G[Central Intelligence]
        E --> H[State Persistence]
    end

    C -- IPC Messages --> D
    D -- Service Invocations --> E

    style C fill:#3498db,stroke:#2980b9,color:white
    style D fill:#3498db,stroke:#2980b9,color:white
```

**Communication Patterns:**

1. **Request-Response:** Frontend calls backend service and waits for result
2. **Event Streaming:** Backend pushes real-time updates to frontend
3. **File Transfer:** Secure file exchange between processes

---

## Contracts

The bridge defines standardized interfaces for all communication.

```typescript
// Base message structure
interface BaseMessage {
  id: string;
  type: string;
  timestamp: number;
  sender: 'renderer' | 'main';
}

// Request message
interface RequestMessage<T = any> extends BaseMessage {
  type: 'request';
  service: string;
  method: string;
  payload: T;
}

// Response message
interface ResponseMessage<T = any> extends BaseMessage {
  type: 'response';
  requestId: string;
  success: boolean;
  data?: T;
  error?: string;
}

// Stream message
interface StreamMessage<T = any> extends BaseMessage {
  type: 'stream';
  streamId: string;
  chunk: T;
  isComplete: boolean;
}

// Service contracts
interface ElectronBridgeAPI {
  // Context Engine
  contextEngine: {
    ingest: (payload: IngestionPayload) => Promise<{ success: boolean }>;
    buildContext: (options: BuildContextOptions) => Promise<FinalContextPayload>;
  };

  // Central Intelligence
  centralIntelligence: {
    streamResponse: (request: AIRequest) => AsyncGenerator<string, void, void>;
  };

  // State Persistence
  statePersistence: {
    saveState: (key: string, data: any) => Promise<void>;
    loadState: (key: string) => Promise<any>;
  };

  // File System
  fileSystem: {
    readFile: (path: string) => Promise<Buffer>;
    writeFile: (path: string, data: Buffer) => Promise<void>;
  };
}
```

---

## State Progression & Promotion Gates

### Current State: minimal

### Minimal State
**Definition:** Basic IPC communication with manual message handling.
**Requirements:**
- [ ] Can send simple request-response messages between processes
- [ ] Basic error handling for failed messages
- [ ] Manual message serialization/deserialization

### Intermediate I1 State
**Definition:** Structured communication with service routing.
**Requirements:**
- [ ] All `minimal` requirements met
- [ ] Implements automatic service routing based on message metadata
- [ ] Supports streaming data transfer
- [ ] Basic type validation on messages

### Complete State
**Definition:** Enterprise-grade communication with full security.
**Requirements:**
- [ ] All `I1` requirements met
- [ ] Implements comprehensive security checks and permissions
- [ ] Automatic reconnection and error recovery
- [ ] Performance monitoring and optimization
- [ ] Support for binary data and large file transfers

---

## Production Implementation

```typescript
// /src/main/ipc/ElectronBridgeServer.ts
import { ipcMain, MessagePortMain } from 'electron';
import { ContextEngine } from '../services/ContextEngine';
import { CentralIntelligence } from '../services/CentralIntelligence';

export class ElectronBridgeServer {
  private contextEngine: ContextEngine;
  private centralIntelligence: CentralIntelligence;
  private activeStreams: Map<string, MessagePortMain> = new Map();

  constructor() {
    this.contextEngine = new ContextEngine();
    this.centralIntelligence = new CentralIntelligence();
    this.setupIpcHandlers();
  }

  private setupIpcHandlers() {
    // Context Engine handlers
    ipcMain.handle('contextEngine:ingest', async (event, payload: IngestionPayload) => {
      try {
        const result = await this.contextEngine.ingest(payload);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('contextEngine:buildContext', async (event, options: BuildContextOptions) => {
      try {
        const result = await this.contextEngine.buildContext(options);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Central Intelligence streaming handler
    ipcMain.on('centralIntelligence:streamResponse', async (event, request: AIRequest) => {
      const [, port] = event.ports;
      const streamId = `stream_${Date.now()}`;

      try {
        for await (const chunk of this.centralIntelligence.streamResponse(request)) {
          port.postMessage({
            type: 'chunk',
            streamId,
            data: chunk,
            isComplete: false
          });
        }

        port.postMessage({
          type: 'complete',
          streamId,
          isComplete: true
        });
      } catch (error) {
        port.postMessage({
          type: 'error',
          streamId,
          error: error.message
        });
      }
    });
  }
}

// /src/renderer/ipc/ElectronBridgeClient.ts
export class ElectronBridgeClient {
  private pendingRequests: Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
  }> = new Map();

  constructor() {
    this.setupResponseHandler();
  }

  private setupResponseHandler() {
    window.electronAPI.onResponse((message: ResponseMessage) => {
      const pending = this.pendingRequests.get(message.requestId);
      if (pending) {
        this.pendingRequests.delete(message.requestId);

        if (message.success) {
          pending.resolve(message.data);
        } else {
          pending.reject(new Error(message.error));
        }
      }
    });
  }

  async invoke<T>(service: string, method: string, payload?: any): Promise<T> {
    const requestId = `req_${Date.now()}_${Math.random()}`;

    return new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });

      window.electronAPI.invoke({
        type: 'request',
        id: requestId,
        service,
        method,
        payload,
        timestamp: Date.now(),
        sender: 'renderer'
      });
    });
  }

  createStream<T>(service: string, method: string, payload?: any): AsyncGenerator<T, void, void> {
    const streamId = `stream_${Date.now()}`;

    return (async function* () {
      // Implementation for streaming
    })();
  }
}

// Type-safe API wrapper
export const ElectronAPI = {
  contextEngine: {
    ingest: (payload: IngestionPayload) =>
      bridgeClient.invoke('contextEngine', 'ingest', payload),
    buildContext: (options: BuildContextOptions) =>
      bridgeClient.invoke('contextEngine', 'buildContext', options),
  },

  centralIntelligence: {
    streamResponse: (request: AIRequest) =>
      bridgeClient.createStream('centralIntelligence', 'streamResponse', request),
  },
} as const;
```

---

## Testing Strategy

1. **Unit Test: Message Routing**
   - **Given:** A request message for service 'contextEngine' method 'ingest'
   - **When:** The bridge server receives the message
   - **Then:** The correct backend service method should be called with the payload

2. **Integration Test: Error Handling**
   - **Given:** A backend service throws an error
   - **When:** The bridge processes the request
   - **Then:** The frontend should receive a properly formatted error response

3. **Integration Test: Streaming**
   - **Given:** A streaming request for AI response
   - **When:** The backend emits multiple chunks
   - **Then:** The frontend should receive all chunks in the correct order

---