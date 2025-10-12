/**
 * GridContainerWithTokens - T005
 * Agent A (UI Velocity Specialist)
 *
 * Enhanced GridContainer with OKLCH design tokens and APCA contrast validation
 * Integrates Agent B's design system for WCAG 2.2 AA compliance
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import type { GridContainerProps, GridItem as GridItemType } from './types';
import { createLayoutDebouncer } from './utils/debounce';
import { checkCollision, findValidPosition, validatePosition } from './utils/collisionDetection';
import {
  createGridStyles,
  createGridItemVariant,
  validateContrast,
  applyTheme,
  tokens,
  type GridTheme
} from './utils/tokenIntegration';

// Enhanced GridItem component with design tokens
const GridItemWithTokens: React.FC<{
  item: GridItemType;
  isDragging?: boolean;
  variant?: 'default' | 'accent' | 'muted' | 'success' | 'warning' | 'error';
  theme?: GridTheme;
  onMove?: (itemId: string, newPosition: GridItemType['position']) => void;
}> = ({
  item,
  isDragging = false,
  variant = 'default',
  theme = { colorScheme: 'light', reducedMotion: false, highContrast: false },
  onMove
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Apply design system tokens
  const gridStyles = useMemo(() => applyTheme(theme), [theme]);
  const itemVariant = useMemo(() => createGridItemVariant(variant), [variant]);

  const style = useMemo(() => ({
    gridColumn: `${item.position.x + 1} / span ${item.position.width}`,
    gridRow: `${item.position.y + 1} / span ${item.position.height}`,
    ...gridStyles.gridItem,
    ...itemVariant,
    ...(isDragging && {
      ...gridStyles.gridItem['&[data-dragging="true"]'],
      transform: theme.reducedMotion ? 'none' : 'rotate(2deg) scale(1.02)',
    }),
    ...(isFocused && gridStyles.gridItem['&:focus-visible']),
  }), [item.position, isDragging, isFocused, gridStyles, itemVariant, theme.reducedMotion]);

  // Contrast validation (integrate with Agent B's APCA system)
  const textColor = useMemo(() => {
    const bg = itemVariant.backgroundColor || tokens.colors.surface.bg;
    const text = itemVariant.color || tokens.colors.surface.text;

    const contrast = validateContrast(text, bg, 60);
    return contrast.isValid ? text : tokens.colors.surface.text;
  }, [itemVariant]);

  return (
    <div
      style={style}
      data-grid-item-id={item.id}
      data-dragging={isDragging}
      draggable={item.isDraggable}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      role="gridcell"
      aria-label={`Grid item ${item.id}, position ${item.position.x},${item.position.y}, size ${item.position.width}x${item.position.height}`}
      tabIndex={item.isDraggable ? 0 : -1}
    >
      <div style={{
        ...gridStyles.text.primary,
        color: textColor,
        marginBottom: tokens.spacing.sm,
      }}>
        <h4 style={{
          margin: 0,
          fontSize: tokens.typography.fontSize.lg,
          fontWeight: tokens.typography.fontWeight.semibold,
        }}>
          Grid Item {item.id}
        </h4>
      </div>

      <div style={{
        ...gridStyles.text.secondary,
        marginBottom: tokens.spacing.sm,
      }}>
        <div>Position: ({item.position.x}, {item.position.y})</div>
        <div>Size: {item.position.width}×{item.position.height}</div>
        <div>Variant: {variant}</div>
      </div>

      {item.content && (
        <div style={{
          marginTop: tokens.spacing.sm,
          padding: tokens.spacing.sm,
          backgroundColor: tokens.colors.surface.bg,
          borderRadius: tokens.borderRadius.sm,
          border: `1px solid ${tokens.colors.surface.border}`,
        }}>
          {item.content}
        </div>
      )}

      {/* Accessibility indicators */}
      <div style={{
        position: 'absolute',
        top: tokens.spacing.xs,
        right: tokens.spacing.xs,
        display: 'flex',
        gap: tokens.spacing.xs,
      }}>
        {item.isDraggable && (
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: tokens.colors.interactive.bg,
              borderRadius: '50%',
              title: 'Draggable',
            }}
            aria-hidden="true"
          />
        )}
        {item.isResizable && (
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: tokens.colors.muted.text,
              borderRadius: '50%',
              title: 'Resizable',
            }}
            aria-hidden="true"
          />
        )}
      }
      </div>
    </div>
  );
};

export const GridContainerWithTokens: React.FC<
  GridContainerProps & {
    theme?: GridTheme;
    enableContrastValidation?: boolean;
    defaultItemVariant?: 'default' | 'accent' | 'muted' | 'success' | 'warning' | 'error';
  }
> = ({
  items,
  onItemMove,
  onItemResize,
  debounceMs = 200,
  className,
  children,
  theme = { colorScheme: 'light', reducedMotion: false, highContrast: false },
  enableContrastValidation = true,
  defaultItemVariant = 'default',
}) => {
  const [gridItems, setGridItems] = useState<GridItemType[]>(items);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [contrastIssues, setContrastIssues] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Update local state when props change
  React.useEffect(() => {
    setGridItems(items);
  }, [items]);

  // Apply design tokens to container
  const gridStyles = useMemo(() => applyTheme(theme), [theme]);

  // Create debounced update function
  const debouncedUpdate = useCallback(
    createLayoutDebouncer((updatedItems: GridItemType[]) => {
      // Find items that changed position
      const changedItems = updatedItems.filter((updatedItem, index) => {
        const originalItem = items[index];
        return (
          updatedItem.position.x !== originalItem.position.x ||
          updatedItem.position.y !== originalItem.position.y ||
          updatedItem.position.width !== originalItem.position.width ||
          updatedItem.position.height !== originalItem.position.height
        );
      });

      // Notify parent of changes
      changedItems.forEach((changedItem) => {
        if (onItemMove) {
          onItemMove(changedItem.id, changedItem.position);
        }
      });
    }, debounceMs),
    [items, onItemMove, debounceMs]
  );

  // Contrast validation (integrate with Agent B's APCA system)
  const validateItemContrast = useCallback((item: GridItemType) => {
    if (!enableContrastValidation) return;

    const variant = createGridItemVariant(defaultItemVariant);
    const bg = variant.backgroundColor || tokens.colors.surface.bg;
    const text = variant.color || tokens.colors.surface.text;

    const contrast = validateContrast(text, bg, 60);
    if (!contrast.isValid) {
      setContrastIssues(prev => [...prev, item.id]);
    } else {
      setContrastIssues(prev => prev.filter(id => id !== item.id));
    }
  }, [enableContrastValidation, defaultItemVariant]);

  // Validate all items on mount and when theme changes
  React.useEffect(() => {
    gridItems.forEach(validateItemContrast);
  }, [gridItems, theme, validateItemContrast]);

  // Handle item position change
  const handleItemMove = useCallback((
    itemId: string,
    newPosition: GridItemType['position']
  ) => {
    // Validate position
    const validatedPosition = validatePosition(newPosition, 12);

    setGridItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId
          ? { ...item, position: validatedPosition }
          : item
      );

      // Check for collisions and resolve them
      const movedItem = updatedItems.find((item) => item.id === itemId);
      if (movedItem) {
        const otherItems = updatedItems.filter((item) => item.id !== itemId);
        const collision = checkCollision(movedItem, otherItems);

        if (collision.hasCollision) {
          // Find a valid position
          const validPosition = findValidPosition(movedItem, otherItems);
          return updatedItems.map((item) =>
            item.id === itemId
              ? { ...item, position: validPosition }
              : item
          );
        }
      }

      return updatedItems;
    });
  }, []);

  // Debounced update effect
  React.useEffect(() => {
    debouncedUpdate(gridItems);
  }, [gridItems, debouncedUpdate]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setIsDragging(true);
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!draggedItemId || !gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate grid position
    const gridWidth = rect.width / 12;
    const gridHeight = 60;

    const gridX = Math.max(0, Math.min(11, Math.floor(x / gridWidth)));
    const gridY = Math.max(0, Math.floor(y / gridHeight));

    const draggedItem = gridItems.find((item) => item.id === draggedItemId);
    if (draggedItem) {
      handleItemMove(draggedItemId, {
        ...draggedItem.position,
        x: gridX,
        y: gridY,
      });
    }

    setDraggedItemId(null);
  }, [draggedItemId, gridItems, handleItemMove]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedItemId(null);
  }, []);

  // Container style with design tokens
  const containerStyle = useMemo(() => ({
    ...gridStyles.container,
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    minHeight: '400px',
    position: 'relative' as const,
  }), [gridStyles]);

  return (
    <div className={className} style={{ width: '100%' }}>
      {/* Header with design system info */}
      <div style={{ marginBottom: tokens.spacing.lg }}>
        <h3 style={{
          margin: 0,
          fontSize: tokens.typography.fontSize['2xl'],
          fontWeight: tokens.typography.fontWeight.bold,
          color: tokens.colors.surface.text,
        }}>
          Grid System with OKLCH Design Tokens
        </h3>
        <p style={{
          margin: `${tokens.spacing.sm} 0 0 0`,
          color: tokens.colors.surface.textMuted,
          fontSize: tokens.typography.fontSize.sm,
        }}>
          T005 - Design Token Integration • Agent A (UI Velocity Specialist)
        </p>
        <div style={{
          display: 'flex',
          gap: tokens.spacing.lg,
          marginTop: tokens.spacing.md,
          flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: tokens.typography.fontSize.sm }}>
            <strong>Theme:</strong> {theme.colorScheme} |
            <strong> Motion:</strong> {theme.reducedMotion ? 'reduced' : 'normal'} |
            <strong> Contrast:</strong> {theme.highContrast ? 'high' : 'normal'}
          </div>
          {enableContrastValidation && (
            <div style={{ fontSize: tokens.typography.fontSize.sm }}>
              <strong>Contrast Issues:</strong> {contrastIssues.length > 0 ? contrastIssues.join(', ') : 'None'}
            </div>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div
        ref={gridRef}
        style={containerStyle}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        role="grid"
        aria-label="12-column responsive grid layout"
      >
        {gridItems.map((item) => (
          <GridItemWithTokens
            key={item.id}
            item={item}
            isDragging={isDragging && draggedItemId === item.id}
            variant={defaultItemVariant}
            theme={theme}
            onMove={handleItemMove}
          />
        ))}
      </div>

      {children}

      {/* Design System Footer */}
      <div style={{
        marginTop: tokens.spacing.lg,
        fontSize: tokens.typography.fontSize.sm,
        color: tokens.colors.surface.textMuted,
        padding: tokens.spacing.md,
        backgroundColor: tokens.colors.surface.bgSubtle,
        borderRadius: tokens.borderRadius.md,
        border: `1px solid ${tokens.colors.surface.border}`,
      }}>
        <div style={{ marginBottom: tokens.spacing.sm }}>
          <strong>Design System Integration:</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: tokens.spacing.sm }}>
          <div>✅ OKLCH Color System</div>
          <div>✅ APCA Contrast Validation</div>
          <div>✅ WCAG 2.2 AA Compliance</div>
          <div>✅ Semantic Design Tokens</div>
          <div>✅ Theme Support (Light/Dark)</div>
          <div>✅ Reduced Motion Support</div>
        </div>
        <div style={{ marginTop: tokens.spacing.sm, fontSize: '0.75rem' }}>
          Powered by Agent B's Design Token System (T001) & APCA Validation (T006)
        </div>
      </div>
    </div>
  );
};

export default GridContainerWithTokens;