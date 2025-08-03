import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Shadcn/ui/dialog";
import { Clock, CreditCard, MapPin, MoreHorizontal, Users } from "lucide-react";

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
  payOsLink?: string; // Add payOsLink for pending payments
}

export const MovieHistoryDetail: React.FC<{ movie: MovieDetailProps }> = ({ movie }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge variant="default" className="bg-green-500">
            Hoàn thành
          </Badge>
        );
      case "PENDING":
        return <Badge variant="secondary">Đang xử lý</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

          {/* Payment button for PENDING orders */}
          {movie.status === "PENDING" && movie.payOsLink && (
            <div className="pt-2">
              <Button onClick={() => window.open(movie.payOsLink, "_blank")} className="w-full bg-blue-600 hover:bg-blue-700">
                <CreditCard className="mr-2 h-4 w-4" />
                Tiếp tục thanh toán
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
