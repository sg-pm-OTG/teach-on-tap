import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MultiSelectQuestionProps {
  title: string;
  options: readonly string[];
  selected: string[];
  onChange: (values: string[]) => void;
  showOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  mutuallyExclusiveOption?: string;
}

export const MultiSelectQuestion = ({
  title,
  options,
  selected,
  onChange,
  showOther = false,
  otherValue = "",
  onOtherChange,
  mutuallyExclusiveOption,
}: MultiSelectQuestionProps) => {
  const handleToggle = (option: string) => {
    let newSelected: string[];
    
    if (mutuallyExclusiveOption && option === mutuallyExclusiveOption) {
      // If clicking the mutually exclusive option, select only it
      newSelected = selected.includes(option) ? [] : [option];
    } else {
      // If clicking any other option, deselect the mutually exclusive one
      const filteredSelected = mutuallyExclusiveOption 
        ? selected.filter(s => s !== mutuallyExclusiveOption)
        : selected;
      
      newSelected = filteredSelected.includes(option)
        ? filteredSelected.filter(s => s !== option)
        : [...filteredSelected, option];
    }
    
    onChange(newSelected);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
            <Checkbox
              id={option}
              checked={selected.includes(option)}
              onCheckedChange={() => handleToggle(option)}
              className="mt-1"
            />
            <Label
              htmlFor={option}
              className="flex-1 text-sm leading-relaxed cursor-pointer"
            >
              {option}
            </Label>
          </div>
        ))}
        {showOther && (
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
            <Checkbox
              id="other-checkbox"
              checked={selected.includes("Others")}
              onCheckedChange={() => handleToggle("Others")}
              className="mt-1"
            />
            <div className="flex-1 space-y-2">
              <Label htmlFor="other-checkbox" className="text-sm cursor-pointer">
                Others
              </Label>
              {selected.includes("Others") && (
                <Input
                  value={otherValue}
                  onChange={(e) => onOtherChange?.(e.target.value)}
                  placeholder="Please specify..."
                  className="animate-scale-in"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
