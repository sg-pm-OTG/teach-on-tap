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
import { Flag, TrendingUp } from "lucide-react";

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
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedSessions.map((session) => ({
    ...session,
    dateLabel: session.isBaseline ? "Baseline" : format(parseISO(session.date), "MMM d"),
    isSelected: session.id === selectedSessionId,
    isComparison: comparisonIds.includes(session.id),
  }));

  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (!cx || !cy) return null;

    const isSelected = payload.id === selectedSessionId;
    const isComparison = comparisonIds.includes(payload.id);
    const isBaseline = payload.isBaseline;
    
    const baseColor = dataKey === "scenarioAvg" ? "#F97316" : "#0D9488";
    
    // Size based on selection state
    const radius = isSelected ? 8 : isComparison ? 6 : 4;
    
    return (
      <g>
        {/* Outer glow for selected */}
        {isSelected && (
          <circle
            cx={cx}
            cy={cy}
            r={radius + 4}
            fill={baseColor}
            fillOpacity={0.2}
          />
        )}
        {/* Main dot */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={isBaseline ? "hsl(var(--primary))" : baseColor}
          stroke={isSelected ? "white" : "none"}
          strokeWidth={isSelected ? 2 : 0}
          style={{ cursor: onSelectSession ? "pointer" : "default" }}
        />
        {/* Baseline flag indicator */}
        {isBaseline && dataKey === "scenarioAvg" && (
          <g transform={`translate(${cx - 6}, ${cy - 20})`}>
            <Flag className="h-3 w-3" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
          </g>
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

  // Calculate growth from first to last session
  const firstSession = chartData[0];
  const lastSession = chartData[chartData.length - 1];
  const scenarioGrowth = lastSession && firstSession 
    ? (lastSession.scenarioAvg - firstSession.scenarioAvg).toFixed(1)
    : "0";
  const dialogueGrowth = lastSession && firstSession 
    ? (lastSession.dialogueAvg - firstSession.dialogueAvg).toFixed(1)
    : "0";

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h4 className="font-medium text-sm text-foreground">Score Evolution</h4>
        </div>
        {chartData.length > 1 && (
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-muted-foreground">
              Growth: 
              <span className={`ml-1 font-medium ${Number(scenarioGrowth) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {Number(scenarioGrowth) >= 0 ? "+" : ""}{scenarioGrowth}
              </span>
              <span className="text-orange-500 mx-1">S</span>
              <span className={`font-medium ${Number(dialogueGrowth) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {Number(dialogueGrowth) >= 0 ? "+" : ""}{dialogueGrowth}
              </span>
              <span className="text-teal-500 ml-1">D</span>
            </span>
          </div>
        )}
      </div>

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
