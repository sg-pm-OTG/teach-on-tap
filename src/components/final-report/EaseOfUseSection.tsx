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

interface DifficultyProgression {
  session: number;
  sessionLabel: string;
  practiceDifficulty: string | null;
  designDifficulty: string | null;
}

interface EaseOfUseSectionProps {
  data: DifficultyProgression[];
}

// Map difficulty strings to numeric values (support both formats from DB)
const difficultyToValue: Record<string, number> = {
  // Database format (with spaces)
  "Very easy": 1,
  "Easy": 2,
  "Somewhat easy": 3,
  "Somewhat difficult": 4,
  "Difficult": 5,
  "Very difficult": 6,
  // Alternative format (underscores)
  "very_easy": 1,
  "easy": 2,
  "somewhat_easy": 3,
  "somewhat_difficult": 4,
  "difficult": 5,
  "very_difficult": 6,
};

const valueToLabel: Record<number, string> = {
  1: "Very Easy",
  2: "Easy",
  3: "Somewhat Easy",
  4: "Somewhat Difficult",
  5: "Difficult",
  6: "Very Difficult",
};

export const EaseOfUseSection = ({ data }: EaseOfUseSectionProps) => {
  // Transform data for chart
  const chartData = data.map((item) => ({
    session: item.sessionLabel,
    practice: item.practiceDifficulty 
      ? difficultyToValue[item.practiceDifficulty] || 3 
      : null,
    design: item.designDifficulty 
      ? difficultyToValue[item.designDifficulty] || 3 
      : null,
  }));

  // Calculate trend
  const practiceValues = chartData
    .map((d) => d.practice)
    .filter((v): v is number => v !== null);
  
  const firstPractice = practiceValues[0];
  const lastPractice = practiceValues[practiceValues.length - 1];
  const trend = firstPractice && lastPractice ? lastPractice - firstPractice : 0;

  // Interpretation
  const getInterpretation = () => {
    if (trend < -1) {
      return "FOP is becoming significantly easier to implement in your practice. Your confidence and fluency are growing!";
    } else if (trend < 0) {
      return "You're finding FOP slightly easier to use. Keep building on this positive momentum.";
    } else if (trend === 0) {
      return "Your perceived difficulty has remained stable, suggesting consistent application of FOP principles.";
    } else {
      return "You may be tackling more challenging applications of FOP, which is a sign of growth in your practice.";
    }
  };

  if (practiceValues.length === 0) {
    return (
      <div className="bg-muted/30 rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No difficulty data available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="font-medium text-foreground">Ease of Use Over Time</h4>
        <p className="text-sm text-muted-foreground mt-1">
          How difficult did you find practicing FOP across your sessions?
        </p>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="session" 
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                domain={[1, 6]}
                ticks={[1, 2, 3, 4, 5, 6]}
                tickFormatter={(value) => {
                  const labels: Record<number, string> = {
                    1: "Very Easy",
                    2: "Easy",
                    3: "Somewhat Easy",
                    4: "Somewhat Difficult",
                    5: "Difficult",
                    6: "Very Difficult",
                  };
                  return labels[value] || "";
                }}
                tick={{ fontSize: 8 }}
                stroke="hsl(var(--muted-foreground))"
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [valueToLabel[value] || value, "Difficulty"]}
              />
              <ReferenceLine 
                y={3.5} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5" 
                label={{ 
                  value: "Neutral", 
                  position: "right", 
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))"
                }}
              />
              <Line
                type="monotone"
                dataKey="practice"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 6, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 8 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend indicator */}
      <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {firstPractice ? valueToLabel[firstPractice] : "—"}
          </p>
          <p className="text-xs text-muted-foreground">First Session</p>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className={`text-2xl ${
              trend < 0 ? "text-green-500" : trend > 0 ? "text-amber-500" : "text-muted-foreground"
            }`}
          >
            {trend < 0 ? "↓" : trend > 0 ? "↑" : "→"}
          </span>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {lastPractice ? valueToLabel[lastPractice] : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Latest Session</p>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4">
        <p className="text-xs font-medium text-primary mb-1">What This Means</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {getInterpretation()}
        </p>
      </div>
    </div>
  );
};
