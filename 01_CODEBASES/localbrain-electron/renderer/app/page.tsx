"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import DraggableGridCanvas from "@/components/DraggableGridCanvas";
import Footer from "@/components/Footer";
import SettingsPanel from "@/components/Settings/SettingsPanel";
import { Message } from "@/components/MessageBubble";

type ActiveModule = "chat" | "context" | "voice" | "metrics" | "widgets" | "settings";
type ThemeMode = "auto" | "light" | "dark";

type ContextItem = {
  id: string;
  title: string;
  content: string;
};

export default function LocalBrainApp() {
  // State - exact Swift mirror
  const [activeModule, setActiveModule] = useState<ActiveModule>("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const [currentInput, setCurrentInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [contextPool, setContextPool] = useState<ContextItem[]>([]);
  const [isCIActive, setIsCIActive] = useState(false);
  const [isAIConnected, setIsAIConnected] = useState(true);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K - Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchFocused(true);
        document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus();
      }

      // Escape - Clear focus, collapse modals
      if (e.key === "Escape") {
        setIsSearchFocused(false);
        setIsInputFocused(false);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }

      // ⌘B or Ctrl+B - Toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setIsSidebarCollapsed(!isSidebarCollapsed);
      }

      // Numbers 1-5 with Cmd/Ctrl - Switch modules
      if ((e.metaKey || e.ctrlKey) && ["1", "2", "3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        const modules: ActiveModule[] = ["chat", "context", "voice", "metrics", "widgets"];
        setActiveModule(modules[parseInt(e.key) - 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarCollapsed]);

  // Handlers
  const handleSend = () => {
    if (currentInput.trim() && !isStreaming) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        text: currentInput.trim(),
        ts: new Date(),
      };
      setMessages([...messages, userMessage]);
      setCurrentInput("");
      setIsInputFocused(true);

      // Simulate AI response
      setIsStreaming(true);
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "This is a UI prototype. AI services will be connected next.",
          ts: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsStreaming(false);
      }, 1000);
    }
  };

  const handleThemeToggle = () => {
    const modes: ThemeMode[] = ["auto", "light", "dark"];
    const currentIndex = modes.indexOf(themeMode);
    setThemeMode(modes[(currentIndex + 1) % modes.length]);
  };

  const handleUpload = () => {
    console.log("Upload file - to be implemented");
    // File upload will be implemented with context system
  };

  const handleToggleMic = () => {
    setMicActive(!micActive);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExport = () => {
    console.log("Export - to be implemented");
  };

  const handleSettings = () => {
    setActiveModule("settings");
  };

  const handleHelp = () => {
    console.log("Help - to be implemented");
  };

  const handleAddContext = () => {
    // Simulate adding a context file
    const newContext: ContextItem = {
      id: Date.now().toString(),
      title: `Document ${contextPool.length + 1}`,
      content: "This is a sample context item that would contain file content or document text to provide context to the AI.",
    };
    setContextPool([...contextPool, newContext]);
  };

  const handleRemoveContext = (id: string) => {
    setContextPool(contextPool.filter(item => item.id !== id));
  };

  // Exact Swift structure: VStack(spacing: 0) { header, HStack(spacing: 0) { sidebar, canvas }, footer }
  return (
    <div
      className="flex flex-col"
      style={{
        height: "100vh",
        backgroundColor: "var(--bg1)",
      }}
    >
      {/* 01 HEADER COMPONENT */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        onUpload={handleUpload}
        onThemeToggle={handleThemeToggle}
        themeMode={themeMode}
        isCIActive={isCIActive}
        onLogoClick={() => setActiveModule("chat")}
      />

      {/* MAIN BODY: Sidebar + Central Canvas - HStack(spacing: 0) */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: 0 }}>
        {/* 02 SIDEBAR COMPONENT - width: 260, transition */}
        <div
          style={{
            width: isSidebarCollapsed ? "0px" : "260px",
            transition: "width 0.3s ease",
            overflow: "hidden",
          }}
        >
          {!isSidebarCollapsed && (
            <Sidebar
              activeModule={activeModule}
              setActiveModule={setActiveModule}
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
              contextCount={contextPool.length}
              micActive={micActive}
              tokenUsage="0"
              isCIActive={isCIActive}
              shouldShowCI={false}
              messages={messages}
              onClearChat={handleClearChat}
              onExport={handleExport}
              onSettings={handleSettings}
              onHelp={handleHelp}
            />
          )}
        </div>

        {/* CENTRAL CONTENT - Either Grid Canvas or Settings Panel */}
        {activeModule === "settings" ? (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <SettingsPanel />
          </div>
        ) : (
          <DraggableGridCanvas
            messages={messages}
            isStreaming={isStreaming}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            onSend={handleSend}
            contextPool={contextPool}
            micActive={micActive}
            onToggleMic={handleToggleMic}
            isCIActive={isCIActive}
            isInputFocused={isInputFocused}
            setIsInputFocused={setIsInputFocused}
            onAddContext={handleAddContext}
            onRemoveContext={handleRemoveContext}
            isAIConnected={isAIConnected}
          />
        )}
      </div>

      {/* 03 FOOTER COMPONENT */}
      <Footer
        isExpanded={isFooterExpanded}
        setIsExpanded={setIsFooterExpanded}
        isAIConnected={isAIConnected}
        isCIActive={isCIActive}
        micActive={micActive}
      />
    </div>
  );
}
