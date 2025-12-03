import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Mic, Upload, FileText, TrendingUp, Users, BarChart3, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { SessionSummaryCard } from "@/components/home/SessionSummaryCard";
import { AIInsightCard } from "@/components/home/AIInsightCard";

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  // Sample data for display (scores on 0-4 scale)
  const sampleInsights = {
    overallScore: 72,
    scenarioAvg: 2.33,
    dialogueAvg: 2.43,
    facilitatorTalkTime: 38,
    strengths: [
      { label: "Active Engagement", score: 3 },
      { label: "Purposeful Talk", score: 3 },
    ],
    focusAreas: [
      { label: "Open Questions", score: 2 },
      { label: "Productive Struggle", score: 2 },
    ],
  };

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
            value={`${sampleInsights.overallScore}%`}
            subtitle="+5% from previous"
            trend="up"
            icon={<TrendingUp className="h-5 w-5 text-secondary-foreground" />}
          />
          <MetricCard
            title="Sessions"
            value="3"
            subtitle="This month"
            trend="up"
            icon={<BarChart3 className="h-5 w-5 text-secondary-foreground" />}
          />
          <MetricCard
            title="Talk Time"
            value={`${sampleInsights.facilitatorTalkTime}%`}
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
            sessionTitle="FOP Training Session"
            sessionDate="November 18, 2024"
            scenarioScore={sampleInsights.scenarioAvg}
            dialogueScore={sampleInsights.dialogueAvg}
            strengths={sampleInsights.strengths}
            focusAreas={sampleInsights.focusAreas}
          />
        </div>

        {/* AI Insight */}
        <AIInsightCard
          strengths={sampleInsights.strengths}
          focusAreas={sampleInsights.focusAreas}
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
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
