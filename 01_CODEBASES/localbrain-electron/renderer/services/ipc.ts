// IPC Bridge - Electron Main ↔ Renderer Communication
// LocalBrain › Services › ipc.ts
// Communication layer between TypeScript UI and Swift backend

import {
  Message,
  ContextSegment,
  AIProviderType,
  AIProviderStatus,
  AppSettings,
  StreamChunk,
} from "../types";

// ============================================================
// IPC CHANNEL DEFINITIONS
// ============================================================

export const IPC_CHANNELS = {
  // AI Message Channels
  AI_SEND_MESSAGE: "ai:send-message",
  AI_STREAM_CHUNK: "ai:stream-chunk",
  AI_STREAM_COMPLETE: "ai:stream-complete",
  AI_STREAM_ERROR: "ai:stream-error",

  // AI Provider Channels
  AI_SWITCH_PROVIDER: "ai:switch-provider",
  AI_GET_STATUS: "ai:get-status",
  AI_STATUS_UPDATED: "ai:status-updated",
  AI_GET_MODELS: "ai:get-models",
  AI_SET_MODEL: "ai:set-model",

  // Context Channels
  CONTEXT_ADD_FILE: "context:add-file",
  CONTEXT_REMOVE_FILE: "context:remove-file",
  CONTEXT_TOGGLE: "context:toggle",
  CONTEXT_GET_POOL: "context:get-pool",
  CONTEXT_POOL_UPDATED: "context:pool-updated",

  // Voice Channels
  VOICE_TOGGLE_MIC: "voice:toggle-mic",
  VOICE_START_RECORDING: "voice:start-recording",
  VOICE_STOP_RECORDING: "voice:stop-recording",
  VOICE_AUDIO_LEVEL: "voice:audio-level",
  VOICE_TRANSCRIPTION: "voice:transcription",

  // Settings Channels
  SETTINGS_GET: "settings:get",
  SETTINGS_UPDATE: "settings:update",
  SETTINGS_UPDATED: "settings:updated",

  // API Key Channels
  API_KEY_SET: "api-key:set",
  API_KEY_GET: "api-key:get",
  API_KEY_DELETE: "api-key:delete",
  API_KEY_VALIDATE: "api-key:validate",

  // System Channels
  SYSTEM_GET_INFO: "system:get-info",
  SYSTEM_GET_METRICS: "system:get-metrics",
} as const;

// ============================================================
// IPC CLIENT CLASS
// ============================================================

class IPCClient {
  private ipcRenderer: any;

  constructor() {
    // Check if we're in Electron renderer process
    if (typeof window !== "undefined" && (window as any).ipcRenderer) {
      this.ipcRenderer = (window as any).ipcRenderer;
    } else {
      console.warn("IPC not available - running in browser mode");
    }
  }

  // ============================================================
  // GENERIC IPC METHODS
  // ============================================================

  /**
   * Send message and wait for response
   */
  async invoke<T = any>(channel: string, ...args: any[]): Promise<T> {
    if (!this.ipcRenderer) {
      throw new Error("IPC not available");
    }
    return this.ipcRenderer.invoke(channel, ...args);
  }

  /**
   * Send one-way message (no response expected)
   */
  send(channel: string, ...args: any[]): void {
    if (!this.ipcRenderer) {
      console.warn("IPC not available, skipping send:", channel);
      return;
    }
    this.ipcRenderer.send(channel, ...args);
  }

  /**
   * Listen for events from main process
   */
  on(channel: string, listener: (...args: any[]) => void): () => void {
    if (!this.ipcRenderer) {
      return () => {}; // No-op cleanup
    }

    this.ipcRenderer.on(channel, listener);

    // Return cleanup function
    return () => {
      this.ipcRenderer.removeListener(channel, listener);
    };
  }

  /**
   * Listen for single event (auto-cleanup after first call)
   */
  once(channel: string, listener: (...args: any[]) => void): void {
    if (!this.ipcRenderer) {
      return;
    }
    this.ipcRenderer.once(channel, listener);
  }

  // ============================================================
  // AI MESSAGE METHODS
  // ============================================================

  /**
   * Send message to AI provider (streaming)
   * Returns async iterator for stream chunks
   */
  async sendMessage(
    message: string,
    contextIds: string[] = []
  ): Promise<AsyncIterable<StreamChunk>> {
    if (!this.ipcRenderer) {
      throw new Error("IPC not available");
    }

    // Send message to main process
    const requestId = crypto.randomUUID();
    this.send(IPC_CHANNELS.AI_SEND_MESSAGE, { requestId, message, contextIds });

    // Return async iterator for stream chunks
    return this.createStreamIterator(requestId);
  }

  /**
   * Create async iterator for streaming response
   */
  private async *createStreamIterator(requestId: string): AsyncIterable<StreamChunk> {
    const chunks: StreamChunk[] = [];
    let isComplete = false;
    let error: Error | null = null;

    // Listen for chunks
    const chunkListener = (_event: any, data: { requestId: string; chunk: StreamChunk }) => {
      if (data.requestId === requestId) {
        chunks.push(data.chunk);
      }
    };

    // Listen for completion
    const completeListener = (_event: any, data: { requestId: string }) => {
      if (data.requestId === requestId) {
        isComplete = true;
      }
    };

    // Listen for errors
    const errorListener = (_event: any, data: { requestId: string; error: string }) => {
      if (data.requestId === requestId) {
        error = new Error(data.error);
        isComplete = true;
      }
    };

    this.on(IPC_CHANNELS.AI_STREAM_CHUNK, chunkListener);
    this.on(IPC_CHANNELS.AI_STREAM_COMPLETE, completeListener);
    this.on(IPC_CHANNELS.AI_STREAM_ERROR, errorListener);

    // Yield chunks as they arrive
    while (!isComplete) {
      if (chunks.length > 0) {
        yield chunks.shift()!;
      } else {
        // Wait a bit before checking again
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      if (error) throw error;
    }

    // Yield remaining chunks
    while (chunks.length > 0) {
      yield chunks.shift()!;
    }
  }

  // ============================================================
  // AI PROVIDER METHODS
  // ============================================================

  async switchProvider(provider: AIProviderType): Promise<void> {
    return this.invoke(IPC_CHANNELS.AI_SWITCH_PROVIDER, provider);
  }

  async getProviderStatus(): Promise<AIProviderStatus> {
    return this.invoke(IPC_CHANNELS.AI_GET_STATUS);
  }

  async getAvailableModels(provider: AIProviderType): Promise<string[]> {
    return this.invoke(IPC_CHANNELS.AI_GET_MODELS, provider);
  }

  async setModel(provider: AIProviderType, model: string): Promise<void> {
    return this.invoke(IPC_CHANNELS.AI_SET_MODEL, { provider, model });
  }

  onProviderStatusChange(listener: (status: AIProviderStatus) => void): () => void {
    return this.on(IPC_CHANNELS.AI_STATUS_UPDATED, (_event, status) => listener(status));
  }

  // ============================================================
  // CONTEXT METHODS
  // ============================================================

  async addContextFile(filePath: string): Promise<ContextSegment> {
    return this.invoke(IPC_CHANNELS.CONTEXT_ADD_FILE, filePath);
  }

  async removeContextFile(id: string): Promise<void> {
    return this.invoke(IPC_CHANNELS.CONTEXT_REMOVE_FILE, id);
  }

  async toggleContext(id: string): Promise<void> {
    return this.invoke(IPC_CHANNELS.CONTEXT_TOGGLE, id);
  }

  async getContextPool(): Promise<ContextSegment[]> {
    return this.invoke(IPC_CHANNELS.CONTEXT_GET_POOL);
  }

  onContextPoolChange(listener: (pool: ContextSegment[]) => void): () => void {
    return this.on(IPC_CHANNELS.CONTEXT_POOL_UPDATED, (_event, pool) => listener(pool));
  }

  // ============================================================
  // VOICE METHODS
  // ============================================================

  async toggleMicrophone(): Promise<boolean> {
    return this.invoke(IPC_CHANNELS.VOICE_TOGGLE_MIC);
  }

  async startRecording(): Promise<void> {
    return this.invoke(IPC_CHANNELS.VOICE_START_RECORDING);
  }

  async stopRecording(): Promise<void> {
    return this.invoke(IPC_CHANNELS.VOICE_STOP_RECORDING);
  }

  onAudioLevel(listener: (level: number) => void): () => void {
    return this.on(IPC_CHANNELS.VOICE_AUDIO_LEVEL, (_event, level) => listener(level));
  }

  onTranscription(listener: (text: string) => void): () => void {
    return this.on(IPC_CHANNELS.VOICE_TRANSCRIPTION, (_event, text) => listener(text));
  }

  // ============================================================
  // SETTINGS METHODS
  // ============================================================

  async getSettings(): Promise<AppSettings> {
    return this.invoke(IPC_CHANNELS.SETTINGS_GET);
  }

  async updateSettings(settings: Partial<AppSettings>): Promise<void> {
    return this.invoke(IPC_CHANNELS.SETTINGS_UPDATE, settings);
  }

  onSettingsChange(listener: (settings: AppSettings) => void): () => void {
    return this.on(IPC_CHANNELS.SETTINGS_UPDATED, (_event, settings) => listener(settings));
  }

  // ============================================================
  // API KEY METHODS
  // ============================================================

  async setAPIKey(provider: AIProviderType, key: string): Promise<void> {
    return this.invoke(IPC_CHANNELS.API_KEY_SET, { provider, key });
  }

  async getAPIKey(provider: AIProviderType): Promise<string | null> {
    return this.invoke(IPC_CHANNELS.API_KEY_GET, provider);
  }

  async deleteAPIKey(provider: AIProviderType): Promise<void> {
    return this.invoke(IPC_CHANNELS.API_KEY_DELETE, provider);
  }

  async validateAPIKey(provider: AIProviderType, key: string): Promise<boolean> {
    return this.invoke(IPC_CHANNELS.API_KEY_VALIDATE, { provider, key });
  }

  // ============================================================
  // SYSTEM METHODS
  // ============================================================

  async getSystemInfo(): Promise<any> {
    return this.invoke(IPC_CHANNELS.SYSTEM_GET_INFO);
  }

  async getSystemMetrics(): Promise<any> {
    return this.invoke(IPC_CHANNELS.SYSTEM_GET_METRICS);
  }
}

// ============================================================
// SINGLETON INSTANCE
// ============================================================

export const ipc = new IPCClient();

// ============================================================
// REACT HOOKS FOR IPC
// ============================================================

import { useEffect, useState } from "react";

/**
 * Hook to listen for IPC events
 */
export function useIPCListener<T>(
  channel: string,
  handler: (data: T) => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    const cleanup = ipc.on(channel, (_event, data: T) => handler(data));
    return cleanup;
  }, dependencies);
}

/**
 * Hook to get real-time provider status
 */
export function useProviderStatus() {
  const [status, setStatus] = useState<AIProviderStatus | null>(null);

  useEffect(() => {
    // Get initial status
    ipc.getProviderStatus().then(setStatus).catch(console.error);

    // Listen for updates
    const cleanup = ipc.onProviderStatusChange(setStatus);
    return cleanup;
  }, []);

  return status;
}

/**
 * Hook to get real-time context pool
 */
export function useContextPoolSync() {
  const [pool, setPool] = useState<ContextSegment[]>([]);

  useEffect(() => {
    // Get initial pool
    ipc.getContextPool().then(setPool).catch(console.error);

    // Listen for updates
    const cleanup = ipc.onContextPoolChange(setPool);
    return cleanup;
  }, []);

  return pool;
}

/**
 * Hook to get real-time audio level
 */
export function useAudioLevel() {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const cleanup = ipc.onAudioLevel(setLevel);
    return cleanup;
  }, []);

  return level;
}
