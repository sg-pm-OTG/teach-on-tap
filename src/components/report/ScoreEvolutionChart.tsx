import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Flag, TrendingUp, GitCompare } from "lucide-react";
import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScoreItem {
  label: string;
  score: number;
}

export interface SessionDataPoint {
  id: string;
  date: string;
  scenarioScores: ScoreItem[];
  dialogueScores: ScoreItem[];
  isBaseline?: boolean;
  label: string;
}

interface ScoreEvolutionChartProps {
  sessions: SessionDataPoint[];
  selectedSessionId: string;
  comparisonIds: string[];
  onSelectSession?: (id: string) => void;
}

// Distinct colors for each marker line
const SCENARIO_COLORS = [
  "#F97316", // orange-500
  "#EF4444", // red-500
  "#F59E0B", // amber-500
  "#84CC16", // lime-500
  "#22C55E", // green-500
  "#06B6D4", // cyan-500
];

const DIALOGUE_COLORS = [
  "#0D9488", // teal-600
  "#0EA5E9", // sky-500
  "#6366F1", // indigo-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#14B8A6", // teal-500
  "#3B82F6", // blue-500
];

export const ScoreEvolutionChart = ({
  sessions,
  selectedSessionId,
  comparisonIds,
  onSelectSession,
}: ScoreEvolutionChartProps) => {
  const [activeTab, setActiveTab] = useState<"scenario" | "dialogue">("scenario");

  // Sort sessions chronologically
  const sortedSessions = useMemo(() => 
    [...sessions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ), [sessions]
  );

  // Filter to only show selected sessions when comparisons are active
  const displayedSessions = useMemo(() => {
    if (comparisonIds.length === 0) {
      return sortedSessions;
    }
    return sortedSessions.filter(
      s => s.id === selectedSessionId || comparisonIds.includes(s.id)
    );
  }, [sortedSessions, selectedSessionId, comparisonIds]);

  // Get marker labels from first session
  const markerLabels = useMemo(() => {
    if (!displayedSessions.length) return { scenario: [], dialogue: [] };
    const firstSession = displayedSessions[0];
    return {
      scenario: firstSession.scenarioScores.map(s => s.label),
      dialogue: firstSession.dialogueScores.map(s => s.label),
    };
  }, [displayedSessions]);

  // Transform data for chart - create data points with individual marker scores
  const chartData = useMemo(() => {
    return displayedSessions.map((session, index) => {
      const dataPoint: any = {
        id: session.id,
        date: session.date,
        dateLabel: session.isBaseline ? "Baseline" : format(parseISO(session.date), "MMM d"),
        isSelected: session.id === selectedSessionId,
        isComparison: comparisonIds.includes(session.id),
        isBaseline: session.isBaseline,
        displayIndex: index + 1,
        label: session.label,
      };

      // Add individual scenario scores
      session.scenarioScores.forEach((score, i) => {
        dataPoint[`scenario_${i}`] = score.score;
      });

      // Add individual dialogue scores
      session.dialogueScores.forEach((score, i) => {
        dataPoint[`dialogue_${i}`] = score.score;
      });

      return dataPoint;
    });
  }, [displayedSessions, selectedSessionId, comparisonIds]);

  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (!cx || !cy) return null;

    const isSelected = payload.id === selectedSessionId;
    const isComparison = comparisonIds.includes(payload.id);
    const isBaseline = payload.isBaseline;
    
    const radius = isSelected ? 6 : isComparison ? 5 : 3;
    
    // Get color from dataKey
    const markerIndex = parseInt(dataKey.split('_')[1]);
    const colors = activeTab === "scenario" ? SCENARIO_COLORS : DIALOGUE_COLORS;
    const baseColor = colors[markerIndex % colors.length];
    
    return (
      <g>
        {isSelected && (
          <circle
            cx={cx}
            cy={cy}
            r={radius + 3}
            fill={baseColor}
            fillOpacity={0.2}
          />
        )}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={isBaseline ? "hsl(var(--primary))" : baseColor}
          stroke={isSelected ? "white" : "none"}
          strokeWidth={isSelected ? 2 : 0}
          style={{ cursor: onSelectSession ? "pointer" : "default" }}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const session = payload[0]?.payload;
    if (!session) return null;

    const labels = activeTab === "scenario" ? markerLabels.scenario : markerLabels.dialogue;

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-w-[200px]">
        <p className="text-xs font-medium text-foreground mb-1">
          {session.isBaseline ? "Baseline" : session.label}
        </p>
        <p className="text-[10px] text-muted-foreground mb-2">
          {format(parseISO(session.date), "MMM d, yyyy")}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => {
            const markerIndex = parseInt(entry.dataKey.split('_')[1]);
            const markerLabel = labels[markerIndex];
            return (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[10px] text-muted-foreground truncate flex-1">
                  {markerLabel}:
                </span>
                <span className="text-[10px] font-medium">{Math.round(entry.value)}/4</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleChartClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload && onSelectSession) {
      onSelectSession(data.activePayload[0].payload.id);
    }
  };

  const hasActiveComparison = comparisonIds.length > 0;
  const currentLabels = activeTab === "scenario" ? markerLabels.scenario : markerLabels.dialogue;
  const currentColors = activeTab === "scenario" ? SCENARIO_COLORS : DIALOGUE_COLORS;

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {hasActiveComparison ? (
            <GitCompare className="h-4 w-4 text-primary" />
          ) : (
            <TrendingUp className="h-4 w-4 text-primary" />
          )}
          <h4 className="font-medium text-sm text-foreground">
            {hasActiveComparison ? "Comparison View" : "Marker Evolution"}
          </h4>
        </div>
      </div>

      {/* Tab switcher */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "scenario" | "dialogue")} className="mb-3">
        <TabsList className="grid w-full grid-cols-2 h-8">
          <TabsTrigger value="scenario" className="text-xs">Scenario</TabsTrigger>
          <TabsTrigger value="dialogue" className="text-xs">Dialogue</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Comparison status indicator */}
      {hasActiveComparison && (
        <div className="mb-3 text-[10px] text-muted-foreground bg-primary/5 rounded-lg px-3 py-2">
          <span className="font-medium text-foreground">Comparing {comparisonIds.length} session{comparisonIds.length > 1 ? 's' : ''}</span>
          {" · "}Chart filtered to show selected sessions only
        </div>
      )}

      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            onClick={handleChartClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={2.5} stroke="hsl(var(--muted))" strokeDasharray="5 5" />
            
            {/* Render individual marker lines based on active tab */}
            {currentLabels.map((_, index) => (
              <Line
                key={`${activeTab}_${index}`}
                type="monotone"
                dataKey={`${activeTab}_${index}`}
                stroke={currentColors[index % currentColors.length]}
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 5, strokeWidth: 2, fill: "white" }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend - show marker names with colors */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 pt-3 border-t border-border">
        {currentLabels.map((label, index) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-3 h-0.5 rounded-full" 
              style={{ backgroundColor: currentColors[index % currentColors.length] }}
            />
            <span className="text-[9px] text-muted-foreground">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 ml-auto">
          <Flag className="h-3 w-3 text-primary" />
          <span className="text-[9px] text-muted-foreground">Baseline</span>
        </div>
      </div>
    </div>
  );
};
