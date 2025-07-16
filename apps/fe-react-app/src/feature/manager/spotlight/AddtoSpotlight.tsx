import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import type { Movie } from "@/interfaces/movies.interface";
import { Search } from "lucide-react";
import SpotLightCardForAdd from "./SpotLightCardForAdd";

interface AddMoviesSectionProps {
  filteredMovies: Movie[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdd: (movie: Movie) => void;
  isMovieInSpotlight: (movieId: number) => boolean;
}

function AddMoviesSection({
  filteredMovies,
  searchTerm,
  setSearchTerm,
  onAdd,
  isMovieInSpotlight,
}: Readonly<AddMoviesSectionProps>) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Add Movies to Spotlight</CardTitle>
        <div className="relative mt-2">
          <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
          <Input placeholder="Search movies..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((movie) => (
            <SpotLightCardForAdd
              key={movie.id?.toString()}
              movie={movie}
              onAdd={onAdd}
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
  );
}

export default AddMoviesSection;
