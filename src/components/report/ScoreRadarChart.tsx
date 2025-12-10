import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

interface ScoreItem {
  label: string;
  score: number;
}

interface ComparisonData {
  data: ScoreItem[];
  date: string;
  color?: string;
}

interface ScoreRadarChartProps {
  data: ScoreItem[];
  title: string;
  maxScore?: number;
  color?: string;
  comparison?: ComparisonData;
  currentDate?: string;
}

export const ScoreRadarChart = ({ 
  data, 
  title, 
  maxScore = 4,
  color = "#0D9488",
  comparison,
  currentDate,
}: ScoreRadarChartProps) => {
  const chartData = data.map((item, index) => {
    const comparisonItem = comparison?.data[index];
    return {
      subject: item.label.length > 15 ? item.label.substring(0, 12) + "..." : item.label,
      fullLabel: item.label,
      score: item.score,
      comparisonScore: comparisonItem?.score,
      fullMark: maxScore,
    };
  });

  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), "MMM d");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h4 className="font-medium text-sm text-foreground mb-2 text-center">{title}</h4>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, maxScore]}
              tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
              tickCount={maxScore + 1}
            />
            {/* Comparison radar (rendered first so it's behind) */}
            {comparison && (
              <Radar
                name={`Previous (${formatDateLabel(comparison.date)})`}
                dataKey="comparisonScore"
                stroke={comparison.color || "#9CA3AF"}
                fill={comparison.color || "#9CA3AF"}
                fillOpacity={0.1}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            )}
            {/* Current radar */}
            <Radar
              name={currentDate ? `Current (${formatDateLabel(currentDate)})` : "Score"}
              dataKey="score"
              stroke={color}
              fill={color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            {comparison && (
              <Legend 
                wrapperStyle={{ fontSize: '10px' }}
                iconSize={8}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {/* Score Legend */}
      <div className="flex flex-wrap justify-center gap-2 mt-2 pt-2 border-t border-border">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">4 Effective</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">3 Visible</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">2 Developing</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">1 Weak</span>
      </div>
    </div>
  );
};