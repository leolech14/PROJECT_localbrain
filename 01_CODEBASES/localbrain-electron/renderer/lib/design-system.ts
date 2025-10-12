// LocalBrain Design System
// Based on Universal UI Specification Guide (WCAG 2.2 AA compliant)

// ===== SPACING SYSTEM =====
// 4px/8px grid system using rem units for scalability
export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem",  // 8px
  md: "1rem",    // 16px
  lg: "1.5rem",  // 24px
  xl: "2rem",    // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
} as const;

// ===== TYPOGRAPHY SYSTEM =====
// Relative font sizes with clear hierarchy
export const fontSize = {
  xs: "0.75rem",   // 12px
  sm: "0.875rem",  // 14px
  base: "1rem",    // 16px
  lg: "1.125rem",  // 18px
  xl: "1.25rem",   // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem",  // 36px
} as const;

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeight = {
  tight: "1.25",
  normal: "1.5",
  relaxed: "1.75",
} as const;

// ===== TOUCH TARGETS =====
// WCAG minimum 44px for touch interaction
export const touchTarget = {
  min: "44px",
  comfortable: "48px",
} as const;

// ===== BORDER RADIUS =====
export const borderRadius = {
  none: "0",
  sm: "0.25rem",  // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem",   // 8px
  xl: "0.75rem",  // 12px
  full: "9999px",
} as const;

// ===== Z-INDEX SCALE =====
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ===== ANIMATION TIMING =====
export const duration = {
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
} as const;

export const easing = {
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
} as const;

// ===== BREAKPOINTS =====
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ===== FOCUS STYLES =====
// WCAG requirement: 3:1 contrast minimum
export const focusRing = {
  width: "2px",
  offset: "2px",
  color: "var(--acc)",
  style: "solid",
} as const;

// Helper function to generate focus style
export function getFocusStyle() {
  return {
    outline: `${focusRing.width} ${focusRing.style} ${focusRing.color}`,
    outlineOffset: focusRing.offset,
  };
}

// ===== ACCESSIBILITY HELPERS =====
export const aria = {
  // Screen reader only text
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: "0",
  } as const,
};

// ===== CONTAINER CONSTRAINTS =====
export const container = {
  maxWidth: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
    full: "100%",
  },
  padding: {
    mobile: spacing.md,
    desktop: spacing.lg,
  },
} as const;
