import { CheckCircle2, Sparkles } from "lucide-react";

interface ConclusionCardProps {
  title: string;
  conclusions: string[];
  variant?: "default" | "summary";
}

export const ConclusionCard = ({ title, conclusions, variant = "default" }: ConclusionCardProps) => {
  if (variant === "summary") {
    return (
      <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 rounded-2xl p-5 border border-teal-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
            <Sparkles className="h-5 w-5 text-teal-600" />
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <div className="space-y-3">
          {conclusions.map((conclusion, index) => (
            <ul key={index} className="text-sm text-foreground leading-relaxed">
              {conclusion.split('\n').map((line, i) => (
                i === 0 
                ? <li key={i} className="mb-1 font-medium">
                  {line}
                </li>  
                : 
                <li key={i} className="mb-1 ml-4 list-disc">
                  {line}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        {title}
      </h3>
      <ul className="space-y-2">
        {conclusions.map((conclusion, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-foreground">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-medium">
              {index + 1}
            </span>
            <span className="leading-relaxed">{conclusion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
