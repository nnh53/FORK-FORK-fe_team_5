import { Button } from "@/components/Shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/ui/dropdown-menu";
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
import type { MovieCategory } from "@/interfaces/movie-category.interface";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { forwardRef, useImperativeHandle, useMemo } from "react";

interface MovieCategoryDataTableProps {
  data: MovieCategory[];
  onEdit: (category: MovieCategory) => void;
  onDelete: (category: MovieCategory) => void;
}

export const MovieCategoryDataTable = forwardRef<{ resetPagination: () => void }, MovieCategoryDataTableProps>(({ data, onEdit, onDelete }, ref) => {
  const { sortedData, getSortProps } = useSortable<MovieCategory>(data);

  // Pagination configuration
  const pagination = usePagination({
    totalCount: sortedData.length,
    pageSize: 10,
    maxVisiblePages: 5,
    initialPage: 1,
  });

  // Expose resetPagination method through ref
  useImperativeHandle(ref, () => ({
    resetPagination: () => pagination.setPage(1),
  }));

  // Get current page data
  const currentPageData = useMemo(() => {
    return sortedData.slice(pagination.startIndex, pagination.endIndex + 1);
  }, [sortedData, pagination.startIndex, pagination.endIndex]);

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton {...getSortProps("name")}>Tên thể loại</SortButton>
              </TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.length > 0 ? (
              currentPageData.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="max-w-[200px] truncate font-medium" title={category.name ?? "N/A"}>
                      {category.name ?? "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground max-w-[300px] truncate" title={category.description ?? "N/A"}>
                      {category.description ?? "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(category)} className="text-red-600 focus:text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results.
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

MovieCategoryDataTable.displayName = "MovieCategoryDataTable";
