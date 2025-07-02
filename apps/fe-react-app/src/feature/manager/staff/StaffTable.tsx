import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Shadcn/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { SortButton } from "@/components/shared/SortButton";
import { usePagination } from "@/hooks/usePagination";
import { useSortable } from "@/hooks/useSortable";
import type { StaffUser } from "@/interfaces/staff.interface";
import { formatUserDate } from "@/services/userService";
import { Edit, Trash } from "lucide-react";
import { forwardRef, useImperativeHandle, useMemo } from "react";

interface StaffTableProps {
  staffs: StaffUser[];
  onEdit: (staff: StaffUser) => void;
  onDelete: (staff: StaffUser) => void;
}

const getStatusDisplay = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return { label: "Đã xác minh", className: "bg-green-100 text-green-800" };
    case "BAN":
      return { label: "Bị cấm", className: "bg-red-100 text-red-800" };
    default:
      return { label: "Không xác định", className: "bg-yellow-100 text-yellow-800" };
  }
};

const getRoleBadge = (role: string) => {
  if (role === "STAFF") {
    return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Nhân viên</span>;
  }
  return null;
};

// Thêm hàm để định dạng thời gian
const formatDateTime = (dateString?: string) => {
  if (!dateString) return "Chưa cập nhật";

  try {
    return formatUserDate(dateString);
  } catch {
    return "Không hợp lệ";
  }
};

// Sử dụng forwardRef để forward reference từ component cha
const StaffTable = forwardRef<{ resetPagination: () => void }, StaffTableProps>(({ staffs, onEdit, onDelete }, ref) => {
  const { sortedData, getSortProps } = useSortable<StaffUser>(staffs);

  // Pagination configuration
  const pagination = usePagination({
    totalCount: sortedData.length,
    pageSize: 10,
    maxVisiblePages: 5,
    initialPage: 1,
  });

  // Expose resetPagination method thông qua ref
  useImperativeHandle(ref, () => ({
    resetPagination: () => pagination.setPage(1),
  }));

  // Get current page data
  const currentPageData = useMemo(() => {
    return sortedData.slice(pagination.startIndex, pagination.endIndex + 1);
  }, [sortedData, pagination.startIndex, pagination.endIndex]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16 text-center">STT</TableHead>
              <TableHead className="w-16">
                <SortButton {...getSortProps("id")}>ID</SortButton>
              </TableHead>
              <TableHead>
                <SortButton {...getSortProps("fullName")}>Họ tên</SortButton>
              </TableHead>
              <TableHead>
                <SortButton {...getSortProps("email")}>Email</SortButton>
              </TableHead>
              <TableHead>
                <SortButton {...getSortProps("phone")}>Số điện thoại</SortButton>
              </TableHead>
              <TableHead className="w-28">
                <SortButton {...getSortProps("status")}>Trạng thái</SortButton>
              </TableHead>
              <TableHead className="w-28">
                <SortButton {...getSortProps("dateOfBirth")}>Ngày sinh</SortButton>
              </TableHead>
              <TableHead className="w-24 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.length > 0 ? (
              currentPageData.map((staff, index) => {
                const statusDisplay = getStatusDisplay(staff.status);

                return (
                  <TableRow key={staff.id}>
                    <TableCell className="text-center font-medium">{pagination.startIndex + index + 1}</TableCell>
                    <TableCell>{staff.id}</TableCell>
                    <TableCell>{staff.fullName}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone ?? "Chưa cập nhật"}</TableCell>
                    <TableCell>
                      <Badge className={statusDisplay.className}>{statusDisplay.label}</Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(staff.dateOfBirth)}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(staff)} title="Chỉnh sửa">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(staff)} title="Xóa">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {sortedData.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => pagination.prevPage()}
                className={`cursor-pointer ${pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>

            {pagination.visiblePages.map((page, i) => {
              if (page === "ellipsis") {
                return (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink onClick={() => pagination.setPage(page)} isActive={page === pagination.currentPage} className="cursor-pointer">
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => pagination.nextPage()}
                className={`cursor-pointer ${pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
});

// Thêm displayName cho component
StaffTable.displayName = "StaffTable";

export default StaffTable;
