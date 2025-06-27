import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Separator } from "@/components/Shadcn/ui/separator";
import { Icon } from "@iconify/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { CellPosition, EditorState, EditorTool, GridCell, SeatMapGrid } from "../../../../interfaces/seatmap.interface";

interface SeatMapEditorProps {
  seatMap: SeatMapGrid;
  onSeatMapUpdate: (updatedMap: SeatMapGrid) => void;
}

interface GridCellEditorProps {
  cell: GridCell;
  row: number;
  col: number;
  isSelected: boolean;
  isInSelectionArea: boolean;
  currentTool: EditorTool;
  onCellInteraction: (row: number, col: number, action: "click" | "enter" | "leave") => void;
}

const GridCellEditor: React.FC<GridCellEditorProps> = ({ cell, row, col, isSelected, isInSelectionArea, currentTool, onCellInteraction }) => {
  const getSelectionClasses = () => {
    let selectionClass = "";
    let selectionAreaClass = "";

    if (currentTool === "eraser") {
      selectionClass = isSelected ? "ring-2 ring-red-400 ring-inset bg-red-100 border-red-400" : "";
      selectionAreaClass = isInSelectionArea ? "bg-red-200 border-red-400 border-2 shadow-inner" : "";
    } else {
      // Default for select tool and others
      selectionClass = isSelected ? "ring-2 ring-blue-400 ring-inset bg-blue-100 border-blue-400" : "";
      selectionAreaClass = isInSelectionArea ? "bg-blue-200 border-blue-400 border-2 shadow-inner" : "";
    }

    // Priority: selection area takes precedence over normal selection
    return isInSelectionArea ? selectionAreaClass : selectionClass;
  };

  const getSeatClasses = () => {
    if (cell.type !== "seat") return "";

    // Double seat takes 2 columns width, others take 1
    const widthClass = cell.seatType === "D" ? "w-16" : "w-8";
    let colorClass = "";

    switch (cell.seatType) {
      case "V":
        colorClass = "bg-warning hover:bg-warning/80 text-warning-content";
        break;
      case "D":
        colorClass = "bg-secondary hover:bg-secondary/80 text-secondary-content";
        break;
      case "d":
        // Hide secondary part of double seat - it's already shown in main part
        return "w-0 h-0 invisible";
      case "S":
      default:
        colorClass = "bg-base-300 hover:bg-base-content/20 text-base-content";
        break;
    }

    if (cell.status === "taken") {
      colorClass = "bg-error text-error-content";
    } else if (cell.status === "maintenance") {
      colorClass = "bg-warning text-warning-content";
    }

    return `${widthClass} ${colorClass}`;
  };

  const getCellClass = () => {
    const baseClass = "h-8 border border-base-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-150";
    const activeSelectionClass = getSelectionClasses();

    if (cell.type === "empty") {
      return `${baseClass} w-8 bg-base-100 hover:bg-base-200 ${activeSelectionClass}`;
    }

    if (cell.type === "aisle") {
      return `${baseClass} w-8 bg-base-300 ${activeSelectionClass}`;
    }

    if (cell.type === "blocked") {
      return `${baseClass} w-8 bg-base-content/40 ${activeSelectionClass}`;
    }

    if (cell.type === "seat") {
      const seatClasses = getSeatClasses();
      return `${baseClass} ${seatClasses} ${activeSelectionClass}`;
    }

    return `${baseClass} ${activeSelectionClass}`;
  };

  return (
    <div
      className={getCellClass()}
      onMouseDown={() => onCellInteraction(row, col, "click")}
      onMouseEnter={() => onCellInteraction(row, col, "enter")}
      onMouseLeave={() => onCellInteraction(row, col, "leave")}
      data-row={row}
      data-col={col}
    >
      {cell.type === "seat" && cell.displayCol && (
        <span className="text-xs">
          {cell.seatType === "D" ? cell.displayCol : ""}
          {cell.seatType === "S" ? cell.displayCol : ""}
          {cell.seatType === "V" ? cell.displayCol : ""}
        </span>
      )}
      {cell.type === "aisle" && "·"}
      {cell.type === "blocked" && "✕"}
    </div>
  );
};

const SeatMapEditor: React.FC<SeatMapEditorProps> = ({ seatMap, onSeatMapUpdate }) => {
  const [editorState, setEditorState] = useState<EditorState>({
    currentTool: "select",
    isSelecting: false,
    selectedCells: [],
    isDragging: false,
    mode: "editor",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Get dynamic cursor style based on current tool and drag state
  const getCursorStyle = () => {
    if ((editorState.isSelecting || editorState.isDragging) && isMouseDown) {
      return "cursor-crosshair";
    }

    switch (editorState.currentTool) {
      case "select":
        return "cursor-crosshair";
      case "seat-standard":
      case "seat-vip":
      case "seat-double":
        return "cursor-pointer";
      case "aisle":
        return "cursor-cell";
      case "blocked":
        return "cursor-not-allowed";
      case "eraser":
        return "cursor-crosshair";
      default:
        return "cursor-default";
    }
  };

  // Get grid background class based on current tool and state
  const getGridBackgroundClass = () => {
    if ((editorState.isSelecting || editorState.isDragging) && isMouseDown) {
      return editorState.currentTool === "eraser" ? "bg-red-50 border-red-300" : "bg-blue-50 border-blue-300";
    }
    return "";
  };

  // Get tool status badge properties
  const getToolStatusBadgeProps = () => {
    const isEraser = editorState.currentTool === "eraser";
    const isSelect = editorState.currentTool === "select";

    const className = isEraser ? "bg-red-100 text-red-600 border-red-300 animate-pulse" : "bg-blue-100 text-blue-600 border-blue-300 animate-pulse";

    let icon: string;
    let text: string;

    if (isEraser) {
      icon = "material-symbols:delete";
      text = "Erasing...";
    } else if (isSelect) {
      icon = "material-symbols:select-all";
      text = "Selecting area...";
    } else {
      icon = "material-symbols:brush";
      text = "Applying tool...";
    }

    return { className, icon, text };
  };

  // Tools configuration
  const tools: { id: EditorTool; label: string; icon: string; variant: string }[] = [
    { id: "select", label: "Select", icon: "material-symbols:pan-tool", variant: "default" },
    { id: "eraser", label: "Eraser", icon: "material-symbols:delete", variant: "ghost" },
    { id: "seat-standard", label: "Standard Seat", icon: "material-symbols:chair", variant: "secondary" },
    { id: "seat-vip", label: "VIP Seat", icon: "material-symbols:crown", variant: "warning" },
    { id: "seat-double", label: "Double Seat", icon: "material-symbols:weekend", variant: "accent" },
    { id: "aisle", label: "Aisle", icon: "material-symbols:more-horiz", variant: "outline" },
    { id: "blocked", label: "Blocked", icon: "material-symbols:block", variant: "destructive" },
  ];

  // Check if cell is in selection area
  const isInSelectionArea = useCallback(
    (row: number, col: number): boolean => {
      if (!editorState.selectionArea) return false;

      const { startRow, startCol, endRow, endCol } = editorState.selectionArea;
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);

      return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
    },
    [editorState.selectionArea],
  );

  // Check if cell is selected
  const isCellSelected = useCallback(
    (row: number, col: number): boolean => {
      return editorState.selectedCells.some((cell) => cell.row === row && cell.col === col);
    },
    [editorState.selectedCells],
  );

  // Apply tool to cell
  const applytoolToCell = useCallback(
    (row: number, col: number) => {
      const updatedMap = { ...seatMap };
      updatedMap.gridData = seatMap.gridData.map((r) => [...r]);

      const cell = updatedMap.gridData[row][col];

      switch (editorState.currentTool) {
        case "seat-standard":
          updatedMap.gridData[row][col] = {
            ...cell,
            type: "seat",
            seatType: "S",
            displayRow: String.fromCharCode(65 + row),
            displayCol: (col + 1).toString(),
            isSweetbox: false,
            isMasterSweetbox: false,
            status: "available",
            id: `${String.fromCharCode(65 + row)}${col + 1}`,
          };
          break;

        case "seat-vip":
          updatedMap.gridData[row][col] = {
            ...cell,
            type: "seat",
            seatType: "V",
            displayRow: String.fromCharCode(65 + row),
            displayCol: (col + 1).toString(),
            isSweetbox: false,
            isMasterSweetbox: false,
            status: "available",
            id: `${String.fromCharCode(65 + row)}${col + 1}`,
          };
          break;

        case "seat-double":
          // Create double seat (takes 2 cells)
          if (col + 1 < seatMap.width) {
            const seatId = `${String.fromCharCode(65 + row)}${Math.floor((col + 1) / 2) + 1}`;

            updatedMap.gridData[row][col] = {
              ...cell,
              type: "seat",
              seatType: "D",
              displayRow: String.fromCharCode(65 + row),
              displayCol: (Math.floor((col + 1) / 2) + 1).toString(),
              isSweetbox: true,
              isMasterSweetbox: true,
              linkedSeatCoords: { row, col: col + 1 },
              status: "available",
              id: seatId,
            };

            updatedMap.gridData[row][col + 1] = {
              ...updatedMap.gridData[row][col + 1],
              type: "seat",
              seatType: "d",
              displayRow: String.fromCharCode(65 + row),
              displayCol: (Math.floor((col + 1) / 2) + 1).toString(),
              isSweetbox: true,
              isMasterSweetbox: false,
              linkedSeatCoords: { row, col },
              status: "available",
              id: seatId,
            };
          }
          break;

        case "aisle":
          updatedMap.gridData[row][col] = {
            ...cell,
            type: "aisle",
            row,
            col,
          };
          break;

        case "blocked":
          updatedMap.gridData[row][col] = {
            ...cell,
            type: "blocked",
            row,
            col,
          };
          break;

        case "eraser":
          updatedMap.gridData[row][col] = {
            type: "empty",
            row,
            col,
          };
          break;
      }

      onSeatMapUpdate(updatedMap);
    },
    [seatMap, editorState.currentTool, onSeatMapUpdate],
  );

  // Handle click action for select tool
  const handleSelectClick = useCallback((row: number, col: number) => {
    setIsMouseDown(true);
    setEditorState((prev) => ({
      ...prev,
      isSelecting: true,
      selectionArea: {
        startRow: row,
        startCol: col,
        endRow: row,
        endCol: col,
        isActive: true,
      },
      selectedCells: [],
    }));
  }, []);

  // Handle drag action for select tool
  const handleSelectDrag = useCallback(
    (row: number, col: number) => {
      if (isMouseDown && editorState.isSelecting && editorState.selectionArea) {
        setEditorState((prev) => ({
          ...prev,
          selectionArea: prev.selectionArea
            ? {
                ...prev.selectionArea,
                endRow: row,
                endCol: col,
              }
            : undefined,
        }));
      }
    },
    [isMouseDown, editorState.isSelecting, editorState.selectionArea],
  );

  // Handle cell interaction
  const handleCellInteraction = useCallback(
    (row: number, col: number, action: "click" | "enter" | "leave") => {
      if (editorState.currentTool === "select") {
        if (action === "click") {
          handleSelectClick(row, col);
        } else if (action === "enter") {
          handleSelectDrag(row, col);
        }
      } else {
        // Apply other tools (seat types, aisle, blocked) - support both click and drag
        if (action === "click") {
          applytoolToCell(row, col);
          setIsMouseDown(true);
          setEditorState((prev) => ({ ...prev, isDragging: true }));
        } else if (action === "enter" && isMouseDown && editorState.isDragging) {
          applytoolToCell(row, col);
        }
      }
    },
    [editorState.currentTool, handleSelectClick, handleSelectDrag, isMouseDown, applytoolToCell, editorState.isDragging],
  );

  // Handle mouse up (end selection/dragging)
  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false);

      if (editorState.currentTool === "select" && editorState.isSelecting && editorState.selectionArea) {
        // Finalize selection for select tool
        const selectedCells: CellPosition[] = [];
        const { startRow, startCol, endRow, endCol } = editorState.selectionArea;
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            selectedCells.push({ row: r, col: c });
          }
        }

        setEditorState((prev) => ({
          ...prev,
          isSelecting: false,
          selectedCells,
          selectionArea: undefined,
        }));
      } else {
        // For other tools, just clear the dragging state
        setEditorState((prev) => ({
          ...prev,
          isDragging: false,
        }));
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [editorState.currentTool, editorState.isSelecting, editorState.selectionArea]);

  // Apply tool to selected cells
  const applyToolToSelection = useCallback(() => {
    if (editorState.selectedCells.length === 0 || editorState.currentTool === "select") return;

    const updatedMap = { ...seatMap };
    updatedMap.gridData = seatMap.gridData.map((r) => [...r]);

    editorState.selectedCells.forEach(({ row, col }) => {
      if (row >= 0 && row < seatMap.height && col >= 0 && col < seatMap.width) {
        const cell = updatedMap.gridData[row][col];

        switch (editorState.currentTool) {
          case "seat-standard":
            updatedMap.gridData[row][col] = {
              ...cell,
              type: "seat",
              seatType: "S",
              displayRow: String.fromCharCode(65 + row),
              displayCol: (col + 1).toString(),
              isSweetbox: false,
              isMasterSweetbox: false,
              status: "available",
              id: `${String.fromCharCode(65 + row)}${col + 1}`,
            };
            break;

          case "seat-vip":
            updatedMap.gridData[row][col] = {
              ...cell,
              type: "seat",
              seatType: "V",
              displayRow: String.fromCharCode(65 + row),
              displayCol: (col + 1).toString(),
              isSweetbox: false,
              isMasterSweetbox: false,
              status: "available",
              id: `${String.fromCharCode(65 + row)}${col + 1}`,
            };
            break;

          case "aisle":
            updatedMap.gridData[row][col] = {
              ...cell,
              type: "aisle",
              row,
              col,
            };
            break;

          case "blocked":
            updatedMap.gridData[row][col] = {
              ...cell,
              type: "blocked",
              row,
              col,
            };
            break;

          case "eraser":
            updatedMap.gridData[row][col] = {
              type: "empty",
              row,
              col,
            };
            break;
        }
      }
    });

    onSeatMapUpdate(updatedMap);

    // Clear selection after applying
    setEditorState((prev) => ({
      ...prev,
      selectedCells: [],
    }));
  }, [editorState.selectedCells, editorState.currentTool, seatMap, onSeatMapUpdate]);

  // Auto-apply tool when seat tool is selected and cells are selected
  useEffect(() => {
    if (editorState.selectedCells.length > 0 && editorState.currentTool !== "select" && editorState.currentTool !== "eraser") {
      applyToolToSelection();
    }
  }, [editorState.currentTool, editorState.selectedCells.length, applyToolToSelection]);

  return (
    <div className="space-y-6 bg-base-200 min-h-screen p-4">
      {/* Toolbar */}
      <Card className="shadow-lg border-base-300 bg-base-100">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base-content">
            <Icon icon="material-symbols:build" className="h-5 w-5 text-primary" />
            Editor Tools
          </CardTitle>
          <CardDescription className="text-base-content/70">Select a tool to edit the seat map layout</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={
                  editorState.currentTool === tool.id ? "default" : (tool.variant as "default" | "destructive" | "outline" | "secondary" | "ghost")
                }
                size="sm"
                onClick={() => setEditorState((prev) => ({ ...prev, currentTool: tool.id }))}
                className={`transition-all ${editorState.currentTool === tool.id ? "ring-2 ring-primary/50 shadow-lg" : ""}`}
              >
                <Icon icon={tool.icon} className="mr-2 h-4 w-4" />
                {tool.label}
              </Button>
            ))}
          </div>

          {/* Selection controls */}
          {editorState.selectedCells.length > 0 && (
            <>
              <Separator className="bg-base-300" />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Icon icon="material-symbols:select-all" className="mr-1 h-3 w-3" />
                    {editorState.selectedCells.length} cells selected - Choose a tool to apply
                  </Badge>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Seat Map Grid */}
      <Card className="shadow-lg border-base-300 bg-base-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base-content">
            <Icon icon="material-symbols:event-seat" className="h-5 w-5 text-primary" />
            Seat Map Editor
          </CardTitle>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline" className="border-primary/20 text-primary">
                Current tool: <strong>{tools.find((t) => t.id === editorState.currentTool)?.label}</strong>
              </Badge>
              {(editorState.isSelecting || editorState.isDragging) &&
                isMouseDown &&
                (() => {
                  const badgeProps = getToolStatusBadgeProps();
                  return (
                    <Badge className={badgeProps.className}>
                      <Icon icon={badgeProps.icon} className="mr-1 h-3 w-3" />
                      {badgeProps.text}
                    </Badge>
                  );
                })()}
              {editorState.selectedCells.length > 0 && !editorState.isSelecting && (
                <Badge className="bg-success/10 text-success border-success/20">
                  <Icon icon="material-symbols:check-circle" className="mr-1 h-3 w-3" />
                  {editorState.selectedCells.length} cells selected
                </Badge>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Icon icon="material-symbols:lightbulb" className="h-4 w-4" />
              <div>
                {editorState.currentTool === "select" && (
                  <span>Click and drag to select multiple cells, then choose a tool to apply to selection.</span>
                )}
                {editorState.currentTool === "eraser" && <span>Click or drag to erase cells. Red highlight shows erasing area.</span>}
                {(editorState.currentTool === "seat-standard" ||
                  editorState.currentTool === "seat-vip" ||
                  editorState.currentTool === "seat-double" ||
                  editorState.currentTool === "aisle" ||
                  editorState.currentTool === "blocked") && (
                  <span>Click or drag to place {tools.find((t) => t.id === editorState.currentTool)?.label.toLowerCase()}s.</span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Screen */}
          <div className="text-center">
            <div className="w-full h-3 bg-gradient-to-r from-base-300 via-base-content/20 to-base-300 rounded-full shadow-lg mb-2"></div>
            <p className="text-base-content/60 text-sm font-medium tracking-wider">SCREEN</p>
          </div>

          {/* Grid Container with Selection Overlay */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Grid */}
              <div
                ref={containerRef}
                className={`inline-block border-2 border-base-300 rounded-lg p-4 select-none bg-base-100 shadow-inner ${getCursorStyle()} ${getGridBackgroundClass()}`}
                style={{ userSelect: "none" }}
              >
                {seatMap.gridData.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                      <GridCellEditor
                        key={`${rowIndex}-${colIndex}`}
                        cell={cell}
                        row={rowIndex}
                        col={colIndex}
                        isSelected={isCellSelected(rowIndex, colIndex)}
                        isInSelectionArea={isInSelectionArea(rowIndex, colIndex)}
                        currentTool={editorState.currentTool}
                        onCellInteraction={handleCellInteraction}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Selection size tooltip */}
              {editorState.isSelecting && editorState.selectionArea && isMouseDown && (
                <div className="absolute top-2 left-2 pointer-events-none z-10">
                  <Badge className="bg-primary text-primary-content border-primary/20 shadow-lg">
                    <Icon icon="material-symbols:crop-free" className="mr-1 h-3 w-3" />
                    Selection: {Math.abs(editorState.selectionArea.endCol - editorState.selectionArea.startCol) + 1} ×{" "}
                    {Math.abs(editorState.selectionArea.endRow - editorState.selectionArea.startRow) + 1}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="border-t border-base-300 pt-4">
            <h4 className="text-sm font-medium text-base-content mb-3 flex items-center gap-2">
              <Icon icon="material-symbols:legend-toggle" className="h-4 w-4 text-primary" />
              Legend
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-base-content/70">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-base-300 border border-base-300 rounded"></div>
                <span>Standard Seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-warning border border-warning/20 rounded"></div>
                <span>VIP Seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-secondary border border-secondary/20 rounded"></div>
                <span>Double Seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-base-300 border border-base-300 rounded flex items-center justify-center text-base-content/60">·</div>
                <span>Aisle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-base-content/40 border border-base-content/20 rounded flex items-center justify-center text-base-100">
                  ✕
                </div>
                <span>Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-error border border-error/20 rounded"></div>
                <span>Taken</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-base-100 border border-base-300 rounded ring-2 ring-blue-400"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-base-100 border border-base-300 rounded ring-2 ring-red-400"></div>
                <span>Eraser</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatMapEditor;
