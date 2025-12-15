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
import { useMemo } from "react";

export interface SessionDataPoint {
  id: string;
  date: string;
  scenarioAvg: number;
  dialogueAvg: number;
  isBaseline?: boolean;
  label: string;
}

interface ScoreEvolutionChartProps {
  sessions: SessionDataPoint[];
  selectedSessionId: string;
  comparisonIds: string[];
  onSelectSession?: (id: string) => void;
}

export const ScoreEvolutionChart = ({
  sessions,
  selectedSessionId,
  comparisonIds,
  onSelectSession,
}: ScoreEvolutionChartProps) => {
  // Sort sessions chronologically
  const sortedSessions = useMemo(() => 
    [...sessions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ), [sessions]
  );

  // Filter to only show selected sessions when comparisons are active
  const displayedSessions = useMemo(() => {
    if (comparisonIds.length === 0) {
      return sortedSessions; // Show all when no comparisons selected
    }
    // Show only current session + selected comparison sessions
    return sortedSessions.filter(
      s => s.id === selectedSessionId || comparisonIds.includes(s.id)
    );
  }, [sortedSessions, selectedSessionId, comparisonIds]);

  const chartData = displayedSessions.map((session, index) => ({
    ...session,
    dateLabel: session.isBaseline ? "Baseline" : format(parseISO(session.date), "MMM d"),
    isSelected: session.id === selectedSessionId,
    isComparison: comparisonIds.includes(session.id),
    displayIndex: index + 1, // For numbering the comparison sessions
  }));

  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (!cx || !cy) return null;

    const isSelected = payload.id === selectedSessionId;
    const isComparison = comparisonIds.includes(payload.id);
    const isBaseline = payload.isBaseline;
    
    const baseColor = dataKey === "scenarioAvg" ? "#F97316" : "#0D9488";
    
    // Size based on selection state - much more distinct now
    const radius = isSelected ? 10 : isComparison ? 7 : 4;
    
    return (
      <g>
        {/* Pulsing glow animation for current session */}
        {isSelected && (
          <>
            <circle
              cx={cx}
              cy={cy}
              r={radius + 6}
              fill={baseColor}
              fillOpacity={0.15}
              className="animate-pulse"
            />
            <circle
              cx={cx}
              cy={cy}
              r={radius + 3}
              fill={baseColor}
              fillOpacity={0.25}
            />
          </>
        )}
        {/* Ring outline for comparison sessions */}
        {isComparison && !isSelected && (
          <circle
            cx={cx}
            cy={cy}
            r={radius + 3}
            fill="none"
            stroke={baseColor}
            strokeWidth={2}
            strokeDasharray="3 2"
            opacity={0.6}
          />
        )}
        {/* Main dot */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={isBaseline ? "hsl(var(--primary))" : baseColor}
          stroke={isSelected ? "white" : isComparison ? baseColor : "none"}
          strokeWidth={isSelected ? 3 : isComparison ? 2 : 0}
          style={{ cursor: onSelectSession ? "pointer" : "default" }}
        />
        {/* Baseline flag indicator */}
        {isBaseline && dataKey === "scenarioAvg" && (
          <g transform={`translate(${cx - 6}, ${cy - 24})`}>
            <Flag className="h-3 w-3" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
          </g>
        )}
        {/* Session number label for comparison sessions */}
        {isComparison && !isSelected && dataKey === "scenarioAvg" && (
          <text
            x={cx}
            y={cy - radius - 8}
            textAnchor="middle"
            fontSize={9}
            fontWeight={600}
            fill="hsl(var(--foreground))"
          >
            {payload.displayIndex}
          </text>
        )}
        {/* "Current" label for selected session */}
        {isSelected && dataKey === "scenarioAvg" && (
          <text
            x={cx}
            y={cy - radius - 10}
            textAnchor="middle"
            fontSize={8}
            fontWeight={600}
            fill="hsl(var(--primary))"
          >
            Current
          </text>
        )}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const session = payload[0]?.payload;
    if (!session) return null;

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-xs font-medium text-foreground mb-1">
          {session.isBaseline ? "Baseline" : session.label}
        </p>
        <p className="text-[10px] text-muted-foreground mb-2">
          {format(parseISO(session.date), "MMM d, yyyy")}
        </p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-xs text-muted-foreground">Scenario:</span>
            <span className="text-xs font-medium">{session.scenarioAvg}/4</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-xs text-muted-foreground">Dialogue:</span>
            <span className="text-xs font-medium">{session.dialogueAvg}/4</span>
          </div>
        </div>
      </div>
    );
  };

  const handleChartClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload && onSelectSession) {
      onSelectSession(data.activePayload[0].payload.id);
    }
  };

  // Calculate growth dynamically based on what's displayed
  const growthStats = useMemo(() => {
    if (chartData.length < 2) return null;
    
    // Find the earliest session in the display (comparison starting point)
    const earliestSession = chartData[0];
    // Current session is the selected one
    const currentSession = chartData.find(s => s.id === selectedSessionId) || chartData[chartData.length - 1];
    
    const scenarioGrowth = (currentSession.scenarioAvg - earliestSession.scenarioAvg).toFixed(1);
    const dialogueGrowth = (currentSession.dialogueAvg - earliestSession.dialogueAvg).toFixed(1);
    
    const fromLabel = earliestSession.isBaseline 
      ? "Baseline" 
      : format(parseISO(earliestSession.date), "MMM d");
    
    return {
      scenarioGrowth,
      dialogueGrowth,
      fromLabel,
    };
  }, [chartData, selectedSessionId]);

  const hasActiveComparison = comparisonIds.length > 0;

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {hasActiveComparison ? (
            <GitCompare className="h-4 w-4 text-primary" />
          ) : (
            <TrendingUp className="h-4 w-4 text-primary" />
          )}
          <h4 className="font-medium text-sm text-foreground">
            {hasActiveComparison ? "Comparison View" : "Score Evolution"}
          </h4>
        </div>
        {growthStats && (
          <div className="flex items-center gap-1 text-[10px] bg-muted/50 px-2 py-1 rounded-full">
            <span className="text-muted-foreground">From {growthStats.fromLabel}:</span>
            <span className={`font-semibold ${Number(growthStats.scenarioGrowth) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {Number(growthStats.scenarioGrowth) >= 0 ? "+" : ""}{growthStats.scenarioGrowth}
            </span>
            <span className="text-orange-500">S</span>
            <span className={`font-semibold ${Number(growthStats.dialogueGrowth) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {Number(growthStats.dialogueGrowth) >= 0 ? "+" : ""}{growthStats.dialogueGrowth}
            </span>
            <span className="text-teal-500">D</span>
          </div>
        )}
      </div>
      
      {/* Comparison status indicator */}
      {hasActiveComparison && (
        <div className="mb-3 text-[10px] text-muted-foreground bg-primary/5 rounded-lg px-3 py-2">
          <span className="font-medium text-foreground">Comparing {comparisonIds.length} session{comparisonIds.length > 1 ? 's' : ''}</span>
          {" · "}Chart filtered to show selected sessions only
        </div>
      )}

      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
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
            
            {/* Scenario line */}
            <Line
              type="monotone"
              dataKey="scenarioAvg"
              stroke="#F97316"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 6, stroke: "#F97316", strokeWidth: 2, fill: "white" }}
            />
            
            {/* Dialogue line */}
            <Line
              type="monotone"
              dataKey="dialogueAvg"
              stroke="#0D9488"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 6, stroke: "#0D9488", strokeWidth: 2, fill: "white" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-orange-500 rounded-full" />
          <span className="text-[10px] text-muted-foreground">Scenario</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-teal-500 rounded-full" />
          <span className="text-[10px] text-muted-foreground">Dialogue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flag className="h-3 w-3 text-primary" />
          <span className="text-[10px] text-muted-foreground">Baseline</span>
        </div>
      </div>
    </div>
  );
};
