// AI Provider Types - Swift AIProviderManager mirror
// LocalBrain › Types › AIProvider.ts
// Source: LocalBrain/Services/AIProviderManager.swift

export type AIProviderType = "claude" | "openai" | "gemini" | "ollama" | "openrouter";

export interface AIProvider {
  type: AIProviderType;
  displayName: string;
  isAvailable: boolean;
  isConnected: boolean;
  apiKeySet: boolean;
  models: string[];
  currentModel?: string;
}

export interface AIProviderStatus {
  currentProvider: AIProviderType;
  availableProviders: AIProviderType[];
  isConnected: boolean;
  lastError?: string;
}

export interface StreamChunk {
  text: string;
  done: boolean;
}

// Provider metadata
export const AIProviderMetadata: Record<
  AIProviderType,
  { displayName: string; icon: string; color: string }
> = {
  claude: {
    displayName: "Claude (Anthropic)",
    icon: "🤖",
    color: "oklch(0.70 0.20 30)",
  },
  openai: {
    displayName: "OpenAI",
    icon: "✨",
    color: "oklch(0.70 0.20 145)",
  },
  gemini: {
    displayName: "Gemini (Google)",
    icon: "💎",
    color: "oklch(0.70 0.20 240)",
  },
  ollama: {
    displayName: "Ollama (Local)",
    icon: "🦙",
    color: "oklch(0.70 0.20 300)",
  },
  openrouter: {
    displayName: "OpenRouter",
    icon: "🔀",
    color: "oklch(0.70 0.20 330)",
  },
};
