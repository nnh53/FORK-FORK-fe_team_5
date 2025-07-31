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
  pointType: "ADDING" | "USING" | "REFUND"; // Loại điểm thưởng
}

export const PointHistoryDetail: React.FC<{ point: PointHistoryProps }> = ({ point }) => {
  const getPointBadge = (pointType: string) => {
    const pointConfig = {
      ADDING: { label: "Cộng điểm", variant: "default" as const, className: "bg-green-500" },
      USING: { label: "Sử dụng điểm", variant: "outline" as const, className: "text-orange-500" },
      REFUND: { label: "Hoàn điểm", variant: "outline" as const, className: "text-blue-500" },
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
    if (point.pointType === "ADDING" || point.pointType === "REFUND") {
      return <span className="font-medium text-green-500">+{point.points}</span>;
    } else {
      return <span className="font-medium text-orange-500">-{Math.abs(point.points)}</span>;
    }
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
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Trophy className="text-primary h-12 w-12" />
            <div>
              <h3 className="font-medium">Điểm thưởng: {getPointsDisplay()}</h3>
              <p className="text-muted-foreground text-sm">ID: {point.id}</p>
            </div>
          </div>

          {/* Thông tin chung */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Ngày: {point.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Film className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Phim: {point.movieName}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Loại:</span>
            {getPointBadge(point.pointType)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
