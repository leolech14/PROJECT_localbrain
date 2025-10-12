import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  Search,
  Bell,
  User,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

/**
 * # Top Navigation Bar Component
 *
 * Global navigation bar providing search, notifications, and profile access for LocalBrain.
 *
 * ## Design System Integration
 * - **Colors**: OKLCH tokens from T001
 * - **Motion**: Animation tokens from T012
 * - **Spacing**: Consistent token usage
 * - **Accessibility**: WCAG 2.2 AA compliant (APCA validated - T006)
 *
 * ## Key Features
 * - Global search with keyboard shortcuts (/, Cmd+K)
 * - Notification badge with pulse animation
 * - Responsive behavior (desktop, tablet, mobile)
 * - Breadcrumb navigation (desktop/tablet only)
 * - Focus management and ARIA support
 * - IPC integration ready for Swift ↔ Electron
 *
 * ## Specification
 * See `02_SPECBASES/components/T011_TopNav_Component_Spec.md` for complete details.
 */

// ============================================================================
// Types
// ============================================================================

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface User {
  name: string;
  email: string;
  avatar?: string;
  status?: 'active' | 'away' | 'busy';
}

interface TopNavProps {
  breadcrumbs?: BreadcrumbItem[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (query: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
  user?: User;
  onProfileClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

// ============================================================================
// TopNav Component (Prototype)
// ============================================================================

const TopNav: React.FC<TopNavProps> = ({
  breadcrumbs = [],
  searchPlaceholder = 'Search conversations, files, memory...',
  searchValue: initialSearchValue = '',
  onSearch,
  notificationCount = 0,
  onNotificationClick,
  user,
  onProfileClick,
  className = '',
  ariaLabel = 'Global navigation',
}) => {
  const [searchValue, setSearchValue] = React.useState(initialSearchValue);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Global search shortcut
  React.useEffect(() => {
    const handleGlobalSearch = (e: KeyboardEvent) => {
      const isInputFocused = document.activeElement?.tagName === 'INPUT';
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && !isInputFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
        if (window.innerWidth < 768) {
          setIsMobileSearchOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalSearch);
    return () => document.removeEventListener('keydown', handleGlobalSearch);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue);
    }
  };

  const handleSearchClear = () => {
    setSearchValue('');
    searchInputRef.current?.focus();
  };

  return (
    <>
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'oklch(0.97 0.02 250)',
            zIndex: 1000,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'oklch(0.40 0.06 262)',
                }}
              />
              <input
                ref={searchInputRef}
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '8px 16px 8px 48px',
                  background: 'oklch(1.00 0.00 0)',
                  border: '1px solid oklch(0.50 0.12 230)',
                  borderRadius: '8px',
                  color: 'oklch(0.22 0.04 262)',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
            </div>
          </form>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            aria-label="Close search"
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px',
              color: 'oklch(0.40 0.06 262)',
            }}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Top Nav Bar */}
      <header
        className={`topnav ${className}`}
        role="banner"
        aria-label={ariaLabel}
        style={{
          width: '100%',
          height: 'var(--topnav-height, 64px)',
          position: 'fixed',
          top: 0,
          left: 'var(--topnav-left, 240px)',
          right: 0,
          zIndex: 100,
          backgroundColor: 'oklch(0.97 0.02 250)',
          borderBottom: '1px solid oklch(0.85 0.02 250)',
        }}
      >
        <div
          className="topnav-content"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            padding: '0 24px',
            gap: '24px',
          }}
        >
          {/* Left: Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div
              className="topnav-left"
              style={{
                display: 'var(--breadcrumbs-display, flex)',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: 'oklch(0.40 0.06 262)',
                minWidth: 0,
              }}
            >
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <ChevronRight
                      size={16}
                      style={{ flexShrink: 0, opacity: 0.5 }}
                    />
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        color: 'oklch(0.40 0.06 262)',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'oklch(0.50 0.12 230)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'oklch(0.40 0.06 262)';
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      style={{
                        color: 'oklch(0.22 0.04 262)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Center: Search */}
          <div
            className="topnav-center"
            role="search"
            style={{
              flex: '0 1 var(--search-width, 400px)',
              display: 'var(--search-display, block)',
            }}
          >
            <form onSubmit={handleSearchSubmit}>
              <div style={{ position: 'relative' }}>
                <Search
                  className="search-icon"
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'oklch(0.40 0.06 262)',
                    transition: 'color 200ms cubic-bezier(0, 0, 0.2, 1)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  ref={searchInputRef}
                  type="search"
                  className="search-input"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label="Search LocalBrain"
                  aria-describedby="search-hint"
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '8px 16px 8px 48px',
                    background: 'oklch(0.94 0.02 250)',
                    border: '1px solid oklch(0.85 0.02 250)',
                    borderRadius: '8px',
                    color: 'oklch(0.22 0.04 262)',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '20px',
                    transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = 'oklch(1.00 0.00 0)';
                    e.currentTarget.style.borderColor = 'oklch(0.50 0.12 230)';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px oklch(0.50 0.12 230 / 0.1)';
                    const icon = e.currentTarget.parentElement?.querySelector('.search-icon') as HTMLElement;
                    if (icon) icon.style.color = 'oklch(0.50 0.12 230)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'oklch(0.94 0.02 250)';
                    e.currentTarget.style.borderColor = 'oklch(0.85 0.02 250)';
                    e.currentTarget.style.boxShadow = 'none';
                    const icon = e.currentTarget.parentElement?.querySelector('.search-icon') as HTMLElement;
                    if (icon) icon.style.color = 'oklch(0.40 0.06 262)';
                  }}
                  onMouseEnter={(e) => {
                    if (document.activeElement !== e.currentTarget) {
                      e.currentTarget.style.borderColor = 'oklch(0.70 0.02 250)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (document.activeElement !== e.currentTarget) {
                      e.currentTarget.style.borderColor = 'oklch(0.85 0.02 250)';
                    }
                  }}
                />
                <span id="search-hint" style={{ position: 'absolute', left: '-10000px' }}>
                  Press / or Cmd+K to focus search
                </span>
              </div>
            </form>
          </div>

          {/* Right: Actions */}
          <div
            className="topnav-right"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {/* Mobile search toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Open search"
              style={{
                width: '40px',
                height: '40px',
                display: 'var(--mobile-search-toggle-display, none)',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: 'oklch(0.40 0.06 262)',
                cursor: 'pointer',
                transition: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'oklch(0.50 0.12 230 / 0.1)';
                e.currentTarget.style.color = 'oklch(0.50 0.12 230)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'oklch(0.40 0.06 262)';
              }}
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button
              onClick={onNotificationClick}
              aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ''}`}
              className="action-button"
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: 'oklch(0.40 0.06 262)',
                cursor: 'pointer',
                transition: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'oklch(0.50 0.12 230 / 0.1)';
                e.currentTarget.style.color = 'oklch(0.50 0.12 230)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'oklch(0.40 0.06 262)';
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid oklch(0.50 0.12 230)';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span
                  className="notification-badge"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '8px',
                    height: '8px',
                    background: 'oklch(0.55 0.20 25)',
                    border: '2px solid oklch(0.97 0.02 250)',
                    borderRadius: '50%',
                    animation: 'badge-pulse 2000ms ease-in-out infinite',
                  }}
                />
              )}
            </button>

            {/* Profile */}
            {user && (
              <button
                onClick={onProfileClick}
                aria-label={`Profile: ${user.name}`}
                className="action-button"
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'oklch(0.22 0.04 262)',
                  cursor: 'pointer',
                  transition: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'oklch(0.50 0.12 230 / 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid oklch(0.50 0.12 230)';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'oklch(0.50 0.12 230 / 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'oklch(0.50 0.12 230)',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'var(--profile-name-display, inline)',
                  }}
                >
                  {user.name}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ARIA live region */}
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

      {/* Animation keyframes */}
      <style>{`
        @keyframes badge-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .notification-badge {
            animation: none !important;
          }
          .search-input,
          .action-button {
            transition-duration: 0ms !important;
          }
        }
      `}</style>
    </>
  );
};

// ============================================================================
// Storybook Meta
// ============================================================================

const meta: Meta<typeof TopNav> = {
  title: 'Components/TopNav',
  component: TopNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Global navigation bar providing search, notifications, and profile access.

**Key Features:**
- OKLCH color tokens (T001)
- APCA validated contrast (T006)
- Motion tokens (T012)
- WCAG 2.2 AA compliant
- Global search shortcuts (/, Cmd+K)
- Responsive (mobile, tablet, desktop)
- IPC integration ready

**Specification:** \`02_SPECBASES/components/T011_TopNav_Component_Spec.md\`
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
    notificationCount: {
      control: { type: 'number', min: 0, max: 99 },
      description: 'Number of unread notifications',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TopNav>;

// ============================================================================
// Stories
// ============================================================================

const defaultUser = {
  name: 'Lech',
  email: 'lech@example.com',
  status: 'active' as const,
};

/**
 * Default top nav with search and actions
 */
export const Default: Story = {
  args: {
    breadcrumbs: [
      { label: 'Chat', href: '/chat' },
      { label: 'Conversation #123' },
    ],
    notificationCount: 0,
    user: defaultUser,
  },
};

/**
 * With notifications badge
 */
export const WithNotifications: Story = {
  args: {
    breadcrumbs: [
      { label: 'Tasks', href: '/tasks' },
      { label: 'Project Planning' },
    ],
    notificationCount: 5,
    user: defaultUser,
  },
};

/**
 * Interactive demo with working search
 */
export const Interactive: Story = {
  render: (args) => {
    const [searchResults, setSearchResults] = useState<string[]>([]);

    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <TopNav
          {...args}
          onSearch={(query) => {
            console.log('Search:', query);
            setSearchResults([`Result 1 for "${query}"`, `Result 2 for "${query}"`]);
          }}
          onNotificationClick={() => console.log('Notifications clicked')}
          onProfileClick={() => console.log('Profile clicked')}
        />
        <div
          style={{
            marginTop: '64px',
            marginLeft: '240px',
            padding: '24px',
          }}
        >
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Interactive Top Nav Demo
          </h1>
          <p style={{ color: 'oklch(0.40 0.06 262)', marginBottom: '16px' }}>
            Press <kbd>/</kbd> or <kbd>Cmd+K</kbd> to focus search. Type a query
            and press Enter.
          </p>
          {searchResults.length > 0 && (
            <div>
              <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>
                Search Results:
              </h2>
              <ul>
                {searchResults.map((result, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  },
  args: {
    breadcrumbs: [{ label: 'Search', href: '/search' }],
    notificationCount: 3,
    user: defaultUser,
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
  render: (args) => (
    <div
      style={{
        '--topnav-height': '60px',
        '--topnav-left': '0',
        '--breadcrumbs-display': 'none',
        '--search-display': 'none',
        '--mobile-search-toggle-display': 'flex',
        '--profile-name-display': 'none',
      } as React.CSSProperties}
    >
      <TopNav {...args} />
      <div style={{ marginTop: '60px', padding: '16px' }}>
        <h1 style={{ fontSize: '20px', marginBottom: '12px' }}>Mobile View</h1>
        <p style={{ color: 'oklch(0.40 0.06 262)', fontSize: '14px' }}>
          Tap search icon or press / to open search overlay.
        </p>
      </div>
    </div>
  ),
  args: {
    notificationCount: 2,
    user: defaultUser,
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
  render: (args) => (
    <div
      style={{
        '--topnav-left': '200px',
        '--search-width': '300px',
      } as React.CSSProperties}
    >
      <TopNav {...args} />
      <div
        style={{
          marginTop: '64px',
          marginLeft: '200px',
          padding: '24px',
        }}
      >
        <h1 style={{ fontSize: '22px', marginBottom: '12px' }}>Tablet View</h1>
        <p style={{ color: 'oklch(0.40 0.06 262)' }}>
          Narrower search input (300px) optimized for tablet screens.
        </p>
      </div>
    </div>
  ),
  args: {
    breadcrumbs: [
      { label: 'Files', href: '/files' },
      { label: 'Documents', href: '/files/documents' },
      { label: 'Project Notes' },
    ],
    notificationCount: 1,
    user: defaultUser,
  },
};

/**
 * Accessibility test with focus states
 */
export const Accessibility: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },
  },
  render: (args) => (
    <div
      style={{
        '--motion-fast': '0ms',
        '--motion-instant': '0ms',
      } as React.CSSProperties}
    >
      <TopNav {...args} />
      <div
        style={{
          marginTop: '64px',
          marginLeft: '240px',
          padding: '24px',
        }}
      >
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
          Accessibility Test
        </h1>
        <p style={{ color: 'oklch(0.40 0.06 262)', marginBottom: '12px' }}>
          Test keyboard navigation:
        </p>
        <ul
          style={{
            color: 'oklch(0.40 0.06 262)',
            paddingLeft: '20px',
            lineHeight: '1.6',
          }}
        >
          <li>
            Press <kbd>/</kbd> or <kbd>Cmd+K</kbd> to focus search
          </li>
          <li>
            Press <kbd>Tab</kbd> to navigate through action buttons
          </li>
          <li>
            Press <kbd>Enter</kbd> or <kbd>Space</kbd> to activate buttons
          </li>
          <li>All focus indicators should be visible (2px solid outline)</li>
          <li>Reduced motion: All animations disabled</li>
        </ul>
      </div>
    </div>
  ),
  args: {
    breadcrumbs: [{ label: 'Accessibility', href: '/accessibility' }],
    notificationCount: 7,
    user: defaultUser,
  },
};

/**
 * Visual regression test - all viewports
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
    breadcrumbs: [
      { label: 'Memory', href: '/memory' },
      { label: 'Knowledge Base' },
    ],
    notificationCount: 12,
    user: defaultUser,
  },
};
