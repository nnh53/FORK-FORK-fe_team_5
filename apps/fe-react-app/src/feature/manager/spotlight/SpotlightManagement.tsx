import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import type { Movie } from "@/interfaces/movies.interface";
import { ROUTES } from "@/routes/route.constants";
import { queryMoviesForTrending, transformMoviesResponse } from "@/services/movieService";
import {
  addToSpotlight as addMovieToSpotlight,
  getSpotlightMovies,
  initializeSpotlight,
  isMovieInSpotlight,
  removeFromSpotlight as removeMovieFromSpotlight,
  updateSpotlightOrder,
  type SpotlightMovie,
} from "@/services/spotlightService";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip, Play, PlusCircle, RefreshCw, Save, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Error boundary component for better error handling
function SpotlightErrorBoundary({ children }: { children: React.ReactNode }) {
  return <div className="error-boundary">{children}</div>;
}

// SortableItem component for drag and drop
function SortableItem({
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
              {new Date(movie.fromDate || "").getFullYear()} • {movie.duration} phút
              {movie.trailer && " • Có trailer"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{primaryCategory}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => movie.id && onRemove(movie.id)}>
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

// Movie card component for the available movies
function MovieCard({
  movie,
  onAdd,
  isInSpotlight,
}: Readonly<{
  movie: Movie;
  onAdd: (movie: Movie) => void;
  isInSpotlight: boolean;
}>) {
  // Get the primary category if available
  const primaryCategory = movie.categories && movie.categories.length > 0 ? movie.categories[0].name : "Unknown";
  const releaseYear = movie.fromDate ? new Date(movie.fromDate).getFullYear() : "N/A";

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img src={movie.poster || ""} alt={movie.name} className="h-full w-full object-cover transition-transform hover:scale-105" />
        <Badge className="absolute right-2 top-2">{primaryCategory}</Badge>
        {movie.trailer && (
          <div className="absolute left-2 top-2">
            <Badge variant="default" className="bg-green-600">
              <Play className="mr-1 h-3 w-3" />
              Trailer
            </Badge>
          </div>
        )}
        {isInSpotlight && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="default" className="bg-blue-600">
              In Spotlight
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-3">
        <CardTitle className="line-clamp-1 text-base">{movie.name}</CardTitle>
        <div className="text-muted-foreground line-clamp-1 text-xs">
          {releaseYear} • {movie.duration} phút • {primaryCategory}
        </div>
      </CardHeader>
      <CardFooter className="p-2">
        <Button
          variant={isInSpotlight ? "outline" : "secondary"}
          size="sm"
          className="w-full text-xs"
          onClick={() => onAdd(movie)}
          disabled={isInSpotlight}
        >
          <PlusCircle className="mr-2 h-3 w-3" />
          {isInSpotlight ? "Already in Spotlight" : "Add to Spotlight"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function SpotlightManagement() {
  const [spotlightMovies, setSpotlightMovies] = useState<SpotlightMovie[]>([]);
  const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  // Use dedicated hook for loading all movies (only once for initialization)
  const moviesQuery = queryMoviesForTrending();

  // Load spotlight data from localStorage
  const loadSpotlightData = useCallback(() => {
    try {
      const spotlightData = getSpotlightMovies();
      setSpotlightMovies(spotlightData);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error loading spotlight data:", error);
      setError("Failed to load spotlight data");
    }
  }, []);

  // Initialize data when component mounts
  useEffect(() => {
    loadSpotlightData();
  }, [loadSpotlightData]);

  // Initialize movies from API when data is ready (only for available movies list)
  useEffect(() => {
    try {
      setIsLoading(true);
      if (moviesQuery.data?.result) {
        const transformedMovies = transformMoviesResponse(moviesQuery.data.result);
        setAvailableMovies(transformedMovies);

        // Initialize spotlight if empty
        const currentSpotlight = getSpotlightMovies();
        if (currentSpotlight.length === 0) {
          initializeSpotlight(transformedMovies);
          loadSpotlightData(); // Reload after initialization
        }
      }
      if (moviesQuery.error) {
        setError("Failed to load movies data");
      }
    } catch (error) {
      console.error("Error processing movies data:", error);
      setError("Failed to process movies data");
    } finally {
      setIsLoading(false);
    }
  }, [moviesQuery.data, moviesQuery.error, loadSpotlightData]);

  // Listen for spotlight updates from other sources
  useEffect(() => {
    const handleSpotlightUpdate = () => {
      loadSpotlightData();
    };

    window.addEventListener("spotlightUpdated", handleSpotlightUpdate);
    return () => {
      window.removeEventListener("spotlightUpdated", handleSpotlightUpdate);
    };
  }, [loadSpotlightData]);

  // Function to navigate to public spotlight page
  const handleNavigateToSpotlight = () => {
    navigate(ROUTES.SPOTLIGHT_SECTION);
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
      setSpotlightMovies((movies) => {
        const oldIndex = movies.findIndex((movie) => (movie.id?.toString() || "") === active.id);
        const newIndex = movies.findIndex((movie) => (movie.id?.toString() || "") === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(movies, oldIndex, newIndex);
          // Update the rank property based on new positions
          const rerankedMovies = newOrder.map((movie, index) => ({
            ...movie,
            rank: index + 1,
          }));

          setHasUnsavedChanges(true);
          return rerankedMovies;
        }
        return movies;
      });
    }
  }

  // Add a movie to spotlight list
  const addToSpotlight = (movie: Movie) => {
    const success = addMovieToSpotlight(movie);
    if (success) {
      loadSpotlightData();
      setHasUnsavedChanges(false);
    } else {
      // Show error message
      const currentSpotlight = getSpotlightMovies();
      if (currentSpotlight.length >= 4) {
        alert("Spotlight is full! Maximum 4 movies allowed.");
      } else {
        alert("Movie is already in spotlight or an error occurred.");
      }
    }
  };

  // Remove movie from spotlight list
  const removeFromSpotlight = (movieId: number) => {
    const success = removeMovieFromSpotlight(movieId);
    if (success) {
      loadSpotlightData();
      setHasUnsavedChanges(false);
    } else {
      alert("Failed to remove movie from spotlight.");
    }
  };

  // Handle save changes
  const handleSaveChanges = () => {
    try {
      const success = updateSpotlightOrder(spotlightMovies);
      if (success) {
        setHasUnsavedChanges(false);
        alert("Spotlight changes saved successfully!");
      } else {
        alert("Failed to save changes. Please try again.");
      }
    } catch (error) {
      console.error("Error saving spotlight data:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Reset to initial state
  const handleReset = () => {
    if (confirm("Are you sure you want to reset spotlight to default movies?")) {
      if (availableMovies.length > 0) {
        initializeSpotlight(availableMovies);
        loadSpotlightData();
        setHasUnsavedChanges(false);
      }
    }
  };

  // Error state
  if (error) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-600">Error</h2>
            <p className="text-gray-600">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SpotlightErrorBoundary>
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Spotlight Movies Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage cinema highlights and featured movies displayed in the spotlight section
              <br />
              <small className="text-xs">Data is saved to localStorage and will persist between sessions</small>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleNavigateToSpotlight}>
              <Play className="mr-2 h-4 w-4" />
              View Spotlight
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges}
              className={hasUnsavedChanges ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              <Save className="mr-2 h-4 w-4" />
              {hasUnsavedChanges ? "Save Changes *" : "Saved"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-lg">Loading movies data...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="list">Spotlight List ({spotlightMovies.length}/4)</TabsTrigger>
              <TabsTrigger value="add">Add Movies</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="border-none p-0 pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Current Spotlight Movies</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Drag and drop to reorder. Movies with trailers are preferred for spotlight display. Maximum 4 movies allowed.
                  </p>
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
                          items={spotlightMovies.map((m, index) => m.id?.toString() || `item-${index}`)}
                          strategy={verticalListSortingStrategy}
                        >
                          {spotlightMovies.map((movie) => (
                            <SortableItem key={movie.id} movie={movie} onRemove={removeFromSpotlight} />
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
            </TabsContent>

            <TabsContent value="add" className="border-none p-0 pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Add Movies to Spotlight</CardTitle>
                  <div className="relative mt-2">
                    <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                    <Input placeholder="Search movies..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Movies with trailers are ideal for spotlight display as they create engaging visual content. You can add up to{" "}
                    {4 - spotlightMovies.length} more movie{4 - spotlightMovies.length !== 1 ? "s" : ""}.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredMovies.map((movie) => (
                      <MovieCard
                        key={movie.id?.toString()}
                        movie={movie}
                        onAdd={addToSpotlight}
                        isInSpotlight={movie.id ? isMovieInSpotlight(movie.id) : false}
                      />
                    ))}
                  </div>
                  {filteredMovies.length === 0 && searchTerm && (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">No movies found matching "{searchTerm}"</p>
                    </div>
                  )}
                  {filteredMovies.length === 0 && !searchTerm && (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">No movies available to add to spotlight</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </SpotlightErrorBoundary>
  );
}

export default SpotlightManagement;
