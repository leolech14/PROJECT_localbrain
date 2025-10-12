/**
 * Grid System Index - T004/T005
 * Agent A (UI Velocity Specialist)
 *
 * Main exports for the 12-col responsive grid system
 * with OKLCH design token integration and APCA contrast validation
 */

// Core components
export { default as GridContainer } from './GridContainer';
export { default as GridContainerWithTokens } from './GridContainerWithTokens';
export { default as GridFlip } from './GridFlip';
export type { GridContainerProps } from './GridContainer';
export type { GridFlipProps } from './GridFlip';

// Types
export type {
  GridPosition,
  GridItem,
  GridContainerProps as IGridContainerProps,
  GridItemProps,
  ResizeHandle,
  GridKeyboardState,
  FlipAnimation,
  CollisionResult,
  GridBreakpoint,
  GridConfig,
  DragState,
  ResizeState,
  GridEventHandlers,
  GridLayoutResult,
} from './types';

// Utilities
export {
  debounce,
  throttle,
  createLayoutDebouncer,
  createAnimationThrottler,
} from './utils/debounce';

export {
  positionsOverlap,
  checkCollision,
  findValidPosition,
  getOccupiedCells,
  getAllOccupiedCells,
  findFirstAvailablePosition,
  validatePosition,
  compactLayout,
  getGridStats,
} from './utils/collisionDetection';

// Constants
export {
  DEFAULT_GRID_CONFIG,
  DEFAULT_DEBOUNCE_MS,
  MIN_ITEM_SIZE,
  MAX_ITEM_SIZE,
} from './types';

// Hooks
export { useGridFlip } from './GridFlip';
export type { FlipItem } from './GridFlip';

// Token integration utilities
export {
  tokens,
  gridColorSchemes,
  createGridStyles,
  createGridItemVariant,
  validateContrast,
  applyTheme,
  designSystemMetadata,
} from './utils/tokenIntegration';

export type { GridTheme } from './utils/tokenIntegration';

// Demo
export { default as GridDemo } from './examples/GridDemo';
export { default as GridTokenDemo } from './examples/GridTokenDemo';