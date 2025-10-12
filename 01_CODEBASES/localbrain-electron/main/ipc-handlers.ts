// IPC Handlers - Main Process Bridge to Swift Backend
// LocalBrain › Main › ipc-handlers.ts
// Handles IPC communication between renderer and Swift services

import { ipcMain, BrowserWindow } from "electron";
import { IPC_CHANNELS } from "../renderer/services/ipc";
import type {
  Message,
  ContextSegment,
  AIProviderType,
  AIProviderStatus,
  AppSettings,
  StreamChunk,
} from "../renderer/types";

// ============================================================
// SETUP IPC HANDLERS
// ============================================================

export function setupIPCHandlers(mainWindow: BrowserWindow) {
  console.log("🔌 Setting up IPC handlers...");

  // ============================================================
  // AI MESSAGE HANDLERS
  // ============================================================

  ipcMain.on(
    IPC_CHANNELS.AI_SEND_MESSAGE,
    async (event, data: { requestId: string; message: string; contextIds: string[] }) => {
      console.log("📤 AI_SEND_MESSAGE:", data);

      try {
        // TODO: Call Swift backend via native bridge
        // For now, simulate streaming response

        const mockResponse = `You said: "${data.message}"\n\nThis is a mock response. The Swift backend will replace this with real AI responses.`;
        const words = mockResponse.split(" ");

        // Simulate streaming by sending word by word
        for (let i = 0; i < words.length; i++) {
          const chunk: StreamChunk = {
            text: words[i] + " ",
            done: i === words.length - 1,
          };

          mainWindow.webContents.send(IPC_CHANNELS.AI_STREAM_CHUNK, {
            requestId: data.requestId,
            chunk,
          });

          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Send completion
        mainWindow.webContents.send(IPC_CHANNELS.AI_STREAM_COMPLETE, {
          requestId: data.requestId,
        });
      } catch (error) {
        console.error("❌ AI_SEND_MESSAGE error:", error);
        mainWindow.webContents.send(IPC_CHANNELS.AI_STREAM_ERROR, {
          requestId: data.requestId,
          error: String(error),
        });
      }
    }
  );

  // ============================================================
  // AI PROVIDER HANDLERS
  // ============================================================

  ipcMain.handle(IPC_CHANNELS.AI_SWITCH_PROVIDER, async (_event, provider: AIProviderType) => {
    console.log("🔄 AI_SWITCH_PROVIDER:", provider);

    try {
      // TODO: Call Swift AIProviderManager.switchProvider(provider)
      // For now, return mock success
      return { success: true };
    } catch (error) {
      console.error("❌ AI_SWITCH_PROVIDER error:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.AI_GET_STATUS, async () => {
    console.log("📊 AI_GET_STATUS");

    try {
      // TODO: Call Swift AIProviderManager.getCurrentStatus()
      // For now, return mock status
      const mockStatus: AIProviderStatus = {
        currentProvider: "claude",
        availableProviders: ["claude", "openai", "gemini"],
        isConnected: false,
        lastError: undefined,
      };

      return mockStatus;
    } catch (error) {
      console.error("❌ AI_GET_STATUS error:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.AI_GET_MODELS, async (_event, provider: AIProviderType) => {
    console.log("📋 AI_GET_MODELS:", provider);

    try {
      // TODO: Call Swift AIProviderManager.getAvailableModels(provider)
      // For now, return mock models
      const mockModels: Record<AIProviderType, string[]> = {
        claude: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
        openai: ["gpt-4-turbo-preview", "gpt-4", "gpt-3.5-turbo"],
        gemini: ["gemini-pro", "gemini-pro-vision"],
        ollama: ["llama2", "codellama", "mistral"],
        openrouter: ["various-models"],
      };

      return mockModels[provider] || [];
    } catch (error) {
      console.error("❌ AI_GET_MODELS error:", error);
      throw error;
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.AI_SET_MODEL,
    async (_event, data: { provider: AIProviderType; model: string }) => {
      console.log("⚙️ AI_SET_MODEL:", data);

      try {
        // TODO: Call Swift AIProviderManager.setModel(provider, model)
        return { success: true };
      } catch (error) {
        console.error("❌ AI_SET_MODEL error:", error);
        throw error;
      }
    }
  );

  // ============================================================
  // CONTEXT HANDLERS
  // ============================================================

  ipcMain.handle(IPC_CHANNELS.CONTEXT_ADD_FILE, async (_event, filePath: string) => {
    console.log("📁 CONTEXT_ADD_FILE:", filePath);

    try {
      // TODO: Call Swift ContextManager.addFile(filePath)
      // For now, return mock context segment
      const mockSegment: ContextSegment = {
        id: crypto.randomUUID(),
        type: "file",
        title: filePath.split("/").pop() || "Unknown",
        content: `Mock file content from: ${filePath}`,
        isActive: true,
        tokens: 100,
        timestamp: new Date(),
      };

      return mockSegment;
    } catch (error) {
      console.error("❌ CONTEXT_ADD_FILE error:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.CONTEXT_REMOVE_FILE, async (_event, id: string) => {
    console.log("🗑️ CONTEXT_REMOVE_FILE:", id);

    try {
      // TODO: Call Swift ContextManager.removeFile(id)
      return { success: true };
    } catch (error) {
      console.error("❌ CONTEXT_REMOVE_FILE error:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.CONTEXT_TOGGLE, async (_event, id: string) => {
    console.log("🔄 CONTEXT_TOGGLE:", id);

    try {
      // TODO: Call Swift ContextManager.toggleSegment(id)
      return { success: true };
    } catch (error) {
      console.error("❌ CONTEXT_TOGGLE error:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.CONTEXT_GET_POOL, async () => {
    console.log("📚 CONTEXT_GET_POOL");

    try {
      // TODO: Call Swift ContextManager.getContextPool()
      // For now, return empty pool
      return [];
    } catch (error) {
      console.error("❌ CONTEXT_GET_POOL error:", error);
      throw error;
    }
  });

  // ============================================================
  // VOICE HANDLERS
  // ============================================================

  ipcMain.handle(IPC_CHANNELS.VOICE_TOGGLE_MIC, async () => {
    console.log("🎤 VOICE_TOGGLE_MIC");

    try {
      // TODO: Call Swift VoiceService.toggleMicrophone()
      // For now, return mock state
      return false; // mic inactive
    } catch (error) {
      console.error("❌ VOICE_TOGGLE_MIC error:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.VOICE_START_RECORDING, async () => {
    console.log("🔴 VOICE_START_RECORDING");

    try {
      // TODO: Call Swift VoiceService.startRecording()
      return { success: true };
    } catch (error) {
      console.error("❌ VOICE_START_RECORDING error:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.VOICE_STOP_RECORDING, async () => {
    console.log("⏹️ VOICE_STOP_RECORDING");

    try {
      // TODO: Call Swift VoiceService.stopRecording()
      return { success: true };
    } catch (error) {
      console.error("❌ VOICE_STOP_RECORDING error:", error);
      throw error;
    }
  });

  // ============================================================
  // SETTINGS HANDLERS
  // ============================================================

  ipcMain.handle(IPC_CHANNELS.SETTINGS_GET, async () => {
    console.log("⚙️ SETTINGS_GET");

    try {
      // TODO: Call Swift SettingsService.getSettings()
      // For now, return defaults (imported from types)
      const { DefaultSettings } = await import("../renderer/types");
      return DefaultSettings;
    } catch (error) {
      console.error("❌ SETTINGS_GET error:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.SETTINGS_UPDATE, async (_event, settings: Partial<AppSettings>) => {
    console.log("💾 SETTINGS_UPDATE:", settings);

    try {
      // TODO: Call Swift SettingsService.updateSettings(settings)
      return { success: true };
    } catch (error) {
      console.error("❌ SETTINGS_UPDATE error:", error);
      throw error;
    }
  });

  // ============================================================
  // API KEY HANDLERS
  // ============================================================

  ipcMain.handle(
    IPC_CHANNELS.API_KEY_SET,
    async (_event, data: { provider: AIProviderType; key: string }) => {
      console.log("🔑 API_KEY_SET:", data.provider);

      try {
        // TODO: Call Swift KeychainService.setAPIKey(provider, key)
        return { success: true };
      } catch (error) {
        console.error("❌ API_KEY_SET error:", error);
        throw error;
      }
    }
  );

  ipcMain.handle(IPC_CHANNELS.API_KEY_GET, async (_event, provider: AIProviderType) => {
    console.log("🔑 API_KEY_GET:", provider);

    try {
      // TODO: Call Swift KeychainService.getAPIKey(provider)
      // For now, return null (no key set)
      return null;
    } catch (error) {
      console.error("❌ API_KEY_GET error:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.API_KEY_DELETE, async (_event, provider: AIProviderType) => {
    console.log("🗑️ API_KEY_DELETE:", provider);

    try {
      // TODO: Call Swift KeychainService.deleteAPIKey(provider)
      return { success: true };
    } catch (error) {
      console.error("❌ API_KEY_DELETE error:", error);
      throw error;
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.API_KEY_VALIDATE,
    async (_event, data: { provider: AIProviderType; key: string }) => {
      console.log("✅ API_KEY_VALIDATE:", data.provider);

      try {
        // TODO: Call Swift AIProviderManager.validateAPIKey(provider, key)
        // For now, return true (mock validation)
        return true;
      } catch (error) {
        console.error("❌ API_KEY_VALIDATE error:", error);
        throw error;
      }
    }
  );

  // ============================================================
  // SYSTEM HANDLERS
  // ============================================================

  ipcMain.handle(IPC_CHANNELS.SYSTEM_GET_INFO, async () => {
    console.log("ℹ️ SYSTEM_GET_INFO");

    try {
      // TODO: Call Swift SystemService.getSystemInfo()
      return {
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        electron: process.versions.electron,
      };
    } catch (error) {
      console.error("❌ SYSTEM_GET_INFO error:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.SYSTEM_GET_METRICS, async () => {
    console.log("📊 SYSTEM_GET_METRICS");

    try {
      const os = require('os');

      // Get CPU usage (average over last second)
      const cpus = os.cpus();
      let totalIdle = 0;
      let totalTick = 0;

      cpus.forEach(cpu => {
        for (const type in cpu.times) {
          totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
      });

      const cpuUsage = 100 - (100 * totalIdle / totalTick);

      // Get memory usage
      const totalMem = os.totalmem() / (1024 ** 3); // Convert to GB
      const freeMem = os.freemem() / (1024 ** 3);
      const usedMem = totalMem - freeMem;

      return {
        cpu: cpuUsage,
        memory: usedMem,
        memoryTotal: totalMem,
        networkDown: 0, // TODO: Implement network stats
        networkUp: 0,   // TODO: Implement network stats
        uptime: process.uptime(),
      };
    } catch (error) {
      console.error("❌ SYSTEM_GET_METRICS error:", error);
      throw error;
    }
  });

  console.log("✅ IPC handlers setup complete");
}

// ============================================================
// HELPER: Send event to renderer
// ============================================================

export function sendToRenderer(
  mainWindow: BrowserWindow,
  channel: string,
  ...args: any[]
): void {
  mainWindow.webContents.send(channel, ...args);
}
