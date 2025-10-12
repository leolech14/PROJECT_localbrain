/**
 * Collision Detection Utilities - T004
 * Agent A (UI Velocity Specialist)
 *
 * Handles collision detection and resolution for grid items
 */

import type { GridPosition, GridItem, CollisionResult } from '../types';

/**
 * Checks if two grid positions overlap
 */
export function positionsOverlap(pos1: GridPosition, pos2: GridPosition): boolean {
  return !(
    pos1.x + pos1.width <= pos2.x || // pos1 is left of pos2
    pos2.x + pos2.width <= pos1.x || // pos2 is left of pos1
    pos1.y + pos1.height <= pos2.y || // pos1 is above pos2
    pos2.y + pos2.height <= pos1.y    // pos2 is above pos1
  );
}

/**
 * Checks if a grid item collides with any items in a list
 */
export function checkCollision(
  item: GridItem,
  otherItems: GridItem[],
  excludeId?: string
): CollisionResult {
  const collidingItems: string[] = [];

  for (const other of otherItems) {
    if (other.id === item.id || other.id === excludeId) {
      continue;
    }

    if (positionsOverlap(item.position, other.position)) {
      collidingItems.push(other.id);
    }
  }

  return {
    hasCollision: collidingItems.length > 0,
    collidingItems,
  };
}

/**
 * Finds the nearest valid position for an item that doesn't collide
 */
export function findValidPosition(
  item: GridItem,
  otherItems: GridItem[],
  maxColumns: number = 12,
  maxRows: number = 100
): GridPosition {
  const { position } = item;
  let testPosition = { ...position };

  // Try current position first
  const collision = checkCollision(item, otherItems);
  if (!collision.hasCollision) {
    return testPosition;
  }

  // Try to find a valid position by searching in expanding area
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxColumns; col++) {
      testPosition = {
        x: col,
        y: row,
        width: position.width,
        height: position.height,
      };

      // Make sure item fits within grid bounds
      if (testPosition.x + testPosition.width > maxColumns) {
        continue;
      }

      const testCollision = checkCollision(
        { ...item, position: testPosition },
        otherItems
      );

      if (!testCollision.hasCollision) {
        return testPosition;
      }
    }
  }

  // If no valid position found, return original position
  return position;
}

/**
 * Gets the grid cells occupied by an item
 */
export function getOccupiedCells(position: GridPosition): Set<string> {
  const cells = new Set<string>();

  for (let x = position.x; x < position.x + position.width; x++) {
    for (let y = position.y; y < position.y + position.height; y++) {
      cells.add(`${x},${y}`);
    }
  }

  return cells;
}

/**
 * Gets all occupied cells in a grid layout
 */
export function getAllOccupiedCells(items: GridItem[]): Map<string, string> {
  const occupied = new Map<string, string>();

  for (const item of items) {
    const cells = getOccupiedCells(item.position);
    for (const cell of cells) {
      occupied.set(cell, item.id);
    }
  }

  return occupied;
}

/**
 * Finds a valid position for a new item in a sparse grid
 */
export function findFirstAvailablePosition(
  itemSize: { width: number; height: number },
  occupiedCells: Map<string, string>,
  maxColumns: number = 12,
  maxRows: number = 100
): GridPosition {
  for (let y = 0; y < maxRows; y++) {
    for (let x = 0; x <= maxColumns - itemSize.width; x++) {
      // Check if this position would cause any collisions
      let hasCollision = false;

      for (let dx = 0; dx < itemSize.width; dx++) {
        for (let dy = 0; dy < itemSize.height; dy++) {
          const cellKey = `${x + dx},${y + dy}`;
          if (occupiedCells.has(cellKey)) {
            hasCollision = true;
            break;
          }
        }
        if (hasCollision) break;
      }

      if (!hasCollision) {
        return { x, y, width: itemSize.width, height: itemSize.height };
      }
    }
  }

  // Fallback to position 0,0 if no space found
  return { x: 0, y: 0, width: itemSize.width, height: itemSize.height };
}

/**
 * Validates that a position is within grid bounds
 */
export function validatePosition(
  position: GridPosition,
  maxColumns: number = 12,
  maxRows?: number
): GridPosition {
  const validated = { ...position };

  // Ensure x is non-negative
  validated.x = Math.max(0, validated.x);

  // Ensure width is positive
  validated.width = Math.max(1, validated.width);

  // Ensure item doesn't exceed grid width
  if (validated.x + validated.width > maxColumns) {
    validated.x = Math.max(0, maxColumns - validated.width);
  }

  // Ensure y is non-negative
  validated.y = Math.max(0, validated.y);

  // Ensure height is positive
  validated.height = Math.max(1, validated.height);

  // Check max rows if specified
  if (maxRows !== undefined && validated.y + validated.height > maxRows) {
    validated.y = Math.max(0, maxRows - validated.height);
  }

  return validated;
}

/**
 * Optimizes grid layout by compacting items and removing gaps
 */
export function compactLayout(
  items: GridItem[],
  maxColumns: number = 12
): GridItem[] {
  const sortedItems = [...items].sort((a, b) => {
    // Sort by y, then by x
    if (a.position.y !== b.position.y) {
      return a.position.y - b.position.y;
    }
    return a.position.x - b.position.x;
  });

  const compactedItems: GridItem[] = [];
  const occupiedCells = new Map<string, string>();

  for (const item of sortedItems) {
    const validPosition = findFirstAvailablePosition(
      { width: item.position.width, height: item.position.height },
      occupiedCells,
      maxColumns
    );

    const compactedItem = {
      ...item,
      position: validPosition,
    };

    compactedItems.push(compactedItem);

    // Update occupied cells
    const cells = getOccupiedCells(validPosition);
    for (const cell of cells) {
      occupiedCells.set(cell, item.id);
    }
  }

  return compactedItems;
}

/**
 * Calculates grid statistics
 */
export function getGridStats(items: GridItem[]): {
  totalItems: number;
  totalArea: number;
  utilizedColumns: number;
  utilizedRows: number;
  density: number;
} {
  if (items.length === 0) {
    return {
      totalItems: 0,
      totalArea: 0,
      utilizedColumns: 0,
      utilizedRows: 0,
      density: 0,
    };
  }

  let totalArea = 0;
  let maxX = 0;
  let maxY = 0;

  for (const item of items) {
    totalArea += item.position.width * item.position.height;
    maxX = Math.max(maxX, item.position.x + item.position.width);
    maxY = Math.max(maxY, item.position.y + item.position.height);
  }

  const gridArea = maxX * maxY;
  const density = gridArea > 0 ? totalArea / gridArea : 0;

  return {
    totalItems: items.length,
    totalArea,
    utilizedColumns: maxX,
    utilizedRows: maxY,
    density,
  };
}