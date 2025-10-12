// Input Area - Exact copy of Swift inputArea
// padding: 20px horizontal, 20px bottom, spacing: 12px

import { useState, useEffect } from "react";
import VoiceIndicator from "./VoiceIndicator";

type InputAreaProps = {
  currentInput: string;
  setCurrentInput: (text: string) => void;
  onSend: () => void;
  contextCount: number;
  micActive: boolean;
  onToggleMic: () => void;
  isStreaming: boolean;
  isCIActive: boolean;
  shouldShowAdvanced: boolean;
  isInputFocused: boolean;
  setIsInputFocused: (focused: boolean) => void;
};

export default function InputArea({
  currentInput,
  setCurrentInput,
  onSend,
  contextCount,
  micActive,
  onToggleMic,
  isStreaming,
  isCIActive,
  shouldShowAdvanced,
  isInputFocused,
  setIsInputFocused,
}: InputAreaProps) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [textareaRows, setTextareaRows] = useState(1);
  const canSend = currentInput.trim().length > 0 && !isStreaming;

  // Simulate audio levels when mic is active
  useEffect(() => {
    if (micActive) {
      const interval = setInterval(() => {
        setAudioLevel(0.3 + Math.random() * 0.7);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [micActive]);

  // Auto-resize textarea based on content (max 5 rows)
  useEffect(() => {
    const lineCount = currentInput.split("\n").length;
    const estimatedRows = Math.min(Math.max(lineCount, 1), 5);
    setTextareaRows(estimatedRows);
  }, [currentInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg2)",
        borderTop: `1px solid var(--hair)`,
      }}
    >
      {/* spacing: 12px vertical */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Context Indicator - if context exists */}
        {contextCount > 0 && (
          <ContextIndicator count={contextCount} />
        )}

        {/* Main Input - padding: 20px horizontal, 20px bottom, spacing: 12px */}
        <div
          className="flex items-center"
          style={{
            gap: "12px",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
          }}
        >
          {/* Voice Indicator with Animated Eyes */}
          <VoiceIndicator
            active={micActive}
            audioLevel={audioLevel}
            size={40}
            onClick={onToggleMic}
          />

          {/* Text Input - padding: 16px/12px, rounded: 20px, auto-resize */}
          <div style={{ flex: 1, position: "relative" }}>
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Type your message..."
              rows={textareaRows}
              style={{
                width: "100%",
                fontSize: "14px",
                color: "var(--tx1)",
                backgroundColor: "var(--bg3)",
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingTop: "12px",
                paddingBottom: "12px",
                border: `${isInputFocused ? "2" : "1"}px solid ${isInputFocused ? "var(--acc)" : "var(--hair)"}`,
                borderRadius: "20px",
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
                transition: "height 0.2s ease",
                maxHeight: "120px", // ~5 rows
                overflowY: textareaRows >= 5 ? "auto" : "hidden",
              }}
            />
          </div>

          {/* Send Button - size: 24px */}
          <button
            onClick={onSend}
            disabled={!canSend}
            className="send-button"
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: canSend ? "pointer" : "not-allowed",
              padding: 0,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: canSend ? "var(--acc)" : "var(--tx2)" }}
            >
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <path
                d="M12 8l0 8M8 12l4-4 4 4"
                stroke="var(--bg1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>

          {/* Intelligence Toggle - if advanced mode, size: 16px */}
          {shouldShowAdvanced && (
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: isCIActive ? "var(--ok)" : "var(--tx2)",
                }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Context Indicator - padding: 16px/8px, spacing: 8px
function ContextIndicator({ count }: { count: number }) {
  return (
    <div
      className="flex items-center rounded"
      style={{
        gap: "8px",
        marginLeft: "20px",
        marginRight: "20px",
        marginTop: "12px",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "8px",
        paddingBottom: "8px",
        backgroundColor: "var(--bg3)",
        borderRadius: "8px",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--acc)" }}>
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>

      <span style={{ fontSize: "11px", color: "var(--tx2)", flex: 1 }}>
        {count} context items active
      </span>

      <button
        style={{
          fontSize: "10px",
          color: "var(--acc)",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        Manage
      </button>
    </div>
  );
}

// Voice Orb - Exact copy of Swift VoiceOrb
// Size: 40px (60px base * 0.67 scale), radial gradient, 0.3s ease animation
function VoiceOrbPlaceholder({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: active
          ? "radial-gradient(circle, oklch(0.75 0.15 145) 0%, oklch(0.75 0.15 145 / 0.5) 100%)"
          : "radial-gradient(circle, var(--acc) 0%, color-mix(in oklch, var(--acc) 50%, transparent) 100%)",
        boxShadow: active
          ? "0 0 20px oklch(0.75 0.15 145 / 0.6)"
          : "0 0 20px color-mix(in oklch, var(--acc) 30%, transparent)",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
      }}
    />
  );
}
