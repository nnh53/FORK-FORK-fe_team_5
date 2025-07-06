import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { SeatMap } from "@/interfaces/seat.interface";
import { Ticket } from "lucide-react";
import React from "react";
import BookingSeatMap from "../../../booking/components/BookingSeatMap/BookingSeatMap";
import type { UIShowtime } from "../types";

interface SeatSelectionProps {
  selectedShowtime: UIShowtime;
  seatMap: SeatMap | null;
  selectedSeatIds: number[];
  seatsLoading: boolean;
  onSeatSelect: (seatId: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ selectedShowtime, seatMap, selectedSeatIds, seatsLoading, onSeatSelect, onBack, onNext }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Chọn Ghế - {selectedShowtime.startTime} {selectedShowtime.date}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Screen */}
        <div className="mb-6 text-center">
          <div className="inline-block rounded-lg bg-gray-300 px-8 py-2">MÀN HÌNH</div>
        </div>

        {seatsLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Đang tải sơ đồ ghế...</div>
          </div>
        )}

        {!seatsLoading && seatMap && <BookingSeatMap seatMap={seatMap} selectedSeats={selectedSeatIds} onSeatSelect={onSeatSelect} />}

        {!seatsLoading && !seatMap && (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Không có dữ liệu ghế</div>
          </div>
        )}

        {selectedSeatIds.length > 0 && (
          <div className="mt-6 text-center">
            <p className="font-semibold">Đã chọn: {selectedSeatIds.length} ghế</p>
            <div className="mt-4 flex justify-center gap-2">
              <Button variant="outline" onClick={onBack}>
                Quay lại
              </Button>
              <Button onClick={onNext}>Tiếp tục</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeatSelection;
