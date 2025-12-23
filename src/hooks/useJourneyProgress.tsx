import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";

export type MilestoneStatus = "complete" | "current" | "locked";

export interface JourneyProgress {
  baseline: MilestoneStatus;
  masterclass: MilestoneStatus;
  session1: MilestoneStatus;
  learningHuddle: MilestoneStatus;
  sessions23: MilestoneStatus;
  postSurvey: MilestoneStatus;
  finalReport: MilestoneStatus;
  launchHuddle: MilestoneStatus;
  sessionCount: number;
  finalReportStatus: string;
  // Per-user event data
  masterclassDate: string | null;
  masterclassLocation: string | null;
  learningHuddleDate: string | null;
  learningHuddleLocation: string | null;
  launchHuddleDate: string | null;
  launchHuddleLocation: string | null;
}

export const useJourneyProgress = () => {
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile-journey", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("baseline_completed, masterclass_attended, post_survey_completed, final_report_status, launch_huddle_attended, masterclass_datetime, masterclass_location, launch_huddle_datetime, launch_huddle_location, learning_huddle_attended, learning_huddle_datetime, learning_huddle_location")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: sessionCount = 0, isLoading: sessionsLoading } = useQuery({
    queryKey: ["session-count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_baseline", false)
        .eq("status", "completed");
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  const formatEventDate = (datetime: string | null): string | null => {
    if (!datetime) return null;
    try {
      return format(new Date(datetime), "MMMM d, yyyy, h:mm a");
    } catch {
      return null;
    }
  };

  const getMilestoneStatus = (): JourneyProgress => {
    if (!profile) {
      return {
        baseline: "current",
        masterclass: "locked",
        session1: "locked",
        learningHuddle: "locked",
        sessions23: "locked",
        postSurvey: "locked",
        finalReport: "locked",
        launchHuddle: "locked",
        sessionCount: 0,
        finalReportStatus: "not_started",
        masterclassDate: null,
        masterclassLocation: null,
        learningHuddleDate: null,
        learningHuddleLocation: null,
        launchHuddleDate: null,
        launchHuddleLocation: null,
      };
    }

    const { 
      baseline_completed, 
      masterclass_attended, 
      post_survey_completed, 
      final_report_status, 
      launch_huddle_attended,
      masterclass_datetime,
      masterclass_location,
      launch_huddle_datetime,
      launch_huddle_location,
      learning_huddle_attended,
      learning_huddle_datetime,
      learning_huddle_location,
    } = profile;

    // Determine each milestone status based on progression
    const baseline: MilestoneStatus = baseline_completed ? "complete" : "current";
    
    const masterclass: MilestoneStatus = !baseline_completed 
      ? "locked" 
      : masterclass_attended 
        ? "complete" 
        : "current";
    
    // Session 1: unlocks after masterclass, complete when sessionCount >= 1
    const session1: MilestoneStatus = !masterclass_attended 
      ? "locked" 
      : sessionCount >= 1 
        ? "complete" 
        : "current";
    
    // Learning Huddle: unlocks after Session 1 complete, REQUIRED gate
    const learningHuddle: MilestoneStatus = sessionCount < 1
      ? "locked"
      : learning_huddle_attended
        ? "complete"
        : "current";
    
    // Sessions 2-3: BLOCKED until Learning Huddle attended
    const sessions23: MilestoneStatus = !learning_huddle_attended
      ? "locked"
      : sessionCount >= 3 
        ? "complete" 
        : "current";
    
    // Post Survey: requires all 3 sessions AND learning huddle attended
    const postSurvey: MilestoneStatus = (sessionCount < 3 || !learning_huddle_attended)
      ? "locked" 
      : post_survey_completed 
        ? "complete" 
        : "current";
    
    const finalReport: MilestoneStatus = !post_survey_completed 
      ? "locked" 
      : final_report_status === "generated" 
        ? "complete" 
        : "current";
    
    const launchHuddle: MilestoneStatus = final_report_status !== "generated" 
      ? "locked" 
      : launch_huddle_attended 
        ? "complete" 
        : "current";

    return {
      baseline,
      masterclass,
      session1,
      learningHuddle,
      sessions23,
      postSurvey,
      finalReport,
      launchHuddle,
      sessionCount,
      finalReportStatus: final_report_status,
      masterclassDate: formatEventDate(masterclass_datetime),
      masterclassLocation: masterclass_location,
      learningHuddleDate: formatEventDate(learning_huddle_datetime),
      learningHuddleLocation: learning_huddle_location,
      launchHuddleDate: formatEventDate(launch_huddle_datetime),
      launchHuddleLocation: launch_huddle_location,
    };
  };

  return {
    progress: getMilestoneStatus(),
    isLoading: profileLoading || sessionsLoading,
  };
};
