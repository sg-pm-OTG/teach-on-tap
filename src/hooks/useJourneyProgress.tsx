import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export type MilestoneStatus = "complete" | "current" | "locked";

export interface JourneyProgress {
  baseline: MilestoneStatus;
  masterclass: MilestoneStatus;
  sessions: MilestoneStatus;
  postSurvey: MilestoneStatus;
  finalReport: MilestoneStatus;
  launchHuddle: MilestoneStatus;
  sessionCount: number;
  finalReportStatus: string;
}

export const useJourneyProgress = () => {
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile-journey", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("baseline_completed, masterclass_attended, post_survey_completed, final_report_status, launch_huddle_attended")
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

  const getMilestoneStatus = (): JourneyProgress => {
    if (!profile) {
      return {
        baseline: "current",
        masterclass: "locked",
        sessions: "locked",
        postSurvey: "locked",
        finalReport: "locked",
        launchHuddle: "locked",
        sessionCount: 0,
        finalReportStatus: "not_started",
      };
    }

    const { baseline_completed, masterclass_attended, post_survey_completed, final_report_status, launch_huddle_attended } = profile;

    // Determine each milestone status based on progression
    const baseline: MilestoneStatus = baseline_completed ? "complete" : "current";
    
    const masterclass: MilestoneStatus = !baseline_completed 
      ? "locked" 
      : masterclass_attended 
        ? "complete" 
        : "current";
    
    const sessions: MilestoneStatus = !masterclass_attended 
      ? "locked" 
      : sessionCount >= 3 
        ? "complete" 
        : "current";
    
    const postSurvey: MilestoneStatus = sessionCount < 3 
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
      sessions,
      postSurvey,
      finalReport,
      launchHuddle,
      sessionCount,
      finalReportStatus: final_report_status,
    };
  };

  return {
    progress: getMilestoneStatus(),
    isLoading: profileLoading || sessionsLoading,
  };
};
