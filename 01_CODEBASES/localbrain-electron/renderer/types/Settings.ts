// Settings Type - Configuration and preferences
// LocalBrain › Types › Settings.ts

export interface AISettings {
  temperature: number;
  maxTokens: number;
  streamEnabled: boolean;
  defaultProvider: string;
  defaultModel: string;
}

export interface AppSettings {
  ai: AISettings;
  theme: "auto" | "light" | "dark";
  shortcuts: {
    search: string;
    toggleSidebar: string;
    toggleVoice: string;
  };
  voice: {
    enabled: boolean;
    autoListen: boolean;
    inputDevice?: string;
  };
}

export const DefaultSettings: AppSettings = {
  ai: {
    temperature: 0.7,
    maxTokens: 2048,
    streamEnabled: true,
    defaultProvider: "claude",
    defaultModel: "claude-3-opus-20240229",
  },
  theme: "auto",
  shortcuts: {
    search: "⌘K",
    toggleSidebar: "⌘B",
    toggleVoice: "⌘M",
  },
  voice: {
    enabled: false,
    autoListen: false,
  },
};
