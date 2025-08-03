import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Shadcn/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationJump,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Shadcn/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { SortButton } from "@/components/shared/SortButton";
import { usePagination } from "@/hooks/usePagination";
import { useSortable } from "@/hooks/useSortable";
import type { User } from "@/interfaces/users.interface";
import { formatUserDate } from "@/services/userService";
import { getUserStatusDisplay } from "@/utils/color.utils";
import { Edit, Eye, MoreHorizontal } from "lucide-react";
import { forwardRef, useImperativeHandle, useMemo } from "react";

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

// Hàm lấy class cho badge giới tính
const getGenderBadgeClass = (gender: string): string => {
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

// Member table props
interface MemberTableProps {
  members: User[];
  onEdit: (member: User) => void;
  onDelete: (member: User) => void;
  onView?: (member: User) => void;
}

// Sửa MemberTable component để có thể forward ref và expose resetPagination
const MemberTable = forwardRef<{ resetPagination: () => void }, MemberTableProps>(({ members, onEdit, onDelete, onView }, ref) => {
  const { sortedData, getSortProps } = useSortable<User>(members);

  // Pagination configuration
  const pagination = usePagination({
    totalCount: sortedData.length,
    pageSize: 10,
    maxVisiblePages: 5,
    initialPage: 1,
  });

  // Expose resetPagination method
  useImperativeHandle(ref, () => ({
    resetPagination: () => pagination.setPage(1),
  }));

  // Get current page data
  const currentPageData = useMemo(() => {
    // Chỉ lấy dữ liệu cho trang hiện tại mà không sắp xếp lại
    // Điều này giữ nguyên thứ tự sắp xếp từ sortedData
    return sortedData.slice(pagination.startIndex, pagination.endIndex + 1);
  }, [sortedData, pagination.startIndex, pagination.endIndex]);

  return (
    <div className="space-y-4">
      <div className="w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16 text-center">STT</TableHead>
              <TableHead>
                <SortButton {...getSortProps("fullName")}>Họ tên</SortButton>
              </TableHead>
              <TableHead>
                <SortButton {...getSortProps("email")}>Email</SortButton>
              </TableHead>
              <TableHead>
                <SortButton {...getSortProps("dateOfBirth")}>Ngày sinh</SortButton>
              </TableHead>
              <TableHead>
                <SortButton {...getSortProps("loyaltyPoint")}>Điểm tích lũy</SortButton>
              </TableHead>
              <TableHead className="w-24 text-center">Số điện thoại</TableHead>
              <TableHead className="w-16 text-center">Giới tính</TableHead>
              <TableHead className="w-16 text-center">Trạng thái</TableHead>
              <TableHead className="w-24 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.length > 0 ? (
              currentPageData.map((member, index) => {
                const statusDisplay = getUserStatusDisplay(member.status ?? "ACTIVE");

                return (
                  <TableRow key={member.id}>
                    <TableCell className="text-center">{pagination.startIndex + index + 1}</TableCell>
                    <TableCell>{member.fullName}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.dateOfBirth ? formatDateTime(member.dateOfBirth) : "Chưa cập nhật"}</TableCell>
                    <TableCell className="text-center">{member.loyaltyPoint ?? 0}</TableCell>
                    <TableCell>{member.phone ?? "Chưa cập nhật"}</TableCell>
                    <TableCell className="text-center">
                      {member.gender ? (
                        <Badge className={`px-2 py-1 ${getGenderBadgeClass(member.gender)}`}>{formatGender(member.gender)}</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Chưa cập nhật</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusDisplay.className}>{statusDisplay.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onView?.(member)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Xem chi tiết</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(member)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Chỉnh sửa</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
        <div className="flex items-center gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationFirst
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    pagination.setPage(1);
                  }}
                  className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    pagination.prevPage();
                  }}
                  className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {pagination.visiblePages.map((page) => {
                if (page === "ellipsis") {
                  return (
                    <PaginationItem key={`ellipsis-${pagination.currentPage}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        pagination.setPage(page);
                      }}
                      isActive={page === pagination.currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    pagination.nextPage();
                  }}
                  className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    pagination.setPage(pagination.totalPages);
                  }}
                  className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <PaginationJump currentPage={pagination.currentPage} totalPages={pagination.totalPages} onJump={(page) => pagination.setPage(page)} />
        </div>
      )}
    </div>
  );
});

MemberTable.displayName = "MemberTable";

export default MemberTable;
