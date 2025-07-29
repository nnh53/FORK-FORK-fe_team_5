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
import type { Combo } from "@/interfaces/combo.interface";
import { Grid3X3, List } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import ComboCard from "./ComboCard";

interface ComboTableProps {
  combos: Combo[];
  onEdit?: (combo: Combo) => void;
  onDelete?: (id: number) => void;
  onViewDetails?: (combo: Combo) => void;
}

const ComboTable = forwardRef<{ resetPagination: () => void }, ComboTableProps>(({ combos, onEdit, onDelete, onViewDetails }, ref) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pageSize, setPageSize] = useState(8);

  // Sorting
  const { sortedData, getSortProps } = useSortable<Combo>(combos);

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
  const currentPageData = sortedData.slice(pagination.startIndex, pagination.endIndex + 1);

  // Render pagination items
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
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Danh sách combo ({combos.length})</h2>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {/* Sort Controls */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-1">
            <span className="px-2 text-sm font-medium">Sắp xếp:</span>
            <SortButton {...getSortProps("name")} label="Tên" />
            <SortButton {...getSortProps("price")} label="Giá" />
            <SortButton {...getSortProps("discount")} label="Giảm giá" />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-1">
            {/* Page Size Selector */}
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="16">16</SelectItem>
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
      </div>

      {/* Content */}
      {currentPageData.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-muted-foreground text-center">
              <div className="mb-4 text-4xl">🍔</div>
              <div className="mb-2 text-lg font-medium">Không tìm thấy combo</div>
              <div className="text-sm">Hãy thử thay đổi bộ lọc hoặc thêm combo mới</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}>
          {currentPageData.map((combo) => (
            <ComboCard key={combo.id} combo={combo} onEdit={onEdit} onDelete={onDelete} onViewDetails={onViewDetails} viewMode={viewMode} />
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
                  {renderPaginationItems()}
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
      )}
    </div>
  );
});

ComboTable.displayName = "ComboTable";

export default ComboTable;

// export default ComboTable;
