import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/CircularProgress";
import { Download, TrendingUp, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

const Reports = () => {
  const metrics = [
    { label: "Clarity", value: 92, color: "primary" as const },
    { label: "Engagement", value: 85, color: "secondary" as const },
    { label: "Pacing", value: 78, color: "success" as const },
    { label: "Questions", value: 88, color: "primary" as const },
    { label: "Wait Time", value: 72, color: "warning" as const },
    { label: "Feedback", value: 90, color: "secondary" as const },
  ];

  const trendData = [
    { month: "Sep", score: 75 },
    { month: "Oct", score: 82 },
    { month: "Nov", score: 87 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 144px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-in-left">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Session Report</h1>
            <p className="text-sm text-muted-foreground">November 18, 2024</p>
          </div>
          <Button variant="outline" size="icon">
            <Download className="h-5 w-5" />
          </Button>
        </div>

        {/* Overall Score */}
        <Card className="p-6 text-center border-2 gradient-to-br from-primary/5 to-secondary/5 animate-slide-in-up">
          <p className="text-sm text-muted-foreground font-medium mb-4">Overall Score</p>
          <div className="flex justify-center mb-4">
            <CircularProgress value={87} size={120} strokeWidth={12} color="primary" />
          </div>
          <div className="flex items-center justify-center gap-2 text-success">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">+5% from last session</span>
          </div>
        </Card>

        {/* Metric Circles */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Detailed Metrics</h2>
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={metric.label}
                className="flex flex-col items-center animate-slide-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CircularProgress
                  value={metric.value}
                  size={80}
                  strokeWidth={6}
                  color={metric.color}
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Chart */}
        <Card className="p-5 border-2 animate-slide-in-up">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Progress Trend
          </h3>
          <div className="flex items-end justify-between gap-4 h-32">
            {trendData.map((item, index) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative">
                  <div
                    className="w-full gradient-primary rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${item.score}%`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                  <div className="absolute -top-6 left-0 right-0 text-center">
                    <span className="text-xs font-semibold text-foreground">
                      {item.score}%
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Feedback */}
        <Card className="p-5 border-2 border-secondary/20 bg-secondary/5 animate-slide-in-up">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">AI Insights</h3>
              <p className="text-xs text-muted-foreground">Personalized feedback</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-success mb-1">✓ Strengths</p>
              <p className="text-sm text-foreground">
                Excellent use of open-ended questions that encourage critical thinking.
                Your pacing allows students time to process information.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-warning mb-1">⚡ Opportunities</p>
              <p className="text-sm text-foreground">
                Consider reducing wait time slightly after questions to maintain
                engagement momentum. Try incorporating more varied questioning techniques.
              </p>
            </div>
          </div>
        </Card>

        {/* Download Button */}
        <Button variant="default" size="touch" className="w-full">
          <Download className="h-5 w-5" />
          Download PDF Report
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Reports;
