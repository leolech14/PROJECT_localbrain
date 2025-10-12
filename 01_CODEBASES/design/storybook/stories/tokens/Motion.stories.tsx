import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import motionTokens from '../../../motion/motion-tokens.json';

const meta: Meta = {
  title: 'Design Tokens/Motion',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Motion Design System

LocalBrain's motion system provides standardized duration, easing, and accessibility-first animation tokens.

## Duration Tokens

- **instant** (0ms): No animation (reduced motion fallback)
- **fast** (100ms): Micro-interactions (hover states, ripples)
- **quick** (200ms): Most UI transitions (button presses, toggles)
- **normal** (300ms): Standard transitions (modals, panels) - **Recommended default**
- **moderate** (500ms): Emphasized transitions (page transitions, drawers)
- **slow** (700ms): Dramatic transitions (full-screen overlays)
- **verySlow** (1000ms): Showcase animations (intro sequences)

## Easing Functions

- **linear**: Constant speed (mechanical motion, progress bars)
- **easeIn**: Slow → Fast (exiting elements)
- **easeOut**: Fast → Slow (entering elements) - **Recommended default**
- **easeInOut**: Symmetric (position changes)
- **emphasizedDecelerate**: Material Design 3 (expanding UI)
- **emphasizedAccelerate**: Material Design 3 (collapsing UI)
- **spring**: Slight overshoot (playful interactions)
- **elastic**: Pronounced bounce (celebratory moments)

## Reduced Motion (WCAG 2.2 AA)

All animations automatically respect \`prefers-reduced-motion\`:
- Users with vestibular disorders can disable animations
- Animations become instant when reduced motion is enabled
- Essential feedback preserved (e.g., fade-only transitions)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Animation demo component
const AnimationDemo = ({
  label,
  duration,
  easing,
  trigger = 'hover',
}: {
  label: string;
  duration: string;
  easing: string;
  trigger?: 'hover' | 'click';
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleInteraction = () => {
    if (trigger === 'click') {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), parseInt(duration) + 100);
    }
  };

  return (
    <div
      style={{
        padding: '1rem',
        marginBottom: '1rem',
        border: '1px solid oklch(0.85 0.02 250)',
        borderRadius: '8px',
        cursor: trigger === 'click' ? 'pointer' : 'default',
      }}
      onClick={handleInteraction}
      onMouseEnter={() => trigger === 'hover' && setIsAnimating(true)}
      onMouseLeave={() => trigger === 'hover' && setIsAnimating(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            background: isAnimating ? 'oklch(0.50 0.12 230)' : 'oklch(0.85 0.02 250)',
            borderRadius: '8px',
            transition: `all ${duration} ${easing}`,
            transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
          }}
        />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: '12px', color: 'oklch(0.50 0.02 250)', fontFamily: 'monospace' }}>
            {duration} {easing}
          </div>
          <div style={{ fontSize: '11px', color: 'oklch(0.60 0.02 250)', marginTop: '0.25rem' }}>
            {trigger === 'hover' ? 'Hover to animate' : 'Click to animate'}
          </div>
        </div>
      </div>
    </div>
  );
};

// Easing comparison component
const EasingComparison = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const easings = [
    { name: 'linear', value: motionTokens.tokens.motion.easing.linear.value },
    { name: 'easeIn', value: motionTokens.tokens.motion.easing.easeIn.value },
    { name: 'easeOut', value: motionTokens.tokens.motion.easing.easeOut.value },
    { name: 'easeInOut', value: motionTokens.tokens.motion.easing.easeInOut.value },
    { name: 'emphasizedDecelerate', value: motionTokens.tokens.motion.easing.emphasizedDecelerate.value },
    { name: 'emphasizedAccelerate', value: motionTokens.tokens.motion.easing.emphasizedAccelerate.value },
    { name: 'spring', value: motionTokens.tokens.motion.easing.spring.value },
    { name: 'elastic', value: motionTokens.tokens.motion.easing.elastic.value },
  ];

  return (
    <div style={{ width: '600px' }}>
      <button
        onClick={() => {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1100);
        }}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'oklch(0.50 0.12 230)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '2rem',
        }}
      >
        Animate All Easings
      </button>

      {easings.map((easing) => (
        <div
          key={easing.name}
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            border: '1px solid oklch(0.85 0.02 250)',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '0.5rem' }}>
            {easing.name}
          </div>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'oklch(0.50 0.02 250)', marginBottom: '0.5rem' }}>
            {easing.value}
          </div>
          <div style={{ position: 'relative', height: '30px', background: 'oklch(0.95 0.02 250)', borderRadius: '4px' }}>
            <div
              style={{
                position: 'absolute',
                left: isAnimating ? 'calc(100% - 30px)' : '0',
                width: '30px',
                height: '30px',
                background: 'oklch(0.50 0.12 230)',
                borderRadius: '4px',
                transition: `left 1000ms ${easing.value}`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Reduced motion demo
const ReducedMotionDemo = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div style={{ width: '500px' }}>
      <div style={{
        padding: '1rem',
        background: 'oklch(0.95 0.16 142)',
        borderRadius: '8px',
        marginBottom: '1rem',
        border: '1px solid oklch(0.85 0.16 142)',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '0.5rem' }}>
          🎯 Accessibility Feature
        </div>
        <div style={{ fontSize: '12px', color: 'oklch(0.30 0.16 142)' }}>
          This system respects <code>prefers-reduced-motion</code> for users with vestibular disorders.
          Toggle the switch below to simulate reduced motion mode.
        </div>
      </div>

      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem',
        border: '1px solid oklch(0.85 0.02 250)',
        borderRadius: '8px',
        marginBottom: '2rem',
        cursor: 'pointer',
      }}>
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(e) => setReducedMotion(e.target.checked)}
          style={{ width: '20px', height: '20px' }}
        />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>
            Reduced Motion Mode
          </div>
          <div style={{ fontSize: '12px', color: 'oklch(0.50 0.02 250)' }}>
            {reducedMotion ? 'Animations are instant' : 'Animations are normal'}
          </div>
        </div>
      </label>

      <button
        onClick={() => {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), reducedMotion ? 50 : 1100);
        }}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'oklch(0.50 0.12 230)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '2rem',
        }}
      >
        Trigger Animation
      </button>

      <div style={{
        padding: '2rem',
        background: 'oklch(0.95 0.02 250)',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}>
        <div
          style={{
            width: '100px',
            height: '100px',
            background: 'oklch(0.50 0.12 230)',
            borderRadius: '8px',
            transform: isAnimating ? 'scale(1.5) rotate(180deg)' : 'scale(1) rotate(0deg)',
            transition: reducedMotion
              ? 'all 0.01ms linear'
              : 'all 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: reducedMotion ? 'oklch(0.95 0.18 29)' : 'oklch(0.95 0.16 142)',
        border: `1px solid ${reducedMotion ? 'oklch(0.85 0.18 29)' : 'oklch(0.85 0.16 142)'}`,
        borderRadius: '8px',
        fontSize: '12px',
      }}>
        <strong>{reducedMotion ? '⚠️ Reduced Motion Active' : '✓ Normal Motion'}</strong>
        <div style={{ marginTop: '0.5rem', color: 'oklch(0.30 0.02 250)' }}>
          {reducedMotion
            ? 'Animation completed instantly (0.01ms) to prevent vestibular discomfort.'
            : 'Animation used 1000ms spring easing for smooth, playful motion.'}
        </div>
      </div>
    </div>
  );
};

export const DurationTokens: Story = {
  render: () => (
    <div style={{ padding: '2rem', width: '600px' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '24px', fontWeight: 700 }}>Duration Tokens</h2>

      <AnimationDemo
        label="Fast (100ms)"
        duration={motionTokens.tokens.motion.duration.fast.value}
        easing="ease-out"
        trigger="hover"
      />

      <AnimationDemo
        label="Quick (200ms)"
        duration={motionTokens.tokens.motion.duration.quick.value}
        easing="ease-out"
        trigger="hover"
      />

      <AnimationDemo
        label="Normal (300ms) - Recommended"
        duration={motionTokens.tokens.motion.duration.normal.value}
        easing="ease-out"
        trigger="click"
      />

      <AnimationDemo
        label="Moderate (500ms)"
        duration={motionTokens.tokens.motion.duration.moderate.value}
        easing="ease-out"
        trigger="click"
      />

      <AnimationDemo
        label="Slow (700ms)"
        duration={motionTokens.tokens.motion.duration.slow.value}
        easing="ease-out"
        trigger="click"
      />

      <AnimationDemo
        label="Very Slow (1000ms)"
        duration={motionTokens.tokens.motion.duration.verySlow.value}
        easing="ease-out"
        trigger="click"
      />
    </div>
  ),
};

export const EasingCurves: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '24px', fontWeight: 700 }}>Easing Curves</h2>
      <p style={{ marginBottom: '2rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        Click "Animate All Easings" to see how different easing curves affect motion timing.
      </p>
      <EasingComparison />
    </div>
  ),
};

export const ReducedMotion: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '24px', fontWeight: 700 }}>
        Reduced Motion (WCAG 2.2 AA)
      </h2>
      <p style={{ marginBottom: '2rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        Users with vestibular disorders can enable reduced motion in their OS settings.
        Our system automatically respects this preference.
      </p>
      <ReducedMotionDemo />
    </div>
  ),
};

export const AnimationPresets: Story = {
  render: () => (
    <div style={{ padding: '2rem', width: '600px' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '24px', fontWeight: 700 }}>Animation Presets</h2>

      <p style={{ marginBottom: '2rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        Common UI patterns with recommended duration + easing combinations.
      </p>

      <AnimationDemo
        label="Button Press (quick + ease-out)"
        duration="200ms"
        easing="cubic-bezier(0, 0, 0.2, 1)"
        trigger="click"
      />

      <AnimationDemo
        label="Menu Open (normal + emphasized-decelerate)"
        duration="300ms"
        easing="cubic-bezier(0.05, 0.7, 0.1, 1)"
        trigger="click"
      />

      <AnimationDemo
        label="Modal Open (moderate + ease-out)"
        duration="500ms"
        easing="cubic-bezier(0, 0, 0.2, 1)"
        trigger="click"
      />

      <AnimationDemo
        label="Notification (moderate + spring)"
        duration="500ms"
        easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
        trigger="click"
      />

      <AnimationDemo
        label="Page Transition (slow + ease-in-out)"
        duration="700ms"
        easing="cubic-bezier(0.4, 0, 0.2, 1)"
        trigger="click"
      />
    </div>
  ),
};
