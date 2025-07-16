import { Button } from "@/components/Shadcn/ui/button";
import { ROUTES } from "@/routes/route.constants";
import { Play, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SpotlightHeaderProps {
  onSaveChanges: () => void;
  hasUnsavedChanges: boolean;
}

function SpotlightHeader({ onSaveChanges, hasUnsavedChanges }: Readonly<SpotlightHeaderProps>) {
  const navigate = useNavigate();

  const handleNavigateToSpotlight = () => {
    navigate(ROUTES.SPOTLIGHT_SECTION);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Spotlight Movies Management</h1>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleNavigateToSpotlight}>
          <Play className="mr-2 h-4 w-4" />
          View Spotlight
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
