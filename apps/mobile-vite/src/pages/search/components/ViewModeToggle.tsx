import { Grid, List } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`p-2 rounded-lg ${
          viewMode === "grid"
            ? "bg-orange-100 text-orange-600"
            : "text-gray-600"
        }`}
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`p-2 rounded-lg ${
          viewMode === "list"
            ? "bg-orange-100 text-orange-600"
            : "text-gray-600"
        }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}

export type { ViewModeToggleProps };