import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import designTokens from '../../../tokens/design-tokens.json';

const meta: Meta = {
  title: 'Design Tokens/Spacing',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Spacing System

LocalBrain uses a **4px base unit** spacing scale with 16 steps for consistent, predictable layouts.

## Spacing Scale

- **0**: 0px (no space)
- **px**: 1px (borders, dividers)
- **0.5**: 2px (micro spacing)
- **1**: 4px (base unit)
- **1.5**: 6px
- **2**: 8px (compact spacing)
- **2.5**: 10px
- **3**: 12px
- **3.5**: 14px
- **4**: 16px (comfortable spacing) - **Recommended default**
- **5**: 20px
- **6**: 24px (generous spacing)
- **7**: 28px
- **8**: 32px (section spacing)
- **9**: 36px
- **10**: 40px
- **12**: 48px (large spacing)
- **16**: 64px (huge spacing)

## Border Radius

- **none**: 0px (sharp corners)
- **sm**: 4px (subtle rounding)
- **base**: 8px (standard cards, buttons) - **Recommended default**
- **md**: 12px (emphasized rounding)
- **lg**: 16px (large panels)
- **xl**: 24px (modals, overlays)
- **full**: 9999px (pills, circles)

## Usage Guidelines

- Use **spacing-4** (16px) as the default comfortable spacing
- Use **spacing-2** (8px) for compact UI elements
- Use **spacing-6** (24px) for generous breathing room
- Use **spacing-8** (32px) or larger for section separation
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Spacing token component
const SpacingToken = ({
  name,
  value,
  usage,
}: {
  name: string;
  value: string;
  usage?: string;
}) => (
  <div style={{
    marginBottom: '1rem',
    padding: '1rem',
    border: '1px solid oklch(0.85 0.02 250)',
    borderRadius: '8px',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '0.5rem',
    }}>
      <div
        style={{
          width: value,
          height: '40px',
          background: 'oklch(0.50 0.12 230)',
          borderRadius: '4px',
          minWidth: '1px',
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>
          {name}
        </div>
        <div style={{ fontSize: '12px', color: 'oklch(0.50 0.02 250)', fontFamily: 'monospace' }}>
          {value}
        </div>
        {usage && (
          <div style={{ fontSize: '11px', color: 'oklch(0.60 0.02 250)', marginTop: '0.25rem' }}>
            {usage}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Border radius component
const BorderRadiusToken = ({
  name,
  value,
  usage,
}: {
  name: string;
  value: string;
  usage?: string;
}) => (
  <div style={{
    marginBottom: '1rem',
    padding: '1rem',
    border: '1px solid oklch(0.85 0.02 250)',
    borderRadius: '8px',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '0.5rem',
    }}>
      <div
        style={{
          width: '80px',
          height: '80px',
          background: 'oklch(0.50 0.12 230)',
          borderRadius: value,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>
          {name}
        </div>
        <div style={{ fontSize: '12px', color: 'oklch(0.50 0.02 250)', fontFamily: 'monospace' }}>
          {value}
        </div>
        {usage && (
          <div style={{ fontSize: '11px', color: 'oklch(0.60 0.02 250)', marginTop: '0.25rem' }}>
            {usage}
          </div>
        )}
      </div>
    </div>
  </div>
);

export const SpacingScale: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>Spacing Scale</h1>

      <p style={{ marginBottom: '2rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        Based on 4px base unit for consistent, predictable layouts.
      </p>

      <SpacingToken name="spacing-0" value="0px" usage="No space" />
      <SpacingToken name="spacing-px" value="1px" usage="Borders, dividers" />
      <SpacingToken name="spacing-0.5" value="2px" usage="Micro spacing" />
      <SpacingToken name="spacing-1" value="4px" usage="Base unit" />
      <SpacingToken name="spacing-1.5" value="6px" />
      <SpacingToken name="spacing-2" value="8px" usage="Compact spacing" />
      <SpacingToken name="spacing-2.5" value="10px" />
      <SpacingToken name="spacing-3" value="12px" />
      <SpacingToken name="spacing-3.5" value="14px" />
      <SpacingToken name="spacing-4" value="16px" usage="Comfortable spacing (recommended default)" />
      <SpacingToken name="spacing-5" value="20px" />
      <SpacingToken name="spacing-6" value="24px" usage="Generous spacing" />
      <SpacingToken name="spacing-7" value="28px" />
      <SpacingToken name="spacing-8" value="32px" usage="Section spacing" />
      <SpacingToken name="spacing-9" value="36px" />
      <SpacingToken name="spacing-10" value="40px" />
      <SpacingToken name="spacing-12" value="48px" usage="Large spacing" />
      <SpacingToken name="spacing-16" value="64px" usage="Huge spacing" />
    </div>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>Border Radius</h1>

      <p style={{ marginBottom: '2rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        Consistent rounding for cards, buttons, and containers.
      </p>

      <BorderRadiusToken
        name="radius-none"
        value={designTokens.tokens.borderRadius.none.value}
        usage="Sharp corners (0px)"
      />
      <BorderRadiusToken
        name="radius-sm"
        value={designTokens.tokens.borderRadius.sm.value}
        usage="Subtle rounding (4px)"
      />
      <BorderRadiusToken
        name="radius-base"
        value={designTokens.tokens.borderRadius.base.value}
        usage="Standard cards, buttons (8px) - Recommended default"
      />
      <BorderRadiusToken
        name="radius-md"
        value={designTokens.tokens.borderRadius.md.value}
        usage="Emphasized rounding (12px)"
      />
      <BorderRadiusToken
        name="radius-lg"
        value={designTokens.tokens.borderRadius.lg.value}
        usage="Large panels (16px)"
      />
      <BorderRadiusToken
        name="radius-xl"
        value={designTokens.tokens.borderRadius.xl.value}
        usage="Modals, overlays (24px)"
      />
      <BorderRadiusToken
        name="radius-full"
        value={designTokens.tokens.borderRadius.full.value}
        usage="Pills, circles (9999px)"
      />
    </div>
  ),
};

export const LayoutExamples: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>Layout Examples</h1>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 700 }}>
          Compact Layout (spacing-2 = 8px)
        </h2>
        <div style={{
          padding: designTokens.tokens.spacing['2'].value,
          background: 'oklch(0.92 0.02 250)',
          borderRadius: designTokens.tokens.borderRadius.base.value,
          border: '1px solid oklch(0.85 0.02 250)',
        }}>
          <div style={{
            padding: designTokens.tokens.spacing['2'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.sm.value,
            marginBottom: designTokens.tokens.spacing['2'].value,
          }}>
            Card with compact spacing (8px padding)
          </div>
          <div style={{
            padding: designTokens.tokens.spacing['2'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.sm.value,
            marginBottom: designTokens.tokens.spacing['2'].value,
          }}>
            Another card with 8px gap between
          </div>
          <div style={{
            padding: designTokens.tokens.spacing['2'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.sm.value,
          }}>
            Compact for dense UIs
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 700 }}>
          Comfortable Layout (spacing-4 = 16px) - Recommended
        </h2>
        <div style={{
          padding: designTokens.tokens.spacing['4'].value,
          background: 'oklch(0.92 0.02 250)',
          borderRadius: designTokens.tokens.borderRadius.base.value,
          border: '1px solid oklch(0.85 0.02 250)',
        }}>
          <div style={{
            padding: designTokens.tokens.spacing['4'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.base.value,
            marginBottom: designTokens.tokens.spacing['4'].value,
          }}>
            Card with comfortable spacing (16px padding)
          </div>
          <div style={{
            padding: designTokens.tokens.spacing['4'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.base.value,
            marginBottom: designTokens.tokens.spacing['4'].value,
          }}>
            Another card with 16px gap between
          </div>
          <div style={{
            padding: designTokens.tokens.spacing['4'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.base.value,
          }}>
            Comfortable for most UIs (default)
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 700 }}>
          Generous Layout (spacing-6 = 24px)
        </h2>
        <div style={{
          padding: designTokens.tokens.spacing['6'].value,
          background: 'oklch(0.92 0.02 250)',
          borderRadius: designTokens.tokens.borderRadius.base.value,
          border: '1px solid oklch(0.85 0.02 250)',
        }}>
          <div style={{
            padding: designTokens.tokens.spacing['6'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.md.value,
            marginBottom: designTokens.tokens.spacing['6'].value,
          }}>
            Card with generous spacing (24px padding)
          </div>
          <div style={{
            padding: designTokens.tokens.spacing['6'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.md.value,
            marginBottom: designTokens.tokens.spacing['6'].value,
          }}>
            Another card with 24px gap between
          </div>
          <div style={{
            padding: designTokens.tokens.spacing['6'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.md.value,
          }}>
            Generous for marketing pages and hero sections
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 700 }}>
          Section Spacing (spacing-8 = 32px)
        </h2>
        <div style={{
          padding: designTokens.tokens.spacing['8'].value,
          background: 'oklch(0.92 0.02 250)',
          borderRadius: designTokens.tokens.borderRadius.lg.value,
          border: '1px solid oklch(0.85 0.02 250)',
        }}>
          <div style={{
            padding: designTokens.tokens.spacing['8'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.md.value,
            marginBottom: designTokens.tokens.spacing['8'].value,
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: designTokens.tokens.spacing['4'].value }}>
              Section 1
            </h3>
            <p>Large spacing (32px) separates major sections clearly.</p>
          </div>
          <div style={{
            padding: designTokens.tokens.spacing['8'].value,
            background: 'white',
            borderRadius: designTokens.tokens.borderRadius.md.value,
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: designTokens.tokens.spacing['4'].value }}>
              Section 2
            </h3>
            <p>Use section spacing for clear visual hierarchy.</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CardExamples: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>Card Examples</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: designTokens.tokens.spacing['4'].value,
      }}>
        {/* Compact card */}
        <div style={{
          padding: designTokens.tokens.spacing['3'].value,
          background: 'white',
          border: '1px solid oklch(0.85 0.02 250)',
          borderRadius: designTokens.tokens.borderRadius.sm.value,
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: designTokens.tokens.spacing['2'].value,
          }}>
            Compact Card
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'oklch(0.40 0.02 250)',
            marginBottom: designTokens.tokens.spacing['2'].value,
          }}>
            Small radius (4px), compact padding (12px)
          </p>
          <button style={{
            padding: `${designTokens.tokens.spacing['1'].value} ${designTokens.tokens.spacing['2'].value}`,
            background: 'oklch(0.50 0.12 230)',
            color: 'white',
            border: 'none',
            borderRadius: designTokens.tokens.borderRadius.sm.value,
            fontSize: '12px',
            cursor: 'pointer',
          }}>
            Action
          </button>
        </div>

        {/* Standard card */}
        <div style={{
          padding: designTokens.tokens.spacing['4'].value,
          background: 'white',
          border: '1px solid oklch(0.85 0.02 250)',
          borderRadius: designTokens.tokens.borderRadius.base.value,
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: designTokens.tokens.spacing['3'].value,
          }}>
            Standard Card
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'oklch(0.40 0.02 250)',
            marginBottom: designTokens.tokens.spacing['3'].value,
          }}>
            Base radius (8px), comfortable padding (16px)
          </p>
          <button style={{
            padding: `${designTokens.tokens.spacing['2'].value} ${designTokens.tokens.spacing['4'].value}`,
            background: 'oklch(0.50 0.12 230)',
            color: 'white',
            border: 'none',
            borderRadius: designTokens.tokens.borderRadius.base.value,
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            Action
          </button>
        </div>

        {/* Generous card */}
        <div style={{
          padding: designTokens.tokens.spacing['6'].value,
          background: 'white',
          border: '1px solid oklch(0.85 0.02 250)',
          borderRadius: designTokens.tokens.borderRadius.md.value,
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: designTokens.tokens.spacing['4'].value,
          }}>
            Generous Card
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'oklch(0.40 0.02 250)',
            marginBottom: designTokens.tokens.spacing['4'].value,
          }}>
            Medium radius (12px), generous padding (24px)
          </p>
          <button style={{
            padding: `${designTokens.tokens.spacing['3'].value} ${designTokens.tokens.spacing['6'].value}`,
            background: 'oklch(0.50 0.12 230)',
            color: 'white',
            border: 'none',
            borderRadius: designTokens.tokens.borderRadius.base.value,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Action
          </button>
        </div>
      </div>
    </div>
  ),
};
