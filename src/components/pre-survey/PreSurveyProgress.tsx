import { Progress } from "@/components/ui/progress";

interface PreSurveyProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  currentSection: string;
}

export const PreSurveyProgress = ({
  currentQuestion,
  totalQuestions,
  currentSection,
}: PreSurveyProgressProps) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{currentSection}</span>
        <span className="text-muted-foreground">
          {currentQuestion} / {totalQuestions}
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};
