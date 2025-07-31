import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Shadcn/ui/dialog";
import { CalendarClock, Film, MoreHorizontal, Trophy } from "lucide-react";

// Point history detail props interface
export interface PointHistoryProps {
  id: string;
  date: string; // Ngày đi coi phim
  movieName: string;
  points: number; // Số điểm thưởng (dương nếu thêm, âm nếu sử dụng)
  pointType: "ADDING" | "USING" | "BOTH"; // Loại điểm thưởng (thêm BOTH cho trường hợp vừa cộng vừa trừ)
  addedPoints?: number; // Số điểm được cộng (trường hợp ADDING hoặc BOTH)
  usedPoints?: number; // Số điểm đã sử dụng (trường hợp USING hoặc BOTH)
}

export const PointHistoryDetail: React.FC<{ point: PointHistoryProps }> = ({ point }) => {
  const getPointBadge = (pointType: string) => {
    const pointConfig = {
      ADDING: { label: "Cộng điểm", variant: "outline" as const, className: "text-green-500" },
      USING: { label: "Sử dụng điểm", variant: "outline" as const, className: "text-orange-500" },
      BOTH: { label: "Điểm thành viên", variant: "outline" as const, className: "text-purple-500" },
    };

    const config = pointConfig[pointType as keyof typeof pointConfig] || {
      label: pointType,
      variant: "default" as const,
      className: "",
    };

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPointsDisplay = () => {
    if (point.pointType === "ADDING") {
      return <span className="font-medium text-green-500">+{point.points}</span>;
    } else if (point.pointType === "USING") {
      return <span className="font-medium text-orange-500">-{Math.abs(point.points)}</span>;
    } else if (point.pointType === "BOTH") {
      // Trường hợp vừa cộng vừa trừ
      const netPoints = (point.addedPoints || 0) - (point.usedPoints || 0);
      if (netPoints > 0) {
        return <span className="font-medium text-green-500">+{netPoints}</span>;
      } else {
        return <span className="font-medium text-orange-500">{netPoints}</span>;
      }
    }
    return <span className="font-medium">{point.points}</span>;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết điểm thưởng</DialogTitle>
          <DialogDescription>Thông tin chi tiết về điểm thưởng</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="text-primary h-12 w-12" />
              <div>
                <p className="text-muted-foreground text-sm">Mã giao dịch: {point.id}</p>
                <h3 className="font-medium">{point.movieName}</h3>
              </div>
            </div>
            {getPointBadge(point.pointType)}
          </div>

          <div className="bg-muted/20 space-y-4 rounded-md border p-4">
            {/* Thông tin chung */}
            <div className="flex items-center gap-3">
              <CalendarClock className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Ngày giao dịch</p>
                <p className="text-muted-foreground text-sm">{point.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Film className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Phim</p>
                <p className="text-muted-foreground text-sm">{point.movieName}</p>
              </div>
            </div>
          </div>

          {/* Chi tiết điểm thưởng */}
          <div className="border-t pt-4">
            {point.pointType === "BOTH" ? (
              <div className="space-y-3">
                {/* Hiển thị cả điểm cộng và điểm trừ */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Điểm thưởng:</span>
                  <span className="font-medium text-green-500">+{point.addedPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Điểm đã sử dụng:</span>
                  <span className="font-medium text-orange-500">-{point.usedPoints}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm font-medium">Tổng cộng:</span>
                  <div className="text-xl font-bold">{getPointsDisplay()}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{point.pointType === "USING" ? "Điểm đã sử dụng:" : "Điểm thưởng:"}</span>
                </div>
                <div className="text-xl font-bold">{getPointsDisplay()}</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
