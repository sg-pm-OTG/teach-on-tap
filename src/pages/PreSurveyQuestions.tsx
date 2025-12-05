import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PreSurveyProgress } from "@/components/pre-survey/PreSurveyProgress";
import { ScaleQuestion } from "@/components/pre-survey/ScaleQuestion";
import { usePreSurvey } from "@/hooks/usePreSurvey";
import { preSurveyCategories, getTotalQuestions } from "@/data/preSurveyQuestions";

const PreSurveyQuestions = () => {
  const navigate = useNavigate();
  const { setResponse, getResponse, submitSurvey, isSubmitting } = usePreSurvey();
  const [currentCategoryIndex, setCategoryIndex] = useState(0);
  const [currentQuestionIndex, setQuestionIndex] = useState(0);

  const currentCategory = preSurveyCategories[currentCategoryIndex];
  const currentQuestion = currentCategory?.questions[currentQuestionIndex];
  const totalQuestions = getTotalQuestions();

  const currentQuestionNumber = useMemo(() => {
    let count = 0;
    for (let i = 0; i < currentCategoryIndex; i++) {
      count += preSurveyCategories[i].questions.length;
    }
    return count + currentQuestionIndex + 1;
  }, [currentCategoryIndex, currentQuestionIndex]);

  const currentValue = currentQuestion
    ? getResponse(currentQuestion.categoryCode, currentQuestion.questionIndex)
    : undefined;

  const handleValueChange = (value: number) => {
    if (currentQuestion) {
      setResponse(currentQuestion.categoryCode, currentQuestion.questionIndex, value);
    }
  };

  const canGoNext = currentValue !== undefined;
  const isLastQuestion =
    currentCategoryIndex === preSurveyCategories.length - 1 &&
    currentQuestionIndex === currentCategory.questions.length - 1;

  const handleNext = async () => {
    if (isLastQuestion) {
      const success = await submitSurvey();
      if (success) {
        navigate("/pre-survey/results");
      }
    } else if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex < preSurveyCategories.length - 1) {
      setCategoryIndex(currentCategoryIndex + 1);
      setQuestionIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setQuestionIndex(currentQuestionIndex - 1);
    } else if (currentCategoryIndex > 0) {
      const prevCategory = preSurveyCategories[currentCategoryIndex - 1];
      setCategoryIndex(currentCategoryIndex - 1);
      setQuestionIndex(prevCategory.questions.length - 1);
    }
  };

  const isFirstQuestion = currentCategoryIndex === 0 && currentQuestionIndex === 0;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="pt-10 pb-4 px-6 border-b border-border">
        <PreSurveyProgress
          currentQuestion={currentQuestionNumber}
          totalQuestions={totalQuestions}
          currentSection={`Section ${currentCategory.section}: ${currentCategory.sectionName}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <span className="text-xs text-primary font-medium uppercase tracking-wide">
              {currentCategory.name}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Question {currentQuestionIndex + 1} of {currentCategory.questions.length}
            </p>
          </div>

          {currentQuestion && (
            <ScaleQuestion
              questionText={currentQuestion.text}
              scaleType={currentQuestion.scaleType}
              scaleLabels={currentQuestion.scaleLabels}
              value={currentValue}
              onChange={handleValueChange}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canGoNext || isSubmitting}
            className="flex-1 gradient-accent text-primary-foreground"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : isLastQuestion ? (
              "Submit"
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreSurveyQuestions;
