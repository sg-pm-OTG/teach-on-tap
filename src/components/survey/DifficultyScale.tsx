import { cn } from "@/lib/utils";

interface DifficultyScaleProps {
  title: string;
  options: readonly string[];
  selected?: string;
  onChange: (value: string) => void;
}

export const DifficultyScale = ({
  title,
  options,
  selected,
  onChange,
}: DifficultyScaleProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              "p-4 rounded-lg border-2 transition-all text-sm font-medium min-h-[60px]",
              "hover:scale-105 active:scale-95",
              selected === option
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-foreground hover:border-primary/50"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{index + 1}</span>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
