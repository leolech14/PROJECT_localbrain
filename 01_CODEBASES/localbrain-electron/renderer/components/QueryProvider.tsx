/**
 * React Query Provider - T011 Implementation
 * ==========================================
 *
 * TanStack Query provider with SSR support and error boundaries
 * Integrates with LocalBrain's existing context management system
 */

"use client";

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';

// Import our query client factory
import { createQueryClient } from '../lib/queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
  client?: QueryClient;
  enableDevtools?: boolean;
}

// Error fallback component
function QueryErrorFallback({ error, resetErrorBoundary }: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">
              Query Error
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {error.message || 'An error occurred while fetching data.'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

// Loading component for suspense
export function QueryLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export function QueryProvider({
  children,
  client: externalClient,
  enableDevtools = process.env.NODE_ENV === 'development'
}: QueryProviderProps) {
  const [queryClient] = useState(() => externalClient || createQueryClient());

  // Cleanup function for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log query cache size in development
      const logCacheSize = () => {
        const cache = queryClient.getQueryCache();
        console.log(`📊 Query Cache: ${cache.getAll().length} queries cached`);
      };

      const interval = setInterval(logCacheSize, 30000); // Log every 30 seconds
      return () => clearInterval(interval);
    }
  }, [queryClient]);

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          FallbackComponent={QueryErrorFallback}
          onReset={reset}
          onError={(error, errorInfo) => {
            console.error('React Query Error:', error, errorInfo);

            // In development, you might want to send errors to a service
            if (process.env.NODE_ENV === 'development') {
              console.groupCollapsed('Query Error Details');
              console.error('Error:', error);
              console.error('Error Info:', errorInfo);
              console.error('Active Queries:', queryClient.getQueryCache().getAll());
              console.groupEnd();
            }
          }}
        >
          <QueryClientProvider client={queryClient}>
            {children}
            {enableDevtools && (
              <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="bottom-left"
                position="bottom"
              />
            )}
          </QueryClientProvider>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

// Hook to get the query client instance
export function useQueryClient() {
  const { useQueryClient: useTanStackQueryClient } = require('@tanstack/react-query');
  return useTanStackQueryClient();
}

// Prefetching utility for server-side data loading
export function prefetchQueries(queryClient: QueryClient) {
  // Prefetch essential queries during SSR or app initialization
  const prefetchPromises = [
    // AI Provider status
    queryClient.prefetchQuery({
      queryKey: ['aiProvider', 'status'],
      queryFn: async () => {
        try {
          const { aiProviderQueries } = await import('../lib/queries');
          return await aiProviderQueries.getStatus();
        } catch {
          return null; // Graceful fallback for SSR
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),

    // App settings
    queryClient.prefetchQuery({
      queryKey: ['settings', 'app'],
      queryFn: async () => {
        try {
          const { settingsQueries } = await import('../lib/queries');
          return await settingsQueries.getAppSettings();
        } catch {
          return null; // Graceful fallback for SSR
        }
      },
      staleTime: 1000 * 60 * 30, // 30 minutes
    }),

    // System health
    queryClient.prefetchQuery({
      queryKey: ['system', 'health'],
      queryFn: async () => {
        try {
          const { systemQueries } = await import('../lib/queries');
          return await systemQueries.getHealth();
        } catch {
          return null; // Graceful fallback for SSR
        }
      },
      staleTime: 1000 * 60, // 1 minute
    }),
  ];

  return Promise.all(prefetchPromises);
}

// Query invalidation utilities
export const queryInvalidation = {
  // Invalidate all AI provider related queries
  invalidateAIProvider: async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries({ queryKey: ['aiProvider'] });
  },

  // Invalidate all message related queries
  invalidateMessages: async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries({ queryKey: ['messages'] });
  },

  // Invalidate all context related queries
  invalidateContext: async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries({ queryKey: ['contextPool'] });
  },

  // Invalidate all voice related queries
  invalidateVoice: async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries({ queryKey: ['voice'] });
  },

  // Invalidate all settings related queries
  invalidateSettings: async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries({ queryKey: ['settings'] });
  },

  // Invalidate all workflow related queries
  invalidateWorkflows: async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries({ queryKey: ['workflows'] });
  },

  // Invalidate all system related queries
  invalidateSystem: async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries({ queryKey: ['system'] });
  },

  // Invalidate all queries (emergency reset)
  invalidateAll: async (queryClient: QueryClient) => {
    await queryClient.invalidateQueries();
  },

  // Refetch all active queries
  refetchAll: async (queryClient: QueryClient) => {
    await queryClient.refetchQueries();
  },
};