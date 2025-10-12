import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

// Custom Storybook theme
const localBrainTheme = create({
  base: 'light',

  // Brand
  brandTitle: 'LocalBrain Design System',
  brandUrl: 'https://localbrain.com',
  brandImage: undefined,  // Add logo path if available
  brandTarget: '_self',

  // Colors (using OKLCH tokens)
  colorPrimary: '#4f8fff',  // Accent color
  colorSecondary: '#4f8fff',

  // UI
  appBg: '#fafafa',  // Surface bg
  appContentBg: '#ffffff',
  appBorderColor: '#e5e5e5',
  appBorderRadius: 8,

  // Typography
  fontBase: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontCode: '"Fira Code", "Monaco", monospace',

  // Text colors
  textColor: '#2a2a2a',  // Surface text
  textInverseColor: '#ffffff',
  textMutedColor: '#6b6b6b',  // Surface text muted

  // Toolbar default and active colors
  barTextColor: '#6b6b6b',
  barSelectedColor: '#4f8fff',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e5e5e5',
  inputTextColor: '#2a2a2a',
  inputBorderRadius: 4,
});

addons.setConfig({
  theme: localBrainTheme,
  panelPosition: 'bottom',  // Panel at bottom by default
  enableShortcuts: true,  // Enable keyboard shortcuts
  showToolbar: true,  // Show toolbar
  selectedPanel: 'controls',  // Default to controls panel
  initialActive: 'canvas',  // Start on canvas tab
  sidebar: {
    showRoots: true,  // Show root level categories
    collapsedRoots: [],  // Don't collapse any roots
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
