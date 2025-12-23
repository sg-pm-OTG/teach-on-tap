import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { HeroSessionCard } from "@/components/report/HeroSessionCard";
import { ThemeCard } from "@/components/report/ThemeCard";
import { ConclusionCard } from "@/components/report/ConclusionCard";
import { TalkTimeBar } from "@/components/report/TalkTimeBar";
import { TalkTimePieChart } from "@/components/report/TalkTimePieChart";
import { InteractionChordDiagram } from "@/components/report/InteractionChordDiagram";
import { ScenarioCard } from "@/components/report/ScenarioCard";
import { ScoreRadarChart } from "@/components/report/ScoreRadarChart";
import { ScoreEvolutionChart } from "@/components/report/ScoreEvolutionChart";
import { CollapsibleSection } from "@/components/report/CollapsibleSection";
import { OpportunityCallout } from "@/components/report/OpportunityCallout";
import { SectionDivider } from "@/components/report/SectionDivider";
import { SessionChipSelector } from "@/components/report/SessionChipSelector";
import { ComparisonSelector } from "@/components/report/ComparisonSelector";
import { TrendBadge } from "@/components/report/TrendBadge";
import ImportantSectionWrapper from "@/components/report/ImportantSectionWrapper";
import { ComparisonSummaryCard } from "@/components/report/ComparisonSummaryCard";
import { useAllSessionReports } from "@/hooks/useAllSessionReports";
import { FileText, Download, Music, FileDown, MessageCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Target, Wrench, Brain, Compass, Users, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import axios from "axios";

// Icon mapping for themes
const iconMap: Record<string, LucideIcon> = {
  Target,
  Wrench,
  Brain,
  Compass,
  Users,
};

const Reports = () => {
  
  const [compareMode, setCompareMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    reports,
    selectedReport,
    comparisonReport,
    comparisonReports,
    comparisonReportIds,
    availableForComparison,
    allSessionsForTimeline,
    setSelectedReportId,
    setComparisonReportIds,
    isLoading,
  } = useAllSessionReports();

  // Handle compare mode toggle
  const handleToggleCompare = () => {
    if (compareMode) {
      setComparisonReportIds([]);
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
              Record a session after completing the Baseline to see your first report here.
              Your baseline recording will be used for comparison.
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

  const getAccessToken = async (): Promise<string> => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session?.access_token) {
      throw new Error("Not authenticated");
    }

    return data.session.access_token;
  };

  // Get top N performing markers from a scores array
  const getTopMarkers = (scores: typeof selectedReport.scenarioScores, count: number = 2) => {
    return [...scores]
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(s => ({ label: s.label, score: s.score }));
  };

  const handleDownloadAudio = async () => {
    if (!selectedReport?.audioFileUrl) {
      toast.error("No audio file available for this session");
      return;
    }

  try {
    setIsDownloading(true);
    const token = await getAccessToken();

    const res = await axios.get(
      selectedReport.audioFileUrl,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", 
        timeout: 60_000,
      }
    );

    const blob = new Blob([res.data], { type: "audio/wav" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `session-${selectedReport.sessionId}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    toast.error("Download failed");
  } finally {
    setIsDownloading(false);
  }
  };

  const handleDownloadTranscript = async () => {
    try {
      if (!selectedReport?.transcript) {
        toast.error("Transcript not available");
        return;
      }

      toast.info("Downloading transcript...");

      const content = selectedReport.transcript;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `transcript-${selectedReport.sessionId}.txt`;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Transcript downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download transcript");
    } finally {
      setIsDownloading(false);
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
                selectedComparisonIds={comparisonReportIds}
                onSelectComparison={(ids) => setComparisonReportIds(ids)}
              />
            </div>
          )}

          {/* Comparison Summary Card (when comparisons are selected) */}
          {compareMode && comparisonReports.length > 0 && selectedReport && (
            <div className="animate-slide-in-up">
              <ComparisonSummaryCard
                currentSession={{
                  id: selectedReport.id,
                  date: selectedReport.sessionDate,
                  scenarioScores: selectedReport.scenarioScores,
                  dialogueScores: selectedReport.dialogueScores,
                }}
                comparisonSessions={comparisonReports.map(r => ({
                  id: r.id,
                  date: r.sessionDate,
                  isBaseline: (r as any).isBaseline || false,
                  scenarioScores: r.scenarioScores,
                  dialogueScores: r.dialogueScores,
                }))}
              />
            </div>
          )}

          {/* Score Evolution Chart (when compare mode is on) */}
          {compareMode && allSessionsForTimeline.length > 1 && (
            <div className="animate-slide-in-up">
              <SectionDivider title="Your Growth Journey" />
              <ScoreEvolutionChart
                sessions={allSessionsForTimeline}
                selectedSessionId={selectedReport.id}
                comparisonIds={comparisonReportIds}
                onSelectSession={(id) => setSelectedReportId(id)}
              />
            </div>
          )}

          {/* Hero Session Card */}
          <div className="animate-slide-in-up">
            <HeroSessionCard
              title="FOP Analysis Session Report"
              useSite={selectedReport.useSite}
              date={formatSessionDate(selectedReport.sessionDate)}
              participants={selectedReport.participants}
              activityType={selectedReport.sessionType}
              duration={selectedReport.totalTime ? Math.round(selectedReport.totalTime / 60) : undefined}
              topScenarioMarkers={getTopMarkers(selectedReport.scenarioScores)}
              topDialogueMarkers={getTopMarkers(selectedReport.dialogueScores)}
            />
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

          {/* Conclusions - Summary of Main Themes */}
          <div className="animate-slide-in-up">
            <ConclusionCard
              title="Key Takeaways"
              conclusions={selectedReport.conclusions}
            />
          </div>

          <SectionDivider title="FOP Analysis" />

          {/* Emergent Scenario Section */}
          <ImportantSectionWrapper
            title="Emergent Scenario"
            icon={Target}
            variant="scenario"
          >
            {/* Scenario Card */}
            <ScenarioCard
              title={selectedReport.scenarioContent.title}
              content={selectedReport.scenarioContent.content}
            />

            {/* Scenario Scores - Radar Chart with Multiple Comparison Overlays */}
            <ScoreRadarChart
              data={selectedReport.scenarioScores}
              title="Scenario Quality Scores"
              maxScore={4}
              color="#F97316"
              currentDate={selectedReport.sessionDate}
              comparisons={comparisonReports.map((r, index) => ({
                data: r.scenarioScores,
                date: r.sessionDate,
                isBaseline: (r as any).isBaseline || false,
              }))}
            />

            {/* Scenario Detailed Analysis */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-foreground mb-3">Detailed Analysis</h4>
              {selectedReport.scenarioAnalysis.map((item) => (
                <CollapsibleSection key={item.title} title={item.title} score={item.score}>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                </CollapsibleSection>
              ))}
            </div>
          </ImportantSectionWrapper>

          {/* Generative Dialogue Section */}
          <ImportantSectionWrapper
            title="Generative Dialogue"
            icon={MessageCircle}
            variant="dialogue"
          >
            {/* Dialogue Scores - Radar Chart with Multiple Comparison Overlays */}
            <ScoreRadarChart
              data={selectedReport.dialogueScores}
              title="Dialogue Quality Scores"
              maxScore={4}
              color="#0D9488"
              currentDate={selectedReport.sessionDate}
              comparisons={comparisonReports.map((r, index) => ({
                data: r.dialogueScores,
                date: r.sessionDate,
                isBaseline: (r as any).isBaseline || false,
              }))}
            />

            {/* Dialogue Detailed Analysis */}
            <div className="space-y-2">
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
          </ImportantSectionWrapper>

          <SectionDivider title="Key Insights" />

          {/* Final Summary */}
          <div className="animate-slide-in-up">
            <ConclusionCard
              title="Session Summary"
              conclusions={selectedReport.finalSummary}
              variant="summary"
            />
          </div>

          <SectionDivider title="Downloads" />

          {/* Downloads Section */}
          <div className="animate-slide-in-up">
            <div className="bg-card rounded-xl border border-border p-4 space-y-3">
              <p className="text-xs text-muted-foreground mb-2">Save session materials for offline access</p>
              
              {selectedReport.audioFileUrl && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={handleDownloadAudio}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="h-4 w-4 mr-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Music className="h-4 w-4 mr-3" />
                      Download Session Audio
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={handleDownloadTranscript}
                disabled={isDownloading}
              >
                <FileText className="h-4 w-4 mr-3" />
                Download Transcript
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => toast.info("PDF report download coming soon")}
              >
                <FileDown className="h-4 w-4 mr-3" />
                Download PDF Report
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Reports;