interface TopMarker {
  label: string;
  score: number;
}

interface ScoreBadgesProps {
  topScenarioMarkers: TopMarker[];
  topDialogueMarkers: TopMarker[];
  hasData: boolean;
}

export const ScoreBadges = ({ topScenarioMarkers, topDialogueMarkers, hasData }: ScoreBadgesProps) => {
  if (!hasData) {
    return (
      <div className="flex gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm">
          <span>No sessions yet</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 animate-slide-in-up">
      {/* Scenario Top Markers - Left Column */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-primary">Top Emergent Scenario markers</span>
        <div className="flex flex-col gap-1.5">
          {topScenarioMarkers.slice(0, 2).map((marker, i) => (
            <div 
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit"
            >
              <span className="text-xs text-primary/80">{marker.label}</span>
              <span className="text-xs font-bold text-foreground">{Math.round(marker.score)}/4</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dialogue Top Markers */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-secondary">Top Generative Dialogue markers</span>
        <div className="flex flex-col gap-1.5">
          {topDialogueMarkers.slice(0, 2).map((marker, i) => (
            <div 
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 border border-secondary/20 w-fit"
            >
              <span className="text-xs text-secondary/80">{marker.label}</span>
              <span className="text-xs font-bold text-foreground">{Math.round(marker.score)}/4</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
