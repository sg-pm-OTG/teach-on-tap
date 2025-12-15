import { format, parseISO } from "date-fns";
import { GitCompare, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ComparisonSession {
  id: string;
  date: string;
  isBaseline?: boolean;
  scenarioAvg: number;
  dialogueAvg: number;
}

interface ComparisonSummaryCardProps {
  currentSession: ComparisonSession;
  comparisonSessions: ComparisonSession[];
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

  const scenarioGrowth = currentSession.scenarioAvg - earliestComparison.scenarioAvg;
  const dialogueGrowth = currentSession.dialogueAvg - earliestComparison.dialogueAvg;

  const formatLabel = (session: ComparisonSession) => {
    if (session.isBaseline) return "Baseline";
    try {
      return format(parseISO(session.date), "MMM d");
    } catch {
      return session.date;
    }
  };

  const GrowthIndicator = ({ value, label }: { value: number; label: string }) => {
    const isPositive = value > 0;
    const isNeutral = value === 0;
    const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
    
    return (
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${
          isPositive ? "text-emerald-600" : isNeutral ? "text-muted-foreground" : "text-rose-600"
        }`} />
        <span className={`text-sm font-semibold ${
          isPositive ? "text-emerald-600" : isNeutral ? "text-muted-foreground" : "text-rose-600"
        }`}>
          {isPositive ? "+" : ""}{value.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <GitCompare className="h-4 w-4 text-primary" />
        <h4 className="font-medium text-sm text-foreground">Comparison Summary</h4>
      </div>
      
      {/* Selected comparisons */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs text-muted-foreground">Comparing with:</span>
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
      
      {/* Growth from earliest */}
      <div className="bg-background/50 rounded-lg p-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
          Growth from {formatLabel(earliestComparison)}
        </p>
        <div className="flex items-center gap-4">
          <GrowthIndicator value={scenarioGrowth} label="Scenario" />
          <GrowthIndicator value={dialogueGrowth} label="Dialogue" />
        </div>
      </div>
    </div>
  );
};
