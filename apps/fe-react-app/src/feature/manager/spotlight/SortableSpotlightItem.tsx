import { Button } from "@/components/Shadcn/ui/button";
import { TableCell, TableRow } from "@/components/Shadcn/ui/table";
import type { SpotlightMovie } from "@/services/spotlightService";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip, Play, X } from "lucide-react";

function SortableSpotlightItem({
  movie,
  onRemove,
}: Readonly<{
  movie: SpotlightMovie;
  onRemove: (movieId: number) => void;
}>) {
  const id = movie.id?.toString() || "";
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className="hover:bg-muted/50">
      <TableCell className="w-10">
        <div {...attributes} {...listeners} className="cursor-grab">
          <Grip className="h-4 w-4" />
        </div>
      </TableCell>
      <TableCell className="w-10">{movie.rank}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={movie.poster || ""} alt={movie.name} className="h-12 w-8 rounded object-cover" />
            {movie.trailer && (
              <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50">
                <Play className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{movie.name}</p>
            <p className="text-muted-foreground text-xs">
              {new Date(movie.fromDate || "").getFullYear()}
              {movie.trailer && " • Có trailer"}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-right">
        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => movie.id && onRemove(movie.id)}>
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default SortableSpotlightItem;
