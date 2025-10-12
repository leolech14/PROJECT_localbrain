// Sidebar Component - Exact copy of Swift OrchestraMVPView sidebarComponent
// width: 260px, module buttons: padding 12px/8px, spacing: 6px

type ActiveModule = "chat" | "context" | "voice" | "metrics" | "widgets" | "settings";

type SidebarProps = {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  contextCount: number;
  micActive: boolean;
  tokenUsage: string;
  isCIActive: boolean;
  shouldShowCI: boolean;
  messages: any[];
  onClearChat: () => void;
  onExport: () => void;
  onSettings: () => void;
  onHelp: () => void;
};

export default function Sidebar({
  activeModule,
  setActiveModule,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  contextCount,
  micActive,
  tokenUsage,
  isCIActive,
  shouldShowCI,
  messages,
  onClearChat,
  onExport,
  onSettings,
  onHelp,
}: SidebarProps) {

  const quickActions = [
    { title: "Clear Chat", icon: "trash", action: onClearChat },
    { title: "Export", icon: "square.and.arrow.up", action: onExport },
    { title: "Settings", icon: "gearshape", action: onSettings },
    { title: "Help", icon: "questionmark.circle", action: onHelp },
  ];

  return (
    <aside
      className="flex flex-col border-r"
      style={{
        width: "260px",
        backgroundColor: "var(--bg1)",
        borderColor: "var(--hair)",
        borderWidth: "1px",
        animation: "slideIn 0.3s ease",
      }}
    >
      {/* Collapse Toggle - padding: 12px */}
      <div
        className="flex items-center justify-between border-b"
        style={{
          padding: "12px",
          borderColor: "var(--hair)",
          borderBottomWidth: "1px",
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--tx1)",
          }}
        >
          Navigation
        </span>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: "var(--tx2)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Widgets - Clean minimal list */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <DraggableWidget type="chat" label="Chat" />
        <DraggableWidget type="context" label="Context" />
        <DraggableWidget type="voice" label="Voice" />
        <DraggableWidget type="metrics" label="Metrics" />
        <DraggableWidget type="browser" label="Browser" />
        <DraggableWidget type="files" label="Files" />
        <DraggableWidget type="preview" label="Preview" />
        <DraggableWidget type="ide" label="IDE" />
      </div>
    </aside>
  );
}


// Draggable Widget - clean minimal design
function DraggableWidget({ type, label }: { type: string; label: string }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("widgetType", type);
      }}
      style={{
        padding: "8px 12px",
        backgroundColor: "var(--bg2)",
        borderRadius: "4px",
        fontSize: "0.8125rem",
        fontWeight: 500,
        color: "var(--tx1)",
        cursor: "grab",
        userSelect: "none",
        transition: "all 0.2s ease",
      }}
      className="sidebar-item"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg2)";
      }}
    >
      {label}
    </div>
  );
}

