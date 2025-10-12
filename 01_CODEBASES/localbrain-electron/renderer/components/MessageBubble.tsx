// MessageBubble - Exact copy of Swift MessageBubble
// padding: 12px bubble, horizontal + vertical: 4px spacing

import { useState } from "react";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts?: Date;
};

type MessageBubbleProps = {
  message: Message;
  onCopy?: () => void;
  onDelete?: () => void;
  onAnalyze?: () => void;
  shouldShowCI?: boolean;
};

export default function MessageBubble({
  message,
  onCopy,
  onDelete,
  onAnalyze,
  shouldShowCI = false,
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="flex"
      style={{
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "4px",
        paddingBottom: "4px",
        animation: "fadeIn 0.3s ease",
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
      }}
    >
      {message.role === "user" && <div style={{ flex: 1 }} />}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          alignItems: message.role === "user" ? "flex-end" : "flex-start",
        }}
      >
        {/* Message Text - padding: 12px, rounded: 12px */}
        <div
          style={{
            padding: "12px",
            backgroundColor: message.role === "user" ? "var(--acc)" : "var(--bg3)",
            color: "var(--tx1)",
            borderRadius: "12px",
            maxWidth: "600px",
            fontSize: "14px",
            lineHeight: "1.5",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.text}
        </div>

        {/* Timestamp - caption2 */}
        {message.ts && (
          <span
            style={{
              fontSize: "0.6875rem",
              color: "var(--tx3)",
            }}
          >
            {formatTime(message.ts)}
          </span>
        )}

        {/* Context Menu */}
        {showMenu && (
          <ContextMenu
            onCopy={onCopy}
            onDelete={onDelete}
            onAnalyze={shouldShowCI ? onAnalyze : undefined}
            onClose={() => setShowMenu(false)}
          />
        )}
      </div>

      {message.role === "assistant" && <div style={{ flex: 1 }} />}
    </div>
  );
}

// Context Menu Component
function ContextMenu({
  onCopy,
  onDelete,
  onAnalyze,
  onClose,
}: {
  onCopy?: () => void;
  onDelete?: () => void;
  onAnalyze?: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="absolute"
      style={{
        backgroundColor: "var(--bg2)",
        border: "1px solid var(--hair)",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
        minWidth: "150px",
      }}
      onMouseLeave={onClose}
    >
      {onAnalyze && (
        <>
          <button
            onClick={() => {
              onAnalyze();
              onClose();
            }}
            className="w-full text-left"
            style={{
              padding: "8px 12px",
              fontSize: "0.875rem",
              color: "var(--tx1)",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Analyze with CI
          </button>
          <div style={{ height: "1px", backgroundColor: "var(--hair)" }} />
        </>
      )}

      <button
        onClick={() => {
          onCopy?.();
          onClose();
        }}
        className="w-full text-left context-menu-item"
        style={{
          padding: "8px 12px",
          fontSize: "0.875rem",
          color: "var(--tx1)",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        Copy
      </button>

      <button
        onClick={() => {
          onDelete?.();
          onClose();
        }}
        className="w-full text-left context-menu-item"
        style={{
          padding: "8px 12px",
          fontSize: "0.875rem",
          color: "var(--err)",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
}

