/**
 * TypeScript Schema Validation Tests
 * ====================================
 *
 * Task: T017 - Schema Validation System Testing
 * Agent: D (Integration Specialist)
 * Tests: SwiftBridgeClient Ajv validation against T002 schemas
 */

import { SwiftBridgeClient } from '../../../../01_CODEBASES/localbrain-electron/renderer/lib/swift-bridge/SwiftBridgeClient';
import validMessages from '../fixtures/valid-messages.json';
import invalidMessages from '../fixtures/invalid-messages.json';

describe('TypeScript Schema Validation (Ajv)', () => {
  let bridge: SwiftBridgeClient;

  beforeEach(() => {
    bridge = new SwiftBridgeClient();
  });

  afterEach(() => {
    bridge.destroy();
  });

  describe('Valid Message Validation', () => {
    test('should validate UI_INTENT message (openPanel)', () => {
      const message = validMessages.ui_intent_openPanel;

      // Access private validator through any cast (testing purposes)
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(true);
    });

    test('should validate ACK message', () => {
      const message = validMessages.ack_success;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(true);
    });

    test('should validate NACK message', () => {
      const message = validMessages.nack_validation_error;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(true);
    });

    test('should validate ERROR message', () => {
      const message = validMessages.error_critical;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(true);
    });

    test('should validate HEARTBEAT message', () => {
      const message = validMessages.heartbeat_healthy;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(true);
    });
  });

  describe('Invalid Message Validation', () => {
    test('should reject message with missing type', () => {
      const message = invalidMessages.missing_type.message;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(false);
    });

    test('should reject message with invalid type', () => {
      const message = invalidMessages.invalid_message_type.message;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(false);
    });

    test('should reject message with missing traceId', () => {
      const message = invalidMessages.missing_traceId.message;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(false);
    });

    test('should reject UI_INTENT with missing payload', () => {
      const message = invalidMessages.ui_intent_missing_payload.message;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(false);
    });

    test('should reject UI_INTENT with missing target', () => {
      const message = invalidMessages.ui_intent_missing_target.message;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(false);
    });

    test('should reject ACK with missing status', () => {
      const message = invalidMessages.ack_missing_status.message;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(false);
    });

    test('should reject ERROR with missing error field', () => {
      const message = invalidMessages.error_missing_error_field.message;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(false);
    });

    test('should reject HEARTBEAT with missing health', () => {
      const message = invalidMessages.heartbeat_missing_health.message;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(false);
    });
  });

  describe('Validation Performance', () => {
    test('should validate message in <10ms (T002 requirement)', () => {
      const message = validMessages.ui_intent_openPanel;

      const startTime = performance.now();
      (bridge as any).validateMessage(message);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(10);
    });

    test('should validate 100 messages in <1000ms', () => {
      const message = validMessages.ui_intent_openPanel;

      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        (bridge as any).validateMessage(message);
      }
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Error Message Quality', () => {
    test('should provide detailed error for invalid message', () => {
      const message = invalidMessages.ui_intent_missing_target.message;
      const isValid = (bridge as any).validateMessage(message);

      expect(isValid).toBe(false);

      // Ajv errors should be populated
      const ajv = (bridge as any).ajv;
      expect(ajv.errors).toBeDefined();
      expect(ajv.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Schema Coverage', () => {
    test('should have validators for all message types', () => {
      const validators = (bridge as any).validators;

      expect(validators.has('UI_INTENT')).toBe(true);
      expect(validators.has('ACK')).toBe(true);
      expect(validators.has('NACK')).toBe(true);
      expect(validators.has('ERROR')).toBe(true);
      expect(validators.has('HEARTBEAT')).toBe(true);
    });

    test('should have compiled validators (not function objects)', () => {
      const validators = (bridge as any).validators;
      const uiIntentValidator = validators.get('UI_INTENT');

      expect(typeof uiIntentValidator).toBe('function');
      expect(uiIntentValidator.schema).toBeDefined(); // Ajv compiled validators have schema property
    });
  });
});

describe('Integration: Message Round-Trip Validation', () => {
  let bridge: SwiftBridgeClient;

  beforeEach(() => {
    bridge = new SwiftBridgeClient();
  });

  afterEach(() => {
    bridge.destroy();
  });

  test('should validate message before sending', async () => {
    // Mock webkit.messageHandlers
    (global as any).window = {
      webkit: {
        messageHandlers: {
          ipcBridge: {
            postMessage: jest.fn()
          }
        }
      }
    };

    const intent = 'openPanel';
    const target = { type: 'sidebar', id: 'test' };

    // This should validate internally
    await expect(
      bridge.postIntent(intent, target)
    ).resolves.toBeDefined();

    // Message should have been sent (validation passed)
    expect((global as any).window.webkit.messageHandlers.ipcBridge.postMessage).toHaveBeenCalled();
  });

  test('should reject invalid message before sending', async () => {
    // Invalid target (missing required id field)
    const intent = 'openPanel';
    const target = { type: 'sidebar' } as any; // Force invalid

    await expect(
      bridge.postIntent(intent, target)
    ).rejects.toThrow('Message failed schema validation');
  });
});
