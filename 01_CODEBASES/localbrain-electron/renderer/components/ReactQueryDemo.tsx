/**
 * React Query Integration Demo - T011 Implementation
 * ===================================================
 *
 * Demo component showcasing React Query + SSR integration
 * Displays real-time data fetching and synchronization capabilities
 */

"use client";

import React from 'react';
import {
  useAIProviderQuery,
  useSystemHealthQuery,
  useAppSettingsQuery,
  useMessagesQuery,
  useToggleMicrophoneMutation,
  useSwitchProviderMutation,
  useRefreshAll,
} from '../hooks/useQueryIntegration';

export function ReactQueryDemo() {
  // Query hooks for data fetching
  const aiProviderQuery = useAIProviderQuery();
  const systemHealthQuery = useSystemHealthQuery();
  const settingsQuery = useAppSettingsQuery();
  const messagesQuery = useMessagesQuery(10); // Last 10 messages

  // Mutation hooks for actions
  const toggleMicrophoneMutation = useToggleMicrophoneMutation();
  const switchProviderMutation = useSwitchProviderMutation();
  const refreshAll = useRefreshAll();

  const handleToggleMicrophone = () => {
    toggleMicrophoneMutation.mutate();
  };

  const handleSwitchProvider = (provider: string) => {
    switchProviderMutation.mutate(provider);
  };

  const handleRefreshAll = () => {
    refreshAll();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            React Query + SSR Integration Demo
          </h1>
          <p className="text-gray-600">
            T011 Implementation - Server State Management with TanStack Query
          </p>
        </div>

        {/* System Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              System Health
            </h2>
            {systemHealthQuery.isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-gray-600">Loading...</span>
              </div>
            ) : systemHealthQuery.error ? (
              <div className="text-red-600">
                Error: {systemHealthQuery.error.message}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    systemHealthQuery.data?.healthy ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {systemHealthQuery.data?.healthy ? 'Healthy' : 'Unhealthy'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-medium">
                    {systemHealthQuery.data?.uptime ?
                      `${Math.round(systemHealthQuery.data.uptime / 1000)}s` :
                      'Unknown'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory:</span>
                  <span className="font-medium">
                    {systemHealthQuery.data?.memoryUsage ?
                      `${Math.round(systemHealthQuery.data.memoryUsage / 1024 / 1024)}MB` :
                      'Unknown'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* AI Provider Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              AI Provider
            </h2>
            {aiProviderQuery.isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-gray-600">Loading...</span>
              </div>
            ) : aiProviderQuery.error ? (
              <div className="text-red-600">
                Error: {aiProviderQuery.error.message}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current:</span>
                    <span className="font-medium capitalize">
                      {aiProviderQuery.data?.currentProvider}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      aiProviderQuery.data?.isConnected ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {aiProviderQuery.data?.isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-gray-600 text-sm">Switch Provider:</span>
                  <div className="flex flex-wrap gap-2">
                    {['claude', 'openai', 'gemini'].map((provider) => (
                      <button
                        key={provider}
                        onClick={() => handleSwitchProvider(provider)}
                        disabled={switchProviderMutation.isPending}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          aiProviderQuery.data?.currentProvider === provider
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } ${
                          switchProviderMutation.isPending
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        {provider}
                        {switchProviderMutation.isPending &&
                         switchProviderMutation.variables === provider &&
                         '...'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            App Settings
          </h2>
          {settingsQuery.isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-gray-600">Loading settings...</span>
            </div>
          ) : settingsQuery.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Theme:</span>
                  <span className="font-medium capitalize">
                    {settingsQuery.data.theme}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Default Provider:</span>
                  <span className="font-medium capitalize">
                    {settingsQuery.data.ai.defaultProvider}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Voice Enabled:</span>
                  <span className={`font-medium ${
                    settingsQuery.data.voice.enabled ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {settingsQuery.data.voice.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stream Enabled:</span>
                  <span className={`font-medium ${
                    settingsQuery.data.ai.streamEnabled ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {settingsQuery.data.ai.streamEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">No settings available</div>
          )}
        </div>

        {/* Voice Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Voice Controls
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Microphone Status</p>
              <p className="text-sm text-gray-500">
                {toggleMicrophoneMutation.isPending ? 'Toggling...' : 'Click to toggle'}
              </p>
            </div>
            <button
              onClick={handleToggleMicrophone}
              disabled={toggleMicrophoneMutation.isPending}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                toggleMicrophoneMutation.isPending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {toggleMicrophoneMutation.isPending ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Toggling...
                </span>
              ) : (
                'Toggle Microphone'
              )}
            </button>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Messages ({messagesQuery.data?.length || 0})
          </h2>
          {messagesQuery.isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-gray-600">Loading messages...</span>
            </div>
          ) : messagesQuery.data && messagesQuery.data.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {messagesQuery.data.slice(0, 5).map((message: any) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'bg-gray-50 border-l-4 border-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-medium text-sm ${
                      message.role === 'user' ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-center py-4">
              No messages yet
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Query Controls
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleRefreshAll}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Refresh All Data
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full ${
                systemHealthQuery.data?.healthy ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>
                {systemHealthQuery.isLoading ? 'Loading...' :
                 systemHealthQuery.error ? 'Error' :
                 systemHealthQuery.data?.healthy ? 'System Healthy' : 'System Unhealthy'}
              </span>
            </div>
          </div>

          {/* Query Status Indicators */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="text-center">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                  aiProviderQuery.isLoading ? 'bg-yellow-500' :
                  aiProviderQuery.error ? 'bg-red-500' :
                  'bg-green-500'
                }`}></div>
                <span className="text-gray-600">AI Provider</span>
              </div>
              <div className="text-center">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                  systemHealthQuery.isLoading ? 'bg-yellow-500' :
                  systemHealthQuery.error ? 'bg-red-500' :
                  'bg-green-500'
                }`}></div>
                <span className="text-gray-600">System Health</span>
              </div>
              <div className="text-center">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                  settingsQuery.isLoading ? 'bg-yellow-500' :
                  settingsQuery.error ? 'bg-red-500' :
                  'bg-green-500'
                }`}></div>
                <span className="text-gray-600">Settings</span>
              </div>
              <div className="text-center">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                  messagesQuery.isLoading ? 'bg-yellow-500' :
                  messagesQuery.error ? 'bg-red-500' :
                  'bg-green-500'
                }`}></div>
                <span className="text-gray-600">Messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}