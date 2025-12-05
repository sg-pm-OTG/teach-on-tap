import { PreSurveyResult } from "@/types/preSurvey";
import { cn } from "@/lib/utils";

interface ResultsComparisonChartProps {
  result: PreSurveyResult;
}

export const ResultsComparisonChart = ({ result }: ResultsComparisonChartProps) => {
  const userPercentage = (result.userScore / result.maxScore) * 100;
  const nationalPercentage = (result.nationalAverage / result.maxScore) * 100;
  const isAboveAverage = result.userScore >= result.nationalAverage;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground">You</span>
          <span className="font-medium text-foreground">
            {result.userScore.toFixed(1)}/{result.maxScore}
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isAboveAverage ? "bg-success" : "bg-warning"
            )}
            style={{ width: `${userPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">National Average</span>
          <span className="font-medium text-muted-foreground">
            {result.nationalAverage.toFixed(1)}/{result.maxScore}
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary/50 rounded-full transition-all duration-500"
            style={{ width: `${nationalPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
