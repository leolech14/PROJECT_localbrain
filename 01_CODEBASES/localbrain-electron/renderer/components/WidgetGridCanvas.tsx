// Widget Grid Canvas - 3x3 Drag-and-Drop Widget Grid
// SPECBASE: Main canvas with 90-degree intersecting lines forming big cells
// Widgets can be dragged and dropped into cells

import { useState } from "react";
import ChatCanvas from "./ChatCanvas";
import ContextCanvas from "./ContextCanvas";
import VoiceCanvas from "./VoiceCanvas";
import MetricsCanvas from "./MetricsCanvas";
import InputArea from "./InputArea";
import { Message } from "./MessageBubble";

type ActiveModule = "chat" | "context" | "voice" | "metrics" | "widgets";

type ContextItem = {
  id: string;
  title: string;
  content: string;
};

type WidgetGridCanvasProps = {
  activeModule: ActiveModule;
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

type WidgetType = "chat" | "context" | "voice" | "metrics" | "empty";

type GridCell = {
  id: string;
  widget: WidgetType;
  row: number;
  col: number;
};

export default function WidgetGridCanvas({
  activeModule,
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
}: WidgetGridCanvasProps) {
  // 3x3 Grid - initially empty
  const [gridCells, setGridCells] = useState<GridCell[]>([
    { id: "0-0", widget: "empty", row: 0, col: 0 },
    { id: "0-1", widget: "empty", row: 0, col: 1 },
    { id: "0-2", widget: "empty", row: 0, col: 2 },
    { id: "1-0", widget: "empty", row: 1, col: 0 },
    { id: "1-1", widget: "empty", row: 1, col: 1 },
    { id: "1-2", widget: "empty", row: 1, col: 2 },
    { id: "2-0", widget: "empty", row: 2, col: 0 },
    { id: "2-1", widget: "empty", row: 2, col: 1 },
    { id: "2-2", widget: "empty", row: 2, col: 2 },
  ]);

  const [draggedWidget, setDraggedWidget] = useState<WidgetType | null>(null);

  const handleDragStart = (widget: WidgetType) => {
    setDraggedWidget(widget);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (cellId: string, e: React.DragEvent) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData("widgetType") as WidgetType;
    if (!widgetType) return;

    setGridCells((prev) =>
      prev.map((cell) =>
        cell.id === cellId ? { ...cell, widget: widgetType } : cell
      )
    );
  };

  const handleClearCell = (cellId: string) => {
    setGridCells((prev) =>
      prev.map((cell) =>
        cell.id === cellId ? { ...cell, widget: "empty" } : cell
      )
    );
  };

  return (
    // ONLY 3x3 Grid Canvas - NOTHING ELSE!
    <div
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: "2px",
        padding: "2px",
        backgroundColor: "var(--hair)",
        overflow: "auto",
      }}
    >
      {gridCells.map((cell) => (
        <GridCellComponent
          key={cell.id}
          cell={cell}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(cell.id, e)}
          onClear={() => handleClearCell(cell.id)}
          // Widget props
          messages={messages}
          isStreaming={isStreaming}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          onSend={onSend}
          contextPool={contextPool}
          micActive={micActive}
          onToggleMic={onToggleMic}
          isCIActive={isCIActive}
          isInputFocused={isInputFocused}
          setIsInputFocused={setIsInputFocused}
          onAddContext={onAddContext}
          onRemoveContext={onRemoveContext}
          isAIConnected={isAIConnected}
        />
      ))}
    </div>
  );
}

// Widget Palette Item
function WidgetPaletteItem({
  type,
  label,
  onDragStart,
}: {
  type: WidgetType;
  label: string;
  onDragStart: (type: WidgetType) => void;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(type)}
      style={{
        padding: "8px 16px",
        backgroundColor: "var(--bg3)",
        borderRadius: "6px",
        fontSize: "0.875rem",
        color: "var(--tx1)",
        cursor: "grab",
        userSelect: "none",
        transition: "all 0.2s ease",
      }}
      className="card"
    >
      {label}
    </div>
  );
}

// Grid Cell Component
function GridCellComponent({
  cell,
  onDragOver,
  onDrop,
  onClear,
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
}: {
  cell: GridCell;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClear: () => void;
  messages: Message[];
  isStreaming: boolean;
  currentInput: string;
  setCurrentInput: (text: string) => void;
  onSend: () => void;
  contextPool: any[];
  micActive: boolean;
  onToggleMic: () => void;
  isCIActive: boolean;
  isInputFocused: boolean;
  setIsInputFocused: (focused: boolean) => void;
  onAddContext: () => void;
  onRemoveContext: (id: string) => void;
  isAIConnected: boolean;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e)}
      style={{
        backgroundColor: "var(--bg1)",
        position: "relative",
        minHeight: "200px",
        overflow: "hidden",
      }}
    >
      {/* Clear button (only show when widget present) */}
      {cell.widget !== "empty" && (
        <button
          onClick={onClear}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 10,
            backgroundColor: "var(--bg3)",
            border: "1px solid var(--hair)",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "0.75rem",
            color: "var(--tx2)",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      )}

      {/* Widget Content */}
      {cell.widget === "empty" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "var(--tx3)",
            fontSize: "0.875rem",
            border: "2px dashed var(--hair)",
            borderRadius: "8px",
            margin: "8px",
          }}
        >
          Drop widget here
        </div>
      )}

      {cell.widget === "chat" && (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <ChatCanvas
            messages={messages}
            isStreaming={isStreaming}
            isCIActive={isCIActive}
            shouldShowCI={false}
          />
        </div>
      )}

      {cell.widget === "context" && (
        <ContextCanvas
          contextPool={contextPool}
          onAddContext={onAddContext}
          onRemoveContext={onRemoveContext}
        />
      )}

      {cell.widget === "voice" && (
        <VoiceCanvas micActive={micActive} onToggleMic={onToggleMic} />
      )}

      {cell.widget === "metrics" && (
        <MetricsCanvas
          messageCount={messages.length}
          tokenUsage="0"
          contextCount={contextPool.length}
          isAIConnected={isAIConnected}
        />
      )}
    </div>
  );
}
