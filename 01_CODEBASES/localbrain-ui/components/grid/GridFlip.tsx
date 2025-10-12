/**
 * GridFlip - T004
 * Agent A (UI Velocity Specialist)
 *
 * FLIP (First, Last, Invert, Play) animation system for smooth grid transitions
 */

import React, { useRef, useEffect, useCallback } from 'react';
import type { GridPosition, FlipAnimation } from './types';

export interface FlipItem {
  id: string;
  element: HTMLElement;
  fromPosition: GridPosition;
  toPosition: GridPosition;
}

export interface GridFlipProps {
  children: React.ReactNode;
  onAnimationComplete?: (itemId: string) => void;
  duration?: number;
  easing?: string;
  enabled?: boolean;
}

/**
 * Manages FLIP animations for grid items
 */
export class FlipManager {
  private animationDuration: number;
  private easing: string;
  private activeAnimations: Map<string, Animation> = new Map();
  private onAnimationComplete?: (itemId: string) => void;

  constructor(
    duration: number = 200,
    easing: string = 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    onAnimationComplete?: (itemId: string) => void
  ) {
    this.animationDuration = duration;
    this.easing = easing;
    this.onAnimationComplete = onAnimationComplete;
  }

  /**
   * Captures the current positions of grid items
   */
  capturePositions(items: HTMLElement[]): Map<string, DOMRect> {
    const positions = new Map<string, DOMRect>();

    items.forEach((element) => {
      const itemId = element.getAttribute('data-grid-item-id');
      if (itemId) {
        positions.set(itemId, element.getBoundingClientRect());
      }
    });

    return positions;
  }

  /**
   * Creates a FLIP animation for an item
   */
  createFlipAnimation(
    element: HTMLElement,
    itemId: string,
    fromRect: DOMRect,
    toRect: DOMRect
  ): Animation | null {
    // Calculate the delta transform
    const deltaX = fromRect.left - toRect.left;
    const deltaY = fromRect.top - toRect.top;

    // If no change in position, no animation needed
    if (Math.abs(deltaX) < 0.1 && Math.abs(deltaY) < 0.1) {
      return null;
    }

    // Create the keyframes for FLIP animation
    const keyframes: Keyframe[] = [
      {
        transform: `translate(${deltaX}px, ${deltaY}px)`,
      },
      {
        transform: 'translate(0, 0)',
      },
    ];

    // Create the animation
    const animation = element.animate(keyframes, {
      duration: this.animationDuration,
      easing: this.easing,
      fill: 'forwards',
    });

    // Store active animation
    this.activeAnimations.set(itemId, animation);

    // Clean up when animation completes
    animation.addEventListener('finish', () => {
      this.activeAnimations.delete(itemId);
      this.onAnimationComplete?.(itemId);
    });

    return animation;
  }

  /**
   * Animates multiple items from old positions to new positions
   */
  animateItems(
    oldPositions: Map<string, DOMRect>,
    newElements: HTMLElement[]
  ): void {
    // Cancel any existing animations
    this.cancelAllAnimations();

    const animations: Animation[] = [];

    newElements.forEach((element) => {
      const itemId = element.getAttribute('data-grid-item-id');
      if (!itemId) return;

      const oldPosition = oldPositions.get(itemId);
      const newPosition = element.getBoundingClientRect();

      if (oldPosition) {
        const animation = this.createFlipAnimation(element, itemId, oldPosition, newPosition);
        if (animation) {
          animations.push(animation);
        }
      }
    });

    // Return promise that resolves when all animations complete
    return Promise.all(animations.map(anim =>
      new Promise(resolve => anim.addEventListener('finish', resolve))
    ));
  }

  /**
   * Cancels all active animations
   */
  cancelAllAnimations(): void {
    this.activeAnimations.forEach((animation) => {
      animation.cancel();
    });
    this.activeAnimations.clear();
  }

  /**
   * Gets the number of currently active animations
   */
  getActiveAnimationCount(): number {
    return this.activeAnimations.size;
  }

  /**
   * Checks if any animations are currently active
   */
  hasActiveAnimations(): boolean {
    return this.activeAnimations.size > 0;
  }
}

/**
 * React hook for managing FLIP animations
 */
export function useGridFlip(
  duration: number = 200,
  easing: string = 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  onAnimationComplete?: (itemId: string) => void
) {
  const flipManagerRef = useRef<FlipManager | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  // Initialize flip manager
  useEffect(() => {
    flipManagerRef.current = new FlipManager(duration, easing, onAnimationComplete);

    return () => {
      flipManagerRef.current?.cancelAllAnimations();
    };
  }, [duration, easing, onAnimationComplete]);

  // Start FLIP animation
  const startFlipAnimation = useCallback(async () => {
    const container = containerRef.current;
    const flipManager = flipManagerRef.current;

    if (!container || !flipManager || isAnimatingRef.current) {
      return;
    }

    // Get all grid item elements
    const gridItems = Array.from(
      container.querySelectorAll('[data-grid-item-id]')
    ) as HTMLElement[];

    if (gridItems.length === 0) {
      return;
    }

    isAnimatingRef.current = true;

    // Capture current positions
    const oldPositions = flipManager.capturePositions(gridItems);

    // Wait for next frame to capture new positions after layout change
    await new Promise(resolve => requestAnimationFrame(resolve));

    // Capture new positions and animate
    const newPositions = gridItems.map(item => item.getBoundingClientRect());
    await flipManager.animateItems(oldPositions, gridItems);

    isAnimatingRef.current = false;
  }, []);

  // Cancel animations
  const cancelAnimations = useCallback(() => {
    flipManagerRef.current?.cancelAllAnimations();
    isAnimatingRef.current = false;
  }, []);

  return {
    containerRef,
    startFlipAnimation,
    cancelAnimations,
    isAnimating: isAnimatingRef.current,
    activeAnimationCount: flipManagerRef.current?.getActiveAnimationCount() || 0,
  };
}

/**
 * GridFlip component that provides FLIP animation context
 */
export const GridFlip: React.FC<GridFlipProps> = ({
  children,
  onAnimationComplete,
  duration = 200,
  easing = 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  enabled = true,
}) => {
  const {
    containerRef,
    startFlipAnimation,
    cancelAnimations,
    isAnimating,
    activeAnimationCount,
  } = useGridFlip(duration, easing, onAnimationComplete);

  // Expose animation controls via context (simplified implementation)
  React.useImperativeHandle(containerRef, () => ({
    startFlipAnimation,
    cancelAnimations,
    isAnimating,
    activeAnimationCount,
  }));

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        // Prevent layout thrashing during animations
        willChange: isAnimating ? 'transform' : 'auto',
      }}
    >
      {children}
    </div>
  );
};

export default GridFlip;