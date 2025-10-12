/**
 * GridKeyboard - T004 Keyboard Navigation
 * Agent A (UI Velocity Specialist)
 *
 * Complete keyboard navigation system for grid items:
 * - Tab navigation between items
 * - Arrow key movement
 * - Enter/Space for actions
 * - Focus management
 * - ARIA live regions
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { GridItem, GridPosition } from '../types';

interface GridKeyboardProps {
  items: GridItem[];
  focusedItemId: string | null;
  onFocusedItemChange: (itemId: string | null) => void;
  onItemMove?: (itemId: string, newPosition: GridPosition) => void;
  onItemResize?: (itemId: string, newSize: { width: number; height: number }) => void;
  onItemActivate?: (itemId: string) => void;
  enabled?: boolean;
}

interface KeyboardAction {
  type: 'move' | 'resize' | 'activate' | 'focus-next' | 'focus-prev' | 'escape';
  payload?: any;
}

export const GridKeyboard: React.FC<GridKeyboardProps> = ({
  items,
  focusedItemId,
  onFocusedItemChange,
  onItemMove,
  onItemResize,
  onItemActivate,
  enabled = true
}) => {
  const [mode, setMode] = useState<'navigate' | 'move' | 'resize'>('navigate');
  const gridRef = useRef<HTMLDivElement>(null);

  // Get current focused item
  const focusedItem = useMemo(() => {
    return items.find(item => item.id === focusedItemId);
  }, [items, focusedItemId]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !focusedItem) return;

    const action = getKeyboardAction(event, mode);
    if (!action) return;

    event.preventDefault();
    event.stopPropagation();

    executeAction(action, focusedItem, items);
  }, [enabled, focusedItem, mode, items]);

  // Determine keyboard action based on key and mode
  const getKeyboardAction = (event: KeyboardEvent, currentMode: string): KeyboardAction | null => {
    switch (event.key) {
      // Navigation keys (always available)
      case 'Tab':
        return currentMode === 'navigate'
          ? { type: event.shiftKey ? 'focus-prev' : 'focus-next' }
          : null;

      case 'Escape':
        return { type: 'escape' };

      // Mode-specific keys
      case 'Enter':
      case ' ':
        return { type: 'activate' };

      // Arrow keys for movement
      case 'ArrowUp':
        return currentMode === 'navigate'
          ? { type: 'focus-prev' }
          : { type: 'move', payload: { direction: 'up', distance: 1 } };

      case 'ArrowDown':
        return currentMode === 'navigate'
          ? { type: 'focus-next' }
          : { type: 'move', payload: { direction: 'down', distance: 1 } };

      case 'ArrowLeft':
        return currentMode === 'navigate'
          ? { type: 'focus-prev' }
          : { type: 'move', payload: { direction: 'left', distance: 1 } };

      case 'ArrowRight':
        return currentMode === 'navigate'
          ? { type: 'focus-next' }
          : { type: 'move', payload: { direction: 'right', distance: 1 } };

      // Resize keys (in resize mode)
      case 'r':
        if (currentMode === 'navigate') {
          return { type: 'resize', payload: { action: 'toggle-mode' } };
        }
        return null;

      case '+':
      case '=':
        return currentMode === 'resize'
          ? { type: 'resize', payload: { action: 'increase', dimension: 'both' } }
          : null;

      case '-':
      case '_':
        return currentMode === 'resize'
          ? { type: 'resize', payload: { action: 'decrease', dimension: 'both' } }
          : null;

      // Movement mode toggle
      case 'm':
        if (currentMode === 'navigate') {
          return { type: 'move', payload: { action: 'toggle-mode' } };
        }
        return null;

      default:
        return null;
    }
  };

  // Execute the determined action
  const executeAction = (action: KeyboardAction, currentItem: GridItem, allItems: GridItem[]) => {
    switch (action.type) {
      case 'focus-next':
        focusNextItem(allItems, currentItem.id);
        break;

      case 'focus-prev':
        focusPreviousItem(allItems, currentItem.id);
        break;

      case 'activate':
        if (onItemActivate) {
          onItemActivate(currentItem.id);
        }
        break;

      case 'move':
        if (onItemMove && action.payload?.direction) {
          const newPosition = calculateNewPosition(currentItem.position, action.payload);
          onItemMove(currentItem.id, newPosition);
        }
        break;

      case 'resize':
        if (onItemResize && action.payload?.action !== 'toggle-mode') {
          const newSize = calculateNewSize(currentItem.position, action.payload);
          onItemResize(currentItem.id, newSize);
        } else if (action.payload?.action === 'toggle-mode') {
          setMode('resize');
        }
        break;

      case 'escape':
        setMode('navigate');
        onFocusedItemChange(null);
        break;

      default:
        // Handle mode toggles
        if (action.payload?.action === 'toggle-mode') {
          setMode(action.type as 'move' | 'resize');
        }
        break;
    }
  };

  // Focus management helpers
  const focusNextItem = (allItems: GridItem[], currentId: string) => {
    const currentIndex = allItems.findIndex(item => item.id === currentId);
    const nextIndex = (currentIndex + 1) % allItems.length;
    onFocusedItemChange(allItems[nextIndex]?.id || null);
  };

  const focusPreviousItem = (allItems: GridItem[], currentId: string) => {
    const currentIndex = allItems.findIndex(item => item.id === currentId);
    const prevIndex = currentIndex <= 0 ? allItems.length - 1 : currentIndex - 1;
    onFocusedItemChange(allItems[prevIndex]?.id || null);
  };

  // Position calculation for keyboard movement
  const calculateNewPosition = (currentPos: GridPosition, payload: any): GridPosition => {
    const { direction, distance = 1 } = payload;
    const newPos = { ...currentPos };

    switch (direction) {
      case 'up':
        newPos.y = Math.max(0, newPos.y - distance);
        break;
      case 'down':
        newPos.y = newPos.y + distance;
        break;
      case 'left':
        newPos.x = Math.max(0, newPos.x - distance);
        break;
      case 'right':
        newPos.x = newPos.x + distance;
        break;
    }

    return newPos;
  };

  // Size calculation for keyboard resize
  const calculateNewSize = (currentPos: GridPosition, payload: any): GridPosition => {
    const { action, dimension = 'both' } = payload;
    const newPos = { ...currentPos };
    const step = 1;

    switch (action) {
      case 'increase':
        if (dimension === 'width' || dimension === 'both') {
          newPos.width = Math.min(12 - newPos.x, newPos.width + step);
        }
        if (dimension === 'height' || dimension === 'both') {
          newPos.height = newPos.height + step;
        }
        break;

      case 'decrease':
        if (dimension === 'width' || dimension === 'both') {
          newPos.width = Math.max(1, newPos.width - step);
        }
        if (dimension === 'height' || dimension === 'both') {
          newPos.height = Math.max(1, newPos.height - step);
        }
        break;
    }

    return newPos;
  };

  // Set up keyboard event listeners
  useEffect(() => {
    const element = gridRef.current;
    if (!element || !enabled) return;

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  // Announce mode changes to screen readers
  useEffect(() => {
    if (!enabled) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';

    const modeMessages = {
      navigate: 'Navigation mode. Use arrow keys to move between items, Enter or Space to activate.',
      move: 'Move mode. Use arrow keys to move the focused item.',
      resize: 'Resize mode. Use + and - keys to resize the focused item.'
    };

    announcement.textContent = modeMessages[mode];
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [mode, enabled]);

  // Render invisible keyboard helper div
  return (
    <div
      ref={gridRef}
      role="application"
      aria-label="Grid layout"
      tabIndex={enabled ? 0 : -1}
      style={{ outline: 'none' }}
    >
      {/* Visual mode indicator for keyboard users */}
      {enabled && focusedItemId && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#2196F3',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontSize: '0.875rem',
            zIndex: 1000,
            fontFamily: 'monospace'
          }}
          role="status"
          aria-live="polite"
        >
          {mode.toUpperCase()} MODE
          {mode !== 'navigate' && ' (Press Escape to exit)'}
        </div>
      )}

      {/* Keyboard shortcuts help */}
      {enabled && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            zIndex: 1000,
            maxWidth: '300px'
          }}
          role="tooltip"
          aria-label="Keyboard shortcuts"
        >
          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Keyboard Shortcuts:</div>
          <div>Tab/Arrows: Navigate</div>
          <div>Enter/Space: Activate</div>
          <div>M: Move mode</div>
          <div>R: Resize mode</div>
          <div>Escape: Exit mode</div>
        </div>
      )}
    </div>
  );
};

export default GridKeyboard;