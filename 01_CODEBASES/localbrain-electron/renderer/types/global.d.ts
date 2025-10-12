/**
 * Global Type Definitions
 * =======================
 *
 * Global type definitions for LocalBrain Electron integration
 */

export {}; // Ensure this file is treated as a module

declare global {
  interface Window {
    electronAPI?: {
      settings?: {
        getAPIKeys: () => Promise<Record<string, string>>;
        setAPIKey: (provider: string, key: string) => Promise<void>;
        getSettings: () => Promise<any>;
        setSettings: (settings: any) => Promise<void>;
      };
      ipc?: {
        sendMessage: (text: string, contextIds?: string[]) => Promise<any>;
        getAIProviderStatus: () => Promise<any>;
        switchProvider: (provider: string) => Promise<void>;
        toggleMicrophone: () => Promise<any>;
        getContextSegments: () => Promise<any[]>;
        addContextSegment: (segment: any) => Promise<void>;
        removeContextSegment: (id: string) => Promise<void>;
        toggleContextSegment: (id: string) => Promise<void>;
        getAppSettings: () => Promise<any>;
        updateAppSettings: (settings: any) => Promise<void>;
        getWorkflows: () => Promise<any[]>;
        getActiveWorkflow: () => Promise<any>;
        startWorkflow: (id: string, params?: any) => Promise<void>;
        stopActiveWorkflow: () => Promise<void>;
        getSystemHealth: () => Promise<any>;
        getSystemMetrics: () => Promise<any>;
        getMessageHistory: (limit?: number) => Promise<any[]>;
        clearMessages: () => Promise<void>;
        exportConversation: (format: string) => Promise<string>;
        getMicrophoneStatus: () => Promise<any>;
        getAudioLevel: () => Promise<number>;
        startVoiceRecording: () => Promise<void>;
        stopVoiceRecording: () => Promise<any>;
        transcribeAudio: (audioData: ArrayBuffer) => Promise<string>;
        getProviderSettings: (provider: string) => Promise<any>;
        updateProviderSettings: (provider: string, settings: any) => Promise<void>;
        resetSettings: () => Promise<void>;
        getWorkflowHistory: (limit?: number) => Promise<any[]>;
        getAppInfo: () => Promise<any>;
        checkForUpdates: () => Promise<any>;
        restartApp: () => Promise<void>;
        testProviderConnection: (provider: string) => Promise<boolean>;
        refreshContext: () => Promise<void>;
        getContextStats: () => Promise<any>;
      };
    };
  }
}