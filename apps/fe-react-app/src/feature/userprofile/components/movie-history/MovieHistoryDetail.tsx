import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Shadcn/ui/dialog";
import { Clock, MapPin, MoreHorizontal, Users } from "lucide-react";

// Movie detail props interface
export interface MovieDetailProps {
  id: string;
  receiptId: string;
  movieName: string;
  room: string;
  movieSlot: string;
  seats: (string | undefined)[];
  points: number; // Keep this in the interface for compatibility
  poster: string;
  status: string;
}

export const MovieHistoryDetail: React.FC<{ movie: MovieDetailProps }> = ({ movie }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: "Đã xác nhận", variant: "default" as const },
      paid: { label: "Đã thanh toán", variant: "secondary" as const },
      cancelled: { label: "Đã hủy", variant: "destructive" as const },
      refunded: { label: "Đã hoàn tiền", variant: "outline" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "default" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
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
          <DialogTitle>Chi tiết giao dịch</DialogTitle>
          <DialogDescription>Thông tin chi tiết về vé đã đặt</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={movie.poster} alt={movie.movieName} className="h-20 w-16 rounded object-cover" />
            <div>
              <h3 className="font-medium">{movie.movieName}</h3>
              <p className="text-muted-foreground text-sm">Mã: {movie.receiptId}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">{movie.room}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">{movie.movieSlot}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Ghế: {movie.seats.filter(Boolean).join(", ")}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Trạng thái:</span>
            {getStatusBadge(movie.status)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
