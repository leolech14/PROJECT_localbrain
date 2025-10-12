/**
 * 🧪 UNIT TESTS - SessionAutoDetect
 * ==================================
 *
 * Tests auto-detection logic in isolation
 * Validates model mapping, role selection, banner formatting
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SessionAutoDetect, AgentIdentity } from '../SessionAutoDetect';

describe('SessionAutoDetect', () => {

  describe('Model ID Detection', () => {

    it('should read CLAUDE_MODEL_ID from environment', async () => {
      process.env.CLAUDE_MODEL_ID = 'claude-sonnet-4-5-20250929';

      const identity = await SessionAutoDetect.detectAndWelcome();

      expect(identity.modelId).toBe('claude-sonnet-4-5-20250929');
      expect(identity.modelName).toBe('claude-sonnet-4-5');
    });

    it('should fallback to default when env var missing', async () => {
      delete process.env.CLAUDE_MODEL_ID;

      const identity = await SessionAutoDetect.detectAndWelcome();

      expect(identity.modelName).toBe('claude-sonnet-4-5'); // Default
    });

    it('should extract model name from full ID correctly', () => {
      const testCases = [
        { input: 'claude-sonnet-4-5-20250929', expected: 'claude-sonnet-4-5' },
        { input: 'glm-4-6-preview-20250301', expected: 'glm-4-6' },
        { input: 'gemini-2.5-pro-latest', expected: 'gemini-2.5-pro' },
        { input: 'chatgpt-5-turbo', expected: 'chatgpt-5' }
      ];

      testCases.forEach(({ input, expected }) => {
        // Access private method via reflection for testing
        const result = (SessionAutoDetect as any).extractModelName(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Agent Role Mapping', () => {

    it('should map Sonnet-4.5 to Agent B or D', () => {
      const roles = (SessionAutoDetect as any).mapModelToAgents('claude-sonnet-4-5');

      expect(roles).toHaveLength(2);
      expect(roles[0].agentId).toBe('B');
      expect(roles[1].agentId).toBe('D');
      expect(roles[0].name).toBe('Design System Specialist');
      expect(roles[1].name).toBe('Integration Specialist');
    });

    it('should map GLM-4.6 to Agent A or C', () => {
      const roles = (SessionAutoDetect as any).mapModelToAgents('glm-4-6');

      expect(roles).toHaveLength(2);
      expect(roles[0].agentId).toBe('A');
      expect(roles[1].agentId).toBe('C');
    });

    it('should map Gemini-2.5-Pro to Agent E only', () => {
      const roles = (SessionAutoDetect as any).mapModelToAgents('gemini-2.5-pro');

      expect(roles).toHaveLength(1);
      expect(roles[0].agentId).toBe('E');
      expect(roles[0].name).toBe('Ground Supervisor');
    });

    it('should map ChatGPT-5 to Agent F only', () => {
      const roles = (SessionAutoDetect as any).mapModelToAgents('chatgpt-5');

      expect(roles).toHaveLength(1);
      expect(roles[0].agentId).toBe('F');
    });

    it('should return empty array for unknown model', () => {
      const roles = (SessionAutoDetect as any).mapModelToAgents('unknown-model');

      expect(roles).toHaveLength(0);
    });

    it('should include correct capabilities for each agent', () => {
      const roles = (SessionAutoDetect as any).mapModelToAgents('claude-sonnet-4-5');

      expect(roles[0].capabilities).toContain('OKLCH color system');
      expect(roles[1].capabilities).toContain('Swift ↔ Electron IPC bridge');
    });
  });

  describe('Session ID Generation', () => {

    it('should generate unique session IDs', () => {
      const id1 = (SessionAutoDetect as any).generateSessionId('B');
      const id2 = (SessionAutoDetect as any).generateSessionId('B');

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^B_\d+_[a-z0-9]+$/);
    });

    it('should include agent ID in session ID', () => {
      const idA = (SessionAutoDetect as any).generateSessionId('A');
      const idB = (SessionAutoDetect as any).generateSessionId('B');

      expect(idA).toMatch(/^A_/);
      expect(idB).toMatch(/^B_/);
    });
  });

  describe('Progress Bar Rendering', () => {

    it('should render 0% progress correctly', () => {
      const bar = (SessionAutoDetect as any).renderProgressBar(0, 10);

      expect(bar).toContain('[░░░░░░░░░░░░░░░░░░░░]');
      expect(bar).toContain('0%');
    });

    it('should render 50% progress correctly', () => {
      const bar = (SessionAutoDetect as any).renderProgressBar(5, 10);

      expect(bar).toContain('50%');
      expect(bar).toMatch(/\[█+░+\]/); // Mix of filled and empty
    });

    it('should render 100% progress correctly', () => {
      const bar = (SessionAutoDetect as any).renderProgressBar(10, 10);

      expect(bar).toContain('[████████████████████]');
      expect(bar).toContain('100%');
    });

    it('should handle zero total gracefully', () => {
      const bar = (SessionAutoDetect as any).renderProgressBar(0, 0);

      expect(bar).toContain('0%');
      expect(bar).not.toThrow;
    });
  });

  describe('Error Handling', () => {

    it('should handle MCP connection failure gracefully', async () => {
      // Mock TaskRegistryClient to throw error
      vi.mock('../TaskRegistryClient', () => ({
        TaskRegistryClient: vi.fn().mockImplementation(() => ({
          getAgentStatus: vi.fn().mockRejectedValue(new Error('Connection failed'))
        }))
      }));

      const identity = await SessionAutoDetect.detectAndWelcome();

      // Should fallback to default identity
      expect(identity.agentId).toBeDefined();
      expect(identity.taskStatus.total).toBe(0); // Fallback values
    });

    it('should handle malformed MCP response', async () => {
      vi.mock('../TaskRegistryClient', () => ({
        TaskRegistryClient: vi.fn().mockImplementation(() => ({
          getAgentStatus: vi.fn().mockResolvedValue('invalid json{')
        }))
      }));

      const identity = await SessionAutoDetect.detectAndWelcome();

      expect(identity.taskStatus.total).toBe(0); // Fallback on parse error
    });
  });

  describe('Agent Emoji Mapping', () => {

    it('should return correct emoji for each agent', () => {
      const getEmoji = (SessionAutoDetect as any).getAgentEmoji;

      expect(getEmoji('A')).toBe('🔵');
      expect(getEmoji('B')).toBe('🟣');
      expect(getEmoji('C')).toBe('🟢');
      expect(getEmoji('D')).toBe('🟡');
      expect(getEmoji('E')).toBe('🔴');
      expect(getEmoji('F')).toBe('⚪');
    });

    it('should return default emoji for unknown agent', () => {
      const getEmoji = (SessionAutoDetect as any).getAgentEmoji;

      expect(getEmoji('Z')).toBe('⚫');
    });
  });
});

/**
 * 🎯 TEST COVERAGE REQUIREMENTS
 *
 * Minimum coverage: 90%
 * Critical paths: 100%
 * Error handling: 100%
 * Edge cases: 100%
 */
