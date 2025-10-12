// Voice Canvas - Exact copy of Swift voiceCanvas
// Large orb: 120x120, spacing: 24px

type VoiceCanvasProps = {
  micActive: boolean;
  onToggleMic: () => void;
};

export default function VoiceCanvas({ micActive, onToggleMic }: VoiceCanvasProps) {
  return (
    <div className="widget-responsive">
      <div
        className="flex flex-col items-center justify-center flex-1"
        style={{
          gap: "24px",
        }}
      >
      {/* Large Voice Orb - 120x120, scale 1.2 when active */}
      <button
        onClick={onToggleMic}
        style={{
          width: micActive ? "144px" : "120px",
          height: micActive ? "144px" : "120px",
          borderRadius: "50%",
          background: micActive
            ? "radial-gradient(circle, oklch(0.75 0.15 145) 0%, oklch(0.75 0.15 145 / 0.5) 100%)"
            : "radial-gradient(circle, var(--acc) 0%, color-mix(in oklch, var(--acc) 50%, transparent) 100%)",
          boxShadow: micActive
            ? "0 0 40px oklch(0.75 0.15 145 / 1.0)"
            : "0 0 40px color-mix(in oklch, var(--acc) 30%, transparent)",
          transition: "all 0.3s ease-in-out",
          cursor: "pointer",
          border: "none",
        }}
      />

      {/* Status Text */}
      <div
        style={{
          fontSize: "1.25rem",
          fontWeight: 500,
          color: "var(--tx1)",
        }}
      >
        {micActive ? "Listening..." : "Tap to start recording"}
      </div>

      {/* Active State Detail */}
      {micActive && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--tx2)",
          }}
        >
          Voice recognition active
        </div>
      )}
      </div>
    </div>
  );
}
