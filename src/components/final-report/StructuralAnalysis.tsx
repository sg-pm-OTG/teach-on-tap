import { TalkTimePieChart } from "@/components/report/TalkTimePieChart";
import { InteractionChordDiagram } from "@/components/report/InteractionChordDiagram";

interface TalkTimeSession {
  session: number;
  sessionLabel: string;
  data: {
    speaker: string;
    percentage: number;
    seconds: number;
    color: string;
  }[];
}

interface SpeakerInteractions {
  interactions: number[][];
  speakers: string[];
}

interface StructuralAnalysisProps {
  talkTimeBySession: TalkTimeSession[];
  latestSpeakerInteractions: SpeakerInteractions | null;
}

export const StructuralAnalysis = ({
  talkTimeBySession,
  latestSpeakerInteractions,
}: StructuralAnalysisProps) => {
  const latestSession = talkTimeBySession[talkTimeBySession.length - 1];

  // Calculate facilitator talk time trend
  const facilitatorTrend = talkTimeBySession.map((session) => {
    const facilitator = session.data.find(
      (d) => d.speaker === "Facilitator" || d.speaker === "Teacher"
    );
    return {
      session: session.sessionLabel,
      percentage: facilitator?.percentage || 0,
    };
  });

  const firstFacilitatorPct = facilitatorTrend[0]?.percentage || 0;
  const lastFacilitatorPct = facilitatorTrend[facilitatorTrend.length - 1]?.percentage || 0;
  const trendChange = lastFacilitatorPct - firstFacilitatorPct;

  return (
    <div className="space-y-6">
      {/* Narrative */}
      <div className="bg-muted/50 rounded-xl p-4">
        <h4 className="font-medium text-foreground mb-2">Understanding Your Facilitation Style</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The structural analysis reveals how talk time is distributed in your sessions 
          and how participants interact with each other. 
          {trendChange < -5 && (
            <span className="text-primary font-medium">
              {" "}Your facilitation has shifted toward more participant-centered dialogue, 
              with a {Math.abs(trendChange).toFixed(0)}% decrease in facilitator talk time.
            </span>
          )}
          {trendChange > 5 && (
            <span>
              {" "}There's been an increase in facilitator guidance, which may indicate 
              more complex topics being covered.
            </span>
          )}
        </p>
      </div>

      {/* Talk Time Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Talk Time Distribution</h4>
        
        {/* Latest session - large chart */}
        {latestSession && latestSession.data.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground mb-2 text-center">
              {latestSession.sessionLabel} (Latest)
            </p>
            <TalkTimePieChart data={latestSession.data} />
          </div>
        )}

        {/* Previous sessions - small charts */}
        {talkTimeBySession.length > 1 && (
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-3" style={{ minWidth: "max-content" }}>
              {talkTimeBySession.slice(0, -1).map((session) => (
                <div 
                  key={session.session}
                  className="flex-shrink-0 w-48 bg-muted/30 rounded-xl p-3"
                >
                  <p className="text-xs text-muted-foreground mb-2 text-center">
                    {session.sessionLabel}
                  </p>
                  {session.data.length > 0 ? (
                    <div className="h-32">
                      <TalkTimePieChart data={session.data} />
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center text-xs text-muted-foreground">
                      No data
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Speaker Interactions */}
      {latestSpeakerInteractions && 
       latestSpeakerInteractions.interactions?.length > 0 && 
       latestSpeakerInteractions.speakers?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Speaker Interaction Flow</h4>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground mb-3 text-center">
              Latest Session Interaction Patterns
            </p>
            <InteractionChordDiagram
              interactions={latestSpeakerInteractions.interactions}
              labels={latestSpeakerInteractions.speakers}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Tap on a speaker to highlight their interactions
          </p>
        </div>
      )}

      {/* Facilitator trend summary */}
      {facilitatorTrend.length > 1 && (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Facilitation Trend</h4>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{firstFacilitatorPct.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">First Session</p>
            </div>
            <div className="flex-1 mx-4 h-1 bg-muted rounded-full relative">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{ width: `${Math.abs(trendChange)}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-secondary">{lastFacilitatorPct.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Latest Session</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
