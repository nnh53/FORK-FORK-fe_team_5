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
import { getPageInfo, usePagination } from "@/hooks/usePagination";
import { useSortable } from "@/hooks/useSortable";
import { ROLE_TYPE } from "@/interfaces/roles.interface";
import type { Staff } from "@/interfaces/staff.interface";
import type { USER_STATUS } from "@/interfaces/users.interface";
import { Edit, Trash } from "lucide-react";
import { forwardRef, useImperativeHandle, useMemo } from "react";

interface StaffTableProps {
  staffs: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

const getStatusDisplay = (status: USER_STATUS) => {
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
  if (role === ROLE_TYPE.STAFF) {
    return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Nhân viên</span>;
  }
};

// Thêm hàm để định dạng thời gian
const formatDateTime = (dateString: string) => {
  if (!dateString) return "Chưa cập nhật";

  try {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    console.error(`Không thể định dạng thời gian: ${dateString}`);
    return "Định dạng không hợp lệ";
  }
};

// Thêm hàm để hiển thị trạng thái kích hoạt
const getActiveStatus = (isActive: number) => {
  return isActive === 1 ? (
    <Badge className="bg-green-100 text-green-800">Đã kích hoạt</Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-800">Chưa kích hoạt</Badge>
  );
};

// Sử dụng forwardRef để forward reference từ component cha
const StaffTable = forwardRef<{ resetPagination: () => void }, StaffTableProps>(({ staffs, onEdit, onDelete }, ref) => {
  const { sortedData, getSortProps } = useSortable<Staff>(staffs);

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

  // Render pagination numbers
  const renderPaginationItems = () => {
    return pagination.visiblePages.map((page, index) => {
      if (page === "ellipsis") {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={page === pagination.currentPage}
            onClick={(e) => {
              e.preventDefault();
              pagination.setPage(page);
            }}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      // Bỏ tham số error vì không sử dụng
      console.error(`Không thể định dạng ngày: ${dateString}`);
      return "Định dạng không hợp lệ";
    }
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="w-full overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-red-50 hover:bg-red-100">
                <TableHead>ID</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Tên
                    <SortButton {...getSortProps("full_name")} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Email
                    <SortButton {...getSortProps("email")} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Ngày sinh
                    <SortButton {...getSortProps("date_of_birth")} />
                  </div>
                </TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Kích hoạt</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    {sortedData.length === 0 ? "Không tìm thấy nhân viên" : "Không có dữ liệu trang này"}
                  </TableCell>
                </TableRow>
              ) : (
                currentPageData.map((staff) => {
                  const { label, className } = getStatusDisplay(staff.status_name);
                  return (
                    <TableRow key={staff.id}>
                      <TableCell>{staff.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {staff.avatar_url ? (
                            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200">
                              <img
                                src={staff.avatar_url}
                                alt={`Avatar của ${staff.full_name}`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.full_name)}&background=random`;
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {staff.full_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{staff.full_name}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{formatDate(staff.date_of_birth)}</TableCell>
                      <TableCell>{getRoleBadge(staff.role_name)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
                      </TableCell>
                      <TableCell>{getActiveStatus(staff.is_active)}</TableCell>
                      <TableCell>{formatDateTime(staff.createdAt)}</TableCell>
                      <TableCell>{formatDateTime(staff.updatedAt)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => onEdit(staff)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDelete(staff)}>
                            <Trash className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Info and Controls */}
      {sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600 w-1/10">{getPageInfo(pagination)}</div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.prevPage();
                    }}
                    className={!pagination.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {renderPaginationItems()}

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.nextPage();
                    }}
                    className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
});

// Thêm displayName cho component
StaffTable.displayName = "StaffTable";

export default StaffTable;
