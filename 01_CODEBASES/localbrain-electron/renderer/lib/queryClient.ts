/**
 * React Query Client Configuration - T011 Implementation
 * =====================================================
 *
 * TanStack Query setup with SSR support and optimized caching
 * Integrated with LocalBrain's AI provider context management
 */

import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized defaults for LocalBrain
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Time in milliseconds that data remains fresh
        staleTime: 1000 * 60 * 5, // 5 minutes

        // Time in milliseconds that inactive queries remain cached
        gcTime: 1000 * 60 * 10, // 10 minutes

        // Number of times a failed query will be retried
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },

        // Delay between retries (exponential backoff)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Enable refetch on window focus (useful for real-time data)
        refetchOnWindowFocus: false,

        // Enable refetch on reconnect
        refetchOnReconnect: true,

        // Enable background refetching
        refetchOnMount: true,

        // Default query function timeout
        queryFnTimeout: 30000, // 30 seconds
      },
      mutations: {
        // Retry mutations once
        retry: 1,

        // Mutation timeout
        mutationFnTimeout: 60000, // 1 minute
      },
    },
  });
}

// Export singleton instance for client-side
let queryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}

// React Query key factories for consistent caching
export const QueryKeys = {
  // AI Provider queries
  aiProvider: ['aiProvider'] as const,
  aiStatus: () => [...QueryKeys.aiProvider, 'status'] as const,
  availableProviders: () => [...QueryKeys.aiProvider, 'available'] as const,

  // Messages queries
  messages: ['messages'] as const,
  messageHistory: (limit?: number) => [...QueryKeys.messages, 'history', limit] as const,

  // Context queries
  contextPool: ['contextPool'] as const,
  contextSegments: () => [...QueryKeys.contextPool, 'segments'] as const,
  contextStats: () => [...QueryKeys.contextPool, 'stats'] as const,

  // Voice queries
  voiceState: ['voice'] as const,
  microphoneStatus: () => [...QueryKeys.voiceState, 'microphone'] as const,
  audioLevel: () => [...QueryKeys.voiceState, 'audioLevel'] as const,

  // Settings queries
  settings: ['settings'] as const,
  appSettings: () => [...QueryKeys.settings, 'app'] as const,
  providerSettings: () => [...QueryKeys.settings, 'provider'] as const,

  // Workflow queries
  workflows: ['workflows'] as const,
  activeWorkflow: () => [...QueryKeys.workflows, 'active'] as const,
  workflowHistory: () => [...QueryKeys.workflows, 'history'] as const,

  // System queries
  systemStatus: ['system'] as const,
  systemHealth: () => [...QueryKeys.systemStatus, 'health'] as const,
  systemMetrics: () => [...QueryKeys.systemStatus, 'metrics'] as const,
} as const;

// Type helpers for query keys
export type QueryKey = typeof QueryKeys[keyof typeof QueryKeys];
export type MessagesQueryKey = ReturnType<typeof QueryKeys.messageHistory>;
export type ContextQueryKey = ReturnType<typeof QueryKeys.contextSegments>;
export type VoiceQueryKey = ReturnType<typeof QueryKeys.microphoneStatus>;
export type SettingsQueryKey = ReturnType<typeof QueryKeys.appSettings>;
export type WorkflowQueryKey = ReturnType<typeof QueryKeys.activeWorkflow>;
export type SystemQueryKey = ReturnType<typeof QueryKeys.systemHealth>;