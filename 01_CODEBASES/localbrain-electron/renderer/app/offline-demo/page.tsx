/**
 * Offline Demo Page - T014 Implementation
 * =====================================
 *
 * Comprehensive demo showcasing IndexedDB offline persistence
 * Tests online/offline transitions and sync functionality
 */

"use client";

import { useState } from 'react';
import {
  useOfflineStatus,
  useOfflineMessages,
  useHybridContexts,
  useOfflineStats,
  useSyncQueue,
  offlineSync
} from '@/hooks/useOfflineStorage';
import { OfflineStatus, ConflictResolutionDialog } from '@/components/OfflineStatus';

export default function OfflineDemoPage() {
  const [testMessage, setTestMessage] = useState('');
  const [testContext, setTestContext] = useState('');
  const [simulateOffline, setSimulateOffline] = useState(false);

  // Hooks for testing
  const { isOnline, lastSyncTime, pendingSyncs } = useOfflineStatus();
  const { messages, addMessage } = useOfflineMessages();
  const { contexts, addContext } = useHybridContexts();
  const { storageUsage } = useOfflineStats();
  const { pendingCount } = useSyncQueue();

  const handleAddMessage = () => {
    if (testMessage.trim()) {
      addMessage({
        role: 'user',
        text: testMessage,
        ts: new Date(),
        isStreaming: false
      });
      setTestMessage('');
    }
  };

  const handleAddContext = () => {
    if (testContext.trim()) {
      addContext({
        title: `Test Context ${Date.now()}`,
        content: testContext,
        tokens: Math.floor(testContext.length / 4),
        type: 'text',
        metadata: { source: 'demo', created: new Date().toISOString() },
        isActive: true
      });
      setTestContext('');
    }
  };

  const handleToggleOffline = () => {
    setSimulateOffline(!simulateOffline);
    // In a real app, you'd use browser dev tools to toggle network
    alert(`In a real app, use browser dev tools to toggle network. Simulating: ${!simulateOffline ? 'offline' : 'online'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Offline Persistence Demo
          </h1>
          <p className="text-gray-600">
            T014 Implementation - Test IndexedDB offline functionality and synchronization
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Connection Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  isOnline ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Syncs:</span>
                <span className="font-medium text-yellow-600">
                  {pendingCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Sync:</span>
                <span className="font-medium text-gray-900">
                  {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Never'}
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleOffline}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Simulate Offline/Online
            </button>
          </div>

          {/* Storage Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Local Storage</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{storageUsage.total || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Messages:</span>
                <span className="font-medium">{storageUsage.messagesCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Contexts:</span>
                <span className="font-medium">{storageUsage.contextsCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Settings:</span>
                <span className="font-medium">{storageUsage.settingsCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Controls</h2>
            <div className="space-y-3">
              <button
                onClick={() => offlineSync.forceSyncAll()}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Force Sync Now
              </button>
              <button
                onClick={() => offlineSync.clearSyncQueue()}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Clear Sync Queue
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>

        {/* Add Test Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Add Message */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Test Message</h2>
            <div className="space-y-4">
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Type a test message..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <button
                onClick={handleAddMessage}
                disabled={!testMessage.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Message
              </button>
            </div>
          </div>

          {/* Add Context */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Test Context</h2>
            <div className="space-y-4">
              <textarea
                value={testContext}
                onChange={(e) => setTestContext(e.target.value)}
                placeholder="Type test context content..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <button
                onClick={handleAddContext}
                disabled={!testContext.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Context
              </button>
            </div>
          </div>
        </div>

        {/* Display Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Messages */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Messages ({messages.length})
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No messages yet</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'bg-gray-50 border-l-4 border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-medium ${
                        message.role === 'user' ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {message.role === 'user' ? 'You' : 'Assistant'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.ts.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{message.text}</p>
                    {!message.synced && (
                      <div className="mt-2 text-xs text-yellow-600">
                        ⏳ Pending sync
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contexts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contexts ({contexts.length})
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {contexts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No contexts yet</p>
              ) : (
                contexts.map((context) => (
                  <div
                    key={context.id || context.localId}
                    className="p-3 rounded-lg bg-green-50 border-l-4 border-green-500"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-green-700">
                        {context.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {context.tokens} tokens
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {context.content}
                    </p>
                    {!context.synced && (
                      <div className="mt-2 text-xs text-yellow-600">
                        ⏳ Pending sync
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">How to Test Offline Functionality</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Add some messages and contexts using the forms above</li>
            <li>Toggle your network connection using browser dev tools (Network tab → Offline)</li>
            <li>Continue adding data while offline - it will be stored locally</li>
            <li>Toggle network back online</li>
            <li>Watch as data automatically syncs with the server</li>
            <li>Use the "Force Sync Now" button to manually trigger synchronization</li>
          </ol>
          <p className="mt-4 text-sm text-blue-600">
            <strong>Note:</strong> This demo simulates offline functionality. In production, data will sync with actual server endpoints.
          </p>
        </div>
      </div>

      {/* Status Indicators */}
      <OfflineStatus />
      <ConflictResolutionDialog />
    </div>
  );
}