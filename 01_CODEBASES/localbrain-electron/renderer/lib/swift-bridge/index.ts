/**
 * Swift Bridge Client - Main Export
 * ===================================
 *
 * Task: T013 - TypeScript IPC Client Implementation
 * Agent: D (Integration Specialist)
 */

export { SwiftBridgeClient, getSwiftBridge } from './SwiftBridgeClient';

export type {
  MessageSource,
  MessageType,
  IntentType,
  TargetType,
  Priority,
  HealthStatus,
  ErrorSeverity,
  StatusCategory,
  BaseMessage,
  UIIntentMessage,
  UIIntentPayload,
  IntentTarget,
  IntentMetadata,
  MessageContext,
  AckNackMessage,
  StatusInfo,
  ResultInfo,
  ResultMetadata,
  ErrorDetails,
  DiagnosticInfo,
  ErrorMessage,
  ErrorInfo,
  RecoveryInfo,
  ErrorDiagnostics,
  HeartbeatMessage,
  HealthInfo,
  MetricsInfo,
  IPCMessage,
  UIIntentHandler,
  AcknowledgementHandler,
  ErrorHandler,
  HeartbeatHandler,
  SwiftBridgeOptions,
  MetricsSnapshot,
  ConnectionHealthSnapshot,
} from './types';
