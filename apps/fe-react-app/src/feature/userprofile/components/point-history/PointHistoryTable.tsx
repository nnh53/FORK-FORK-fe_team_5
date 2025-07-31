import { Badge } from "@/components/Shadcn/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { CalendarClock, Film, TrophyIcon } from "lucide-react";
import { PointHistoryDetail, type PointHistoryProps } from "./PointHistoryDetail";

interface PointHistoryTableProps {
  pointHistory: PointHistoryProps[];
}

export const PointHistoryTable: React.FC<PointHistoryTableProps> = ({ pointHistory }) => {
  const getPointBadge = (pointType: string) => {
    switch (pointType) {
      case "ADDING":
        return (
          <Badge variant="default" className="bg-green-500">
            Cộng điểm
          </Badge>
        );
      case "USING":
        return (
          <Badge variant="outline" className="text-orange-500">
            Sử dụng điểm
          </Badge>
        );
      case "REFUND":
        return (
          <Badge variant="outline" className="text-blue-500">
            Hoàn điểm
          </Badge>
        );
      default:
        return <Badge variant="outline">{pointType}</Badge>;
    }
  };

  const getPointsDisplay = (point: PointHistoryProps) => {
    if (point.pointType === "ADDING" || point.pointType === "REFUND") {
      return <span className="font-medium text-green-500">+{point.points}</span>;
    } else {
      return <span className="font-medium text-orange-500">-{Math.abs(point.points)}</span>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Phim</TableHead>
          <TableHead className="hidden md:table-cell">Ngày xem</TableHead>
          <TableHead>Điểm thưởng</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pointHistory.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-8 text-center">
              <div className="text-muted-foreground">
                <TrophyIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>Không tìm thấy lịch sử điểm thưởng cho khoảng thời gian đã chọn.</p>
                <p className="text-sm">Hãy mua vé xem phim để tích lũy điểm thưởng tại đây</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          pointHistory.map((point) => (
            <TableRow key={point.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <Film className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{point.movieName}</p>
                    <div className="text-muted-foreground space-y-1 text-xs md:hidden">
                      <p>{point.date}</p>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <CalendarClock className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{point.date}</span>
                </div>
              </TableCell>
              <TableCell>{getPointsDisplay(point)}</TableCell>
              <TableCell>{getPointBadge(point.pointType)}</TableCell>
              <TableCell>
                <PointHistoryDetail point={point} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
