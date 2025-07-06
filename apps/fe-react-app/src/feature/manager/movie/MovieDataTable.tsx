import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Checkbox } from "@/components/Shadcn/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/ui/dropdown-menu";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import type { Movie } from "@/interfaces/movies.interface";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import React from "react";

const getStatusBadgeVariant = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "UPCOMING":
      return "secondary";
    case "INACTIVE":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusClassName = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "UPCOMING":
      return "bg-blue-100 text-blue-800";
    case "INACTIVE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface MovieDataTableProps {
  data: Movie[];
  onEdit: (movie: Movie) => void;
  onView: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export function MovieDataTable({ data, onEdit, onView, onDelete }: Readonly<MovieDataTableProps>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Movie>[] = [
    {
      accessorKey: "name",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium" title={row.getValue("name") ?? "N/A"}>
          {row.getValue("name") ?? "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "director",
      header: "Director",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("director") || "N/A"}</div>,
    },
    {
      accessorKey: "studio",
      header: "Studio",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("studio") || "N/A"}</div>,
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const duration = row.getValue("duration") as number | undefined;
        return <div>{duration ? `${duration} min` : "N/A"}</div>;
      },
    },
    {
      accessorKey: "ageRestrict",
      header: "Age Restrict",
      cell: ({ row }) => {
        const age = row.getValue("ageRestrict") as number;
        return <div>{age ? `${age}+` : "N/A"}</div>;
      },
    },
    {
      accessorKey: "categories",
      header: "Categories",
      cell: ({ row }) => {
        const categories = row.getValue("categories") as Array<{ name?: string }>;
        return (
          <div className="flex flex-wrap gap-1">
            {categories && categories.length > 0 ? (
              categories.map((cat, index) => (
                <Badge key={`${cat.name}-${index}`} variant="outline" className="text-xs">
                  {cat.name}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "fromDate",
      header: "Release Period",
      cell: ({ row }) => {
        const fromDate = row.getValue("fromDate") as string;
        const toDate = row.original.toDate;

        if (!fromDate) return <div className="text-muted-foreground">N/A</div>;

        const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString();
        };

        return (
          <div className="text-sm">
            {formatDate(fromDate)} - {toDate ? formatDate(toDate) : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={getStatusBadgeVariant(status)} className={getStatusClassName(status)}>
            {status?.toUpperCase() || "UNKNOWN"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const movie = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(movie)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(movie)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(movie)} className="text-red-600 focus:text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuItem key={column.id} className="capitalize" onClick={() => column.toggleVisibility(!column.getIsVisible())}>
                    <Checkbox checked={column.getIsVisible()} className="mr-2" />
                    {column.id}
                  </DropdownMenuItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">Showing {table.getFilteredRowModel().rows.length} movie(s).</div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">Rows per page</Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              {"<<"}
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">Go to previous page</span>
              {"<"}
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className="sr-only">Go to next page</span>
              {">"}
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
