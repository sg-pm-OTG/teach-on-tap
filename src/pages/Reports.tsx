import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { HeroSessionCard } from "@/components/report/HeroSessionCard";
import { SpeakerCard } from "@/components/report/SpeakerCard";
import { ThemeCard } from "@/components/report/ThemeCard";
import { ConclusionCard } from "@/components/report/ConclusionCard";
import { TalkTimeBar } from "@/components/report/TalkTimeBar";
import { TalkTimePieChart } from "@/components/report/TalkTimePieChart";
import { InteractionGrid } from "@/components/report/InteractionGrid";
import { ScenarioCard } from "@/components/report/ScenarioCard";
import { ScoreRadarChart } from "@/components/report/ScoreRadarChart";
import { CollapsibleSection } from "@/components/report/CollapsibleSection";
import { OpportunityCallout } from "@/components/report/OpportunityCallout";
import { SectionDivider } from "@/components/report/SectionDivider";
import {
  sessionDetails,
  speakers,
  themes,
  conclusions,
  talkTimeData,
  speakerInteractions,
  speakerLabels,
  scenarioContent,
  scenarioScores,
  scenarioAnalysis,
  dialogueScores,
  dialogueAnalysis,
  finalSummary,
} from "@/data/reportData";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Reports = () => {
  const [showAllSpeakers, setShowAllSpeakers] = useState(false);
  const displayedSpeakers = showAllSpeakers ? speakers : speakers.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="container max-w-md mx-auto px-4 py-6 space-y-4">
          {/* Hero Session Card */}
          <div className="animate-slide-in-up">
            <HeroSessionCard
              title={sessionDetails.title}
              useSite={sessionDetails.useSite}
              date={sessionDetails.date}
              participants={sessionDetails.participants}
              activityType={sessionDetails.activityType}
            />
          </div>

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
            {speakers.length > 3 && (
              <button
                onClick={() => setShowAllSpeakers(!showAllSpeakers)}
                className="w-full py-2 text-sm text-primary font-medium flex items-center justify-center gap-1 hover:bg-muted/50 rounded-lg transition-colors"
              >
                {showAllSpeakers ? "Show Less" : `Show All ${speakers.length} Speakers`}
                <ChevronDown className={cn("h-4 w-4 transition-transform", showAllSpeakers && "rotate-180")} />
              </button>
            )}
          </div>

          <SectionDivider title="Main Themes" />

          {/* Main Discussion Themes */}
          <div className="space-y-3 animate-slide-in-up">
            {themes.map((theme, index) => (
              <ThemeCard
                key={index}
                title={theme.title}
                icon={theme.icon}
                bullets={theme.bullets}
                accentColor={theme.accentColor}
              />
            ))}
          </div>

          <SectionDivider title="Conclusions" />

          {/* Overall Conclusions */}
          <div className="animate-slide-in-up">
            <ConclusionCard title="Overall Conclusions" conclusions={conclusions} />
          </div>

          <SectionDivider title="Structural Analysis" />

          {/* Talk Time Distribution - Pie Chart */}
          <div className="animate-slide-in-up">
            <TalkTimePieChart data={talkTimeData} />
          </div>

          {/* Talk Time Bars */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-3 animate-slide-in-up">
            <h4 className="font-medium text-sm text-foreground mb-3">Speaker Talk Time Details</h4>
            {talkTimeData.map((item) => (
              <TalkTimeBar
                key={item.speaker}
                speaker={item.speaker}
                percentage={item.percentage}
                seconds={item.seconds}
                color={item.color}
              />
            ))}
          </div>

          {/* Speaker Interaction Heat Map */}
          <div className="animate-slide-in-up">
            <InteractionGrid
              interactions={speakerInteractions}
              labels={speakerLabels}
            />
          </div>

          <SectionDivider title="Emergent Scenario" />

          {/* Scenario Card */}
          <div className="animate-slide-in-up">
            <ScenarioCard
              title={scenarioContent.title}
              content={scenarioContent.content}
            />
          </div>

          {/* Scenario Scores - Radar Chart */}
          <div className="animate-slide-in-up">
            <ScoreRadarChart
              data={scenarioScores}
              title="Scenario Quality Scores"
              maxScore={4}
              color="#F97316"
            />
          </div>

          {/* Scenario Detailed Analysis */}
          <div className="space-y-2 animate-slide-in-up">
            <h4 className="font-medium text-sm text-foreground mb-3">Detailed Analysis</h4>
            {scenarioAnalysis.map((item) => (
              <CollapsibleSection key={item.title} title={item.title} score={item.score}>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
              </CollapsibleSection>
            ))}
          </div>

          <SectionDivider title="Generative Dialogue" />

          {/* Dialogue Scores - Radar Chart */}
          <div className="animate-slide-in-up">
            <ScoreRadarChart
              data={dialogueScores}
              title="Dialogue Quality Scores"
              maxScore={4}
              color="#0D9488"
            />
          </div>

          {/* Dialogue Detailed Analysis */}
          <div className="space-y-2 animate-slide-in-up">
            <h4 className="font-medium text-sm text-foreground mb-3">Detailed Analysis</h4>
            {dialogueAnalysis.map((item) => (
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
              conclusions={finalSummary}
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