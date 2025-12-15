import { Progress } from "@/components/ui/progress";

interface PreSurveyProgressProps {
  totalQuestionsAnswered: number;
  totalQuestions: number;
}

export const PreSurveyProgress = ({
  totalQuestionsAnswered,
  totalQuestions,
}: PreSurveyProgressProps) => {
  const progressPercent = (totalQuestionsAnswered / totalQuestions) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-muted-foreground">
          {totalQuestionsAnswered} of {totalQuestions} answered
        </span>
        <span className="text-xs text-muted-foreground">
          {Math.round(progressPercent)}%
        </span>
      </div>
      
      <Progress value={progressPercent} className="h-2" />
    </div>
  );
};
