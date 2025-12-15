import { Progress } from "@/components/ui/progress";

interface PreSurveyProgressProps {
  currentCategory: number;
  totalCategories: number;
  currentSection: string;
  questionsAnswered: number;
  questionsInCategory: number;
}

export const PreSurveyProgress = ({
  currentCategory,
  totalCategories,
  currentSection,
  questionsAnswered,
  questionsInCategory,
}: PreSurveyProgressProps) => {
  const progressPercent = ((currentCategory - 1) / totalCategories) * 100 + 
    (questionsAnswered / questionsInCategory / totalCategories) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-muted-foreground">
          Step {currentCategory} of {totalCategories}
        </span>
        <span className="text-xs text-muted-foreground">
          {questionsAnswered}/{questionsInCategory} answered
        </span>
      </div>
      
      <Progress value={progressPercent} className="h-2" />
      
      <p className="text-xs text-primary font-medium">
        {currentSection}
      </p>
    </div>
  );
};
