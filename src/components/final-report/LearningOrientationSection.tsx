import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

interface SurveyComparison {
  categoryCode: string;
  categoryName: string;
  preSurveyScore: number;
  postSurveyScore: number;
  maxScore: number;
  nationalAverage: number;
  change: number;
  interpretation: string;
}

interface LearningOrientationSectionProps {
  data: SurveyComparison[];
}

const categoryLabels: Record<string, string> = {
  B1: "Internal Motivation",
  B2: "Skills Mastery",
  B3: "Deep Learning",
};

const categoryDescriptions: Record<string, string> = {
  B1: "Your intrinsic drive to learn and grow professionally",
  B2: "Focus on developing practical competencies and expertise",
  B3: "Commitment to understanding concepts at a fundamental level",
};

export const LearningOrientationSection = ({ data }: LearningOrientationSectionProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-muted/30 rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Learning orientation data not available yet.
        </p>
      </div>
    );
  }

  // Transform data for grouped bar chart
  const chartData = data.map((item) => ({
    category: categoryLabels[item.categoryCode] || item.categoryName,
    categoryCode: item.categoryCode,
    you: item.preSurveyScore,
    national: item.nationalAverage,
    max: item.maxScore,
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="font-medium text-foreground">Your Learning Orientation</h4>
        <p className="text-sm text-muted-foreground mt-1">
          How your learning approach compares to national benchmarks
        </p>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                domain={[0, 6]}
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                type="category" 
                dataKey="category" 
                width={100}
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
                formatter={(value: number, name: string) => [
                  value.toFixed(1),
                  name === "you" ? "Your Score" : "National Average",
                ]}
              />
              <Legend 
                wrapperStyle={{ fontSize: "10px" }}
                formatter={(value) => value === "you" ? "Your Score" : "National Average"}
              />
              <Bar dataKey="you" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              <Bar dataKey="national" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdowns */}
      <div className="space-y-3">
        {data.map((item) => {
          const diff = item.preSurveyScore - item.nationalAverage;
          const isAboveAverage = diff > 0.3;
          const isBelowAverage = diff < -0.3;

          return (
            <div
              key={item.categoryCode}
              className="bg-muted/30 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">
                  {categoryLabels[item.categoryCode] || item.categoryName}
                </span>
                <span 
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isAboveAverage 
                      ? "bg-green-100 text-green-700"
                      : isBelowAverage
                      ? "bg-amber-100 text-amber-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isAboveAverage 
                    ? "Above Average" 
                    : isBelowAverage 
                    ? "Below Average" 
                    : "Average"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {categoryDescriptions[item.categoryCode] || ""}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="text-primary font-medium">
                  You: {item.preSurveyScore.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  National: {item.nationalAverage.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interpretation */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4">
        <p className="text-xs font-medium text-primary mb-2">Understanding Your Profile</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your learning orientation influences how you approach professional development 
          and how you design learning experiences for others. Higher scores in Deep Learning 
          and Internal Motivation often correlate with more effective facilitation of 
          future-oriented pedagogies.
        </p>
      </div>
    </div>
  );
};
