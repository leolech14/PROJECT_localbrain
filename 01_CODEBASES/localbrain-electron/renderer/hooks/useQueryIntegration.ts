/**
 * React Query Integration Hooks - T011 Implementation
 * ==================================================
 *
 * Custom hooks that integrate TanStack Query with LocalBrain's AppContext
 * Provides seamless server-state management with local state synchronization
 */

"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { QueryKeys } from '../lib/queryClient';
import {
  aiProviderQueries,
  messageQueries,
  contextQueries,
  voiceQueries,
  settingsQueries,
  workflowQueries,
  systemQueries,
} from '../lib/queries';
import { queryInvalidation } from '../components/QueryProvider';

// ============================================================
// AI PROVIDER HOOKS
// ============================================================

export function useAIProviderQuery() {
  const { state, dispatch } = useAppContext();

  const query = useQuery({
    queryKey: QueryKeys.aiStatus(),
    queryFn: aiProviderQueries.getStatus,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2, // Refresh every 2 minutes
  });

  // Sync with local state
  useEffect(() => {
    if (query.data) {
      dispatch({
        type: 'UPDATE_AI_STATUS',
        payload: query.data,
      });
      dispatch({
        type: 'SET_AI_CONNECTED',
        payload: query.data.isConnected,
      });
    }
  }, [query.data, dispatch]);

  return query;
}

export function useAvailableProvidersQuery() {
  return useQuery({
    queryKey: QueryKeys.availableProviders(),
    queryFn: aiProviderQueries.getAvailableProviders,
    staleTime: 1000 * 60 * 60, // 1 hour - providers don't change often
  });
}

export function useSwitchProviderMutation() {
  const queryClient = useQueryClient();
  const { dispatch } = useAppContext();

  return useMutation({
    mutationFn: aiProviderQueries.switchProvider,
    onSuccess: (newProvider) => {
      dispatch({
        type: 'SET_AI_PROVIDER',
        payload: newProvider as any,
      });
      // Invalidate AI provider queries
      queryInvalidation.invalidateAIProvider(queryClient);
    },
    onError: (error) => {
      console.error('Failed to switch provider:', error);
    },
  });
}

// ============================================================
// MESSAGE HOOKS
// ============================================================

export function useMessagesQuery(limit?: number) {
  const { state } = useAppContext();

  const query = useQuery({
    queryKey: QueryKeys.messageHistory(limit),
    queryFn: () => messageQueries.getHistory(limit),
    staleTime: 1000 * 60 * 1, // 1 minute - messages change frequently
    enabled: false, // Don't fetch automatically - use local state first
  });

  // Use local state as primary source, fallback to query data
  const data = state.messages.length > 0 ? state.messages : query.data;

  return {
    ...query,
    data,
    isLoading: query.isLoading && state.messages.length === 0,
  };
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();
  const { dispatch } = useAppContext();

  return useMutation({
    mutationFn: messageQueries.send,
    onMutate: async ({ text, contextIds }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.messages });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(QueryKeys.messages);

      // Optimistically update to the new value
      const userMessage = {
        id: Date.now().toString(),
        text,
        role: 'user' as const,
        ts: new Date(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      return { previousMessages };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMessages) {
        queryClient.setQueryData(QueryKeys.messages, context.previousMessages);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryInvalidation.invalidateMessages(queryClient);
    },
  });
}

export function useClearMessagesMutation() {
  const queryClient = useQueryClient();
  const { dispatch } = useAppContext();

  return useMutation({
    mutationFn: messageQueries.clear,
    onSuccess: () => {
      dispatch({ type: 'CLEAR_MESSAGES' });
      queryInvalidation.invalidateMessages(queryClient);
    },
  });
}

// ============================================================
// CONTEXT HOOKS
// ============================================================

export function useContextSegmentsQuery() {
  const { state, dispatch } = useAppContext();

  const query = useQuery({
    queryKey: QueryKeys.contextSegments(),
    queryFn: contextQueries.getSegments,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Sync with local state
  useEffect(() => {
    if (query.data) {
      // Update local state with server data
      query.data.forEach((segment: any) => {
        const exists = state.contextPool.find((c) => c.id === segment.id);
        if (!exists) {
          dispatch({ type: 'ADD_CONTEXT', payload: segment });
        }
      });
    }
  }, [query.data, state.contextPool, dispatch]);

  return {
    ...query,
    data: state.contextPool, // Use local state as primary source
  };
}

export function useAddContextMutation() {
  const queryClient = useQueryClient();
  const { dispatch } = useAppContext();

  return useMutation({
    mutationFn: contextQueries.addSegment,
    onSuccess: (segment) => {
      dispatch({ type: 'ADD_CONTEXT', payload: segment });
      queryInvalidation.invalidateContext(queryClient);
    },
  });
}

export function useToggleContextMutation() {
  const queryClient = useQueryClient();
  const { dispatch } = useAppContext();

  return useMutation({
    mutationFn: contextQueries.toggleSegment,
    onSuccess: (segment) => {
      dispatch({ type: 'TOGGLE_CONTEXT', payload: segment.id });
      queryInvalidation.invalidateContext(queryClient);
    },
  });
}

export function useRemoveContextMutation() {
  const queryClient = useQueryClient();
  const { dispatch } = useAppContext();

  return useMutation({
    mutationFn: contextQueries.removeSegment,
    onSuccess: (segmentId) => {
      dispatch({ type: 'REMOVE_CONTEXT', payload: segmentId });
      queryInvalidation.invalidateContext(queryClient);
    },
  });
}

// ============================================================
// VOICE HOOKS
// ============================================================

export function useMicrophoneStatusQuery() {
  const { state, dispatch } = useAppContext();

  const query = useQuery({
    queryKey: QueryKeys.microphoneStatus(),
    queryFn: voiceQueries.getMicrophoneStatus,
    staleTime: 1000 * 10, // 10 seconds - voice status changes frequently
    refetchInterval: 1000 * 15, // Refresh every 15 seconds
  });

  // Sync with local state
  useEffect(() => {
    if (query.data !== undefined) {
      dispatch({ type: 'SET_MIC_ACTIVE', payload: query.data });
    }
  }, [query.data, dispatch]);

  return {
    ...query,
    data: state.micActive, // Use local state as primary source
  };
}

export function useToggleMicrophoneMutation() {
  const queryClient = useQueryClient();
  const { dispatch } = useAppContext();

  return useMutation({
    mutationFn: voiceQueries.toggleMicrophone,
    onSuccess: (newState) => {
      dispatch({ type: 'SET_MIC_ACTIVE', payload: newState });
      queryInvalidation.invalidateVoice(queryClient);
    },
  });
}

// ============================================================
// SETTINGS HOOKS
// ============================================================

export function useAppSettingsQuery() {
  const { state, dispatch } = useAppContext();

  const query = useQuery({
    queryKey: QueryKeys.appSettings(),
    queryFn: settingsQueries.getAppSettings,
    staleTime: 1000 * 60 * 30, // 30 minutes - settings don't change often
  });

  // Sync with local state
  useEffect(() => {
    if (query.data) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: query.data });
    }
  }, [query.data, dispatch]);

  return {
    ...query,
    data: state.settings, // Use local state as primary source
  };
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  const { dispatch } = useAppContext();

  return useMutation({
    mutationFn: settingsQueries.updateAppSettings,
    onSuccess: (newSettings) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
      queryInvalidation.invalidateSettings(queryClient);
    },
  });
}

// ============================================================
// WORKFLOW HOOKS
// ============================================================

export function useWorkflowsQuery() {
  return useQuery({
    queryKey: QueryKeys.workflows,
    queryFn: workflowQueries.getWorkflows,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useActiveWorkflowQuery() {
  const { state, dispatch } = useAppContext();

  const query = useQuery({
    queryKey: QueryKeys.activeWorkflow(),
    queryFn: workflowQueries.getActiveWorkflow,
    staleTime: 1000 * 60, // 1 minute
  });

  // Sync with local state
  useEffect(() => {
    if (query.data) {
      dispatch({ type: 'SET_ACTIVE_WORKFLOW', payload: query.data.id });
    }
  }, [query.data, dispatch]);

  return {
    ...query,
    data: state.activeWorkflow, // Use local state as primary source
  };
}

// ============================================================
// SYSTEM HOOKS
// ============================================================

export function useSystemHealthQuery() {
  return useQuery({
    queryKey: QueryKeys.systemHealth(),
    queryFn: systemQueries.getHealth,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refresh every 2 minutes
  });
}

export function useSystemMetricsQuery() {
  return useQuery({
    queryKey: QueryKeys.systemMetrics(),
    queryFn: systemQueries.getMetrics,
    staleTime: 1000 * 30, // 30 seconds - metrics change frequently
    refetchInterval: 1000 * 60, // Refresh every minute
  });
}

// ============================================================
// UTILITY HOOKS
// ============================================================

export function useRefreshAll() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    return queryInvalidation.refetchAll(queryClient);
  }, [queryClient]);
}

export function useInvalidateAll() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    return queryInvalidation.invalidateAll(queryClient);
  }, [queryClient]);
}