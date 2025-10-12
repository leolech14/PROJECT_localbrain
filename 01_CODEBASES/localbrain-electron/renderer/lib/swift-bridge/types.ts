/**
 * TypeScript Type Definitions for Swift ↔ Web IPC
 * ==================================================
 *
 * Task: T013 - TypeScript IPC Client Implementation
 * Agent: D (Integration Specialist)
 * Schema Version: 1.0 (matches T002 JSON schemas)
 */

export type MessageSource = 'swift' | 'web';

export type MessageType = 'UI_INTENT' | 'ACK' | 'NACK' | 'ERROR' | 'HEARTBEAT';

export type IntentType =
  | 'openPanel'
  | 'closePanel'
  | 'togglePanel'
  | 'resizePanel'
  | 'maximizePanel'
  | 'minimizePanel'
  | 'focusPanel'
  | 'updateLayout'
  | 'showSidebar'
  | 'hideSidebar'
  | 'toggleSidebar'
  | 'displayAgentProposal'
  | 'approveProposal'
  | 'rejectProposal'
  | 'executeCommand'
  | 'updateState'
  | 'requestData'
  | 'streamData'
  | 'cancelOperation';

export type TargetType =
  | 'panel'
  | 'sidebar'
  | 'widget'
  | 'grid'
  | 'approvalTray'
  | 'agentControl'
  | 'terminal'
  | 'fileExplorer'
  | 'chat'
  | 'task';

export type Priority = 'low' | 'normal' | 'high' | 'critical';

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export type ErrorSeverity = 'warning' | 'error' | 'critical';

export type StatusCategory =
  | 'success'
  | 'validation_error'
  | 'permission_denied'
  | 'not_found'
  | 'timeout'
  | 'rate_limited'
  | 'internal_error'
  | 'unavailable';

export interface BaseMessage {
  type: MessageType;
  traceId: string;
  timestamp: string;
  version: string;
}

export interface UIIntentMessage extends BaseMessage {
  type: 'UI_INTENT';
  source: MessageSource;
  payload: UIIntentPayload;
  context?: MessageContext;
}

export interface UIIntentPayload {
  intent: IntentType | string;
  target: IntentTarget;
  parameters?: Record<string, any>;
  metadata?: IntentMetadata;
}

export interface IntentTarget {
  type: TargetType | string;
  id: string;
  selector?: string;
}

export interface IntentMetadata {
  priority?: Priority;
  timeout?: number;
  retryable?: boolean;
  idempotencyKey?: string;
}

export interface MessageContext {
  userId?: string;
  sessionId?: string;
  agentId?: string;
  permissions?: string[];
}

export interface AckNackMessage extends BaseMessage {
  type: 'ACK' | 'NACK';
  status: StatusInfo;
  result?: ResultInfo;
  error?: ErrorDetails;
  diagnostics?: DiagnosticInfo;
}

export interface StatusInfo {
  code: number;
  message: string;
  category?: StatusCategory;
}

export interface ResultInfo {
  data?: any;
  metadata?: ResultMetadata;
}

export interface ResultMetadata {
  processingTime?: number;
  affectedElements?: string[];
}

export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
  retryable?: boolean;
  retryAfter?: number;
}

export interface DiagnosticInfo {
  requestDuration?: number;
  queueTime?: number;
  source?: string;
}

export interface ErrorMessage extends BaseMessage {
  type: 'ERROR';
  error: ErrorInfo;
  diagnostics?: ErrorDiagnostics;
}

export interface ErrorInfo {
  code: string;
  severity: ErrorSeverity;
  message: string;
  details?: Record<string, any>;
  recovery?: RecoveryInfo;
}

export interface RecoveryInfo {
  retryable: boolean;
  retryAfter?: number;
  fallbackAction?: string;
}

export interface ErrorDiagnostics {
  stackTrace?: string;
  context?: Record<string, any>;
  timestamp: string;
}

export interface HeartbeatMessage extends BaseMessage {
  type: 'HEARTBEAT';
  source: string;
  health: HealthInfo;
  metrics?: MetricsInfo;
  capabilities?: string[];
}

export interface HealthInfo {
  status: HealthStatus;
  uptime: number;
}

export interface MetricsInfo {
  messagesSent: number;
  messagesReceived: number;
  errorCount: number;
  averageLatency?: number;
  queueDepth?: number;
}

export type IPCMessage = UIIntentMessage | AckNackMessage | ErrorMessage | HeartbeatMessage;

// Event callback types
export type UIIntentHandler = (message: UIIntentMessage) => void | Promise<void>;
export type AcknowledgementHandler = (message: AckNackMessage) => void;
export type ErrorHandler = (message: ErrorMessage) => void;
export type HeartbeatHandler = (message: HeartbeatMessage) => void;

// Client options
export interface SwiftBridgeOptions {
  autoConnect?: boolean;
  heartbeatInterval?: number;
  requestTimeout?: number;
  retryAttempts?: number;
  enableMetrics?: boolean;
}

// Metrics snapshot
export interface MetricsSnapshot {
  messagesSent: number;
  messagesReceived: number;
  errorCount: number;
  averageLatency: number;
  connectionHealth: HealthStatus;
  pendingRequests: number;
  uptime: number;
}

// Connection health snapshot
export interface ConnectionHealthSnapshot {
  status: HealthStatus;
  lastHeartbeat: Date | null;
  timeSinceLastBeat: number | null;
}
