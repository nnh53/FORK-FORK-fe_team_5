import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/ui/dropdown-menu";
import type { Movie } from "@/interfaces/movies.interface";
import { formatAgeRestrict, formatDateRange, formatDuration, getStatusBadgeVariant, getStatusClassName } from "@/utils/color.utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Tags, Trash } from "lucide-react";

interface MovieTableActionsProps {
  movie: Movie;
  onView: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onManageGenres?: (movie: Movie) => void;
}

export const MovieTableActions = ({ movie, onView, onEdit, onDelete, onManageGenres }: MovieTableActionsProps) => {
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
        {onManageGenres && (
          <DropdownMenuItem onClick={() => onManageGenres(movie)}>
            <Tags className="mr-2 h-4 w-4" />
            Manage Genres
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(movie)} className="text-red-600 focus:text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createMovieColumns = (
  onView: (movie: Movie) => void,
  onEdit: (movie: Movie) => void,
  onDelete: (movie: Movie) => void,
  onManageGenres?: (movie: Movie) => void,
): ColumnDef<Movie>[] => [
  {
    accessorKey: "name",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium" title={row.getValue("name") ?? "N/A"}>
        {row.getValue("name") ?? "N/A"}
      </div>
    ),
    enableHiding: false,
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
    cell: ({ row }) => <div>{formatDuration(row.getValue("duration"))}</div>,
  },
  {
    accessorKey: "ageRestrict",
    header: "Age Restrict",
    cell: ({ row }) => <div>{formatAgeRestrict(row.getValue("ageRestrict"))}</div>,
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

      return <div className="text-sm">{formatDateRange(fromDate, toDate)}</div>;
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
    cell: ({ row }) => <MovieTableActions movie={row.original} onView={onView} onEdit={onEdit} onDelete={onDelete} onManageGenres={onManageGenres} />,
  },
];
