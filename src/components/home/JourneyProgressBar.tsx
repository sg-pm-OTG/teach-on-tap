import { ChevronRight } from "lucide-react";
import { useJourneyProgress, MilestoneStatus } from "@/hooks/useJourneyProgress";
import { Skeleton } from "@/components/ui/skeleton";

interface JourneyProgressBarProps {
  onViewClick: () => void;
}

const JourneyProgressBar = ({ onViewClick }: JourneyProgressBarProps) => {
  const { progress, isLoading } = useJourneyProgress();

  if (isLoading) {
    return <Skeleton className="h-16 w-full rounded-xl" />;
  }

  const milestones: { id: string; label: string; status: MilestoneStatus }[] = [
    { id: "baseline", label: "Baseline", status: progress.baseline },
    { id: "masterclass", label: "Masterclass", status: progress.masterclass },
    { id: "session1", label: "Session 1", status: progress.session1 },
    { id: "learningHuddle", label: "Learning Huddle", status: progress.learningHuddle },
    { id: "sessions23", label: "Sessions 2-3", status: progress.sessions23 },
    { id: "postSurvey", label: "Questionnaire", status: progress.postSurvey },
    { id: "finalReport", label: "Final Report", status: progress.finalReport },
    { id: "launchHuddle", label: "Launch Huddle", status: progress.launchHuddle },
  ];

  const completedCount = milestones.filter((m) => m.status === "complete").length;
  const currentMilestone = milestones.find((m) => m.status === "current");

  return (
    <button
      onClick={onViewClick}
      className="w-full bg-card rounded-xl border-2 border-border p-4 text-left transition-all hover:border-primary/50 active:scale-[0.98]"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">Your Journey</span>
        <span className="text-xs font-medium text-muted-foreground">
          {completedCount}/8 Steps
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1 mb-2">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                milestone.status === "complete"
                  ? "bg-primary"
                  : milestone.status === "current"
                  ? "bg-primary/50 ring-2 ring-primary/30"
                  : "bg-muted"
              }`}
            />
            {index < milestones.length - 1 && (
              <div
                className={`w-4 h-0.5 ${
                  milestone.status === "complete" ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current step indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentMilestone && (
            <>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Next
              </span>
              <span className="text-sm font-medium text-foreground">
                {currentMilestone.label}
                {currentMilestone.id === "session1" && ` (${Math.min(progress.sessionCount, 1)}/1)`}
                {currentMilestone.id === "sessions23" && ` (${Math.max(0, progress.sessionCount - 1)}/2)`}
              </span>
            </>
          )}
          {!currentMilestone && (
            <span className="text-sm font-medium text-foreground">Journey Complete!</span>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
};

export default JourneyProgressBar;
