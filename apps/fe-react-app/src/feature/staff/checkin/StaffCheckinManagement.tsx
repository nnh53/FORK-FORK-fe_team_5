import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, QrCode, Search, Star, Ticket, User } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  membershipLevel: "Silver" | "Gold" | "Platinum";
  currentPoints: number;
  totalSpent: number;
}

interface CheckinBooking {
  id: string;
  movieTitle: string;
  showtime: string;
  date: string;
  seats: string[];
  cinemaRoom: string;
  status: "pending" | "checked-in";
  pointsToEarn: number;
}

// Mock data
const mockMembers: Record<string, Member> = {
  "0123456789": {
    id: "M001",
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "a.nguyen@email.com",
    membershipLevel: "Gold",
    currentPoints: 1250,
    totalSpent: 2500000,
  },
  "0987654321": {
    id: "M002",
    name: "Trần Thị B",
    phone: "0987654321",
    email: "b.tran@email.com",
    membershipLevel: "Silver",
    currentPoints: 850,
    totalSpent: 1200000,
  },
};

const mockBookings: Record<string, CheckinBooking[]> = {
  "0123456789": [
    {
      id: "BK001",
      movieTitle: "Dune: Part Two",
      showtime: "19:00",
      date: "2025-06-16",
      seats: ["A1", "A2"],
      cinemaRoom: "Phòng 1",
      status: "pending",
      pointsToEarn: 50,
    },
  ],
  "0987654321": [
    {
      id: "BK002",
      movieTitle: "Avatar: The Way of Water",
      showtime: "21:30",
      date: "2025-06-16",
      seats: ["B5", "B6", "B7"],
      cinemaRoom: "Phòng 2",
      status: "pending",
      pointsToEarn: 75,
    },
  ],
};

const StaffCheckinManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [memberBookings, setMemberBookings] = useState<CheckinBooking[]>([]);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState("");

  const searchMember = () => {
    const member = mockMembers[searchTerm];
    if (member) {
      setFoundMember(member);
      setMemberBookings(mockBookings[searchTerm] || []);
      toast.success("Tìm thấy thành viên!");
    } else {
      setFoundMember(null);
      setMemberBookings([]);
      toast.error("Không tìm thấy thành viên!");
    }
  };

  const handleCheckin = (bookingId: string) => {
    const booking = memberBookings.find((b) => b.id === bookingId);
    if (booking && foundMember) {
      setMemberBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "checked-in" as const } : b)));

      // Update member points
      const updatedMember = {
        ...foundMember,
        currentPoints: foundMember.currentPoints + booking.pointsToEarn,
      };
      setFoundMember(updatedMember);

      toast.success(`Check-in thành công! +${booking.pointsToEarn} điểm`);
    }
  };

  const handleRedeemPoints = () => {
    const points = parseInt(pointsToRedeem);
    if (foundMember && points > 0 && points <= foundMember.currentPoints) {
      const updatedMember = {
        ...foundMember,
        currentPoints: foundMember.currentPoints - points,
      };
      setFoundMember(updatedMember);
      setPointsToRedeem("");
      setRedeemDialogOpen(false);
      toast.success(`Đã đổi ${points} điểm thành công!`);
    } else {
      toast.error("Số điểm không hợp lệ!");
    }
  };

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "Silver":
        return "bg-gray-100 text-gray-800";
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
      case "Platinum":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "checked-in":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Check-in & Đổi điểm</h1>
      </div>

      {/* Search Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm thành viên
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Số điện thoại thành viên</Label>
              <Input
                id="search"
                placeholder="Nhập số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchMember()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={searchMember} className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Info */}
      {foundMember && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin thành viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Họ tên</p>
                  <p className="font-semibold">{foundMember.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-semibold">{foundMember.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{foundMember.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Hạng thành viên</p>
                  <Badge className={getMembershipColor(foundMember.membershipLevel)}>
                    <Star className="h-3 w-3 mr-1" />
                    {foundMember.membershipLevel}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Điểm hiện tại</p>
                  <p className="font-semibold text-green-600 text-xl">{foundMember.currentPoints} điểm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                  <p className="font-semibold">{foundMember.totalSpent.toLocaleString("vi-VN")} VNĐ</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Dialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Đổi điểm
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đổi điểm thưởng</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="points">Số điểm muốn đổi</Label>
                      <Input
                        id="points"
                        type="number"
                        placeholder="Nhập số điểm..."
                        value={pointsToRedeem}
                        onChange={(e) => setPointsToRedeem(e.target.value)}
                        max={foundMember.currentPoints}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Điểm hiện có: {foundMember.currentPoints}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleRedeemPoints} className="flex-1">
                        Xác nhận đổi điểm
                      </Button>
                      <Button variant="outline" onClick={() => setRedeemDialogOpen(false)}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookings */}
      {memberBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Vé cần check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memberBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="font-mono">
                        {booking.id}
                      </Badge>
                      <Badge className={getBookingStatusColor(booking.status)}>{booking.status === "pending" ? "Chờ check-in" : "Đã check-in"}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">+{booking.pointsToEarn} điểm</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold">{booking.movieTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString("vi-VN")} - {booking.showtime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Phòng:</span> {booking.cinemaRoom}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Ghế:</span> {booking.seats.join(", ")}
                      </p>
                    </div>
                  </div>

                  {booking.status === "pending" && (
                    <Button onClick={() => handleCheckin(booking.id)} className="w-full">
                      Check-in
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffCheckinManagement;
