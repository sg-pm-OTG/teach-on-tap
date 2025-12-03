import { cn } from "@/lib/utils";

interface ScoreChipProps {
  label: string;
  score: number;
  maxScore?: number;
}

const getScoreColor = (score: number) => {
  switch (score) {
    case 3:
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case 2:
      return "bg-amber-100 text-amber-700 border-amber-200";
    case 1:
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const getScoreLabel = (score: number) => {
  switch (score) {
    case 3:
      return "Visible";
    case 2:
      return "Developing";
    case 1:
      return "Weak";
    default:
      return "Not Evident";
  }
};

export const ScoreChip = ({ label, score, maxScore = 3 }: ScoreChipProps) => {
  return (
    <div className="flex-shrink-0 bg-card rounded-xl p-3 border border-border min-w-[140px]">
      <p className="text-xs text-muted-foreground mb-1 truncate">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-foreground">{score}/{maxScore}</span>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full border font-medium",
          getScoreColor(score)
        )}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
};
