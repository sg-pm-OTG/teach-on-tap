import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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

interface BeliefsShiftSectionProps {
  data: SurveyComparison[];
}

const categoryDescriptions: Record<string, string> = {
  A1: "Learning as Acquisition – viewing knowledge as something to be obtained and stored",
  A2: "Learning as Participation – emphasizing social engagement and collaborative knowledge building",
  A3: "Learning as Knowledge Building – focusing on creating new understanding through inquiry",
};

export const BeliefsShiftSection = ({ data }: BeliefsShiftSectionProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-muted/30 rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Survey comparison data not available yet.
        </p>
      </div>
    );
  }

  const getChangeIcon = (change: number) => {
    if (change > 0.3) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < -0.3) return <TrendingDown className="h-4 w-4 text-amber-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getInterpretationColor = (interpretation: string) => {
    switch (interpretation) {
      case "Healthy Shift":
        return "bg-green-100 text-green-700";
      case "Slight Decline":
        return "bg-amber-100 text-amber-700";
      case "Still Dominant":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="font-medium text-foreground">Learning Beliefs Shift</h4>
        <p className="text-sm text-muted-foreground mt-1">
          How your beliefs about learning have evolved through the FOP journey
        </p>
      </div>

      {/* Comparison cards */}
      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.categoryCode}
            className="bg-card rounded-xl border border-border p-4 space-y-3"
          >
            {/* Category header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h5 className="font-medium text-foreground text-sm">
                  {item.categoryName}
                </h5>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {categoryDescriptions[item.categoryCode] || ""}
                </p>
              </div>
              <span 
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getInterpretationColor(item.interpretation)}`}
              >
                {item.interpretation}
              </span>
            </div>

            {/* Before/After bars */}
            <div className="space-y-2">
              {/* Pre-survey */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Pre-Program</span>
                  <span className="font-medium text-foreground">
                    {item.preSurveyScore.toFixed(1)}/{item.maxScore}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/50 rounded-full transition-all duration-500"
                    style={{ width: `${(item.preSurveyScore / item.maxScore) * 100}%` }}
                  />
                </div>
              </div>

              {/* Post-survey */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Post-Program</span>
                  <div className="flex items-center gap-1">
                    {getChangeIcon(item.change)}
                    <span className="font-medium text-foreground">
                      {item.postSurveyScore.toFixed(1)}/{item.maxScore}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${(item.postSurveyScore / item.maxScore) * 100}%` }}
                  />
                </div>
              </div>

              {/* National average reference */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">
                  National avg: {item.nationalAverage.toFixed(1)}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary interpretation */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4">
        <p className="text-xs font-medium text-primary mb-2">What This Means For You</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your beliefs about learning provide the foundation for how you facilitate. 
          Shifts in these beliefs often indicate deeper changes in your teaching practice. 
          A healthy evolution typically shows movement from acquisition-focused beliefs 
          toward more participatory and knowledge-building orientations.
        </p>
      </div>
    </div>
  );
};
