import { useRef } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Mic, Upload, FileText, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useSessionReports } from "@/hooks/useSessionReports";
import { EncouragementHero } from "@/components/home/EncouragementHero";
import { ScoreBadges } from "@/components/home/ScoreBadges";
import { SessionSummaryCard } from "@/components/home/SessionSummaryCard";
import { AIInsightCard } from "@/components/home/AIInsightCard";
import JourneyMilestones from "@/components/home/JourneyMilestones";
import JourneyProgressBar from "@/components/home/JourneyProgressBar";
import FinalReportHero from "@/components/home/FinalReportHero";

const Home = () => {
  const journeyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { insights, sessionCount, isLoading } = useSessionReports();

  const isFinalReportReady = profile?.final_report_status === "generated";
  const hasData = sessionCount > 0 && insights;
  const isActiveUser = sessionCount >= 1;

  const scrollToJourney = () => {
    journeyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-5">
        {/* Final Report Hero - Show when report is ready */}
        {isFinalReportReady && <FinalReportHero />}

        {/* Encouragement Hero - Always show, personalized message */}
        {!isFinalReportReady && (
          <EncouragementHero
            userName={profile?.name || "Teacher"}
            sessionCount={sessionCount}
            isFinalReportReady={isFinalReportReady}
            baselineCompleted={profile?.baseline_completed || false}
            masterclassAttended={profile?.masterclass_attended || false}
          />
        )}

        {/* Compact Journey Progress Bar - Show for active users who haven't completed */}
        {isActiveUser && !isFinalReportReady && (
          <JourneyProgressBar onViewClick={scrollToJourney} />
        )}

        {/* Score Badges - Top markers display */}
        <ScoreBadges
          topScenarioMarkers={hasData ? insights.topScenarioMarkers : []}
          topDialogueMarkers={hasData ? insights.topDialogueMarkers : []}
          hasData={!!hasData}
        />

        {/* AI Coach Card - Prominent position */}
        {hasData && (
          <AIInsightCard
            strengths={insights.strengths}
            focusAreas={insights.focusAreas}
          />
        )}

        {/* Journey Milestones - Show first for new users */}
        {!isActiveUser && <JourneyMilestones />}

        {/* Latest Session Summary - Simplified */}
        {hasData ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Your Latest Session</h2>
            <SessionSummaryCard
              sessionTitle={insights.latestSessionTitle || "Session"}
              sessionDate={insights.latestSessionDate || ""}
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
              <h3 className="font-semibold text-foreground mb-1">Ready When You Are</h3>
              <p className="text-sm text-muted-foreground">
                Record your first session and we'll provide personalized insights to help you grow.
              </p>
            </div>
            <Button
              variant="record"
              size="lg"
              className="w-full"
              onClick={() => navigate("/record")}
            >
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </Button>
          </div>
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
            onClick={() => navigate("/upload")}
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
        </div>

        {/* Journey Milestones - Show at bottom for active users */}
        {isActiveUser && (
          <div ref={journeyRef}>
            <JourneyMilestones />
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
