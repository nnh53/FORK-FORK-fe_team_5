import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Calendar } from "@/components/Shadcn/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Shadcn/ui/popover";
import { Separator } from "@/components/Shadcn/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { CalendarDays, Clock, Film, MapPin, Star, Users } from "lucide-react";
import { useState } from "react";

export const MyMovieHistory: React.FC = () => {
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);

  // Static data for UI preview - will be replaced with real API
  const staticMovieHistory = [
    {
      id: "1",
      receiptId: "HD001",
      movieName: "Avatar: The Way of Water",
      room: "Cinema 1 - Rạp Nguyễn Trãi",
      movieSlot: "2024-06-15 19:30",
      seats: ["A1", "A2"],
      points: 150,
      poster: "https://via.placeholder.com/100x150",
      status: "completed",
    },
    {
      id: "2",
      receiptId: "HD002",
      movieName: "Top Gun: Maverick",
      room: "Cinema 2 - Rạp Vincom",
      movieSlot: "2024-06-10 21:00",
      seats: ["B5", "B6"],
      points: 120,
      poster: "https://via.placeholder.com/100x150",
      status: "completed",
    },
    {
      id: "3",
      receiptId: "HD003",
      movieName: "Spider-Man: No Way Home",
      room: "Cinema 3 - Rạp Lotte",
      movieSlot: "2024-06-05 16:15",
      seats: ["C3"],
      points: 100,
      poster: "https://via.placeholder.com/100x150",
      status: "cancelled",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Hoàn thành
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Film className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Lọc theo thời gian
          </CardTitle>
          <CardDescription>Chọn khoảng thời gian để xem lịch sử</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Từ ngày</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-48 justify-start font-normal">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {from ? from.toLocaleDateString("vi-VN") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={from}
                    onSelect={setFrom}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Đến ngày</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-48 justify-start font-normal">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {to ? to.toLocaleDateString("vi-VN") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={to} onSelect={setTo} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium opacity-0">Action</label>
              <Button className="w-32">Áp dụng</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Movie History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            Lịch sử xem phim
          </CardTitle>
          <CardDescription>Danh sách các phim bạn đã xem tại FCinema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hóa đơn</TableHead>
                <TableHead>Phim</TableHead>
                <TableHead>Rạp chiếu</TableHead>
                <TableHead>Suất chiếu</TableHead>
                <TableHead>Ghế</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staticMovieHistory.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className="font-medium">{movie.receiptId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={movie.poster} alt={movie.movieName} className="w-12 h-16 object-cover rounded" />
                      <div>
                        <p className="font-medium">{movie.movieName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{movie.room}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{movie.movieSlot}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{movie.seats.join(", ")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{movie.points}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(movie.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
