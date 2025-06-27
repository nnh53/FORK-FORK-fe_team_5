import React from "react";
import type { SeatMapGrid, GridCell, SelectedSeat } from "../../../../interfaces/seatmap.interface";
import GridSeat from "../GridSeat/GridSeat";
import SeatLegend from "../SeatLegend/SeatLegend";

interface SeatMapGridProps {
  seatMap: SeatMapGrid;
  selectedSeats: SelectedSeat[];
  onSeatSelect: (cell: GridCell) => void;
}

const SeatMapGridComponent: React.FC<SeatMapGridProps> = ({
  seatMap,
  selectedSeats,
  onSeatSelect
}) => {
  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl shadow-lg">
      <SeatLegend />

      {/* Màn hình chiếu với hiệu ứng đẹp hơn */}
      <div className="relative w-full md:w-4/5 my-8">
        <div
          className="w-full h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full
                            shadow-[0_0_30px_8px_rgba(200,200,200,0.6)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 h-8 -top-2 rounded-full opacity-30"></div>
      </div>
      <p className="text-gray-500 text-sm mb-8 font-medium tracking-wide">MÀN HÌNH CHIẾU</p>

      {/* Sơ đồ ghế với container đẹp hơn */}
      <div className="bg-white rounded-lg shadow-inner p-6 border border-gray-100">
        <div className="flex flex-col gap-3 w-full">
          {seatMap.gridData.map((row, rowIndex) => {
            // Get the display row label for this row
            const displayRow = row.find(cell => cell.type === 'seat' && cell.displayRow)?.displayRow || '';

            return (
              <div key={rowIndex} className="flex items-center justify-center gap-2">
                {/* Row label - left side */}
                <span className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 bg-gray-100 rounded-full text-sm shadow-sm">
                  {displayRow}
                </span>

                {/* Seats in this row */}
                <div className="flex gap-1 px-2">
                  {row.map((cell, colIndex) => {
                    // Skip rendering cells that are consumed by double seats
                    if (cell.isConsumedByDoubleSeat) {
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}-consumed`}
                          className="w-0 h-0 invisible"
                        />
                      );
                    }

                    return (
                      <GridSeat
                        key={`${rowIndex}-${colIndex}`}
                        cell={cell}
                        selectedSeats={selectedSeats}
                        onSeatSelect={onSeatSelect}
                      />
                    );
                  })}
                </div>

                {/* Row label - right side */}
                <span className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 bg-gray-100 rounded-full text-sm shadow-sm">
                  {displayRow}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thông tin phòng với design đẹp hơn */}
      <div className="mt-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 rounded-lg shadow-sm border border-blue-100">
        <p className="text-lg font-bold text-gray-700 mb-1">{seatMap.roomName}</p>
        <p className="text-sm text-gray-500">
          Kích thước: <span className="font-medium text-gray-700">{seatMap.width} x {seatMap.height}</span>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Tổng ghế: <span className="font-medium text-gray-600">
            {seatMap.gridData.flat().filter(cell => cell.type === 'seat').length}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SeatMapGridComponent;
