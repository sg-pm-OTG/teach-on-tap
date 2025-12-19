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

  const truncateLabel = (label: string, maxLength: number = 12) => {
    return label?.length > maxLength ? label.substring(0, maxLength) + "…" : label;
  };

  return (
    <div className="space-y-2 animate-slide-in-up">
      {/* Scenario Top Markers */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-primary w-16">Scenario</span>
        <div className="flex flex-wrap gap-1.5">
          {topScenarioMarkers.slice(0, 2).map((marker, i) => (
            <div 
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="text-xs text-primary/80">{truncateLabel(marker.label)}</span>
              <span className="text-xs font-bold text-foreground">{Math.round(marker.score)}/4</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dialogue Top Markers */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-secondary w-16">Dialogue</span>
        <div className="flex flex-wrap gap-1.5">
          {topDialogueMarkers.slice(0, 2).map((marker, i) => (
            <div 
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 border border-secondary/20"
            >
              <span className="text-xs text-secondary/80">{truncateLabel(marker.label)}</span>
              <span className="text-xs font-bold text-foreground">{Math.round(marker.score)}/4</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
