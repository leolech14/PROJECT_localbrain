/**
 * SwiftBridgeClient - TypeScript IPC Client for Swift ↔ Web Communication
 * ==========================================================================
 *
 * Task: T013 - TypeScript IPC Client Implementation
 * Agent: D (Integration Specialist, Sonnet-4.5)
 * Created: 2025-10-08
 * Schema Version: 1.0 (based on T002 IPC Message Schema Contracts)
 *
 * Purpose:
 * - Mirrors IPCBridge.swift functionality in TypeScript
 * - Provides Promise-based API for Swift ↔ Web communication
 * - Validates messages against T002 JSON schemas with Ajv
 * - Event-driven architecture for incoming messages
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { EventEmitter } from 'events';

// Import T002 JSON schemas
import uiIntentSchema from '../../../../../shared/ipc-contracts/ui-intent.schema.json';
import ackNackSchema from '../../../../../shared/ipc-contracts/acknowledgement.schema.json';
import errorSchema from '../../../../../shared/ipc-contracts/error.schema.json';
import heartbeatSchema from '../../../../../shared/ipc-contracts/heartbeat.schema.json';

// ==========================================
// Type Definitions (from T002 schemas)
// ==========================================

export type MessageSource = 'swift' | 'web';

export interface UIIntentMessage {
  type: 'UI_INTENT';
  traceId: string;
  timestamp: string;
  version: string;
  source: MessageSource;
  payload: {
    intent: string;
    target: {
      type: string;
      id: string;
      selector?: string;
    };
    parameters?: Record<string, any>;
    metadata?: {
      priority?: 'low' | 'normal' | 'high' | 'critical';
      timeout?: number;
      retryable?: boolean;
      idempotencyKey?: string;
    };
  };
  context?: {
    userId?: string;
    sessionId?: string;
    agentId?: string;
    permissions?: string[];
  };
}

export interface AckNackMessage {
  type: 'ACK' | 'NACK';
  traceId: string;
  timestamp: string;
  version: string;
  status: {
    code: number;
    message: string;
    category?: string;
  };
  result?: {
    data?: any;
    metadata?: {
      processingTime?: number;
      affectedElements?: string[];
    };
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
    retryable?: boolean;
    retryAfter?: number;
  };
  diagnostics?: {
    requestDuration?: number;
    queueTime?: number;
    source?: string;
  };
}

export interface ErrorMessage {
  type: 'ERROR';
  traceId: string;
  timestamp: string;
  version: string;
  error: {
    code: string;
    severity: 'warning' | 'error' | 'critical';
    message: string;
    details?: Record<string, any>;
    recovery?: {
      retryable: boolean;
      retryAfter?: number;
      fallbackAction?: string;
    };
  };
  diagnostics?: {
    stackTrace?: string;
    context?: Record<string, any>;
    timestamp: string;
  };
}

export interface HeartbeatMessage {
  type: 'HEARTBEAT';
  traceId: string;
  timestamp: string;
  version: string;
  source: string;
  health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: number;
  };
  metrics?: {
    messagesSent: number;
    messagesReceived: number;
    errorCount: number;
    averageLatency?: number;
    queueDepth?: number;
  };
  capabilities?: string[];
}

export type IPCMessage = UIIntentMessage | AckNackMessage | ErrorMessage | HeartbeatMessage;

// ==========================================
// SwiftBridgeClient Class
// ==========================================

export class SwiftBridgeClient extends EventEmitter {
  private ajv: Ajv;
  private validators: Map<string, any>;
  private pendingRequests: Map<string, {
    resolve: (value: AckNackMessage) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }>;

  // Connection health
  private connectionHealth: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  private lastHeartbeat: Date | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // Metrics
  private messagesSent = 0;
  private messagesReceived = 0;
  private errorCount = 0;
  private latencies: number[] = [];
  private startTime = new Date();

  constructor() {
    super();

    // Initialize Ajv with formats
    this.ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(this.ajv);

    // Compile validators for all message types
    this.validators = new Map();
    this.validators.set('UI_INTENT', this.ajv.compile(uiIntentSchema));
    this.validators.set('ACK', this.ajv.compile(ackNackSchema));
    this.validators.set('NACK', this.ajv.compile(ackNackSchema));
    this.validators.set('ERROR', this.ajv.compile(errorSchema));
    this.validators.set('HEARTBEAT', this.ajv.compile(heartbeatSchema));

    this.pendingRequests = new Map();

    // Setup window.ipcBridge receiver
    this.setupMessageReceiver();

    // Start health monitoring
    this.startHealthMonitoring();

    console.log('🌉 SwiftBridgeClient initialized - ready for Web ↔ Swift communication');
  }

  // ==========================================
  // Message Receiver Setup
  // ==========================================

  private setupMessageReceiver(): void {
    // Expose receiveMessage method globally
    if (typeof window !== 'undefined') {
      (window as any).ipcBridge = {
        receiveMessage: this.receiveMessage.bind(this)
      };
    }
  }

  private receiveMessage(message: IPCMessage): void {
    const startTime = Date.now();
    this.messagesReceived++;

    try {
      // Validate message against schema
      if (!this.validateMessage(message)) {
        this.errorCount++;
        console.error('❌ Message failed schema validation:', this.ajv.errors);
        return;
      }

      // Handle different message types
      switch (message.type) {
        case 'UI_INTENT':
          this.handleUIIntent(message as UIIntentMessage);
          break;

        case 'ACK':
        case 'NACK':
          this.handleAcknowledgement(message as AckNackMessage, startTime);
          break;

        case 'ERROR':
          this.handleError(message as ErrorMessage);
          break;

        case 'HEARTBEAT':
          this.handleHeartbeat(message as HeartbeatMessage);
          break;

        default:
          console.warn('⚠️  Unknown message type:', (message as any).type);
      }

    } catch (error) {
      this.errorCount++;
      console.error('❌ Error processing message:', error);
    }
  }

  // ==========================================
  // Message Validation
  // ==========================================

  private validateMessage(message: IPCMessage): boolean {
    const validator = this.validators.get(message.type);

    if (!validator) {
      console.error(`❌ No validator found for message type: ${message.type}`);
      return false;
    }

    const valid = validator(message);

    if (!valid) {
      console.error('❌ Schema validation failed:', validator.errors);
      return false;
    }

    return true;
  }

  // ==========================================
  // Message Handlers
  // ==========================================

  private handleUIIntent(message: UIIntentMessage): void {
    console.log(`📨 Received UI Intent: ${message.payload.intent} → ${message.payload.target.type}:${message.payload.target.id}`);

    // Emit event for app to handle
    this.emit('ui-intent', message);
    this.emit(`ui-intent:${message.payload.intent}`, message);
  }

  private handleAcknowledgement(message: AckNackMessage, startTime: number): void {
    const latency = Date.now() - startTime;
    this.latencies.push(latency);

    console.log(`${message.type === 'ACK' ? '✅' : '❌'} Received ${message.type}: ${message.status.message} (traceId: ${message.traceId})`);

    // Resolve pending promise if exists
    const pending = this.pendingRequests.get(message.traceId);

    if (pending) {
      clearTimeout(pending.timeout);
      pending.resolve(message);
      this.pendingRequests.delete(message.traceId);
    }

    // Emit event
    this.emit('acknowledgement', message);
  }

  private handleError(message: ErrorMessage): void {
    this.errorCount++;
    console.error(`🚨 Error from Swift: [${message.error.code}] ${message.error.message}`);

    // Emit error event
    this.emit('error', message);
  }

  private handleHeartbeat(message: HeartbeatMessage): void {
    this.connectionHealth = message.health.status;
    this.lastHeartbeat = new Date();

    // Emit heartbeat event
    this.emit('heartbeat', message);
  }

  // ==========================================
  // Send Methods (Promise-based API)
  // ==========================================

  async postIntent(
    intent: string,
    target: { type: string; id: string; selector?: string },
    parameters?: Record<string, any>,
    options?: {
      priority?: 'low' | 'normal' | 'high' | 'critical';
      timeout?: number;
      retryable?: boolean;
      context?: UIIntentMessage['context'];
    }
  ): Promise<AckNackMessage> {
    const traceId = this.generateTraceId();
    const message: UIIntentMessage = {
      type: 'UI_INTENT',
      traceId,
      timestamp: new Date().toISOString(),
      version: '1.0',
      source: 'web',
      payload: {
        intent,
        target,
        parameters,
        metadata: {
          priority: options?.priority || 'normal',
          timeout: options?.timeout || 5000,
          retryable: options?.retryable !== undefined ? options.retryable : true,
        },
      },
      context: options?.context,
    };

    // Validate before sending
    if (!this.validateMessage(message)) {
      throw new Error('Message failed schema validation');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(traceId);
        reject(new Error(`Request timeout after ${options?.timeout || 5000}ms`));
      }, options?.timeout || 5000);

      this.pendingRequests.set(traceId, { resolve, reject, timeout });

      this.sendToSwift(message);
    });
  }

  sendHeartbeat(): void {
    const uptime = Math.floor((Date.now() - this.startTime.getTime()) / 1000);
    const avgLatency = this.latencies.length > 0
      ? this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length
      : undefined;

    const message: HeartbeatMessage = {
      type: 'HEARTBEAT',
      traceId: this.generateTraceId(),
      timestamp: new Date().toISOString(),
      version: '1.0',
      source: 'web',
      health: {
        status: this.connectionHealth,
        uptime,
      },
      metrics: {
        messagesSent: this.messagesSent,
        messagesReceived: this.messagesReceived,
        errorCount: this.errorCount,
        averageLatency: avgLatency,
        queueDepth: this.pendingRequests.size,
      },
      capabilities: [
        'ui-intent-handling',
        'schema-validation',
        'error-recovery',
        'health-monitoring',
        'promise-based-api',
      ],
    };

    this.sendToSwift(message);
  }

  // ==========================================
  // Low-Level Send Method
  // ==========================================

  private sendToSwift(message: IPCMessage): void {
    try {
      // Send via webkit.messageHandlers (Safari/WKWebView)
      if (typeof (window as any).webkit !== 'undefined' &&
          (window as any).webkit.messageHandlers &&
          (window as any).webkit.messageHandlers.ipcBridge) {
        (window as any).webkit.messageHandlers.ipcBridge.postMessage(message);
        this.messagesSent++;
        console.log(`📤 Sent ${message.type} to Swift (traceId: ${message.traceId})`);
      } else {
        console.warn('⚠️  Swift bridge not available - message not sent');
      }
    } catch (error) {
      this.errorCount++;
      console.error('❌ Failed to send message to Swift:', error);
      throw error;
    }
  }

  // ==========================================
  // Health Monitoring
  // ==========================================

  private startHealthMonitoring(): void {
    // Send heartbeat every 5 seconds
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
      this.checkConnectionHealth();
    }, 5000);
  }

  private checkConnectionHealth(): void {
    if (!this.lastHeartbeat) {
      this.connectionHealth = 'unhealthy';
      return;
    }

    const timeSinceLastBeat = Date.now() - this.lastHeartbeat.getTime();

    if (timeSinceLastBeat > 30000) {
      this.connectionHealth = 'unhealthy';
    } else if (timeSinceLastBeat > 15000) {
      this.connectionHealth = 'degraded';
    } else {
      this.connectionHealth = 'healthy';
    }
  }

  stopHealthMonitoring(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // ==========================================
  // Utility Methods
  // ==========================================

  private generateTraceId(): string {
    return `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getMetrics() {
    return {
      messagesSent: this.messagesSent,
      messagesReceived: this.messagesReceived,
      errorCount: this.errorCount,
      averageLatency: this.latencies.length > 0
        ? this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length
        : 0,
      connectionHealth: this.connectionHealth,
      pendingRequests: this.pendingRequests.size,
      uptime: Math.floor((Date.now() - this.startTime.getTime()) / 1000),
    };
  }

  getConnectionHealth() {
    return {
      status: this.connectionHealth,
      lastHeartbeat: this.lastHeartbeat,
      timeSinceLastBeat: this.lastHeartbeat
        ? Date.now() - this.lastHeartbeat.getTime()
        : null,
    };
  }

  // ==========================================
  // Cleanup
  // ==========================================

  destroy(): void {
    this.stopHealthMonitoring();
    this.pendingRequests.forEach(({ timeout }) => clearTimeout(timeout));
    this.pendingRequests.clear();
    this.removeAllListeners();
    console.log('🔌 SwiftBridgeClient destroyed');
  }
}

// ==========================================
// Singleton Export
// ==========================================

let swiftBridgeInstance: SwiftBridgeClient | null = null;

export function getSwiftBridge(): SwiftBridgeClient {
  if (!swiftBridgeInstance) {
    swiftBridgeInstance = new SwiftBridgeClient();
  }
  return swiftBridgeInstance;
}

export default SwiftBridgeClient;
