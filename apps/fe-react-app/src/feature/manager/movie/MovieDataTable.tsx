import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/Shadcn/ui/dropdown-menu";
import { Label } from "@/components/Shadcn/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Shadcn/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { SortButton } from "@/components/shared/SortButton";
import { usePagination } from "@/hooks/usePagination";
import { useSortable } from "@/hooks/useSortable";
import type { Movie } from "@/interfaces/movies.interface";
import { formatAgeRestrict, formatDateRange, formatDuration, getStatusBadgeVariant, getStatusClassName } from "@/utils/color.utils";
import { ChevronDown, Columns3, Edit, Eye, MoreHorizontal, Tags, Trash } from "lucide-react";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";

interface MovieDataTableProps {
  data: Movie[];
  onEdit: (movie: Movie) => void;
  onView: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onManageGenres?: (movie: Movie) => void;
}

// Helper component for Movie actions
const MovieTableActions = ({
  movie,
  onView,
  onEdit,
  onDelete,
  onManageGenres,
}: {
  movie: Movie;
  onView: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onManageGenres?: (movie: Movie) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid grid-cols-1">
        <Button variant="ghost" className="w-auto justify-start" onClick={() => onView(movie)}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button variant="ghost" className="w-auto justify-start" onClick={() => onEdit(movie)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        {onManageGenres && (
          <Button variant="ghost" className="w-auto justify-start" onClick={() => onManageGenres(movie)}>
            <Tags className="mr-2 h-4 w-4" />
            Manage Genres
          </Button>
        )}
        <Button variant="ghost" className="w-auto justify-start text-red-600" onClick={() => onDelete(movie)}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const MovieDataTable = forwardRef<{ resetPagination: () => void }, MovieDataTableProps>(
  ({ data, onEdit, onView, onDelete, onManageGenres }, ref) => {
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
      name: true,
      duration: true,
      ageRestrict: true,
      categories: true,
      fromDate: true,
      status: true,
    });
    const [pageSize, setPageSize] = useState<number>(10);

    const { sortedData, getSortProps } = useSortable<Movie>(data);

    // Pagination configuration
    const pagination = usePagination({
      totalCount: sortedData.length,
      pageSize,
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

    // Handle column visibility toggle
    const toggleColumnVisibility = (columnId: string, isVisible: boolean) => {
      setVisibleColumns((prev) => ({
        ...prev,
        [columnId]: isVisible,
      }));
    };

    // Get visible columns
    const getVisibleColumns = () => {
      return Object.entries(visibleColumns)
        .filter(([, isVisible]) => isVisible)
        .map(([key]) => key);
    };

    // Handle page size change
    const handlePageSizeChange = (value: string) => {
      const newSize = Number(value);
      setPageSize(newSize);
      pagination.setPage(1);
    };

    return (
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">Rows per page</Label>
            <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Columns3 className="mr-2 h-4 w-4" />
                <span>Customize Columns</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {Object.keys(visibleColumns).map((columnId) => (
                <DropdownMenuCheckboxItem
                  key={columnId}
                  className="capitalize"
                  checked={visibleColumns[columnId]}
                  onCheckedChange={(value) => toggleColumnVisibility(columnId, !!value)}
                >
                  {columnId}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.name && (
                  <TableHead>
                    <SortButton {...getSortProps("name")}>Title</SortButton>
                  </TableHead>
                )}
                {visibleColumns.duration && (
                  <TableHead>
                    <SortButton {...getSortProps("duration")}>Duration</SortButton>
                  </TableHead>
                )}
                {visibleColumns.ageRestrict && (
                  <TableHead>
                    <SortButton {...getSortProps("ageRestrict")}>Age Restrict</SortButton>
                  </TableHead>
                )}
                {visibleColumns.categories && <TableHead>Categories</TableHead>}
                {visibleColumns.fromDate && (
                  <TableHead>
                    <SortButton {...getSortProps("fromDate")}>Release Period</SortButton>
                  </TableHead>
                )}
                {visibleColumns.status && <TableHead>Status</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.length > 0 ? (
                currentPageData.map((movie) => (
                  <TableRow key={movie.id}>
                    {visibleColumns.name && (
                      <TableCell>
                        <div className="max-w-[200px] truncate font-medium" title={movie.name ?? "N/A"}>
                          {movie.name ?? "N/A"}
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.duration && (
                      <TableCell>
                        <div>{formatDuration(movie.duration)}</div>
                      </TableCell>
                    )}
                    {visibleColumns.ageRestrict && (
                      <TableCell>
                        <div>{formatAgeRestrict(movie.ageRestrict)}</div>
                      </TableCell>
                    )}
                    {visibleColumns.categories && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {movie.categories && movie.categories.length > 0 ? (
                            movie.categories.map((cat, catIndex) => (
                              <Badge key={`${cat.name}-${catIndex}`} variant="outline" className="text-xs">
                                {cat.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.fromDate && (
                      <TableCell>
                        <div className="text-sm">{movie.fromDate ? formatDateRange(movie.fromDate, movie.toDate) : "N/A"}</div>
                      </TableCell>
                    )}
                    {visibleColumns.status && (
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(movie.status)} className={getStatusClassName(movie.status)}>
                          {movie.status?.toUpperCase() || "UNKNOWN"}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <MovieTableActions movie={movie} onView={onView} onEdit={onEdit} onDelete={onDelete} onManageGenres={onManageGenres} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={getVisibleColumns().length + 1} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="justify-between py-4">
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
                        <PaginationItem key={`ellipsis-${pagination.currentPage}-${pagination.totalPages}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => pagination.setPage(page)}
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
            </div>
          )}
        </div>
      </div>
    );
  },
);

MovieDataTable.displayName = "MovieDataTable";
