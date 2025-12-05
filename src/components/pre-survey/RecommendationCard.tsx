import { Lightbulb } from "lucide-react";
import { PreSurveyResult } from "@/types/preSurvey";
import { ResultsComparisonChart } from "./ResultsComparisonChart";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  result: PreSurveyResult;
}

export const RecommendationCard = ({ result }: RecommendationCardProps) => {
  const isAboveAverage = result.userScore >= result.nationalAverage;

  return (
    <div className="bg-card rounded-xl p-4 border border-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">{result.categoryName}</h3>
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-full",
            isAboveAverage
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          )}
        >
          {isAboveAverage ? "Above Average" : "Below Average"}
        </span>
      </div>

      <ResultsComparisonChart result={result} />

      {!isAboveAverage && result.recommendation && (
        <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
          <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {result.recommendation}
          </p>
        </div>
      )}
    </div>
  );
};
