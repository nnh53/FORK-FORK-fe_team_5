import { Badge } from "@/components/Shadcn/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Seat, SeatMap } from "@/interfaces/seat.interface";
import { Icon } from "@iconify/react";
import React from "react";
import { toast } from "sonner";

interface BookingSeatMapProps {
  seatMap: SeatMap | null;
  selectedSeats: number[];
  onSeatSelect: (seatId: number) => void;
  bookedSeats?: number[]; // Seats that are already booked by others
  allowGapSeats?: boolean; // Allow gap seats for admin/staff
}

const BookingSeatMap: React.FC<BookingSeatMapProps> = ({ seatMap, selectedSeats = [], onSeatSelect, bookedSeats = [], allowGapSeats = false }) => {
  // Helper function to get consecutive groups of empty seats
  const getConsecutiveGroups = React.useCallback((emptySeats: Seat[], selectableRowSeats: Seat[]): number[][] => {
    const consecutiveGroups: number[][] = [];
    let currentGroup: number[] = [];

    for (const seat of selectableRowSeats) {
      const isEmpty = emptySeats.some((emptySeat) => emptySeat.id === seat.id);

      if (isEmpty) {
        currentGroup.push(seat.id);
      } else {
        if (currentGroup.length > 0) {
          consecutiveGroups.push([...currentGroup]);
          currentGroup = [];
        }
      }
    }

    if (currentGroup.length > 0) {
      consecutiveGroups.push(currentGroup);
    }

    return consecutiveGroups;
  }, []);

  // Helper function to check if seat is at edge of any group
  const isAtEdgeOfGroup = React.useCallback((seatId: number, groups: number[][]): boolean => {
    return groups.some((group) => group[0] === seatId || group[group.length - 1] === seatId);
  }, []);

  // Function to check if selecting a seat (single or couple) would create invalid gaps
  const wouldCreateGap = React.useCallback(
    (seatToSelect: Seat): boolean => {
      if (allowGapSeats || !seatMap) return false;

      // Get all seats in the same row (including all types to check gaps properly)
      const allRowSeats = seatMap.gridData.filter((s) => s.row === seatToSelect.row).sort((a, b) => parseInt(a.column) - parseInt(b.column));

      // Get only selectable seats for gap checking
      const selectableRowSeats = allRowSeats.filter(
        (s) => s.status === "AVAILABLE" && !s.discarded && !["PATH", "BLOCK"].includes(s.type.name ?? ""),
      );

      // Build current state: which seats are already taken
      const occupiedByOthers = seatMap.gridData.filter((s) => s.selected === true).map((s) => s.id);
      const currentlyOccupied = new Set([...(selectedSeats || []), ...(bookedSeats || []), ...occupiedByOthers]);

      // Check current gaps before selecting this seat
      const currentEmptySeats = selectableRowSeats.filter((seat) => !currentlyOccupied.has(seat.id));

      // If the seat to select is not in the current empty seats, something's wrong
      if (!currentEmptySeats.some((seat) => seat.id === seatToSelect.id)) {
        return false;
      }

      // Special case: If there are only 1 or 2 empty seats left, allow any selection
      if (currentEmptySeats.length <= 2) {
        return false;
      }

      // Group current empty seats into consecutive blocks
      const currentConsecutiveGroups = getConsecutiveGroups(currentEmptySeats, selectableRowSeats);

      // Check if target seat is at the edge of any group (can be selected safely)
      if (isAtEdgeOfGroup(seatToSelect.id, currentConsecutiveGroups)) {
        return false;
      }

      // Simulate what would happen if we select this seat
      const futureEmptySeats = currentEmptySeats.filter((seat) => seat.id !== seatToSelect.id);

      // Group consecutive empty seats and check for single-seat gaps
      const consecutiveGroups = getConsecutiveGroups(futureEmptySeats, selectableRowSeats);

      // Check if any group has exactly 1 seat (this would be a gap)
      return consecutiveGroups.some((group) => group.length === 1);
    },
    [seatMap, selectedSeats, bookedSeats, allowGapSeats, getConsecutiveGroups, isAtEdgeOfGroup],
  );

  // Calculate actual dimensions based on seat data
  const actualDimensions = React.useMemo(() => {
    if (!seatMap || seatMap.gridData.length === 0) {
      return { actualWidth: 0, actualHeight: 0 };
    }

    const seats = seatMap.gridData;
    let maxRow = 0;
    let maxCol = 0;

    seats.forEach((seat) => {
      // API structure: row is letter (A,B,C...), column is number (1,2,3...)
      const rowIndex = seat.row.charCodeAt(0) - 65; // A=0, B=1, etc.
      const colIndex = parseInt(seat.column) - 1; // 1=0, 2=1, etc.

      maxRow = Math.max(maxRow, rowIndex);
      maxCol = Math.max(maxCol, colIndex);
    });

    return {
      actualWidth: maxCol + 1,
      actualHeight: maxRow + 1,
    };
  }, [seatMap]);

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

  // Function to determine seat state and styling
  const getSeatState = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    const isBooked = bookedSeats.includes(seat.id) || seat.selected === true; // seat.selected means booked by others
    const isAvailable = seat.status === "AVAILABLE";
    const isMaintenance = seat.status === "MAINTENANCE";
    const isDiscarded = seat.discarded;
    // Do not apply gap logic for COUPLE seats
    const wouldCreateGapIfSelected = seat.type.name !== "COUPLE" && !isSelected && wouldCreateGap(seat);

    return {
      isSelected,
      isBooked,
      isAvailable,
      isMaintenance,
      isDiscarded,
      wouldCreateGapIfSelected,
      isSelectable: isAvailable && !isBooked && !isMaintenance && !isDiscarded && !isSelected && !wouldCreateGapIfSelected,
    };
  };

  // Function to get seat color based on seat type and status
  const getSeatColor = (seat: Seat, isSelected: boolean = false): string => {
    const state = getSeatState(seat);
    const baseClass = "border rounded flex items-center justify-center text-xs cursor-pointer hover:opacity-80 relative";

    if (isSelected) {
      return `${baseClass} bg-green-500 text-white border-green-500 ring-2 ring-green-300`;
    }

    if (state.isBooked) {
      return `${baseClass} bg-red-500 text-white border-red-500 cursor-not-allowed`;
    }

    // Show warning style for seats that would create gaps
    // if (state.wouldCreateGapIfSelected && !allowGapSeats) {
    //   return `${baseClass} bg-orange-100 border-orange-300 text-orange-800 cursor-not-allowed opacity-60`;
    // }

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

    // Remove indicator for non-selectable seats
    return `${baseColor} ${maintenanceOverlay}`;
  };

  const handleSeatClick = (seat: Seat) => {
    const state = getSeatState(seat);
    // Allow deselecting a selected seat
    if (state.isSelected && seat.id) {
      onSeatSelect(seat.id);
      return;
    }
    if (state.isSelectable && seat.id) {
      onSeatSelect(seat.id);
    } else {
      // Debug: log why seat is not selectable
      console.log("Seat not selectable:", seat.name, {
        isAvailable: state.isAvailable,
        isBooked: state.isBooked,
        isMaintenance: state.isMaintenance,
        isDiscarded: state.isDiscarded,
        isSelected: state.isSelected,
        wouldCreateGapIfSelected: state.wouldCreateGapIfSelected,
      });

      if (state.wouldCreateGapIfSelected && !allowGapSeats) {
        // Show warning message about gap creation
        toast.warning("Việc chọn ghế của bạn không được để trống 1 ghế ở bên trái, giữa hoặc bên phải trên cùng một hàng ghế mà bạn vừa chọn!");
      }
    }
  };

  // Calculate seat statistics
  const seatStats = React.useMemo(() => {
    if (!seatMap) return { total: 0, available: 0, selected: 0, booked: 0 };

    const total = seatMap.gridData.length;
    const selected = selectedSeats.length;

    // Count booked seats (including those selected by others)
    const booked = seatMap.gridData.filter((seat) => bookedSeats.includes(seat.id) || seat.selected === true).length;

    // Count available seats (not booked, not selected by others, not maintenance, not discarded)
    const available = seatMap.gridData.filter((seat) => {
      const isBookedByOthers = seat.selected === true;
      return seat.status === "AVAILABLE" && !bookedSeats.includes(seat.id) && !seat.discarded && !isBookedByOthers;
    }).length;

    return { total, available, selected, booked };
  }, [seatMap, selectedSeats, bookedSeats]);

  if (!seatMap || !seatMap.gridData || seatMap.gridData.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Icon icon="mdi:seat" className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <p className="text-gray-500">Không có dữ liệu sơ đồ ghế</p>
        </CardContent>
      </Card>
    );
  }

  // If dimensions are 0, also show empty state
  if (actualDimensions.actualWidth === 0 || actualDimensions.actualHeight === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Icon icon="mdi:seat" className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <p className="text-gray-500">Dữ liệu sơ đồ ghế không hợp lệ</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Chọn ghế</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-600">
              <Icon icon="mdi:check-circle" className="mr-1 h-4 w-4" />
              Đã chọn: {seatStats.selected}
            </Badge>
            <Badge variant="outline">
              <Icon icon="mdi:seat" className="mr-1 h-4 w-4" />
              Còn trống: {seatStats.available}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Screen */}
        <div className="mb-6">
          <div className="mb-2 h-1 w-full rounded-full bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 shadow-lg"></div>
          <p className="text-center text-sm font-medium text-gray-500">MÀN HÌNH CHIẾU</p>
        </div>

        {/* Grid with row labels - matching SeatMapEditorView structure */}
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
                  const { isSelected, isSelectable } = getSeatState(item.seat);

                  if (item.type === "double") {
                    return (
                      <div
                        key={item.seat.id || item.index}
                        className={getSeatColor(item.seat, isSelected)}
                        onClick={() => handleSeatClick(item.seat)}
                        style={{
                          gridColumn: "span 2",
                          height: "32px", // Fixed height
                          width: "68px", // 32px * 2 + 4px gap
                        }}
                        aria-disabled={!isSelectable}
                      >
                        {item.displayCol}
                        {/* Maintenance icon overlay for double seats */}
                        {item.seat.status === "MAINTENANCE" && (
                          <Icon
                            icon="mdi:wrench"
                            className="absolute right-0 top-0 h-3 w-3 text-orange-600"
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
                        className={getSeatColor(item.seat, isSelected)}
                        onClick={() => handleSeatClick(item.seat)}
                        style={{
                          height: "32px", // Fixed height
                          width: "32px", // Fixed width
                        }}
                        aria-disabled={!isSelectable}
                      >
                        {content}
                        {/* Maintenance icon overlay for single seats */}
                        {item.seat.status === "MAINTENANCE" && (
                          <Icon
                            icon="mdi:wrench"
                            className="absolute right-0 top-0 h-3 w-3 text-orange-600"
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
                    width: "32px",
                    height: "24px",
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-blue-300 bg-blue-100"></div>
            <span className="text-sm">Ghế thường</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-yellow-300 bg-yellow-100"></div>
            <span className="text-sm">Ghế VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-8 rounded border border-purple-300 bg-purple-100"></div>
            <span className="text-sm">Ghế đôi</span>
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
            <div className="h-4 w-4 rounded bg-red-500"></div>
            <span className="text-sm">Đã đặt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-orange-500"></div>
            <span className="text-sm">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-green-500"></div>
            <span className="text-sm">Đã chọn</span>
          </div>
          {!allowGapSeats && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-orange-300 bg-orange-100 opacity-60"></div>
              <span className="text-sm">Không thể chọn (tạo khoảng trống)</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="relative h-4 w-4 rounded border border-gray-300 bg-gray-100 opacity-50">
              <Icon icon="mdi:wrench" className="absolute right-0 top-0 h-2 w-2 text-orange-600" style={{ transform: "translate(25%, -25%)" }} />
            </div>
            <span className="text-sm">Bảo trì</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSeatMap;
