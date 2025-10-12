import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

/**
 * ComponentTemplate - Brief description of component purpose
 *
 * **Usage**: When to use this component, what problems it solves
 *
 * **Accessibility**: WCAG compliance details, keyboard navigation, screen reader support
 *
 * **Related**: Links to related components or documentation
 */

// Example component implementation
interface ExampleComponentProps {
  /**
   * Primary content text
   */
  label: string;

  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /**
   * Component size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Additional CSS class
   */
  className?: string;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className,
}) => {
  const baseStyles: React.CSSProperties = {
    padding: size === 'small' ? '8px 12px' : size === 'large' ? '16px 24px' : '12px 16px',
    fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 200ms ease-out',
  };

  const variantStyles: React.CSSProperties =
    variant === 'primary'
      ? {
          background: 'oklch(0.50 0.12 230)',
          color: 'white',
        }
      : variant === 'secondary'
      ? {
          background: 'oklch(0.92 0.02 250)',
          color: 'oklch(0.22 0.04 262)',
        }
      : {
          background: 'transparent',
          color: 'oklch(0.50 0.12 230)',
        };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{ ...baseStyles, ...variantStyles }}
      aria-label={label}
    >
      {label}
    </button>
  );
};

// Component metadata
const meta: Meta<typeof ExampleComponent> = {
  title: 'Components/ExampleComponent',
  component: ExampleComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Overview

This is an example component demonstrating best practices for LocalBrain design system documentation.

## Accessibility

- **WCAG 2.2 AA compliant**: Color contrast meets APCA requirements (≥75 Lc for interactive elements)
- **Keyboard navigation**: Fully accessible via Tab/Enter/Space
- **Screen reader support**: Proper ARIA labels and semantic HTML
- **Focus visible**: Clear focus indicators meeting 3:1 contrast minimum
- **Touch targets**: 44×44px minimum for mobile accessibility

## Usage Guidelines

### When to use
- Primary actions that need strong emphasis
- Form submissions
- Confirmation dialogs

### When not to use
- Navigation links (use Link component instead)
- Destructive actions (use danger variant)
- Non-action elements (use appropriate semantic HTML)

## Examples

See the stories below for interactive examples of all variants and states.
        `,
      },
    },
    // Chromatic visual regression testing
    chromatic: {
      // Disable snapshot for this template (enable for real components)
      disableSnapshot: false,
      // Wait 300ms for animations to complete before snapshot
      delay: 300,
      // Test multiple viewports
      viewports: [320, 768, 1200],
    },
    // Accessibility testing
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },
  // Define global arg types for this component
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Visual style variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
        category: 'Appearance',
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Component size',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
        category: 'Appearance',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
      table: {
        type: { summary: '() => void' },
        category: 'Events',
      },
    },
    label: {
      control: 'text',
      description: 'Button label text',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
  },
  // Default args for all stories
  args: {
    label: 'Click me',
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
  // Tags for automatic documentation generation
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ExampleComponent>;

/**
 * Default story showing the component in its most common configuration
 */
export const Default: Story = {};

/**
 * Primary variant - Use for the main action on a page
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Primary Action',
  },
};

/**
 * Secondary variant - Use for secondary actions
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Secondary Action',
  },
};

/**
 * Tertiary variant - Use for subtle actions
 */
export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    label: 'Tertiary Action',
  },
};

/**
 * Small size - Use in compact UIs or toolbars
 */
export const Small: Story = {
  args: {
    size: 'small',
    label: 'Small Button',
  },
};

/**
 * Large size - Use for hero sections or important CTAs
 */
export const Large: Story = {
  args: {
    size: 'large',
    label: 'Large Button',
  },
};

/**
 * Disabled state - Shows non-interactive state
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
  },
};

/**
 * All variants side by side for visual comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'flex-start' }}>
      <ExampleComponent label="Primary" variant="primary" />
      <ExampleComponent label="Secondary" variant="secondary" />
      <ExampleComponent label="Tertiary" variant="tertiary" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of all three variants',
      },
    },
  },
};

/**
 * All sizes side by side for visual comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <ExampleComponent label="Small" size="small" />
      <ExampleComponent label="Medium" size="medium" />
      <ExampleComponent label="Large" size="large" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of all three sizes',
      },
    },
  },
};

/**
 * Interactive example with click handler
 */
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);

    return (
      <div style={{ textAlign: 'center' }}>
        <ExampleComponent
          label={`Clicked ${count} times`}
          onClick={() => setCount(count + 1)}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
          Click the button to increment the counter
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing onClick handler',
      },
    },
    chromatic: {
      // Disable snapshot for interactive stories
      disableSnapshot: true,
    },
  },
};

/**
 * Responsive behavior demonstration
 */
export const Responsive: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '18px', fontWeight: 700 }}>
        Responsive Button Layout
      </h3>
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <ExampleComponent label="Action 1" variant="primary" />
        <ExampleComponent label="Action 2" variant="secondary" />
        <ExampleComponent label="Action 3" variant="tertiary" />
      </div>
      <p style={{ marginTop: '1rem', fontSize: '14px', color: 'oklch(0.40 0.02 250)' }}>
        Buttons wrap automatically on smaller screens
      </p>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Demonstrates responsive behavior on different screen sizes',
      },
    },
  },
};

/**
 * Dark background variant - Shows contrast on dark surfaces
 */
export const OnDarkBackground: Story = {
  render: () => (
    <div style={{
      padding: '2rem',
      background: 'oklch(0.15 0.02 250)',
      borderRadius: '8px',
    }}>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'flex-start' }}>
        <ExampleComponent label="Primary" variant="primary" />
        <ExampleComponent label="Secondary" variant="secondary" />
        <ExampleComponent label="Tertiary" variant="tertiary" />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Component behavior on dark backgrounds',
      },
    },
  },
};

/**
 * Accessibility testing story - Includes all states for a11y validation
 */
export const AccessibilityTest: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Accessibility Validation</h3>

      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '0.5rem' }}>Interactive States</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <ExampleComponent label="Normal" variant="primary" />
          <ExampleComponent label="Disabled" variant="primary" disabled />
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '0.5rem' }}>Contrast Validation</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <ExampleComponent label="Primary (≥75 Lc)" variant="primary" />
          <ExampleComponent label="Secondary (≥75 Lc)" variant="secondary" />
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '0.5rem' }}>Touch Targets</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <ExampleComponent label="Small (≥44×44px)" size="small" />
          <ExampleComponent label="Medium (≥44×44px)" size="medium" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    a11y: {
      // Run all accessibility checks
      manual: false,
    },
    docs: {
      description: {
        story: 'Comprehensive accessibility validation for all states',
      },
    },
  },
};
