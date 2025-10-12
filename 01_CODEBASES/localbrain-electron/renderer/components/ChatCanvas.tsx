// Chat Canvas - Exact copy of Swift chatCanvas
// Messages: spacing 12px, padding 20px horizontal/top, 20px bottom

import MessageBubble, { Message } from "./MessageBubble";

type ChatCanvasProps = {
  messages: Message[];
  isStreaming: boolean;
  isCIActive: boolean;
  shouldShowCI: boolean;
};

export default function ChatCanvas({
  messages,
  isStreaming,
  isCIActive,
  shouldShowCI,
}: ChatCanvasProps) {
  if (messages.length === 0) {
    return <EmptyChatState />;
  }

  return (
    <div className="widget-responsive">
      {/* Intelligence Header - if CI active */}
      {shouldShowCI && <IntelligenceHeader isCIActive={isCIActive} />}

      {/* Messages - responsive gap */}
      <div className="flex-1 overflow-y-auto" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Streaming Indicator */}
        {isStreaming && <StreamingIndicator />}
      </div>
    </div>
  );
}

// Empty Chat State - spacing: 20px
function EmptyChatState() {
  return (
    <div
      className="flex items-center justify-center flex-1"
      style={{ paddingTop: "60px" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", maxWidth: "300px", textAlign: "center" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: "var(--tx3)" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--tx1)" }}>
          Start a New Conversation
        </div>

        <div style={{ fontSize: "0.875rem", color: "var(--tx2)" }}>
          Type your message below or add context files to begin.
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--acc)",
              color: "var(--bg1)",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Add Context File
          </button>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "transparent",
              color: "var(--tx1)",
              border: `1px solid var(--hair)`,
              borderRadius: "6px",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Explore Features
          </button>
        </div>
      </div>
    </div>
  );
}

// Intelligence Header - padding: 16px, spacing: 12px
function IntelligenceHeader({ isCIActive }: { isCIActive: boolean }) {
  return (
    <div
      className="rounded"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px",
        backgroundColor: "var(--bg2)",
        border: `1px solid var(--hair)`,
        borderRadius: "12px",
      }}
    >
      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--tx3)" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--tx1)" }}>
          Central Intelligence
        </span>
        <span style={{ fontSize: "11px", color: "var(--tx2)" }}>
          Multi-agent orchestration active
        </span>
      </div>

      <div
        style={{
          fontSize: "10px",
          color: "var(--tx2)",
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingTop: "4px",
          paddingBottom: "4px",
          backgroundColor: "var(--bg3)",
          borderRadius: "999px",
        }}
      >
        Ready
      </div>
    </div>
  );
}


// Streaming Indicator - padding: 12px
function StreamingIndicator() {
  return (
    <div
      className="flex items-center rounded-full"
      style={{
        gap: "8px",
        padding: "12px",
        backgroundColor: "var(--bg3)",
        width: "fit-content",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "var(--tx3)",
            animationDelay: `${i * 200}ms`,
          }}
        />
      ))}
    </div>
  );
}
