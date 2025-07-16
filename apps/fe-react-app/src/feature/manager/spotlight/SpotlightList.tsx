import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import type { SpotlightMovie } from "@/services/spotlightService";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableSpotlightItem from "./SortableSpotlightItem";

interface SpotlightListProps {
  spotlightMovies: SpotlightMovie[];
  onRemove: (movieId: number) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

function SpotlightList({ spotlightMovies, onRemove, onDragEnd }: Readonly<SpotlightListProps>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Current Spotlight Movies</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-10">Rank</TableHead>
                <TableHead>Movie</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext items={spotlightMovies.map((m) => m.id?.toString() || `item-${m.id}`)} strategy={verticalListSortingStrategy}>
                {spotlightMovies.map((movie) => (
                  <SortableSpotlightItem key={movie.id} movie={movie} onRemove={onRemove} />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
        {spotlightMovies.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No spotlight movies selected.</p>
            <p className="text-muted-foreground mt-1 text-sm">Switch to "Add Movies" tab to start building your spotlight collection.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SpotlightList;
