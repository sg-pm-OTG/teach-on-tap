import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Mic, Upload, FileText, TrendingUp, Users, BarChart3, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useSessionReports } from "@/hooks/useSessionReports";
import { LockedPreview } from "@/components/home/LockedPreview";
import { SessionSummaryCard } from "@/components/home/SessionSummaryCard";
import { AIInsightCard } from "@/components/home/AIInsightCard";

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { hasReports, insights } = useSessionReports();

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 144px)' }}>
        {/* Greeting */}
        <div className="animate-slide-in-left">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {hasReports ? `Welcome back, ${profile?.name || "Teacher"}` : `Welcome, ${profile?.name || "Teacher"}!`}
          </h1>
          <p className="text-muted-foreground">
            {hasReports ? "Ready to track your teaching excellence?" : "Start your teaching analytics journey"}
          </p>
        </div>

        {hasReports && insights ? (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Overall Score"
                value={`${insights.overallScore}%`}
                subtitle="+5% from previous"
                trend="up"
                icon={<TrendingUp className="h-5 w-5 text-secondary-foreground" />}
              />
              <MetricCard
                title="Sessions"
                value="1"
                subtitle="This month"
                trend="neutral"
                icon={<BarChart3 className="h-5 w-5 text-secondary-foreground" />}
              />
              <MetricCard
                title="Talk Time"
                value={`${insights.facilitatorTalkTime}%`}
                subtitle="Facilitator"
                trend="neutral"
                icon={<Clock className="h-5 w-5 text-secondary-foreground" />}
              />
              <MetricCard
                title="Engagement"
                value="High"
                subtitle="Based on analysis"
                trend="up"
                icon={<Users className="h-5 w-5 text-secondary-foreground" />}
              />
            </div>

            {/* Latest Session Summary */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Latest Session</h2>
              <SessionSummaryCard
                sessionTitle={insights.latestSessionTitle}
                sessionDate={insights.latestSessionDate}
                scenarioScore={insights.scenarioAvg}
                dialogueScore={insights.dialogueAvg}
                strengths={insights.strengths}
                focusAreas={insights.focusAreas}
              />
            </div>

            {/* AI Insight */}
            <AIInsightCard
              strengths={insights.strengths}
              focusAreas={insights.focusAreas}
            />
          </>
        ) : (
          <LockedPreview />
        )}

        {/* Quick Actions - Always visible */}
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
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
