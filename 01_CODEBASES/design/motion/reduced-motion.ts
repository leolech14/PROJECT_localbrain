/**
 * Reduced Motion Utility
 *
 * Provides utilities for respecting user's prefers-reduced-motion preference
 * WCAG 2.2 AA compliant - reduces vestibular motion for accessibility
 */

export type MotionStrategy = 'instant' | 'fade-only' | 'slower';

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user has enabled reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Listen for changes to reduced motion preference
 * @param {function} callback - Called when preference changes
 * @returns {function} Cleanup function to remove listener
 */
export function onReducedMotionChange(callback: (prefersReduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (event: MediaQueryListEvent) => callback(event.matches);

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }

  // Legacy browsers
  mediaQuery.addListener(handler);
  return () => mediaQuery.removeListener(handler);
}

/**
 * Get duration with reduced motion consideration
 * @param {number} normalDuration - Duration in ms for normal motion
 * @param {MotionStrategy} strategy - How to handle reduced motion
 * @returns {number} Duration in ms
 */
export function getMotionDuration(
  normalDuration: number,
  strategy: MotionStrategy = 'instant'
): number {
  if (!prefersReducedMotion()) return normalDuration;

  switch (strategy) {
    case 'instant':
      return 0;
    case 'fade-only':
      return 150; // Short duration for opacity-only transitions
    case 'slower':
      return normalDuration * 1.5; // Some users prefer slower, not instant
    default:
      return 0;
  }
}

/**
 * CSS class utility for reduced motion
 * @returns {string} CSS class name to apply
 */
export function getReducedMotionClass(): string {
  return prefersReducedMotion() ? 'motion-reduced' : 'motion-normal';
}

/**
 * Create CSS variables for motion tokens with reduced motion support
 * @param {Object} motionTokens - Motion token configuration
 * @returns {Object} CSS variable object
 */
export function getMotionCSSVars(motionTokens: {
  duration: number;
  easing: string;
  reducedDuration?: number;
}): Record<string, string> {
  const isReduced = prefersReducedMotion();

  return {
    '--motion-duration': `${isReduced ? (motionTokens.reducedDuration ?? 0) : motionTokens.duration}ms`,
    '--motion-easing': isReduced ? 'linear' : motionTokens.easing,
  };
}

/**
 * React Hook for reduced motion (if using React)
 * @returns {boolean} Current reduced motion preference
 */
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  const [isReduced, setIsReduced] = React.useState(prefersReducedMotion());

  React.useEffect(() => {
    return onReducedMotionChange(setIsReduced);
  }, []);

  return isReduced;
}

// Import React types if available
declare const React: any;

/**
 * Example usage in CSS-in-JS
 */
export const motionExamples = {
  // Instant for reduced motion, normal otherwise
  button: {
    transition: prefersReducedMotion()
      ? 'none'
      : 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
  },

  // Fade-only for reduced motion
  modal: {
    transition: prefersReducedMotion()
      ? 'opacity 150ms linear'
      : 'opacity 300ms cubic-bezier(0, 0, 0.2, 1), transform 300ms cubic-bezier(0, 0, 0.2, 1)',
  },

  // Slower for reduced motion (alternative strategy)
  page: {
    transition: prefersReducedMotion()
      ? 'all 1050ms linear' // 1.5x slower
      : 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
