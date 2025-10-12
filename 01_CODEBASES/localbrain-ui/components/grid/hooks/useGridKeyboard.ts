/**
 * useGridKeyboard - T004 Keyboard Navigation Hook
 * Agent A (UI Velocity Specialist)
 *
 * React hook that provides keyboard navigation functionality
 * for grid components with full accessibility support
 */

import { useState, useCallback } from 'react';
import type { GridItem, GridPosition } from '../types';

interface UseGridKeyboardOptions {
  items: GridItem[];
  onItemMove?: (itemId: string, newPosition: GridPosition) => void;
  onItemResize?: (itemId: string, newSize: { width: number; height: number }) => void;
  onItemActivate?: (itemId: string) => void;
  enabled?: boolean;
}

interface UseGridKeyboardReturn {
  focusedItemId: string | null;
  mode: 'navigate' | 'move' | 'resize';
  setFocusedItem: (itemId: string | null) => void;
  setMode: (mode: 'navigate' | 'move' | 'resize') => void;
  handleKeyDown: (event: React.KeyboardEvent, itemId: string) => void;
  handleItemFocus: (itemId: string) => void;
  getAriaProps: (itemId: string) => {
    'aria-label'?: string;
    'aria-describedby'?: string;
    'tabIndex': number;
    'role': string;
  };
  announceToScreenReader: (message: string) => void;
}

export const useGridKeyboard = ({
  items,
  onItemMove,
  onItemResize,
  onItemActivate,
  enabled = true
}: UseGridKeyboardOptions): UseGridKeyboardReturn => {
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [mode, setMode] = useState<'navigate' | 'move' | 'resize'>('navigate');

  // Get current focused item
  const focusedItem = items.find(item => item.id === focusedItemId);

  // Handle keyboard events for individual grid items
  const handleKeyDown = useCallback((event: React.KeyboardEvent, itemId: string) => {
    if (!enabled) return;

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    // Set this item as focused
    setFocusedItemId(itemId);

    // Handle the key event
    const action = getKeyboardAction(event, mode, item);
    if (!action) return;

    event.preventDefault();
    event.stopPropagation();

    executeAction(action, item);
  }, [enabled, items, mode]);

  // Handle item focus
  const handleItemFocus = useCallback((itemId: string) => {
    if (enabled) {
      setFocusedItemId(itemId);
    }
  }, [enabled]);

  // Determine keyboard action
  const getKeyboardAction = (
    event: React.KeyboardEvent,
    currentMode: string,
    currentItem: GridItem
  ) => {
    const key = event.key;
    const shiftKey = event.shiftKey;

    switch (key) {
      case 'Enter':
      case ' ':
        return { type: 'activate' };

      case 'm':
        if (currentMode === 'navigate') {
          return { type: 'move', payload: { action: 'toggle-mode' } };
        }
        break;

      case 'r':
        if (currentMode === 'navigate') {
          return { type: 'resize', payload: { action: 'toggle-mode' } };
        }
        break;

      case 'Escape':
        return { type: 'escape' };

      // Movement in move mode
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        if (currentMode !== 'navigate') {
          return {
            type: 'move',
            payload: { direction: key.replace('Arrow', '').toLowerCase() }
          };
        }
        // In navigate mode, let default tab behavior handle focus changes
        break;

      // Resize controls
      case '+':
      case '=':
        if (currentMode === 'resize') {
          return { type: 'resize', payload: { action: 'increase' } };
        }
        break;

      case '-':
      case '_':
        if (currentMode === 'resize') {
          return { type: 'resize', payload: { action: 'decrease' } };
        }
        break;

      default:
        return null;
    }

    return null;
  };

  // Execute keyboard actions
  const executeAction = (action: any, currentItem: GridItem) => {
    switch (action.type) {
      case 'activate':
        if (onItemActivate) {
          onItemActivate(currentItem.id);
          announceToScreenReader(`Activated item ${currentItem.id}`);
        }
        break;

      case 'move':
        if (action.payload?.action === 'toggle-mode') {
          setMode('move');
          announceToScreenReader('Move mode activated. Use arrow keys to move the item.');
        } else if (onItemMove && action.payload?.direction) {
          const newPosition = calculateNewPosition(currentItem.position, action.payload);
          onItemMove(currentItem.id, newPosition);
          announceToScreenReader(`Moved item to position (${newPosition.x}, ${newPosition.y})`);
        }
        break;

      case 'resize':
        if (action.payload?.action === 'toggle-mode') {
          setMode('resize');
          announceToScreenReader('Resize mode activated. Use + and - keys to resize.');
        } else if (onItemResize) {
          const newSize = calculateNewSize(currentItem.position, action.payload);
          onItemResize(currentItem.id, newSize);
          announceToScreenReader(`Resized item to ${newSize.width}×${newSize.height}`);
        }
        break;

      case 'escape':
        setMode('navigate');
        setFocusedItemId(null);
        announceToScreenReader('Returned to navigation mode');
        break;
    }
  };

  // Calculate new position for keyboard movement
  const calculateNewPosition = (currentPos: GridPosition, payload: any): GridPosition => {
    const direction = payload.direction;
    const distance = 1;
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

  // Calculate new size for keyboard resize
  const calculateNewSize = (currentPos: GridPosition, payload: any): GridPosition => {
    const action = payload.action;
    const newPos = { ...currentPos };
    const step = 1;

    switch (action) {
      case 'increase':
        newPos.width = Math.min(12 - newPos.x, newPos.width + step);
        newPos.height = newPos.height + step;
        break;

      case 'decrease':
        newPos.width = Math.max(1, newPos.width - step);
        newPos.height = Math.max(1, newPos.height - step);
        break;
    }

    return newPos;
  };

  // Get ARIA attributes for grid items
  const getAriaProps = useCallback((itemId: string) => {
    const item = items.find(i => i.id === itemId);
    const isFocused = focusedItemId === itemId;

    return {
      'aria-label': item ? `Grid item ${item.id}, size ${item.position.width} by ${item.position.height}` : undefined,
      'aria-describedby': isFocused ? 'grid-instructions' : undefined,
      'tabIndex': isFocused && enabled ? 0 : -1,
      'role': 'gridcell'
    };
  }, [items, focusedItemId, enabled]);

  // Announce messages to screen readers
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  return {
    focusedItemId,
    mode,
    setFocusedItem: setFocusedItemId,
    setMode,
    handleKeyDown,
    handleItemFocus,
    getAriaProps,
    announceToScreenReader
  };
};

export default useGridKeyboard;