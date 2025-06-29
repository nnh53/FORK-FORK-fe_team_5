import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Icon } from "@iconify/react";
import React from "react";
import type { DatabaseSeat } from "../../../../interfaces/seat.interface";
import type { SeatMapGrid, SelectedSeat } from "../../../../interfaces/seatmap.interface";
import SeatMapEditor from "../../../booking/components/SeatMapEditor/SeatMapEditor";
import SeatMapGridComponent from "../../../booking/components/SeatMapGrid/SeatMapGrid";

interface SeatMapEditorViewProps {
  seatMap: SeatMapGrid | null;
  setSeatMap: (seatMap: SeatMapGrid | null) => void;
  selectedSeats: SelectedSeat[];
  isEditorMode: boolean;
  setIsEditorMode: (mode: boolean) => void;
  onBackToRooms: () => void;
  onSaveSeatMap: () => void;
  loading: boolean;
  // Database-aligned props
  databaseSeats?: DatabaseSeat[];
  onSeatUpdate?: (seatId: string, updates: Partial<DatabaseSeat>) => Promise<void>;
  onSeatCreate?: (seat: Omit<DatabaseSeat, "id">) => Promise<DatabaseSeat>;
  onSeatDelete?: (seatId: string) => Promise<void>;
}

export const SeatMapEditorView: React.FC<SeatMapEditorViewProps> = ({
  seatMap,
  setSeatMap,
  selectedSeats,
  isEditorMode,
  setIsEditorMode,
  onBackToRooms,
  onSaveSeatMap,
  loading,
  // Database-aligned props
  databaseSeats = [],
  onSeatUpdate,
  // onSeatCreate, // Available for future seat creation features
  // onSeatDelete, // Available for future seat deletion features
}) => {
  // Enhanced seat map update handler that syncs with database
  const handleSeatMapUpdate = async (updatedMap: SeatMapGrid) => {
    // Update the UI immediately
    setSeatMap(updatedMap);

    // If we have database handlers, sync changes to database
    if (onSeatUpdate && databaseSeats.length > 0) {
      try {
        // Compare changes and update database accordingly
        // This is a simplified approach - in a real app you'd want more sophisticated diffing
        console.log("Syncing seat map changes to database...", updatedMap);
        // For now, we'll log the changes. In a full implementation,
        // you would compare the grid changes with databaseSeats and call appropriate CRUD operations
        console.log("Database seats available for sync:", databaseSeats.length);
      } catch (error) {
        console.error("Failed to sync seat map changes to database:", error);
      }
    }
  };

  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="border-b py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center truncate">
              <Icon icon="material-symbols:edit" className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{seatMap?.roomName || "Unknown Room"}</span>
            </CardTitle>
            <CardDescription className="text-sm mt-0.5">
              {isEditorMode ? "Edit mode - Click on seats to modify layout" : "Preview mode - See how customers view the layout"}
            </CardDescription>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3 ml-4">
            <Button variant="outline" onClick={onBackToRooms} size="sm">
              <Icon icon="material-symbols:arrow-back" className="mr-1.5 h-4 w-4" />
              Back to Rooms
            </Button>

            {/* Mode Toggle */}
            <div className="hidden sm:flex border rounded-md overflow-hidden">
              <Button
                variant={!isEditorMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsEditorMode(false)}
                className="rounded-none border-0"
              >
                <Icon icon="material-symbols:visibility" className="mr-1.5 h-4 w-4" />
                Preview
              </Button>
              <Button variant={isEditorMode ? "default" : "ghost"} size="sm" onClick={() => setIsEditorMode(true)} className="rounded-none border-0">
                <Icon icon="material-symbols:edit" className="mr-1.5 h-4 w-4" />
                Edit
              </Button>
            </div>

            <Button onClick={onSaveSeatMap} disabled={loading} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              <Icon icon="material-symbols:save" className="mr-1.5 h-4 w-4" />
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isEditorMode ? (
          <div className="p-6">{seatMap && <SeatMapEditor seatMap={seatMap} onSeatMapUpdate={handleSeatMapUpdate} />}</div>
        ) : (
          <div className="p-6">
            {seatMap && (
              <div className="p-8 rounded-lg border shadow-inner bg-muted/30">
                <SeatMapGridComponent seatMap={seatMap} selectedSeats={selectedSeats} onSeatSelect={() => {}} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
