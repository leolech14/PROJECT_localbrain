/**
 * IPC Integration Utilities - T009
 * Agent A (UI Velocity Specialist)
 *
 * Integrates with Agent D's IPC system for sidebar-agent communication
 * Uses SwiftBridgeClient and message schemas from completed tasks
 */

// Import Agent D's completed IPC system
import SwiftBridgeClient from '../../../localbrain-electron/renderer/lib/swift-bridge';
import type {
  UIIntentMessage,
  AckNackMessage,
  ErrorMessage,
  HeartbeatMessage
} from '../../../localbrain-electron/renderer/lib/swift-bridge/types';

// Sidebar-specific IPC messages
export interface SidebarIPCMessage {
  type: 'SIDEBAR_TOGGLE' | 'PROPOSAL_CREATE' | 'PROPOSAL_UPDATE' | 'PROPOSAL_APPROVE' | 'PROPOSAL_REJECT' | 'AGENT_STATUS_UPDATE' | 'ACTIVITY_LOG' | 'SIDEBAR_STATE_SYNC';
  data: any;
  timestamp: string;
  requestId?: string;
}

export interface ProposalIPCMessage extends UIIntentMessage {
  intent: 'PROPOSAL_CREATE' | 'PROPOSAL_UPDATE' | 'PROPOSAL_APPROVE' | 'PROPOSAL_REJECT';
  data: {
    proposalId: string;
    agentId: string;
    action: string;
    metadata?: Record<string, any>;
  };
}

export interface SidebarToggleMessage extends UIIntentMessage {
  intent: 'SIDEBAR_TOGGLE';
  data: {
    isOpen: boolean;
    mode?: 'overlay' | 'push' | 'inline';
  };
}

export interface AgentStatusMessage extends UIIntentMessage {
  intent: 'AGENT_STATUS_UPDATE';
  data: {
    agentId: string;
    status: string;
    task?: string;
    metadata?: Record<string, any>;
  };
}

// IPC Client for sidebar communication
export class SidebarIPIClient {
  private client: SwiftBridgeClient;
  private messageQueue: Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }> = new Map();

  constructor() {
    this.client = SwiftBridgeClient.getInstance();
  }

  /**
   * Toggle sidebar visibility and mode
   */
  async toggleSidebar(isOpen: boolean, mode?: 'overlay' | 'push' | 'inline'): Promise<boolean> {
    const message: SidebarToggleMessage = {
      intent: 'SIDEBAR_TOGGLE',
      data: { isOpen, mode },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
    };

    try {
      const response = await this.sendAndWait(message);
      return response.success;
    } catch (error) {
      console.error('Failed to toggle sidebar:', error);
      return false;
    }
  }

  /**
   * Create a new agent proposal
   */
  async createProposal(proposalData: {
    agentId: string;
    title: string;
    description: string;
    expectedOutcome: string;
    priority?: string;
    confidence?: number;
  }): Promise<{ success: boolean; proposalId?: string; error?: string }> {
    const message: ProposalIPCMessage = {
      intent: 'PROPOSAL_CREATE',
      data: {
        proposalId: this.generateProposalId(),
        agentId: proposalData.agentId,
        action: 'create',
        metadata: {
          title: proposalData.title,
          description: proposalData.description,
          expectedOutcome: proposalData.expectedOutcome,
          priority: proposalData.priority || 'medium',
          confidence: proposalData.confidence || 80,
          created: new Date().toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
    };

    try {
      const response = await this.sendAndWait(message);
      return {
        success: response.success,
        proposalId: message.data.proposalId,
      };
    } catch (error) {
      console.error('Failed to create proposal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update an existing proposal
   */
  async updateProposal(proposalId: string, updates: {
    status?: string;
    title?: string;
    description?: string;
    expectedOutcome?: string;
    priority?: string;
    confidence?: number;
  }): Promise<{ success: boolean; error?: string }> {
    const message: ProposalIPCMessage = {
      intent: 'PROPOSAL_UPDATE',
      data: {
        proposalId,
        agentId: 'sidebar', // Sidebar agent acting on behalf of system
        action: 'update',
        metadata: {
          updates,
          updated: new Date().toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
    };

    try {
      const response = await this.sendAndWait(message);
      return { success: response.success };
    } catch (error) {
      console.error('Failed to update proposal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Approve a proposal
   */
  async approveProposal(proposalId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    const message: ProposalIPCMessage = {
      intent: 'PROPOSAL_APPROVE',
      data: {
        proposalId,
        agentId: 'sidebar', // Sidebar agent approving
        action: 'approve',
        metadata: {
          reason: reason || 'Approved via sidebar',
          approvedBy: 'sidebar',
          approvedAt: new Date().toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
    };

    try {
      const response = await this.sendAndWait(message);
      return { success: response.success };
    } catch (error) {
      console.error('Failed to approve proposal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Reject a proposal
   */
  async rejectProposal(proposalId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    const message: ProposalIPCMessage = {
      intent: 'PROPOSAL_REJECT',
      data: {
        proposalId,
        agentId: 'sidebar', // Sidebar agent rejecting
        action: 'reject',
        metadata: {
          reason: reason || 'Rejected via sidebar',
          rejectedBy: 'sidebar',
          rejectedAt: new Date().toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
    };

    try {
      const response = await this.sendAndWait(message);
      return { success: response.success };
    } catch (error) {
      console.error('Failed to reject proposal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update agent status
   */
  async updateAgentStatus(agentId: string, status: string, task?: string): Promise<boolean> {
    const message: AgentStatusMessage = {
      intent: 'AGENT_STATUS_UPDATE',
      data: {
        agentId,
        status,
        task,
        metadata: {
          source: 'sidebar',
          updatedAt: new Date().toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
    };

    try {
      const response = await this.sendAndWait(message);
      return response.success;
    } catch (error) {
      console.error('Failed to update agent status:', error);
      return false;
    }
  }

  /**
   * Send activity log entry
   */
  async logActivity(entry: {
    type: string;
    message: string;
    agentId?: string;
    proposalId?: string;
    metadata?: Record<string, any>;
  }): Promise<boolean> {
    const message: SidebarIPCMessage = {
      type: 'ACTIVITY_LOG',
      data: {
        ...entry,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    try {
      // Fire and forget for activity logs
      await this.client.postIntent('ACTIVITY_LOG', message);
      return true;
    } catch (error) {
      console.error('Failed to log activity:', error);
      return false;
    }
  }

  /**
   * Sync sidebar state with system
   */
  async syncSidebarState(state: {
    isOpen: boolean;
    mode: string;
    activeProposal?: string;
  }): Promise<boolean> {
    const message: SidebarIPCMessage = {
      type: 'SIDEBAR_STATE_SYNC',
      data: {
        ...state,
        syncedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await this.client.postIntent('SIDEBAR_STATE_SYNC', message);
      return true;
    } catch (error) {
      console.error('Failed to sync sidebar state:', error);
      return false;
    }
  }

  /**
   * Listen for incoming sidebar messages
   */
  listenForMessages(callback: (message: SidebarIPCMessage) => void): () => {
    const unsubscribe = this.client.on('intent', (intent) => {
      if (this.isSidebarMessage(intent)) {
        callback(this.convertToSidebarMessage(intent));
      }
    });

    return unsubscribe;
  }

  /**
   * Send message and wait for response
   */
  private async sendAndWait(message: SidebarIPCMessage): Promise<AckNackMessage | ErrorMessage> {
    const requestId = message.requestId || this.generateRequestId();
    message.requestId = requestId;

    return new Promise((resolve, reject) => {
      // Set up timeout
      const timeout = setTimeout(() => {
        this.messageQueue.delete(requestId);
        reject(new Error(`Message timeout after 5 seconds`));
      }, 5000);

      this.messageQueue.set(requestId, { resolve, reject, timeout });

      // Send the message
      this.client.postIntent(message.type as any, message)
        .then(() => {
          // Response will come through the event listener
        })
        .catch((error) => {
          clearTimeout(timeout);
          this.messageQueue.delete(requestId);
          reject(error);
        });

      // Set up response listener
      const unsubscribe = this.client.on('response', (response) => {
        if (response.requestId === requestId) {
          clearTimeout(timeout);
          this.messageQueue.delete(requestId);
          unsubscribe();
          resolve(response);
        }
      });
    });
  }

  /**
   * Check if message is sidebar-related
   */
  private isSidebarMessage(intent: any): boolean {
    const sidebarIntents = [
      'SIDEBAR_TOGGLE',
      'PROPOSAL_CREATE',
      'PROPOSAL_UPDATE',
      'PROPOSAL_APPROVE',
      'PROPOSAL_REJECT',
      'AGENT_STATUS_UPDATE',
      'ACTIVITY_LOG',
      'SIDEBAR_STATE_SYNC',
    ];

    return sidebarIntents.includes(intent.intent);
  }

  /**
   * Convert to sidebar message format
   */
  private convertToSidebarMessage(intent: any): SidebarIPCMessage {
    return {
      type: intent.intent as SidebarIPCMessage['type'],
      data: intent.data,
      timestamp: intent.timestamp || new Date().toISOString(),
      requestId: intent.requestId,
    };
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `sidebar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique proposal ID
   */
  private generateProposalId(): string {
    return `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    return this.client.getConnectionStatus();
  }

  /**
   * Check if IPC is ready
   */
  isReady(): boolean {
    return this.getConnectionStatus() === 'connected';
  }
}

// Export singleton instance
export const sidebarIPClient = new SidebarIPIClient();