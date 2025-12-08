import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Mic, Upload, FileText, TrendingUp, BarChart3, Award, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useSessionReports } from "@/hooks/useSessionReports";
import { SessionSummaryCard } from "@/components/home/SessionSummaryCard";
import { AIInsightCard } from "@/components/home/AIInsightCard";

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { insights, sessionCount, isLoading } = useSessionReports();

  const getSessionsSubtitle = () => {
    if (sessionCount === 0) return "Start your first session!";
    if (sessionCount >= 5) return "Ready for Final Report";
    if (sessionCount >= 3) return "Final Report available!";
    return `${5 - sessionCount} more to unlock Final Report`;
  };

  const showFinalReportButton = sessionCount >= 3;
  const hasData = sessionCount > 0 && insights;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 144px)' }}>
        {/* Greeting */}
        <div className="animate-slide-in-left">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Welcome back, {profile?.name || "Teacher"}
          </h1>
          <p className="text-muted-foreground">
            Ready to track your teaching excellence?
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            title="Overall Score"
            value={hasData ? `${insights.overallScore}/4` : "—"}
            subtitle={hasData ? "Latest session" : "No sessions yet"}
            trend={hasData ? "up" : "neutral"}
            icon={<TrendingUp className="h-5 w-5 text-secondary-foreground" />}
          />
          <MetricCard
            title="Sessions"
            value={`${sessionCount}/5`}
            subtitle={getSessionsSubtitle()}
            trend={sessionCount >= 3 ? "up" : "neutral"}
            icon={<BarChart3 className="h-5 w-5 text-secondary-foreground" />}
          />
        </div>

        {/* Latest Session Summary - Only show if has data */}
        {hasData ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Latest Session</h2>
            <SessionSummaryCard
              sessionTitle={insights.latestSessionTitle || "Session"}
              sessionDate={insights.latestSessionDate || ""}
              scenarioScore={insights.scenarioAvg}
              dialogueScore={insights.dialogueAvg}
              strengths={insights.strengths}
              focusAreas={insights.focusAreas}
            />
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">No Sessions Yet</h3>
              <p className="text-sm text-muted-foreground">
                Record your first teaching session to get personalized insights and feedback.
              </p>
            </div>
            <Button
              variant="record"
              size="lg"
              className="w-full"
              onClick={() => navigate("/record")}
            >
              <Mic className="h-5 w-5 mr-2" />
              Record Your First Session
            </Button>
          </div>
        )}

        {/* AI Insight - Only show if has data */}
        {hasData && (
          <AIInsightCard
            strengths={insights.strengths}
            focusAreas={insights.focusAreas}
          />
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          
          <Button
            variant="record"
            size="touch"
            className="w-full justify-start"
            onClick={() => navigate("/record")}
          >
            <Mic className="h-5 w-5" />
            <span>Record New Session</span>
          </Button>

          <Button
            variant="action"
            size="touch"
            className="w-full justify-start"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Audio File</span>
          </Button>

          {hasData && (
            <Button
              variant="action"
              size="touch"
              className="w-full justify-start"
              onClick={() => navigate("/reports")}
            >
              <FileText className="h-5 w-5" />
              <span>View All Reports</span>
            </Button>
          )}

          {showFinalReportButton && (
            <Button
              variant="record"
              size="touch"
              className="w-full justify-start"
              onClick={() => {/* TODO: Navigate to Final Report generation */}}
            >
              <Award className="h-5 w-5" />
              <span>Generate Final Report</span>
            </Button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
