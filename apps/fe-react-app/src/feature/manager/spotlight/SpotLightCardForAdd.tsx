import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Movie } from "@/interfaces/movies.interface";
import { Play, PlusCircle } from "lucide-react";

function SpotLightCardForAdd({
  movie,
  onAdd,
  isInSpotlight,
}: Readonly<{
  movie: Movie;
  onAdd: (movie: Movie) => void;
  isInSpotlight: boolean;
}>) {
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

export default SpotLightCardForAdd;
