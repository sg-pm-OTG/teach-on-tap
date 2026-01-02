import { Check, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface Session {
  id: string;
  sessionDate: string;
  useSite: string;
}

interface SessionChipSelectorProps {
  sessions: Session[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  compareMode: boolean;
  onToggleCompare: () => void;
  canCompare: boolean;
}

export const SessionChipSelector = ({
  sessions,
  selectedId,
  onSelect,
  compareMode,
  onToggleCompare,
  canCompare,
}: SessionChipSelectorProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "No date";
    try {
      return format(parseISO(dateStr), "MMM d");
    } catch {
      return dateStr || "No date";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {sessions.map((session) => {
          const isSelected = session.id === selectedId;
          return (
            <button
              key={session.id}
              onClick={() => onSelect(session.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {isSelected && <Check className="h-3 w-3" />}
              {formatDate(session.sessionDate)}
            </button>
          );
        })}
        
        {/* Compare Toggle Button */}
        {canCompare && (
          <button
            onClick={onToggleCompare}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ml-auto",
              compareMode
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <GitCompare className="h-3 w-3" />
            {compareMode ? "Comparing" : "Compare"}
          </button>
        )}
      </div>
    </div>
  );
};
