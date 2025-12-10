import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Flag } from "lucide-react";

interface Session {
  id: string;
  sessionDate: string;
  useSite: string;
  isBaseline?: boolean;
}

interface ComparisonSelectorProps {
  currentSessionDate: string;
  availableSessions: Session[];
  selectedComparisonId: string | null;
  onSelectComparison: (id: string | null) => void;
}

export const ComparisonSelector = ({
  currentSessionDate,
  availableSessions,
  selectedComparisonId,
  onSelectComparison,
}: ComparisonSelectorProps) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-secondary/30 rounded-xl border border-secondary/50 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted-foreground">
          Current: <span className="text-foreground font-medium">{formatDate(currentSessionDate)}</span>
        </span>
        <span className="text-muted-foreground">→</span>
        <span className="text-xs text-muted-foreground">Compare with:</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {availableSessions.map((session) => {
          const isSelected = session.id === selectedComparisonId;
          const isBaseline = session.isBaseline;
          
          return (
            <button
              key={session.id}
              onClick={() => onSelectComparison(isSelected ? null : session.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                isBaseline
                  ? isSelected
                    ? "bg-primary text-primary-foreground ring-2 ring-primary"
                    : "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                  : isSelected
                    ? "bg-secondary text-secondary-foreground ring-2 ring-secondary"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {isBaseline && <Flag className="h-3 w-3" />}
              {isBaseline ? "Baseline" : formatDate(session.sessionDate)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
