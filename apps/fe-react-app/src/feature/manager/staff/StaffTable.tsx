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
import { getUserStatusDisplay } from "@/utils/color.utils";
import { Edit, Trash } from "lucide-react";
import { forwardRef, useImperativeHandle, useMemo } from "react";

interface StaffTableProps {
  staffs: StaffUser[];
  onEdit: (staff: StaffUser) => void;
  onDelete: (staff: StaffUser) => void;
}

// Thêm hàm để định dạng thời gian
const formatDateTime = (dateString?: string) => {
  if (!dateString) return "Chưa cập nhật";

  try {
    return formatUserDate(dateString);
  } catch {
    return "Không hợp lệ";
  }
};

// Hàm hiển thị giới tính
const formatGender = (gender?: string) => {
  if (!gender) return "Chưa cập nhật";

  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "OTHER":
      return "Khác";
    default:
      return "Chưa cập nhật";
  }
};

// Hàm lấy lớp CSS cho badge giới tính
const getGenderBadgeClass = (gender?: string) => {
  switch (gender) {
    case "MALE":
      return "bg-blue-100 text-blue-800";
    case "FEMALE":
      return "bg-pink-100 text-pink-800";
    case "OTHER":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
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
    return sortedData.slice(pagination.startIndex, pagination.endIndex + 1).reverse();
  }, [sortedData, pagination.startIndex, pagination.endIndex]);

  return (
    <div className="space-y-4">
      <div className="w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16 text-center">STT</TableHead>
              <TableHead className="w-16 text-center">Avatar</TableHead>
              <TableHead>
                <SortButton {...getSortProps("fullName")}>Họ tên</SortButton>
              </TableHead>
              <TableHead>
                <SortButton {...getSortProps("email")}>Email</SortButton>
              </TableHead>
              <TableHead>
                <SortButton {...getSortProps("dateOfBirth")}>Ngày sinh</SortButton>
              </TableHead>
              <TableHead className="w-24 text-center">Số điện thoại</TableHead>
              <TableHead className="w-24 text-center">Địa chỉ</TableHead>
              <TableHead className="w-16 text-center">Giới tính</TableHead>
              <TableHead className="w-16 text-center">Trạng thái</TableHead>
              <TableHead className="w-24 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.length > 0 ? (
              currentPageData.map((staff, index) => {
                const statusDisplay = getUserStatusDisplay(staff.status);

                return (
                  <TableRow key={staff.id}>
                    <TableCell className="text-center font-medium">{pagination.startIndex + index + 1}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {staff.avatar ? (
                          <img
                            src={staff.avatar}
                            alt={`Avatar của ${staff.fullName}`}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.fullName || "User")}`;
                            }}
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                            {staff.fullName?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{staff.fullName}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{formatDateTime(staff.dateOfBirth)}</TableCell>
                    <TableCell>{staff.phone ?? "Chưa cập nhật"}</TableCell>
                    <TableCell>{staff.address ?? "Chưa cập nhật"}</TableCell>
                    <TableCell className="text-center">
                      {staff.gender ? (
                        <Badge className={`px-2 py-1 ${getGenderBadgeClass(staff.gender)}`}>{formatGender(staff.gender)}</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Chưa cập nhật</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusDisplay.className}>{statusDisplay.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(staff)} title="Chỉnh sửa">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(staff)} title="Xóa">
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
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

            {pagination.visiblePages.map((page) => {
              if (page === "ellipsis") {
                return (
                  <PaginationItem key={`ellipsis-${pagination.currentPage}-${pagination.totalPages}`}>
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
