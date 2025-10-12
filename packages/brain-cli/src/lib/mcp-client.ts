/**
 * MCP Client
 * ==========
 *
 * WebSocket client for connecting to the Central Intelligence MCP server.
 * Handles authentication, discovery, and task management.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { config } from './config.js';
import chalk from 'chalk';
import ora from 'ora';
import { createHash } from 'crypto';
import { hostname } from 'os';
import { dirname, resolve } from 'path';

export interface DiscoveryResult {
  agent: {
    id: string;
    trackingId: string;
    name: string;
    modelId: string;
    capabilities: {
      ui: boolean;
      backend: boolean;
      design: boolean;
      integration: boolean;
      contextSize: number;
      multimodal: boolean;
      languages: string[];
    };
  };
  agentIdentity: {
    recognized: boolean;
    method: string;
    confidence: number;
    previousSessions: number;
  };
  project: {
    id: string;
    name: string;
    path: string;
    type: string;
    gitRemote: string;
    vision: string;
  };
  projectRecognized: boolean;
  context: {
    totalFiles: number;
    totalSize: number;
    byType: Record<string, number>;
    linesOfCode: number;
    technologies: string[];
  };
  categories: {
    specs: number;
    docs: number;
    code: number;
    architecture: number;
  };
  contextExtracted: boolean;
  proposals: Array<{
    taskId: string;
    taskName: string;
    matchScore: number;
    matchReason: string;
    estimatedEffort: string;
    impact: string;
    readyToStart: boolean;
    recommended: boolean;
    relevantContext: {
      specs: number;
      docs: number;
      codeExamples: number;
      total: number;
    };
  }>;
  proposalsGenerated: boolean;
  discoveryTime: number;
  timestamp: string;
}

export class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private serverPath: string;

  constructor(serverPath?: string) {
    this.serverPath = serverPath || config.get('serverPath') || '';
  }

  /**
   * Connect to the MCP server
   */
  async connect(): Promise<void> {
    const spinner = ora('Connecting to Central Intelligence...').start();

    try {
      // Create stdio transport
      const serverDir = dirname(resolve(this.serverPath));
      this.transport = new StdioClientTransport({
        command: 'node',
        args: [this.serverPath],
        cwd: serverDir
      });

      // Create MCP client
      this.client = new Client(
        {
          name: 'brain-cli',
          version: '2.0.0'
        },
        {
          capabilities: {
            tools: {}
          }
        }
      );

      // Connect
      await this.client.connect(this.transport);

      spinner.succeed('Connected to Central Intelligence');
    } catch (error) {
      spinner.fail('Failed to connect to Central Intelligence');
      throw error;
    }
  }

  /**
   * Disconnect from the MCP server
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
    if (this.transport) {
      await this.transport.close();
      this.transport = null;
    }
  }

  /**
   * Ensure connected
   */
  private ensureConnected(): void {
    if (!this.client) {
      throw new Error('Not connected to MCP server. Run "brain connect" first.');
    }
  }

  /**
   * Discover environment (main connection flow)
   */
  async discoverEnvironment(cwd: string, modelId?: string): Promise<DiscoveryResult> {
    this.ensureConnected();

    const spinner = ora('Discovering environment...').start();

    try {
      // Get tracking ID from config or generate new one
      const trackingId = config.getTrackingId();

      // Generate API key hash if available
      const apiKey = config.getApiKey();
      const apiKeyHash = apiKey
        ? createHash('sha256').update(apiKey).digest('hex').substring(0, 32)
        : undefined;

      // Get machine ID
      const machineId = hostname();

      // Call discover_environment tool
      const result = await this.client!.callTool({
        name: 'discover_environment',
        arguments: {
          cwd,
          modelId: modelId || 'brain-cli-2.0',
          trackingId,
          apiKeyHash,
          machineId
        }
      });

      spinner.succeed('Environment discovered');

      // Parse result
      if (result.content && (result.content as any[]).length > 0) {
        const content = (result.content as any[])[0];
        if (content.type === 'text') {
          const discovery = JSON.parse(content.text) as DiscoveryResult;

          // Save tracking ID if new
          if (discovery.agent.trackingId && !trackingId) {
            config.set('trackingId', discovery.agent.trackingId);
            config.set('agentId', discovery.agent.id);
            config.set('agentName', discovery.agent.name);
          }

          // Update last connected
          config.updateLastConnected();

          return discovery;
        }
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      spinner.fail('Failed to discover environment');
      throw error;
    }
  }

  /**
   * Get available tasks
   */
  async getAvailableTasks(agentLetter?: string): Promise<any[]> {
    this.ensureConnected();

    const result = await this.client!.callTool({
      name: 'get_available_tasks',
      arguments: {
        agent: agentLetter
      }
    });

    if (result.content && (result.content as any[]).length > 0) {
      const content = (result.content as any[])[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
    }

    return [];
  }

  /**
   * Claim a task
   */
  async claimTask(taskId: string, agentLetter: string): Promise<any> {
    this.ensureConnected();

    const result = await this.client!.callTool({
      name: 'claim_task',
      arguments: {
        task_id: taskId,
        agent: agentLetter
      }
    });

    if (result.content && (result.content as any[]).length > 0) {
      const content = (result.content as any[])[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
    }

    throw new Error('Failed to claim task');
  }

  /**
   * Update task progress
   */
  async updateTaskProgress(
    taskId: string,
    progress: number,
    files?: string[],
    notes?: string
  ): Promise<any> {
    this.ensureConnected();

    const result = await this.client!.callTool({
      name: 'update_progress',
      arguments: {
        task_id: taskId,
        progress,
        files,
        notes
      }
    });

    if (result.content && (result.content as any[]).length > 0) {
      const content = (result.content as any[])[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
    }

    throw new Error('Failed to update task progress');
  }

  /**
   * Complete a task
   */
  async completeTask(
    taskId: string,
    deliverables: string[],
    actualTime: number
  ): Promise<any> {
    this.ensureConnected();

    const result = await this.client!.callTool({
      name: 'complete_task',
      arguments: {
        task_id: taskId,
        deliverables,
        actual_time: actualTime
      }
    });

    if (result.content && (result.content as any[]).length > 0) {
      const content = (result.content as any[])[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
    }

    throw new Error('Failed to complete task');
  }

  /**
   * Get dashboard
   */
  async getDashboard(): Promise<any> {
    this.ensureConnected();

    const result = await this.client!.callTool({
      name: 'get_dashboard',
      arguments: {}
    });

    if (result.content && (result.content as any[]).length > 0) {
      const content = (result.content as any[])[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
    }

    throw new Error('Failed to get dashboard');
  }

  /**
   * Get agent status
   */
  async getAgentStatus(agentLetter: string): Promise<any> {
    this.ensureConnected();

    const result = await this.client!.callTool({
      name: 'get_agent_status',
      arguments: {
        agent: agentLetter
      }
    });

    if (result.content && (result.content as any[]).length > 0) {
      const content = (result.content as any[])[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
    }

    throw new Error('Failed to get agent status');
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.client !== null;
  }

  /**
   * Get server path
   */
  getServerPath(): string {
    return this.serverPath;
  }
}

// Export singleton instance
export const mcpClient = new MCPClient();