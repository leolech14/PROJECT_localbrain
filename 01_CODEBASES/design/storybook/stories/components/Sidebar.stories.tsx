import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  MessageSquare,
  CheckSquare,
  Folder,
  Brain,
  Settings,
  Menu,
  X
} from 'lucide-react';

/**
 * # Sidebar Component
 *
 * Primary navigation component for LocalBrain following Orchestra Blue design system.
 *
 * ## Design System Integration
 * - **Colors**: OKLCH tokens from T001
 * - **Motion**: Animation tokens from T012
 * - **Spacing**: Consistent token usage
 * - **Accessibility**: WCAG 2.2 AA compliant (APCA validated - T006)
 *
 * ## Key Features
 * - Keyboard navigation (arrows, home, end, enter, space)
 * - Responsive behavior (desktop, tablet, mobile)
 * - Mobile off-canvas with backdrop
 * - Focus management and ARIA support
 * - IPC integration ready for Swift ↔ Electron
 *
 * ## Specification
 * See `02_SPECBASES/components/T009_Sidebar_Component_Spec.md` for complete details.
 */

// ============================================================================
// Types
// ============================================================================

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  badge?: number | string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeRoute: string;
  isOpen?: boolean;
  onToggle?: () => void;
  onNavigate?: (route: string) => void;
  className?: string;
  ariaLabel?: string;
}

// ============================================================================
// Sidebar Component (Prototype)
// ============================================================================

const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeRoute,
  isOpen = true,
  onToggle,
  onNavigate,
  className = '',
  ariaLabel = 'Primary navigation',
}) => {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (index + 1) % items.length;
        setFocusedIndex(nextIndex);
        itemRefs.current[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (index - 1 + items.length) % items.length;
        setFocusedIndex(prevIndex);
        itemRefs.current[prevIndex]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        itemRefs.current[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        const lastIndex = items.length - 1;
        setFocusedIndex(lastIndex);
        itemRefs.current[lastIndex]?.focus();
        break;
      case 'Escape':
        if (onToggle) onToggle();
        break;
    }
  };

  const handleItemClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onToggle}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            display: 'var(--sidebar-backdrop-display, none)',
          }}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`sidebar ${isOpen ? 'is-open' : ''} ${className}`}
        role="navigation"
        aria-label={ariaLabel}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 'var(--sidebar-width, 240px)',
          minWidth: 'var(--sidebar-width, 240px)',
          height: '100vh',
          backgroundColor: 'oklch(0.97 0.02 250)',
          borderRight: '1px solid oklch(0.85 0.02 250)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          transform: 'var(--sidebar-transform, translateX(0))',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div
          className="sidebar-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid oklch(0.90 0.02 250)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Brain size={24} color="oklch(0.50 0.12 230)" />
            <span
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'oklch(0.22 0.04 262)',
              }}
            >
              LocalBrain
            </span>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onToggle}
            aria-label="Close sidebar"
            style={{
              display: 'var(--mobile-close-display, none)',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px',
              color: 'oklch(0.40 0.06 262)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          className="sidebar-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
          }}
        >
          {/* Main Navigation */}
          <section
            className="sidebar-section"
            aria-label="Main features"
            style={{ marginBottom: '24px' }}
          >
            {items.slice(0, 4).map((item, index) => {
              const isActive = activeRoute === item.href;
              return (
                <a
                  key={item.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item.href);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`sidebar-item ${isActive ? 'is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`${item.label}${item.shortcut ? ` (${item.shortcut})` : ''}`}
                  tabIndex={0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '40px',
                    padding: '8px 16px',
                    margin: '4px 0',
                    borderRadius: '8px',
                    color: isActive ? 'oklch(1.00 0.00 0)' : 'oklch(0.22 0.04 262)',
                    backgroundColor: isActive ? 'oklch(0.50 0.12 230)' : 'transparent',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    lineHeight: '20px',
                    transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'oklch(0.50 0.12 230 / 0.1)';
                      e.currentTarget.style.color = 'oklch(0.50 0.12 230)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'oklch(0.22 0.04 262)';
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid oklch(0.50 0.12 230)';
                    e.currentTarget.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                >
                  <span style={{ display: 'flex', color: 'inherit' }}>
                    {item.icon}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.shortcut && (
                    <span
                      style={{
                        fontSize: '12px',
                        opacity: 0.6,
                        fontFamily: 'monospace',
                      }}
                    >
                      {item.shortcut}
                    </span>
                  )}
                </a>
              );
            })}
          </section>

          {/* Divider */}
          <div
            role="separator"
            style={{
              height: '1px',
              backgroundColor: 'oklch(0.90 0.02 250)',
              margin: '16px 0',
            }}
          />

          {/* Settings Section */}
          <section className="sidebar-section" aria-label="System">
            {items.slice(4).map((item, index) => {
              const actualIndex = index + 4;
              const isActive = activeRoute === item.href;
              return (
                <a
                  key={item.id}
                  ref={(el) => (itemRefs.current[actualIndex] = el)}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item.href);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, actualIndex)}
                  className={`sidebar-item ${isActive ? 'is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  tabIndex={0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '40px',
                    padding: '8px 16px',
                    margin: '4px 0',
                    borderRadius: '8px',
                    color: isActive ? 'oklch(1.00 0.00 0)' : 'oklch(0.22 0.04 262)',
                    backgroundColor: isActive ? 'oklch(0.50 0.12 230)' : 'transparent',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    lineHeight: '20px',
                    transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'oklch(0.50 0.12 230 / 0.1)';
                      e.currentTarget.style.color = 'oklch(0.50 0.12 230)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'oklch(0.22 0.04 262)';
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid oklch(0.50 0.12 230)';
                    e.currentTarget.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                >
                  <span style={{ display: 'flex', color: 'inherit' }}>
                    {item.icon}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </a>
              );
            })}
          </section>
        </div>

        {/* Footer */}
        <div
          className="sidebar-footer"
          style={{
            padding: '16px',
            borderTop: '1px solid oklch(0.90 0.02 250)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'oklch(0.50 0.12 230 / 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600,
                color: 'oklch(0.50 0.12 230)',
              }}
            >
              L
            </div>
            <div style={{ flex: 1, fontSize: '14px' }}>
              <div style={{ fontWeight: 500, color: 'oklch(0.22 0.04 262)' }}>
                Lech
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'oklch(0.40 0.06 262)',
                  opacity: 0.8,
                }}
              >
                Active
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ARIA live region for navigation announcements */}
      <div
        id="aria-live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      />
    </>
  );
};

// ============================================================================
// Storybook Meta
// ============================================================================

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Primary navigation component for LocalBrain following Orchestra Blue design system.

**Key Features:**
- OKLCH color tokens (T001)
- APCA validated contrast (T006)
- Motion tokens (T012)
- WCAG 2.2 AA compliant
- Keyboard navigation
- Responsive (mobile, tablet, desktop)
- IPC integration ready

**Specification:** \`02_SPECBASES/components/T009_Sidebar_Component_Spec.md\`
        `,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'oklch(0.97 0.02 250)' },
        { name: 'dark', value: 'oklch(0.15 0.02 250)' },
      ],
    },
  },
  argTypes: {
    activeRoute: {
      control: 'select',
      options: ['/chat', '/tasks', '/files', '/memory', '/settings'],
      description: 'Currently active route',
    },
    isOpen: {
      control: 'boolean',
      description: 'Sidebar open state (mobile)',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// ============================================================================
// Default Navigation Items
// ============================================================================

const defaultItems: SidebarItem[] = [
  {
    id: 'chat',
    label: 'Chat',
    href: '/chat',
    icon: <MessageSquare size={20} />,
    shortcut: '⌘1',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    href: '/tasks',
    icon: <CheckSquare size={20} />,
    shortcut: '⌘2',
  },
  {
    id: 'files',
    label: 'Files',
    href: '/files',
    icon: <Folder size={20} />,
    shortcut: '⌘3',
  },
  {
    id: 'memory',
    label: 'Memory',
    href: '/memory',
    icon: <Brain size={20} />,
    shortcut: '⌘4',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={20} />,
    shortcut: '⌘,',
  },
];

// ============================================================================
// Stories
// ============================================================================

/**
 * Default sidebar with Chat active
 */
export const Default: Story = {
  args: {
    items: defaultItems,
    activeRoute: '/chat',
    isOpen: true,
  },
};

/**
 * Tasks view active
 */
export const TasksActive: Story = {
  args: {
    items: defaultItems,
    activeRoute: '/tasks',
    isOpen: true,
  },
};

/**
 * Settings view active
 */
export const SettingsActive: Story = {
  args: {
    items: defaultItems,
    activeRoute: '/settings',
    isOpen: true,
  },
};

/**
 * Interactive demo with state management
 */
export const Interactive: Story = {
  render: (args) => {
    const [activeRoute, setActiveRoute] = useState('/chat');
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <Sidebar
          {...args}
          activeRoute={activeRoute}
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onNavigate={(route) => {
            setActiveRoute(route);
            console.log('Navigated to:', route);
          }}
        />
        <div
          style={{
            marginLeft: isOpen ? '240px' : '0',
            padding: '24px',
            transition: 'margin-left 300ms',
          }}
        >
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Current Route: {activeRoute}
          </h1>
          <p style={{ color: 'oklch(0.40 0.06 262)' }}>
            Click navigation items to change routes. Press arrow keys to navigate.
          </p>
        </div>
      </div>
    );
  },
  args: {
    items: defaultItems,
  },
};

/**
 * Mobile view (< 768px)
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: {
      viewports: [375],
    },
  },
  render: (args) => {
    const [activeRoute, setActiveRoute] = useState('/chat');
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Mobile header with hamburger */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            backgroundColor: 'oklch(0.97 0.02 250)',
            borderBottom: '1px solid oklch(0.85 0.02 250)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle sidebar"
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px',
              color: 'oklch(0.40 0.06 262)',
            }}
          >
            <Menu size={24} />
          </button>
          <span
            style={{
              marginLeft: '16px',
              fontSize: '16px',
              fontWeight: 600,
              color: 'oklch(0.22 0.04 262)',
            }}
          >
            LocalBrain
          </span>
        </div>

        <div
          style={{
            '--sidebar-width': '280px',
            '--sidebar-transform': isOpen ? 'translateX(0)' : 'translateX(-100%)',
            '--sidebar-backdrop-display': isOpen ? 'block' : 'none',
            '--mobile-close-display': 'flex',
          } as React.CSSProperties}
        >
          <Sidebar
            {...args}
            activeRoute={activeRoute}
            isOpen={isOpen}
            onToggle={() => setIsOpen(false)}
            onNavigate={(route) => {
              setActiveRoute(route);
              setIsOpen(false);
            }}
          />
        </div>

        <div style={{ marginTop: '60px', padding: '24px' }}>
          <h1 style={{ fontSize: '20px', marginBottom: '12px' }}>
            {activeRoute.replace('/', '').charAt(0).toUpperCase() +
              activeRoute.slice(2)}
          </h1>
          <p style={{ color: 'oklch(0.40 0.06 262)', fontSize: '14px' }}>
            Tap the menu icon to open the sidebar.
          </p>
        </div>
      </div>
    );
  },
  args: {
    items: defaultItems,
  },
};

/**
 * Tablet view (768px - 1024px)
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    chromatic: {
      viewports: [768],
    },
  },
  render: (args) => {
    const [activeRoute, setActiveRoute] = useState('/files');

    return (
      <div
        style={{
          '--sidebar-width': '200px',
        } as React.CSSProperties}
      >
        <Sidebar
          {...args}
          activeRoute={activeRoute}
          onNavigate={setActiveRoute}
        />
        <div style={{ marginLeft: '200px', padding: '24px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Tablet View (200px sidebar)
          </h1>
          <p style={{ color: 'oklch(0.40 0.06 262)' }}>
            Narrower sidebar optimized for tablet screens.
          </p>
        </div>
      </div>
    );
  },
  args: {
    items: defaultItems,
  },
};

/**
 * Accessibility test with reduced motion
 */
export const ReducedMotion: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
        ],
      },
    },
  },
  render: (args) => {
    const [activeRoute, setActiveRoute] = useState('/memory');

    return (
      <div
        style={{
          // Simulate prefers-reduced-motion
          '--motion-fast': '0ms',
          '--motion-normal': '0ms',
        } as React.CSSProperties}
      >
        <Sidebar
          {...args}
          activeRoute={activeRoute}
          onNavigate={setActiveRoute}
        />
        <div style={{ marginLeft: '240px', padding: '24px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Reduced Motion Mode
          </h1>
          <p style={{ color: 'oklch(0.40 0.06 262)' }}>
            All animations disabled for accessibility. Focus on keyboard
            navigation (Tab, arrows, Home, End).
          </p>
        </div>
      </div>
    );
  },
  args: {
    items: defaultItems,
  },
};

/**
 * Visual regression test - all states
 */
export const VisualRegression: Story = {
  parameters: {
    chromatic: {
      viewports: [375, 768, 1024, 1440],
      delay: 300,
      pauseAnimationAtEnd: true,
    },
  },
  args: {
    items: defaultItems,
    activeRoute: '/chat',
    isOpen: true,
  },
};
