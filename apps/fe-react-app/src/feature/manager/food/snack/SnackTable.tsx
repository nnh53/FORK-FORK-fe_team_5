// filepath: c:\Users\Hii\Desktop\OJT\fe_team_5\apps\fe-react-app\src\feature\manager\mbo\food\FoodTable.tsx
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { SortButton } from "@/components/shared/SortButton";
import { getPageInfo, usePagination } from "@/hooks/usePagination";
import { useSortable } from "@/hooks/useSortable";
import type { Snack } from "@/interfaces/snacks.interface";
import { Icon } from "@iconify/react";
import { Grid3X3, List } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import SnackCard from "./SnackCard";

interface SnackTableProps {
  snacks: Snack[];
  onEdit?: (snack: Snack) => void;
  onDelete?: (id: number) => void;
}

const SnackTable = forwardRef<{ resetPagination: () => void }, SnackTableProps>(({ snacks, onEdit, onDelete }, ref) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pageSize, setPageSize] = useState(8);

  // Sorting
  const { sortedData, getSortProps } = useSortable<Snack>(snacks);

  // Pagination
  const pagination = usePagination({
    totalCount: sortedData.length,
    pageSize,
    maxVisiblePages: 5,
    initialPage: 1,
  });

  // Expose resetPagination method via ref
  useImperativeHandle(ref, () => ({
    resetPagination: () => {
      pagination.setPage(1);
    },
  }));

  // Get current page data
  const currentPageData = (() => {
    const reversedData = [...sortedData];
    return reversedData.slice(pagination.startIndex, pagination.endIndex + 1);
  })();

  // Render pagination items
  const renderPaginationItems = () => {
    return pagination.visiblePages.map((page) => {
      if (page === "ellipsis") {
        return (
          <PaginationItem key={`ellipsis-start-${pagination.currentPage}`}>
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
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Danh sách thực phẩm ({snacks.length})</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Controls */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-1">
            <SortButton {...getSortProps("name")} label="Tên" />
            <SortButton {...getSortProps("price")} label="Giá" />
          </div>

          {/* Page Size Selector */}
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="32">32</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-r-none">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-l-none">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentPageData.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-muted-foreground text-center">
              <Icon icon="lucide:popcorn" className="text-shadow-background mx-auto mb-0.5" />{" "}
              <div className="mb-2 text-lg font-medium">Không tìm thấy thực phẩm</div>
              <div className="text-sm">Hãy thử thay đổi bộ lọc hoặc thêm thực phẩm mới</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}>
          {currentPageData.map((snack) => (
            <SnackCard key={snack.id} snack={snack} onEdit={onEdit} onDelete={onDelete} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {sortedData.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Pagination Info */}
          <div className="text-muted-foreground text-sm">{getPageInfo(pagination)}</div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
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
                      className={!pagination.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
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

                  {renderPaginationItems()}

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
                  <PaginationItem>
                    <PaginationLast
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        pagination.setPage(pagination.totalPages);
                      }}
                      className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <PaginationJump currentPage={pagination.currentPage} totalPages={pagination.totalPages} onJump={(page) => pagination.setPage(page)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

SnackTable.displayName = "SnackTable";

export default SnackTable;
