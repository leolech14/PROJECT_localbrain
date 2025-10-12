"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { AIProviderType, AIProviderMetadata } from "@/types";

export default function SettingsPanel() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<"providers" | "voice" | "general">("providers");

  // Local state for API keys (not stored in context for security)
  const [apiKeys, setApiKeys] = useState<Record<AIProviderType, string>>({
    claude: "",
    openai: "",
    gemini: "",
    ollama: "",
    openrouter: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Load API keys from Swift Keychain on mount
  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    try {
      if (window.electronAPI?.settings) {
        const keys = await window.electronAPI.settings.getAPIKeys();
        setApiKeys(keys);
      } else {
        console.log("Electron API not available - running in web mode");
      }
    } catch (error) {
      console.error("Failed to load API keys:", error);
    }
  };

  const handleSaveAPIKey = async (provider: AIProviderType, key: string) => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      if (window.electronAPI?.settings) {
        await window.electronAPI.settings.setAPIKey(provider, key);
        setApiKeys((prev) => ({ ...prev, [provider]: key }));
        setSaveStatus("success");

        // Auto-hide success message after 2s
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        console.log("Electron API not available - API key not saved");
        setSaveStatus("error");
      }
    } catch (error) {
      console.error(`Failed to save ${provider} API key:`, error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      if (window.electronAPI?.settings) {
        await window.electronAPI.settings.setSettings(state.settings);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        console.log("Electron API not available - Settings not saved");
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--bg2)",
      color: "var(--tx1)",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid var(--bg3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Settings</h2>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          style={{
            padding: "8px 16px",
            background: "var(--accent)",
            color: "var(--tx1)",
            border: "none",
            borderRadius: "6px",
            cursor: isSaving ? "not-allowed" : "pointer",
            opacity: isSaving ? 0.6 : 1,
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {isSaving ? "Saving..." : "Save All"}
        </button>
      </div>

      {/* Save Status Indicator */}
      {saveStatus !== "idle" && (
        <div style={{
          padding: "12px 20px",
          background: saveStatus === "success" ? "oklch(0.60 0.15 145)" : "oklch(0.60 0.20 25)",
          color: "white",
          fontSize: "14px",
          textAlign: "center",
        }}>
          {saveStatus === "success" ? "✓ Settings saved successfully" : "✗ Failed to save settings"}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "4px",
        padding: "16px 20px 0",
        borderBottom: "1px solid var(--bg3)",
      }}>
        {(["providers", "voice", "general"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              background: activeTab === tab ? "var(--bg3)" : "transparent",
              color: activeTab === tab ? "var(--tx1)" : "var(--tx2)",
              border: "none",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "capitalize",
              transition: "all 0.2s ease",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
      }}>
        {activeTab === "providers" && <ProvidersTab apiKeys={apiKeys} onSaveKey={handleSaveAPIKey} />}
        {activeTab === "voice" && <VoiceTab />}
        {activeTab === "general" && <GeneralTab />}
      </div>
    </div>
  );
}

// ===========================
// PROVIDERS TAB
// ===========================

interface ProvidersTabProps {
  apiKeys: Record<AIProviderType, string>;
  onSaveKey: (provider: AIProviderType, key: string) => Promise<void>;
}

function ProvidersTab({ apiKeys, onSaveKey }: ProvidersTabProps) {
  const { state, dispatch } = useAppContext();
  const [localKeys, setLocalKeys] = useState(apiKeys);

  useEffect(() => {
    setLocalKeys(apiKeys);
  }, [apiKeys]);

  const providers: AIProviderType[] = ["claude", "openai", "gemini", "ollama", "openrouter"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Default Provider</h3>
        <select
          value={state.settings.ai.defaultProvider}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_SETTINGS",
              payload: {
                ...state.settings,
                ai: { ...state.settings.ai, defaultProvider: e.target.value as AIProviderType },
              },
            })
          }
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "var(--bg3)",
            color: "var(--tx1)",
            border: "1px solid var(--bg4)",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          {providers.map((provider) => (
            <option key={provider} value={provider}>
              {AIProviderMetadata[provider].displayName}
            </option>
          ))}
        </select>
      </div>

      {/* API Keys Section */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>API Keys</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {providers.map((provider) => (
            <APIKeyInput
              key={provider}
              provider={provider}
              value={localKeys[provider]}
              onChange={(value) => setLocalKeys((prev) => ({ ...prev, [provider]: value }))}
              onSave={() => onSaveKey(provider, localKeys[provider])}
            />
          ))}
        </div>
      </div>

      {/* Model Selection */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Default Model</h3>
        <select
          value={state.settings.ai.defaultModel}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_SETTINGS",
              payload: {
                ...state.settings,
                ai: { ...state.settings.ai, defaultModel: e.target.value },
              },
            })
          }
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "var(--bg3)",
            color: "var(--tx1)",
            border: "1px solid var(--bg4)",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          {getModelsForProvider(state.settings.ai.defaultProvider as AIProviderType).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* AI Parameters */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>AI Parameters</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Temperature */}
          <div>
            <label style={{ fontSize: "14px", color: "var(--tx2)", display: "block", marginBottom: "8px" }}>
              Temperature: {state.settings.ai.temperature.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={state.settings.ai.temperature}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_SETTINGS",
                  payload: {
                    ...state.settings,
                    ai: { ...state.settings.ai, temperature: parseFloat(e.target.value) },
                  },
                })
              }
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
          </div>

          {/* Max Tokens */}
          <div>
            <label style={{ fontSize: "14px", color: "var(--tx2)", display: "block", marginBottom: "8px" }}>
              Max Tokens
            </label>
            <input
              type="number"
              min="256"
              max="100000"
              step="256"
              value={state.settings.ai.maxTokens}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_SETTINGS",
                  payload: {
                    ...state.settings,
                    ai: { ...state.settings.ai, maxTokens: parseInt(e.target.value) },
                  },
                })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--bg3)",
                color: "var(--tx1)",
                border: "1px solid var(--bg4)",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Stream Enabled */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input
              type="checkbox"
              id="stream-enabled"
              checked={state.settings.ai.streamEnabled}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_SETTINGS",
                  payload: {
                    ...state.settings,
                    ai: { ...state.settings.ai, streamEnabled: e.target.checked },
                  },
                })
              }
              style={{ width: "18px", height: "18px", accentColor: "var(--accent)" }}
            />
            <label htmlFor="stream-enabled" style={{ fontSize: "14px", color: "var(--tx2)" }}>
              Enable streaming responses
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================
// VOICE TAB
// ===========================

function VoiceTab() {
  const { state, dispatch } = useAppContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Voice Input</h3>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <input
            type="checkbox"
            id="voice-enabled"
            checked={state.settings.voice.enabled}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_SETTINGS",
                payload: {
                  ...state.settings,
                  voice: { ...state.settings.voice, enabled: e.target.checked },
                },
              })
            }
            style={{ width: "18px", height: "18px", accentColor: "var(--accent)" }}
          />
          <label htmlFor="voice-enabled" style={{ fontSize: "14px", color: "var(--tx2)" }}>
            Enable voice input
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            type="checkbox"
            id="auto-listen"
            checked={state.settings.voice.autoListen}
            disabled={!state.settings.voice.enabled}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_SETTINGS",
                payload: {
                  ...state.settings,
                  voice: { ...state.settings.voice, autoListen: e.target.checked },
                },
              })
            }
            style={{ width: "18px", height: "18px", accentColor: "var(--accent)" }}
          />
          <label
            htmlFor="auto-listen"
            style={{
              fontSize: "14px",
              color: state.settings.voice.enabled ? "var(--tx2)" : "var(--tx3)",
            }}
          >
            Auto-listen after response
          </label>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Voice Provider</h3>
        <p style={{ fontSize: "13px", color: "var(--tx3)", marginBottom: "12px" }}>
          Choose between OpenAI Whisper API or macOS native speech recognition
        </p>
        <select
          value={state.settings.voice.enabled ? "whisper" : "native"}
          onChange={(e) => {
            // This would update voice provider setting when implemented
            console.log("Voice provider:", e.target.value);
          }}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "var(--bg3)",
            color: "var(--tx1)",
            border: "1px solid var(--bg4)",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          <option value="whisper">OpenAI Whisper API</option>
          <option value="native">macOS Native</option>
        </select>
      </div>
    </div>
  );
}

// ===========================
// GENERAL TAB
// ===========================

function GeneralTab() {
  const { state, dispatch } = useAppContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Theme</h3>
        <select
          value={state.settings.theme}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_SETTINGS",
              payload: { ...state.settings, theme: e.target.value as "auto" | "light" | "dark" },
            })
          }
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "var(--bg3)",
            color: "var(--tx1)",
            border: "1px solid var(--bg4)",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          <option value="auto">Auto (System)</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Keyboard Shortcuts</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <ShortcutRow label="Search" value={state.settings.shortcuts.search} readOnly />
          <ShortcutRow label="Toggle Sidebar" value={state.settings.shortcuts.toggleSidebar} readOnly />
          <ShortcutRow label="Toggle Voice" value={state.settings.shortcuts.toggleVoice} readOnly />
        </div>

        <p style={{ fontSize: "13px", color: "var(--tx3)", marginTop: "12px" }}>
          Custom keyboard shortcuts coming soon
        </p>
      </div>
    </div>
  );
}

// ===========================
// HELPER COMPONENTS
// ===========================

interface APIKeyInputProps {
  provider: AIProviderType;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

function APIKeyInput({ provider, value, onChange, onSave }: APIKeyInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const metadata = AIProviderMetadata[provider];

  return (
    <div>
      <label style={{ fontSize: "14px", color: "var(--tx2)", display: "block", marginBottom: "8px" }}>
        {metadata.displayName} API Key
      </label>
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type={isVisible ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${metadata.displayName} API key`}
            style={{
              width: "100%",
              padding: "10px 40px 10px 12px",
              background: "var(--bg3)",
              color: "var(--tx1)",
              border: "1px solid var(--bg4)",
              borderRadius: "6px",
              fontSize: "14px",
              fontFamily: "monospace",
            }}
          />
          <button
            onClick={() => setIsVisible(!isVisible)}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "var(--tx3)",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            {isVisible ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <button
          onClick={onSave}
          disabled={!value.trim()}
          style={{
            padding: "10px 20px",
            background: value.trim() ? "var(--accent)" : "var(--bg3)",
            color: value.trim() ? "var(--tx1)" : "var(--tx3)",
            border: "none",
            borderRadius: "6px",
            cursor: value.trim() ? "pointer" : "not-allowed",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

interface ShortcutRowProps {
  label: string;
  value: string;
  readOnly?: boolean;
}

function ShortcutRow({ label, value, readOnly }: ShortcutRowProps) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 12px",
      background: "var(--bg3)",
      borderRadius: "6px",
    }}>
      <span style={{ fontSize: "14px", color: "var(--tx2)" }}>{label}</span>
      <kbd style={{
        padding: "4px 8px",
        background: "var(--bg4)",
        color: "var(--tx1)",
        borderRadius: "4px",
        fontSize: "13px",
        fontFamily: "monospace",
        border: "1px solid var(--bg5)",
      }}>
        {value}
      </kbd>
    </div>
  );
}

// ===========================
// HELPERS
// ===========================

function getModelsForProvider(provider: AIProviderType): string[] {
  const models: Record<AIProviderType, string[]> = {
    claude: [
      "claude-3-opus-20240229",
      "claude-3-5-sonnet-20241022",
      "claude-3-haiku-20240307",
    ],
    openai: [
      "gpt-4-turbo-preview",
      "gpt-4",
      "gpt-3.5-turbo",
    ],
    gemini: [
      "gemini-pro",
      "gemini-pro-vision",
      "gemini-1.5-pro-latest",
    ],
    ollama: [
      "llama2",
      "codellama",
      "mistral",
    ],
    openrouter: [
      "anthropic/claude-3-opus",
      "openai/gpt-4-turbo-preview",
      "google/gemini-pro",
    ],
  };

  return models[provider] || [];
}
