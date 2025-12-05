import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PreSurveyQuestion } from "@/types/preSurvey";

interface CategoryQuestionGroupProps {
  categoryName: string;
  questions: PreSurveyQuestion[];
  responses: Map<number, number>;
  onResponse: (questionIndex: number, value: number) => void;
}

export const CategoryQuestionGroup = ({
  categoryName,
  questions,
  responses,
  onResponse,
}: CategoryQuestionGroupProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
        {categoryName}
      </h2>
      
      <div className="space-y-8">
        {questions.map((question, idx) => {
          const currentValue = responses.get(question.questionIndex);
          const isAnswered = currentValue !== undefined;
          const scaleOptions = Array.from({ length: question.scaleType }, (_, i) => i + 1);
          
          return (
            <div 
              key={question.questionIndex}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300",
                isAnswered 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border bg-card"
              )}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                  isAnswered 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {isAnswered ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="text-xs">{idx + 1}</span>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  {question.text}
                </p>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground w-14 text-left">
                  {question.scaleLabels.low}
                </span>
                
                <div className="flex gap-1.5 flex-1 justify-center">
                  {scaleOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onResponse(question.questionIndex, option)}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                        currentValue === option
                          ? "bg-primary text-primary-foreground scale-110 shadow-md"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 active:scale-95"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                <span className="text-xs text-muted-foreground w-14 text-right">
                  {question.scaleLabels.high}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
