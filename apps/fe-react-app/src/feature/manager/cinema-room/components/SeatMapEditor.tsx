import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Seat, SeatMap } from "@/interfaces/seat.interface";
import { Icon } from "@iconify/react";
import React, { useMemo, useState } from "react";

/**
 * SeatMapEditor Component
 *
 * CURRENT API STRUCTURE:
 * - Row: Numeric (1, 2, 3, ...)
 * - Column: Letter (A, B, C, ...)
 *
 * BACKUP CODE AVAILABLE:
 * This file contains backup code for alternative API structure where:
 * - Row: Letter (A, B, C, ...)
 * - Column: Numeric (1, 2, 3, ...)
 *
 * Search for "BACKUP" comments throughout this file to find alternative implementations.
 * See API_STRUCTURE_GUIDE.md for complete switching instructions.
 */

interface SeatMapEditorProps {
  seatMap: SeatMap | null;
  onSeatMapChange?: (seatMap: SeatMap) => void;
  readonly?: boolean;
  width?: number;
  length?: number;
}

type EditorTool = "seat-standard" | "seat-vip" | "seat-double" | "aisle" | "blocked" | "eraser";

const SeatMapEditor: React.FC<SeatMapEditorProps> = ({ seatMap, onSeatMapChange, width = 10, length = 10, readonly = false }) => {
  const [selectedTool, setSelectedTool] = useState<EditorTool>("seat-standard");
  const [currentSeatMap, setCurrentSeatMap] = useState<SeatMap | null>(seatMap);

  // Update local state when props change
  React.useEffect(() => {
    setCurrentSeatMap(seatMap);
  }, [seatMap]);

  // Helper functions for seat operations
  const findAdjacentSeat = (seatMap: SeatMap, seat: Seat, direction: "next" | "prev"): [Seat | null, number] => {
    // Current API: row is number, column is letter
    const currentColChar = seat.column.charCodeAt(0);
    const targetColChar = direction === "next" ? currentColChar + 1 : currentColChar - 1;
    const targetColumn = String.fromCharCode(targetColChar);

    const adjacentSeat = seatMap.gridData.find((s) => s.row === seat.row && s.column === targetColumn);

    // BACKUP: If API returns row as letter, column as number (uncomment below and comment above)
    // const currentCol = parseInt(seat.column);
    // const targetCol = direction === "next" ? currentCol + 1 : currentCol - 1;
    // const adjacentSeat = seatMap.gridData.find((s) => s.row === seat.row && parseInt(s.column) === targetCol);

    if (adjacentSeat) {
      const index = seatMap.gridData.findIndex((s) => s.id === adjacentSeat.id);
      return [adjacentSeat, index];
    }

    return [null, -1];
  };

  const handleCoupleSeatCreation = (newSeatMap: SeatMap, seat: Seat) => {
    const [nextSeat, nextIndex] = findAdjacentSeat(newSeatMap, seat, "next");
    if (nextSeat && nextIndex !== -1) {
      const updatedNextSeat = { ...nextSeat };
      updatedNextSeat.type = { ...nextSeat.type, name: "COUPLE" };
      newSeatMap.gridData[nextIndex] = updatedNextSeat;
    }
  };

  // Helper function to find the actual couple partner of a seat
  const findCouplePartner = (seatMap: SeatMap, seat: Seat): [Seat | null, number] => {
    if (seat.type.name !== "COUPLE") return [null, -1];

    const currentColChar = seat.column.charCodeAt(0);

    // Logic: Ghế đôi luôn được tạo theo cặp (A,B), (C,D), (E,F), etc.
    // Ghế có cột chẵn (A, C, E, ...) sẽ cặp với ghế cột lẻ bên phải (B, D, F, ...)
    // Ghế có cột lẻ (B, D, F, ...) sẽ cặp với ghế cột chẵn bên trái (A, C, E, ...)

    let partnerColChar: number;
    if ((currentColChar - 65) % 2 === 0) {
      // Ghế cột chẵn (A=0, C=2, E=4, ...) -> partner ở bên phải
      partnerColChar = currentColChar + 1;
    } else {
      // Ghế cột lẻ (B=1, D=3, F=5, ...) -> partner ở bên trái
      partnerColChar = currentColChar - 1;
    }

    const partnerColumn = String.fromCharCode(partnerColChar);

    // Tìm ghế partner theo cột đã tính toán
    const partner = seatMap.gridData.find((s) => s.row === seat.row && s.column === partnerColumn && s.type.name === "COUPLE");

    if (partner) {
      const partnerIndex = seatMap.gridData.findIndex((s) => s.id === partner.id);
      return [partner, partnerIndex];
    }

    return [null, -1];
  };

  const handleCoupleErasure = (newSeatMap: SeatMap, seat: Seat) => {
    // Find the actual partner of this couple seat
    const [partner, partnerIndex] = findCouplePartner(newSeatMap, seat);

    if (partner && partnerIndex !== -1) {
      // Convert the partner to REGULAR
      const updatedPartner = { ...partner };
      updatedPartner.type = { ...partner.type, name: "REGULAR" };
      newSeatMap.gridData[partnerIndex] = updatedPartner;
    }
  };

  // Helper function to check if a seat can be converted to couple
  const canCreateCouple = (seatMap: SeatMap, seat: Seat): boolean => {
    const currentColChar = seat.column.charCodeAt(0);

    // Chỉ cho phép tạo ghế đôi từ ghế có cột chẵn (A, C, E, ... để đảm bảo luôn tạo cặp (A,B), (C,D), etc.)
    if ((currentColChar - 65) % 2 !== 0) {
      return false; // Ghế cột lẻ (B, D, F, ...) không thể làm điểm bắt đầu ghế đôi
    }

    // Check if next seat exists and is available for coupling
    const nextColumn = String.fromCharCode(currentColChar + 1);
    const nextSeat = seatMap.gridData.find((s) => s.row === seat.row && s.column === nextColumn);

    if (!nextSeat) return false;

    // Can create couple if:
    // 1. Next seat exists
    // 2. Next seat is not aisle or blocked
    // 3. Next seat is not already part of another couple pair
    const nextSeatCanBePartOfCouple = nextSeat.type.name !== "AISLE" && nextSeat.type.name !== "BLOCKED";

    // Check if next seat is already part of a couple pair using the new logic
    const [nextSeatPartner] = findCouplePartner(seatMap, nextSeat);
    const nextSeatNotInCouple = !nextSeatPartner;

    return nextSeatCanBePartOfCouple && nextSeatNotInCouple;
  };

  // Helper function to convert both seats in a couple to the same type
  const convertCoupleTo = (newSeatMap: SeatMap, seat: Seat, newType: "REGULAR" | "VIP" | "AISLE" | "BLOCKED") => {
    if (seat.type.name === "COUPLE") {
      // Find the partner and convert both seats
      const [partner, partnerIndex] = findCouplePartner(newSeatMap, seat);

      if (partner && partnerIndex !== -1) {
        // Convert partner to new type
        const updatedPartner = { ...partner };
        updatedPartner.type = { ...partner.type, name: newType };
        newSeatMap.gridData[partnerIndex] = updatedPartner;
      }

      // Convert current seat to new type
      seat.type = { ...seat.type, name: newType };
    } else {
      // Not a couple seat, just convert normally
      seat.type = { ...seat.type, name: newType };
    }
  };

  // Helper function to handle double seat creation logic
  const handleDoubleSeatCreation = (newSeatMap: SeatMap, seat: Seat): boolean => {
    // First break any existing couple relationship for this seat
    if (seat.type.name === "COUPLE") {
      handleCoupleErasure(newSeatMap, seat);
    }

    // Check if we can create a couple seat
    if (!canCreateCouple(newSeatMap, seat)) {
      const currentColChar = seat.column.charCodeAt(0);
      if ((currentColChar - 65) % 2 !== 0) {
        alert(`Không thể tạo ghế đôi từ ghế ${seat.row}${seat.column}. Chỉ có thể tạo ghế đôi từ ghế có cột chẵn (A, C, E, ...).`);
      } else {
        alert(`Không thể tạo ghế đôi tại vị trí ${seat.row}${seat.column}. Ghế liền kề không khả dụng hoặc đã được sử dụng.`);
      }
      return false;
    }

    // Break couple relationship for the next seat if it's already part of a couple
    const nextColumn = String.fromCharCode(seat.column.charCodeAt(0) + 1);
    const nextSeat = newSeatMap.gridData.find((s) => s.row === seat.row && s.column === nextColumn);

    if (nextSeat && nextSeat.type.name === "COUPLE") {
      // Use the proper erasure logic
      handleCoupleErasure(newSeatMap, nextSeat);
    }

    seat.type = { ...seat.type, name: "COUPLE" };
    handleCoupleSeatCreation(newSeatMap, seat);
    return true;
  };

  // Handle seat click to change seat type
  const handleSeatClick = (seatId: number) => {
    if (readonly || !currentSeatMap) return;

    const newSeatMap = { ...currentSeatMap };
    const seatIndex = newSeatMap.gridData.findIndex((s) => s.id === seatId);

    if (seatIndex === -1) return;

    const seat = { ...newSeatMap.gridData[seatIndex] };

    // Change seat type based on selected tool
    switch (selectedTool) {
      case "seat-standard":
        convertCoupleTo(newSeatMap, seat, "REGULAR");
        break;
      case "seat-vip":
        convertCoupleTo(newSeatMap, seat, "VIP");
        break;
      case "seat-double": {
        if (!handleDoubleSeatCreation(newSeatMap, seat)) {
          return; // Early return if double seat creation failed
        }
        break;
      }
      case "aisle":
        convertCoupleTo(newSeatMap, seat, "AISLE");
        break;
      case "blocked":
        convertCoupleTo(newSeatMap, seat, "BLOCKED");
        break;
      case "eraser": {
        convertCoupleTo(newSeatMap, seat, "REGULAR");
        break;
      }
      default:
        return;
    }

    newSeatMap.gridData[seatIndex] = seat;
    setCurrentSeatMap(newSeatMap);

    if (onSeatMapChange) {
      onSeatMapChange(newSeatMap);
    }
  };

  // Function to get seat color based on seat type
  const getSeatColor = (seat: Seat) => {
    switch (seat.type.name) {
      case "REGULAR":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "VIP":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "COUPLE":
        return "bg-purple-100 border-purple-300 text-purple-800";
      case "AISLE":
        return "bg-gray-50 border-gray-200 text-gray-500";
      case "BLOCKED":
        return "bg-red-100 border-red-300 text-red-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
    }
  };

  // Create render items for grid display with proper double seat handling
  // Helper function to get display number for seats (consecutive numbering per row)
  const getDisplayNumber = (seat: Seat) => {
    if (!currentSeatMap || seat.type.name === "AISLE" || seat.type.name === "BLOCKED") {
      return null;
    }

    // Get all seats in the same row (excluding AISLE and BLOCKED)
    const rowSeats = currentSeatMap.gridData
      .filter((s) => s.row === seat.row && s.type.name !== "AISLE" && s.type.name !== "BLOCKED")
      .sort((a, b) => a.column.charCodeAt(0) - b.column.charCodeAt(0)); // Sort by column letter

    return calculateDisplayPosition(seat, rowSeats);
  };

  // Helper function to calculate display position
  const calculateDisplayPosition = (targetSeat: Seat, rowSeats: Seat[]) => {
    let displayNumber = 1;
    let skipNext = false;

    for (let i = 0; i < rowSeats.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const currentSeat = rowSeats[i];

      if (currentSeat.id === targetSeat.id) {
        return displayNumber;
      }

      // Handle couple seat logic
      skipNext = handleCoupleSeatLogic(currentSeat, rowSeats, i, targetSeat);

      if (!skipNext || (skipNext && rowSeats[i + 1]?.id !== targetSeat.id)) {
        displayNumber++;
      }
    }

    return displayNumber;
  };

  // Helper function to handle couple seat logic
  const handleCoupleSeatLogic = (currentSeat: Seat, rowSeats: Seat[], index: number, targetSeat: Seat) => {
    if (currentSeat.type.name !== "COUPLE") return false;

    const nextSeat = rowSeats[index + 1];
    const isCouplePair =
      nextSeat &&
      nextSeat.type.name === "COUPLE" &&
      nextSeat.row === currentSeat.row &&
      nextSeat.column.charCodeAt(0) === currentSeat.column.charCodeAt(0) + 1;

    if (isCouplePair && nextSeat.id === targetSeat.id) {
      // If we're looking for the second seat of the couple, it should have the same display number
      return false;
    }

    return isCouplePair;
  };

  // Calculate actual dimensions based on seat data
  const actualDimensions = useMemo(() => {
    if (!currentSeatMap || currentSeatMap.gridData.length === 0) {
      return { actualWidth: width, actualHeight: length };
    }

    const seats = currentSeatMap.gridData;
    let maxRow = 0;
    let maxCol = 0;

    seats.forEach((seat) => {
      // API structure: row is numeric (1,2,3...), column is letter (A,B,C...)
      const rowIndex = parseInt(seat.row) - 1; // 1=0, 2=1, etc.
      const colIndex = seat.column.charCodeAt(0) - 65; // A=0, B=1, etc.

      // BACKUP: If API returns row as letter, column as number (uncomment below and comment above)
      // const rowIndex = seat.row.charCodeAt(0) - 65; // A=0, B=1, etc.
      // const colIndex = parseInt(seat.column) - 1; // 1=0, 2=1, etc.

      maxRow = Math.max(maxRow, rowIndex);
      maxCol = Math.max(maxCol, colIndex);
    });

    return {
      actualWidth: Math.max(maxCol + 1, width),
      actualHeight: Math.max(maxRow + 1, length),
    };
  }, [currentSeatMap, width, length]);

  const renderItems = useMemo(() => {
    if (!currentSeatMap) return [];

    // Helper functions for grid creation
    const createSeatMap = (seats: Seat[]) => {
      const seatMap = new Map<string, Seat>();
      seats.forEach((seat) => {
        // API structure: row is numeric, column is letter
        const key = `${seat.row}-${seat.column}`;
        // BACKUP: If API returns row as letter, column as number (uncomment below and comment above)
        // const key = `${seat.row}-${seat.column}`;
        seatMap.set(key, seat);
      });
      return seatMap;
    };

    const isDoubleSeatStart = (seat: Seat, nextSeat: Seat | undefined) => {
      // For API structure: check if column letters are consecutive (A->B, B->C, etc.)
      return (
        seat.type.name === "COUPLE" && nextSeat && nextSeat.type.name === "COUPLE" && seat.column.charCodeAt(0) === nextSeat.column.charCodeAt(0) - 1
      );

      // BACKUP: If API returns row as letter, column as number (uncomment below and comment above)
      // return seat.type.name === "COUPLE" && nextSeat && nextSeat.type.name === "COUPLE" && parseInt(seat.column) % 2 === 1;
    };

    const createGridItem = (
      seat: Seat | undefined,
      rowIndex: number,
      colIndex: number,
      seatMap: Map<string, Seat>,
      processedPositions: Set<string>,
    ) => {
      const rowNumber = (rowIndex + 1).toString();
      const colLetter = String.fromCharCode(65 + colIndex);
      const key = `${rowNumber}-${colLetter}`;

      // BACKUP: If API returns row as letter, column as number (uncomment below and comment above)
      // const rowLetter = String.fromCharCode(65 + rowIndex);
      // const colNumber = (colIndex + 1).toString();
      // const key = `${rowLetter}-${colNumber}`;

      if (!seat) {
        return {
          type: "empty",
          seat: null,
          gridRow: rowIndex + 1,
          gridColumn: colIndex + 1,
          span: 1,
        };
      }

      // Check for double seat (consecutive columns)
      const nextColLetter = String.fromCharCode(65 + colIndex + 1);
      // BACKUP: If API returns row as letter, column as number (uncomment below and comment above)
      // const nextColNumber = (colIndex + 2).toString();
      const nextKey = `${rowNumber}-${nextColLetter}`;
      // BACKUP: If API returns row as letter, column as number (uncomment below and comment above)
      // const nextKey = `${rowLetter}-${nextColNumber}`;
      const nextSeat = seatMap.get(nextKey);

      if (isDoubleSeatStart(seat, nextSeat)) {
        processedPositions.add(key);
        processedPositions.add(nextKey);
        return {
          type: "double",
          seat: seat,
          gridRow: rowIndex + 1,
          gridColumn: colIndex + 1,
          span: 2,
        };
      }

      if (seat.type.name === "COUPLE" && colIndex > 0) {
        // This might be the second seat of a couple, check if previous was processed
        const prevColLetter = String.fromCharCode(65 + colIndex - 1);
        const prevKey = `${rowNumber}-${prevColLetter}`;
        // BACKUP: If API returns row as letter, column as number (uncomment below and comment above)
        // if (seat.type.name === "COUPLE" && parseInt(seat.column) % 2 === 0) {
        //   const prevColNumber = (colIndex).toString();
        //   const prevKey = `${rowLetter}-${prevColNumber}`;
        if (processedPositions.has(prevKey)) {
          processedPositions.add(key);
          return null; // Skip second seat of couple pair
        }
      }

      // Regular single seat
      processedPositions.add(key);
      return {
        type: "single",
        seat: seat,
        gridRow: rowIndex + 1,
        gridColumn: colIndex + 1,
        span: 1,
      };
    };

    const seats = currentSeatMap.gridData;
    const gridItems = [];
    const seatMap = createSeatMap(seats);
    const processedPositions = new Set<string>();

    for (let rowIndex = 0; rowIndex < actualDimensions.actualHeight; rowIndex++) {
      const rowNumber = (rowIndex + 1).toString();
      // BACKUP: If API returns row as letter, column as number (uncomment below and comment above)
      // const rowLetter = String.fromCharCode(65 + rowIndex);

      for (let colIndex = 0; colIndex < actualDimensions.actualWidth; colIndex++) {
        const colLetter = String.fromCharCode(65 + colIndex);
        const key = `${rowNumber}-${colLetter}`;
        // BACKUP: If API returns row as letter, column as number (uncomment below and comment above)
        // const colNumber = (colIndex + 1).toString();
        // const key = `${rowLetter}-${colNumber}`;

        if (processedPositions.has(key)) {
          continue;
        }

        const seat = seatMap.get(key);
        const gridItem = createGridItem(seat, rowIndex, colIndex, seatMap, processedPositions);

        if (gridItem) {
          gridItems.push(gridItem);
        }
      }
    }

    return gridItems;
  }, [currentSeatMap, actualDimensions]);

  const tools = [
    { id: "seat-standard" as const, label: "Ghế thường", icon: "mdi:seat", color: "blue" },
    { id: "seat-vip" as const, label: "Ghế VIP", icon: "mdi:seat-recline-extra", color: "yellow" },
    { id: "seat-double" as const, label: "Ghế đôi", icon: "mdi:seat-individual-suite", color: "purple" },
    { id: "aisle" as const, label: "Lối đi", icon: "mdi:walk", color: "gray" },
    { id: "blocked" as const, label: "Chặn", icon: "mdi:close", color: "red" },
    { id: "eraser" as const, label: "Xóa", icon: "mdi:eraser", color: "orange" },
  ];

  const seatStats = useMemo(() => {
    if (!currentSeatMap) return { total: 0, standard: 0, vip: 0, double: 0, aisle: 0, blocked: 0 };

    let total = 0,
      standard = 0,
      vip = 0,
      double = 0,
      aisle = 0,
      blocked = 0;

    currentSeatMap.gridData.forEach((seat: Seat) => {
      total++;
      switch (seat.type.name) {
        case "REGULAR":
          standard++;
          break;
        case "VIP":
          vip++;
          break;
        case "COUPLE":
          double++;
          break;
        case "AISLE":
          aisle++;
          break;
        case "BLOCKED":
          blocked++;
          break;
      }
    });

    return { total, standard, vip, double, aisle, blocked };
  }, [currentSeatMap]);

  if (!currentSeatMap) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Icon icon="mdi:seat" className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">Không có dữ liệu sơ đồ ghế</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tool Selection */}
      {!readonly && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon icon="mdi:tools" className="w-5 h-5" />
              Công cụ chỉnh sửa
              <span className="text-sm font-normal text-gray-500">(Đang chọn: {tools.find((t) => t.id === selectedTool)?.label})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 p-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Hướng dẫn:</strong> Chọn công cụ bên dưới, sau đó click vào ghế để thay đổi loại ghế.
              </p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool(tool.id)}
                  className="h-auto p-3 flex flex-col items-center gap-1"
                >
                  <Icon icon={tool.icon} className="w-5 h-5" />
                  <span className="text-xs">{tool.label}</span>
                </Button>
              ))}
            </div>

            {/* Save instruction */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800">
                <Icon icon="mdi:information" className="w-4 h-4" />
                <p className="text-sm">
                  <strong>Thông báo:</strong> Thay đổi sẽ được tự động phát hiện. Nhấn nút "Lưu thay đổi" ở trên để lưu vào hệ thống.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seat Statistics */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{seatStats.total}</div>
              <div className="text-sm text-gray-600">Tổng ô</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{seatStats.standard}</div>
              <div className="text-sm text-gray-600">Ghế thường</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{seatStats.vip}</div>
              <div className="text-sm text-gray-600">Ghế VIP</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{seatStats.double}</div>
              <div className="text-sm text-gray-600">Ghế đôi</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{seatStats.aisle}</div>
              <div className="text-sm text-gray-600">Lối đi</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{seatStats.blocked}</div>
              <div className="text-sm text-gray-600">Chặn</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Map Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <Icon icon="mdi:view-grid" className="w-5 h-5" />
            Sơ đồ ghế - Phòng {currentSeatMap.roomId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-gray-800 text-white text-center rounded">
            <Icon icon="mdi:movie" className="w-6 h-6 mx-auto mb-1" />
            <div className="text-sm font-medium">MÀN HÌNH</div>
          </div>

          {/* Grid with row labels */}
          <div className="overflow-auto">
            <div className="flex justify-center">
              <div className="flex">
                {/* Row labels (1, 2, 3...) */}
                {/* BACKUP: If API returns row as letter, column as number (uncomment below and comment above) */}
                {/* Row labels (A, B, C...) */}
                <div className="flex flex-col mr-2">
                  {Array.from({ length: actualDimensions.actualHeight }, (_, i) => (
                    <div
                      key={i}
                      className="w-6 flex items-center justify-center text-sm font-medium text-gray-500"
                      style={{
                        height: "32px", // Match seat height exactly
                        marginBottom: i < actualDimensions.actualHeight - 1 ? "4px" : "0",
                      }}
                    >
                      {i + 1}
                      {/* BACKUP for API reverse: String.fromCharCode(65 + i) */}
                    </div>
                  ))}
                </div>{" "}
                {/* Seat grid */}
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${actualDimensions.actualWidth}, 32px)`,
                    gridTemplateRows: `repeat(${actualDimensions.actualHeight}, 32px)`,
                    gap: "4px",
                    maxWidth: `${actualDimensions.actualWidth * 32 + (actualDimensions.actualWidth - 1) * 4}px`,
                  }}
                >
                  {/* Using render items for proper double seat handling */}
                  {renderItems.map((item, index) => {
                    // Handle empty cells
                    if (item.type === "empty") {
                      return (
                        <div
                          key={`empty-${item.gridRow}-${item.gridColumn}`}
                          style={{
                            gridRow: item.gridRow,
                            gridColumn: item.gridColumn,
                            height: "32px",
                            width: "32px",
                          }}
                        />
                      );
                    }

                    // Handle seats with data
                    if (!item.seat) return null;

                    if (item.type === "double") {
                      return (
                        <div
                          key={item.seat.id || `double-${index}`}
                          className={`border rounded flex items-center justify-center text-xs cursor-pointer hover:opacity-80 ${getSeatColor(item.seat)}`}
                          onClick={() => handleSeatClick(item.seat.id)}
                          style={{
                            gridRow: item.gridRow,
                            gridColumn: `${item.gridColumn} / span 2`,
                            height: "32px",
                            width: "auto",
                          }}
                        >
                          {getDisplayNumber(item.seat) || `${item.seat.row}${item.seat.column}`}
                        </div>
                      );
                    } else {
                      // Render special content for aisle and blocked seats
                      let content: React.ReactNode = getDisplayNumber(item.seat) || `${item.seat.row}${item.seat.column}`;
                      if (item.seat.type.name === "AISLE") {
                        content = <Icon icon="mdi:walk" className="w-3 h-3" />;
                      } else if (item.seat.type.name === "BLOCKED") {
                        content = <Icon icon="mdi:close" className="w-3 h-3" />;
                      }

                      return (
                        <div
                          key={item.seat.id || `single-${index}`}
                          className={`border rounded flex items-center justify-center text-xs cursor-pointer hover:opacity-80 ${getSeatColor(item.seat)}`}
                          onClick={() => handleSeatClick(item.seat.id)}
                          style={{
                            gridRow: item.gridRow,
                            gridColumn: item.gridColumn,
                            height: "32px",
                            width: "32px",
                          }}
                        >
                          {content}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Column labels (A, B, C...) */}
          {/* BACKUP: If API returns row as letter, column as number (uncomment below and comment above) */}
          {/* Column labels (1, 2, 3...) */}
          <div className="mt-4 flex justify-center">
            <div className="flex">
              {/* Space for row labels */}
              <div className="w-8"></div>

              {/* Column letters */}
              {/* BACKUP: If API returns row as letter, column as number (uncomment below and comment above) */}
              {/* Column numbers */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${actualDimensions.actualWidth}, 1fr)`,
                  gap: "4px",
                  maxWidth: `${actualDimensions.actualWidth * 32 + (actualDimensions.actualWidth - 1) * 4}px`,
                }}
              >
                {Array.from({ length: actualDimensions.actualWidth }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center text-sm font-medium text-gray-500"
                    style={{
                      width: "32px", // Match seat width exactly
                      height: "24px",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                    {/* BACKUP for API reverse: i + 1 */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Size info */}
          <div className="mt-2 flex justify-center">
            <div className="text-sm text-gray-600">
              Kích thước hiện tại: {actualDimensions.actualWidth} x {actualDimensions.actualHeight}
              {(actualDimensions.actualWidth !== width || actualDimensions.actualHeight !== length) && (
                <span className="ml-2 text-orange-600">
                  (Đã đặt: {width} x {length})
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
              <span className="text-sm">Ghế thường</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
              <span className="text-sm">Ghế VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
              <span className="text-sm">Ghế đôi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 border-2 border-gray-200 rounded flex items-center justify-center">
                <Icon icon="mdi:walk" className="w-3 h-3 text-gray-400" />
              </div>
              <span className="text-sm">Lối đi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded flex items-center justify-center">
                <Icon icon="mdi:close" className="w-3 h-3 text-red-500" />
              </div>
              <span className="text-sm">Chặn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
              <span className="text-sm">Trống</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatMapEditor;
