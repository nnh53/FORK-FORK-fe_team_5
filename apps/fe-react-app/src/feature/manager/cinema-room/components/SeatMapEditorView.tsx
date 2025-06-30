import { Badge } from "@/components/Shadcn/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Seat, SeatMap } from "@/interfaces/seat.interface";
import { Icon } from "@iconify/react";
import React from "react";

interface SeatMapEditorViewProps {
  seatMap: SeatMap | null;
  selectedSeats?: string[];
  onSeatSelect?: (seatId: string) => void;
  showSelectable?: boolean;
  width?: number;
  length?: number;
}

const SeatMapEditorView: React.FC<SeatMapEditorViewProps> = ({
  seatMap,
  selectedSeats = [],
  onSeatSelect,
  showSelectable = false,
  width = 10,
  length = 10,
}) => {
  // Calculate actual dimensions based on seat data
  const actualDimensions = React.useMemo(() => {
    if (!seatMap || seatMap.gridData.length === 0) {
      return { actualWidth: width, actualHeight: length };
    }

    const seats = seatMap.gridData;
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
  }, [seatMap, width, length]);

  const createRenderItems = React.useMemo(() => {
    if (!seatMap || !seatMap.gridData) return [];

    const seats = seatMap.gridData;

    // Sort seats by row and column to ensure proper grid order
    const sortedSeats = [...seats].sort((a, b) => {
      const rowA = a.seat_row.charCodeAt(0);
      const rowB = b.seat_row.charCodeAt(0);
      if (rowA !== rowB) return rowA - rowB;

      const colA = parseInt(a.seat_column);
      const colB = parseInt(b.seat_column);
      return colA - colB;
    });

    // Create display numbering system - consecutive numbers per row (couple seats share same number)
    const displayNumbering: Record<string, number> = {};

    // Group seats by row
    const seatsByRow: Record<string, Seat[]> = {};
    sortedSeats.forEach((seat) => {
      if (!seatsByRow[seat.seat_row]) {
        seatsByRow[seat.seat_row] = [];
      }
      seatsByRow[seat.seat_row].push(seat);
    });

    // Generate display numbers for each row
    Object.keys(seatsByRow).forEach((rowKey) => {
      const rowSeats = seatsByRow[rowKey]
        .filter((s) => s.type !== "AISLE" && s.type !== "BLOCKED")
        .sort((a, b) => parseInt(a.seat_column) - parseInt(b.seat_column));

      let displayCounter = 1;
      let skipNext = false;

      for (let i = 0; i < rowSeats.length; i++) {
        if (skipNext) {
          skipNext = false;
          continue;
        }

        const seat = rowSeats[i];
        displayNumbering[`${seat.seat_row}-${seat.seat_column}`] = displayCounter;

        // If this is a couple seat, check if it pairs with the next seat
        if (seat.type === "COUPLE") {
          const nextSeat = rowSeats[i + 1];
          if (nextSeat && nextSeat.type === "COUPLE" && parseInt(nextSeat.seat_column) === parseInt(seat.seat_column) + 1) {
            // Next seat is part of the same couple, give it the same display number
            displayNumbering[`${nextSeat.seat_row}-${nextSeat.seat_column}`] = displayCounter;
            skipNext = true;
          }
        }

        displayCounter++;
      }
    });

    const renderItems = [];
    let skipNext = false;

    for (let i = 0; i < sortedSeats.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const seat = sortedSeats[i];
      const displayNumber = displayNumbering[`${seat.seat_row}-${seat.seat_column}`];

      // Check if this seat should be part of a double seat
      if (seat.type === "COUPLE") {
        // Check if next seat is also COUPLE and in same row
        const nextSeat = sortedSeats[i + 1];
        const currentCol = parseInt(seat.seat_column);

        if (nextSeat && nextSeat.type === "COUPLE" && nextSeat.seat_row === seat.seat_row && parseInt(nextSeat.seat_column) === currentCol + 1) {
          // This is the start of a double seat - both seats share the same display number
          renderItems.push({
            type: "double",
            seat: seat,
            index: i,
            span: 2,
            cellType: "seat" as const,
            displayCol: displayNumber.toString(),
            displayRow: seat.seat_row,
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
            cellType: "seat" as const,
            displayCol: displayNumber.toString(),
            displayRow: seat.seat_row,
          });
        }
      } else {
        // Regular single seat
        renderItems.push({
          type: "single",
          seat: seat,
          index: i,
          span: 1,
          cellType: "seat" as const,
          displayCol: displayNumber.toString(),
          displayRow: seat.seat_row,
        });
      }
    }

    return renderItems;
  }, [seatMap]);
  // Function to get seat color based on seat type
  const getSeatColor = (seat: Seat, isSelected: boolean = false): string => {
    const baseClass = "border rounded flex items-center justify-center text-xs cursor-pointer hover:opacity-80";

    if (isSelected) {
      return `${baseClass} bg-blue-500 text-white border-blue-500 ring-2 ring-blue-300`;
    }

    switch (seat.type) {
      case "REGULAR":
        return `${baseClass} bg-blue-100 border-blue-300 text-blue-800`;
      case "VIP":
        return `${baseClass} bg-yellow-100 border-yellow-300 text-yellow-800`;
      case "COUPLE":
        return `${baseClass} bg-purple-100 border-purple-300 text-purple-800`;
      case "AISLE":
        return `${baseClass} bg-gray-50 border-gray-200 text-gray-500`;
      case "BLOCKED":
        return `${baseClass} bg-red-100 border-red-300 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 border-gray-300 text-gray-600`;
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (showSelectable && onSeatSelect && seat.id && seat.status === "AVAILABLE") {
      onSeatSelect(seat.id as string);
    }
  };

  const seatStats = React.useMemo(() => {
    if (!seatMap) return { total: 0, standard: 0, vip: 0, double: 0, available: 0, maintenance: 0 };

    let total = 0,
      standard = 0,
      vip = 0,
      double = 0,
      available = 0,
      maintenance = 0;

    seatMap.gridData.forEach((seat) => {
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
      }

      switch (seat.status) {
        case "AVAILABLE":
          available++;
          break;
        case "MAINTENANCE":
          maintenance++;
          break;
      }
    });

    return { total, standard, vip, double, available, maintenance };
  }, [seatMap]);

  if (!seatMap) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Icon icon="mdi:seat" className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Không có dữ liệu sơ đồ ghế</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Sơ đồ ghế - Phòng {seatMap.roomId}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">
              <Icon icon="mdi:seat" className="w-4 h-4 mr-1" />
              {seatStats.total} ghế
            </Badge>
            {showSelectable && selectedSeats.length > 0 && (
              <Badge variant="default">
                <Icon icon="mdi:check" className="w-4 h-4 mr-1" />
                {selectedSeats.length} đã chọn
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Screen */}
        <div className="mb-6">
          <div className="w-full h-3 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 rounded-full mb-2 shadow-lg"></div>
          <p className="text-center text-sm text-gray-500 font-medium">MÀN HÌNH CHIẾU</p>
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
                {createRenderItems.map((item) => {
                  const isSelected = item.seat.id ? selectedSeats.includes(item.seat.id as string) : false;

                  if (item.type === "double") {
                    return (
                      <div
                        key={item.seat.id || item.index}
                        className={`border rounded flex items-center justify-center text-xs cursor-pointer hover:opacity-80 ${getSeatColor(item.seat, isSelected)}`}
                        onClick={() => handleSeatClick(item.seat)}
                        style={{
                          gridColumn: "span 2",
                          height: "32px", // Fixed height
                          width: "68px", // 32px * 2 + 4px gap
                        }}
                      >
                        {item.displayCol}
                      </div>
                    );
                  } else {
                    // Render special content for aisle and blocked seats
                    let content: React.ReactNode = item.displayCol;
                    if (item.seat.type === "AISLE") {
                      content = <Icon icon="mdi:walk" className="w-3 h-3" />;
                    } else if (item.seat.type === "BLOCKED") {
                      content = <Icon icon="mdi:close" className="w-3 h-3" />;
                    }

                    return (
                      <div
                        key={item.seat.id || item.index}
                        className={`${getSeatColor(item.seat, isSelected)}`}
                        onClick={() => handleSeatClick(item.seat)}
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

            {/* Column numbers - show consecutive numbering that matches seats */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${actualDimensions.actualWidth}, 1fr)`,
                gap: "4px",
                maxWidth: `${actualDimensions.actualWidth * 32 + (actualDimensions.actualWidth - 1) * 4}px`,
              }}
            >
              {(() => {
                // Calculate how many display numbers we have based on the render items
                const displayNumbers = new Set<number>();
                createRenderItems.forEach((item) => {
                  if (item.seat.type !== "AISLE" && item.seat.type !== "BLOCKED") {
                    const displayNum = parseInt(item.displayCol);
                    if (!isNaN(displayNum)) {
                      displayNumbers.add(displayNum);
                    }
                  }
                });

                const maxDisplayNumber = Math.max(...Array.from(displayNumbers), 0);
                const columnCount = Math.max(maxDisplayNumber, actualDimensions.actualWidth);

                return Array.from({ length: columnCount }, (_, i) => (
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
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-sm">Ghế Thường ({seatStats.standard})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-sm">Ghế VIP ({seatStats.vip})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-purple-100 border border-purple-300 rounded"></div>
            <span className="text-sm">Ghế Đôi ({seatStats.double})</span>
          </div>
          {showSelectable && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 border border-blue-500 rounded"></div>
              <span className="text-sm">Đã chọn</span>
            </div>
          )}
        </div>

        {/* Seat Statistics */}
        {seatStats.total > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Thống kê ghế</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng số:</span>
                <span className="font-medium">{seatStats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Có thể sử dụng:</span>
                <span className="font-medium text-green-600">{seatStats.available}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bảo trì:</span>
                <span className="font-medium text-orange-600">{seatStats.maintenance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tỷ lệ khả dụng:</span>
                <span className="font-medium">{seatStats.total > 0 ? Math.round((seatStats.available / seatStats.total) * 100) : 0}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeatMapEditorView;
