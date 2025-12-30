import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { PreSurveyProgress } from "@/components/pre-survey/PreSurveyProgress";
import { CategoryQuestionGroup } from "@/components/pre-survey/CategoryQuestionGroup";
import { usePostSurvey } from "@/hooks/usePostSurvey";
import { postSurveyCategories, getTotalQuestions } from "@/data/postSurveyQuestions";
import { cn } from "@/lib/utils";

const PostSurveyQuestions = () => {
  const navigate = useNavigate();
  const { setResponse, getResponse, submitSurvey, submitDemoSurvey, isSubmitting, getCompletedCount } = usePostSurvey();
  const [currentCategoryIndex, setCategoryIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentCategory = postSurveyCategories[currentCategoryIndex];
  const totalCategories = postSurveyCategories.length;
  const isLastCategory = currentCategoryIndex === totalCategories - 1;
  const isFirstCategory = currentCategoryIndex === 0;

  // Build responses map for current category
  const categoryResponses = new Map<number, number>();
  currentCategory.questions.forEach((q) => {
    const value = getResponse(q.categoryCode, q.questionIndex);
    if (value !== undefined) {
      categoryResponses.set(q.questionIndex, value);
    }
  });

  const questionsAnswered = categoryResponses.size;
  const allQuestionsAnswered = questionsAnswered === currentCategory.questions.length;

  // Scroll to top when category changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentCategoryIndex]);

  // Auto-advance when all questions in category are answered
  useEffect(() => {
    if (allQuestionsAnswered && !isLastCategory && !isTransitioning) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        goToNextCategory();
      }, 600);
    }

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [allQuestionsAnswered, isLastCategory, isTransitioning, currentCategoryIndex]);

  const handleResponse = (questionIndex: number, value: number) => {
    const question = currentCategory.questions.find(q => q.questionIndex === questionIndex);
    if (question) {
      setResponse(question.categoryCode, questionIndex, value);
    }
  };

  const goToNextCategory = () => {
    if (isTransitioning) return;
    setSlideDirection("left");
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCategoryIndex(currentCategoryIndex + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevious = () => {
    if (isFirstCategory || isTransitioning) return;
    
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    
    setSlideDirection("right");
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCategoryIndex(currentCategoryIndex - 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleSubmit = async () => {
    const success = await submitSurvey();
    if (success) {
      navigate("/post-survey/results");
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background pt-[max(env(safe-area-inset-top),24px)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-10 pb-4 px-6 border-b border-border">
        <PreSurveyProgress
          totalQuestionsAnswered={getCompletedCount()}
          totalQuestions={getTotalQuestions()}
        />
      </div>

      {/* Content with slide animation */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={contentRef}
          className={cn(
            "absolute inset-0 px-6 py-6 overflow-y-auto transition-all duration-300 ease-out",
            isTransitioning && slideDirection === "left" && "translate-x-[-100%] opacity-0",
            isTransitioning && slideDirection === "right" && "translate-x-[100%] opacity-0",
            !isTransitioning && "translate-x-0 opacity-100"
          )}
        >
          <CategoryQuestionGroup
            categoryName={currentCategory.name}
            questions={currentCategory.questions}
            responses={categoryResponses}
            onResponse={handleResponse}
            section="A"
            sectionName="Learning Beliefs"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstCategory || isTransitioning}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          {isLastCategory && (
            <Button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || isSubmitting}
              className="flex-1 gradient-primary text-primary-foreground"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
        
        {!isLastCategory && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Answer all questions to continue automatically
          </p>
        )}
        
        {/* Demo skip button */}
        <Button
          variant="ghost"
          onClick={async () => {
            const success = await submitDemoSurvey();
            if (success) {
              navigate("/post-survey/results");
            }
          }}
          disabled={isSubmitting}
          className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground"
        >
          {isSubmitting ? "Generating demo data..." : "Skip for Demo →"}
        </Button>
      </div>
    </div>
  );
};

export default PostSurveyQuestions;
