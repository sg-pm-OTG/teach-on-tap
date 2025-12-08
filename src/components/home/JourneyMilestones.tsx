import { Mic, GraduationCap, Video, ClipboardList, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MilestoneCard from "./MilestoneCard";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { eventData } from "@/data/eventData";
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
      description: "Record your first teaching session before the masterclass",
      actionLabel: progress.baseline === "current" ? "Record Baseline" : undefined,
      onAction: progress.baseline === "current" 
        ? () => navigate("/record", { state: { presetBaseline: true } })
        : undefined,
    },
    {
      id: "masterclass",
      label: "Master Class",
      icon: GraduationCap,
      status: progress.masterclass,
      description: "Attend the in-person training session",
      date: eventData.masterclass.date,
      location: eventData.masterclass.location,
    },
    {
      id: "sessions",
      label: "Session Recordings",
      icon: Video,
      status: progress.sessions,
      description: "Record teaching sessions and attend Learning Huddles",
      progress: `${progress.sessionCount}/3`,
      date: progress.sessions === "current" ? eventData.learningHuddle.date : undefined,
      location: progress.sessions === "current" ? eventData.learningHuddle.location : undefined,
    },
    {
      id: "postSurvey",
      label: "Post Survey",
      icon: ClipboardList,
      status: progress.postSurvey,
      description: "Complete your post-program assessment",
    },
    {
      id: "finalReport",
      label: "Final Report",
      icon: FileText,
      status: progress.finalReport,
      description: "Receive your comprehensive progress report",
      statusLabel: progress.finalReport === "current" 
        ? progress.finalReportStatus === "pending" 
          ? "Pending Generation" 
          : "Awaiting generation"
        : undefined,
    },
    {
      id: "launchHuddle",
      label: "Launch Huddle",
      icon: Users,
      status: progress.launchHuddle,
      description: "Celebrate your completion at the final session",
      date: eventData.launchHuddle.date,
      location: eventData.launchHuddle.location,
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
