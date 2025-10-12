// Context Canvas - Exact copy of Swift contextCanvas
// Empty state: spacing 16px, centered
// List: VStack spacing 4px, padding 4px vertical

type ContextItem = {
  id: string;
  title: string;
  content: string;
};

type ContextCanvasProps = {
  contextPool: ContextItem[];
  onAddContext: () => void;
  onRemoveContext: (id: string) => void;
};

export default function ContextCanvas({
  contextPool,
  onAddContext,
  onRemoveContext,
}: ContextCanvasProps) {
  if (contextPool.length === 0) {
    return <EmptyContextState onAddContext={onAddContext} />;
  }

  return (
    <div className="widget-responsive">
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {contextPool.map((item) => (
          <ContextItem
            key={item.id}
            item={item}
            onRemove={() => onRemoveContext(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Empty Context State - spacing: 16px
function EmptyContextState({ onAddContext }: { onAddContext: () => void }) {
  return (
    <div className="flex items-center justify-center flex-1">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          style={{ color: "var(--tx3)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>

        <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx1)" }}>
          No Context Items
        </div>

        <div style={{ fontSize: "0.875rem", color: "var(--tx2)" }}>
          Add files or documents to enhance AI responses
        </div>

        <button
          onClick={onAddContext}
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
          Add Context
        </button>
      </div>
    </div>
  );
}

// Context Item - spacing: 4px vertical
function ContextItem({
  item,
  onRemove,
}: {
  item: ContextItem;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        paddingTop: "8px",
        paddingBottom: "8px",
        paddingLeft: "12px",
        paddingRight: "12px",
        backgroundColor: "var(--bg2)",
        borderRadius: "8px",
        marginBottom: "8px",
        border: "1px solid var(--hair)",
      }}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--tx1)",
              marginBottom: "4px",
            }}
          >
            {item.title}
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "var(--tx2)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.content}
          </div>
        </div>

        <button
          onClick={onRemove}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            marginLeft: "8px",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            style={{ color: "var(--tx3)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
