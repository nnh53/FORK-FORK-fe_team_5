import { Icon } from "@iconify/react";
import { Plus } from "lucide-react";
import React from "react";
import type { SeatMapGrid } from "../../../../interfaces/seatmap.interface";

interface PageHeaderProps {
  isEditorView: boolean;
  seatMap: SeatMapGrid | null;
  loading: boolean;
  onAddRoom: () => void;
  onBackToRooms: () => void;
  onSaveSeatMap: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ isEditorView, seatMap, loading, onAddRoom, onBackToRooms, onSaveSeatMap }) => {
  return (
    <div className="bg-base-100 rounded-box shadow-lg border border-base-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center text-sm text-base-content/60 mb-1">
              <span>Management</span>
              <Icon icon="material-symbols:chevron-right" className="mx-2 h-4 w-4" />
              <span className="text-primary font-medium">Cinema Rooms</span>
              {isEditorView && seatMap && (
                <>
                  <Icon icon="material-symbols:chevron-right" className="mx-2 h-4 w-4" />
                  <span className="text-primary font-medium truncate">{seatMap.roomName}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl font-bold text-base-content truncate">
              {isEditorView ? `Editing: ${seatMap?.roomName || "Room"}` : "Cinema Room Management"}
            </h1>
            <p className="text-base-content/70 text-sm mt-0.5">
              {isEditorView ? "Design and configure the seat layout for this cinema room" : "Manage cinema rooms and seat layouts efficiently"}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {!isEditorView ? (
              <button onClick={onAddRoom} disabled={loading} className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="mr-1.5 h-4 w-4" />
                {loading ? "Creating..." : "Create Room"}
              </button>
            ) : (
              <>
                <button onClick={onBackToRooms} className="btn btn-ghost btn-sm border-base-300 hover:bg-base-200 transition-colors">
                  <Icon icon="material-symbols:arrow-back" className="mr-1.5 h-4 w-4" />
                  Back to Rooms
                </button>
                <button onClick={onSaveSeatMap} disabled={loading} className="btn btn-success shadow-md hover:shadow-lg transition-all duration-200">
                  <Icon icon="material-symbols:save" className="mr-1.5 h-4 w-4" />
                  {loading ? "Saving..." : "Save Layout"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
