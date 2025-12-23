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
      id: "session1",
      label: "Session 1 Recording",
      icon: Video,
      status: progress.session1,
      description: "Record your first session applying future-oriented pedagogies.",
      progress: `${Math.min(progress.sessionCount, 1)}/1`,
      actionLabel: progress.session1 === "current" ? "Record Session" : undefined,
      onAction: progress.session1 === "current" 
        ? () => navigate("/record")
        : undefined,
    },
    {
      id: "learningHuddle",
      label: "Learning Huddle",
      icon: Users,
      status: progress.learningHuddle,
      description: "Attend the Learning Huddle before continuing with Sessions 2-3. This is an in-person, collective sensemaking session with peers to share insights from your growing experience with future-oriented pedagogies.",
      date: progress.learningHuddleDate || undefined,
      location: progress.learningHuddleLocation || undefined,
    },
    {
      id: "sessions23",
      label: "Sessions 2-3 Recordings",
      icon: Video,
      status: progress.sessions23,
      description: "Continue recording sessions applying future-oriented pedagogies.",
      progress: `${Math.max(0, progress.sessionCount - 1)}/2`,
      actionLabel: progress.sessions23 === "current" ? "Record Session" : undefined,
      onAction: progress.sessions23 === "current" 
        ? () => navigate("/record")
        : undefined,
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
