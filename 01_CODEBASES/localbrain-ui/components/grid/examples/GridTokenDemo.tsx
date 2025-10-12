/**
 * Grid Token Demo - T005
 * Agent A (UI Velocity Specialist)
 *
 * Comprehensive demo showcasing OKLCH token integration and APCA contrast validation
 * Demonstrates full design system integration with Agent B's tokens
 */

import React, { useState } from 'react';
import GridContainerWithTokens from '../GridContainerWithTokens';
import type { GridItem, GridTheme } from '../types';
import {
  tokens,
  gridColorSchemes,
  designSystemMetadata
} from '../utils/tokenIntegration';

const GridTokenDemo: React.FC = () => {
  // Sample grid items with different variants
  const [gridItems, setGridItems] = useState<GridItem[]>([
    {
      id: 'widget-1',
      position: { x: 0, y: 0, width: 4, height: 3 },
      isDraggable: true,
      isResizable: true,
      content: (
        <div>
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Dashboard Widget</h5>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Default variant with OKLCH tokens</p>
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
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Stats Panel</h5>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Fixed size, draggable</p>
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
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Main Content</h5>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Large widget area</p>
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: tokens.colors.success.bgSubtle,
            borderRadius: tokens.borderRadius.sm,
            border: `1px solid ${tokens.colors.success.border}`,
          }}>
            <div style={{ color: tokens.colors.success.text, fontSize: '0.75rem' }}>
              ✅ APCA Compliant
            </div>
          </div>
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
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Chart Area</h5>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Wide widget with tokens</p>
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
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Sidebar</h5>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Tall widget</p>
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
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Info Panel</h5>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Small widget</p>
        </div>
      ),
    },
  ]);

  const [theme, setTheme] = useState<GridTheme>({
    colorScheme: 'light',
    reducedMotion: false,
    highContrast: false,
  });

  const [itemVariant, setItemVariant] = useState<'default' | 'accent' | 'muted' | 'success' | 'warning' | 'error'>('default');
  const [showGridLines, setShowGridLines] = useState(false);
  const [enableContrastValidation, setEnableContrastValidation] = useState(true);

  // Handle item position changes
  const handleItemMove = (itemId: string, newPosition: GridItem['position']) => {
    setGridItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, position: newPosition }
          : item
      )
    );
  };

  // Add new widget
  const addWidget = () => {
    const newId = `widget-${gridItems.length + 1}`;
    const newWidget: GridItem = {
      id: newId,
      position: { x: 0, y: 0, width: 3, height: 2 },
      isDraggable: true,
      isResizable: true,
      content: (
        <div>
          <h5 style={{ margin: '0 0 0.5rem 0' }}>New Widget {gridItems.length + 1}</h5>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Just added!</p>
        </div>
      ),
    };

    setGridItems((prevItems) => [...prevItems, newWidget]);
  };

  // Grid overlay style with design tokens
  const gridOverlayStyle = showGridLines ? {
    backgroundImage: `
      repeating-linear-gradient(0deg, ${tokens.colors.surface.border} 0px, transparent 1px, transparent 59px, ${tokens.colors.surface.border} 60px),
      repeating-linear-gradient(90deg, ${tokens.colors.surface.border} 0px, transparent 1px, transparent calc(8.33% - 1px), ${tokens.colors.surface.border} calc(8.33%))
    `,
    backgroundSize: '100% 60px, 100% 100%',
  } : {};

  return (
    <div style={{
      padding: tokens.spacing['2xl'],
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.1 0.02 250)' : tokens.colors.surface.bg,
      color: theme.colorScheme === 'dark' ? 'oklch(0.9 0.01 250)' : tokens.colors.surface.text,
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{ marginBottom: tokens.spacing['2xl'] }}>
        <h1 style={{
          margin: 0,
          fontSize: tokens.typography.fontSize['4xl'],
          fontWeight: tokens.typography.fontWeight.bold,
          color: theme.colorScheme === 'dark' ? 'oklch(0.95 0.01 250)' : tokens.colors.surface.text,
        }}>
          Grid System with OKLCH Design Tokens
        </h1>
        <p style={{
          margin: `${tokens.spacing.sm} 0 0 0`,
          color: theme.colorScheme === 'dark' ? 'oklch(0.7 0.01 250)' : tokens.colors.surface.textMuted,
          fontSize: tokens.typography.fontSize.base,
        }}>
          T005 - Design Token Integration • Agent A (UI Velocity Specialist)
        </p>
        <div style={{
          marginTop: tokens.spacing.md,
          padding: tokens.spacing.md,
          backgroundColor: tokens.colors.accent.bgSubtle,
          borderRadius: tokens.borderRadius.md,
          border: `1px solid ${tokens.colors.accent.border}`,
        }}>
          <div style={{ color: tokens.colors.accent.text, fontSize: tokens.typography.fontSize.sm }}>
            <strong>🎨 Design System Integration:</strong> OKLCH Color System • APCA Contrast Validation • WCAG 2.2 AA Compliance
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: tokens.spacing.lg,
        marginBottom: tokens.spacing['2xl'],
        padding: tokens.spacing.lg,
        backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.15 0.02 250)' : tokens.colors.surface.bgSubtle,
        borderRadius: tokens.borderRadius.lg,
        border: `1px solid ${theme.colorScheme === 'dark' ? 'oklch(0.25 0.02 250)' : tokens.colors.surface.border}`,
        flexWrap: 'wrap',
      }}>
        {/* Theme Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          <label style={{ fontWeight: tokens.typography.fontWeight.semibold }}>Theme</label>
          <select
            value={theme.colorScheme}
            onChange={(e) => setTheme(prev => ({ ...prev, colorScheme: e.target.value as 'light' | 'dark' }))}
            style={{
              padding: tokens.spacing.sm,
              border: `1px solid ${tokens.colors.surface.border}`,
              borderRadius: tokens.borderRadius.sm,
              backgroundColor: tokens.colors.surface.bg,
              color: tokens.colors.surface.text,
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        {/* Variant Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          <label style={{ fontWeight: tokens.typography.fontWeight.semibold }}>Item Variant</label>
          <select
            value={itemVariant}
            onChange={(e) => setItemVariant(e.target.value as any)}
            style={{
              padding: tokens.spacing.sm,
              border: `1px solid ${tokens.colors.surface.border}`,
              borderRadius: tokens.borderRadius.sm,
              backgroundColor: tokens.colors.surface.bg,
              color: tokens.colors.surface.text,
            }}
          >
            <option value="default">Default</option>
            <option value="accent">Accent</option>
            <option value="muted">Muted</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        {/* Accessibility Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          <label style={{ fontWeight: tokens.typography.fontWeight.semibold }}>Accessibility</label>
          <div style={{ display: 'flex', gap: tokens.spacing.md }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
              <input
                type="checkbox"
                checked={theme.reducedMotion}
                onChange={(e) => setTheme(prev => ({ ...prev, reducedMotion: e.target.checked }))}
              />
              Reduced Motion
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
              <input
                type="checkbox"
                checked={theme.highContrast}
                onChange={(e) => setTheme(prev => ({ ...prev, highContrast: e.target.checked }))}
              />
              High Contrast
            </label>
          </div>
        </div>

        {/* Display Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          <label style={{ fontWeight: tokens.typography.fontWeight.semibold }}>Display</label>
          <div style={{ display: 'flex', gap: tokens.spacing.md }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
              <input
                type="checkbox"
                checked={showGridLines}
                onChange={(e) => setShowGridLines(e.target.checked)}
              />
              Grid Lines
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
              <input
                type="checkbox"
                checked={enableContrastValidation}
                onChange={(e) => setEnableContrastValidation(e.target.checked)}
              />
              Contrast Validation
            </label>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm, marginLeft: 'auto' }}>
          <button
            onClick={addWidget}
            style={{
              padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
              border: 'none',
              borderRadius: tokens.borderRadius.md,
              backgroundColor: tokens.colors.interactive.bg,
              color: tokens.colors.interactive.text,
              cursor: 'pointer',
              fontSize: tokens.typography.fontSize.base,
              fontWeight: tokens.typography.fontWeight.medium,
            }}
          >
            Add Widget
          </button>
          <div style={{
            fontSize: tokens.typography.fontSize.sm,
            color: theme.colorScheme === 'dark' ? 'oklch(0.7 0.01 250)' : tokens.colors.surface.textMuted,
            textAlign: 'center',
          }}>
            Widgets: {gridItems.length}
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div style={gridOverlayStyle}>
        <GridContainerWithTokens
          items={gridItems}
          onItemMove={handleItemMove}
          theme={theme}
          enableContrastValidation={enableContrastValidation}
          defaultItemVariant={itemVariant}
          debounceMs={200}
        />
      </div>

      {/* Design System Info */}
      <div style={{
        marginTop: tokens.spacing['2xl'],
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: tokens.spacing.lg,
      }}>
        {/* Token Showcase */}
        <div style={{
          padding: tokens.spacing.lg,
          backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.15 0.02 250)' : tokens.colors.surface.bgSubtle,
          borderRadius: tokens.borderRadius.lg,
          border: `1px solid ${theme.colorScheme === 'dark' ? 'oklch(0.25 0.02 250)' : tokens.colors.surface.border}`,
        }}>
          <h4 style={{
            margin: `0 0 ${tokens.spacing.md} 0`,
            fontSize: tokens.typography.fontSize.lg,
            fontWeight: tokens.typography.fontWeight.semibold,
          }}>
            🎨 Design Tokens
          </h4>
          <div style={{ fontSize: tokens.typography.fontSize.sm, lineHeight: tokens.typography.lineHeight.relaxed }}>
            <div><strong>Color Space:</strong> {designSystemMetadata.colorSpace}</div>
            <div><strong>WCAG Level:</strong> {designSystemMetadata.wcag}</div>
            <div><strong>APCA Standard:</strong> {designSystemMetadata.apca}</div>
            <div><strong>Version:</strong> {designSystemMetadata.version}</div>
          </div>
        </div>

        {/* Color Palette */}
        <div style={{
          padding: tokens.spacing.lg,
          backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.15 0.02 250)' : tokens.colors.surface.bgSubtle,
          borderRadius: tokens.borderRadius.lg,
          border: `1px solid ${theme.colorScheme === 'dark' ? 'oklch(0.25 0.02 250)' : tokens.colors.surface.border}`,
        }}>
          <h4 style={{
            margin: `0 0 ${tokens.spacing.md} 0`,
            fontSize: tokens.typography.fontSize.lg,
            fontWeight: tokens.typography.fontWeight.semibold,
          }}>
            🎨 Color Palette
          </h4>
          <div style={{ display: 'grid', gap: tokens.spacing.sm }}>
            {Object.entries(tokens.colors).map(([category, colors]) => (
              <div key={category} style={{ fontSize: tokens.typography.fontSize.sm }}>
                <strong>{category}:</strong>
                <div style={{ display: 'flex', gap: tokens.spacing.xs, marginTop: tokens.spacing.xs }}>
                  {Object.entries(colors).slice(0, 3).map(([name, color]) => (
                    <div
                      key={name}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: color as string,
                        borderRadius: tokens.borderRadius.sm,
                        border: `1px solid ${tokens.colors.surface.border}`,
                        title: name,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility Features */}
        <div style={{
          padding: tokens.spacing.lg,
          backgroundColor: theme.colorScheme === 'dark' ? 'oklch(0.15 0.02 250)' : tokens.colors.surface.bgSubtle,
          borderRadius: tokens.borderRadius.lg,
          border: `1px solid ${theme.colorScheme === 'dark' ? 'oklch(0.25 0.02 250)' : tokens.colors.surface.border}`,
        }}>
          <h4 style={{
            margin: `0 0 ${tokens.spacing.md} 0`,
            fontSize: tokens.typography.fontSize.lg,
            fontWeight: tokens.typography.fontWeight.semibold,
          }}>
            ♿ Accessibility
          </h4>
          <div style={{ fontSize: tokens.typography.fontSize.sm, lineHeight: tokens.typography.lineHeight.relaxed }}>
            <div>✅ APCA Contrast Validation</div>
            <div>✅ WCAG 2.2 AA Compliant</div>
            <div>✅ Keyboard Navigation</div>
            <div>✅ Screen Reader Support</div>
            <div>✅ Reduced Motion Support</div>
            <div>✅ Focus Management</div>
            <div><strong>Touch Targets:</strong> {designSystemMetadata.touchTargets}</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: tokens.spacing['2xl'],
        padding: tokens.spacing.lg,
        backgroundColor: tokens.colors.success.bgSubtle,
        borderRadius: tokens.borderRadius.lg,
        border: `1px solid ${tokens.colors.success.border}`,
        fontSize: tokens.typography.fontSize.sm,
      }}>
        <h4 style={{
          margin: `0 0 ${tokens.spacing.md} 0`,
          color: tokens.colors.success.text,
          fontSize: tokens.typography.fontSize.lg,
          fontWeight: tokens.typography.fontWeight.semibold,
        }}>
          ✅ Integration Complete!
        </h4>
        <ul style={{
          margin: 0,
          paddingLeft: tokens.spacing.lg,
          color: tokens.colors.success.text,
        }}>
          <li>Drag any widget to reposition it on the grid</li>
          <li>Switch between themes (light/dark) with OKLCH tokens</li>
          <li>Try different variants (accent, muted, success, warning, error)</li>
          <li>Toggle accessibility features (reduced motion, high contrast)</li>
          <li>APCA contrast validation ensures WCAG 2.2 AA compliance</li>
          <li>All colors from Agent B's OKLCH design token system</li>
        </ul>
      </div>
    </div>
  );
};

export default GridTokenDemo;