/**
 * Grid Demo - T004
 * Agent A (UI Velocity Specialist)
 *
 * Demo component showcasing the 12-col grid system with drag/drop
 * collision detection, and FLIP animations
 */

import React, { useState, useCallback, useRef } from 'react';
import GridContainer from '../GridContainer';
import GridFlip from '../GridFlip';
import type { GridItem } from '../types';

const GridDemo: React.FC = () => {
  // Sample grid items for demonstration
  const [gridItems, setGridItems] = useState<GridItem[]>([
    {
      id: 'widget-1',
      position: { x: 0, y: 0, width: 4, height: 3 },
      isDraggable: true,
      isResizable: true,
      content: (
        <div>
          <h5>Dashboard Widget</h5>
          <p>Drag me around!</p>
        </div>
      ),
    },
    {
      id: 'widget-2',
      position: { x: 4, y: 0, width: 3, height: 2 },
      isDraggable: true,
      isResizable: false,
      content: (
        <div>
          <h5>Stats Panel</h5>
          <p>Fixed size</p>
        </div>
      ),
    },
    {
      id: 'widget-3',
      position: { x: 7, y: 0, width: 5, height: 4 },
      isDraggable: true,
      isResizable: true,
      content: (
        <div>
          <h5>Main Content</h5>
          <p>Large widget area</p>
        </div>
      ),
    },
    {
      id: 'widget-4',
      position: { x: 0, y: 3, width: 6, height: 2 },
      isDraggable: true,
      isResizable: true,
      content: (
        <div>
          <h5>Chart Area</h5>
          <p>Wide widget</p>
        </div>
      ),
    },
    {
      id: 'widget-5',
      position: { x: 6, y: 3, width: 3, height: 3 },
      isDraggable: true,
      isResizable: false,
      content: (
        <div>
          <h5>Sidebar</h5>
          <p>Tall widget</p>
        </div>
      ),
    },
    {
      id: 'widget-6',
      position: { x: 9, y: 3, width: 3, height: 2 },
      isDraggable: true,
      isResizable: false,
      content: (
        <div>
          <h5>Info Panel</h5>
          <p>Small widget</p>
        </div>
      ),
    },
  ]);

  const [flipEnabled, setFlipEnabled] = useState(true);
  const [showGridLines, setShowGridLines] = useState(false);
  const gridFlipRef = useRef<any>(null);

  // Handle item position changes
  const handleItemMove = useCallback((itemId: string, newPosition: GridItem['position']) => {
    setGridItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, position: newPosition }
          : item
      )
    );

    // Trigger FLIP animation after layout update
    if (flipEnabled && gridFlipRef.current) {
      setTimeout(() => {
        gridFlipRef.current?.startFlipAnimation();
      }, 0);
    }
  }, [flipEnabled]);

  // Add new widget
  const addWidget = useCallback(() => {
    const newId = `widget-${gridItems.length + 1}`;
    const newWidget: GridItem = {
      id: newId,
      position: { x: 0, y: 0, width: 3, height: 2 },
      isDraggable: true,
      isResizable: true,
      content: (
        <div>
          <h5>New Widget {gridItems.length + 1}</h5>
          <p>Just added!</p>
        </div>
      ),
    };

    setGridItems((prevItems) => [...prevItems, newWidget]);
  }, [gridItems.length]);

  // Remove widget
  const removeWidget = useCallback((itemId: string) => {
    setGridItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  // Reset layout
  const resetLayout = useCallback(() => {
    setGridItems([
      {
        id: 'widget-1',
        position: { x: 0, y: 0, width: 4, height: 3 },
        isDraggable: true,
        isResizable: true,
        content: (
          <div>
            <h5>Dashboard Widget</h5>
            <p>Drag me around!</p>
          </div>
        ),
      },
      {
        id: 'widget-2',
        position: { x: 4, y: 0, width: 3, height: 2 },
        isDraggable: true,
        isResizable: false,
        content: (
          <div>
            <h5>Stats Panel</h5>
            <p>Fixed size</p>
          </div>
        ),
      },
      {
        id: 'widget-3',
        position: { x: 7, y: 0, width: 5, height: 4 },
        isDraggable: true,
        isResizable: true,
        content: (
          <div>
            <h5>Main Content</h5>
            <p>Large widget area</p>
          </div>
        ),
      },
    ]);
  }, []);

  // Grid overlay style
  const gridOverlayStyle = showGridLines ? {
    backgroundImage: `
      repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 59px, rgba(0,0,0,0.1) 60px),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent calc(8.33% - 1px), rgba(0,0,0,0.1) calc(8.33%))
    `,
    backgroundSize: '100% 60px, 100% 100%',
  } : {};

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Grid System Demo</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
          T004 - Grid System Foundation • Agent A (UI Velocity Specialist)
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={addWidget}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          Add Widget
        </button>

        <button
          onClick={resetLayout}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          Reset Layout
        </button>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={flipEnabled}
            onChange={(e) => setFlipEnabled(e.target.checked)}
          />
          FLIP Animations
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={showGridLines}
            onChange={(e) => setShowGridLines(e.target.checked)}
          />
          Show Grid Lines
        </label>

        <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#666' }}>
          Widgets: {gridItems.length}
        </div>
      </div>

      {/* Grid Container with FLIP */}
      <GridFlip
        ref={gridFlipRef}
        enabled={flipEnabled}
        duration={200}
        onAnimationComplete={(itemId) => {
          console.log(`Animation complete for ${itemId}`);
        }}
      >
        <div style={gridOverlayStyle}>
          <GridContainer
            items={gridItems}
            onItemMove={handleItemMove}
            debounceMs={200}
          />
        </div>
      </GridFlip>

      {/* Instructions */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e8f4fd',
        borderRadius: '8px',
        fontSize: '0.875rem',
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Demo Instructions:</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Drag any widget to reposition it on the grid</li>
          <li>Widgets will automatically avoid collisions</li>
          <li>Enable FLIP animations for smooth transitions</li>
          <li>Toggle grid lines to see the 12-column layout</li>
          <li>Add new widgets or reset the layout</li>
        </ul>
      </div>
    </div>
  );
};

export default GridDemo;