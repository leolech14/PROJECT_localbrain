import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  // Stories location
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../tokens/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../motion/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../localbrain-ui/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  // Addons
  addons: [
    '@storybook/addon-essentials',           // Essential addons (docs, controls, actions, etc.)
    '@storybook/addon-interactions',         // Interaction testing
    '@storybook/addon-links',                // Deep linking between stories
    '@storybook/addon-a11y',                 // Accessibility testing
    '@chromatic-com/storybook',              // Visual regression testing
    '@storybook/addon-designs',              // Design integration (Figma, Sketch)
    '@storybook/addon-storysource',          // View story source code
    '@storybook/addon-measure',              // Measure UI elements
    '@storybook/addon-outline',              // Outline UI elements
  ],

  // Framework
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: path.resolve(__dirname, '../../../localbrain-ui/next.config.js'),
    },
  },

  // TypeScript configuration
  typescript: {
    check: false,  // Disable TS checking for faster builds
    reactDocgen: 'react-docgen-typescript',  // Generate prop types documentation
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },

  // Docs configuration
  docs: {
    autodocs: 'tag',  // Enable automatic documentation
    defaultName: 'Documentation',
  },

  // Static directories
  staticDirs: ['../public'],

  // Core options
  core: {
    disableTelemetry: true,  // Disable analytics
  },

  // Features
  features: {
    storyStoreV7: true,  // Use modern story indexing
  },

  // Build configuration
  refs: {},  // External Storybook refs (if needed)

  // Webpack configuration (if needed for custom aliases)
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@design/tokens': path.resolve(__dirname, '../../tokens'),
        '@design/motion': path.resolve(__dirname, '../../motion'),
        '@design/apca': path.resolve(__dirname, '../../apca'),
      };
    }
    return config;
  },
};

export default config;
