import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import type { Movie } from "@/interfaces/movies.interface";
import { ROUTES } from "@/routes/route.constants";
import { queryMovies, transformMoviesResponse } from "@/services/movieService";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileDown, FileUp, Grip, PlusCircle, Save, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define TrendingMovie interface to include ranking
interface TrendingMovie extends Movie {
  rank?: number;
}

// SortableItem component for drag and drop
function SortableItem({ movie }: Readonly<{ movie: TrendingMovie }>) {
  const id = movie.id?.toString() || "";
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get the primary category if available
  const primaryCategory = movie.categories && movie.categories.length > 0 ? movie.categories[0].name : "Unknown";

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
          <img src={movie.poster || ""} alt={movie.name} className="h-12 w-8 rounded object-cover" />
          <div>
            <p className="font-medium">{movie.name}</p>
            <p className="text-muted-foreground text-xs">
              {new Date(movie.fromDate || "").getFullYear()} • {movie.duration} phút
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{primaryCategory}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

// Movie card component for the available movies
function MovieCard({ movie, onAdd }: Readonly<{ movie: Movie; onAdd: (movie: Movie) => void }>) {
  // Get the primary category if available
  const primaryCategory = movie.categories && movie.categories.length > 0 ? movie.categories[0].name : "Unknown";
  const releaseYear = movie.fromDate ? new Date(movie.fromDate).getFullYear() : "N/A";

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img src={movie.poster || ""} alt={movie.name} className="h-full w-full object-cover transition-transform hover:scale-105" />
        <Badge className="absolute right-2 top-2">{primaryCategory}</Badge>
      </div>
      <CardHeader className="p-3">
        <CardTitle className="line-clamp-1 text-base">{movie.name}</CardTitle>
        <div className="text-muted-foreground line-clamp-1 text-xs">
          {releaseYear} • {movie.duration} phút • {primaryCategory}
        </div>
      </CardHeader>
      <CardFooter className="p-2">
        <Button variant="secondary" size="sm" className="w-full text-xs" onClick={() => onAdd(movie)}>
          <PlusCircle className="mr-2 h-3 w-3" />
          Add to Trending
        </Button>
      </CardFooter>
    </Card>
  );
}

export function TrendingManagement() {
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
  const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const navigate = useNavigate();

  // Get all movies using React Query
  const moviesQuery = queryMovies();

  // Initialize movies from API when data is ready
  useEffect(() => {
    if (moviesQuery.data?.result) {
      // Transform API response to Movie interface
      const transformedMovies = transformMoviesResponse(moviesQuery.data.result);

      // Initialize trending movies with first 5 movies with rank added
      const initialTrendingMovies = transformedMovies.slice(0, 5).map((movie, index) => ({
        ...movie,
        rank: index + 1,
      }));

      // Other movies available to add
      const remainingMovies = transformedMovies.slice(5);

      setTrendingMovies(initialTrendingMovies as TrendingMovie[]);
      setAvailableMovies(remainingMovies);
    }
  }, [moviesQuery.data]);

  // Function to navigate to public trending page
  const handleNavigateToTrending = () => {
    navigate(ROUTES.TRENDING_SECTION);
  };

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Filter available movies based on search term
  const filteredMovies = availableMovies.filter((movie) => movie.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

  // Handle drag end for reordering
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTrendingMovies((movies) => {
        const oldIndex = movies.findIndex((movie) => (movie.id?.toString() || "") === active.id);
        const newIndex = movies.findIndex((movie) => (movie.id?.toString() || "") === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(movies, oldIndex, newIndex);
          // Update the rank property based on new positions
          return newOrder.map((movie, index) => ({
            ...movie,
            rank: index + 1,
          }));
        }
        return movies;
      });
    }
  }

  // Add a movie to trending list
  const addToTrending = (movie: Movie) => {
    // Only add if it's not already in the trending list
    if (!trendingMovies.find((m) => m.id === movie.id)) {
      const newMovie: TrendingMovie = {
        ...movie,
        rank: trendingMovies.length + 1,
      };
      setTrendingMovies([...trendingMovies, newMovie]);
    }
  };

  // Handle save changes
  const handleSaveChanges = () => {
    try {
      // Prepare data for the API
      const trendingData = trendingMovies.map((movie, index) => ({
        movieId: movie.id,
        rank: index + 1,
      }));

      // For now we'll just log it, but in a real app this would be sent to an API endpoint
      console.log("Saving trending data:", trendingData);

      // Show success message
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving trending data:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Import/Export functionality (mock)
  const handleImport = () => {
    alert("Import functionality would be implemented here");
  };

  const handleExport = () => {
    alert("Export functionality would be implemented here");
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trending Movies Management</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="default" size="sm" onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {moviesQuery.isLoading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-lg">Loading movies data...</p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="list">Trending List</TabsTrigger>
            <TabsTrigger value="add">Add Movies</TabsTrigger>
            <TabsTrigger value="view" onClick={handleNavigateToTrending}>
              View Public Page
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="border-none p-0 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Current Trending Movies</CardTitle>
              </CardHeader>
              <CardContent>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead className="w-10">Rank</TableHead>
                        <TableHead>Movie</TableHead>
                        <TableHead>Genre</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SortableContext
                        items={trendingMovies.map((m, index) => m.id?.toString() || `item-${index}`)}
                        strategy={verticalListSortingStrategy}
                      >
                        {trendingMovies.map((movie) => (
                          <SortableItem key={movie.id} movie={movie} />
                        ))}
                      </SortableContext>
                    </TableBody>
                  </Table>
                </DndContext>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="border-none p-0 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Add Movies to Trending</CardTitle>
                <div className="relative mt-2">
                  <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                  <Input placeholder="Search movies..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent>
                {" "}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredMovies.map((movie) => (
                    <MovieCard key={movie.id?.toString()} movie={movie} onAdd={addToTrending} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default TrendingManagement;
