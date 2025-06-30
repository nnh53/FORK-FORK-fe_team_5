import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Seat, SeatMap } from "@/interfaces/seat.interface";
import { Icon } from "@iconify/react";
import React, { useMemo, useState } from "react";

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
    const currentCol = parseInt(seat.seat_column);
    const targetCol = direction === "next" ? currentCol + 1 : currentCol - 1;

    const adjacentSeat = seatMap.gridData.find((s) => s.seat_row === seat.seat_row && parseInt(s.seat_column) === targetCol);

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
      updatedNextSeat.type = "COUPLE";
      newSeatMap.gridData[nextIndex] = updatedNextSeat;
    }
  };

  // Helper function to find the actual couple partner of a seat
  const findCouplePartner = (seatMap: SeatMap, seat: Seat): [Seat | null, number] => {
    if (seat.type !== "COUPLE") return [null, -1];

    const currentCol = parseInt(seat.seat_column);

    // Logic: Ghế đôi luôn được tạo theo cặp (odd, even) columns
    // Ví dụ: (1,2), (3,4), (5,6), etc.
    // Ghế có cột lẻ sẽ cặp với ghế cột chẵn bên phải
    // Ghế có cột chẵn sẽ cặp với ghế cột lẻ bên trái

    let partnerCol: number;
    if (currentCol % 2 === 1) {
      // Ghế cột lẻ (1, 3, 5, ...) -> partner ở bên phải (2, 4, 6, ...)
      partnerCol = currentCol + 1;
    } else {
      // Ghế cột chẵn (2, 4, 6, ...) -> partner ở bên trái (1, 3, 5, ...)
      partnerCol = currentCol - 1;
    }

    // Tìm ghế partner theo cột đã tính toán
    const partner = seatMap.gridData.find((s) => s.seat_row === seat.seat_row && parseInt(s.seat_column) === partnerCol && s.type === "COUPLE");

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
      updatedPartner.type = "REGULAR";
      newSeatMap.gridData[partnerIndex] = updatedPartner;
    }
  };

  // Helper function to check if a seat can be converted to couple
  const canCreateCouple = (seatMap: SeatMap, seat: Seat): boolean => {
    const currentCol = parseInt(seat.seat_column);

    // Chỉ cho phép tạo ghế đôi từ ghế có cột lẻ (để đảm bảo luôn tạo cặp (odd, even))
    if (currentCol % 2 === 0) {
      return false; // Ghế cột chẵn không thể làm điểm bắt đầu ghế đôi
    }

    // Check if next seat exists and is available for coupling
    const nextSeat = seatMap.gridData.find((s) => s.seat_row === seat.seat_row && parseInt(s.seat_column) === currentCol + 1);

    if (!nextSeat) return false;

    // Can create couple if:
    // 1. Next seat exists
    // 2. Next seat is not aisle or blocked
    // 3. Next seat is not already part of another couple pair
    const nextSeatCanBePartOfCouple = nextSeat.type !== "AISLE" && nextSeat.type !== "BLOCKED";

    // Check if next seat is already part of a couple pair using the new logic
    const [nextSeatPartner] = findCouplePartner(seatMap, nextSeat);
    const nextSeatNotInCouple = !nextSeatPartner;

    return nextSeatCanBePartOfCouple && nextSeatNotInCouple;
  };

  // Helper function to convert both seats in a couple to the same type
  const convertCoupleTo = (newSeatMap: SeatMap, seat: Seat, newType: "REGULAR" | "VIP" | "AISLE" | "BLOCKED") => {
    if (seat.type === "COUPLE") {
      // Find the partner and convert both seats
      const [partner, partnerIndex] = findCouplePartner(newSeatMap, seat);

      if (partner && partnerIndex !== -1) {
        // Convert partner to new type
        const updatedPartner = { ...partner };
        updatedPartner.type = newType;
        newSeatMap.gridData[partnerIndex] = updatedPartner;
      }

      // Convert current seat to new type
      seat.type = newType;
    } else {
      // Not a couple seat, just convert normally
      seat.type = newType;
    }
  };

  // Helper function to handle double seat creation logic
  const handleDoubleSeatCreation = (newSeatMap: SeatMap, seat: Seat): boolean => {
    // First break any existing couple relationship for this seat
    if (seat.type === "COUPLE") {
      handleCoupleErasure(newSeatMap, seat);
    }

    // Check if we can create a couple seat
    if (!canCreateCouple(newSeatMap, seat)) {
      const currentCol = parseInt(seat.seat_column);
      if (currentCol % 2 === 0) {
        alert(`Không thể tạo ghế đôi từ ghế ${seat.seat_row}${seat.seat_column}. Chỉ có thể tạo ghế đôi từ ghế có số cột lẻ (1, 3, 5, ...).`);
      } else {
        alert(`Không thể tạo ghế đôi tại vị trí ${seat.seat_row}${seat.seat_column}. Ghế liền kề không khả dụng hoặc đã được sử dụng.`);
      }
      return false;
    }

    // Break couple relationship for the next seat if it's already part of a couple
    const nextSeat = newSeatMap.gridData.find((s) => s.seat_row === seat.seat_row && parseInt(s.seat_column) === parseInt(seat.seat_column) + 1);

    if (nextSeat && nextSeat.type === "COUPLE") {
      // Use the proper erasure logic
      handleCoupleErasure(newSeatMap, nextSeat);
    }

    seat.type = "COUPLE";
    handleCoupleSeatCreation(newSeatMap, seat);
    return true;
  };

  // Handle seat click to change seat type
  const handleSeatClick = (seatId: string) => {
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
    switch (seat.type) {
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
  const createRenderItems = () => {
    if (!currentSeatMap) return [];

    const seats = currentSeatMap.gridData;

    // Sort seats by row and column to ensure proper grid order
    const sortedSeats = [...seats].sort((a, b) => {
      const rowA = a.seat_row.charCodeAt(0);
      const rowB = b.seat_row.charCodeAt(0);
      if (rowA !== rowB) return rowA - rowB;

      const colA = parseInt(a.seat_column);
      const colB = parseInt(b.seat_column);
      return colA - colB;
    });

    const renderItems = [];
    let skipNext = false;

    for (let i = 0; i < sortedSeats.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const seat = sortedSeats[i];
      const currentCol = parseInt(seat.seat_column);

      // Check if this seat should be part of a double seat
      if (seat.type === "COUPLE") {
        // Check if next seat is also COUPLE and in same row
        const nextSeat = sortedSeats[i + 1];

        if (nextSeat && nextSeat.type === "COUPLE" && nextSeat.seat_row === seat.seat_row && parseInt(nextSeat.seat_column) === currentCol + 1) {
          // This is the start of a double seat
          renderItems.push({
            type: "double",
            seat: seat,
            index: i,
            span: 2,
          });
          // Mark to skip the next seat since it's part of this double seat
          skipNext = true;
        } else {
          // Single COUPLE seat (shouldn't happen but handle gracefully)
          renderItems.push({
            type: "single",
            seat: seat,
            index: i,
            span: 1,
          });
        }
      } else {
        // Regular single seat
        renderItems.push({
          type: "single",
          seat: seat,
          index: i,
          span: 1,
        });
      }
    }

    return renderItems;
  };

  const renderItems = createRenderItems();

  const tools = [
    { id: "seat-standard" as const, label: "Ghế thường", icon: "mdi:seat", color: "blue" },
    { id: "seat-vip" as const, label: "Ghế VIP", icon: "mdi:seat-recline-extra", color: "yellow" },
    { id: "seat-double" as const, label: "Ghế đôi", icon: "mdi:seat-individual-suite", color: "purple" },
    { id: "aisle" as const, label: "Lối đi", icon: "mdi:walk", color: "gray" },
    { id: "blocked" as const, label: "Chặn", icon: "mdi:close", color: "red" },
    { id: "eraser" as const, label: "Xóa", icon: "mdi:eraser", color: "orange" },
  ];

  // Calculate actual dimensions based on seat data
  const actualDimensions = useMemo(() => {
    if (!currentSeatMap || currentSeatMap.gridData.length === 0) {
      return { actualWidth: width, actualHeight: length };
    }

    const seats = currentSeatMap.gridData;
    let maxRow = 0;
    let maxCol = 0;

    seats.forEach((seat) => {
      const rowIndex = seat.seat_row.charCodeAt(0) - 65; // A=0, B=1, etc.
      const colIndex = parseInt(seat.seat_column) - 1; // 1=0, 2=1, etc.

      maxRow = Math.max(maxRow, rowIndex);
      maxCol = Math.max(maxCol, colIndex);
    });

    return {
      actualWidth: Math.max(maxCol + 1, width),
      actualHeight: Math.max(maxRow + 1, length),
    };
  }, [currentSeatMap, width, length]);

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
      switch (seat.type) {
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
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>

                {/* Seat grid */}
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${actualDimensions.actualWidth}, 1fr)`,
                    gap: "4px",
                    maxWidth: `${actualDimensions.actualWidth * 32 + (actualDimensions.actualWidth - 1) * 4}px`,
                  }}
                >
                  {/* Using render items for proper double seat handling */}
                  {renderItems.map((item) => {
                    if (item.type === "double") {
                      return (
                        <div
                          key={item.seat.id || item.index}
                          className={`border rounded flex items-center justify-center text-xs cursor-pointer hover:opacity-80 ${getSeatColor(item.seat)}`}
                          onClick={() => handleSeatClick(item.seat.id)}
                          style={{
                            gridColumn: "span 2",
                            height: "32px", // Fixed height
                            width: "68px", // 32px * 2 + 4px gap
                          }}
                        >
                          {item.seat.seat_column}
                        </div>
                      );
                    } else {
                      // Render special content for aisle and blocked seats
                      let content: React.ReactNode = item.seat.seat_column;
                      if (item.seat.type === "AISLE") {
                        content = <Icon icon="mdi:walk" className="w-3 h-3" />;
                      } else if (item.seat.type === "BLOCKED") {
                        content = <Icon icon="mdi:close" className="w-3 h-3" />;
                      }

                      return (
                        <div
                          key={item.seat.id || item.index}
                          className={`border rounded flex items-center justify-center text-xs cursor-pointer hover:opacity-80 ${getSeatColor(item.seat)}`}
                          onClick={() => handleSeatClick(item.seat.id)}
                          style={{
                            height: "32px", // Fixed height
                            width: "32px", // Fixed width
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

          {/* Column labels (1, 2, 3...) */}
          <div className="mt-4 flex justify-center">
            <div className="flex">
              {/* Space for row labels */}
              <div className="w-8"></div>

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
                    {i + 1}
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
