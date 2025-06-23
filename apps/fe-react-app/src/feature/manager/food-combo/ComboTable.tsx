import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Shadcn/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { usePagination } from "@/hooks/usePagination";
import type { Food } from "@/interfaces/foodAndCombo.interface";
import { Grid3X3, List } from "lucide-react";
import { useMemo, useState } from "react";
import ComboCard from "./ComboCard";

interface ComboTableProps {
  combos: Food[];
  onEdit?: (combo: Food) => void;
  onDelete?: (id: number) => void;
}

const ComboTable = ({ combos, onEdit, onDelete }: ComboTableProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pageSize, setPageSize] = useState(8);

  // Pagination
  const { startIndex, endIndex, ...pagination } = usePagination({
    totalCount: combos.length,
    pageSize,
    maxVisiblePages: 5,
    initialPage: 1,
  });

  // Get current page data
  const currentPageData = useMemo(() => {
    return combos.slice(startIndex, endIndex + 1);
  }, [combos, startIndex, endIndex]);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Danh sách combo</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Page Size Selector */}
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 mỗi trang</SelectItem>
              <SelectItem value="8">8 mỗi trang</SelectItem>
              <SelectItem value="12">12 mỗi trang</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-5 w-5" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <Card>
        <CardContent className="p-0">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
              {currentPageData.map((combo) => (
                <ComboCard key={combo.id} combo={combo} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {currentPageData.map((combo) => (
                <ComboCard key={combo.id} combo={combo} onEdit={onEdit} onDelete={onDelete} viewMode="list" />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  pagination.prevPage();
                }}
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
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ComboTable;
