import { Badge } from "@/components/Shadcn/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Seat, SeatMap } from "@/interfaces/seat.interface";
import { Icon } from "@iconify/react";
import React from "react";
import { toast } from "sonner";
import SeatLegend from "../SeatLegend/SeatLegend";

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
            displayCol: seat.name,
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
            displayCol: seat.name,
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
          displayCol: seat.name,
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

    // Prevent selection of BLOCK and PATH seat types
    const isBlockOrPath = seat.type.name === "BLOCK" || seat.type.name === "PATH";

    return {
      isSelected,
      isBooked,
      isAvailable,
      isMaintenance,
      isDiscarded,
      wouldCreateGapIfSelected,
      isSelectable: isAvailable && !isBooked && !isMaintenance && !isDiscarded && !isSelected && !wouldCreateGapIfSelected && !isBlockOrPath,
    };
  };

  // Function to get seat color based on seat type and status
  const getSeatColor = (seat: Seat, isSelected = false): string => {
    const state = getSeatState(seat);
    const baseClass = "border rounded flex items-center justify-center text-xs cursor-pointer hover:opacity-80 relative";

    if (isSelected) {
      return `${baseClass} bg-green-500 text-white border-green-500 ring-2 ring-green-300`;
    }

    if (state.isBooked) {
      return `${baseClass} bg-red-500 text-white border-red-500 cursor-not-allowed`;
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
        baseColor = `border rounded flex items-center justify-center text-xs bg-gray-50 border-gray-200 text-gray-500`;
        break;
      case "BLOCK":
        baseColor = `border rounded flex items-center justify-center text-xs bg-red-100 border-red-300 text-red-800`;
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
    // Prevent selection of BLOCK and PATH seat types
    if (seat.type.name === "BLOCK" || seat.type.name === "PATH") {
      return;
    }
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
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-4">
          <CardTitle className="text-lg sm:text-xl">Chọn ghế</CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <Badge variant="outline" className="text-green-600">
              <Icon icon="mdi:check-circle" className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Đã chọn: {seatStats.selected}
            </Badge>
            <Badge variant="outline">
              <Icon icon="mdi:seat" className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Còn trống: {seatStats.available}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        {/* Screen */}
        <div className="mb-4 sm:mb-6">
          <div className="mb-2 h-0.5 w-full rounded-full bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 shadow-lg sm:h-1"></div>
          <p className="text-center text-xs font-medium text-gray-500 sm:text-sm">MÀN HÌNH CHIẾU</p>
        </div>

        {/* Grid with row labels - matching SeatMapEditorView structure */}
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="flex min-w-fit justify-center px-2 sm:px-0">
            <div className="flex">
              {/* Row labels (A, B, C...) */}
              <div className="mr-1 flex flex-shrink-0 flex-col sm:mr-2">
                {Array.from({ length: actualDimensions.actualHeight }, (_, i) => (
                  <div
                    key={i}
                    className="mb-0.5 flex h-6 w-4 items-center justify-center text-xs font-medium text-gray-500 sm:mb-1 sm:h-8 sm:w-6 sm:text-sm"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>

              {/* Seat grid */}
              <div
                className="grid flex-shrink-0 gap-0.5 sm:gap-1"
                style={{
                  gridTemplateColumns: `repeat(${actualDimensions.actualWidth}, minmax(0, 1fr))`,
                  minWidth: `${actualDimensions.actualWidth * 24 + (actualDimensions.actualWidth - 1) * 2}px`,
                }}
              >
                {/* Using render items for proper double seat handling */}
                {createRenderItems.map((item) => {
                  const { isSelected, isSelectable } = getSeatState(item.seat);

                  if (item.type === "double") {
                    return (
                      <div
                        key={item.seat.id || item.index}
                        className={`${getSeatColor(item.seat, isSelected)} relative flex h-6 items-center justify-center text-xs sm:[margin-right:var(--double-seat-margin)] sm:[margin-left:var(--double-seat-margin)] sm:h-8 sm:[width:var(--double-seat-width)] sm:text-sm`}
                        onClick={() => handleSeatClick(item.seat)}
                        style={
                          {
                            gridColumn: "span 2",
                            width: "calc(100% + 1px)", // Mobile: gap-0.5 = 2px, thêm 1/2 gap = 1px
                            marginLeft: "-0.5px", // Mobile: giảm 1/4 gap = 0.5px
                            marginRight: "-0.5px",
                            "--double-seat-width": "calc(100% + 2px)", // Desktop: gap-1 = 4px, thêm 1/2 gap = 2px
                            "--double-seat-margin": "-1px", // Desktop: giảm 1/4 gap = 1px
                          } as React.CSSProperties & {
                            "--double-seat-width": string;
                            "--double-seat-margin": string;
                          }
                        }
                        aria-disabled={!isSelectable}
                      >
                        {item.displayCol}
                        {/* Maintenance icon overlay for double seats */}
                        {item.seat.status === "MAINTENANCE" && (
                          <Icon
                            icon="mdi:wrench"
                            className="absolute top-0 right-0 h-2 w-2 text-orange-600 sm:h-3 sm:w-3"
                            style={{ transform: "translate(25%, -25%)" }}
                          />
                        )}
                      </div>
                    );
                  } else {
                    // Render special content for path and blocked seats
                    let content: React.ReactNode = item.displayCol;
                    if (item.seat.type.name === "PATH") {
                      content = <Icon icon="mdi:walk" className="h-2 w-2 sm:h-3 sm:w-3" />;
                    } else if (item.seat.type.name === "BLOCK") {
                      content = <Icon icon="mdi:close" className="h-2 w-2 sm:h-3 sm:w-3" />;
                    }
                    return (
                      <div
                        key={item.seat.id || item.index}
                        className={`${getSeatColor(item.seat, isSelected)} h-6 w-6 text-xs sm:h-8 sm:w-8 sm:text-sm`}
                        onClick={() => handleSeatClick(item.seat)}
                        aria-disabled={!isSelectable}
                      >
                        {content}
                        {/* Maintenance icon overlay for single seats */}
                        {item.seat.status === "MAINTENANCE" && (
                          <Icon
                            icon="mdi:wrench"
                            className="absolute top-0 right-0 h-2 w-2 text-orange-600 sm:h-3 sm:w-3"
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
        <div className="mt-2 flex justify-center sm:mt-4">
          <div className="flex">
            {/* Space for row labels */}
            <div className="w-4 sm:w-6"></div>

            {/* Column numbers */}
            <div
              className="grid gap-0.5 sm:gap-1"
              style={{
                gridTemplateColumns: `repeat(${actualDimensions.actualWidth}, 1fr)`,
              }}
            >
              {Array.from({ length: actualDimensions.actualWidth }, (_, i) => (
                <div key={i} className="flex h-4 w-6 items-center justify-center text-xs font-medium text-gray-500 sm:h-6 sm:w-8 sm:text-sm">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <SeatLegend />
      </CardContent>
    </Card>
  );
};

export default BookingSeatMap;
