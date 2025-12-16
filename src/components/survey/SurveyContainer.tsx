import { Button } from "@/components/ui/button";
import { DifficultyScale } from "./DifficultyScale";
import { useSurvey } from "@/hooks/useSurvey";
import { DIFFICULTY_SCALE } from "@/types/survey";
import type { SurveyData } from "@/types/survey";

interface SurveyContainerProps {
  onComplete: (surveyData: SurveyData) => void;
  sessionId?: string;
}

export const SurveyContainer = ({ onComplete, sessionId }: SurveyContainerProps) => {
  const {
    surveyData,
    updateSurveyData,
    canProceed,
    submitSurvey,
  } = useSurvey(sessionId);

  const handleSubmit = async () => {
    const success = await submitSurvey();
    if (success) {
      onComplete(surveyData);
    }
  };

  return (
    <div className="w-full space-y-6 pb-6">
      <DifficultyScale
        title="How difficult was it to practice FOP?"
        options={DIFFICULTY_SCALE}
        selected={surveyData.practiceDifficulty}
        onChange={(value) => updateSurveyData({ practiceDifficulty: value })}
      />

      <Button
        onClick={handleSubmit}
        disabled={!canProceed()}
        className="w-full"
        size="lg"
      >
        Submit
      </Button>
    </div>
  );
};
