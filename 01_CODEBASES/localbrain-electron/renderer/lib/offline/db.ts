/**
 * IndexedDB Database Schema - T014 Implementation
 * ================================================
 *
 * Comprehensive offline storage for LocalBrain with Dexie.js
 * Enables offline-first functionality with automatic synchronization
 */

import Dexie, { Table } from 'dexie';

// ============================================================
// OFFLINE DATA MODELS
// ============================================================

export interface OfflineMessage {
  id?: string;
  localId: string; // Unique local identifier
  serverId?: string; // Server-side ID when synced
  role: 'user' | 'assistant';
  text: string;
  ts: Date;
  isStreaming: boolean;
  synced: boolean; // Sync status with server
  lastModified: Date;
  syncAttempts: number;
  conflict?: {
    serverData: any;
    reason: string;
  };
}

export interface OfflineContextSegment {
  id?: string;
  localId: string;
  serverId?: string;
  title: string;
  content: string;
  tokens: number;
  type: string;
  metadata: Record<string, any>;
  isActive: boolean;
  synced: boolean;
  lastModified: Date;
  syncAttempts: number;
  conflict?: {
    serverData: any;
    reason: string;
  };
}

export interface OfflineSettings {
  id?: number;
  category: string; // 'app', 'ai', 'voice', etc.
  key: string;
  value: any;
  synced: boolean;
  lastModified: Date;
  syncAttempts: number;
}

export interface OfflineWorkflow {
  id?: string;
  localId: string;
  serverId?: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'error';
  config: Record<string, any>;
  results: any[];
  synced: boolean;
  lastModified: Date;
  syncAttempts: number;
  conflict?: {
    serverData: any;
    reason: string;
  };
}

export interface OfflineSyncQueue {
  id?: number;
  entityType: 'message' | 'context' | 'settings' | 'workflow';
  localId: string;
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  retryCount: number;
  lastError?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface OfflineSystemMetrics {
  id?: number;
  timestamp: Date;
  isOnline: boolean;
  lastSyncTime: Date;
  pendingSyncs: number;
  failedSyncs: number;
  storageUsage: {
    messages: number;
    contexts: number;
    settings: number;
    workflows: number;
    total: number;
  };
}

// ============================================================
// MAIN OFFLINE DATABASE CLASS
// ============================================================

export class LocalBrainOfflineDB extends Dexie {
  // Tables
  messages!: Table<OfflineMessage>;
  contexts!: Table<OfflineContextSegment>;
  settings!: Table<OfflineSettings>;
  workflows!: Table<OfflineWorkflow>;
  syncQueue!: Table<OfflineSyncQueue>;
  metrics!: Table<OfflineSystemMetrics>;

  constructor() {
    super('LocalBrainOfflineDB');

    // Define schema
    this.version(1).stores({
      messages: '++id, localId, serverId, role, ts, synced, lastModified',
      contexts: '++id, localId, serverId, type, isActive, synced, lastModified',
      settings: '++id, category, key, synced, lastModified',
      workflows: '++id, localId, serverId, status, synced, lastModified',
      syncQueue: '++id, entityType, localId, operation, timestamp, status',
      metrics: '++id, timestamp, isOnline, lastSyncTime'
    });

    // Data hooks for automatic timestamping
    this.messages.hook('creating', (primKey, obj) => {
      obj.lastModified = new Date();
      obj.syncAttempts = 0;
    });

    this.messages.hook('updating', (modifications, primKey, obj) => {
      modifications.lastModified = new Date();
    });

    this.contexts.hook('creating', (primKey, obj) => {
      obj.lastModified = new Date();
      obj.syncAttempts = 0;
    });

    this.contexts.hook('updating', (modifications, primKey, obj) => {
      modifications.lastModified = new Date();
    });

    this.workflows.hook('creating', (primKey, obj) => {
      obj.lastModified = new Date();
      obj.syncAttempts = 0;
    });

    this.workflows.hook('updating', (modifications, primKey, obj) => {
      modifications.lastModified = new Date();
    });
  }

  // ============================================================
  // MESSAGE OPERATIONS
  // ============================================================

  async addMessage(message: Omit<OfflineMessage, 'localId' | 'synced' | 'lastModified' | 'syncAttempts'>) {
    const offlineMessage: OfflineMessage = {
      ...message,
      localId: this.generateLocalId(),
      synced: false,
      lastModified: new Date(),
      syncAttempts: 0,
    };

    const id = await this.messages.add(offlineMessage);

    // Add to sync queue
    await this.addToSyncQueue({
      entityType: 'message',
      localId: offlineMessage.localId,
      operation: 'create',
      data: offlineMessage
    });

    return { id, localId: offlineMessage.localId };
  }

  async updateMessage(localId: string, updates: Partial<OfflineMessage>) {
    const updated = await this.messages.update({ localId }, {
      ...updates,
      synced: false,
      syncAttempts: 0
    });

    if (updated) {
      await this.addToSyncQueue({
        entityType: 'message',
        localId,
        operation: 'update',
        data: updates
      });
    }

    return updated;
  }

  async deleteMessage(localId: string) {
    await this.addToSyncQueue({
      entityType: 'message',
      localId,
      operation: 'delete',
      data: { localId }
    });

    return await this.messages.delete(localId);
  }

  async getMessages(limit?: number): Promise<OfflineMessage[]> {
    let query = this.messages.orderBy('ts').reverse();
    if (limit) {
      query = query.limit(limit);
    }
    return await query.toArray();
  }

  async getUnsyncedMessages(): Promise<OfflineMessage[]> {
    return await this.messages.where('synced').equals(false).toArray();
  }

  // ============================================================
  // CONTEXT OPERATIONS
  // ============================================================

  async addContext(context: Omit<OfflineContextSegment, 'localId' | 'synced' | 'lastModified' | 'syncAttempts'>) {
    const offlineContext: OfflineContextSegment = {
      ...context,
      localId: this.generateLocalId(),
      synced: false,
      lastModified: new Date(),
      syncAttempts: 0,
    };

    const id = await this.contexts.add(offlineContext);

    await this.addToSyncQueue({
      entityType: 'context',
      localId: offlineContext.localId,
      operation: 'create',
      data: offlineContext
    });

    return { id, localId: offlineContext.localId };
  }

  async updateContext(localId: string, updates: Partial<OfflineContextSegment>) {
    const updated = await this.contexts.update({ localId }, {
      ...updates,
      synced: false,
      syncAttempts: 0
    });

    if (updated) {
      await this.addToSyncQueue({
        entityType: 'context',
        localId,
        operation: 'update',
        data: updates
      });
    }

    return updated;
  }

  async deleteContext(localId: string) {
    await this.addToSyncQueue({
      entityType: 'context',
      localId,
      operation: 'delete',
      data: { localId }
    });

    return await this.contexts.delete(localId);
  }

  async getContexts(): Promise<OfflineContextSegment[]> {
    return await this.contexts.toArray();
  }

  async getUnsyncedContexts(): Promise<OfflineContextSegment[]> {
    return await this.contexts.where('synced').equals(false).toArray();
  }

  // ============================================================
  // SETTINGS OPERATIONS
  // ============================================================

  async setSetting(category: string, key: string, value: any) {
    const existing = await this.settings.where({ category, key }).first();

    if (existing) {
      await this.settings.update(existing.id!, {
        value,
        synced: false,
        lastModified: new Date(),
        syncAttempts: 0
      });
    } else {
      await this.settings.add({
        category,
        key,
        value,
        synced: false,
        lastModified: new Date(),
        syncAttempts: 0
      });
    }

    await this.addToSyncQueue({
      entityType: 'settings',
      localId: `${category}:${key}`,
      operation: 'update',
      data: { category, key, value }
    });
  }

  async getSetting(category: string, key: string): Promise<any | undefined> {
    const setting = await this.settings.where({ category, key }).first();
    return setting?.value;
  }

  async getAllSettings(): Promise<Record<string, any>> {
    const settings = await this.settings.toArray();
    const result: Record<string, any> = {};

    settings.forEach(setting => {
      result[`${setting.category}:${setting.key}`] = setting.value;
    });

    return result;
  }

  // ============================================================
  // WORKFLOW OPERATIONS
  // ============================================================

  async addWorkflow(workflow: Omit<OfflineWorkflow, 'localId' | 'synced' | 'lastModified' | 'syncAttempts'>) {
    const offlineWorkflow: OfflineWorkflow = {
      ...workflow,
      localId: this.generateLocalId(),
      synced: false,
      lastModified: new Date(),
      syncAttempts: 0,
    };

    const id = await this.workflows.add(offlineWorkflow);

    await this.addToSyncQueue({
      entityType: 'workflow',
      localId: offlineWorkflow.localId,
      operation: 'create',
      data: offlineWorkflow
    });

    return { id, localId: offlineWorkflow.localId };
  }

  async getWorkflows(): Promise<OfflineWorkflow[]> {
    return await this.workflows.toArray();
  }

  // ============================================================
  // SYNC QUEUE OPERATIONS
  // ============================================================

  async addToSyncQueue(item: Omit<OfflineSyncQueue, 'id' | 'timestamp' | 'retryCount' | 'status'>) {
    return await this.syncQueue.add({
      ...item,
      timestamp: new Date(),
      retryCount: 0,
      status: 'pending'
    });
  }

  async getPendingSyncs(): Promise<OfflineSyncQueue[]> {
    return await this.syncQueue
      .where('status')
      .equals('pending')
      .or('status')
      .equals('failed')
      .toArray();
  }

  async markSyncCompleted(localId: string, entityType: string) {
    await this.syncQueue.where({ localId, entityType }).modify({ status: 'completed' });

    // Mark the entity as synced
    switch (entityType) {
      case 'message':
        await this.messages.update({ localId }, { synced: true });
        break;
      case 'context':
        await this.contexts.update({ localId }, { synced: true });
        break;
      case 'settings':
        await this.settings.update({ localId }, { synced: true });
        break;
      case 'workflow':
        await this.workflows.update({ localId }, { synced: true });
        break;
    }
  }

  // ============================================================
  // METRICS OPERATIONS
  // ============================================================

  async recordMetrics(metrics: Omit<OfflineSystemMetrics, 'id'>) {
    // Clean up old metrics (keep only last 100 entries)
    const count = await this.metrics.count();
    if (count > 100) {
      const toDelete = await this.metrics.orderBy('id').limit(count - 100).toArray();
      await this.metrics.bulkDelete(toDelete.map(m => m.id!));
    }

    return await this.metrics.add(metrics);
  }

  async getLatestMetrics(): Promise<OfflineSystemMetrics | undefined> {
    return await this.metrics.orderBy('timestamp').reverse().first();
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  private generateLocalId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async clearAllData() {
    return await this.transaction('rw', this.tables, async () => {
      await Promise.all([
        this.messages.clear(),
        this.contexts.clear(),
        this.settings.clear(),
        this.workflows.clear(),
        this.syncQueue.clear(),
        this.metrics.clear()
      ]);
    });
  }

  async getStorageUsage(): Promise<Record<string, number>> {
    const [messages, contexts, settings, workflows] = await Promise.all([
      this.messages.count(),
      this.contexts.count(),
      this.settings.count(),
      this.workflows.count()
    ]);

    return {
      messages,
      contexts,
      settings,
      workflows,
      total: messages + contexts + settings + workflows
    };
  }
}

// Export singleton instance
export const offlineDB = new LocalBrainOfflineDB();