// Voice Indicator - Animated Eyes with Audio Levels
// SPECBASE: LB-VOICE-INDICATOR-UI-001
// Dual-eye design with pupil tracking and audio wave visualization

import { useEffect, useState } from "react";

type VoiceIndicatorProps = {
  active: boolean;
  audioLevel?: number; // 0-1 range
  size?: number; // Default 40px
  onClick?: () => void;
};

export default function VoiceIndicator({
  active,
  audioLevel = 0,
  size = 40,
  onClick,
}: VoiceIndicatorProps) {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [blinkState, setBlinkState] = useState(false);

  // Simulate pupil movement based on audio level
  useEffect(() => {
    if (active && audioLevel > 0) {
      const interval = setInterval(() => {
        const x = (Math.random() - 0.5) * audioLevel * 6;
        const y = (Math.random() - 0.5) * audioLevel * 6;
        setPupilOffset({ x, y });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setPupilOffset({ x: 0, y: 0 });
    }
  }, [active, audioLevel]);

  // Simulate blinking
  useEffect(() => {
    if (active) {
      const blinkInterval = setInterval(() => {
        setBlinkState(true);
        setTimeout(() => setBlinkState(false), 150);
      }, 3000 + Math.random() * 2000);
      return () => clearInterval(blinkInterval);
    }
  }, [active]);

  const eyeSize = size * 0.35;
  const pupilSize = eyeSize * 0.5;
  const eyeSpacing = size * 0.5;

  return (
    <button
      onClick={onClick}
      className="voice-orb"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: active
          ? "radial-gradient(circle, oklch(0.75 0.15 145) 0%, oklch(0.75 0.15 145 / 0.5) 100%)"
          : "radial-gradient(circle, var(--acc) 0%, color-mix(in oklch, var(--acc) 50%, transparent) 100%)",
        boxShadow: active
          ? `0 0 ${20 + audioLevel * 20}px oklch(0.75 0.15 145 / ${0.6 + audioLevel * 0.4})`
          : "0 0 20px color-mix(in oklch, var(--acc) 30%, transparent)",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
        border: "none",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      {/* Eyes Container */}
      <div
        style={{
          display: "flex",
          gap: `${eyeSpacing * 0.3}px`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Left Eye */}
        <Eye
          size={eyeSize}
          pupilSize={pupilSize}
          pupilOffset={pupilOffset}
          blinkState={blinkState}
          active={active}
        />

        {/* Right Eye */}
        <Eye
          size={eyeSize}
          pupilSize={pupilSize}
          pupilOffset={pupilOffset}
          blinkState={blinkState}
          active={active}
        />
      </div>

      {/* Audio Level Rings */}
      {active && audioLevel > 0.1 && (
        <>
          <AudioRing size={size} scale={1 + audioLevel * 0.3} opacity={audioLevel * 0.3} delay={0} />
          <AudioRing size={size} scale={1 + audioLevel * 0.5} opacity={audioLevel * 0.2} delay={0.1} />
          <AudioRing size={size} scale={1 + audioLevel * 0.7} opacity={audioLevel * 0.1} delay={0.2} />
        </>
      )}
    </button>
  );
}

// Individual Eye Component
function Eye({
  size,
  pupilSize,
  pupilOffset,
  blinkState,
  active,
}: {
  size: number;
  pupilSize: number;
  pupilOffset: { x: number; y: number };
  blinkState: boolean;
  active: boolean;
}) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: blinkState ? "2px" : `${size}px`,
        borderRadius: blinkState ? "50% / 100%" : "50%",
        backgroundColor: active ? "oklch(0.95 0 0)" : "oklch(0.85 0 0)",
        position: "relative",
        transition: "height 0.15s ease, background-color 0.3s ease",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Pupil */}
      {!blinkState && (
        <div
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            borderRadius: "50%",
            backgroundColor: active ? "oklch(0.2 0 0)" : "oklch(0.3 0 0)",
            transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
            transition: "transform 0.1s ease, background-color 0.3s ease",
            position: "relative",
          }}
        >
          {/* Highlight */}
          <div
            style={{
              width: "30%",
              height: "30%",
              borderRadius: "50%",
              backgroundColor: "oklch(0.95 0 0 / 0.6)",
              position: "absolute",
              top: "15%",
              left: "15%",
            }}
          />
        </div>
      )}
    </div>
  );
}

// Audio Level Ring Animation
function AudioRing({
  size,
  scale,
  opacity,
  delay,
}: {
  size: number;
  scale: number;
  opacity: number;
  delay: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        border: "2px solid oklch(0.75 0.15 145)",
        opacity: opacity,
        transform: `scale(${scale})`,
        animation: `pulse 1.5s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: "none",
      }}
    />
  );
}
