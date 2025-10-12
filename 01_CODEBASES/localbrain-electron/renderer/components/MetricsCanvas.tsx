// Metrics Canvas - Exact copy of Swift metricsCanvas
// Grid: 2x2, spacing 20px horizontal, 16px vertical
// Cards: padding 16px, spacing 8px, bg2, radius 12px

type MetricsCanvasProps = {
  messageCount: number;
  tokenUsage: string;
  contextCount: number;
  isAIConnected: boolean;
};

export default function MetricsCanvas({
  messageCount,
  tokenUsage,
  contextCount,
  isAIConnected,
}: MetricsCanvasProps) {
  return (
    <div className="widget-responsive">
      <div className="flex flex-col flex-1">
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "var(--tx1)",
          marginBottom: "20px",
        }}
      >
        Usage Metrics
      </div>

      {/* 2x2 Grid - horizontal: 20px, vertical: 16px */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px 20px",
          marginBottom: "20px",
        }}
      >
        <MetricCard title="Messages" value={messageCount.toString()} />
        <MetricCard title="Tokens" value={tokenUsage} />
        <MetricCard title="Context Items" value={contextCount.toString()} />
        <MetricCard
          title="Status"
          value={isAIConnected ? "Connected" : "Disconnected"}
        />
      </div>

      <div style={{ flex: 1 }} />
      </div>
    </div>
  );
}

// Metric Card - spacing: 8px, padding: 16px
function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "16px",
        backgroundColor: "var(--bg2)",
        borderRadius: "12px",
        border: "1px solid var(--hair)",
      }}
    >
      <div style={{ fontSize: "0.75rem", color: "var(--tx2)" }}>{title}</div>

      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--tx1)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
