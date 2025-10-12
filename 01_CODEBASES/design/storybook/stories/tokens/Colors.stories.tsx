import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Import design tokens
import designTokens from '../../../tokens/design-tokens.json';
import oklchRamps from '../../../tokens/oklch-ramps.json';

const meta: Meta = {
  title: 'Design Tokens/Colors',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# OKLCH Color System

LocalBrain uses the **OKLCH color space** for perceptually uniform colors with **APCA contrast enforcement**.

## What is OKLCH?

- **L (Lightness)**: 0.0 (black) → 1.0 (white) - perceptually uniform
- **C (Chroma)**: 0.0 (gray) → 0.37+ (vivid) - color intensity
- **H (Hue)**: 0-360° - color angle (230° = blue, 142° = green, etc.)

## APCA Contrast

All color pairings are validated with APCA (Accessible Perceptual Contrast Algorithm):
- **≥60 Lc** for body text
- **≥75 Lc** for interactive elements (buttons, links, small text)

## Color Ramps

We provide 5 color ramps with 11 lightness steps each:
- **Neutral**: 250° hue, 0.02 chroma (blue-gray)
- **Accent**: 230° hue, 0.12 chroma (vibrant blue)
- **Success**: 142° hue, 0.16 chroma (vibrant green)
- **Warning**: 29° hue, 0.18 chroma (vibrant orange)
- **Error**: 347° hue, 0.14 chroma (vibrant red)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Color swatch component
const ColorSwatch = ({
  color,
  name,
  usage
}: {
  color: string;
  name: string;
  usage?: string;
}) => (
  <div style={{ marginBottom: '1rem' }}>
    <div
      style={{
        width: '100%',
        height: '80px',
        background: color,
        borderRadius: '8px',
        border: '1px solid oklch(0.85 0.02 250)',
        marginBottom: '0.5rem',
      }}
    />
    <div style={{ fontSize: '14px', fontWeight: 600 }}>{name}</div>
    <div style={{ fontSize: '12px', color: 'oklch(0.50 0.02 250)', fontFamily: 'monospace' }}>
      {color}
    </div>
    {usage && (
      <div style={{ fontSize: '12px', color: 'oklch(0.40 0.02 250)', marginTop: '0.25rem' }}>
        {usage}
      </div>
    )}
  </div>
);

// Color ramp component
const ColorRamp = ({
  title,
  ramp
}: {
  title: string;
  ramp: { name: string; lightness: number; usage: string }[];
}) => (
  <div style={{ marginBottom: '3rem' }}>
    <h3 style={{ marginBottom: '1rem', fontSize: '18px', fontWeight: 700 }}>{title}</h3>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '1rem'
    }}>
      {ramp.map((step) => {
        const color = `oklch(${step.lightness.toFixed(2)} ${
          title === 'Neutral' ? '0.02' :
          title === 'Accent' ? '0.12' :
          title === 'Success' ? '0.16' :
          title === 'Warning' ? '0.18' :
          '0.14'
        } ${
          title === 'Neutral' ? '250' :
          title === 'Accent' ? '230' :
          title === 'Success' ? '142' :
          title === 'Warning' ? '29' :
          '347'
        })`;

        return (
          <ColorSwatch
            key={step.name}
            color={color}
            name={step.name}
            usage={step.usage}
          />
        );
      })}
    </div>
  </div>
);

// Semantic color pairing component
const SemanticPairing = ({
  title,
  bg,
  text,
  textMuted,
  description,
}: {
  title: string;
  bg: string;
  text: string;
  textMuted: string;
  description: string;
}) => (
  <div
    style={{
      background: bg,
      color: text,
      padding: '2rem',
      borderRadius: '8px',
      border: '1px solid oklch(0.85 0.02 250)',
      marginBottom: '1rem',
    }}
  >
    <h3 style={{ marginBottom: '0.5rem', fontSize: '18px', fontWeight: 700 }}>{title}</h3>
    <p style={{ marginBottom: '1rem', color: textMuted, fontSize: '14px' }}>{description}</p>
    <div style={{ display: 'flex', gap: '1rem', fontSize: '12px', fontFamily: 'monospace' }}>
      <div>
        <div style={{ fontWeight: 600 }}>Background:</div>
        <div>{bg}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Text:</div>
        <div>{text}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Text Muted:</div>
        <div>{textMuted}</div>
      </div>
    </div>
  </div>
);

export const OKLCHRamps: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>OKLCH Color Ramps</h1>

      <ColorRamp title="Neutral" ramp={oklchRamps.ramps.neutral.steps} />
      <ColorRamp title="Accent" ramp={oklchRamps.ramps.accent.steps} />
      <ColorRamp title="Success" ramp={oklchRamps.ramps.success.steps} />
      <ColorRamp title="Warning" ramp={oklchRamps.ramps.warning.steps} />
      <ColorRamp title="Error" ramp={oklchRamps.ramps.error.steps} />
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>Semantic Color System</h1>

      <p style={{ marginBottom: '2rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        All color pairings are validated with APCA (≥60 Lc for body text, ≥75 Lc for interactive elements).
      </p>

      <SemanticPairing
        title="Surface (Default Background)"
        bg={designTokens.tokens.color.surface.bg.value}
        text={designTokens.tokens.color.surface.text.value}
        textMuted={designTokens.tokens.color.surface.textMuted.value}
        description="Light background for main content areas with strong text contrast."
      />

      <SemanticPairing
        title="Accent (Primary Actions)"
        bg={designTokens.tokens.color.accent.bg.value}
        text={designTokens.tokens.color.accent.text.value}
        textMuted={designTokens.tokens.color.accent.textMuted.value}
        description="Vibrant blue for primary buttons, links, and interactive elements."
      />

      <SemanticPairing
        title="Muted (Secondary Background)"
        bg={designTokens.tokens.color.muted.bg.value}
        text={designTokens.tokens.color.muted.text.value}
        textMuted={designTokens.tokens.color.muted.textMuted.value}
        description="Subtle background for cards, panels, and secondary content."
      />

      <SemanticPairing
        title="Interactive (Hover States)"
        bg={designTokens.tokens.color.interactive.bg.value}
        text={designTokens.tokens.color.interactive.text.value}
        textMuted={designTokens.tokens.color.interactive.textMuted.value}
        description="Light accent background for hover states and focused elements."
      />

      <SemanticPairing
        title="Success (Positive Feedback)"
        bg={designTokens.tokens.color.success.bg.value}
        text={designTokens.tokens.color.success.text.value}
        textMuted={designTokens.tokens.color.success.textMuted.value}
        description="Green for success messages, confirmations, and positive states."
      />

      <SemanticPairing
        title="Warning (Caution)"
        bg={designTokens.tokens.color.warning.bg.value}
        text={designTokens.tokens.color.warning.text.value}
        textMuted={designTokens.tokens.color.warning.textMuted.value}
        description="Orange for warnings, alerts, and actions requiring attention."
      />

      <SemanticPairing
        title="Error (Negative Feedback)"
        bg={designTokens.tokens.color.error.bg.value}
        text={designTokens.tokens.color.error.text.value}
        textMuted={designTokens.tokens.color.error.textMuted.value}
        description="Red for errors, destructive actions, and critical alerts."
      />
    </div>
  ),
};

export const ContrastDemonstration: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>APCA Contrast Validation</h1>

      <p style={{ marginBottom: '2rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        All text meets APCA thresholds. Try switching to dark mode using the toolbar!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {/* Body Text */}
        <div style={{
          background: designTokens.tokens.color.surface.bg.value,
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid oklch(0.85 0.02 250)',
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: designTokens.tokens.color.surface.textMuted.value,
          }}>
            Body Text (16px)
          </div>
          <p style={{
            fontSize: '16px',
            color: designTokens.tokens.color.surface.text.value,
            marginBottom: '0.5rem',
          }}>
            This is regular body text at 16px. It should be easily readable with strong contrast.
          </p>
          <div style={{ fontSize: '12px', fontFamily: 'monospace', color: designTokens.tokens.color.surface.textMuted.value }}>
            APCA: ≥75 Lc ✓
          </div>
        </div>

        {/* Interactive Text */}
        <div style={{
          background: designTokens.tokens.color.accent.bg.value,
          padding: '1.5rem',
          borderRadius: '8px',
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: designTokens.tokens.color.accent.textMuted.value,
          }}>
            Interactive Element (14px)
          </div>
          <p style={{
            fontSize: '14px',
            color: designTokens.tokens.color.accent.text.value,
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}>
            Button Text
          </p>
          <div style={{ fontSize: '12px', fontFamily: 'monospace', color: designTokens.tokens.color.accent.textMuted.value }}>
            APCA: ≥75 Lc ✓
          </div>
        </div>

        {/* Small Text */}
        <div style={{
          background: designTokens.tokens.color.muted.bg.value,
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid oklch(0.85 0.02 250)',
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: designTokens.tokens.color.muted.textMuted.value,
          }}>
            Small Text (12px)
          </div>
          <p style={{
            fontSize: '12px',
            color: designTokens.tokens.color.muted.text.value,
            marginBottom: '0.5rem',
          }}>
            Metadata and secondary information requires higher contrast for small sizes.
          </p>
          <div style={{ fontSize: '12px', fontFamily: 'monospace', color: designTokens.tokens.color.muted.textMuted.value }}>
            APCA: ≥75 Lc ✓
          </div>
        </div>
      </div>
    </div>
  ),
};
