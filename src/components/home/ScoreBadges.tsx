import { TrendingUp, Minus } from "lucide-react";

interface ScoreBadgesProps {
  scenarioScore: number | null;
  dialogueScore: number | null;
  hasData: boolean;
}

export const ScoreBadges = ({ scenarioScore, dialogueScore, hasData }: ScoreBadgesProps) => {
  if (!hasData) {
    return (
      <div className="flex gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm">
          <span>No sessions yet</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 animate-slide-in-up">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
        <span className="text-sm font-medium text-primary">Scenario</span>
        <span className="text-sm font-bold text-foreground">{scenarioScore?.toFixed(1)}</span>
        <TrendingUp className="h-3.5 w-3.5 text-success" />
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
        <span className="text-sm font-medium text-secondary">Dialogue</span>
        <span className="text-sm font-bold text-foreground">{dialogueScore?.toFixed(1)}</span>
        <TrendingUp className="h-3.5 w-3.5 text-success" />
      </div>
    </div>
  );
};
