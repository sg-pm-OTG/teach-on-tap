import { Mic, GraduationCap, Video, ClipboardList, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MilestoneCard from "./MilestoneCard";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { Skeleton } from "@/components/ui/skeleton";

const JourneyMilestones = () => {
  const navigate = useNavigate();
  const { progress, isLoading } = useJourneyProgress();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Your Journey
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const milestones = [
    {
      id: "baseline",
      label: "Baseline Recording",
      icon: Mic,
      status: progress.baseline,
      description: "Record a session of your usual practice.",
      actionLabel: progress.baseline === "current" ? "Record Baseline" : undefined,
      onAction: progress.baseline === "current" 
        ? () => navigate("/record", { state: { presetBaseline: true } })
        : undefined,
    },
    {
      id: "masterclass",
      label: "Future Orientation Masterclass (FOM)",
      icon: GraduationCap,
      status: progress.masterclass,
      description: "Attend an in-person workshop where you will develop practical strategies to apply future-oriented pedagogies in your practice.",
      date: progress.masterclassDate || undefined,
      location: progress.masterclassLocation || undefined,
    },
    {
      id: "sessions",
      label: "Session Recordings",
      icon: Video,
      status: progress.sessions,
      description: "Record sessions of your evolving practice in future-oriented pedagogies.",
      progress: `${progress.sessionCount}/3`,
    },
    {
      id: "learningHuddle",
      label: "Learning Huddle",
      icon: Users,
      status: progress.learningHuddle,
      description: "Attend an in-person, collective sensemaking session with peers to share insights from your growing experience with future-oriented pedagogies.",
      date: progress.learningHuddleDate || undefined,
      location: progress.learningHuddleLocation || undefined,
    },
    {
      id: "postSurvey",
      label: "Post-Program Questionnaire",
      icon: ClipboardList,
      status: progress.postSurvey,
      description: "Complete your post-program questionnaire",
      actionLabel: progress.postSurvey === "current" ? "Start Questionnaire" : undefined,
      onAction: progress.postSurvey === "current" 
        ? () => navigate("/post-survey")
        : undefined,
    },
    {
      id: "finalReport",
      label: "Final Report",
      icon: FileText,
      status: progress.finalReport,
      description: "Receive your comprehensive progress report",
      actionLabel: progress.finalReportStatus === "generated" ? "View Report" : undefined,
      onAction: progress.finalReportStatus === "generated" 
        ? () => navigate("/final-report")
        : undefined,
      statusLabel: progress.finalReport === "current" && progress.finalReportStatus !== "generated"
        ? "Generating..."
        : undefined,
    },
    {
      id: "launchHuddle",
      label: "Launch Huddle",
      icon: Users,
      status: progress.launchHuddle,
      description: "You are now ready to take future-oriented pedagogies further and beyond! Join an in-person, reflective and collaborative session with peers to explore continuing support and growth in our practice of future-oriented pedagogies.",
      date: progress.launchHuddleDate || undefined,
      location: progress.launchHuddleLocation || undefined,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Your Journey
      </h3>
      <div className="space-y-2">
        {milestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            label={milestone.label}
            icon={milestone.icon}
            status={milestone.status}
            description={milestone.description}
            date={milestone.date}
            location={milestone.location}
            progress={milestone.progress}
            statusLabel={milestone.statusLabel}
            actionLabel={milestone.actionLabel}
            onAction={milestone.onAction}
          />
        ))}
      </div>
    </div>
  );
};

export default JourneyMilestones;
