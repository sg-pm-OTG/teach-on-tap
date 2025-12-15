import { ChevronRight, CheckCircle2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SessionSummaryCardProps {
  sessionTitle: string;
  sessionDate: string;
  scenarioScore: number;
  dialogueScore: number;
  strengths: { label: string; score: number }[];
  focusAreas: { label: string; score: number }[];
}

export const SessionSummaryCard = ({
  sessionTitle,
  sessionDate,
  strengths,
  focusAreas,
}: SessionSummaryCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 animate-slide-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{sessionTitle}</h3>
          <p className="text-xs text-muted-foreground">{sessionDate}</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Strengths */}
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-success mb-1">What went well</p>
            <div className="flex flex-wrap gap-1.5">
              {strengths.slice(0, 2).map((s, i) => (
                <span 
                  key={i} 
                  className="inline-block px-2 py-0.5 rounded-full bg-success/10 text-success text-xs"
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="flex items-start gap-2">
          <Target className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-amber-500 mb-1">Areas to grow</p>
            <div className="flex flex-wrap gap-1.5">
              {focusAreas.slice(0, 2).map((s, i) => (
                <span 
                  key={i} 
                  className="inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs"
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-4 text-primary hover:bg-primary/5"
        onClick={() => navigate("/reports")}
      >
        View Full Report
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
