import { Button } from "@/components/ui/button";
import { MultiSelectQuestion } from "./MultiSelectQuestion";
import { SingleSelectQuestion } from "./SingleSelectQuestion";
import { DifficultyScale } from "./DifficultyScale";
import { useSurvey } from "@/hooks/useSurvey";
import {
  ENGAGEMENT_OPTIONS,
  ACTIVITY_INVOLVEMENT_OPTIONS,
  NON_ENGAGEMENT_REASONS,
  TIME_SPENT_OPTIONS,
  DIFFICULTY_SCALE,
  CONFIDENCE_SCALE,
} from "@/types/survey";

interface SurveyContainerProps {
  onComplete: () => void;
  sessionId?: string;
}

export const SurveyContainer = ({ onComplete, sessionId }: SurveyContainerProps) => {
  const {
    surveyData,
    currentStep,
    setCurrentStep,
    updateSurveyData,
    getNextStep,
    getTotalSteps,
    canProceed,
    submitSurvey,
  } = useSurvey(sessionId);

  const handleNext = async () => {
    const nextStep = getNextStep();
    
    if (nextStep === null) {
      // Submit survey
      const success = await submitSurvey();
      if (success) {
        onComplete();
      }
    } else {
      setCurrentStep(nextStep);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MultiSelectQuestion
            title="In the past week, how did you engage with FOP?"
            options={ENGAGEMENT_OPTIONS}
            selected={surveyData.engagementTypes}
            onChange={(values) => updateSurveyData({ engagementTypes: values })}
            showOther
            otherValue={surveyData.engagementOther}
            onOtherChange={(value) => updateSurveyData({ engagementOther: value })}
            mutuallyExclusiveOption="I did not engage with FOP"
          />
        );

      case 2:
        return (
          <div className="space-y-6">
            <MultiSelectQuestion
              title="Which of these activities were you involved in?"
              options={ACTIVITY_INVOLVEMENT_OPTIONS}
              selected={surveyData.activityInvolvement || []}
              onChange={(values) => updateSurveyData({ activityInvolvement: values })}
            />
            <DifficultyScale
              title="How difficult was it to practice FOP?"
              options={DIFFICULTY_SCALE}
              selected={surveyData.practiceDifficulty}
              onChange={(value) => updateSurveyData({ practiceDifficulty: value })}
            />
          </div>
        );

      case 3:
        return (
          <DifficultyScale
            title="How difficult was it to design a learning activity using FOP?"
            options={DIFFICULTY_SCALE}
            selected={surveyData.designDifficulty}
            onChange={(value) => updateSurveyData({ designDifficulty: value })}
          />
        );

      case 7:
        return (
          <MultiSelectQuestion
            title="Why did you not engage with FOP?"
            options={NON_ENGAGEMENT_REASONS}
            selected={surveyData.nonEngagementReasons || []}
            onChange={(values) => updateSurveyData({ nonEngagementReasons: values })}
            showOther
            otherValue={surveyData.nonEngagementOther}
            onOtherChange={(value) => updateSurveyData({ nonEngagementOther: value })}
          />
        );

      case 8:
        return (
          <div className="space-y-6">
            <SingleSelectQuestion
              title="How much time did you spend engaging with FOP in the past week?"
              options={TIME_SPENT_OPTIONS}
              selected={surveyData.timeSpent}
              onChange={(value) => updateSurveyData({ timeSpent: value })}
            />
            <DifficultyScale
              title="How has your confidence in using FOP changed?"
              options={CONFIDENCE_SCALE}
              selected={surveyData.confidenceChange}
              onChange={(value) => updateSurveyData({ confidenceChange: value })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const totalSteps = getTotalSteps();
  const isLastStep = getNextStep() === null;

  return (
    <div className="w-full space-y-6 pb-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Survey Progress
        </span>
        <span className="font-semibold text-foreground">
          Step {currentStep === 7 ? 2 : Math.min(currentStep, totalSteps)} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full gradient-secondary transition-all duration-300 ease-out"
          style={{
            width: `${((currentStep === 7 ? 2 : Math.min(currentStep, totalSteps)) / totalSteps) * 100}%`,
          }}
        />
      </div>

      {/* Question Content */}
      {renderStep()}

      {/* Action Button */}
      <Button
        onClick={handleNext}
        disabled={!canProceed()}
        className="w-full"
        size="lg"
      >
        {isLastStep ? "Submit Survey" : "Continue"}
      </Button>
    </div>
  );
};
