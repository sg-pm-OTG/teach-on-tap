import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SingleSelectQuestionProps {
  title: string;
  options: readonly string[];
  selected?: string;
  onChange: (value: string) => void;
}

export const SingleSelectQuestion = ({
  title,
  options,
  selected,
  onChange,
}: SingleSelectQuestionProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <RadioGroup value={selected} onValueChange={onChange}>
        <div className="space-y-3">
          {options.map((option) => (
            <div
              key={option}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <RadioGroupItem value={option} id={option} className="mt-1" />
              <Label
                htmlFor={option}
                className="flex-1 text-sm leading-relaxed cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};
