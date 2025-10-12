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

import { spawn, ChildProcess } from 'child_process';
import { createClient, Client } from '@modelcontextprotocol/sdk';
import { AgentId } from '../../01_CODEBASES/mcp-servers/localbrain-task-registry/src/types/Task.js';

const MCP_SERVER_PATH = '../../01_CODEBASES/mcp-servers/localbrain-task-registry';
const HEARTBEAT_INTERVAL_MS = 30000; // 30 seconds

interface ConnectionOptions {
  model: string;
  project?: string;
  machineId?: string;
  autoHeartbeat?: boolean;
}

export class TaskRegistryClient {
  private agent: AgentId;
  private serverProcess: ChildProcess;
  private client: Client;
  private sessionId: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;

  constructor(agent: AgentId, private options: ConnectionOptions) {
    this.agent = agent;

    this.serverProcess = spawn('node', ['dist/index.js'], {
      cwd: MCP_SERVER_PATH,
      stdio: ['pipe', 'pipe', 'pipe'] // pipe stdin, stdout, stderr
    });

    this.client = createClient({
      transport: {
        send: (message) => this.serverProcess.stdin?.write(JSON.stringify(message)),
        receive: (callback) => {
          this.serverProcess.stdout?.on('data', (data) => callback(JSON.parse(data.toString())));
          this.serverProcess.stderr?.on('data', (data) => console.error(`MCP Server STDERR: ${data}`))
        }
      }
    });
  }

  /**
   * Initialize connection and start heartbeat
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.warn(`Agent ${this.agent} already connected`);
      return;
    }

    try {
      // Connect to MCP server and get session ID
      const connectResult = await this.callTool('agent_connect', {
        agent: this.agent,
        model: this.options.model,
        project: this.options.project || 'LocalBrain',
        machineId: this.options.machineId
      });

      this.sessionId = connectResult.sessionId;
      this.isConnected = true;

      console.log(`✅ Agent ${this.agent} connected: Session ${this.sessionId}`);

      // Start automatic heartbeat if enabled (default: true)
      if (this.options.autoHeartbeat !== false) {
        this.startHeartbeat();
      }
    } catch (error) {
      console.error(`❌ Agent ${this.agent} connection failed:`, error);
      throw error;
    }
  }

  /**
   * Start automatic heartbeat (30 seconds)
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      return; // Already running
    }

    this.heartbeatInterval = setInterval(async () => {
      if (!this.sessionId) {
        console.warn(`Agent ${this.agent}: No session ID for heartbeat`);
        return;
      }

      try {
        await this.sendHeartbeat();
      } catch (error) {
        console.error(`Agent ${this.agent}: Heartbeat failed:`, error);
      }
    }, HEARTBEAT_INTERVAL_MS);

    console.log(`💓 Agent ${this.agent}: Auto-heartbeat started (every ${HEARTBEAT_INTERVAL_MS / 1000}s)`);
  }

  /**
   * Stop automatic heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log(`💔 Agent ${this.agent}: Auto-heartbeat stopped`);
    }
  }

  /**
   * Send manual heartbeat
   */
  async sendHeartbeat(currentActivity?: string): Promise<void> {
    if (!this.sessionId) {
      throw new Error('Not connected - no session ID');
    }

    await this.callTool('agent_heartbeat', {
      sessionId: this.sessionId,
      currentActivity
    });
  }

  /**
   * Get swarm dashboard
   */
  async getSwarmDashboard(): Promise<any> {
    return this.callTool('get_swarm_dashboard', {});
  }

  private async callTool(tool_name: string, parameters: any): Promise<any> {
    const result = await this.client.call('tools/call', {
      tool_name,
      parameters: { ...parameters, agent: this.agent }
    });
    // The tool's JSON output is in a text content block
    if (result.content && result.content[0] && result.content[0].type === 'text') {
      return JSON.parse(result.content[0].text);
    }
    return result;
  }

  async getAvailableTasks(includeDetails: boolean = true): Promise<any> {
    return this.callTool('get_available_tasks', { includeDetails });
  }

  async claimTask(taskId: string): Promise<any> {
    return this.callTool('claim_task', { taskId });
  }

  async updateProgress(
    taskId: string,
    completionPercent: number,
    filesCreated?: string[],
    notes?: string
  ): Promise<any> {
    return this.callTool('update_task_progress', {
      taskId,
      status: 'IN_PROGRESS',
      completionPercent,
      filesCreated,
      notes
    });
  }

  async completeTask(
    taskId: string,
    filesCreated?: string[],
    velocity?: number
  ): Promise<any> {
    return this.callTool('complete_task', {
      taskId,
      filesCreated,
      velocity
    });
  }

  /**
   * Disconnect from MCP server and clean up
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.warn(`Agent ${this.agent} not connected`);
      this.serverProcess.kill();
      return;
    }

    try {
      // Stop heartbeat first
      this.stopHeartbeat();

      // Disconnect from MCP server
      if (this.sessionId) {
        const disconnectResult = await this.callTool('agent_disconnect', {
          sessionId: this.sessionId
        });

        console.log(`✅ Agent ${this.agent} disconnected: ${disconnectResult.sessionDuration} minutes`);
      }

      this.isConnected = false;
      this.sessionId = null;
    } catch (error) {
      console.error(`❌ Agent ${this.agent} disconnect failed:`, error);
    } finally {
      // Always kill server process
      this.serverProcess.kill();
    }
  }

  /**
   * Get session ID (for debugging)
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Check if connected
   */
  isAgentConnected(): boolean {
    return this.isConnected;
  }
}

