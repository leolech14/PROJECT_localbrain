import type { Preview } from '@storybook/react';
import '../styles/globals.css';  // Import global styles (includes design tokens)

const preview: Preview = {
  // Global parameters
  parameters: {
    // Controls addon configuration
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,  // Expand controls panel by default
      sort: 'requiredFirst',  // Show required props first
    },

    // Actions addon configuration
    actions: {
      argTypesRegex: '^on[A-Z].*',  // Auto-detect event handlers
    },

    // Backgrounds addon configuration
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'oklch(0.97 0.02 250)',  // Surface bg from design tokens
        },
        {
          name: 'dark',
          value: 'oklch(0.15 0.02 250)',  // Dark background
        },
        {
          name: 'accent',
          value: 'oklch(0.50 0.12 230)',  // Accent background
        },
      ],
    },

    // Viewport addon configuration
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
        wide: {
          name: 'Wide',
          styles: { width: '1920px', height: '1080px' },
        },
      },
    },

    // Docs addon configuration
    docs: {
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h2, h3',
        ignoreSelector: '#primary',
        title: 'Table of Contents',
        disable: false,
      },
      source: {
        state: 'open',  // Show source code by default
      },
    },

    // Accessibility addon configuration
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,  // Check APCA contrast
          },
          {
            id: 'duplicate-id',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,  // Check form labels
          },
          {
            id: 'button-name',
            enabled: true,  // Check button accessible names
          },
        ],
      },
      manual: false,  // Auto-run accessibility tests
    },

    // Layout configuration
    layout: 'centered',  // Center stories in canvas

    // Options configuration
    options: {
      storySort: {
        order: [
          'Introduction',
          'Design Tokens',
          ['Overview', 'Colors', 'Spacing', 'Typography', 'Motion'],
          'Components',
          'Patterns',
          'Examples',
        ],
      },
    },
  },

  // Global decorators
  decorators: [
    // Add padding around stories
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],

  // Global arg types (for all stories)
  argTypes: {
    // Common prop types
    className: {
      control: 'text',
      description: 'CSS class name',
      table: { category: 'Styling' },
    },
    style: {
      control: 'object',
      description: 'Inline styles',
      table: { category: 'Styling' },
    },
  },

  // Tags configuration
  tags: ['autodocs'],  // Enable autodocs for all stories
};

export default preview;
