import { cn } from "@/lib/utils";

interface ScaleQuestionProps {
  questionText: string;
  scaleType: 4 | 5 | 6 | 7;
  scaleLabels: { low: string; high: string };
  value?: number;
  onChange: (value: number) => void;
}

export const ScaleQuestion = ({
  questionText,
  scaleType,
  scaleLabels,
  value,
  onChange,
}: ScaleQuestionProps) => {
  const scaleOptions = Array.from({ length: scaleType }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground leading-relaxed">{questionText}</p>
      
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs text-muted-foreground w-16 text-left">
          {scaleLabels.low}
        </span>
        
        <div className="flex gap-2 flex-1 justify-center">
          {scaleOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                value === option
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {option}
            </button>
          ))}
        </div>
        
        <span className="text-xs text-muted-foreground w-16 text-right">
          {scaleLabels.high}
        </span>
      </div>
    </div>
  );
};
