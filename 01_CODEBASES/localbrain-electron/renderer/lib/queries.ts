/**
 * React Query Functions - T011 Implementation
 * =============================================
 *
 * Query functions that integrate with LocalBrain's IPC services
 * Provides server-state management with caching and synchronization
 */

import { QueryKeys } from './queryClient';

// AI Provider queries
export const aiProviderQueries = {
  // Get current AI provider status
  getStatus: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getProviderStatus();
  },

  // Get list of available providers
  getAvailableProviders: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getAvailableProviders();
  },

  // Switch AI provider
  switchProvider: async (provider: string) => {
    const { ipc } = await import('../services/ipc');
    await ipc.switchProvider(provider);
    return provider; // Return the provider for React Query
  },

  // Test provider connection
  testConnection: async (provider: string) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.testProviderConnection(provider);
  },
};

// Messages queries
export const messageQueries = {
  // Get message history
  getHistory: async (limit: number = 50) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getMessageHistory(limit);
  },

  // Send a message (mutation function)
  send: async ({ text, contextIds }: { text: string; contextIds?: string[] }) => {
    const { ipc } = await import('../services/ipc');
    const stream = await ipc.sendMessage(text, contextIds || []);

    // Convert stream to text for React Query
    let fullText = '';
    for await (const chunk of stream) {
      fullText += chunk.text;
    }

    return {
      id: Date.now().toString(),
      text: fullText,
      role: 'assistant' as const,
      timestamp: new Date().toISOString(),
    };
  },

  // Clear all messages
  clear: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.clearMessages();
  },

  // Export conversation
  export: async (format: 'json' | 'markdown' | 'txt' = 'json') => {
    const { ipc } = await import('../services/ipc');
    return await ipc.exportConversation(format);
  },
};

// Context queries
export const contextQueries = {
  // Get all context segments
  getSegments: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getContextSegments();
  },

  // Get context statistics
  getStats: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getContextStats();
  },

  // Add context segment (mutation function)
  addSegment: async (segment: {
    id: string;
    content: string;
    tokens: number;
    type: string;
    metadata?: Record<string, any>;
  }) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.addContextSegment(segment);
  },

  // Remove context segment
  removeSegment: async (id: string) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.removeContextSegment(id);
  },

  // Toggle context segment
  toggleSegment: async (id: string) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.toggleContextSegment(id);
  },

  // Refresh context from file system
  refresh: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.refreshContext();
  },
};

// Voice queries
export const voiceQueries = {
  // Get microphone status
  getMicrophoneStatus: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getMicrophoneStatus();
  },

  // Get current audio level
  getAudioLevel: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getAudioLevel();
  },

  // Toggle microphone
  toggleMicrophone: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.toggleMicrophone();
  },

  // Start voice recording
  startRecording: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.startVoiceRecording();
  },

  // Stop voice recording
  stopRecording: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.stopVoiceRecording();
  },

  // Transcribe audio
  transcribe: async (audioData: ArrayBuffer) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.transcribeAudio(audioData);
  },
};

// Settings queries
export const settingsQueries = {
  // Get app settings
  getAppSettings: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getAppSettings();
  },

  // Update app settings
  updateAppSettings: async (settings: Record<string, any>) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.updateAppSettings(settings);
  },

  // Get provider-specific settings
  getProviderSettings: async (provider: string) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getProviderSettings(provider);
  },

  // Update provider settings
  updateProviderSettings: async (provider: string, settings: Record<string, any>) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.updateProviderSettings(provider, settings);
  },

  // Reset settings to defaults
  resetToDefaults: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.resetSettings();
  },
};

// Workflow queries
export const workflowQueries = {
  // Get available workflows
  getWorkflows: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getWorkflows();
  },

  // Get active workflow
  getActiveWorkflow: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getActiveWorkflow();
  },

  // Start workflow
  startWorkflow: async (workflowId: string, params?: Record<string, any>) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.startWorkflow(workflowId, params);
  },

  // Stop active workflow
  stopActiveWorkflow: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.stopActiveWorkflow();
  },

  // Get workflow history
  getHistory: async (limit: number = 20) => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getWorkflowHistory(limit);
  },
};

// System queries
export const systemQueries = {
  // Get system health
  getHealth: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getSystemHealth();
  },

  // Get system metrics
  getMetrics: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getSystemMetrics();
  },

  // Get application info
  getAppInfo: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.getAppInfo();
  },

  // Check for updates
  checkUpdates: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.checkForUpdates();
  },

  // Restart application
  restart: async () => {
    const { ipc } = await import('../services/ipc');
    return await ipc.restartApp();
  },
};

// Export all query functions with their keys for easy use
export const queryFunctions = {
  [QueryKeys.aiProvider[0]]: aiProviderQueries,
  [QueryKeys.messages[0]]: messageQueries,
  [QueryKeys.contextPool[0]]: contextQueries,
  [QueryKeys.voiceState[0]]: voiceQueries,
  [QueryKeys.settings[0]]: settingsQueries,
  [QueryKeys.workflows[0]]: workflowQueries,
  [QueryKeys.systemStatus[0]]: systemQueries,
} as const;