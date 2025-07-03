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
import type { MEMBERSHIP_LEVEL, User } from "@/interfaces/users.interface";
import { Edit, Trash } from "lucide-react";
import { forwardRef, useImperativeHandle, useMemo } from "react";

// Extended User interface to include membership data
interface UserWithMembership extends User {
  membershipLevel?: MEMBERSHIP_LEVEL;
  totalSpent?: number;
  loyalty_point?: number;
}

// Format functions
const formatCurrency = (value?: number): string => {
  if (!value) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

interface MemberTableProps {
  members: UserWithMembership[];
  onEdit: (member: UserWithMembership) => void;
  onDelete: (member: UserWithMembership) => void;
}

const getStatusDisplay = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return { label: "Đã xác minh", className: "bg-green-100 text-green-800" };
    case "BAN":
      return { label: "Bị cấm", className: "bg-red-100 text-red-800" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-800" };
  }
};

const getMembershipBadge = (level?: MEMBERSHIP_LEVEL) => {
  if (!level) return <span className="text-xs text-gray-500">Chưa có</span>;

  const badgeColors: Record<string, string> = {
    Silver: "bg-gray-200 text-gray-800",
    Gold: "bg-yellow-100 text-yellow-800",
    Platinum: "bg-blue-100 text-blue-800",
    Diamond: "bg-purple-100 text-purple-800",
  };

  return <Badge className={`${badgeColors[level] || "bg-gray-100"} px-2 py-1 text-xs font-medium`}>{level}</Badge>;
};

// Sửa MemberTable component để có thể forward ref và expose resetPagination
const MemberTable = forwardRef<{ resetPagination: () => void }, MemberTableProps>(({ members, onEdit, onDelete }, ref) => {
  const { sortedData, getSortProps } = useSortable<UserWithMembership>(members);

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
    // Sắp xếp theo ID (giả định ID mới nhất sẽ lớn nhất)
    const sortedByDate = [...sortedData].sort((a, b) => {
      return String(b.id).localeCompare(String(a.id));
    });

    return sortedByDate.slice(pagination.startIndex, pagination.endIndex + 1);
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
              <TableHead className="w-28">
                <SortButton {...getSortProps("status")}>Trạng thái</SortButton>
              </TableHead>
              <TableHead className="w-24 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.length > 0 ? (
              currentPageData.map((member, index) => {
                const statusDisplay = getStatusDisplay(member.status);

                return (
                  <TableRow key={member.id}>
                    <TableCell className="text-center font-medium">{pagination.startIndex + index + 1}</TableCell>
                    <TableCell>{member.fullName}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge className={statusDisplay.className}>{statusDisplay.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(member)} title="Chỉnh sửa">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(member)} title="Xóa">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
                  <PaginationItem key={`ellipsis-${page}-${i}`}>
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

MemberTable.displayName = "MemberTable";

export default MemberTable;
