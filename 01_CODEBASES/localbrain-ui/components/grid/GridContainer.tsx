/**
 * GridContainer - T004
 * Agent A (UI Velocity Specialist)
 *
 * Main 12-col responsive grid container with collision detection
 * and FLIP animation support
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import type { GridContainerProps, GridItem as GridItemType } from './types';
import { createLayoutDebouncer } from './utils/debounce';
import { checkCollision, findValidPosition, validatePosition } from './utils/collisionDetection';
import { DEFAULT_DEBOUNCE_MS, DEFAULT_GRID_CONFIG } from './types';
import { useGridKeyboard } from './hooks/useGridKeyboard';

// Enhanced GridItem component with keyboard navigation support
const GridItemComponent: React.FC<{
  item: GridItemType;
  isDragging?: boolean;
  isFocused?: boolean;
  onMove?: (itemId: string, newPosition: GridItemType['position']) => void;
  onKeyDown?: (event: React.KeyboardEvent, itemId: string) => void;
  onFocus?: (itemId: string) => void;
  getAriaProps?: (itemId: string) => any;
}> = ({
  item,
  isDragging = false,
  isFocused = false,
  onMove,
  onKeyDown,
  onFocus,
  getAriaProps
}) => {
  const [isResizing, setIsResizing] = useState(false);

  const style = useMemo(() => ({
    gridColumn: `${item.position.x + 1} / span ${item.position.width}`,
    gridRow: `${item.position.y + 1} / span ${item.position.height}`,
    border: isFocused ? '2px solid #2196F3' : '1px solid #ccc',
    borderRadius: '4px',
    padding: '1rem',
    backgroundColor: isDragging ? '#e3f2fd' : (isFocused ? '#f3f8ff' : '#f5f5f5'),
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'all 0.2s ease',
    opacity: isDragging ? 0.8 : 1,
    userSelect: 'none' as const,
    outline: isFocused ? '2px solid #2196F3' : 'none',
    outlineOffset: '2px'
  }), [item.position, isDragging, isFocused]);

  const ariaProps = getAriaProps ? getAriaProps(item.id) : {};

  return (
    <div
      style={style}
      data-grid-item-id={item.id}
      draggable={item.isDraggable}
      {...ariaProps}
      onKeyDown={(e) => onKeyDown?.(e, item.id)}
      onFocus={() => onFocus?.(item.id)}
      tabIndex={ariaProps.tabIndex}
    >
      <h4 style={{ margin: '0 0 0.5rem 0' }}>
        Grid Item {item.id}
        {isFocused && <span style={{ color: '#2196F3', marginLeft: '0.5rem' }}>● FOCUSED</span>}
      </h4>
      <div style={{ fontSize: '0.875rem', color: '#666' }}>
        Position: ({item.position.x}, {item.position.y})<br />
        Size: {item.position.width}×{item.position.height}
      </div>
      {item.content}

      {/* Keyboard instructions for focused item */}
      {isFocused && (
        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          color: '#2196F3',
          backgroundColor: '#f3f8ff',
          padding: '0.25rem',
          borderRadius: '2px'
        }}>
          Keyboard: M=Move, R=Resize, Enter=Activate, Esc=Exit
        </div>
      )}
    </div>
  );
};

export const GridContainer: React.FC<GridContainerProps> = ({
  items,
  onItemMove,
  onItemResize,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  className,
  children,
}) => {
  const [gridItems, setGridItems] = useState<GridItemType[]>(items);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation hook
  const {
    focusedItemId,
    mode,
    setFocusedItem,
    handleKeyDown,
    handleItemFocus,
    getAriaProps,
    announceToScreenReader
  } = useGridKeyboard({
    items: gridItems,
    onItemMove: handleItemMove,
    onItemResize: handleItemResize,
    onItemActivate: (itemId) => {
      // Focus and activate the item
      announceToScreenReader(`Activated grid item ${itemId}`);
    },
    enabled: true
  });

  // Update local state when props change
  React.useEffect(() => {
    setGridItems(items);
  }, [items]);

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

    // Calculate grid position (simplified for now)
    const gridWidth = rect.width / 12; // 12 columns
    const gridHeight = 60; // Approximate row height in pixels

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

  // Grid container style
  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '1rem',
    minHeight: '400px',
    padding: '1rem',
    border: '2px dashed #ddd',
    borderRadius: '8px',
    backgroundColor: isDragging ? '#fafafa' : '#fff',
    transition: 'background-color 0.2s ease',
  }), [isDragging]);

  return (
    <div className={className} style={{ width: '100%' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>12-Column Responsive Grid System</h3>
        <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.875rem' }}>
          T004 - Grid System Foundation • Agent A (UI Velocity Specialist)
        </p>
        <p style={{ margin: '0.25rem 0 0 0', color: '#2196F3', fontSize: '0.75rem', fontWeight: 'bold' }}>
          🎹 KEYBOARD NAVIGATION ENABLED • Focus: {focusedItemId || 'None'} • Mode: {mode.toUpperCase()}
        </p>
      </div>

      {/* Keyboard navigation instructions */}
      <div
        id="grid-instructions"
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          backgroundColor: '#f3f8ff',
          border: '1px solid #2196F3',
          borderRadius: '4px',
          fontSize: '0.75rem'
        }}
        role="region"
        aria-label="Grid navigation instructions"
      >
        <strong>Keyboard Controls:</strong> Tab to navigate items • M=Move mode • R=Resize mode •
        Enter/Space=Activate • Arrow keys=Move/Resize • Escape=Exit mode
      </div>

      <div
        ref={gridRef}
        style={gridStyle}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        role="grid"
        aria-label="Drag and drop grid layout"
        aria-rowcount={Math.max(...gridItems.map(item => item.position.y + item.position.height))}
        aria-colcount={12}
      >
        {gridItems.map((item) => (
          <GridItemComponent
            key={item.id}
            item={item}
            isDragging={isDragging && draggedItemId === item.id}
            isFocused={focusedItemId === item.id}
            onMove={handleItemMove}
            onKeyDown={handleKeyDown}
            onFocus={handleItemFocus}
            getAriaProps={getAriaProps}
          />
        ))}
      </div>

      {children}

      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
        <strong>Debug Info:</strong>
        <br />• Total Items: {gridItems.length}
        <br />• Dragging: {isDragging ? draggedItemId : 'None'}
        <br />• Focused: {focusedItemId || 'None'}
        <br />• Keyboard Mode: {mode.toUpperCase()}
        <br />• Grid Columns: 12
        <br />• Debounce: {debounceMs}ms
        <br />• ARIA Support: ✅ Enabled
      </div>
    </div>
  );
};

export default GridContainer;