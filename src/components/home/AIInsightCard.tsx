import { Lightbulb } from "lucide-react";

interface AIInsightCardProps {
  strengths: { label: string; score: number }[];
  focusAreas: { label: string; score: number }[];
}

export const AIInsightCard = ({ strengths, focusAreas }: AIInsightCardProps) => {
  const topStrength = strengths[0]?.label || "Active engagement";
  const topFocus = focusAreas[0]?.label || "Open-ended questions";

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-5 border-2 border-border animate-slide-in-up">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
          <Lightbulb className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">AI Insight</h3>
          <p className="text-xs text-muted-foreground">Based on your latest session</p>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">
        Great work on <span className="text-success font-medium">{topStrength.toLowerCase()}</span>! 
        To improve further, focus on{" "}
        <span className="text-amber-500 font-medium">{topFocus.toLowerCase()}</span> in your next session.
      </p>
    </div>
  );
};
