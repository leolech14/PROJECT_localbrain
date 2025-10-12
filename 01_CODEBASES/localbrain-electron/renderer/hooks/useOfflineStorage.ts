/**
 * Offline Storage Hooks - T014 Implementation
 * =============================================
 *
 * React hooks for IndexedDB offline storage with React Query integration
 * Provides seamless online/offline functionality for LocalBrain
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { offlineDB, OfflineMessage, OfflineContextSegment } from '../lib/offline/db';
import { QueryKeys } from '../lib/queryClient';

// ============================================================
// OFFLINE STATUS HOOK
// ============================================================

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { data: metrics } = useQuery({
    queryKey: ['offline', 'metrics'],
    queryFn: () => offlineDB.getLatestMetrics(),
    refetchInterval: 30000, // Check every 30 seconds
  });

  useEffect(() => {
    if (metrics?.lastSyncTime) {
      setLastSyncTime(metrics.lastSyncTime);
    }
  }, [metrics]);

  return {
    isOnline,
    lastSyncTime,
    pendingSyncs: metrics?.pendingSyncs || 0,
    failedSyncs: metrics?.failedSyncs || 0
  };
}

// ============================================================
// OFFLINE MESSAGES HOOKS
// ============================================================

export function useOfflineMessages() {
  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery({
    queryKey: QueryKeys.messages,
    queryFn: () => offlineDB.getMessages(100), // Get last 100 messages
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addMessageMutation = useMutation({
    mutationFn: async (message: Omit<OfflineMessage, 'localId' | 'synced' | 'lastModified' | 'syncAttempts'>) => {
      return await offlineDB.addMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.messages });
    }
  });

  const updateMessageMutation = useMutation({
    mutationFn: async ({ localId, updates }: { localId: string; updates: Partial<OfflineMessage> }) => {
      return await offlineDB.updateMessage(localId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.messages });
    }
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (localId: string) => {
      return await offlineDB.deleteMessage(localId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.messages });
    }
  });

  return {
    messages,
    isLoading,
    error,
    addMessage: addMessageMutation.mutate,
    updateMessage: updateMessageMutation.mutate,
    deleteMessage: deleteMessageMutation.mutate,
    isAdding: addMessageMutation.isPending,
    isUpdating: updateMessageMutation.isPending,
    isDeleting: deleteMessageMutation.isPending
  };
}

// ============================================================
// OFFLINE CONTEXT HOOKS
// ============================================================

export function useOfflineContexts() {
  const queryClient = useQueryClient();

  const { data: contexts, isLoading, error } = useQuery({
    queryKey: QueryKeys.contextSegments(),
    queryFn: () => offlineDB.getContexts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const addContextMutation = useMutation({
    mutationFn: async (context: Omit<OfflineContextSegment, 'localId' | 'synced' | 'lastModified' | 'syncAttempts'>) => {
      return await offlineDB.addContext(context);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.contextSegments });
    }
  });

  const updateContextMutation = useMutation({
    mutationFn: async ({ localId, updates }: { localId: string; updates: Partial<OfflineContextSegment> }) => {
      return await offlineDB.updateContext(localId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.contextSegments });
    }
  });

  const deleteContextMutation = useMutation({
    mutationFn: async (localId: string) => {
      return await offlineDB.deleteContext(localId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.contextSegments });
    }
  });

  return {
    contexts,
    isLoading,
    error,
    addContext: addContextMutation.mutate,
    updateContext: updateContextMutation.mutate,
    deleteContext: deleteContextMutation.mutate,
    isAdding: addContextMutation.isPending,
    isUpdating: updateContextMutation.isPending,
    isDeleting: deleteContextMutation.isPending
  };
}

// ============================================================
// OFFLINE SETTINGS HOOKS
// ============================================================

export function useOfflineSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: QueryKeys.appSettings(),
    queryFn: () => offlineDB.getAllSettings(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const setSettingMutation = useMutation({
    mutationFn: async ({ category, key, value }: { category: string; key: string; value: any }) => {
      return await offlineDB.setSetting(category, key, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.appSettings });
    }
  });

  const getSetting = useCallback((category: string, key: string) => {
    return settings?.[`${category}:${key}`];
  }, [settings]);

  return {
    settings,
    isLoading,
    error,
    setSetting: setSettingMutation.mutate,
    getSetting,
    isSetting: setSettingMutation.isPending
  };
}

// ============================================================
// SYNC QUEUE HOOKS
// ============================================================

export function useSyncQueue() {
  const { data: pendingSyncs, isLoading } = useQuery({
    queryKey: ['offline', 'syncQueue'],
    queryFn: () => offlineDB.getPendingSyncs(),
    refetchInterval: 60000, // Check every minute
  });

  const pendingCount = pendingSyncs?.length || 0;

  return {
    pendingSyncs,
    pendingCount,
    isLoading
  };
}

// ============================================================
// OFFLINE STORAGE STATS HOOK
// ============================================================

export function useOfflineStats() {
  const { data: storageUsage, isLoading } = useQuery({
    queryKey: ['offline', 'storage'],
    queryFn: () => offlineDB.getStorageUsage(),
    refetchInterval: 30000, // Check every 30 seconds
  });

  return {
    storageUsage,
    isLoading,
    totalItems: storageUsage?.total || 0,
    messagesCount: storageUsage?.messages || 0,
    contextsCount: storageUsage?.contexts || 0,
    settingsCount: storageUsage?.settings || 0,
    workflowsCount: storageUsage?.workflows || 0
  };
}

// ============================================================
// CONFLICT RESOLUTION HOOKS
// ============================================================

export function useConflictResolution() {
  const { data: conflictedMessages } = useQuery({
    queryKey: ['offline', 'conflicts', 'messages'],
    queryFn: async () => {
      return await offlineDB.messages.where('conflict').notEqual(undefined).toArray();
    }
  });

  const { data: conflictedContexts } = useQuery({
    queryKey: ['offline', 'conflicts', 'contexts'],
    queryFn: async () => {
      return await offlineDB.contexts.where('conflict').notEqual(undefined).toArray();
    }
  });

  const totalConflicts = (conflictedMessages?.length || 0) + (conflictedContexts?.length || 0);

  return {
    conflictedMessages: conflictedMessages || [],
    conflictedContexts: conflictedContexts || [],
    totalConflicts,
    hasConflicts: totalConflicts > 0
  };
}

// ============================================================
// HYBRID ONLINE/OFFLINE HOOKS
// ============================================================

/**
 * Enhanced message hook that seamlessly integrates online and offline storage
 */
export function useHybridMessages() {
  const { isOnline } = useOfflineStatus();
  const offlineMessages = useOfflineMessages();

  // Use online messages when available, fallback to offline
  const { data: onlineMessages, isLoading: onlineLoading } = useQuery({
    queryKey: QueryKeys.messageHistory(100),
    queryFn: async () => {
      const { messageQueries } = await import('../lib/queries');
      return await messageQueries.getHistory(100);
    },
    enabled: isOnline,
    staleTime: 1000 * 60 * 2 // 2 minutes
  });

  const mergedMessages = onlineMessages || offlineMessages.messages || [];
  const isLoading = !isOnline ? offlineMessages.isLoading : (onlineLoading && offlineMessages.isLoading);

  return {
    messages: mergedMessages,
    isLoading,
    isOffline: !isOnline,
    offlineCount: offlineMessages.messages?.length || 0,
    addMessage: offlineMessages.addMessage,
    updateMessage: offlineMessages.updateMessage,
    deleteMessage: offlineMessages.deleteMessage
  };
}

/**
 * Enhanced context hook that seamlessly integrates online and offline storage
 */
export function useHybridContexts() {
  const { isOnline } = useOfflineStatus();
  const offlineContexts = useOfflineContexts();

  // Use online contexts when available, fallback to offline
  const { data: onlineContexts, isLoading: onlineLoading } = useQuery({
    queryKey: QueryKeys.contextSegments(),
    queryFn: async () => {
      const { contextQueries } = await import('../lib/queries');
      return await contextQueries.getSegments();
    },
    enabled: isOnline,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const mergedContexts = onlineContexts || offlineContexts.contexts || [];
  const isLoading = !isOnline ? offlineContexts.isLoading : (onlineLoading && offlineContexts.isLoading);

  return {
    contexts: mergedContexts,
    isLoading,
    isOffline: !isOnline,
    offlineCount: offlineContexts.contexts?.length || 0,
    addContext: offlineContexts.addContext,
    updateContext: offlineContexts.updateContext,
    deleteContext: offlineContexts.deleteContext
  };
}

/**
 * Enhanced settings hook that seamlessly integrates online and offline storage
 */
export function useHybridSettings() {
  const { isOnline } = useOfflineStatus();
  const offlineSettings = useOfflineSettings();

  // Use online settings when available, merge with offline
  const { data: onlineSettings, isLoading: onlineLoading } = useQuery({
    queryKey: QueryKeys.appSettings(),
    queryFn: async () => {
      const { settingsQueries } = await import('../lib/queries');
      return await settingsQueries.getAppSettings();
    },
    enabled: isOnline,
    staleTime: 1000 * 60 * 30 // 30 minutes
  });

  // Merge online and offline settings, online takes precedence
  const mergedSettings = onlineSettings ? { ...offlineSettings.settings, ...onlineSettings } : offlineSettings.settings;
  const isLoading = !isOnline ? offlineSettings.isLoading : (onlineLoading && offlineSettings.isLoading);

  return {
    settings: mergedSettings,
    isLoading,
    isOffline: !isOnline,
    setSetting: offlineSettings.setSetting,
    getSetting: offlineSettings.getSetting
  };
}

// Export offline sync manager
export { offlineSync } from '../lib/offline/sync';