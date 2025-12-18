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

  // Find most improved marker (comparing first to latest session)
  const firstSession = data[0];
  const latestSession = data[data.length - 1];
  const hasMultipleSessions = data.length > 1;

  const markerChanges = markerNames.map((name) => {
    const firstScore = firstSession?.markers.find((m) => m.name === name)?.score || 0;
    const latestScore = latestSession?.markers.find((m) => m.name === name)?.score || 0;
    return { name, change: latestScore - firstScore, latestScore };
  });

  const mostImproved = markerChanges.reduce((best, current) => 
    current.change > best.change ? current : best
  , markerChanges[0]);

  const topPerformer = latestSession?.markers.reduce((best, current) => 
    current.score > best.score ? current : best
  , latestSession?.markers[0]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Summary - Individual Marker Insights */}
      <div className="grid grid-cols-2 gap-2">
        {hasMultipleSessions && mostImproved && (
          <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 border border-green-200 dark:border-green-800">
            <p className="text-[10px] uppercase tracking-wide text-green-600 dark:text-green-400 font-medium">Most Improved</p>
            <p className="text-sm font-medium text-foreground truncate mt-1">{mostImproved.name}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
              ↑ +{Math.round(mostImproved.change)} growth
            </p>
          </div>
        )}
        {topPerformer && (
          <div className={`bg-primary/5 rounded-xl p-3 border border-primary/20 ${!hasMultipleSessions ? 'col-span-2' : ''}`}>
            <p className="text-[10px] uppercase tracking-wide text-primary font-medium">Top Performer</p>
            <p className="text-sm font-medium text-foreground truncate mt-1">{topPerformer.name}</p>
            <p className="text-xs text-primary mt-0.5">
              Score: {Math.round(topPerformer.score)}/4
            </p>
          </div>
        )}
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
