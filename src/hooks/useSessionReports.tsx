import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TopMarker {
  label: string;
  score: number;
}

interface SessionInsights {
  topScenarioMarkers: TopMarker[];
  topDialogueMarkers: TopMarker[];
  strengths: { label: string; score: number }[];
  focusAreas: { label: string; score: number }[];
  facilitatorTalkTimeMinutes: number;
  latestSessionDate: string;
  latestSessionTitle: string;
  sessionCount: number;
  finalReportGenerated: boolean;
}

interface ScoreItem {
  label: string;
  score: number;
}

interface TalkTimeItem {
  speaker: string;
  seconds: number;
}

export const useSessionReports = () => {
  // Only count non-baseline sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions-non-baseline"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .eq("is_baseline", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Only get latest report from non-baseline sessions
  const { data: latestReport, isLoading: reportLoading } = useQuery({
    queryKey: ["latestReport-non-baseline"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("session_reports")
        .select("*, sessions!inner(*)")
        .eq("user_id", user.id)
        .eq("sessions.is_baseline", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const sessionCount = sessions?.length || 0;
  const hasReports = sessionCount > 0 && !!latestReport;

  const insights: SessionInsights | null = (() => {
    if (!hasReports || !latestReport) return null;

    const scenarioScores = latestReport.scenario_scores as unknown as ScoreItem[];
    const dialogueScores = latestReport.dialogue_scores as unknown as ScoreItem[];
    const talkTimeData = latestReport.talk_time_data as unknown as TalkTimeItem[];
    const session = latestReport.sessions as { session_date: string; use_site: string } | null;

    // Get top 2 scenario markers by score
    const topScenarioMarkers = [...scenarioScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(s => ({ label: s.label, score: s.score }));

    // Get top 2 dialogue markers by score
    const topDialogueMarkers = [...dialogueScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(s => ({ label: s.label, score: s.score }));

    const allScores = [
      ...scenarioScores.map((s) => ({ ...s, source: "scenario" })),
      ...dialogueScores.map((s) => ({ ...s, source: "dialogue" })),
    ];

    const strengths = allScores
      .filter((s) => s.score >= 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => ({ label: s.label, score: s.score }));

    const focusAreas = allScores
      .filter((s) => s.score <= 2)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((s) => ({ label: s.label, score: s.score }));

    const facilitator = talkTimeData.find((t) => t.speaker === "Facilitator");
    const facilitatorTalkTimeMinutes = Math.round((facilitator?.seconds ?? 0) / 60);

    // TODO: Track final report generation in database
    const finalReportGenerated = false;

    return {
      topScenarioMarkers,
      topDialogueMarkers,
      strengths,
      focusAreas,
      facilitatorTalkTimeMinutes,
      latestSessionDate: session?.session_date || "",
      latestSessionTitle: session?.use_site || "Session",
      sessionCount,
      finalReportGenerated,
    };
  })();

  return { 
    hasReports, 
    insights, 
    sessionCount,
    isLoading: sessionsLoading || reportLoading 
  };
};
