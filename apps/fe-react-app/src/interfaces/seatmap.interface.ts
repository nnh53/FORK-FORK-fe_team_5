// Interface for seat map grid system
export type SeatType = "S" | "V" | "D" | "d"; // Standard, VIP, Double, double-secondary

export interface GridCell {
  type: "empty" | "seat" | "aisle" | "blocked";
  row: number;
  col: number;
  displayRow?: string;
  displayCol?: string;
  seatType?: SeatType;
  isSweetbox?: boolean;
  isMasterSweetbox?: boolean;
  status?: "available" | "taken" | "selected" | "maintenance";
  id?: string;
  // For double seats: indicates if this cell spans multiple columns
  colspan?: number; // Number of columns this cell spans (1 for normal, 2 for double)
  // Mark cells that are "consumed" by a double seat
  isConsumedByDoubleSeat?: boolean; // True if this cell is consumed by an adjacent double seat
  parentDoubleSeatCoords?: { row: number; col: number }; // Points to the main double seat cell
  // For linking seats (especially double seats)
  linkedSeatCoords?: { row: number; col: number }; // Points to the linked seat cell
}

export interface SeatMapGrid {
  width: number; // Number of columns
  height: number; // Number of rows
  gridData: GridCell[][];
  roomId: string;
  roomName: string;
}

// Drag and Drop interfaces
export interface DragItem {
  type: "seat" | "aisle" | "blocked";
  seatType?: "S" | "V" | "D";
  id?: string;
}

export interface DropTarget {
  row: number;
  col: number;
  canDrop: boolean;
}

// Selection interfaces
export interface SelectionArea {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  isActive: boolean;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface MultiSelectState {
  selectedCells: { row: number; col: number }[];
  isSelecting: boolean;
  selectionMode: "single" | "multi" | "rect";
}

// Editor tool types
export type EditorTool = "select" | "seat-standard" | "seat-vip" | "seat-double" | "aisle" | "blocked" | "eraser";

export interface EditorState {
  currentTool: EditorTool;
  isDragging: boolean;
  isSelecting: boolean;
  selectedCells: { row: number; col: number }[];
  selectionArea?: SelectionArea;
  mode: "editor" | "viewer";
}

// Legacy interface for backward compatibility
export interface LegacySeat {
  id: string;
  row: string;
  number: number;
  type: "standard" | "vip" | "double";
  status: "available" | "taken" | "selected";
}

export interface LegacySeatMapData {
  rows: string[];
  seats: LegacySeat[];
}

// Helper type for seat selection
export interface SelectedSeat {
  id: string;
  gridRow: number;
  gridCol: number;
  displayRow: string;
  displayCol: string;
  seatType: "S" | "V" | "D";
  isSweetbox: boolean;
  linkedSeatId?: string;
}
