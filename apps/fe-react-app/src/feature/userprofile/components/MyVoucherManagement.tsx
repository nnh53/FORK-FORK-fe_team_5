import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Separator } from "@/components/Shadcn/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { CalendarDays, Filter, Gift, History } from "lucide-react";
import { useState } from "react";

export const MyVoucherManagement: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Data tĩnh để preview UI - sẽ thay thế bằng API thật
  const staticVouchers = [
    {
      id: "VC001",
      description: "Giảm 50% cho vé xem phim",
      type: "Discount",
      expiredDate: "2024-12-31",
      status: "active",
    },
    {
      id: "VC002",
      description: "Miễn phí bỏng ngô size L",
      type: "Free Item",
      expiredDate: "2024-11-15",
      status: "active",
    },
    {
      id: "VC003",
      description: "Giảm 100K cho hóa đơn từ 500K",
      type: "Discount",
      expiredDate: "2024-10-20",
      status: "expired",
    },
  ];

  const staticHistory = [
    {
      id: "1",
      date: "2024-06-15",
      voucherId: "VC001",
      description: "Giảm 50% cho vé xem phim",
      status: "used",
    },
    {
      id: "2",
      date: "2024-06-10",
      voucherId: "VC002",
      description: "Miễn phí bỏng ngô size L",
      status: "used",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Còn hạn
          </Badge>
        );
      case "expired":
        return <Badge variant="destructive">Hết hạn</Badge>;
      case "used":
        return <Badge variant="secondary">Đã sử dụng</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Discount":
        return (
          <Badge variant="default" className="bg-blue-500">
            Giảm giá
          </Badge>
        );
      case "Free Item":
        return (
          <Badge variant="default" className="bg-purple-500">
            Miễn phí
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Gift className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Voucher Management</h1>
      </div>

      {/* Available Vouchers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Voucher hiện có
          </CardTitle>
          <CardDescription>Danh sách các voucher bạn đang sở hữu</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            <Button variant={selectedFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedFilter("all")}>
              Tất cả
            </Button>
            <Button variant={selectedFilter === "active" ? "default" : "outline"} size="sm" onClick={() => setSelectedFilter("active")}>
              Còn hạn
            </Button>
            <Button variant={selectedFilter === "expired" ? "default" : "outline"} size="sm" onClick={() => setSelectedFilter("expired")}>
              Hết hạn
            </Button>
          </div>

          {/* Vouchers Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Voucher</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staticVouchers
                .filter((voucher) => selectedFilter === "all" || voucher.status === selectedFilter)
                .map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="font-medium">{voucher.id}</TableCell>
                    <TableCell>{voucher.description}</TableCell>
                    <TableCell>{getTypeBadge(voucher.type)}</TableCell>
                    <TableCell>{voucher.expiredDate}</TableCell>
                    <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" disabled={voucher.status !== "active"}>
                        Sử dụng
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator />

      {/* Voucher History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lịch sử sử dụng Voucher
          </CardTitle>
          <CardDescription>Theo dõi các voucher bạn đã sử dụng</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Lọc theo thời gian:</span>
            </div>
            <Button variant="outline" size="sm">
              <CalendarDays className="h-4 w-4 mr-2" />
              Chọn khoảng thời gian
            </Button>
          </div>

          {/* History Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Mã Voucher</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staticHistory.map((history) => (
                <TableRow key={history.id}>
                  <TableCell>{history.date}</TableCell>
                  <TableCell className="font-medium">{history.voucherId}</TableCell>
                  <TableCell>{history.description}</TableCell>
                  <TableCell>{getStatusBadge(history.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
