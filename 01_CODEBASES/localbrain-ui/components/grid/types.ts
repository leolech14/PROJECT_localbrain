/**
 * Grid System Types - T004
 * Agent A (UI Velocity Specialist)
 *
 * TypeScript definitions for the 12-col responsive grid system
 */

// Grid position and dimensions
export interface GridPosition {
  x: number; // Column position (0-11)
  y: number; // Row position
  width: number; // Width in columns (1-12)
  height: number; // Height in rows
}

// Grid item data structure
export interface GridItem {
  id: string;
  position: GridPosition;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  isResizable?: boolean;
  isDraggable?: boolean;
  content?: React.ReactNode;
}

// Grid container props
export interface GridContainerProps {
  items: GridItem[];
  onItemMove?: (itemId: string, newPosition: GridPosition) => void;
  onItemResize?: (itemId: string, newSize: GridPosition) => void;
  debounceMs?: number;
  className?: string;
  children?: React.ReactNode;
}

// Individual grid item props
export interface GridItemProps {
  item: GridItem;
  isDragging?: boolean;
  isResizing?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  children?: React.ReactNode;
}

// Grid resize handle types
export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

// Grid keyboard navigation
export interface GridKeyboardState {
  focusedItemId: string | null;
  isEditMode: boolean;
  selectedItems: string[];
}

// Grid FLIP animation types
export interface FlipAnimation {
  from: GridPosition;
  to: GridPosition;
  duration: number;
  easing: string;
}

// Grid collision detection
export interface CollisionResult {
  hasCollision: boolean;
  collidingItems: string[];
  suggestedPosition?: GridPosition;
}

// Grid breakpoint configuration
export interface GridBreakpoint {
  name: string;
  minWidth: number;
  columns: number;
  gap: string;
}

// Grid configuration
export interface GridConfig {
  columns: number;
  gap: string;
  breakpoints: GridBreakpoint[];
  defaultItemSize: GridPosition;
  enableAnimations: boolean;
  enableKeyboardNav: boolean;
}

// Grid drag state
export interface DragState {
  isDragging: boolean;
  draggedItemId: string | null;
  startPosition: GridPosition;
  currentPosition: GridPosition;
  dragHandle?: HTMLElement;
}

// Grid resize state
export interface ResizeState {
  isResizing: boolean;
  resizedItemId: string | null;
  resizeHandle: ResizeHandle | null;
  startSize: GridPosition;
  currentSize: GridPosition;
  resizeHandleElement?: HTMLElement;
}

// Grid event handlers
export interface GridEventHandlers {
  onItemMove: (itemId: string, newPosition: GridPosition) => void;
  onItemResize: (itemId: string, newSize: GridPosition) => void;
  onItemClick?: (itemId: string) => void;
  onItemFocus?: (itemId: string) => void;
  onItemBlur?: (itemId: string) => void;
}

// Grid layout algorithm result
export interface GridLayoutResult {
  items: GridItem[];
  totalRows: number;
  totalColumns: number;
  hasCollisions: boolean;
  layout: GridItem[];
}

// Default grid configuration
export const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 12,
  gap: '1rem',
  breakpoints: [
    { name: 'sm', minWidth: 640, columns: 12, gap: '0.75rem' },
    { name: 'md', minWidth: 768, columns: 12, gap: '1rem' },
    { name: 'lg', minWidth: 1024, columns: 12, gap: '1.25rem' },
    { name: 'xl', minWidth: 1280, columns: 12, gap: '1.5rem' },
  ],
  defaultItemSize: { x: 0, y: 0, width: 4, height: 3 },
  enableAnimations: true,
  enableKeyboardNav: true,
};

// Default debounce timing
export const DEFAULT_DEBOUNCE_MS = 200;

// Minimum item size
export const MIN_ITEM_SIZE = { width: 1, height: 1 };

// Maximum item size
export const MAX_ITEM_SIZE = { width: 12, height: 12 };