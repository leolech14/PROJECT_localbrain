// Preload script - secure bridge between Electron and renderer
const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC renderer to window object for our TypeScript IPC client
contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
  once: (channel, listener) => ipcRenderer.once(channel, listener),
  removeListener: (channel, listener) => ipcRenderer.removeListener(channel, listener)
});

// Legacy API for backward compatibility
contextBridge.exposeInMainWorld('electronAPI', {
  // AI Services
  sendMessage: (provider, message, context) =>
    ipcRenderer.invoke('ai:send-message', { provider, message, context }),

  // Voice Services
  startRecording: () => ipcRenderer.invoke('voice:start-recording'),
  stopRecording: () => ipcRenderer.invoke('voice:stop-recording'),

  // Context Management
  addFile: (filePath) => ipcRenderer.invoke('context:add-file', filePath),

  // Settings Management
  settings: {
    getAPIKeys: async () => {
      // Get all API keys from keychain
      const providers = ['claude', 'openai', 'gemini', 'ollama', 'openrouter'];
      const keys = {};
      for (const provider of providers) {
        try {
          const key = await ipcRenderer.invoke('api-key:get', provider);
          keys[provider] = key || '';
        } catch (error) {
          console.error(`Failed to get ${provider} API key:`, error);
          keys[provider] = '';
        }
      }
      return keys;
    },
    saveAPIKey: (provider, key) =>
      ipcRenderer.invoke('api-key:set', { provider, key }),
    deleteAPIKey: (provider) =>
      ipcRenderer.invoke('api-key:delete', provider),
    validateAPIKey: (provider, key) =>
      ipcRenderer.invoke('api-key:validate', { provider, key }),
    getSettings: () => ipcRenderer.invoke('settings:get'),
    saveSettings: (settings) => ipcRenderer.invoke('settings:update', settings),
  },

  // System Info
  platform: process.platform,
  isDev: process.env.NODE_ENV !== 'production'
});
