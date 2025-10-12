"use client";

import { useState, useEffect } from "react";
import { ipc } from "../services/ipc";

type FooterProps = {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isAIConnected: boolean;
  isCIActive: boolean;
  micActive: boolean;
};

type SystemMetrics = {
  cpuUsage: number;
  memoryUsage: number;
  memoryTotal: number;
  networkDown: number;
  networkUp: number;
};

export default function Footer({
  isExpanded,
  setIsExpanded,
  isAIConnected,
  isCIActive,
  micActive,
}: FooterProps) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    memoryTotal: 16,
    networkDown: 0,
    networkUp: 0,
  });

  // REAL system metrics via Electron IPC (or mock in browser mode)
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const systemMetrics = await ipc.getSystemMetrics();
        setMetrics({
          cpuUsage: systemMetrics.cpu || 0,
          memoryUsage: systemMetrics.memory || 0,
          memoryTotal: systemMetrics.memoryTotal || 16,
          networkDown: systemMetrics.networkDown || 0,
          networkUp: systemMetrics.networkUp || 0,
        });
      } catch (error) {
        // Running in browser mode - use static values
        // (In Electron, this will show real metrics)
        setMetrics({
          cpuUsage: 0,
          memoryUsage: 0,
          memoryTotal: 16,
          networkDown: 0,
          networkUp: 0,
        });
      }
    };

    // Fetch immediately
    fetchMetrics();

    // Then fetch every second
    const interval = setInterval(fetchMetrics, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes < 1) return `${(bytes * 1024).toFixed(0)} KB/s`;
    return `${bytes.toFixed(1)} MB/s`;
  };

  return (
    <footer
      style={{
        backgroundColor: "var(--bg2)",
        borderTop: `1px solid var(--hair)`,
      }}
    >
      {/* Main Metrics Line */}
      <div
        className="flex items-center"
        style={{
          gap: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "6px",
          paddingBottom: "6px",
          fontFamily: "monospace",
        }}
      >
        {/* CPU Usage */}
        <MetricItem
          label="CPU"
          value={`${metrics.cpuUsage.toFixed(1)}%`}
          barPercent={metrics.cpuUsage}
          color="oklch(0.70 0.20 30)"
        />

        {/* Memory Usage */}
        <MetricItem
          label="RAM"
          value={`${metrics.memoryUsage.toFixed(1)}/${metrics.memoryTotal} GB`}
          barPercent={(metrics.memoryUsage / metrics.memoryTotal) * 100}
          color="oklch(0.70 0.20 240)"
        />

        {/* Network Down */}
        <MetricItem
          label="NET↓"
          value={formatBytes(metrics.networkDown)}
          barPercent={Math.min((metrics.networkDown / 50) * 100, 100)}
          color="oklch(0.70 0.20 145)"
        />

        {/* Network Up */}
        <MetricItem
          label="NET↑"
          value={formatBytes(metrics.networkUp)}
          barPercent={Math.min((metrics.networkUp / 10) * 100, 100)}
          color="oklch(0.70 0.20 320)"
        />

        <div style={{ flex: 1 }} />

        {/* Connection Status */}
        <div className="flex items-center" style={{ gap: "8px" }}>
          <StatusDot active={isAIConnected} />
          <span style={{ fontSize: "0.75rem", color: "var(--tx2)" }}>
            {isAIConnected ? "Connected" : "Offline"}
          </span>
        </div>
      </div>
    </footer>
  );
}

// Metric Item with animated bar
function MetricItem({
  label,
  value,
  barPercent,
  color = "var(--acc)",
}: {
  label: string;
  value: string;
  barPercent: number;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span
        style={{
          fontSize: "0.6875rem",
          fontWeight: 700,
          color: color,
          minWidth: "48px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>

      {/* Mini bar graph */}
      <div
        style={{
          width: "60px",
          height: "6px",
          backgroundColor: "var(--bg3)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${barPercent}%`,
            height: "100%",
            backgroundColor: color,
            transition: "width 0.3s ease",
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>

      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--tx1)",
          minWidth: "80px",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// Status Dot
function StatusDot({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: active ? "var(--ok)" : "var(--err)",
        boxShadow: active ? "0 0 6px var(--ok)" : "none",
      }}
    />
  );
}
