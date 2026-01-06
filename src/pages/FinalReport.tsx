import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFinalReportData } from "@/hooks/useFinalReportData";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Map, 
  BarChart3, 
  MessageSquare, 
  Lightbulb, 
  SlidersHorizontal,
  Brain,
  Compass,
  Rocket,
  FileText,
} from "lucide-react";

import { FinalReportCover } from "@/components/final-report/FinalReportCover";
import { JourneyOverview } from "@/components/final-report/JourneyOverview";
import { StructuralAnalysis } from "@/components/final-report/StructuralAnalysis";
import { FOPAnalysisChart } from "@/components/final-report/FOPAnalysisChart";
import { RecommendationCards } from "@/components/final-report/RecommendationCards";
import { EaseOfUseSection } from "@/components/final-report/EaseOfUseSection";
import { BeliefsShiftSection } from "@/components/final-report/BeliefsShiftSection";
import { LearningOrientationSection } from "@/components/final-report/LearningOrientationSection";
import { WhatsNextSection } from "@/components/final-report/WhatsNextSection";
import PdfExportFinalReport from "@/components/final-report/TemplateExportFinalReport";
import { useAuth } from "@/components/AuthProvider";

const FinalReport = () => {
  const navigate = useNavigate();
  const { progress } = useJourneyProgress();
  const {
    isLoading,
    journeyTimeline,
    scenarioScoreProgression,
    dialogueScoreProgression,
    talkTimeBySession,
    latestSpeakerInteractions,
    beliefComparisons,
    orientationComparisons,
    difficultyProgression,
    summaryStats,
    finalReportData,
    allSpeakerInteractions,
  } = useFinalReportData();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
        <TopBar />
        <main className="container max-w-md mx-auto px-4 py-6 space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Cover/Hero */}
        <FinalReportCover />

        {/* Accordion Sections */}
        <Accordion type="single" collapsible className="space-y-3">
          {/* Journey Overview */}
          <AccordionItem 
            value="journey" 
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Map className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Your FOP Journey</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <JourneyOverview timeline={journeyTimeline} />
            </AccordionContent>
          </AccordionItem>

          {/* Structural Analysis */}
          <AccordionItem 
            value="structural" 
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-secondary" />
                </div>
                <span className="font-medium text-foreground">Structural Analysis</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <StructuralAnalysis 
                talkTimeBySession={talkTimeBySession}
                latestSpeakerInteractions={latestSpeakerInteractions}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Scenario Analysis */}
          <AccordionItem 
            value="scenario" 
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-accent-foreground" />
                </div>
                <span className="font-medium text-foreground">Scenario Analysis</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <FOPAnalysisChart
                title="FOP Scenario Markers"
                description="Track how your scenario facilitation skills have evolved across sessions"
                data={scenarioScoreProgression}
                type="scenario"
              />
              <div className="mt-4">
                <RecommendationCards 
                  sectionTitle="Scenario Recommendations"
                  recommendations={finalReportData?.marker_level_insights?.emergent_scenarios}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Dialogue Analysis */}
          <AccordionItem 
            value="dialogue" 
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Dialogue Analysis</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <FOPAnalysisChart
                title="Generative Dialogue Markers"
                description="See how your dialogue facilitation has developed over time"
                data={dialogueScoreProgression}
                type="dialogue"
              />
              <div className="mt-4">
                <RecommendationCards 
                  sectionTitle="Dialogue Recommendations"
                  recommendations={finalReportData?.marker_level_insights?.generative_dialogue}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Ease of Use */}
          <AccordionItem 
            value="ease" 
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <SlidersHorizontal className="h-4 w-4 text-secondary" />
                </div>
                <span className="font-medium text-foreground">Ease of Use</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <EaseOfUseSection data={difficultyProgression} />
            </AccordionContent>
          </AccordionItem>

          {/* Learning Beliefs */}
          <AccordionItem 
            value="beliefs" 
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-accent-foreground" />
                </div>
                <span className="font-medium text-foreground">Learning Beliefs Shift</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <BeliefsShiftSection data={beliefComparisons} />
            </AccordionContent>
          </AccordionItem>

          {/* Learning Orientation */}
          <AccordionItem 
            value="orientation" 
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Compass className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Learning Orientation</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <LearningOrientationSection data={orientationComparisons} />
            </AccordionContent>
          </AccordionItem>

          {/* What's Next */}
          <AccordionItem 
            value="next" 
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-secondary" />
                </div>
                <span className="font-medium text-foreground">What's Next?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <WhatsNextSection 
                launchHuddleDate={progress.launchHuddleDate}
                launchHuddleLocation={progress.launchHuddleLocation}
                content={finalReportData?.recommendations}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {
            !isLoading &&        
            <PdfExportFinalReport
              user={user.user_metadata.name}
              exportData={finalReportData}
              journeyTimeline={journeyTimeline.filter(item => !item.isBaseline)}
              talkTimeBySession={talkTimeBySession}
              scenarioScoreProgression={scenarioScoreProgression}
              dialogueScoreProgression={dialogueScoreProgression}
              allSpeakerInteractions={allSpeakerInteractions}
              difficultyProgression={difficultyProgression}
            />
          }
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/reports")}
          >
            <FileText className="h-5 w-5 mr-2" />
            View Session Reports
          </Button>
          
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default FinalReport;
