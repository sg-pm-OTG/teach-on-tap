import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TalkTimeData {
  speaker: string;
  percentage: number;
  seconds: number;
  color: string;
}

interface TalkTimePieChartProps {
  data: TalkTimeData[];
  bare?: boolean;
  compact?: boolean;
}

const COLORS = [
  "#0D9488", // teal-600
  "#3B82F6", // blue-500
  "#8B5CF6", // purple-500
  "#EC4899", // pink-500
  "#F97316", // orange-500
  "#10B981", // emerald-500
  "#6366F1", // indigo-500
  "#F43F5E", // rose-500
  "#06B6D4", // cyan-500
];

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
        <p className="text-xs font-medium text-foreground">{data.speaker ? data.speaker : "Inaudible or Silent"}</p>
        <p className="text-xs text-muted-foreground">
          {data.percentage}% • {formatTime(data.seconds)}
        </p>
      </div>
    );
  }
  return null;
};

export const TalkTimePieChart = ({ data, bare = false, compact = false }: TalkTimePieChartProps) => {
  const chartData = data.map((item, index) => ({
    ...item,
    name: item.speaker ? item.speaker : "Inaudible or Silent",
    value: item.percentage,
    fill: COLORS[index % COLORS.length],
  }));

  const chartHeight = compact ? 160 : 280;
  const innerRadius = compact ? 30 : 45;
  const outerRadius = compact ? 55 : 80;

  const chartContent = (
    <div className="w-full" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            label={compact ? false : ({ percentage }) => `${percentage}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {!compact && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
              formatter={(value: string) => (
                <span className="text-muted-foreground">{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  if (bare) {
    return chartContent;
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h4 className="font-medium text-sm text-foreground mb-2 text-center">Talk Time Distribution</h4>
      {chartContent}
    </div>
  );
};
