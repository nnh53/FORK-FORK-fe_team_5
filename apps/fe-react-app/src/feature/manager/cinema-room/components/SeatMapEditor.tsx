import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Seat, SeatMap } from "@/interfaces/seat.interface";
import { transformSeatResponse, updateSeatStatus, updateSeatToCouple, updateSeatType, useUpdateSeat } from "@/services/cinemaRoomService";
import { Icon } from "@iconify/react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

/**
 * SeatMapEditor Component
 *
 * CURRENT API STRUCTURE:
 * - Row: Letter (A, B, C, ...)
 * - Column: Numeric (1, 2, 3, ...)
 *
 * BACKUP CODE AVAILABLE:
 * This file contains backup code for alternative API structure where:
 * - Row: Numeric (1, 2, 3, ...)
 * - Column: Letter (A, B, C, ...)
 *
 * Search for "BACKUP" comments throughout this file to find alternative implementations.
 * See API_STRUCTURE_GUIDE.md for complete switching instructions.
 */

interface SeatMapEditorProps {
  seatMap: SeatMap | null;
  onSeatMapChange?: (seatMap: SeatMap) => void;
  onRefetchRequired?: () => void; // Callback để yêu cầu refetch dữ liệu từ API
  readonly?: boolean;
  width?: number;
  length?: number;
}

type EditorTool = "seat-standard" | "seat-vip" | "seat-double" | "aisle" | "blocked" | "maintenance" | "available" | "eraser";

const SeatMapEditor: React.FC<SeatMapEditorProps> = ({ seatMap, onSeatMapChange, onRefetchRequired, width = 10, length = 10, readonly = false }) => {
  const [selectedTool, setSelectedTool] = useState<EditorTool>("seat-standard");
  const [currentSeatMap, setCurrentSeatMap] = useState<SeatMap | null>(seatMap);
  const [isUpdatingSeats, setIsUpdatingSeats] = useState(false);
  const updateSeatMutation = useUpdateSeat();

  // Update local state when props change
  React.useEffect(() => {
    setCurrentSeatMap(seatMap);
  }, [seatMap]);

  // Helper functions for seat operations
  const findAdjacentSeat = (seatMap: SeatMap, seat: Seat, direction: "next" | "prev"): [Seat | null, number] => {
    // Current API: row is letter, column is number
    const currentCol = parseInt(seat.column);
    const targetCol = direction === "next" ? currentCol + 1 : currentCol - 1;
    const adjacentSeat = seatMap.gridData.find((s) => s.row === seat.row && parseInt(s.column) === targetCol);

    // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
    // const currentColChar = seat.column.charCodeAt(0);
    // const targetColChar = direction === "next" ? currentColChar + 1 : currentColChar - 1;
    // const targetColumn = String.fromCharCode(targetColChar);
    // const adjacentSeat = seatMap.gridData.find((s) => s.row === seat.row && s.column === targetColumn);

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

  // Helper function to find the actual couple partner of a seat using API linkSeatId
  const findCouplePartner = (seatMap: SeatMap, seat: Seat): [Seat | null, number] => {
    if (seat.type.name !== "COUPLE" || !seat.linkSeatId) return [null, -1];

    // Find partner using linkSeatId from API
    const partner = seatMap.gridData.find((s) => s.id === seat.linkSeatId);

    if (partner) {
      const partnerIndex = seatMap.gridData.findIndex((s) => s.id === partner.id);
      return [partner, partnerIndex];
    }

    // Fallback to position-based logic if linkSeatId is not working
    const currentCol = parseInt(seat.column);
    let partnerCol: number;
    if (currentCol % 2 === 1) {
      // Ghế cột lẻ (1, 3, 5, ...) -> partner ở bên phải
      partnerCol = currentCol + 1;
    } else {
      // Ghế cột chẵn (2, 4, 6, ...) -> partner ở bên trái
      partnerCol = currentCol - 1;
    }

    const partnerColumn = partnerCol.toString();
    const fallbackPartner = seatMap.gridData.find((s) => s.row === seat.row && s.column === partnerColumn && s.type.name === "COUPLE");

    if (fallbackPartner) {
      const partnerIndex = seatMap.gridData.findIndex((s) => s.id === fallbackPartner.id);
      return [fallbackPartner, partnerIndex];
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
    const currentCol = parseInt(seat.column);

    // Cho phép tạo ghế đôi từ cả vị trí lẻ và chẵn
    // Tạo cặp với ghế bên phải cho cột lẻ, ghế bên trái cho cột chẵn
    let targetCol: number;
    if (currentCol % 2 === 1) {
      // Ghế cột lẻ (1, 3, 5, ...) -> tạo cặp với ghế bên phải
      targetCol = currentCol + 1;
    } else {
      // Ghế cột chẵn (2, 4, 6, ...) -> tạo cặp với ghế bên trái
      targetCol = currentCol - 1;
    }

    // Check if target seat exists
    const targetColumn = targetCol.toString();
    const targetSeat = seatMap.gridData.find((s) => s.row === seat.row && s.column === targetColumn);

    if (!targetSeat) return false;

    // Can create couple if:
    // 1. Target seat exists
    // 2. Target seat is not path or blocked
    // 3. Target seat is not already part of another couple pair
    const targetSeatCanBePartOfCouple = targetSeat.type.name !== "PATH" && targetSeat.type.name !== "BLOCK";

    // Check if target seat is already part of a couple pair
    const [targetSeatPartner] = findCouplePartner(seatMap, targetSeat);
    const targetSeatNotInCouple = !targetSeatPartner;

    return targetSeatCanBePartOfCouple && targetSeatNotInCouple;
  };

  // Helper function to handle double seat creation logic
  const handleDoubleSeatCreation = (newSeatMap: SeatMap, seat: Seat): boolean => {
    // First break any existing couple relationship for this seat
    if (seat.type.name === "COUPLE") {
      handleCoupleErasure(newSeatMap, seat);
    }

    // Check if we can create a couple seat
    if (!canCreateCouple(newSeatMap, seat)) {
      toast.error(`Không thể tạo ghế đôi tại vị trí ${seat.row}${seat.column}. Ghế liền kề không khả dụng hoặc đã được sử dụng.`);
      return false;
    }

    // Find target seat for coupling
    const currentCol = parseInt(seat.column);
    let targetCol: number;
    if (currentCol % 2 === 1) {
      // Ghế cột lẻ -> cặp với ghế bên phải
      targetCol = currentCol + 1;
    } else {
      // Ghế cột chẵn -> cặp với ghế bên trái
      targetCol = currentCol - 1;
    }

    const targetColumn = targetCol.toString();
    const targetSeat = newSeatMap.gridData.find((s) => s.row === seat.row && s.column === targetColumn);

    if (targetSeat && targetSeat.type.name === "COUPLE") {
      // Use the proper erasure logic for target seat if it's already part of a couple
      handleCoupleErasure(newSeatMap, targetSeat);
    }

    seat.type = { ...seat.type, name: "COUPLE" };
    handleCoupleSeatCreation(newSeatMap, seat);
    return true;
  };

  // Helper function to handle couple seat creation
  const handleCoupleCreation = async (seat: Seat, newSeatMap: SeatMap) => {
    // Validate couple seat creation
    if (!canCreateCouple(newSeatMap, seat)) {
      throw new Error(`Không thể tạo ghế đôi tại vị trí ${seat.row}${seat.column}. Ghế liền kề không khả dụng hoặc đã được sử dụng.`);
    }

    // Find the target seat to link with
    const currentCol = parseInt(seat.column);
    let targetCol: number;
    if (currentCol % 2 === 1) {
      // Ghế cột lẻ -> cặp với ghế bên phải
      targetCol = currentCol + 1;
    } else {
      // Ghế cột chẵn -> cặp với ghế bên trái
      targetCol = currentCol - 1;
    }

    const targetColumn = targetCol.toString();
    const targetSeat = newSeatMap.gridData.find((s) => s.row === seat.row && s.column === targetColumn);

    if (!targetSeat) {
      throw new Error("Không tìm thấy ghế liền kề để tạo ghế đôi.");
    }

    // Convert single seat to couple with link
    const seatUpdateRequest = updateSeatToCouple(seat, targetSeat.id);

    // Update UI optimistically
    handleDoubleSeatCreation(newSeatMap, seat);

    return seatUpdateRequest;
  };

  // Helper function to handle couple-to-other type conversions
  const handleCoupleToOtherConversion = (seat: Seat, targetType: string) => {
    if (seat.type.name === "COUPLE") {
      // Chuyển ghế đôi trực tiếp sang loại ghế mong muốn
      // Backend sẽ tự động xử lý việc unlink và cập nhật cả 2 ghế
      return updateSeatType(seat, targetType, null); // null để remove link
    } else {
      return updateSeatType(seat, targetType);
    }
  };

  // Helper function to determine seat update request and refetch needs
  const determineSeatUpdateRequest = async (seat: Seat, tool: EditorTool) => {
    const wasCouple = seat.type.name === "COUPLE";

    switch (tool) {
      case "seat-standard":
      case "eraser":
        return {
          request: handleCoupleToOtherConversion(seat, "REGULAR"),
          needsFullRefetch: wasCouple,
        };
      case "seat-vip":
        return {
          request: handleCoupleToOtherConversion(seat, "VIP"),
          needsFullRefetch: wasCouple,
        };
      case "seat-double": {
        const newSeatMap = JSON.parse(JSON.stringify(currentSeatMap));
        const request = await handleCoupleCreation(seat, newSeatMap);
        return {
          request,
          needsFullRefetch: true,
        };
      }
      case "aisle":
        return {
          request: handleCoupleToOtherConversion(seat, "PATH"),
          needsFullRefetch: wasCouple,
        };
      case "blocked":
        return {
          request: handleCoupleToOtherConversion(seat, "BLOCK"),
          needsFullRefetch: wasCouple,
        };
      case "maintenance":
        return {
          request: updateSeatStatus(seat, "MAINTENANCE"),
          needsFullRefetch: false, // Status change doesn't affect other seats
        };
      case "available":
        return {
          request: updateSeatStatus(seat, "AVAILABLE"),
          needsFullRefetch: false, // Status change doesn't affect other seats
        };
      default:
        throw new Error("Invalid tool selected");
    }
  };

  // Helper function to update UI with API response
  const updateUIWithAPIResponse = (response: unknown) => {
    if (!response || typeof response !== "object" || !("result" in response) || !currentSeatMap) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiResponse = response as { result: any }; // Using any for API response type flexibility
    const transformedSeat = transformSeatResponse(apiResponse.result);
    const updatedSeatMap = { ...currentSeatMap };
    updatedSeatMap.gridData = [...currentSeatMap.gridData];

    // Update the modified seat
    const index = updatedSeatMap.gridData.findIndex((s) => s.id === transformedSeat.id);
    if (index !== -1) {
      updatedSeatMap.gridData[index] = transformedSeat;
    }

    // Update UI immediately with API response
    setCurrentSeatMap(updatedSeatMap);
    if (onSeatMapChange) {
      onSeatMapChange(updatedSeatMap);
    }

    return true;
  };

  // Helper function to handle errors and rollback
  const handleSeatUpdateError = (error: unknown, originalSeatMap: SeatMap) => {
    console.error("Failed to update seat:", error);

    // Rollback to original state on API failure
    setCurrentSeatMap(originalSeatMap);
    if (onSeatMapChange) {
      onSeatMapChange(originalSeatMap);
    }

    // Show error message to user
    toast.error(`Không thể cập nhật ghế: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
  };

  // Handle seat click to change seat type
  const handleSeatClick = async (seatId: number) => {
    if (readonly || !currentSeatMap || isUpdatingSeats) return;

    setIsUpdatingSeats(true);
    const seatIndex = currentSeatMap.gridData.findIndex((s) => s.id === seatId);

    if (seatIndex === -1) {
      setIsUpdatingSeats(false);
      return;
    }

    const seat = { ...currentSeatMap.gridData[seatIndex] };
    const originalSeatMap = JSON.parse(JSON.stringify(currentSeatMap)); // Deep clone for rollback

    try {
      // Determine what API request to make
      const { request: seatUpdateRequest, needsFullRefetch } = await determineSeatUpdateRequest(seat, selectedTool);

      // Make API call
      const response = await updateSeatMutation.mutateAsync({
        params: { path: { id: seat.id } },
        body: seatUpdateRequest,
      });

      // Update UI with API response
      const updateSuccess = updateUIWithAPIResponse(response);

      if (updateSuccess) {
        console.log(`✅ Successfully updated seat ${seat.id}`);

        // Only refetch when necessary (couple seat operations that affect multiple seats)
        if (needsFullRefetch && onRefetchRequired) {
          onRefetchRequired();
        }
      }
    } catch (error) {
      handleSeatUpdateError(error, originalSeatMap);
    } finally {
      setIsUpdatingSeats(false);
    }
  };

  // Function to get seat color based on seat type and status
  const getSeatColor = (seat: Seat) => {
    // Handle maintenance status with visual overlay
    const maintenanceOverlay = seat.status === "MAINTENANCE" ? "opacity-50 bg-stripes" : "";

    let baseColor = "";
    switch (seat.type.name) {
      case "REGULAR":
        baseColor = "bg-blue-100 border-blue-300 text-blue-800";
        break;
      case "VIP":
        baseColor = "bg-yellow-100 border-yellow-300 text-yellow-800";
        break;
      case "COUPLE":
        baseColor = "bg-purple-100 border-purple-300 text-purple-800";
        break;
      case "PATH":
        baseColor = "bg-gray-50 border-gray-200 text-gray-500";
        break;
      case "BLOCK":
        baseColor = "bg-red-100 border-red-300 text-red-800";
        break;
      default:
        baseColor = "bg-gray-100 border-gray-300 text-gray-600";
        break;
    }

    return `${baseColor} ${maintenanceOverlay}`;
  };

  // Create render items for grid display with proper double seat handling
  // Helper function to get display text for seats - use API name directly
  const getDisplayNumber = (seat: Seat) => {
    if (!currentSeatMap || seat.type.name === "PATH" || seat.type.name === "BLOCK") {
      return null;
    }

    // Use the name from API directly instead of calculating display position
    return seat.name;
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
      // API structure: row is letter (A,B,C...), column is number (1,2,3...)
      const rowIndex = seat.row.charCodeAt(0) - 65; // A=0, B=1, etc.
      const colIndex = parseInt(seat.column) - 1; // 1=0, 2=1, etc.

      // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
      // const rowIndex = parseInt(seat.row) - 1; // 1=0, 2=1, etc.
      // const colIndex = seat.column.charCodeAt(0) - 65; // A=0, B=1, etc.

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
        // API structure: row is letter, column is number
        const key = `${seat.row}-${seat.column}`;
        // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
        // const key = `${seat.row}-${seat.column}`;
        seatMap.set(key, seat);
      });
      return seatMap;
    };

    const isDoubleSeatStart = (seat: Seat, nextSeat: Seat | undefined) => {
      // For API structure: check if column numbers are consecutive (1->2, 2->3, etc.)
      return (
        seat.type.name === "COUPLE" &&
        nextSeat &&
        nextSeat.type.name === "COUPLE" &&
        parseInt(seat.column) % 2 === 1 &&
        parseInt(nextSeat.column) === parseInt(seat.column) + 1
      );

      // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
      // return (
      //   seat.type.name === "COUPLE" && nextSeat && nextSeat.type.name === "COUPLE" && seat.column.charCodeAt(0) === nextSeat.column.charCodeAt(0) - 1
      // );
    };

    const createGridItem = (
      seat: Seat | undefined,
      rowIndex: number,
      colIndex: number,
      seatMap: Map<string, Seat>,
      processedPositions: Set<string>,
    ) => {
      const rowLetter = String.fromCharCode(65 + rowIndex);
      const colNumber = (colIndex + 1).toString();
      const key = `${rowLetter}-${colNumber}`;

      // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
      // const rowNumber = (rowIndex + 1).toString();
      // const colLetter = String.fromCharCode(65 + colIndex);
      // const key = `${rowNumber}-${colLetter}`;

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
      const nextColNumber = (colIndex + 2).toString();
      // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
      // const nextColLetter = String.fromCharCode(65 + colIndex + 1);
      const nextKey = `${rowLetter}-${nextColNumber}`;
      // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
      // const nextKey = `${rowNumber}-${nextColLetter}`;
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
        const prevColNumber = colIndex.toString();
        const prevKey = `${rowLetter}-${prevColNumber}`;
        // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
        // if (seat.type.name === "COUPLE" && parseInt(seat.column) % 2 === 0) {
        //   const prevColLetter = String.fromCharCode(65 + colIndex - 1);
        //   const prevKey = `${rowNumber}-${prevColLetter}`;
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
      const rowLetter = String.fromCharCode(65 + rowIndex);
      // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
      // const rowNumber = (rowIndex + 1).toString();

      for (let colIndex = 0; colIndex < actualDimensions.actualWidth; colIndex++) {
        const colNumber = (colIndex + 1).toString();
        const key = `${rowLetter}-${colNumber}`;
        // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
        // const colLetter = String.fromCharCode(65 + colIndex);
        // const key = `${rowNumber}-${colLetter}`;

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
    { id: "maintenance" as const, label: "Bảo trì", icon: "mdi:wrench", color: "orange" },
    { id: "available" as const, label: "Khả dụng", icon: "mdi:check-circle", color: "green" },
    { id: "eraser" as const, label: "Xóa", icon: "mdi:eraser", color: "slate" },
  ];

  const seatStats = useMemo(() => {
    if (!currentSeatMap) return { total: 0, standard: 0, vip: 0, double: 0, path: 0, blocked: 0, maintenance: 0 };

    let total = 0,
      standard = 0,
      vip = 0,
      coupleSeats = 0, // Đếm số ghế COUPLE
      path = 0,
      blocked = 0,
      maintenance = 0;

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
          coupleSeats++;
          break;
        case "PATH":
          path++;
          break;
        case "BLOCK":
          blocked++;
          break;
      }

      // Count maintenance seats
      if (seat.status === "MAINTENANCE") {
        maintenance++;
      }
    });

    // Tính số ghế đôi thực tế (2 ghế COUPLE = 1 ghế đôi)
    const double = Math.floor(coupleSeats / 2);

    return { total, standard, vip, double, path, blocked, maintenance };
  }, [currentSeatMap]);

  if (!currentSeatMap) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Icon icon="mdi:seat" className="mx-auto mb-4 h-16 w-16 text-gray-300" />
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
              <Icon icon="mdi:tools" className="h-5 w-5" />
              Công cụ chỉnh sửa
              <span className="text-sm font-normal text-gray-500">(Đang chọn: {tools.find((t) => t.id === selectedTool)?.label})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 rounded-lg bg-blue-50 p-2">
              <p className="text-sm text-blue-700">
                💡 <strong>Hướng dẫn:</strong> Chọn công cụ bên dưới, sau đó click vào ghế để thay đổi loại ghế.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool(tool.id)}
                  disabled={isUpdatingSeats}
                  className="flex h-auto flex-col items-center gap-1 p-3"
                >
                  <Icon icon={tool.icon} className="h-5 w-5" />
                  <span className="text-xs">{tool.label}</span>
                </Button>
              ))}
            </div>

            {/* Save instruction */}
            <div className={`mt-4 rounded-lg border p-3 ${isUpdatingSeats ? "border-blue-200 bg-blue-50" : "border-yellow-200 bg-yellow-50"}`}>
              <div className={`flex items-center gap-2 ${isUpdatingSeats ? "text-blue-800" : "text-yellow-800"}`}>
                <Icon icon={isUpdatingSeats ? "mdi:loading" : "mdi:information"} className={`h-4 w-4 ${isUpdatingSeats ? "animate-spin" : ""}`} />
                <p className="text-sm">
                  <strong>{isUpdatingSeats ? "Đang cập nhật..." : "Thông báo:"}</strong>{" "}
                  {isUpdatingSeats ? "Vui lòng chờ trong khi ghế đang được cập nhật." : "Thay đổi sẽ được tự động lưu khi bạn chỉnh sửa ghế."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seat Statistics */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-7">
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
              <div className="text-2xl font-bold text-gray-600">{seatStats.path}</div>
              <div className="text-sm text-gray-600">Lối đi</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{seatStats.blocked}</div>
              <div className="text-sm text-gray-600">Chặn</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{seatStats.maintenance}</div>
              <div className="text-sm text-gray-600">Bảo trì</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Map Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <Icon icon="mdi:view-grid" className="h-5 w-5" />
            Sơ đồ ghế - Phòng {currentSeatMap.roomId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded bg-gray-800 p-4 text-center text-white">
            <Icon icon="mdi:movie" className="mx-auto mb-1 h-6 w-6" />
            <div className="text-sm font-medium">MÀN HÌNH</div>
          </div>

          {/* Grid with row labels */}
          <div className="overflow-auto">
            <div className="flex justify-center">
              <div className="flex">
                {/* Row labels (A, B, C...) */}
                {/* BACKUP: If API returns row as number, column as letter (uncomment below and comment above) */}
                {/* Row labels (1, 2, 3...) */}
                <div className="mr-2 flex flex-col">
                  {Array.from({ length: actualDimensions.actualHeight }, (_, i) => (
                    <div
                      key={i}
                      className="flex w-6 items-center justify-center text-sm font-medium text-gray-500"
                      style={{
                        height: "32px", // Match seat height exactly
                        marginBottom: i < actualDimensions.actualHeight - 1 ? "4px" : "0",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                      {/* BACKUP for API reverse: i + 1 */}
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
                          className={`relative flex cursor-pointer items-center justify-center rounded border text-xs hover:opacity-80 ${getSeatColor(item.seat)}`}
                          onClick={() => handleSeatClick(item.seat.id)}
                          style={{
                            gridRow: item.gridRow,
                            gridColumn: `${item.gridColumn} / span 2`,
                            height: "32px",
                            width: "auto",
                          }}
                        >
                          {getDisplayNumber(item.seat) || item.seat.name}
                          {item.seat.status === "MAINTENANCE" && (
                            <Icon icon="mdi:wrench" className="absolute right-0 top-0 h-2 w-2 text-orange-600" />
                          )}
                          {selectedTool === "available" && item.seat.status === "MAINTENANCE" && (
                            <Icon icon="mdi:check-circle" className="absolute left-0 top-0 h-2 w-2 text-green-600" />
                          )}
                        </div>
                      );
                    } else {
                      // Render special content for path and blocked seats
                      let content: React.ReactNode = getDisplayNumber(item.seat) || item.seat.name;
                      if (item.seat.type.name === "PATH") {
                        content = <Icon icon="mdi:walk" className="h-3 w-3" />;
                      } else if (item.seat.type.name === "BLOCK") {
                        content = <Icon icon="mdi:close" className="h-3 w-3" />;
                      }

                      return (
                        <div
                          key={item.seat.id || `single-${index}`}
                          className={`relative flex cursor-pointer items-center justify-center rounded border text-xs hover:opacity-80 ${getSeatColor(item.seat)}`}
                          onClick={() => handleSeatClick(item.seat.id)}
                          style={{
                            gridRow: item.gridRow,
                            gridColumn: item.gridColumn,
                            height: "32px",
                            width: "32px",
                          }}
                        >
                          {content}
                          {item.seat.status === "MAINTENANCE" && (
                            <Icon icon="mdi:wrench" className="absolute right-0 top-0 h-2 w-2 text-orange-600" />
                          )}
                          {selectedTool === "available" && item.seat.status === "MAINTENANCE" && (
                            <Icon icon="mdi:check-circle" className="absolute left-0 top-0 h-2 w-2 text-green-600" />
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Column labels (1, 2, 3...) */}
          {/* BACKUP: If API returns row as number, column as letter (uncomment below and comment above) */}
          {/* Column labels (A, B, C...) */}
          <div className="mt-4 flex justify-center">
            <div className="flex">
              {/* Space for row labels */}
              <div className="w-8"></div>

              {/* Column numbers */}
              {/* BACKUP: If API returns row as number, column as letter (uncomment below and comment above) */}
              {/* Column letters */}
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
                    {i + 1}
                    {/* BACKUP for API reverse: String.fromCharCode(65 + i) */}
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-blue-300 bg-blue-100"></div>
              <span className="text-sm">Ghế thường</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-yellow-300 bg-yellow-100"></div>
              <span className="text-sm">Ghế VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-purple-300 bg-purple-100"></div>
              <span className="text-sm">Ghế đôi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded border-2 border-gray-200 bg-gray-50">
                <Icon icon="mdi:walk" className="h-3 w-3 text-gray-400" />
              </div>
              <span className="text-sm">Lối đi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded border-2 border-red-300 bg-red-100">
                <Icon icon="mdi:close" className="h-3 w-3 text-red-500" />
              </div>
              <span className="text-sm">Chặn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-4 w-4 rounded border-2 border-orange-300 bg-orange-100 opacity-60">
                <Icon icon="mdi:wrench" className="absolute right-0 top-0 h-2 w-2 text-orange-600" style={{ transform: "translate(25%, -25%)" }} />
              </div>
              <span className="text-sm">Bảo trì</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-gray-200 bg-white"></div>
              <span className="text-sm">Trống</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatMapEditor;
