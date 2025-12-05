import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Mic, Upload, FileText, TrendingUp, BarChart3, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useSessionReports } from "@/hooks/useSessionReports";
import { SessionSummaryCard } from "@/components/home/SessionSummaryCard";
import { AIInsightCard } from "@/components/home/AIInsightCard";

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { insights } = useSessionReports();

  const defaultInsights = {
    overallScore: 0,
    scenarioAvg: 0,
    dialogueAvg: 0,
    facilitatorTalkTimeMinutes: 0,
    strengths: [] as { label: string; score: number }[],
    focusAreas: [] as { label: string; score: number }[],
    latestSessionDate: "",
    latestSessionTitle: "",
    sessionCount: 0,
    finalReportGenerated: false,
  };

  const data = insights || defaultInsights;

  const getSessionsSubtitle = () => {
    if (data.finalReportGenerated) return "Final Report generated";
    if (data.sessionCount >= 5) return "Ready for Final Report";
    if (data.sessionCount >= 3) return "Final Report available!";
    return `${5 - data.sessionCount} more to unlock Final Report`;
  };

  const showFinalReportButton = data.sessionCount >= 3 && !data.finalReportGenerated;

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
            value={`${data.overallScore}/4`}
            subtitle="Latest session"
            trend="up"
            icon={<TrendingUp className="h-5 w-5 text-secondary-foreground" />}
          />
          <MetricCard
            title="Sessions"
            value={`${data.sessionCount}/5`}
            subtitle={getSessionsSubtitle()}
            trend={data.sessionCount >= 3 ? "up" : "neutral"}
            icon={<BarChart3 className="h-5 w-5 text-secondary-foreground" />}
          />
        </div>

        {/* Latest Session Summary */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Latest Session</h2>
          <SessionSummaryCard
            sessionTitle={data.latestSessionTitle || "FOP Training Session"}
            sessionDate={data.latestSessionDate || "November 18, 2024"}
            scenarioScore={data.scenarioAvg}
            dialogueScore={data.dialogueAvg}
            strengths={data.strengths}
            focusAreas={data.focusAreas}
          />
        </div>

        {/* AI Insight */}
        <AIInsightCard
          strengths={data.strengths}
          focusAreas={data.focusAreas}
        />

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

          <Button
            variant="action"
            size="touch"
            className="w-full justify-start"
            onClick={() => navigate("/reports")}
          >
            <FileText className="h-5 w-5" />
            <span>View All Reports</span>
          </Button>

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
