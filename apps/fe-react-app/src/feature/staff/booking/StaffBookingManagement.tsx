import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Checkbox } from "@/components/Shadcn/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/ui/dropdown-menu";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import type { ApiBooking, BookingStatus, PaymentStatus } from "@/interfaces/booking.interface";
import type { components } from "@/schema-from-be";
import { useBookings, useBookingsByStatus } from "@/services/bookingService";
import { formatVND } from "@/utils/currency.utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Filter, MoreHorizontal, Search } from "lucide-react";
import React, { useState } from "react";
import BookingDetailModal from "./components/BookingDetailModal";
import BulkStatusUpdate from "./components/BulkStatusUpdate";
import QuickStatusChange from "./components/QuickStatusChange";
import StatusStatistics from "./components/StatusStatistics";

type ApiUserResponse = components["schemas"]["ApiResponseUserResponse"];

// Types for filters and booking management
interface BookingFilters {
  status?: BookingStatus | "";
  paymentStatus?: PaymentStatus | "" | "ALL";
  searchTerm?: string;
  userId?: string;
}

// Helper function to get status badge variant
const getStatusBadge = (status: string, type: "booking" | "payment") => {
  if (type === "booking") {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
            Thành công
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Chờ xử lý
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  } else {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
            Đã thanh toán
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Chờ thanh toán
          </Badge>
        );
      case "FAILED":
        return <Badge variant="destructive">Thanh toán thất bại</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }
};

// Helper function to get payment method text
const getPaymentMethodText = (method: string | undefined) => {
  switch (method) {
    case "CASH":
      return "Tiền mặt";
    case "ONLINE":
      return "Thanh toán online";
    default:
      return method || "N/A";
  }
};

// Helper functions for safe operations

const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  } catch {
    return "N/A";
  }
};

const StaffBookingManagement: React.FC = () => {
  // State for filters and search
  const [filters, setFilters] = useState<BookingFilters>({
    status: "",
    paymentStatus: "ALL",
    searchTerm: "",
    userId: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [searchUser, setSearchUser] = useState("");

  // State for bulk selection
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // API hooks with error handling
  const { data: allBookings, isLoading: isLoadingAll, error: errorAll, refetch: refetchAll } = useBookings();
  const { data: pendingBookings, isLoading: isLoadingPending, error: errorPending } = useBookingsByStatus("PENDING");
  const { data: successBookings, isLoading: isLoadingSuccess, error: errorSuccess } = useBookingsByStatus("SUCCESS");
  const { data: cancelledBookings, isLoading: isLoadingCancelled, error: errorCancelled } = useBookingsByStatus("CANCELLED");

  // Check for any API errors
  const hasApiError = errorAll || errorPending || errorSuccess || errorCancelled;

  // Get data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "pending":
        return { data: pendingBookings, isLoading: isLoadingPending };
      case "success":
        return { data: successBookings, isLoading: isLoadingSuccess };
      case "cancelled":
        return { data: cancelledBookings, isLoading: isLoadingCancelled };
      default:
        return { data: allBookings, isLoading: isLoadingAll };
    }
  };

  const { data: currentBookings, isLoading } = getCurrentData();

  // Filter bookings based on current filters
  const bookingsData = currentBookings?.result || [];
  const filteredBookings = Array.isArray(bookingsData)
    ? bookingsData
        .filter((booking) => {
          if (!filters.searchTerm) return true;
          const searchLower = filters.searchTerm.toLowerCase();
          return (
            booking.id?.toString().includes(searchLower) ||
            booking.user?.fullName?.toLowerCase().includes(searchLower) ||
            booking.user?.email?.toLowerCase().includes(searchLower) ||
            booking.user?.phone?.toLowerCase().includes(searchLower)
          );
        })
        .filter((booking) => (filters.userId ? booking.user?.id === filters.userId : true))
        .filter((booking) => (filters.paymentStatus && filters.paymentStatus !== "ALL" ? booking.paymentStatus === filters.paymentStatus : true))
    : [];

  // Handle bulk selection functions
  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    if (checked) {
      setSelectedBookings((prev) => [...prev, bookingId]);
    } else {
      setSelectedBookings((prev) => prev.filter((id) => id !== bookingId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allIds = filteredBookings.map((booking) => booking.id?.toString()).filter(Boolean) as string[];
      setSelectedBookings(allIds);
    } else {
      setSelectedBookings([]);
    }
  };

  const clearSelection = () => {
    setSelectedBookings([]);
    setSelectAll(false);
  };

  // Table columns definition - removed complex ColumnDef and replaced with simple table
  const renderBookingRow = (booking: ApiBooking) => (
    <TableRow key={booking.id} className={selectedBookings.includes(booking.id?.toString() || "") ? "bg-blue-50" : ""}>
      <TableCell>
        <Checkbox
          checked={selectedBookings.includes(booking.id?.toString() || "")}
          onCheckedChange={(checked) => handleSelectBooking(booking.id?.toString() || "", checked as boolean)}
        />
      </TableCell>
      <TableCell>
        <div className="font-medium">#{booking.id}</div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{booking.user?.fullName || "N/A"}</div>
          <div className="text-xs text-gray-500">{booking.user?.email || booking.user?.phone || ""}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="text-sm font-medium">Movie ID: {booking.showTime?.movieId || "N/A"}</div>
          <div className="text-xs text-gray-500">
            {booking.showTime?.showDateTime ? format(new Date(booking.showTime.showDateTime), "dd/MM/yyyy HH:mm", { locale: vi }) : "N/A"}
          </div>
          <div className="text-xs text-gray-500">{booking.showTime?.roomName || "N/A"}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {booking.seats?.slice(0, 3).map((seat) => (
            <Badge key={seat.id} variant="outline" className="text-xs">
              {seat.row}
              {seat.column}
            </Badge>
          ))}
          {booking.seats && booking.seats.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{booking.seats.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium text-red-600">{booking.totalPrice ? formatVND(booking.totalPrice, 0, "đ") : "N/A"}</div>
      </TableCell>
      <TableCell>
        {/* Display only - không cho phép thay đổi trực tiếp */}
        {getStatusBadge(booking.status || "PENDING", "booking")}
      </TableCell>
      <TableCell>
        <QuickStatusChange booking={booking} onUpdate={() => refetchAll()} type="payment" />
      </TableCell>
      <TableCell>
        <div className="text-sm">{booking.bookingDate ? format(new Date(booking.bookingDate), "dd/MM/yyyy HH:mm", { locale: vi }) : "N/A"}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {/* Detail Modal */}
          <BookingDetailModal
            booking={booking}
            onUpdate={() => {
              // Refetch data to update the table
              refetchAll();
            }}
          />

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id?.toString() || "")}>Sao chép mã booking</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.user?.email || "")}>Sao chép email khách hàng</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {hasApiError && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <span role="img" aria-label="Warning">
                ⚠️
              </span>{" "}
              Lỗi Lấy dữ liệu
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Booking</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi tất cả các booking của khách hàng</p>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Bộ lọc tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            {/* General Search */}
            <div className="min-w-[220px] flex-1">
              <Label className="mb-1 block">Tìm kiếm</Label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input
                  placeholder="Mã booking, tên KH, email, SĐT, tên phim..."
                  className="pl-8"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
                />
              </div>
            </div>
            {/* Payment Status Filter */}
            <div className="min-w-[180px] flex-1">
              <Label className="mb-1 block">Trạng thái thanh toán</Label>
              <Select
                value={filters.paymentStatus}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, paymentStatus: value as PaymentStatus }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                  <SelectItem value="SUCCESS">Đã thanh toán</SelectItem>
                  <SelectItem value="FAILED">Thanh toán thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Clear Filters */}
            <div className="flex-shrink-0">
              <Label className="mb-1 block">&nbsp;</Label>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ status: "", paymentStatus: "ALL", searchTerm: "", userId: "" });
                  setSearchUser("");
                }}
                className="w-full"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
          {/* Active Filters Display */}
          {(filters.searchTerm || filters.userId || (filters.paymentStatus && filters.paymentStatus !== "ALL")) && (
            <div className="mt-4 flex flex-wrap gap-2 rounded-md border border-dashed border-gray-200 bg-gray-50 p-3">
              <span className="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
              {filters.searchTerm && (
                <Badge variant="secondary">
                  Tìm kiếm: {filters.searchTerm}
                  <button onClick={() => setFilters((prev) => ({ ...prev, searchTerm: "" }))} className="ml-2 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              )}
              {filters.userId && (
                <Badge variant="secondary">
                  Khách hàng: {searchUser}
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, userId: "" }));
                      setSearchUser("");
                    }}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.paymentStatus &&
                filters.paymentStatus !== "ALL" &&
                (() => {
                  let statusText = "Thất bại";
                  if (filters.paymentStatus === "PENDING") statusText = "Chờ thanh toán";
                  if (filters.paymentStatus === "SUCCESS") statusText = "Đã thanh toán";
                  return (
                    <Badge variant="secondary">
                      Thanh toán: {statusText}
                      <button onClick={() => setFilters((prev) => ({ ...prev, paymentStatus: "ALL" }))} className="ml-2 hover:text-red-500">
                        ×
                      </button>
                    </Badge>
                  );
                })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
          <TabsTrigger value="success">Thành công</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng số booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Array.isArray(allBookings?.result) ? allBookings.result.length : 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{Array.isArray(pendingBookings?.result) ? pendingBookings.result.length : 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thành công</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{Array.isArray(successBookings?.result) ? successBookings.result.length : 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {Array.isArray(cancelledBookings?.result) ? cancelledBookings.result.length : 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Status Update */}
          <BulkStatusUpdate selectedBookings={selectedBookings} onUpdate={() => refetchAll()} onClearSelection={clearSelection} />

          {/* Data Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Danh sách booking
                    {activeTab !== "all" &&
                      ` - ${(() => {
                        if (activeTab === "pending") return "Chờ xử lý";
                        if (activeTab === "success") return "Thành công";
                        return "Đã hủy";
                      })()}`}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-4">
                    <span>{filteredBookings.length} booking được tìm thấy</span>
                    <StatusStatistics bookings={filteredBookings.filter((b) => b.id !== undefined) as ApiBooking[]} />
                  </CardDescription>
                </div>
                {selectedBookings.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Đã chọn: {selectedBookings.length}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox checked={selectAll} onCheckedChange={(checked) => handleSelectAll(checked as boolean)} />
                      </TableHead>
                      <TableHead>Mã Booking</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Phim & Suất chiếu</TableHead>
                      <TableHead>Ghế</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead>Ngày đặt</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (booking.id ? renderBookingRow(booking as ApiBooking) : null))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="py-8 text-center text-gray-500">
                          Không có booking nào được tìm thấy
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffBookingManagement;
