import { format, parseISO } from "date-fns";
import { GitCompare, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreItem {
  label: string;
  score: number;
}

interface ComparisonSession {
  id: string;
  date: string;
  isBaseline?: boolean;
  scenarioScores: ScoreItem[];
  dialogueScores: ScoreItem[];
}

interface ComparisonSummaryCardProps {
  currentSession: ComparisonSession;
  comparisonSessions: ComparisonSession[];
}

interface MarkerChange {
  label: string;
  change: number;
  currentScore: number;
  previousScore: number;
}

export const ComparisonSummaryCard = ({
  currentSession,
  comparisonSessions,
}: ComparisonSummaryCardProps) => {
  if (comparisonSessions.length === 0) return null;

  // Find earliest comparison session for growth calculation
  const sortedComparisons = [...comparisonSessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const earliestComparison = sortedComparisons[0];

  // Calculate marker-by-marker changes
  const scenarioChanges: MarkerChange[] = currentSession.scenarioScores.map((current) => {
    const previous = earliestComparison.scenarioScores.find(s => s.label === current.label);
    return {
      label: current.label,
      change: previous ? current.score - previous.score : 0,
      currentScore: current.score,
      previousScore: previous?.score || 0,
    };
  });

  const dialogueChanges: MarkerChange[] = currentSession.dialogueScores.map((current) => {
    const previous = earliestComparison.dialogueScores.find(s => s.label === current.label);
    return {
      label: current.label,
      change: previous ? current.score - previous.score : 0,
      currentScore: current.score,
      previousScore: previous?.score || 0,
    };
  });

  // Group changes
  const allChanges = [...scenarioChanges, ...dialogueChanges];
  const improved = allChanges.filter(c => c.change > 0).sort((a, b) => b.change - a.change);
  const declined = allChanges.filter(c => c.change < 0).sort((a, b) => a.change - b.change);
  const stable = allChanges.filter(c => c.change === 0);

  const formatLabel = (session: ComparisonSession) => {
    if (session.isBaseline) return "Baseline";
    try {
      return format(parseISO(session.date), "MMM d");
    } catch {
      return session.date;
    }
  };

  const truncateLabel = (label: string, maxLength: number = 16) => {
    return label.length > maxLength ? label.substring(0, maxLength) + "…" : label;
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <GitCompare className="h-4 w-4 text-primary" />
        <h4 className="font-medium text-sm text-foreground">Marker Comparison</h4>
      </div>
      
      {/* Selected comparisons */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs text-muted-foreground">vs</span>
        {comparisonSessions.map((session) => (
          <span 
            key={session.id}
            className={`text-xs px-2 py-0.5 rounded-full ${
              session.isBaseline 
                ? "bg-primary/10 text-primary font-medium" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            {formatLabel(session)}
          </span>
        ))}
      </div>
      
      {/* Improved markers */}
      {improved.length > 0 && (
        <div className="bg-background/50 rounded-lg p-3 mb-2">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-600">Improved ({improved.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {improved.slice(0, 4).map((marker, i) => (
              <span 
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px]"
              >
                {truncateLabel(marker.label)}
                <span className="font-semibold">+{Math.round(marker.change)}</span>
              </span>
            ))}
            {improved.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{improved.length - 4} more</span>
            )}
          </div>
        </div>
      )}

      {/* Declined markers */}
      {declined.length > 0 && (
        <div className="bg-background/50 rounded-lg p-3 mb-2">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
            <span className="text-xs font-medium text-rose-600">Needs Attention ({declined.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {declined.slice(0, 4).map((marker, i) => (
              <span 
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 text-[10px]"
              >
                {truncateLabel(marker.label)}
                <span className="font-semibold">{Math.round(marker.change)}</span>
              </span>
            ))}
            {declined.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{declined.length - 4} more</span>
            )}
          </div>
        </div>
      )}

      {/* Stable markers */}
      {stable.length > 0 && (
        <div className="bg-background/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Minus className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Stable ({stable.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stable.slice(0, 3).map((marker, i) => (
              <span 
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]"
              >
                {truncateLabel(marker.label)}
              </span>
            ))}
            {stable.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{stable.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
