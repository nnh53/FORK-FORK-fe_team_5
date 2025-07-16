import { Button } from "@/components/Shadcn/ui/button";
import { ROUTES } from "@/routes/route.constants";
import { Play, RefreshCw, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SpotlightHeaderProps {
  onReset: () => void;
  onSaveChanges: () => void;
  hasUnsavedChanges: boolean;
}

function SpotlightHeader({ onReset, onSaveChanges, hasUnsavedChanges }: Readonly<SpotlightHeaderProps>) {
  const navigate = useNavigate();

  const handleNavigateToSpotlight = () => {
    navigate(ROUTES.SPOTLIGHT_SECTION);
  };

  return (
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
        <Button variant="outline" size="sm" onClick={onReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onSaveChanges}
          disabled={!hasUnsavedChanges}
          className={hasUnsavedChanges ? "bg-orange-600 hover:bg-orange-700" : ""}
        >
          <Save className="mr-2 h-4 w-4" />
          {hasUnsavedChanges ? "Save Changes *" : "Saved"}
        </Button>
      </div>
    </div>
  );
}

export default SpotlightHeader;
