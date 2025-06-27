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
import type { MEMBERSHIP_LEVEL, USER_STATUS, UserBase } from "@/interfaces/users.interface";
import { Edit, Eye, Trash } from "lucide-react";
import { useMemo, useState } from "react";

// Add inline formatter functions since the module is missing
const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

interface MemberTableProps {
  members: UserBase[];
  onEdit: (member: UserBase) => void;
  onDelete: (member: UserBase) => void;
  onView?: (member: UserBase) => void;
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

const getMembershipBadge = (level: MEMBERSHIP_LEVEL) => {
  if (!level) return null;

  const badgeColors: Record<string, string> = {
    Silver: "bg-gray-200 text-gray-800",
    Gold: "bg-yellow-100 text-yellow-800",
    Platinum: "bg-blue-100 text-blue-800",
    Diamond: "bg-purple-100 text-purple-800",
  };

  return <Badge className={badgeColors[level] || "bg-gray-100"}>{level}</Badge>;
};

const MemberTable = ({ members, onEdit, onDelete, onView }: MemberTableProps) => {
  const { sortedData, getSortProps } = useSortable<UserBase>(members);
  const [showAllColumns, setShowAllColumns] = useState(false);

  // Pagination configuration
  const pagination = usePagination({
    totalCount: sortedData.length,
    pageSize: 10,
    maxVisiblePages: 5,
    initialPage: 1,
  });

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

  return (
    <div className="space-y-4">
      {/* Toggle columns button */}
      <div className="flex justify-end mb-2">
        <Button variant="outline" size="sm" onClick={() => setShowAllColumns(!showAllColumns)}>
          {showAllColumns ? "Hiển thị cột cơ bản" : "Hiển thị tất cả cột"}
        </Button>
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-red-50 hover:bg-red-100">
                <TableHead className="w-[60px]">ID</TableHead>
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

                {showAllColumns && <TableHead>Avatar</TableHead>}

                <TableHead>
                  <div className="flex items-center gap-1">
                    Ngày sinh
                    <SortButton {...getSortProps("date_of_birth")} />
                  </div>
                </TableHead>

                <TableHead>
                  <div className="flex items-center gap-1">
                    Điểm tích lũy
                    <SortButton {...getSortProps("loyalty_point")} />
                  </div>
                </TableHead>

                {showAllColumns && (
                  <>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Tổng chi tiêu
                        <SortButton {...getSortProps("totalSpent")} />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Hạng thành viên
                        <SortButton {...getSortProps("membershipLevel")} />
                      </div>
                    </TableHead>
                    <TableHead>Kích hoạt</TableHead>
                    <TableHead>Đăng ký thông báo</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Ngày tạo
                        <SortButton {...getSortProps("createdAt")} />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Cập nhật lần cuối
                        <SortButton {...getSortProps("updatedAt")} />
                      </div>
                    </TableHead>
                  </>
                )}

                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showAllColumns ? 14 : 7} className="text-center py-8 text-gray-500">
                    {sortedData.length === 0 ? "Không tìm thấy thành viên" : "Không có dữ liệu trang này"}
                  </TableCell>
                </TableRow>
              ) : (
                currentPageData.map((member) => {
                  const { label, className } = getStatusDisplay(member.status_name);
                  return (
                    <TableRow key={member.id}>
                      <TableCell>{member.id}</TableCell>
                      <TableCell>{member.full_name}</TableCell>
                      <TableCell>{member.email}</TableCell>

                      {showAllColumns && (
                        <TableCell>
                          {member.avatar_url ? <img src={member.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full" /> : "Chưa cập nhật"}
                        </TableCell>
                      )}

                      <TableCell>{member.date_of_birth ? formatDate(member.date_of_birth) : "Chưa cập nhật"}</TableCell>
                      <TableCell>{member.loyalty_point}</TableCell>

                      {showAllColumns && (
                        <>
                          <TableCell>{formatCurrency(member.totalSpent)}</TableCell>
                          <TableCell>{getMembershipBadge(member.membershipLevel)}</TableCell>
                          <TableCell>
                            <Badge variant={member.is_active ? "default" : "outline"}>{member.is_active ? "Đã kích hoạt" : "Chưa kích hoạt"}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={member.is_subscription ? "default" : "outline"}>
                              {member.is_subscription ? "Đã đăng ký" : "Chưa đăng ký"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(member.createdAt)}</TableCell>
                          <TableCell>{formatDate(member.updatedAt)}</TableCell>
                        </>
                      )}

                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          {onView && (
                            <Button variant="ghost" size="icon" onClick={() => onView(member)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => onEdit(member)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDelete(member)}>
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
};

export default MemberTable;
