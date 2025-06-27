import type { GridCell, LegacySeatMapData, SeatMapGrid, SelectedSeat } from "../interfaces/seatmap.interface";

// Type alias for seat types
type BasicSeatType = "S" | "V" | "D";

// Utility function to create a seat map grid
export const createSeatMapGrid = (width: number, height: number, roomId: string, roomName: string): SeatMapGrid => {
  const gridData: GridCell[][] = [];

  for (let row = 0; row < height; row++) {
    const rowData: GridCell[] = [];
    for (let col = 0; col < width; col++) {
      rowData.push({
        type: "empty",
        row,
        col,
      });
    }
    gridData.push(rowData);
  }

  return {
    width,
    height,
    gridData,
    roomId,
    roomName,
  };
};

// Add a seat to the grid
export const addSeatToGrid = (
  grid: SeatMapGrid,
  row: number,
  col: number,
  displayRow: string,
  displayCol: string,
  seatType: BasicSeatType,
  isSweetbox: boolean = false,
  isMasterSweetbox: boolean = false,
  linkedSeatCoords?: { row: number; col: number },
  status: "available" | "taken" | "selected" | "maintenance" = "available",
): SeatMapGrid => {
  const newGrid = { ...grid };
  newGrid.gridData = grid.gridData.map((rowData) => [...rowData]);

  if (row >= 0 && row < grid.height && col >= 0 && col < grid.width) {
    newGrid.gridData[row][col] = {
      type: "seat",
      row,
      col,
      displayRow,
      displayCol,
      seatType,
      isSweetbox,
      isMasterSweetbox,
      linkedSeatCoords,
      status,
      id: `${displayRow}${displayCol}`,
      colspan: seatType === "D" ? 2 : 1, // Double seats span 2 columns
    };
  }

  return newGrid;
};

// Add aisle to the grid
export const addAisleToGrid = (grid: SeatMapGrid, row: number, col: number): SeatMapGrid => {
  const newGrid = { ...grid };
  newGrid.gridData = grid.gridData.map((rowData) => [...rowData]);

  if (row >= 0 && row < grid.height && col >= 0 && col < grid.width) {
    newGrid.gridData[row][col] = {
      type: "aisle",
      row,
      col,
    };
  }

  return newGrid;
};

// Add blocked area to the grid
export const addBlockedToGrid = (grid: SeatMapGrid, row: number, col: number): SeatMapGrid => {
  const newGrid = { ...grid };
  newGrid.gridData = grid.gridData.map((rowData) => [...rowData]);

  if (row >= 0 && row < grid.height && col >= 0 && col < grid.width) {
    newGrid.gridData[row][col] = {
      type: "blocked",
      row,
      col,
    };
  }

  return newGrid;
};

// Helper function to calculate correct seat number considering existing seats
export const calculateSeatNumber = (grid: SeatMapGrid, row: number, col: number): string => {
  let seatNumber = 1;

  // Count actual seats (not consumed cells) from left to right until this column
  for (let c = 0; c < col; c++) {
    const cell = grid.gridData[row][c];
    // Only count actual seat cells, not consumed cells
    if (cell.type === "seat" && !cell.isConsumedByDoubleSeat) {
      seatNumber++;
    }
  }

  return seatNumber.toString();
};

// Helper function to create double seats
export const addDoubleSeatToGrid = (
  grid: SeatMapGrid,
  row: number,
  startCol: number,
  displayRow: string,
  displayCol: string,
  status: "available" | "taken" | "selected" | "maintenance" = "available",
): SeatMapGrid => {
  // Place main seat cell - spans 2 columns
  const newGrid = addSeatToGrid(grid, row, startCol, displayRow, displayCol, "D", true, true, { row, col: startCol + 1 }, status);

  // Mark right cell as consumed by the double seat
  newGrid.gridData[row][startCol + 1] = {
    type: "empty", // Keep as empty type but consumed
    row,
    col: startCol + 1,
    isConsumedByDoubleSeat: true,
    parentDoubleSeatCoords: { row, col: startCol },
  };

  return newGrid;
};

// Convert legacy seat map to grid format
export const convertLegacyToGrid = (legacyData: LegacySeatMapData, roomId: string, roomName: string): SeatMapGrid => {
  // Calculate grid dimensions
  const maxRow = legacyData.rows.length;
  const maxCol = Math.max(...legacyData.seats.map((seat) => seat.number));

  let grid = createSeatMapGrid(maxCol + 2, maxRow, roomId, roomName); // +2 for aisles

  // Add seats to grid
  legacyData.seats.forEach((seat) => {
    const rowIndex = legacyData.rows.indexOf(seat.row);
    const colIndex = seat.number - 1;

    const getSeatType = (): BasicSeatType => {
      switch (seat.type) {
        case "vip":
          return "V";
        case "double":
          return "D";
        default:
          return "S";
      }
    };

    const seatType = getSeatType();
    const isSweetbox = seat.type === "double";

    grid = addSeatToGrid(
      grid,
      rowIndex,
      colIndex + 1, // +1 to leave space for aisle
      seat.row,
      seat.number.toString(),
      seatType,
      isSweetbox,
      true,
      undefined,
      seat.status === "taken" ? "taken" : "available",
    );
  });

  // Add aisles
  for (let row = 0; row < maxRow; row++) {
    grid = addAisleToGrid(grid, row, 0);
    grid = addAisleToGrid(grid, row, maxCol + 1);
  }

  return grid;
};

// Helper function to select/deselect seats - simplified version
export const toggleSeatSelection = (selectedSeats: SelectedSeat[], cell: GridCell): SelectedSeat[] => {
  if (cell.type !== "seat" || !cell.displayRow || !cell.displayCol) {
    return selectedSeats;
  }

  const seatId = `${cell.displayRow}${cell.displayCol}`;
  const existingIndex = selectedSeats.findIndex((seat) => seat.id === seatId);

  if (existingIndex >= 0) {
    // Deselect seat
    return selectedSeats.filter((seat) => seat.id !== seatId);
  } else {
    // Select seat
    const newSeat: SelectedSeat = {
      id: seatId,
      gridRow: cell.row,
      gridCol: cell.col,
      displayRow: cell.displayRow,
      displayCol: cell.displayCol,
      seatType: cell.seatType as BasicSeatType,
      isSweetbox: cell.isSweetbox || false,
    };

    return [...selectedSeats, newSeat];
  }
};

// Sample seat map generator
export const createSampleSeatMap = (): SeatMapGrid => {
  const grid = createSeatMapGrid(20, 10, "P1", "Phòng chiếu 1");

  const rows = ["J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
  const takenSeats = new Set(["J3", "J9", "J13", "I5", "I15", "H1", "H2", "G8", "G10", "F4"]);

  // Add VIP rows (J, I, H)
  for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
    addSeatsToRow(grid, rowIndex, rows[rowIndex], "V", 18, takenSeats);
    addAislesToRow(grid, rowIndex, [0, 6, 13, 19]);
  }

  // Add standard rows (G-C)
  for (let rowIndex = 3; rowIndex < 8; rowIndex++) {
    addSeatsToRow(grid, rowIndex, rows[rowIndex], "S", 18, takenSeats);
    addAislesToRow(grid, rowIndex, [0, 6, 13, 19]);
  }

  // Add row B with fewer seats
  addSeatsToRow(grid, 8, "B", "S", 16, takenSeats);
  addAislesToRow(grid, 8, [0, 17]);

  // Add row A with double seats
  addDoubleSeatsToRow(grid, 9, "A", 3, takenSeats);

  return grid;
};

// Helper functions for createSampleSeatMap
const addSeatsToRow = (
  grid: SeatMapGrid,
  rowIndex: number,
  displayRow: string,
  seatType: BasicSeatType,
  count: number,
  takenSeats: Set<string>,
): void => {
  for (let seatNum = 1; seatNum <= count; seatNum++) {
    const seatId = `${displayRow}${seatNum}`;
    const status = takenSeats.has(seatId) ? "taken" : "available";

    addSeatToGrid(grid, rowIndex, seatNum, displayRow, seatNum.toString(), seatType, false, false, undefined, status);
  }
};

const addAislesToRow = (grid: SeatMapGrid, rowIndex: number, positions: number[]): void => {
  positions.forEach((pos) => {
    addAisleToGrid(grid, rowIndex, pos);
  });
};

const addDoubleSeatsToRow = (grid: SeatMapGrid, rowIndex: number, displayRow: string, count: number, takenSeats: Set<string>): void => {
  for (let seatNum = 1; seatNum <= count; seatNum++) {
    const seatId = `${displayRow}${seatNum}`;
    const status = takenSeats.has(seatId) ? "taken" : "available";

    addDoubleSeatToGrid(grid, rowIndex, seatNum * 2 - 1, displayRow, seatNum.toString(), status);
  }
};

// Apply tool to multiple cells for editor
// Helper function to apply single seat tool
const applySingleTool = (
  updatedMap: SeatMapGrid,
  row: number,
  col: number,
  tool: "select" | "seat-standard" | "seat-vip" | "seat-double" | "aisle" | "blocked" | "eraser",
): void => {
  const cell = updatedMap.gridData[row][col];

  switch (tool) {
    case "seat-standard":
      if (cell.type === "empty") {
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
          colspan: 1,
        };
      }
      break;

    case "seat-vip":
      if (cell.type === "empty") {
        updatedMap.gridData[row][col] = {
          ...cell,
          type: "seat",
          seatType: "V",
          displayRow: String.fromCharCode(65 + row),
          displayCol: (col + 1).toString(),
          isSweetbox: true,
          isMasterSweetbox: false,
          status: "available",
          id: `${String.fromCharCode(65 + row)}${col + 1}`,
          colspan: 1,
        };
      }
      break;

    case "seat-double":
      applyDoubleSeatTool(updatedMap, row, col);
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
      applyEraserTool(updatedMap, row, col);
      break;
  }
};

// Helper function to apply double seat tool
const applyDoubleSeatTool = (updatedMap: SeatMapGrid, row: number, col: number): void => {
  const cell = updatedMap.gridData[row][col];

  // For double seat, only place if both positions are empty and adjacent
  if (col + 1 < updatedMap.width && cell.type === "empty" && updatedMap.gridData[row][col + 1].type === "empty") {
    const seatNumber = Math.floor((col + col + 1) / 2) + 1;
    const seatId = `${String.fromCharCode(65 + row)}${seatNumber}`;

    // Place main seat (left) - spans 2 columns visually
    updatedMap.gridData[row][col] = {
      ...cell,
      type: "seat",
      seatType: "D",
      displayRow: String.fromCharCode(65 + row),
      displayCol: seatNumber.toString(),
      isSweetbox: true,
      isMasterSweetbox: true,
      status: "available",
      id: seatId,
      linkedSeatCoords: { row, col: col + 1 },
      colspan: 2, // This seat spans 2 columns
    };

    // Mark right cell as consumed by the double seat (hidden but occupies space)
    updatedMap.gridData[row][col + 1] = {
      type: "empty", // Keep as empty type but consumed
      row,
      col: col + 1,
      isConsumedByDoubleSeat: true,
      parentDoubleSeatCoords: { row, col },
    };
  }
};

// Helper function to create clean empty cell
const createCleanEmptyCell = (row: number, col: number): GridCell => ({
  type: "empty",
  row,
  col,
  // Explicitly set all optional properties to undefined to ensure clean state
  seatType: undefined,
  displayRow: undefined,
  displayCol: undefined,
  isSweetbox: undefined,
  isMasterSweetbox: undefined,
  status: undefined,
  id: undefined,
  colspan: undefined,
  isConsumedByDoubleSeat: undefined,
  parentDoubleSeatCoords: undefined,
  linkedSeatCoords: undefined,
});

// Helper function to apply eraser tool
const applyEraserTool = (updatedMap: SeatMapGrid, row: number, col: number): void => {
  const cell = updatedMap.gridData[row][col];

  if (cell.type === "seat" && cell.seatType === "D") {
    // Delete both parts of double seat (main cell and consumed cell)
    updatedMap.gridData[row][col] = createCleanEmptyCell(row, col);

    // Delete linked part if exists
    if (cell.linkedSeatCoords) {
      const linkedRow = cell.linkedSeatCoords.row;
      const linkedCol = cell.linkedSeatCoords.col;
      if (linkedRow >= 0 && linkedRow < updatedMap.height && linkedCol >= 0 && linkedCol < updatedMap.width) {
        updatedMap.gridData[linkedRow][linkedCol] = createCleanEmptyCell(linkedRow, linkedCol);
      }
    }
  } else if (cell.isConsumedByDoubleSeat && cell.parentDoubleSeatCoords) {
    // If this is a consumed cell, delete both the parent and this cell
    const parentRow = cell.parentDoubleSeatCoords.row;
    const parentCol = cell.parentDoubleSeatCoords.col;

    // Delete parent double seat
    if (parentRow >= 0 && parentRow < updatedMap.height && parentCol >= 0 && parentCol < updatedMap.width) {
      updatedMap.gridData[parentRow][parentCol] = createCleanEmptyCell(parentRow, parentCol);
    }

    // Delete this consumed cell
    updatedMap.gridData[row][col] = createCleanEmptyCell(row, col);
  } else {
    // Regular delete
    updatedMap.gridData[row][col] = createCleanEmptyCell(row, col);
  }
};

export const applySeatMapTools = (
  seatMap: SeatMapGrid,
  cellPositions: { row: number; col: number }[],
  tool: "select" | "seat-standard" | "seat-vip" | "seat-double" | "aisle" | "blocked" | "eraser",
): SeatMapGrid => {
  const updatedMap = { ...seatMap };
  updatedMap.gridData = seatMap.gridData.map((row) => [...row]);

  cellPositions.forEach(({ row, col }) => {
    if (row >= 0 && row < seatMap.height && col >= 0 && col < seatMap.width) {
      applySingleTool(updatedMap, row, col, tool);
    }
  });

  return updatedMap;
};

// Calculate total capacity (number of seats) from a seat map
export const calculateCapacityFromSeatMap = (seatMap: SeatMapGrid | null): number => {
  if (!seatMap) return 0;

  let totalSeats = 0;

  for (let row = 0; row < seatMap.height; row++) {
    for (let col = 0; col < seatMap.width; col++) {
      const cell = seatMap.gridData[row][col];

      // Count actual seats (not consumed cells or other types)
      if (cell.type === "seat" && !cell.isConsumedByDoubleSeat) {
        totalSeats++;
      }
    }
  }

  return totalSeats;
};
