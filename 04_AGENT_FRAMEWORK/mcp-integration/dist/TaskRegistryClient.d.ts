/**
 * Task Registry Client (For Agents)
 * ==================================
 *
 * Implemented client that connects to the running MCP server.
 *
 * Features:
 * - Auto-connect on initialization
 * - Automatic 30-second heartbeat
 * - Session management
 * - Auto-disconnect on shutdown
 */
import { AgentId } from '../../01_CODEBASES/mcp-servers/localbrain-task-registry/src/types/Task.js';
interface ConnectionOptions {
    model: string;
    project?: string;
    machineId?: string;
    autoHeartbeat?: boolean;
}
export declare class TaskRegistryClient {
    private options;
    private agent;
    private serverProcess;
    private client;
    private sessionId;
    private heartbeatInterval;
    private isConnected;
    constructor(agent: AgentId, options: ConnectionOptions);
    /**
     * Initialize connection and start heartbeat
     */
    connect(): Promise<void>;
    /**
     * Start automatic heartbeat (30 seconds)
     */
    private startHeartbeat;
    /**
     * Stop automatic heartbeat
     */
    private stopHeartbeat;
    /**
     * Send manual heartbeat
     */
    sendHeartbeat(currentActivity?: string): Promise<void>;
    /**
     * Get swarm dashboard
     */
    getSwarmDashboard(): Promise<any>;
    private callTool;
    getAvailableTasks(includeDetails?: boolean): Promise<any>;
    claimTask(taskId: string): Promise<any>;
    updateProgress(taskId: string, completionPercent: number, filesCreated?: string[], notes?: string): Promise<any>;
    completeTask(taskId: string, filesCreated?: string[], velocity?: number): Promise<any>;
    /**
     * Disconnect from MCP server and clean up
     */
    disconnect(): Promise<void>;
    /**
     * Get session ID (for debugging)
     */
    getSessionId(): string | null;
    /**
     * Check if connected
     */
    isAgentConnected(): boolean;
}
export {};
//# sourceMappingURL=TaskRegistryClient.d.ts.map