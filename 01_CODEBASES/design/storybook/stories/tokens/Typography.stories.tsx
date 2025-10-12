import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import designTokens from '../../../tokens/design-tokens.json';

const meta: Meta = {
  title: 'Design Tokens/Typography',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Typography System

LocalBrain uses a modular type scale based on perfect fourths (1.333 ratio) with system font stacks.

## Type Scale

- **xs** (12px): Metadata, captions, tiny labels
- **sm** (14px): Secondary text, form labels
- **base** (16px): Body text, paragraphs (default)
- **lg** (18px): Emphasized body text, large buttons
- **xl** (21px): Small headings, subheaders
- **2xl** (28px): Section headings
- **3xl** (37px): Page titles
- **4xl** (50px): Hero headings

## Font Families

- **sans**: "Inter", system-ui, sans-serif (UI text, body copy)
- **mono**: "Fira Code", "Monaco", monospace (code, data)

## Line Heights

- **tight** (1.25): Headings, titles
- **normal** (1.5): Body text (default)
- **relaxed** (1.75): Long-form content

## Font Weights

- **400**: Regular (body text)
- **500**: Medium (emphasis)
- **600**: Semibold (UI elements, buttons)
- **700**: Bold (headings)
- **800**: Extrabold (hero text)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Type scale component
const TypeScaleExample = ({
  size,
  label,
  usage,
}: {
  size: string;
  label: string;
  usage: string;
}) => {
  const fontSize = designTokens.tokens.typography.fontSize[size as keyof typeof designTokens.tokens.typography.fontSize].value;

  return (
    <div style={{
      marginBottom: '2rem',
      padding: '1.5rem',
      border: '1px solid oklch(0.85 0.02 250)',
      borderRadius: '8px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'oklch(0.50 0.02 250)',
        }}>
          {label} ({fontSize})
        </div>
        <div style={{
          fontSize: '11px',
          color: 'oklch(0.60 0.02 250)',
        }}>
          {usage}
        </div>
      </div>
      <div style={{
        fontSize,
        color: 'oklch(0.22 0.04 262)',
      }}>
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  );
};

// Font weight component
const FontWeightExample = ({
  weight,
  label,
  usage,
}: {
  weight: string;
  label: string;
  usage: string;
}) => {
  return (
    <div style={{
      marginBottom: '1.5rem',
      padding: '1.5rem',
      border: '1px solid oklch(0.85 0.02 250)',
      borderRadius: '8px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'oklch(0.50 0.02 250)',
        }}>
          {label} ({weight})
        </div>
        <div style={{
          fontSize: '11px',
          color: 'oklch(0.60 0.02 250)',
        }}>
          {usage}
        </div>
      </div>
      <div style={{
        fontSize: '18px',
        fontWeight: weight,
        color: 'oklch(0.22 0.04 262)',
      }}>
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  );
};

// Line height component
const LineHeightExample = ({
  lineHeight,
  label,
  usage,
}: {
  lineHeight: string;
  label: string;
  usage: string;
}) => {
  return (
    <div style={{
      marginBottom: '2rem',
      padding: '1.5rem',
      border: '1px solid oklch(0.85 0.02 250)',
      borderRadius: '8px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'oklch(0.50 0.02 250)',
        }}>
          {label} ({lineHeight})
        </div>
        <div style={{
          fontSize: '11px',
          color: 'oklch(0.60 0.02 250)',
        }}>
          {usage}
        </div>
      </div>
      <div style={{
        fontSize: '16px',
        lineHeight,
        color: 'oklch(0.22 0.04 262)',
      }}>
        Typography is the art and technique of arranging type to make written language legible,
        readable and appealing when displayed. The arrangement of type involves selecting typefaces,
        point sizes, line lengths, line-spacing, and letter-spacing.
      </div>
    </div>
  );
};

export const TypeScale: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>Type Scale</h1>

      <p style={{ marginBottom: '2rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        Based on perfect fourths (1.333 ratio) for harmonious hierarchy.
      </p>

      <TypeScaleExample size="xs" label="Extra Small" usage="Metadata, captions" />
      <TypeScaleExample size="sm" label="Small" usage="Secondary text, form labels" />
      <TypeScaleExample size="base" label="Base" usage="Body text (default)" />
      <TypeScaleExample size="lg" label="Large" usage="Emphasized body text" />
      <TypeScaleExample size="xl" label="Extra Large" usage="Small headings" />
      <TypeScaleExample size="2xl" label="2X Large" usage="Section headings" />
      <TypeScaleExample size="3xl" label="3X Large" usage="Page titles" />
      <TypeScaleExample size="4xl" label="4X Large" usage="Hero headings" />
    </div>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>Font Weights</h1>

      <p style={{ marginBottom: '2rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        Inter variable font supports weights from 400 to 800.
      </p>

      <FontWeightExample weight="400" label="Regular" usage="Body text, paragraphs" />
      <FontWeightExample weight="500" label="Medium" usage="Emphasis, highlighted text" />
      <FontWeightExample weight="600" label="Semibold" usage="UI elements, buttons" />
      <FontWeightExample weight="700" label="Bold" usage="Headings, titles" />
      <FontWeightExample weight="800" label="Extrabold" usage="Hero text, impact" />
    </div>
  ),
};

export const LineHeights: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>Line Heights</h1>

      <p style={{ marginBottom: '2rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        Different line heights for different use cases.
      </p>

      <LineHeightExample lineHeight="1.25" label="Tight" usage="Headings, titles" />
      <LineHeightExample lineHeight="1.5" label="Normal" usage="Body text (default)" />
      <LineHeightExample lineHeight="1.75" label="Relaxed" usage="Long-form content" />
    </div>
  ),
};

export const FontFamilies: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: 'oklch(0.97 0.02 250)' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '32px', fontWeight: 800 }}>Font Families</h1>

      <div style={{
        marginBottom: '2rem',
        padding: '2rem',
        border: '1px solid oklch(0.85 0.02 250)',
        borderRadius: '8px',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '1rem',
          color: 'oklch(0.50 0.02 250)',
        }}>
          Sans-Serif (Inter)
        </div>
        <div style={{
          fontFamily: designTokens.tokens.typography.fontFamily.sans.value,
          fontSize: '16px',
          marginBottom: '1rem',
          color: 'oklch(0.22 0.04 262)',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '0.5rem' }}>
            The quick brown fox jumps over the lazy dog
          </h2>
          <p style={{ marginBottom: '0.5rem' }}>
            Inter is a variable font optimized for user interfaces with excellent legibility at small sizes.
            It features tall x-height and wide apertures for clarity on screens.
          </p>
          <p style={{ fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
            Usage: UI text, body copy, headings, buttons, forms
          </p>
        </div>
        <div style={{
          fontSize: '11px',
          fontFamily: 'monospace',
          color: 'oklch(0.60 0.02 250)',
        }}>
          font-family: {designTokens.tokens.typography.fontFamily.sans.value}
        </div>
      </div>

      <div style={{
        padding: '2rem',
        border: '1px solid oklch(0.85 0.02 250)',
        borderRadius: '8px',
        background: 'oklch(0.15 0.02 250)',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '1rem',
          color: 'oklch(0.70 0.02 250)',
        }}>
          Monospace (Fira Code)
        </div>
        <div style={{
          fontFamily: designTokens.tokens.typography.fontFamily.mono.value,
          fontSize: '14px',
          marginBottom: '1rem',
          color: 'oklch(0.90 0.02 250)',
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            {'const greeting = "Hello, World!";'}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            {'function add(a: number, b: number): number {'}
          </div>
          <div style={{ marginBottom: '0.5rem', paddingLeft: '2rem' }}>
            {'  return a + b;'}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            {'}'}
          </div>
          <p style={{ fontSize: '12px', color: 'oklch(0.60 0.02 250)' }}>
            Usage: Code blocks, terminal output, data tables, API responses
          </p>
        </div>
        <div style={{
          fontSize: '11px',
          fontFamily: 'monospace',
          color: 'oklch(0.50 0.02 250)',
        }}>
          font-family: {designTokens.tokens.typography.fontFamily.mono.value}
        </div>
      </div>
    </div>
  ),
};

export const TypographyHierarchy: Story = {
  render: () => (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'oklch(0.97 0.02 250)',
    }}>
      <h1 style={{
        fontSize: designTokens.tokens.typography.fontSize['4xl'].value,
        fontWeight: 800,
        marginBottom: '0.5rem',
        color: 'oklch(0.22 0.04 262)',
      }}>
        Hero Heading (4xl)
      </h1>

      <p style={{
        fontSize: designTokens.tokens.typography.fontSize.lg.value,
        color: 'oklch(0.40 0.02 250)',
        marginBottom: '2rem',
      }}>
        This is a subtitle or lead paragraph using large text (lg).
      </p>

      <h2 style={{
        fontSize: designTokens.tokens.typography.fontSize['3xl'].value,
        fontWeight: 700,
        marginBottom: '1rem',
        marginTop: '2rem',
        color: 'oklch(0.22 0.04 262)',
      }}>
        Page Title (3xl)
      </h2>

      <p style={{
        fontSize: designTokens.tokens.typography.fontSize.base.value,
        lineHeight: 1.5,
        marginBottom: '1rem',
        color: 'oklch(0.22 0.04 262)',
      }}>
        This is body text using the base size (16px). It's comfortable to read at this size,
        with proper line height (1.5) for readability. Body text should always meet APCA contrast
        requirements (≥60 Lc).
      </p>

      <h3 style={{
        fontSize: designTokens.tokens.typography.fontSize['2xl'].value,
        fontWeight: 700,
        marginBottom: '0.75rem',
        marginTop: '1.5rem',
        color: 'oklch(0.22 0.04 262)',
      }}>
        Section Heading (2xl)
      </h3>

      <p style={{
        fontSize: designTokens.tokens.typography.fontSize.base.value,
        lineHeight: 1.5,
        marginBottom: '1rem',
        color: 'oklch(0.22 0.04 262)',
      }}>
        Section headings help break up content into digestible chunks. They use a bold weight
        and larger size to establish clear hierarchy.
      </p>

      <h4 style={{
        fontSize: designTokens.tokens.typography.fontSize.xl.value,
        fontWeight: 600,
        marginBottom: '0.5rem',
        marginTop: '1.5rem',
        color: 'oklch(0.22 0.04 262)',
      }}>
        Subsection Heading (xl)
      </h4>

      <p style={{
        fontSize: designTokens.tokens.typography.fontSize.base.value,
        lineHeight: 1.5,
        marginBottom: '0.5rem',
        color: 'oklch(0.22 0.04 262)',
      }}>
        Subsection headings provide additional structure within sections.
      </p>

      <ul style={{
        fontSize: designTokens.tokens.typography.fontSize.sm.value,
        lineHeight: 1.5,
        marginBottom: '1rem',
        color: 'oklch(0.40 0.02 250)',
        paddingLeft: '1.5rem',
      }}>
        <li>Small text (sm) is used for secondary information</li>
        <li>Form labels, captions, and metadata</li>
        <li>Still maintains readability at 14px</li>
      </ul>

      <div style={{
        padding: '1rem',
        background: 'oklch(0.15 0.02 250)',
        borderRadius: '8px',
        fontFamily: designTokens.tokens.typography.fontFamily.mono.value,
        fontSize: designTokens.tokens.typography.fontSize.sm.value,
        color: 'oklch(0.90 0.02 250)',
        marginTop: '1.5rem',
      }}>
        <div>{'// Code blocks use monospace font'}</div>
        <div>{'const example = "Fira Code with ligatures";'}</div>
      </div>

      <p style={{
        fontSize: designTokens.tokens.typography.fontSize.xs.value,
        color: 'oklch(0.50 0.02 250)',
        marginTop: '1rem',
      }}>
        Extra small text (xs) for timestamps, fine print, or metadata that needs minimal emphasis.
      </p>
    </div>
  ),
};
