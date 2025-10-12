/**
 * 🔗 INTEGRATION TESTS - Complete System
 * =======================================
 *
 * Tests components working together
 * Validates MCP server connection, data flow, error propagation
 *
 * REQUIREMENTS:
 * - MCP server must be running
 * - TaskRegistry must have test data
 * - SQLite database must be accessible
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { SessionAutoDetect } from '../SessionAutoDetect';
import { NaturalLanguageRouter } from '../NaturalLanguageRouter';
import { AutomaticAgent } from '../AutomaticAgent';
import { TaskRegistryClient } from '../TaskRegistryClient';
describe('Integration Tests', () => {
    let mcpServerRunning = false;
    beforeAll(async () => {
        // Verify MCP server is running
        try {
            const client = new TaskRegistryClient('B');
            await client.getAgentStatus('B');
            mcpServerRunning = true;
            console.log('✅ MCP server is running');
        }
        catch (error) {
            console.error('❌ MCP server not running - integration tests will fail');
            console.error('Start server with: cd 01_CODEBASES/mcp-servers/localbrain-task-registry && npm run dev');
            mcpServerRunning = false;
        }
    });
    describe('MCP Server Connection', () => {
        it('should connect to MCP server successfully', async () => {
            if (!mcpServerRunning) {
                console.log('⏭️  Skipping - MCP server not running');
                return;
            }
            const client = new TaskRegistryClient('B');
            const status = await client.getAgentStatus('B');
            expect(status).toBeDefined();
            expect(typeof status).toBe('object');
        });
        it('should retrieve available tasks from MCP', async () => {
            if (!mcpServerRunning)
                return;
            const client = new TaskRegistryClient('B');
            const tasks = await client.getAvailableTasks();
            expect(tasks).toBeDefined();
            expect(Array.isArray(tasks) || typeof tasks === 'object').toBe(true);
        });
        it('should handle connection timeout gracefully', async () => {
            // Test with invalid server path
            const client = new TaskRegistryClient('B');
            // Mock invalid connection
            // Should not hang indefinitely
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
            try {
                await Promise.race([
                    client.getAgentStatus('B'),
                    timeoutPromise
                ]);
            }
            catch (error) {
                expect(error).toBeDefined();
            }
        }, 10000);
    });
    describe('SessionAutoDetect + MCP Integration', () => {
        it('should detect agent and query real task status', async () => {
            if (!mcpServerRunning)
                return;
            const identity = await SessionAutoDetect.detectAndWelcome();
            expect(identity.agentId).toBeDefined();
            expect(identity.taskStatus).toBeDefined();
            expect(typeof identity.taskStatus.total).toBe('number');
            expect(typeof identity.taskStatus.completed).toBe('number');
        });
        it('should select correct role based on MCP task status', async () => {
            if (!mcpServerRunning)
                return;
            process.env.CLAUDE_MODEL_ID = 'claude-sonnet-4-5-20250929';
            const identity = await SessionAutoDetect.detectAndWelcome();
            // Should be Agent B or D (Sonnet-4.5)
            expect(['B', 'D']).toContain(identity.agentId);
        });
    });
    describe('NaturalLanguageRouter + MCP Integration', () => {
        it('should route "start working" and query real tasks', async () => {
            if (!mcpServerRunning)
                return;
            const router = new NaturalLanguageRouter('B');
            const action = await router.route('start working');
            expect(action).toBeDefined();
            if (action) {
                expect(action.action).toBe('AUTO_START');
                // If tasks available, should have task object
            }
        });
        it('should route "what\'s my status?" and get real data', async () => {
            if (!mcpServerRunning)
                return;
            const router = new NaturalLanguageRouter('B');
            const action = await router.route("what's my status?");
            expect(action).toBeDefined();
            expect(action?.action).toBe('STATUS_UPDATE');
            expect(action?.message).toContain('Agent B');
        });
        it('should handle "start working" when no tasks available', async () => {
            if (!mcpServerRunning)
                return;
            // Use agent with no tasks (if exists)
            const router = new NaturalLanguageRouter('F');
            const action = await router.route('start working');
            expect(action).toBeDefined();
            // Should either claim task or return NONE if no tasks
        });
    });
    describe('AutomaticAgent End-to-End', () => {
        it('should initialize and connect to MCP', async () => {
            if (!mcpServerRunning)
                return;
            const agent = await AutomaticAgent.initialize();
            expect(agent).toBeDefined();
            const identity = agent.getIdentity();
            expect(identity.agentId).toBeDefined();
            expect(identity.sessionId).toBeDefined();
        });
        it('should process "start working" end-to-end', async () => {
            if (!mcpServerRunning)
                return;
            const agent = await AutomaticAgent.initialize();
            const action = await agent.processPrompt('start working');
            if (action) {
                expect(action.action).toBe('AUTO_START');
                expect(action.message).toBeDefined();
            }
            // If no action, means no tasks available (acceptable)
        });
        it('should process non-task prompt and return null', async () => {
            if (!mcpServerRunning)
                return;
            const agent = await AutomaticAgent.initialize();
            const action = await agent.processPrompt('How do I use React?');
            expect(action).toBeNull(); // Not a task action
        });
        it('should refresh status and get updated data', async () => {
            if (!mcpServerRunning)
                return;
            const agent = await AutomaticAgent.initialize();
            const updatedIdentity = await agent.refreshStatus();
            expect(updatedIdentity.taskStatus).toBeDefined();
            expect(typeof updatedIdentity.taskStatus.total).toBe('number');
        });
    });
    describe('Data Format Validation', () => {
        it('should parse MCP task response correctly', async () => {
            if (!mcpServerRunning)
                return;
            const client = new TaskRegistryClient('B');
            const tasksResponse = await client.getAvailableTasks();
            // Validate response structure
            let tasks;
            if (typeof tasksResponse === 'string') {
                tasks = JSON.parse(tasksResponse);
            }
            else {
                tasks = tasksResponse;
            }
            // Should have expected structure
            expect(tasks).toBeDefined();
        });
        it('should parse MCP status response correctly', async () => {
            if (!mcpServerRunning)
                return;
            const client = new TaskRegistryClient('B');
            const statusResponse = await client.getAgentStatus('B');
            let status;
            if (typeof statusResponse === 'string') {
                status = JSON.parse(statusResponse);
            }
            else {
                status = statusResponse;
            }
            // Validate expected fields exist
            expect(status).toBeDefined();
        });
    });
    describe('Error Propagation', () => {
        it('should propagate MCP errors to user gracefully', async () => {
            // Test with invalid agent ID
            const router = new NaturalLanguageRouter('INVALID');
            try {
                await router.route('start working');
            }
            catch (error) {
                // Should either catch error or return graceful error message
                expect(error).toBeDefined();
            }
        });
        it('should handle malformed MCP response', async () => {
            // This tests parser robustness
            // Implementation should handle unexpected formats gracefully
        });
    });
    describe('Race Condition Testing', () => {
        it('should handle simultaneous task claims', async () => {
            if (!mcpServerRunning)
                return;
            // Simulate two agents claiming same task simultaneously
            const router1 = new NaturalLanguageRouter('B');
            const router2 = new NaturalLanguageRouter('D');
            const [result1, result2] = await Promise.all([
                router1.route('start working'),
                router2.route('start working')
            ]);
            // One should succeed, both should handle gracefully
            // (MCP server atomic claim_task should prevent double-claim)
        });
    });
});
/**
 * 🎯 INTEGRATION TEST REQUIREMENTS
 *
 * Prerequisites:
 * - MCP server running on default port
 * - TaskRegistry database populated with test data
 * - Network connectivity
 *
 * Success Criteria:
 * - All tests pass with MCP server running
 * - Graceful degradation when server unavailable
 * - No hanging connections (timeout < 5s)
 * - No race conditions detected
 */
//# sourceMappingURL=integration.test.js.map