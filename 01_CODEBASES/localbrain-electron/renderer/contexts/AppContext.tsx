// AppContext - Global Application State
// LocalBrain › Contexts › AppContext.tsx
// Mirrors Swift AppModel.swift @Published properties

"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import {
  Message,
  ContextSegment,
  AIProviderStatus,
  AIProviderType,
  AppSettings,
  DefaultSettings,
  createMessage,
} from "../types";

// ============================================================
// STATE INTERFACE - Exact Swift AppModel Mirror
// ============================================================

export interface AppState {
  // Chat State
  messages: Message[];
  isStreaming: boolean;
  currentStreamingId: string | null;

  // Context Pool
  contextPool: ContextSegment[];
  totalTokens: number;
  maxTokens: number;

  // AI Provider
  aiProvider: AIProviderStatus;
  isAIConnected: boolean;

  // Voice State
  micActive: boolean;
  voiceEnabled: boolean;
  audioLevel: number;

  // Settings
  settings: AppSettings;

  // UI State
  activeModule: "chat" | "context" | "voice" | "metrics" | "widgets";
  sidebarOpen: boolean;
  searchOpen: boolean;

  // Workflow State
  activeWorkflow: string | null;
  workflows: any[]; // Will type properly when implementing workflow system
}

// ============================================================
// ACTIONS
// ============================================================

type AppAction =
  // Message Actions
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "UPDATE_MESSAGE"; payload: { id: string; text: string } }
  | { type: "SET_STREAMING"; payload: { id: string | null; isStreaming: boolean } }
  | { type: "CLEAR_MESSAGES" }

  // Context Actions
  | { type: "ADD_CONTEXT"; payload: ContextSegment }
  | { type: "REMOVE_CONTEXT"; payload: string }
  | { type: "TOGGLE_CONTEXT"; payload: string }
  | { type: "UPDATE_CONTEXT_TOKENS"; payload: number }

  // AI Provider Actions
  | { type: "SET_AI_PROVIDER"; payload: AIProviderType }
  | { type: "UPDATE_AI_STATUS"; payload: AIProviderStatus }
  | { type: "SET_AI_CONNECTED"; payload: boolean }

  // Voice Actions
  | { type: "TOGGLE_MIC" }
  | { type: "SET_MIC_ACTIVE"; payload: boolean }
  | { type: "SET_AUDIO_LEVEL"; payload: number }
  | { type: "TOGGLE_VOICE_ENABLED" }

  // Settings Actions
  | { type: "UPDATE_SETTINGS"; payload: Partial<AppSettings> }

  // UI Actions
  | { type: "SET_ACTIVE_MODULE"; payload: AppState["activeModule"] }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_SEARCH" }

  // Workflow Actions
  | { type: "SET_ACTIVE_WORKFLOW"; payload: string | null };

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: AppState = {
  messages: [],
  isStreaming: false,
  currentStreamingId: null,

  contextPool: [],
  totalTokens: 0,
  maxTokens: 100000,

  aiProvider: {
    currentProvider: "claude",
    availableProviders: ["claude", "openai", "gemini"],
    isConnected: false,
  },
  isAIConnected: false,

  micActive: false,
  voiceEnabled: false,
  audioLevel: 0,

  settings: DefaultSettings,

  activeModule: "chat",
  sidebarOpen: true,
  searchOpen: false,

  activeWorkflow: null,
  workflows: [],
};

// ============================================================
// REDUCER
// ============================================================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Message Actions
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };

    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id ? { ...msg, text: action.payload.text } : msg
        ),
      };

    case "SET_STREAMING":
      return {
        ...state,
        isStreaming: action.payload.isStreaming,
        currentStreamingId: action.payload.id,
      };

    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };

    // Context Actions
    case "ADD_CONTEXT":
      return {
        ...state,
        contextPool: [...state.contextPool, action.payload],
        totalTokens: state.totalTokens + action.payload.tokens,
      };

    case "REMOVE_CONTEXT":
      const removed = state.contextPool.find((c) => c.id === action.payload);
      return {
        ...state,
        contextPool: state.contextPool.filter((c) => c.id !== action.payload),
        totalTokens: removed ? state.totalTokens - removed.tokens : state.totalTokens,
      };

    case "TOGGLE_CONTEXT":
      return {
        ...state,
        contextPool: state.contextPool.map((c) =>
          c.id === action.payload ? { ...c, isActive: !c.isActive } : c
        ),
      };

    case "UPDATE_CONTEXT_TOKENS":
      return { ...state, totalTokens: action.payload };

    // AI Provider Actions
    case "SET_AI_PROVIDER":
      return {
        ...state,
        aiProvider: { ...state.aiProvider, currentProvider: action.payload },
      };

    case "UPDATE_AI_STATUS":
      return { ...state, aiProvider: action.payload };

    case "SET_AI_CONNECTED":
      return { ...state, isAIConnected: action.payload };

    // Voice Actions
    case "TOGGLE_MIC":
      return { ...state, micActive: !state.micActive };

    case "SET_MIC_ACTIVE":
      return { ...state, micActive: action.payload };

    case "SET_AUDIO_LEVEL":
      return { ...state, audioLevel: action.payload };

    case "TOGGLE_VOICE_ENABLED":
      return { ...state, voiceEnabled: !state.voiceEnabled };

    // Settings Actions
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };

    // UI Actions
    case "SET_ACTIVE_MODULE":
      return { ...state, activeModule: action.payload };

    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case "TOGGLE_SEARCH":
      return { ...state, searchOpen: !state.searchOpen };

    // Workflow Actions
    case "SET_ACTIVE_WORKFLOW":
      return { ...state, activeWorkflow: action.payload };

    default:
      return state;
  }
}

// ============================================================
// CONTEXT CREATION
// ============================================================

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;

  // Message Actions
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;

  // Context Actions
  addContextSegment: (segment: ContextSegment) => void;
  removeContextSegment: (id: string) => void;
  toggleContextSegment: (id: string) => void;

  // AI Provider Actions
  switchAIProvider: (provider: AIProviderType) => Promise<void>;

  // Voice Actions
  toggleMicrophone: () => void;
  toggleVoice: () => void;

  // UI Actions
  switchModule: (module: AppState["activeModule"]) => void;
  toggleSidebar: () => void;
  toggleSearch: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ============================================================
// PROVIDER COMPONENT
// ============================================================

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ============================================================
  // MESSAGE ACTIONS
  // ============================================================

  const sendMessage = async (text: string) => {
    // Add user message
    const userMsg = createMessage("user", text);
    dispatch({ type: "ADD_MESSAGE", payload: userMsg });

    // Create assistant message placeholder
    const assistantMsg = createMessage("assistant", "", undefined, true);
    dispatch({ type: "ADD_MESSAGE", payload: assistantMsg });
    dispatch({ type: "SET_STREAMING", payload: { id: assistantMsg.id, isStreaming: true } });

    try {
      // Get active context IDs
      const activeContextIds = state.contextPool.filter((c) => c.isActive).map((c) => c.id);

      // Stream response from IPC bridge
      const { ipc } = await import("../services/ipc");
      const stream = await ipc.sendMessage(text, activeContextIds);

      let fullText = "";
      for await (const chunk of stream) {
        fullText += chunk.text;
        dispatch({ type: "UPDATE_MESSAGE", payload: { id: assistantMsg.id, text: fullText } });
      }

      dispatch({ type: "SET_STREAMING", payload: { id: null, isStreaming: false } });
    } catch (error) {
      console.error("Send message failed:", error);
      dispatch({ type: "SET_STREAMING", payload: { id: null, isStreaming: false } });

      // Show error in message
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: { id: assistantMsg.id, text: `Error: ${String(error)}` },
      });
    }
  };

  const clearMessages = () => {
    dispatch({ type: "CLEAR_MESSAGES" });
  };

  // ============================================================
  // CONTEXT ACTIONS
  // ============================================================

  const addContextSegment = (segment: ContextSegment) => {
    dispatch({ type: "ADD_CONTEXT", payload: segment });
  };

  const removeContextSegment = (id: string) => {
    dispatch({ type: "REMOVE_CONTEXT", payload: id });
  };

  const toggleContextSegment = (id: string) => {
    dispatch({ type: "TOGGLE_CONTEXT", payload: id });
  };

  // ============================================================
  // AI PROVIDER ACTIONS
  // ============================================================

  const switchAIProvider = async (provider: AIProviderType) => {
    try {
      const { ipc } = await import("../services/ipc");
      await ipc.switchProvider(provider);
      dispatch({ type: "SET_AI_PROVIDER", payload: provider });
    } catch (error) {
      console.error("Switch provider failed:", error);
    }
  };

  // ============================================================
  // VOICE ACTIONS
  // ============================================================

  const toggleMicrophone = async () => {
    try {
      const { ipc } = await import("../services/ipc");
      const newState = await ipc.toggleMicrophone();
      dispatch({ type: "SET_MIC_ACTIVE", payload: newState });
    } catch (error) {
      console.error("Toggle microphone failed:", error);
    }
  };

  const toggleVoice = () => {
    dispatch({ type: "TOGGLE_VOICE_ENABLED" });
  };

  // ============================================================
  // UI ACTIONS
  // ============================================================

  const switchModule = (module: AppState["activeModule"]) => {
    dispatch({ type: "SET_ACTIVE_MODULE", payload: module });
  };

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const toggleSearch = () => {
    dispatch({ type: "TOGGLE_SEARCH" });
  };

  // ============================================================
  // KEYBOARD SHORTCUTS
  // ============================================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K - Toggle search
      if (e.metaKey && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }

      // ⌘B - Toggle sidebar
      if (e.metaKey && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }

      // ⌘M - Toggle microphone
      if (e.metaKey && e.key === "m") {
        e.preventDefault();
        toggleMicrophone();
      }

      // ⌘1-5 - Switch modules
      if (e.metaKey && ["1", "2", "3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        const modules: AppState["activeModule"][] = ["chat", "context", "voice", "metrics", "widgets"];
        const index = parseInt(e.key) - 1;
        switchModule(modules[index]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value: AppContextValue = {
    state,
    dispatch,

    sendMessage,
    clearMessages,

    addContextSegment,
    removeContextSegment,
    toggleContextSegment,

    switchAIProvider,

    toggleMicrophone,
    toggleVoice,

    switchModule,
    toggleSidebar,
    toggleSearch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ============================================================
// CUSTOM HOOKS
// ============================================================

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

// Convenience hooks for specific state slices
export function useMessages() {
  const { state } = useAppContext();
  return state.messages;
}

export function useContextPool() {
  const { state } = useAppContext();
  return state.contextPool;
}

export function useAIProvider() {
  const { state } = useAppContext();
  return state.aiProvider;
}

export function useSettings() {
  const { state } = useAppContext();
  return state.settings;
}

export function useVoiceState() {
  const { state } = useAppContext();
  return {
    micActive: state.micActive,
    voiceEnabled: state.voiceEnabled,
    audioLevel: state.audioLevel,
  };
}

export function useUIState() {
  const { state } = useAppContext();
  return {
    activeModule: state.activeModule,
    sidebarOpen: state.sidebarOpen,
    searchOpen: state.searchOpen,
  };
}
