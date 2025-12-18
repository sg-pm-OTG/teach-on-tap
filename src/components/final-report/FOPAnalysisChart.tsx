import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ScoreDataPoint {
  session: number;
  sessionLabel: string;
  markers: { name: string; score: number }[];
}

interface FOPAnalysisChartProps {
  title: string;
  description: string;
  data: ScoreDataPoint[];
  type: "scenario" | "dialogue";
}

const COLORS = [
  "#F16A3C", // Orange
  "#320073", // Purple
  "#D73C96", // Pink
  "#0D9488", // Teal
  "#3B82F6", // Blue
];

export const FOPAnalysisChart = ({
  title,
  description,
  data,
  type,
}: FOPAnalysisChartProps) => {
  // Get all unique marker names
  const markerNames = data[0]?.markers.map((m) => m.name) || [];

  // Transform data for recharts - each marker becomes a line across sessions
  const chartData = markerNames.map((markerName) => {
    const dataPoint: any = { marker: markerName };
    data.forEach((session) => {
      const marker = session.markers.find((m) => m.name === markerName);
      dataPoint[session.sessionLabel] = marker?.score || 0;
    });
    return dataPoint;
  });

  // Alternative view: sessions on X-axis, markers as lines
  const sessionChartData = data.map((session) => {
    const point: any = { session: session.sessionLabel };
    session.markers.forEach((marker, idx) => {
      point[`marker${idx}`] = marker.score;
      point[`marker${idx}Name`] = marker.name;
    });
    return point;
  });

  // Calculate averages per session
  const averagesBySession = data.map((session) => ({
    session: session.sessionLabel,
    average:
      session.markers.reduce((sum, m) => sum + m.score, 0) / 
      (session.markers.length || 1),
  }));

  const firstAvg = averagesBySession[0]?.average || 0;
  const lastAvg = averagesBySession[averagesBySession.length - 1]?.average || 0;
  const avgChange = lastAvg - firstAvg;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 bg-muted/50 rounded-xl p-3">
        <div className="text-center">
          <p className="text-xl font-bold text-primary">{Math.round(firstAvg)}</p>
          <p className="text-xs text-muted-foreground">First</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div 
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              avgChange > 0 
                ? "bg-green-100 text-green-700" 
                : avgChange < 0 
                ? "bg-red-100 text-red-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {avgChange > 0 ? "+" : ""}{Math.round(avgChange)}
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-secondary">{Math.round(lastAvg)}</p>
          <p className="text-xs text-muted-foreground">Latest</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sessionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="session" 
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                domain={[0, 4]} 
                ticks={[0, 1, 2, 3, 4]}
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string, props: any) => {
                  const idx = parseInt(name.replace("marker", ""));
                  const markerName = props.payload[`marker${idx}Name`];
                  return [Math.round(value), markerName];
                }}
              />
              {markerNames.map((_, idx) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey={`marker${idx}`}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: COLORS[idx % COLORS.length] }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {markerNames.map((name, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground truncate max-w-24">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual marker scores for latest session */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Latest Session Breakdown</p>
        <div className="grid grid-cols-2 gap-2">
          {data[data.length - 1]?.markers.map((marker, idx) => (
            <div 
              key={idx}
              className="bg-muted/30 rounded-lg p-2 flex items-center gap-2"
            >
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground truncate flex-1">
                {marker.name}
              </span>
              <span className="text-xs font-medium text-foreground">
                {Math.round(marker.score)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
