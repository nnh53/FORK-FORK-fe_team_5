import { Badge } from "@/components/Shadcn/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Seat, SeatMap } from "@/interfaces/seat.interface";
import { Icon } from "@iconify/react";
import React from "react";

/**
 * SeatMapEditorView Component
 *
 * CURRENT API STRUCTURE:
 * - Row: Letter (A, B, C, ...)
 * - Column: Numeric (1, 2, 3, ...)
 *
 * BACKUP CODE AVAILABLE:
 * This file contains backup code for alternative API structure.
 * Search for "BACKUP" comments throughout this file to find alternative implementations.
 * See API_STRUCTURE_GUIDE.md for complete switching instructions.
 */

interface SeatMapEditorViewProps {
  seatMap: SeatMap | null;
  selectedSeats?: number[]; // Changed to number[] to match new API
  onSeatSelect?: (seatId: number) => void; // Changed to number
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
  }, [seatMap, width, length]);

  const createRenderItems = React.useMemo(() => {
    if (!seatMap || !seatMap.gridData) return [];

    const seats = seatMap.gridData;

    // Sort seats by row and column to ensure proper grid order
    const sortedSeats = [...seats].sort((a, b) => {
      const rowA = a.row.charCodeAt(0);
      const rowB = b.row.charCodeAt(0);
      if (rowA !== rowB) return rowA - rowB;

      const colA = parseInt(a.column);
      const colB = parseInt(b.column);
      return colA - colB;

      // BACKUP: If API returns row as number, column as letter (uncomment below and comment above)
      // const rowA = parseInt(a.row);
      // const rowB = parseInt(b.row);
      // if (rowA !== rowB) return rowA - rowB;
      // const colA = a.column.charCodeAt(0);
      // const colB = b.column.charCodeAt(0);
      // return colA - colB;
    });

    // Use API names directly instead of calculating display numbers
    const renderItems = [];
    let skipNext = false;

    for (let i = 0; i < sortedSeats.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const seat = sortedSeats[i];

      // Check if this seat should be part of a double seat
      if (seat.type.name === "COUPLE") {
        // Check if next seat is also COUPLE and in same row
        const nextSeat = sortedSeats[i + 1];
        const currentCol = parseInt(seat.column);

        if (nextSeat && nextSeat.type.name === "COUPLE" && nextSeat.row === seat.row && parseInt(nextSeat.column) === currentCol + 1) {
          // This is the start of a double seat - use the first seat's name
          renderItems.push({
            type: "double",
            seat: seat,
            index: i,
            span: 2,
            cellType: "seat" as const,
            displayCol: seat.name, // Use API name directly
            displayRow: seat.row,
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
            displayCol: seat.name, // Use API name directly
            displayRow: seat.row,
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
          displayCol: seat.name, // Use API name directly
          displayRow: seat.row,
        });
      }
    }

    return renderItems;
  }, [seatMap]);
  // Function to get seat color based on seat type and status
  const getSeatColor = (seat: Seat, isSelected = false): string => {
    const baseClass = "border rounded flex items-center justify-center text-xs cursor-pointer hover:opacity-80 relative";

    if (isSelected) {
      return `${baseClass} bg-blue-500 text-white border-blue-500 ring-2 ring-blue-300`;
    }

    // Determine base color based on seat type
    let baseColor: string;
    switch (seat.type.name) {
      case "REGULAR":
        baseColor = `${baseClass} bg-blue-100 border-blue-300 text-blue-800`;
        break;
      case "VIP":
        baseColor = `${baseClass} bg-yellow-100 border-yellow-300 text-yellow-800`;
        break;
      case "COUPLE":
        baseColor = `${baseClass} bg-purple-100 border-purple-300 text-purple-800`;
        break;
      case "PATH":
        baseColor = `${baseClass} bg-gray-50 border-gray-200 text-gray-500`;
        break;
      case "BLOCK":
        baseColor = `${baseClass} bg-red-100 border-red-300 text-red-800`;
        break;
      default:
        baseColor = `${baseClass} bg-gray-100 border-gray-300 text-gray-600`;
    }

    // Apply maintenance overlay if needed
    const maintenanceOverlay = seat.status === "MAINTENANCE" ? "opacity-50" : "";

    return `${baseColor} ${maintenanceOverlay}`;
  };

  const handleSeatClick = (seat: Seat) => {
    if (showSelectable && onSeatSelect && seat.id && seat.status === "AVAILABLE") {
      onSeatSelect(seat.id);
    }
  };

  const seatStats = React.useMemo(() => {
    if (!seatMap) return { total: 0, standard: 0, vip: 0, double: 0, available: 0, maintenance: 0 };

    let total = 0,
      standard = 0,
      vip = 0,
      coupleSeats = 0, // Đếm số ghế COUPLE
      available = 0,
      maintenance = 0;

    seatMap.gridData.forEach((seat) => {
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

    // Tính số ghế đôi thực tế (2 ghế COUPLE = 1 ghế đôi)
    const double = Math.floor(coupleSeats / 2);

    return { total, standard, vip, double, available, maintenance };
  }, [seatMap]);

  if (!seatMap) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Icon icon="mdi:seat" className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <p className="text-gray-500">Không có dữ liệu sơ đồ ghế</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Sơ đồ ghế - Phòng {seatMap.roomId}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">
              <Icon icon="mdi:seat" className="mr-1 h-4 w-4" />
              {seatStats.total} ghế
            </Badge>
            {showSelectable && selectedSeats.length > 0 && (
              <Badge variant="default">
                <Icon icon="mdi:check" className="mr-1 h-4 w-4" />
                {selectedSeats.length} đã chọn
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Screen */}
        <div className="mb-6">
          <div className="mb-2 h-1 w-full rounded-full bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 shadow-lg"></div>
          <p className="text-center text-sm font-medium text-gray-500">MÀN HÌNH CHIẾU</p>
        </div>

        {/* Grid with row labels */}
        <div className="overflow-auto">
          <div className="flex justify-center">
            <div className="flex">
              {/* Row labels (A, B, C...) */}
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
                  const isSelected = item.seat.id ? selectedSeats.includes(item.seat.id) : false;

                  if (item.type === "double") {
                    return (
                      <div
                        key={item.seat.id || item.index}
                        className={`flex cursor-pointer items-center justify-center rounded border text-xs hover:opacity-80 ${getSeatColor(item.seat, isSelected)}`}
                        onClick={() => handleSeatClick(item.seat)}
                        style={{
                          gridColumn: "span 2",
                          height: "32px", // Fixed height
                          width: "68px", // 32px * 2 + 4px gap
                        }}
                      >
                        {item.displayCol}
                        {/* Maintenance icon overlay for double seats */}
                        {item.seat.status === "MAINTENANCE" && (
                          <Icon
                            icon="mdi:wrench"
                            className="absolute top-0 right-0 h-3 w-3 text-orange-600"
                            style={{ transform: "translate(25%, -25%)" }}
                          />
                        )}
                      </div>
                    );
                  } else {
                    // Render special content for path and blocked seats
                    let content: React.ReactNode = item.displayCol;
                    if (item.seat.type.name === "PATH") {
                      content = <Icon icon="mdi:walk" className="h-3 w-3" />;
                    } else if (item.seat.type.name === "BLOCK") {
                      content = <Icon icon="mdi:close" className="h-3 w-3" />;
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
                        {/* Maintenance icon overlay for single seats */}
                        {item.seat.status === "MAINTENANCE" && (
                          <Icon
                            icon="mdi:wrench"
                            className="absolute top-0 right-0 h-3 w-3 text-orange-600"
                            style={{ transform: "translate(25%, -25%)" }}
                          />
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
                // Show simple column numbering (1, 2, 3, ...)
                return Array.from({ length: actualDimensions.actualWidth }, (_, i) => (
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
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-blue-300 bg-blue-100"></div>
            <span className="text-sm">Ghế Thường ({seatStats.standard})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-yellow-300 bg-yellow-100"></div>
            <span className="text-sm">Ghế VIP ({seatStats.vip})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-8 rounded border border-purple-300 bg-purple-100"></div>
            <span className="text-sm">Ghế Đôi ({seatStats.double})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-200 bg-gray-50">
              <Icon icon="mdi:walk" className="h-3 w-3 text-gray-400" />
            </div>
            <span className="text-sm">Lối đi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-4 w-4 items-center justify-center rounded border border-red-300 bg-red-100">
              <Icon icon="mdi:close" className="h-3 w-3 text-red-500" />
            </div>
            <span className="text-sm">Chặn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative h-4 w-4 rounded border border-blue-300 bg-blue-100 opacity-50">
              <Icon icon="mdi:wrench" className="absolute top-0 right-0 h-2 w-2 text-orange-600" style={{ transform: "translate(25%, -25%)" }} />
            </div>
            <span className="text-sm">Bảo trì ({seatStats.maintenance})</span>
          </div>
          {showSelectable && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-blue-500 bg-blue-500"></div>
              <span className="text-sm">Đã chọn</span>
            </div>
          )}
        </div>

        {/* Seat Statistics */}
        {seatStats.total > 0 && (
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Thống kê ghế</h4>
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
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
