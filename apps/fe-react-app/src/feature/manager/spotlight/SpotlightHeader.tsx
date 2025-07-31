import { Button } from "@/components/Shadcn/ui/button";
import { Save } from "lucide-react";

interface SpotlightHeaderProps {
  onSaveChanges: () => void;
  hasUnsavedChanges: boolean;
}

function SpotlightHeader({ onSaveChanges, hasUnsavedChanges }: Readonly<SpotlightHeaderProps>) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Spotlight Movies Management</h1>
      </div>
      <div className="flex gap-2">
        <Button
          variant={hasUnsavedChanges ? "default" : "outline"}
          size="sm"
          onClick={onSaveChanges}
          disabled={!hasUnsavedChanges}
          className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
            hasUnsavedChanges
              ? "transform bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:scale-105 hover:from-orange-600 hover:to-orange-700"
              : "text-muted-foreground border-muted-foreground/50"
          } ${hasUnsavedChanges ? "animate-pulse" : ""} `}
        >
          <Save className={`mr-2 h-4 w-4 transition-transform duration-200 ${hasUnsavedChanges ? "animate-bounce" : ""}`} />
          {hasUnsavedChanges ? (
            <span className="relative">
              Save Changes
              <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-red-500"></span>
            </span>
          ) : (
            "Saved"
          )}
        </Button>
      </div>
    </div>
  );
}

export default SpotlightHeader;
