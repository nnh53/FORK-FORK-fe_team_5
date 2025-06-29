import React from "react";
import type { GridCell, SeatMapGrid, SelectedSeat } from "../../../../interfaces/seatmap.interface";
import GridSeat from "../GridSeat/GridSeat";
import SeatLegend from "../SeatLegend/SeatLegend";

interface SeatMapGridProps {
  seatMap: SeatMapGrid;
  selectedSeats: SelectedSeat[];
  onSeatSelect: (cell: GridCell) => void;
}

const SeatMapGridComponent: React.FC<SeatMapGridProps> = ({ seatMap, selectedSeats, onSeatSelect }) => {
  return (
    <div className="flex flex-col items-center p-6 rounded-xl shadow-lg">
      <SeatLegend />

      {/* Màn hình chiếu với thiết kế đẹp hơn */}
      <div className="relative w-full md:w-4/5 my-8">
        <div
          className="w-full h-3 bg-gradient-to-r from-base-300 via-base-content/20 to-base-300 rounded-full
                            shadow-[0_0_30px_8px_rgba(0,0,0,0.1)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100 to-transparent opacity-40 animate-pulse"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-200 h-8 -top-2 rounded-full opacity-30"></div>
      </div>
      <p className="text-base-content/60 text-sm mb-8 font-medium tracking-wide">MÀN HÌNH CHIẾU</p>

      {/* Sơ đồ ghế với container đẹp hơn */}
      <div className="bg-base-100 rounded-lg shadow-inner p-6 border border-base-300">
        <div className="flex flex-col gap-3 w-full">
          {seatMap.gridData.map((row, rowIndex) => {
            // Get the display row label for this row
            const displayRow = row.find((cell) => cell.type === "seat" && cell.displayRow)?.displayRow || "";

            return (
              <div key={rowIndex} className="flex items-center justify-center gap-2">
                {/* Row label - left side */}
                <span className="w-8 h-8 flex items-center justify-center font-bold text-base-content/70 bg-base-200 rounded-full text-sm shadow-sm">
                  {displayRow}
                </span>

                {/* Seats in this row */}
                <div className="flex gap-1 px-2">
                  {row.map((cell, colIndex) => {
                    // Skip rendering cells that are consumed by double seats or secondary part of double seat
                    if (cell.isConsumedByDoubleSeat || (cell.type === "seat" && cell.seatType === "d")) {
                      return <div key={`${rowIndex}-${colIndex}-consumed`} className="w-0 h-0 invisible" />;
                    }

                    return <GridSeat key={`${rowIndex}-${colIndex}`} cell={cell} selectedSeats={selectedSeats} onSeatSelect={onSeatSelect} />;
                  })}
                </div>

                {/* Row label - right side */}
                <span className="w-8 h-8 flex items-center justify-center font-bold text-base-content/70 bg-base-200 rounded-full text-sm shadow-sm">
                  {displayRow}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thông tin phòng với design đẹp hơn */}
      <div className="mt-8 text-center bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 rounded-lg shadow-sm border border-primary/20">
        <p className="text-lg font-bold text-base-content mb-1">{seatMap.roomName}</p>
        <p className="text-sm text-base-content/70">
          Kích thước:{" "}
          <span className="font-medium text-base-content">
            {seatMap.width} x {seatMap.height}
          </span>
        </p>
        <p className="text-xs text-base-content/60 mt-2">
          Tổng ghế: <span className="font-medium text-base-content/80">{seatMap.gridData.flat().filter((cell) => cell.type === "seat").length}</span>
        </p>
      </div>
    </div>
  );
};

export default SeatMapGridComponent;
