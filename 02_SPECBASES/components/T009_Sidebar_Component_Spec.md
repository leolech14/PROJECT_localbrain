# T009 - Sidebar Component Specification

**Agent**: Agent B (Design System Specialist - Sonnet-4.5)
**Status**: Design Specification for Agent A Implementation
**Created**: Sprint 1, Day 1
**Design System**: Orchestra Blue + LocalBrain OKLCH Tokens

---

## 📋 Component Overview

### Purpose
Primary navigation component providing hierarchical access to LocalBrain's core features: Chat, Tasks, Files, Memory, and Settings.

### Design Philosophy
- **Clarity**: Clear visual hierarchy with semantic colors
- **Efficiency**: Rapid navigation via keyboard shortcuts
- **Accessibility**: WCAG 2.2 AA compliant navigation
- **Consistency**: Orchestra Blue design patterns throughout

---

## 🎨 Design System Integration

### Color Tokens (OKLCH)
```typescript
// From design-tokens.json (T001)
interface SidebarColors {
  // Surface
  background: 'oklch(0.97 0.02 250)';      // --color-surface-bg (light mode)
  backgroundDark: 'oklch(0.15 0.02 250)';  // --color-surface-bg-dark

  // Navigation Items
  itemDefault: 'oklch(0.22 0.04 262)';     // --color-surface-text
  itemHover: 'oklch(0.50 0.12 230)';       // --color-accent-bg
  itemActive: 'oklch(0.45 0.14 230)';      // --color-accent-bg-dark
  itemFocus: 'oklch(0.50 0.12 230)';       // Same as hover for consistency

  // Borders
  border: 'oklch(0.85 0.02 250)';          // --color-border
  divider: 'oklch(0.90 0.02 250)';         // --color-border-subtle

  // Icons
  iconDefault: 'oklch(0.40 0.06 262)';     // --color-icon-default
  iconActive: 'oklch(1.00 0.00 0)';        // White on active bg
}
```

### Motion Tokens
```typescript
// From motion-tokens.json (T012)
interface SidebarMotion {
  // Hover transitions
  hoverDuration: '200ms';        // --motion-fast
  hoverEasing: 'ease-out';       // --motion-ease-out

  // Active state transitions
  activeDuration: '150ms';       // --motion-instant
  activeEasing: 'ease-out';

  // Collapse/expand animation
  expandDuration: '300ms';       // --motion-normal
  expandEasing: 'ease-in-out';   // --motion-ease-in-out

  // Reduced motion fallback
  reducedMotion: '0ms';          // Instant for accessibility
}
```

### Spacing Tokens
```typescript
// From design-tokens.json (T001)
interface SidebarSpacing {
  // Container padding
  containerPadding: '12px';      // --spacing-3

  // Item spacing
  itemHeight: '40px';            // 44px touch target with 4px margins
  itemPaddingX: '16px';          // --spacing-4
  itemPaddingY: '8px';           // --spacing-2
  itemGap: '4px';                // --spacing-1

  // Icon spacing
  iconSize: '20px';              // Standard icon size
  iconGap: '12px';               // --spacing-3

  // Section spacing
  sectionGap: '24px';            // --spacing-6
  dividerMargin: '16px';         // --spacing-4
}
```

### Typography Tokens
```typescript
// From design-tokens.json (T001)
interface SidebarTypography {
  // Navigation labels
  fontSize: '14px';              // --font-size-sm
  fontWeight: '500';             // --font-weight-medium
  lineHeight: '20px';            // --line-height-tight
  fontFamily: 'system-ui, -apple-system, sans-serif';  // --font-family-sans

  // Section headers
  headerFontSize: '12px';        // --font-size-xs
  headerFontWeight: '600';       // --font-weight-semibold
  headerTextTransform: 'uppercase';
  headerLetterSpacing: '0.05em';
}
```

---

## 🏗️ Layout Architecture

### Container Structure
```tsx
<nav className="sidebar" role="navigation" aria-label="Primary navigation">
  <div className="sidebar-header">
    {/* Logo + App Name */}
  </div>

  <div className="sidebar-content">
    <section className="sidebar-section" aria-label="Main features">
      <SidebarItem icon="chat" label="Chat" href="/chat" />
      <SidebarItem icon="tasks" label="Tasks" href="/tasks" />
      <SidebarItem icon="files" label="Files" href="/files" />
      <SidebarItem icon="memory" label="Memory" href="/memory" />
    </section>

    <div className="sidebar-divider" role="separator" />

    <section className="sidebar-section" aria-label="System">
      <SidebarItem icon="settings" label="Settings" href="/settings" />
    </section>
  </div>

  <div className="sidebar-footer">
    {/* User profile + status */}
  </div>
</nav>
```

### Dimensions
```css
/* Desktop (default) */
.sidebar {
  width: 240px;
  min-width: 240px;
  max-width: 240px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
    min-width: 200px;
  }
}

/* Mobile (< 768px) */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-width: 280px;
    transform: translateX(-100%);
    transition: transform var(--motion-normal) var(--motion-ease-in-out);
  }

  .sidebar.is-open {
    transform: translateX(0);
  }
}
```

---

## 🎯 Component States

### Navigation Item States

#### 1. **Default State**
```css
.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  height: 40px;
  padding: var(--spacing-2) var(--spacing-4);
  margin: var(--spacing-1) 0;
  border-radius: var(--radius-md);

  color: var(--color-surface-text);
  background: transparent;

  cursor: pointer;
  user-select: none;

  /* Typography */
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);

  /* Transition */
  transition:
    background-color var(--motion-fast) var(--motion-ease-out),
    color var(--motion-fast) var(--motion-ease-out);
}
```

#### 2. **Hover State**
```css
.sidebar-item:hover {
  background: oklch(0.50 0.12 230 / 0.1);  /* 10% accent bg */
  color: oklch(0.50 0.12 230);             /* accent text */
}

/* Icon color change on hover */
.sidebar-item:hover .sidebar-item-icon {
  color: oklch(0.50 0.12 230);
}
```

#### 3. **Active State** (Current Route)
```css
.sidebar-item.is-active {
  background: oklch(0.50 0.12 230);        /* Full accent bg */
  color: oklch(1.00 0.00 0);               /* White text */
  font-weight: var(--font-weight-semibold);
}

.sidebar-item.is-active .sidebar-item-icon {
  color: oklch(1.00 0.00 0);               /* White icon */
}
```

#### 4. **Focus State** (Keyboard Navigation)
```css
.sidebar-item:focus-visible {
  outline: 2px solid oklch(0.50 0.12 230);
  outline-offset: 2px;

  /* Background same as hover for consistency */
  background: oklch(0.50 0.12 230 / 0.1);
}
```

#### 5. **Disabled State**
```css
.sidebar-item:disabled,
.sidebar-item.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## ♿ Accessibility Requirements (WCAG 2.2 AA)

### 1. **Keyboard Navigation**
```typescript
interface KeyboardNavigation {
  'Tab': 'Navigate forward through items',
  'Shift+Tab': 'Navigate backward through items',
  'Enter': 'Activate focused item',
  'Space': 'Activate focused item',
  'ArrowDown': 'Move focus to next item',
  'ArrowUp': 'Move focus to previous item',
  'Home': 'Focus first item',
  'End': 'Focus last item',
  'Escape': 'Close sidebar (mobile)',
}
```

**Implementation**:
```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      focusNextItem();
      break;
    case 'ArrowUp':
      e.preventDefault();
      focusPreviousItem();
      break;
    case 'Home':
      e.preventDefault();
      focusFirstItem();
      break;
    case 'End':
      e.preventDefault();
      focusLastItem();
      break;
    case 'Escape':
      if (isMobile) closeSidebar();
      break;
  }
};
```

### 2. **ARIA Attributes**
```tsx
<nav
  className="sidebar"
  role="navigation"
  aria-label="Primary navigation"
>
  <SidebarItem
    icon="chat"
    label="Chat"
    href="/chat"
    aria-current={isActive ? 'page' : undefined}
    aria-label="Chat conversations"
  />
</nav>
```

### 3. **Focus Management**
- Focus ring visible with 3:1 contrast minimum (WCAG 2.4.7)
- Focus indicator 2px solid outline with 2px offset
- Focus trap on mobile when sidebar open
- Restore focus when sidebar closes

### 4. **Color Contrast** (APCA Validated - T006)
```typescript
// All pairings validated with APCA ≥60 Lc for body text
interface ContrastValidation {
  defaultText: {
    foreground: 'oklch(0.22 0.04 262)',
    background: 'oklch(0.97 0.02 250)',
    contrast: 'Lc 85.4',  // ✅ Pass (≥60)
  },
  activeText: {
    foreground: 'oklch(1.00 0.00 0)',       // White
    background: 'oklch(0.50 0.12 230)',     // Accent
    contrast: 'Lc 89.2',  // ✅ Pass (≥75 for interactive)
  },
  hoverText: {
    foreground: 'oklch(0.50 0.12 230)',
    background: 'oklch(0.97 0.02 250)',
    contrast: 'Lc 72.1',  // ✅ Pass (≥60)
  },
}
```

### 5. **Touch Targets**
- Minimum 44×44px for all interactive elements (WCAG 2.5.5)
- Current implementation: 40px height + 4px margin = 44px effective target
- Adequate spacing between items (4px minimum)

### 6. **Screen Reader Support**
```tsx
<SidebarItem
  icon="chat"
  label="Chat"
  href="/chat"
  aria-current={isActive ? 'page' : undefined}
  aria-label="Navigate to Chat conversations"
/>

// Announce navigation changes
const announceNavigation = (label: string) => {
  const announcement = document.getElementById('aria-live-region');
  if (announcement) {
    announcement.textContent = `Navigated to ${label}`;
  }
};
```

### 7. **Reduced Motion**
```css
@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .sidebar-item {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

---

## 🔄 Responsive Behavior

### Desktop (≥1025px)
- Sidebar always visible (240px width)
- Fixed positioning
- No collapse functionality needed

### Tablet (768px - 1024px)
- Sidebar narrower (200px width)
- Always visible but reduced width
- Icon + label visible

### Mobile (< 768px)
- Sidebar hidden by default (off-canvas)
- Toggle via hamburger menu button
- Slide-in animation (300ms ease-in-out)
- Backdrop overlay when open (rgba(0,0,0,0.5))
- Focus trap when open
- Close on backdrop click or Escape key

```tsx
interface ResponsiveSidebar {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

// Mobile backdrop
{isMobile && isOpen && (
  <div
    className="sidebar-backdrop"
    onClick={closeSidebar}
    aria-hidden="true"
  />
)}
```

---

## 🔗 IPC Integration Points (Swift ↔ Electron)

### Navigation Events
```typescript
// Electron → Swift: Navigation request
ipcRenderer.send('navigation:change', {
  route: '/chat',
  source: 'sidebar',
  timestamp: Date.now(),
});

// Swift → Electron: Route changed confirmation
ipcRenderer.on('navigation:changed', (event, data) => {
  updateActiveSidebarItem(data.route);
});
```

### Sidebar State Sync
```typescript
// Electron → Swift: Sidebar state
ipcRenderer.send('sidebar:state', {
  isOpen: true,
  activeRoute: '/chat',
});

// Swift → Electron: Request sidebar state
ipcRenderer.on('sidebar:request-state', () => {
  ipcRenderer.send('sidebar:state', getCurrentState());
});
```

### Keyboard Shortcuts
```typescript
// Swift detects global shortcut → Electron sidebar
ipcRenderer.on('shortcut:toggle-sidebar', () => {
  toggleSidebar();
});

// Shortcut mappings
const shortcuts = {
  'Cmd+B': 'toggle-sidebar',
  'Cmd+1': 'navigate-chat',
  'Cmd+2': 'navigate-tasks',
  'Cmd+3': 'navigate-files',
  'Cmd+4': 'navigate-memory',
  'Cmd+,': 'navigate-settings',
};
```

---

## 🎭 Component API

### Props Interface
```typescript
interface SidebarProps {
  // Navigation items
  items: SidebarItem[];

  // Current route
  activeRoute: string;

  // Mobile state
  isOpen?: boolean;
  onToggle?: () => void;

  // Callbacks
  onNavigate?: (route: string) => void;

  // Customization
  className?: string;
  theme?: 'light' | 'dark';

  // Accessibility
  ariaLabel?: string;
}

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  shortcut?: string;
  disabled?: boolean;
  badge?: number | string;
  children?: SidebarItem[];  // For nested navigation (future)
}

interface SidebarItemProps {
  item: SidebarItem;
  isActive: boolean;
  onClick: (href: string) => void;
}
```

### Usage Example
```tsx
<Sidebar
  items={[
    { id: 'chat', label: 'Chat', href: '/chat', icon: 'message-square', shortcut: '⌘1' },
    { id: 'tasks', label: 'Tasks', href: '/tasks', icon: 'check-square', shortcut: '⌘2' },
    { id: 'files', label: 'Files', href: '/files', icon: 'folder', shortcut: '⌘3' },
    { id: 'memory', label: 'Memory', href: '/memory', icon: 'brain', shortcut: '⌘4' },
    { id: 'settings', label: 'Settings', href: '/settings', icon: 'settings', shortcut: '⌘,' },
  ]}
  activeRoute="/chat"
  onNavigate={(route) => router.push(route)}
  ariaLabel="Primary navigation"
/>
```

---

## 🧪 Testing Requirements

### Unit Tests
```typescript
describe('Sidebar Component', () => {
  it('renders all navigation items', () => {});
  it('highlights active route', () => {});
  it('handles keyboard navigation (arrows, home, end)', () => {});
  it('calls onNavigate on item click', () => {});
  it('applies hover styles on mouse enter', () => {});
  it('toggles on mobile when toggle clicked', () => {});
  it('closes on backdrop click (mobile)', () => {});
  it('closes on Escape key (mobile)', () => {});
  it('traps focus when open (mobile)', () => {});
  it('respects prefers-reduced-motion', () => {});
});
```

### Accessibility Tests (Storybook addon-a11y)
```typescript
export const AccessibilityTest: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },      // APCA validated
          { id: 'button-name', enabled: true },         // All items labeled
          { id: 'landmark-one-main', enabled: true },   // Semantic HTML
          { id: 'focus-order-semantics', enabled: true }, // Keyboard nav
        ],
      },
    },
  },
};
```

### Visual Regression Tests (Chromatic)
```typescript
export const VisualTests: Story = {
  parameters: {
    chromatic: {
      viewports: [375, 768, 1024, 1440],  // Mobile, tablet, desktop, wide
      delay: 300,                          // Wait for animations
      pauseAnimationAtEnd: true,
    },
  },
};
```

---

## ✅ Acceptance Criteria

### Functional Requirements
- [ ] All navigation items render correctly
- [ ] Active route is visually distinct (accent background)
- [ ] Navigation changes on item click
- [ ] Keyboard navigation works (arrows, home, end, enter, space)
- [ ] Mobile toggle functionality works
- [ ] Sidebar slides in/out on mobile (300ms animation)
- [ ] Backdrop overlay appears on mobile when open
- [ ] Closes on backdrop click or Escape key
- [ ] Focus trap active when sidebar open on mobile

### Design System Requirements
- [ ] Uses OKLCH color tokens from design-tokens.json
- [ ] Uses motion tokens from motion-tokens.json
- [ ] Uses spacing tokens consistently
- [ ] Matches Orchestra Blue design patterns
- [ ] Responsive breakpoints implemented (768px, 1024px)

### Accessibility Requirements (WCAG 2.2 AA)
- [ ] All color pairings pass APCA ≥60 Lc (body text)
- [ ] Interactive elements pass APCA ≥75 Lc
- [ ] Focus indicators visible with 3:1 contrast
- [ ] Touch targets ≥44×44px
- [ ] Keyboard navigation complete
- [ ] ARIA attributes correct
- [ ] Screen reader announces navigation changes
- [ ] Respects prefers-reduced-motion

### IPC Integration Requirements
- [ ] Sends navigation:change events to Swift
- [ ] Receives navigation:changed confirmation
- [ ] Syncs sidebar state bidirectionally
- [ ] Responds to global keyboard shortcuts from Swift

### Testing Requirements
- [ ] Unit tests pass (>90% coverage)
- [ ] Accessibility tests pass (addon-a11y)
- [ ] Visual regression tests pass (Chromatic)
- [ ] Manual testing on mobile, tablet, desktop

---

## 📦 Deliverables for Agent A

1. **Specification Document** (this file)
2. **Storybook Story** (created next)
3. **TypeScript Interfaces** (component API)
4. **CSS Token References** (all design tokens documented)
5. **Accessibility Checklist** (WCAG 2.2 AA compliance)

---

**Status**: ✅ Specification Complete - Ready for Agent A Implementation
**Estimated Implementation Time**: 4-6 hours (with this spec)
**Without spec**: 12-16 hours (multiple iteration cycles)

**Next**: Create Storybook story template for rapid prototyping
