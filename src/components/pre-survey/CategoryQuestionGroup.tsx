import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PreSurveyQuestion } from "@/types/preSurvey";

interface CategoryQuestionGroupProps {
  categoryName: string;
  questions: PreSurveyQuestion[];
  responses: Map<number, number>;
  onResponse: (questionIndex: number, value: number) => void;
  section?: string;
  sectionName?: string;
  questionOffset?: number;
}

const getSectionInstruction = (section: string): string => {
  switch (section) {
    case "A":
      return "Reflecting on how you approach learning design and facilitation, to what extent do you agree with the following statements?";
    case "B":
      return "Thinking about your personal approach to learning, to what extent do the following statements apply to you?";
    case "C":
      return "Considering your current work environment and professional context, please rate the following aspects.";
    default:
      return "Please rate the following statements.";
  }
};

export const CategoryQuestionGroup = ({
  categoryName,
  questions,
  responses,
  onResponse,
  section,
  sectionName,
  questionOffset = 0,
}: CategoryQuestionGroupProps) => {
  return (
    <div className="space-y-6">
      {/* Section Instruction */}
      {section && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getSectionInstruction(section)}
          </p>
        </div>
      )}

      {/* Questions */}
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
                    <span className="text-xs">{questionOffset + idx + 1}</span>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  {question.text}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-center gap-1.5">
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
                
                <div className="flex justify-between px-1">
                  <span className="text-[10px] text-muted-foreground">
                    {question.scaleLabels.low}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {question.scaleLabels.high}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
