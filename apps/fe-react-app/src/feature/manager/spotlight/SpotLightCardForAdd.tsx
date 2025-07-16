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
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img src={movie.poster || ""} alt={movie.name} className="h-full w-full object-cover transition-transform hover:scale-105" />
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
