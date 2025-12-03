import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

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
  scenarioScore,
  dialogueScore,
  strengths,
  focusAreas,
}: SessionSummaryCardProps) => {
  const navigate = useNavigate();

  const radarData = [
    { subject: "Scenario", value: scenarioScore, fullMark: 100 },
    { subject: "Dialogue", value: dialogueScore, fullMark: 100 },
  ];

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-5 animate-slide-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{sessionTitle}</h3>
          <p className="text-xs text-muted-foreground">{sessionDate}</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Mini Radar Chart */}
        <div className="w-28 h-28 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Strengths & Focus Areas */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs font-medium text-success mb-1">Strengths</p>
            <div className="space-y-1">
              {strengths.slice(0, 2).map((s, i) => (
                <p key={i} className="text-xs text-foreground truncate">
                  • {s.label}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-amber-500 mb-1">Focus Areas</p>
            <div className="space-y-1">
              {focusAreas.slice(0, 2).map((s, i) => (
                <p key={i} className="text-xs text-foreground truncate">
                  • {s.label}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-4 text-primary"
        onClick={() => navigate("/reports")}
      >
        View Full Report
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
