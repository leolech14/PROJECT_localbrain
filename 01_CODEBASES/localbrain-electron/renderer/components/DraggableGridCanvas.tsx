// Draggable Grid Canvas - Dynamic grid with draggable divider lines
// Lines create cells dynamically based on their positions
// Widgets drop into cells created by line intersections

import { useState, useRef } from "react";
import ChatCanvas from "./ChatCanvas";
import ContextCanvas from "./ContextCanvas";
import VoiceCanvas from "./VoiceCanvas";
import MetricsCanvas from "./MetricsCanvas";
import { Message } from "./MessageBubble";

type WidgetType = "chat" | "context" | "voice" | "metrics" | "browser" | "files" | "preview" | "ide" | "empty";

type GridLine = {
  id: string;
  position: number; // percentage (0-100)
  start?: number; // optional start point (0-100) - for partial lines
  end?: number; // optional end point (0-100) - for partial lines
};

type Cell = {
  id: string;
  row: number;
  col: number;
  top: number; // percentage
  left: number; // percentage
  height: number; // percentage
  width: number; // percentage
  widget: WidgetType;
  widgets?: CellWidget[]; // Multiple widgets in cell
};

type CellWidget = {
  cellId: string;
  widgetType: WidgetType;
};

// Widget visual needs - determines proportional sizing
const WIDGET_VISUAL_PRIORITY = {
  browser: 5,   // Needs maximum space (full web pages)
  ide: 5,       // Needs maximum space (code editor)
  chat: 4,      // Needs most space (messages + scrolling)
  files: 4,     // Needs good space (directory tree)
  context: 3,   // Needs good space (file list + content)
  preview: 3,   // Needs good space (file preview)
  metrics: 2,   // Needs moderate space (charts + stats)
  voice: 1,     // Needs minimal space (orb + controls)
  empty: 0,
};

type ContextItem = {
  id: string;
  title: string;
  content: string;
};

type DraggableGridCanvasProps = {
  messages: Message[];
  isStreaming: boolean;
  currentInput: string;
  setCurrentInput: (text: string) => void;
  onSend: () => void;
  contextPool: ContextItem[];
  micActive: boolean;
  onToggleMic: () => void;
  isCIActive: boolean;
  isInputFocused: boolean;
  setIsInputFocused: (focused: boolean) => void;
  onAddContext: () => void;
  onRemoveContext: (id: string) => void;
  isAIConnected: boolean;
};

export default function DraggableGridCanvas({
  messages,
  isStreaming,
  currentInput,
  setCurrentInput,
  onSend,
  contextPool,
  micActive,
  onToggleMic,
  isCIActive,
  isInputFocused,
  setIsInputFocused,
  onAddContext,
  onRemoveContext,
  isAIConnected,
}: DraggableGridCanvasProps) {
  // Start with 2 horizontal + 2 vertical lines creating 3x3 grid
  const [horizontalLines, setHorizontalLines] = useState<GridLine[]>([
    { id: "h1", position: 33.33 },
    { id: "h2", position: 66.66 },
  ]);

  const [verticalLines, setVerticalLines] = useState<GridLine[]>([
    { id: "v1", position: 33.33 },
    { id: "v2", position: 66.66 },
  ]);

  const [draggedLine, setDraggedLine] = useState<{
    id: string;
    type: "horizontal" | "vertical";
  } | null>(null);

  const [cellWidgets, setCellWidgets] = useState<CellWidget[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    lineId?: string;
    lineType?: "horizontal" | "vertical";
    cellId?: string;
  } | null>(null);

  // CMD+Click+Slide gesture state
  const [isCutting, setIsCutting] = useState(false);
  const [cutStart, setCutStart] = useState<{ x: number; y: number } | null>(null);
  const [cutCurrent, setCutCurrent] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Calculate cells from line intersections
  const cells: Cell[] = [];
  const horizontalPositions = [0, ...horizontalLines.map((l) => l.position), 100];
  const verticalPositions = [0, ...verticalLines.map((l) => l.position), 100];

  for (let row = 0; row < horizontalPositions.length - 1; row++) {
    for (let col = 0; col < verticalPositions.length - 1; col++) {
      const cellId = `${row}-${col}`;

      // Get all widgets in this cell
      const widgetsInCell = cellWidgets.filter(cw => cw.cellId === cellId);

      cells.push({
        id: cellId,
        row,
        col,
        top: horizontalPositions[row],
        left: verticalPositions[col],
        height: horizontalPositions[row + 1] - horizontalPositions[row],
        width: verticalPositions[col + 1] - verticalPositions[col],
        widget: widgetsInCell.length > 0 ? widgetsInCell[0].widgetType : "empty",
        widgets: widgetsInCell, // Store all widgets
      });
    }
  }

  // Calculate smart proportional sizes for multi-widget cells
  const calculateWidgetProportions = (widgets: CellWidget[]) => {
    if (widgets.length === 0) return [];
    if (widgets.length === 1) return [100]; // Single widget gets 100%

    // Calculate total priority
    const totalPriority = widgets.reduce(
      (sum, w) => sum + WIDGET_VISUAL_PRIORITY[w.widgetType],
      0
    );

    // Distribute space proportionally based on visual needs
    return widgets.map(w => {
      const priority = WIDGET_VISUAL_PRIORITY[w.widgetType];
      return (priority / totalPriority) * 100;
    });
  };

  const handleMouseDown = (e: React.MouseEvent, lineId: string, type: "horizontal" | "vertical") => {
    // Don't drag lines during cutting mode
    if (e.metaKey) return;

    setDraggedLine({ id: lineId, type });
    setIsResizing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    // CMD+Click+Slide cutting mode
    if (isCutting && cutStart) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCutCurrent({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
      return;
    }

    // Normal line dragging
    if (!draggedLine) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const { type, id } = draggedLine;

    if (type === "horizontal") {
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const clampedY = Math.max(5, Math.min(95, y)); // Keep in bounds

      setHorizontalLines((prev) =>
        prev.map((line) =>
          line.id === id ? { ...line, position: clampedY } : line
        )
      );
    } else {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const clampedX = Math.max(5, Math.min(95, x)); // Keep in bounds

      setVerticalLines((prev) =>
        prev.map((line) =>
          line.id === id ? { ...line, position: clampedX } : line
        )
      );
    }
  };

  const handleMouseUp = () => {
    // Apply CMD+Click+Slide cut
    if (isCutting && cutStart && cutCurrent) {
      console.log('🔪 APPLYING CUT GESTURE', { cutStart, cutCurrent, isCutting });
      applyCutGesture();
    }

    setDraggedLine(null);
    setIsResizing(false);
    setIsCutting(false);
    setCutStart(null);
    setCutCurrent(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // CMD+Click to start cutting gesture
    if (e.metaKey && canvasRef.current) {
      e.preventDefault();
      const rect = canvasRef.current.getBoundingClientRect();
      const startPoint = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
      console.log('✂️ CUTTING MODE STARTED', { metaKey: e.metaKey, startPoint });
      setIsCutting(true);
      setCutStart(startPoint);
      setCutCurrent(startPoint);
    }
  };

  const applyCutGesture = () => {
    if (!cutStart || !cutCurrent) return;

    const minX = Math.min(cutStart.x, cutCurrent.x);
    const maxX = Math.max(cutStart.x, cutCurrent.x);
    const minY = Math.min(cutStart.y, cutCurrent.y);
    const maxY = Math.max(cutStart.y, cutCurrent.y);

    // Find which lines intersect the cut gesture
    const cutWidth = maxX - minX;
    const cutHeight = maxY - minY;

    console.log('🎯 CUT BOX:', { minX, maxX, minY, maxY, cutWidth, cutHeight });

    // If mostly horizontal gesture (wider than tall), cut horizontal lines
    if (cutWidth > cutHeight) {
      console.log('➡️ CUTTING HORIZONTAL LINES');
      setHorizontalLines((prev) => {
        const newLines = prev.map((line) => {
          // Check if line intersects the cut box vertically
          if (line.position >= minY && line.position <= maxY) {
            console.log(`  ✂️ Line ${line.id} at ${line.position}% INTERSECTS cut box`);
            const currentStart = line.start ?? 0;
            const currentEnd = line.end ?? 100;

            // DELETE THE EXACT SECTION between minX and maxX
            // Check if cut completely removes the line
            if (minX <= currentStart && maxX >= currentEnd) {
              // Line is completely cut - remove it by making it invisible
              return { ...line, start: 50, end: 50 }; // Zero-length line
            }

            // If cut is at the start (touches left edge)
            if (minX <= currentStart + 5) {
              return { ...line, start: maxX, end: currentEnd };
            }

            // If cut is at the end (touches right edge)
            if (maxX >= currentEnd - 5) {
              return { ...line, start: currentStart, end: minX };
            }

            // Cut is in the middle - KEEP THE LARGER SEGMENT
            const leftSegment = minX - currentStart;
            const rightSegment = currentEnd - maxX;

            if (leftSegment > rightSegment) {
              return { ...line, start: currentStart, end: minX };
            } else {
              return { ...line, start: maxX, end: currentEnd };
            }
          }
          return line;
        });

        const filtered = newLines.filter(line => {
          // Remove zero-length lines
          const start = line.start ?? 0;
          const end = line.end ?? 100;
          return Math.abs(end - start) > 1;
        });

        console.log(`  📊 Before: ${prev.length} lines, After: ${filtered.length} lines`);
        return filtered;
      });
    }
    // If mostly vertical gesture (taller than wide), cut vertical lines
    else {
      console.log('⬇️ CUTTING VERTICAL LINES');
      setVerticalLines((prev) => {
        const newLines = prev.map((line) => {
          // Check if line intersects the cut box horizontally
          if (line.position >= minX && line.position <= maxX) {
            console.log(`  ✂️ Line ${line.id} at ${line.position}% INTERSECTS cut box`);
            const currentStart = line.start ?? 0;
            const currentEnd = line.end ?? 100;

            // DELETE THE EXACT SECTION between minY and maxY
            // Check if cut completely removes the line
            if (minY <= currentStart && maxY >= currentEnd) {
              // Line is completely cut - remove it by making it invisible
              return { ...line, start: 50, end: 50 }; // Zero-length line
            }

            // If cut is at the start (touches top edge)
            if (minY <= currentStart + 5) {
              return { ...line, start: maxY, end: currentEnd };
            }

            // If cut is at the end (touches bottom edge)
            if (maxY >= currentEnd - 5) {
              return { ...line, start: currentStart, end: minY };
            }

            // Cut is in the middle - KEEP THE LARGER SEGMENT
            const topSegment = minY - currentStart;
            const bottomSegment = currentEnd - maxY;

            if (topSegment > bottomSegment) {
              return { ...line, start: currentStart, end: minY };
            } else {
              return { ...line, start: maxY, end: currentEnd };
            }
          }
          return line;
        });

        const filtered = newLines.filter(line => {
          // Remove zero-length lines
          const start = line.start ?? 0;
          const end = line.end ?? 100;
          return Math.abs(end - start) > 1;
        });

        console.log(`  📊 Before: ${prev.length} lines, After: ${filtered.length} lines`);
        return filtered;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (cellId: string, e: React.DragEvent) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData("widgetType") as WidgetType;
    if (!widgetType || widgetType === "empty") return;

    // Add widget to cell (multiple widgets allowed)
    setCellWidgets(prev => {
      // Check if this widget is already in this cell
      const alreadyExists = prev.some(
        cw => cw.cellId === cellId && cw.widgetType === widgetType
      );
      if (alreadyExists) return prev;

      return [...prev, { cellId, widgetType }];
    });
  };

  const handleClearCell = (cellId: string) => {
    setCellWidgets(prev => prev.filter(cw => cw.cellId !== cellId));
  };

  const handleRemoveWidget = (cellId: string, widgetType: WidgetType) => {
    setCellWidgets(prev =>
      prev.filter(cw => !(cw.cellId === cellId && cw.widgetType === widgetType))
    );
  };

  // Context menu handlers
  const handleLineRightClick = (e: React.MouseEvent, lineId: string, lineType: "horizontal" | "vertical") => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      lineId,
      lineType,
    });
  };

  const handleCanvasRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleAddHorizontalLine = () => {
    if (!contextMenu || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const yPercent = ((contextMenu.y - rect.top) / rect.height) * 100;
    const clampedY = Math.max(5, Math.min(95, yPercent));

    const newId = `h${horizontalLines.length + 1}`;
    setHorizontalLines(prev => [...prev, { id: newId, position: clampedY }].sort((a, b) => a.position - b.position));
    setContextMenu(null);
  };

  const handleAddVerticalLine = () => {
    if (!contextMenu || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const xPercent = ((contextMenu.x - rect.left) / rect.width) * 100;
    const clampedX = Math.max(5, Math.min(95, xPercent));

    const newId = `v${verticalLines.length + 1}`;
    setVerticalLines(prev => [...prev, { id: newId, position: clampedX }].sort((a, b) => a.position - b.position));
    setContextMenu(null);
  };

  const handleDeleteLine = () => {
    if (!contextMenu || !contextMenu.lineId) return;

    if (contextMenu.lineType === "horizontal") {
      setHorizontalLines(prev => prev.filter(line => line.id !== contextMenu.lineId));
    } else {
      setVerticalLines(prev => prev.filter(line => line.id !== contextMenu.lineId));
    }
    setContextMenu(null);
  };

  const handleCutLineStart = () => {
    if (!contextMenu || !contextMenu.lineId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const { lineId, lineType } = contextMenu;

    if (lineType === "horizontal") {
      // Cut from left edge to click position
      const cutPoint = ((contextMenu.x - rect.left) / rect.width) * 100;
      setHorizontalLines(prev =>
        prev.map(line =>
          line.id === lineId ? { ...line, start: 0, end: cutPoint } : line
        )
      );
    } else {
      // Cut from top edge to click position
      const cutPoint = ((contextMenu.y - rect.top) / rect.height) * 100;
      setVerticalLines(prev =>
        prev.map(line =>
          line.id === lineId ? { ...line, start: 0, end: cutPoint } : line
        )
      );
    }
    setContextMenu(null);
  };

  const handleCutLineEnd = () => {
    if (!contextMenu || !contextMenu.lineId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const { lineId, lineType } = contextMenu;

    if (lineType === "horizontal") {
      // Cut from click position to right edge
      const cutPoint = ((contextMenu.x - rect.left) / rect.width) * 100;
      setHorizontalLines(prev =>
        prev.map(line =>
          line.id === lineId ? { ...line, start: cutPoint, end: 100 } : line
        )
      );
    } else {
      // Cut from click position to bottom edge
      const cutPoint = ((contextMenu.y - rect.top) / rect.height) * 100;
      setVerticalLines(prev =>
        prev.map(line =>
          line.id === lineId ? { ...line, start: cutPoint, end: 100 } : line
        )
      );
    }
    setContextMenu(null);
  };

  const handleCutLineMiddle = () => {
    if (!contextMenu || !contextMenu.lineId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const { lineId, lineType } = contextMenu;

    if (lineType === "horizontal") {
      // Cut middle section (±15% around click)
      const centerPoint = ((contextMenu.x - rect.left) / rect.width) * 100;
      const start = Math.max(0, centerPoint - 15);
      const end = Math.min(100, centerPoint + 15);
      setHorizontalLines(prev =>
        prev.map(line =>
          line.id === lineId ? { ...line, start, end } : line
        )
      );
    } else {
      // Cut middle section (±15% around click)
      const centerPoint = ((contextMenu.y - rect.top) / rect.height) * 100;
      const start = Math.max(0, centerPoint - 15);
      const end = Math.min(100, centerPoint + 15);
      setVerticalLines(prev =>
        prev.map(line =>
          line.id === lineId ? { ...line, start, end } : line
        )
      );
    }
    setContextMenu(null);
  };

  const handleRestoreFullLine = () => {
    if (!contextMenu || !contextMenu.lineId) return;

    const { lineId, lineType } = contextMenu;

    if (lineType === "horizontal") {
      setHorizontalLines(prev =>
        prev.map(line =>
          line.id === lineId ? { ...line, start: undefined, end: undefined } : line
        )
      );
    } else {
      setVerticalLines(prev =>
        prev.map(line =>
          line.id === lineId ? { ...line, start: undefined, end: undefined } : line
        )
      );
    }
    setContextMenu(null);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div
      ref={canvasRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleCanvasRightClick}
      onClick={handleCloseContextMenu}
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: "var(--bg1)",
        cursor: isCutting ? "crosshair" : draggedLine ? (draggedLine.type === "horizontal" ? "ns-resize" : "ew-resize") : "default",
      }}
    >
      {/* Render cells */}
      {cells.map((cell) => {
        const widgetsInCell = cell.widgets || [];
        const proportions = calculateWidgetProportions(widgetsInCell);
        const hasWidgets = widgetsInCell.length > 0;

        return (
          <div
            key={cell.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(cell.id, e)}
            style={{
              position: "absolute",
              top: `${cell.top}%`,
              left: `${cell.left}%`,
              width: `${cell.width}%`,
              height: `${cell.height}%`,
              border: hasWidgets ? "none" : "1px dashed var(--hair)",
              boxSizing: "border-box",
              overflow: "hidden",
              display: "flex",
              flexDirection: "row", // HORIZONTAL layout side-by-side!
            }}
          >
            {/* Empty state - subtle depth with tone change */}
            {!hasWidgets && (
              <div
                style={{
                  height: "100%",
                  backgroundColor: "var(--bg2)",
                  transition: "background-color 0.3s ease",
                }}
              />
            )}

            {/* Multi-widget intelligent layout - Living Organisms */}
            {widgetsInCell.map((cellWidget, index) => {
              const widgetType = cellWidget.widgetType;
              const heightPercent = proportions[index];
              const isActive = (widgetType === "chat" && isStreaming) ||
                               (widgetType === "voice" && micActive);

              return (
                <div
                  key={`${cell.id}-${widgetType}-${index}`}
                  className={`widget-body ${isActive ? 'widget-active' : 'widget-breathing'} ${isResizing ? 'widget-resizing' : ''}`}
                  style={{
                    width: `${heightPercent}%`, // Use WIDTH for horizontal layout!
                    height: "100%", // Full height of cell
                    borderRight: index < widgetsInCell.length - 1 ? "1px solid var(--hair)" : "none", // Vertical divider
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Widget Compartment - 2D Rectangular Body */}
                  <div className="widget-compartment">
                    {/* Individual widget remove button */}
                    <button
                      onClick={() => handleRemoveWidget(cell.id, widgetType)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        zIndex: 10,
                        backgroundColor: "var(--bg3)",
                        border: "1px solid var(--hair)",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        fontSize: "0.6875rem",
                        color: "var(--tx2)",
                        cursor: "pointer",
                        opacity: 0.6,
                        transition: "opacity 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
                    >
                      ×
                    </button>

                    {/* Widget Content - Fills Available Area */}
                    <div className={`widget-content ${isActive ? 'widget-shimmer' : ''}`}>
                      {widgetType === "chat" && (
                        <ChatCanvas
                          messages={messages}
                          isStreaming={isStreaming}
                          isCIActive={isCIActive}
                          shouldShowCI={false}
                        />
                      )}

                      {widgetType === "context" && (
                        <ContextCanvas
                          contextPool={contextPool}
                          onAddContext={onAddContext}
                          onRemoveContext={onRemoveContext}
                        />
                      )}

                      {widgetType === "voice" && (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <VoiceCanvas micActive={micActive} onToggleMic={onToggleMic} />
                        </div>
                      )}

                      {widgetType === "metrics" && (
                        <MetricsCanvas
                          messageCount={messages.length}
                          tokenUsage="0"
                          contextCount={contextPool.length}
                          isAIConnected={isAIConnected}
                        />
                      )}

                      {widgetType === "browser" && (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tx2)" }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🌐</div>
                            <div>Browser Widget</div>
                          </div>
                        </div>
                      )}

                      {widgetType === "files" && (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tx2)" }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📁</div>
                            <div>Files Widget</div>
                          </div>
                        </div>
                      )}

                      {widgetType === "preview" && (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tx2)" }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>👁️</div>
                            <div>Preview Widget</div>
                          </div>
                        </div>
                      )}

                      {widgetType === "ide" && (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tx2)" }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>💻</div>
                            <div>IDE Widget</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Horizontal lines (draggable + right-clickable + supports partial segments) */}
      {horizontalLines.map((line) => {
        const lineStart = line.start ?? 0;
        const lineEnd = line.end ?? 100;
        const isPartial = line.start !== undefined || line.end !== undefined;

        return (
          <div
            key={line.id}
            onMouseDown={(e) => handleMouseDown(e, line.id, "horizontal")}
            onContextMenu={(e) => handleLineRightClick(e, line.id, "horizontal")}
            style={{
              position: "absolute",
              top: `${line.position}%`,
              left: `${lineStart}%`,
              width: `${lineEnd - lineStart}%`,
              height: "2px",
              backgroundColor: isPartial ? "oklch(0.70 0.20 30)" : "var(--hair)",
              cursor: "ns-resize",
              zIndex: 100,
              transition: "background-color 0.2s ease, box-shadow 0.2s ease",
              boxShadow: isPartial ? "0 0 8px oklch(0.70 0.20 30 / 0.5)" : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--acc)";
              e.currentTarget.style.boxShadow = "0 0 12px var(--acc)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isPartial ? "oklch(0.70 0.20 30)" : "var(--hair)";
              e.currentTarget.style.boxShadow = isPartial ? "0 0 8px oklch(0.70 0.20 30 / 0.5)" : "none";
            }}
          />
        );
      })}

      {/* Vertical lines (draggable + right-clickable + supports partial segments) */}
      {verticalLines.map((line) => {
        const lineStart = line.start ?? 0;
        const lineEnd = line.end ?? 100;
        const isPartial = line.start !== undefined || line.end !== undefined;

        return (
          <div
            key={line.id}
            onMouseDown={(e) => handleMouseDown(e, line.id, "vertical")}
            onContextMenu={(e) => handleLineRightClick(e, line.id, "vertical")}
            style={{
              position: "absolute",
              left: `${line.position}%`,
              top: `${lineStart}%`,
              height: `${lineEnd - lineStart}%`,
              width: "2px",
              backgroundColor: isPartial ? "oklch(0.70 0.20 240)" : "var(--hair)",
              cursor: "ew-resize",
              zIndex: 100,
              transition: "background-color 0.2s ease, box-shadow 0.2s ease",
              boxShadow: isPartial ? "0 0 8px oklch(0.70 0.20 240 / 0.5)" : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--acc)";
              e.currentTarget.style.boxShadow = "0 0 12px var(--acc)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isPartial ? "oklch(0.70 0.20 240)" : "var(--hair)";
              e.currentTarget.style.boxShadow = isPartial ? "0 0 8px oklch(0.70 0.20 240 / 0.5)" : "none";
            }}
          />
        );
      })}

      {/* CMD+Click+Slide cutting visual feedback */}
      {isCutting && cutStart && cutCurrent && canvasRef.current && (
        <div
          style={{
            position: "absolute",
            left: `${Math.min(cutStart.x, cutCurrent.x)}%`,
            top: `${Math.min(cutStart.y, cutCurrent.y)}%`,
            width: `${Math.abs(cutCurrent.x - cutStart.x)}%`,
            height: `${Math.abs(cutCurrent.y - cutStart.y)}%`,
            backgroundColor: "oklch(0.70 0.25 30 / 0.15)",
            border: "2px dashed oklch(0.70 0.25 30)",
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 200,
            boxShadow: "0 0 20px oklch(0.70 0.25 30 / 0.6), inset 0 0 20px oklch(0.70 0.25 30 / 0.3)",
            animation: "pulse 0.8s ease-in-out infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "2rem",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))",
            }}
          >
            ✂️
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: "var(--bg3)",
            border: "1px solid var(--hair)",
            borderRadius: "6px",
            padding: "4px",
            zIndex: 1000,
            minWidth: "160px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.lineId ? (
            // Line context menu - with cutting options
            <>
              <div style={{ padding: "4px 12px", fontSize: "0.6875rem", color: "var(--tx3)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Cut Section
              </div>
              <button
                onClick={handleCutLineStart}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "var(--tx1)",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg4)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ✂️ Cut from start
              </button>
              <button
                onClick={handleCutLineEnd}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "var(--tx1)",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg4)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ✂️ Cut from end
              </button>
              <button
                onClick={handleCutLineMiddle}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "var(--tx1)",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg4)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ✂️ Cut middle section
              </button>
              <div style={{ height: "1px", backgroundColor: "var(--hair)", margin: "4px 0" }} />
              <button
                onClick={handleRestoreFullLine}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "oklch(0.70 0.20 145)",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg4)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ↺ Restore full line
              </button>
              <div style={{ height: "1px", backgroundColor: "var(--hair)", margin: "4px 0" }} />
              <button
                onClick={handleDeleteLine}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "oklch(0.70 0.20 30)",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg4)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                🗑️ Delete line
              </button>
            </>
          ) : (
            // Canvas context menu
            <>
              <button
                onClick={handleAddHorizontalLine}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "var(--tx1)",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg4)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Add horizontal line
              </button>
              <button
                onClick={handleAddVerticalLine}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "var(--tx1)",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg4)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Add vertical line
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
