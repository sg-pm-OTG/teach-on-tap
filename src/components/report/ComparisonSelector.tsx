import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Flag, Check } from "lucide-react";

interface Session {
  id: string;
  sessionDate: string;
  useSite: string;
  isBaseline?: boolean;
}

interface ComparisonSelectorProps {
  currentSessionDate: string;
  availableSessions: Session[];
  selectedComparisonIds: string[];
  onSelectComparison: (ids: string[]) => void;
  maxSelections?: number;
}

export const ComparisonSelector = ({
  currentSessionDate,
  availableSessions,
  selectedComparisonIds,
  onSelectComparison,
  maxSelections = 5,
}: ComparisonSelectorProps) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d");
    } catch {
      return dateStr;
    }
  };

  const handleToggleSession = (id: string) => {
    if (selectedComparisonIds.includes(id)) {
      // Remove from selection
      onSelectComparison(selectedComparisonIds.filter((sid) => sid !== id));
    } else if (selectedComparisonIds.length < maxSelections) {
      // Add to selection
      onSelectComparison([...selectedComparisonIds, id]);
    }
  };

  const isAtMax = selectedComparisonIds.length >= maxSelections;

  return (
    <div className="bg-secondary/30 rounded-xl border border-secondary/50 p-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Current: <span className="text-foreground font-medium">{formatDate(currentSessionDate)}</span>
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="text-xs text-muted-foreground">Compare with:</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {selectedComparisonIds.length}/{maxSelections}
        </span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {availableSessions.map((session) => {
          const isSelected = selectedComparisonIds.includes(session.id);
          const isBaseline = session.isBaseline;
          const isDisabled = !isSelected && isAtMax;
          
          return (
            <button
              key={session.id}
              onClick={() => !isDisabled && handleToggleSession(session.id)}
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                isDisabled && "opacity-40 cursor-not-allowed",
                isBaseline
                  ? isSelected
                    ? "bg-primary text-primary-foreground ring-2 ring-primary"
                    : "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                  : isSelected
                    ? "bg-secondary text-secondary-foreground ring-2 ring-secondary"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {isSelected && <Check className="h-3 w-3" />}
              {isBaseline && <Flag className="h-3 w-3" />}
              {isBaseline ? "Baseline" : formatDate(session.sessionDate)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
