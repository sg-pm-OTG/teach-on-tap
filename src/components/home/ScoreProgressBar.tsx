import { cn } from "@/lib/utils";

interface ScoreProgressBarProps {
  label: string;
  score: number;
  maxScore?: number;
  className?: string;
}

export const ScoreProgressBar = ({
  label,
  score,
  maxScore = 4,
  className,
}: ScoreProgressBarProps) => {
  const percentage = (score / maxScore) * 100;

  const getColor = () => {
    if (score >= 3) return "bg-success";
    if (score >= 2) return "bg-amber-500";
    return "bg-destructive";
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground truncate pr-2">{label}</span>
        <span className="text-foreground font-medium">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
