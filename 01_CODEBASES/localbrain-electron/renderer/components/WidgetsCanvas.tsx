// Widgets Canvas - Placeholder for drag-drop widget system
// Will be implemented in future iteration

export default function WidgetsCanvas() {
  return (
    <div
      className="flex items-center justify-center flex-1"
      style={{
        backgroundColor: "var(--bg1)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "16px",
          }}
        >
          🎨
        </div>

        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--tx1)",
            marginBottom: "8px",
          }}
        >
          Widget System
        </div>

        <div style={{ fontSize: "0.875rem", color: "var(--tx2)" }}>
          Drag-and-drop widget canvas coming soon
        </div>
      </div>
    </div>
  );
}
