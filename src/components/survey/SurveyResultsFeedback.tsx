import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { SurveyData } from "@/types/survey";

interface SurveyResultsFeedbackProps {
  surveyData: SurveyData;
  onContinue: () => void;
}

export const SurveyResultsFeedback = ({ surveyData, onContinue }: SurveyResultsFeedbackProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-primary-foreground" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-foreground text-center mb-2">
        Thank You!
      </h2>
      <p className="text-muted-foreground text-center mb-6">
        Your feedback has been recorded.
      </p>

      {surveyData.practiceDifficulty && (
        <div className="text-center mb-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            You rated practicing FOP as: <span className="font-semibold text-foreground">{surveyData.practiceDifficulty}</span>
          </p>
        </div>
      )}

      <Button onClick={onContinue} className="w-full" size="lg">
        View My Report
      </Button>
    </div>
  );
};
