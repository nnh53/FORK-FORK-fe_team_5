import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Icon } from "@iconify/react";
import React from "react";
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
}) => {
  return (
    <Card className="shadow-xl border-base-300 overflow-hidden bg-base-100">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-base-300 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg text-base-content flex items-center truncate">
              <Icon icon="material-symbols:edit" className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
              <span className="truncate">{seatMap?.roomName || "Unknown Room"}</span>
            </CardTitle>
            <CardDescription className="text-sm text-base-content/70 mt-0.5">
              {isEditorMode ? "Chế độ chỉnh sửa - Click vào ghế để thay đổi layout" : "Chế độ xem trước - Xem cách khách hàng thấy layout"}
            </CardDescription>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2 ml-4">
            <button onClick={onBackToRooms} className="btn btn-ghost btn-sm border-base-300 hover:bg-base-200 transition-colors">
              <Icon icon="material-symbols:arrow-back" className="mr-1.5 h-4 w-4" />
              Back to Rooms
            </button>
            <div className="hidden sm:flex rounded-md bg-base-100 border border-base-300 shadow-sm overflow-hidden">
              <button
                onClick={() => setIsEditorMode(false)}
                className={`px-3 py-1.5 text-sm font-medium transition-all duration-150 flex items-center ${
                  !isEditorMode ? "bg-primary text-primary-content" : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                }`}
              >
                <Icon icon="material-symbols:visibility" className="mr-1.5 h-4 w-4" />
                Preview
              </button>
              <button
                onClick={() => setIsEditorMode(true)}
                className={`px-3 py-1.5 text-sm font-medium transition-all duration-150 flex items-center ${
                  isEditorMode ? "bg-primary text-primary-content" : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                }`}
              >
                <Icon icon="material-symbols:edit" className="mr-1.5 h-4 w-4" />
                Edit
              </button>
            </div>
            <button
              onClick={onSaveSeatMap}
              disabled={loading}
              className="btn btn-success btn-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Icon icon="material-symbols:save" className="mr-1.5 h-4 w-4" />
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isEditorMode ? (
          <div className="p-6">
            <div className="mb-4 p-4 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-center">
                <Icon icon="material-symbols:info" className="h-5 w-5 text-info mr-2" />
                <div>
                  <p className="text-sm font-medium text-info">Chế độ chỉnh sửa</p>
                  <p className="text-xs text-info/80">Click vào các ô để thay đổi loại ghế hoặc tạo lối đi</p>
                </div>
              </div>
            </div>
            {seatMap && <SeatMapEditor seatMap={seatMap} onSeatMapUpdate={setSeatMap} />}
          </div>
        ) : (
          <div className="p-6">
            {seatMap && (
              <div className="bg-gradient-to-br from-base-200/50 to-primary/10 p-8 rounded-lg border border-base-300 shadow-inner">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold text-base-content mb-2">Xem trước sơ đồ ghế</h3>
                  <p className="text-sm text-base-content/70">Đây là cách khách hàng sẽ thấy sơ đồ ghế của phòng chiếu</p>
                </div>
                <SeatMapGridComponent seatMap={seatMap} selectedSeats={selectedSeats} onSeatSelect={() => {}} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
