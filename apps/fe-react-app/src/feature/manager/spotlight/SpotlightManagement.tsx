import { Button } from "@/components/Shadcn/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import { useSpotlightManagement } from "@/hooks/useSpotlightManagement";
import { toast } from "sonner";
import AddMoviesSection from "./AddtoSpotlight";
import SpotlightErrorBoundary from "./SpotlightErrorBoundary";
import SpotlightHeader from "./SpotlightHeader";
import SpotlightList from "./SpotlightList";

export function SpotlightManagement() {
  const {
    spotlightMovies,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    hasUnsavedChanges,
    filteredMovies,
    handleDragEnd,
    handleAddToSpotlight,
    handleRemoveFromSpotlight,
    handleSaveChanges,
    isMovieInSpotlight,
  } = useSpotlightManagement();

  if (error) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-600">Error</h2>
            <p className="text-gray-600">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                toast("Retrying...");
                window.location.reload();
              }}
            >
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
        <SpotlightHeader onSaveChanges={handleSaveChanges} hasUnsavedChanges={hasUnsavedChanges} />

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-lg">Loading movies data...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="list">Spotlight List ({spotlightMovies.length})</TabsTrigger>
              <TabsTrigger value="add">Add Movies</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="border-none p-0 pt-4">
              <SpotlightList spotlightMovies={spotlightMovies} onRemove={handleRemoveFromSpotlight} onDragEnd={handleDragEnd} />
            </TabsContent>

            <TabsContent value="add" className="border-none p-0 pt-4">
              <AddMoviesSection
                filteredMovies={filteredMovies}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAdd={handleAddToSpotlight}
                isMovieInSpotlight={isMovieInSpotlight}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </SpotlightErrorBoundary>
  );
}

export default SpotlightManagement;
