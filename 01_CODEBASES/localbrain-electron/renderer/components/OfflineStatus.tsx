/**
 * Offline Status Indicator - T014 Implementation
 * ================================================
 *
 * Real-time offline/online status indicator with sync information
 * Provides visual feedback and controls for offline functionality
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useOfflineStatus, useSyncQueue, useOfflineStats, useConflictResolution } from '../hooks/useOfflineStorage';
import { offlineSync } from '../lib/offline/sync';

export function OfflineStatus() {
  const { isOnline, lastSyncTime, pendingSyncs, failedSyncs } = useOfflineStatus();
  const { pendingCount } = useSyncQueue();
  const { totalItems } = useOfflineStats();
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Start auto-sync when coming online
  useEffect(() => {
    if (isOnline) {
      offlineSync.startAutoSync();
    } else {
      offlineSync.stopAutoSync();
    }
  }, [isOnline]);

  const handleForceSync = async () => {
    await offlineSync.forceSyncAll();
  };

  const handleClearSyncQueue = async () => {
    if (confirm('Are you sure you want to clear all pending syncs? This cannot be undone.')) {
      await offlineSync.clearSyncQueue();
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (pendingSyncs > 0) return 'bg-yellow-500';
    if (failedSyncs > 0) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (pendingSyncs > 0) return `Syncing (${pendingSyncs})`;
    if (failedSyncs > 0) return `Sync Errors (${failedSyncs})`;
    return 'Online';
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Main Status Indicator */}
      <div
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg cursor-pointer transition-all duration-200 ${getStatusColor()} ${
          isExpanded ? 'rounded-b-none' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Connection Status */}
        <div className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-white' : 'bg-white opacity-50 animate-pulse'
        }`}></div>

        {/* Status Text */}
        <span className="text-white text-sm font-medium">
          {getStatusText()}
        </span>

        {/* Storage Indicator */}
        {totalItems > 0 && (
          <span className="text-white text-xs opacity-75">
            ({totalItems} items)
          </span>
        )}

        {/* Expand/Collapse Icon */}
        <svg
          className={`w-4 h-4 text-white transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded Details Panel */}
      {isExpanded && (
        <div className="bg-white rounded-t-none rounded-lg shadow-lg border border-gray-200 w-80">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Offline Status</h3>
          </div>

          {/* Status Details */}
          <div className="px-4 py-3 space-y-3">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Connection:</span>
              <span className={`text-sm font-medium ${
                isOnline ? 'text-green-600' : 'text-red-600'
              }`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Last Sync */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Sync:</span>
              <span className="text-sm text-gray-900">
                {formatLastSync(lastSyncTime)}
              </span>
            </div>

            {/* Pending Syncs */}
            {pendingSyncs > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Syncs:</span>
                <span className="text-sm font-medium text-yellow-600">
                  {pendingSyncs}
                </span>
              </div>
            )}

            {/* Failed Syncs */}
            {failedSyncs > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Failed Syncs:</span>
                <span className="text-sm font-medium text-red-600">
                  {failedSyncs}
                </span>
              </div>
            )}

            {/* Local Storage */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Local Storage:</span>
              <span className="text-sm text-gray-900">
                {totalItems} items
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-3 border-t border-gray-200 space-y-2">
            {/* Force Sync Button */}
            {isOnline && pendingSyncs > 0 && (
              <button
                onClick={handleForceSync}
                className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Force Sync Now
              </button>
            )}

            {/* Clear Queue Button */}
            {pendingSyncs > 0 && (
              <button
                onClick={handleClearSyncQueue}
                className="w-full px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                Clear Sync Queue
              </button>
            )}

            {/* Show Details Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              {showDetails ? 'Hide' : 'Show'} Advanced Details
            </button>
          </div>

          {/* Advanced Details */}
          {showDetails && (
            <div className="px-4 py-3 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Advanced</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div>Sync Interval: 30 seconds</div>
                <div>Max Retries: 3</div>
                <div>Batch Size: 10 items</div>
                <div>Conflict Resolution: Server priority</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Conflict Resolution Dialog
 */
export function ConflictResolutionDialog() {
  const { hasConflicts, conflictedMessages, conflictedContexts } = useConflictResolution();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<any>(null);

  useEffect(() => {
    if (hasConflicts && !isOpen) {
      setIsOpen(true);
    }
  }, [hasConflicts, isOpen]);

  const handleResolve = async (resolution: 'client' | 'server') => {
    if (!selectedConflict) return;

    await offlineSync.resolveConflict(
      selectedConflict.entityType,
      selectedConflict.localId,
      resolution
    );

    setSelectedConflict(null);
  };

  const totalConflicts = conflictedMessages.length + conflictedContexts.length;

  if (!hasConflicts) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Sync Conflicts Detected
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {totalConflicts} item{totalConflicts > 1 ? 's' : ''} need conflict resolution
          </p>
        </div>

        {/* Conflict List */}
        <div className="px-6 py-4 max-h-64 overflow-y-auto">
          <div className="space-y-3">
            {conflictedMessages.map((conflict) => (
              <div
                key={conflict.localId}
                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedConflict({ ...conflict, entityType: 'message' })}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Message Conflict
                  </span>
                  <span className="text-xs text-gray-500">
                    {conflict.conflict?.reason || 'Unknown reason'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {conflict.text.substring(0, 100)}...
                </p>
              </div>
            ))}

            {conflictedContexts.map((conflict) => (
              <div
                key={conflict.localId}
                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedConflict({ ...conflict, entityType: 'context' })}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Context Conflict
                  </span>
                  <span className="text-xs text-gray-500">
                    {conflict.conflict?.reason || 'Unknown reason'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {conflict.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Options */}
        {selectedConflict && (
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Resolve Conflict for: {selectedConflict.localId}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleResolve('client')}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Keep My Version (Client)
              </button>
              <button
                onClick={() => handleResolve('server')}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
              >
                Use Server Version
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}