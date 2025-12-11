import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { HeroSessionCard } from "@/components/report/HeroSessionCard";
import { SpeakerCard } from "@/components/report/SpeakerCard";
import { ThemeCard } from "@/components/report/ThemeCard";
import { ConclusionCard } from "@/components/report/ConclusionCard";
import { TalkTimeBar } from "@/components/report/TalkTimeBar";
import { TalkTimePieChart } from "@/components/report/TalkTimePieChart";
import { InteractionChordDiagram } from "@/components/report/InteractionChordDiagram";
import { ScenarioCard } from "@/components/report/ScenarioCard";
import { ScoreRadarChart } from "@/components/report/ScoreRadarChart";
import { CollapsibleSection } from "@/components/report/CollapsibleSection";
import { OpportunityCallout } from "@/components/report/OpportunityCallout";
import { SectionDivider } from "@/components/report/SectionDivider";
import { SessionChipSelector } from "@/components/report/SessionChipSelector";
import { ComparisonSelector } from "@/components/report/ComparisonSelector";
import { TrendBadge } from "@/components/report/TrendBadge";
import { useAllSessionReports } from "@/hooks/useAllSessionReports";
import { ChevronDown, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Target, Wrench, Brain, Compass, Users, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Icon mapping for themes
const iconMap: Record<string, LucideIcon> = {
  Target,
  Wrench,
  Brain,
  Compass,
  Users,
};

const Reports = () => {
  const [showAllSpeakers, setShowAllSpeakers] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const {
    reports,
    selectedReport,
    comparisonReport,
    availableForComparison,
    setSelectedReportId,
    setComparisonReportId,
    isLoading,
  } = useAllSessionReports();

  // Handle compare mode toggle
  const handleToggleCompare = () => {
    if (compareMode) {
      setComparisonReportId(null);
    }
    setCompareMode(!compareMode);
  };

  // Empty state
  if (!isLoading && reports.length === 0) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
        <TopBar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center px-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No Reports Yet</h2>
            <p className="text-sm text-muted-foreground">
              Complete a session recording to see your first report here.
            </p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
        <TopBar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading reports...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!selectedReport) return null;

  const displayedSpeakers = showAllSpeakers 
    ? selectedReport.speakers 
    : selectedReport.speakers.slice(0, 3);

  const speakerLabels = selectedReport.speakers.map((s, i) => 
    i === 0 ? "F" : `P${i}`
  );

  const formatSessionDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const handleDownloadAudio = async () => {
    if (!selectedReport?.audioFileUrl) {
      toast.error("No audio file available for this session");
      return;
    }

    try {
      const response = await fetch(selectedReport.audioFileUrl);
      if (!response.ok) throw new Error("Failed to download");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `session-${format(parseISO(selectedReport.sessionDate), "yyyy-MM-dd")}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Audio downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download audio file");
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
      <TopBar />

      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-md mx-auto px-4 py-6 space-y-4">
          {/* Session Selector */}
          <div className="animate-slide-in-up">
            <SessionChipSelector
              sessions={reports.map((r) => ({
                id: r.id,
                sessionDate: r.sessionDate,
                useSite: r.useSite,
              }))}
              selectedId={selectedReport.id}
              onSelect={(id) => setSelectedReportId(id)}
              compareMode={compareMode}
              onToggleCompare={handleToggleCompare}
              canCompare={availableForComparison.length > 0}
            />
          </div>

          {/* Comparison Selector (when compare mode is on) */}
          {compareMode && availableForComparison.length > 0 && (
            <div className="animate-slide-in-up">
              <ComparisonSelector
                currentSessionDate={selectedReport.sessionDate}
                availableSessions={availableForComparison.map((r) => ({
                  id: r.id,
                  sessionDate: r.sessionDate,
                  useSite: r.useSite,
                  isBaseline: (r as any).isBaseline || false,
                }))}
                selectedComparisonId={comparisonReport?.id || null}
                onSelectComparison={(id) => setComparisonReportId(id)}
              />
            </div>
          )}

          {/* Hero Session Card */}
          <div className="animate-slide-in-up">
            <HeroSessionCard
              title="FOP Analysis Full Report"
              useSite={selectedReport.useSite}
              date={formatSessionDate(selectedReport.sessionDate)}
              participants={selectedReport.participants}
              activityType={selectedReport.sessionType}
              overallScore={selectedReport.overallScore}
              trendBadge={
                comparisonReport ? (
                  <TrendBadge
                    currentValue={selectedReport.overallScore}
                    previousValue={comparisonReport.overallScore}
                    size="md"
                  />
                ) : undefined
              }
            />
          </div>

          {/* Download Audio Button */}
          {selectedReport.audioFileUrl && (
            <div className="animate-slide-in-up">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownloadAudio}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Session Audio
              </Button>
            </div>
          )}

          <SectionDivider title="Speakers" />

          {/* Speaker Summary */}
          <div className="space-y-2 animate-slide-in-up">
            {displayedSpeakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                id={speaker.id}
                description={speaker.description}
              />
            ))}
            {selectedReport.speakers.length > 3 && (
              <button
                onClick={() => setShowAllSpeakers(!showAllSpeakers)}
                className="w-full py-2 text-sm text-primary font-medium flex items-center justify-center gap-1 hover:bg-muted/50 rounded-lg transition-colors"
              >
                {showAllSpeakers ? "Show Less" : `Show All ${selectedReport.speakers.length} Speakers`}
                <ChevronDown className={cn("h-4 w-4 transition-transform", showAllSpeakers && "rotate-180")} />
              </button>
            )}
          </div>

          <SectionDivider title="Main Themes" />

          {/* Main Discussion Themes */}
          <div className="space-y-3 animate-slide-in-up">
            {selectedReport.themes.map((theme, index) => {
              const IconComponent = iconMap[theme.icon] || Target;
              return (
                <ThemeCard
                  key={index}
                  title={theme.title}
                  icon={IconComponent}
                  bullets={theme.bullets}
                  accentColor={theme.accentColor}
                />
              );
            })}
          </div>

          <SectionDivider title="Conclusions" />

          {/* Overall Conclusions */}
          <div className="animate-slide-in-up">
            <ConclusionCard title="Overall Conclusions" conclusions={selectedReport.conclusions} />
          </div>

          <SectionDivider title="Structural Analysis" />

          {/* Talk Time Distribution - Pie Chart */}
          <div className="animate-slide-in-up">
            <TalkTimePieChart data={selectedReport.talkTimeData} />
          </div>

          {/* Talk Time Bars */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-3 animate-slide-in-up">
            <h4 className="font-medium text-sm text-foreground mb-3">Speaker Talk Time Details</h4>
            {selectedReport.talkTimeData.map((item) => (
              <TalkTimeBar
                key={item.speaker}
                speaker={item.speaker}
                percentage={item.percentage}
                seconds={item.seconds}
                color={item.color}
              />
            ))}
          </div>

          {/* Speaker Interaction Chord Diagram */}
          <div className="animate-slide-in-up">
            <InteractionChordDiagram
              interactions={selectedReport.speakerInteractions}
              labels={speakerLabels}
            />
          </div>

          <SectionDivider title="Emergent Scenario" />

          {/* Scenario Card */}
          <div className="animate-slide-in-up">
            <ScenarioCard
              title={selectedReport.scenarioContent.title}
              content={selectedReport.scenarioContent.content}
            />
          </div>

          {/* Scenario Scores - Radar Chart with Comparison Overlay */}
          <div className="animate-slide-in-up">
            <ScoreRadarChart
              data={selectedReport.scenarioScores}
              title="Scenario Quality Scores"
              maxScore={4}
              color="#F97316"
              currentDate={selectedReport.sessionDate}
              comparison={
                comparisonReport
                  ? {
                      data: comparisonReport.scenarioScores,
                      date: comparisonReport.sessionDate,
                      color: "#9CA3AF",
                    }
                  : undefined
              }
            />
          </div>

          {/* Scenario Detailed Analysis */}
          <div className="space-y-2 animate-slide-in-up">
            <h4 className="font-medium text-sm text-foreground mb-3">Detailed Analysis</h4>
            {selectedReport.scenarioAnalysis.map((item) => (
              <CollapsibleSection key={item.title} title={item.title} score={item.score}>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
              </CollapsibleSection>
            ))}
          </div>

          <SectionDivider title="Generative Dialogue" />

          {/* Dialogue Scores - Radar Chart with Comparison Overlay */}
          <div className="animate-slide-in-up">
            <ScoreRadarChart
              data={selectedReport.dialogueScores}
              title="Dialogue Quality Scores"
              maxScore={4}
              color="#0D9488"
              currentDate={selectedReport.sessionDate}
              comparison={
                comparisonReport
                  ? {
                      data: comparisonReport.dialogueScores,
                      date: comparisonReport.sessionDate,
                      color: "#9CA3AF",
                    }
                  : undefined
              }
            />
          </div>

          {/* Dialogue Detailed Analysis */}
          <div className="space-y-2 animate-slide-in-up">
            <h4 className="font-medium text-sm text-foreground mb-3">Detailed Analysis</h4>
            {selectedReport.dialogueAnalysis.map((item) => (
              <CollapsibleSection key={item.title} title={item.title} score={item.score}>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                  {item.opportunity && (
                    <OpportunityCallout
                      speaker={item.opportunity.speaker}
                      quote={item.opportunity.quote}
                      observation={item.opportunity.observation}
                      opportunity={item.opportunity.opportunity}
                    />
                  )}
                </div>
              </CollapsibleSection>
            ))}
          </div>

          <SectionDivider title="Key Insights" />

          {/* Final Summary */}
          <div className="animate-slide-in-up">
            <ConclusionCard
              title="Session Summary"
              conclusions={selectedReport.finalSummary}
              variant="summary"
            />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Reports;