import { Badge } from "@/components/Shadcn/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { Clock, Film, MapPin, Star, Users } from "lucide-react";
import type { MovieDetailProps } from "./MovieHistoryDetail";
import { MovieHistoryDetail } from "./MovieHistoryDetail";

interface MovieHistoryTableProps {
  movieHistory: MovieDetailProps[];
}

export const MovieHistoryTable: React.FC<MovieHistoryTableProps> = ({ movieHistory }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge variant="default" className="bg-green-500">
            Hoàn thành
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>;
      case "PENDING":
        return <Badge variant="outline">Đang xử lý</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden md:table-cell">Mã hóa đơn</TableHead>
          <TableHead>Phim</TableHead>
          <TableHead className="hidden lg:table-cell">Rạp chiếu</TableHead>
          <TableHead className="hidden md:table-cell">Suất chiếu</TableHead>
          <TableHead className="hidden lg:table-cell">Ghế</TableHead>
          <TableHead className="hidden md:table-cell">Điểm</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movieHistory.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="py-8 text-center">
              <div className="text-muted-foreground">
                <Film className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>Chưa có lịch sử giao dịch nào</p>
                <p className="text-sm">Hãy đặt vé xem phim để xem lịch sử tại đây</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          movieHistory.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell className="hidden font-medium md:table-cell">{movie.receiptId}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img src={movie.poster} alt={movie.movieName} className="h-16 w-12 rounded object-cover" />
                  <div className="space-y-1">
                    <p className="font-medium">{movie.movieName}</p>
                    <div className="text-muted-foreground space-y-1 text-sm md:hidden">
                      <p>#{movie.receiptId}</p>
                      <p>{movie.room}</p>
                      <p>{movie.movieSlot}</p>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{movie.room}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{movie.movieSlot}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{movie.seats.join(", ")}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{movie.points}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(movie.status)}</TableCell>
              <TableCell>
                <MovieHistoryDetail movie={movie} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
