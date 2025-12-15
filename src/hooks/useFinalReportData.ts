import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useMemo } from "react";

interface SessionJourneyItem {
  sessionNumber: number;
  course: string;
  date: string;
  format: string;
  durationMinutes: number;
  isBaseline: boolean;
}

interface ScoreDataPoint {
  session: number;
  sessionLabel: string;
  markers: { name: string; score: number }[];
}

interface TalkTimeData {
  speaker: string;
  percentage: number;
  seconds: number;
  color: string;
}

interface SurveyComparison {
  categoryCode: string;
  categoryName: string;
  preSurveyScore: number;
  postSurveyScore: number;
  maxScore: number;
  nationalAverage: number;
  change: number;
  interpretation: string;
}

interface DifficultyProgression {
  session: number;
  sessionLabel: string;
  practiceDifficulty: string | null;
  designDifficulty: string | null;
}

export const useFinalReportData = () => {
  const { user } = useAuth();

  // Fetch all sessions (including baseline)
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["final-report-sessions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "completed")
        .order("session_date", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch all session reports
  const { data: sessionReports, isLoading: reportsLoading } = useQuery({
    queryKey: ["final-report-reports", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_reports")
        .select("*, sessions!inner(session_date, use_site, is_baseline, session_type)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch session surveys for difficulty data
  const { data: sessionSurveys, isLoading: surveysLoading } = useQuery({
    queryKey: ["final-report-surveys", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_surveys")
        .select("*, sessions!inner(session_date, is_baseline)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch pre-survey results
  const { data: preSurveyResults, isLoading: preLoading } = useQuery({
    queryKey: ["final-report-pre-survey", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pre_survey_results")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch post-survey results
  const { data: postSurveyResults, isLoading: postLoading } = useQuery({
    queryKey: ["final-report-post-survey", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_survey_results")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Process journey timeline data
  const journeyTimeline = useMemo<SessionJourneyItem[]>(() => {
    if (!sessions) return [];

    let regularSessionNumber = 0;
    return sessions.map((session) => {
      if (!session.is_baseline) regularSessionNumber++;
      
      return {
        sessionNumber: session.is_baseline ? 0 : regularSessionNumber,
        course: session.use_site || "Session",
        date: session.session_date,
        format: session.session_type === "Online Lesson" ? "Virtual" : "In-person",
        durationMinutes: 45, // Default, could be calculated from audio if available
        isBaseline: session.is_baseline,
      };
    });
  }, [sessions]);

  // Process scenario scores across sessions
  const scenarioScoreProgression = useMemo<ScoreDataPoint[]>(() => {
    if (!sessionReports) return [];

    return sessionReports
      .filter((report: any) => !report.sessions?.is_baseline)
      .map((report: any, index: number) => {
        const scores = report.scenario_scores as any[];
        return {
          session: index + 1,
          sessionLabel: `Session ${index + 1}`,
          markers: scores?.map((s: any) => ({
            name: s.label || s.name,
            score: s.score ?? s.value ?? 0,
          })) || [],
        };
      });
  }, [sessionReports]);

  // Process dialogue scores across sessions
  const dialogueScoreProgression = useMemo<ScoreDataPoint[]>(() => {
    if (!sessionReports) return [];

    return sessionReports
      .filter((report: any) => !report.sessions?.is_baseline)
      .map((report: any, index: number) => {
        const scores = report.dialogue_scores as any[];
        return {
          session: index + 1,
          sessionLabel: `Session ${index + 1}`,
          markers: scores?.map((s: any) => ({
            name: s.label || s.name,
            score: s.score ?? s.value ?? 0,
          })) || [],
        };
      });
  }, [sessionReports]);

  // Get talk time data for each session
  const talkTimeBySession = useMemo(() => {
    if (!sessionReports) return [];

    return sessionReports
      .filter((report: any) => !report.sessions?.is_baseline)
      .map((report: any, index: number) => ({
        session: index + 1,
        sessionLabel: `Session ${index + 1}`,
        data: (report.talk_time_data as TalkTimeData[]) || [],
      }));
  }, [sessionReports]);

  // Get speaker interactions for latest session
  const latestSpeakerInteractions = useMemo(() => {
    if (!sessionReports || sessionReports.length === 0) return null;

    const nonBaselineReports = sessionReports.filter(
      (r: any) => !r.sessions?.is_baseline
    );
    const latest = nonBaselineReports[nonBaselineReports.length - 1];
    
    if (!latest) return null;

    return {
      interactions: latest.speaker_interactions as number[][],
      speakers: (latest.speakers as any[])?.map((s: any) => s.name || s.label) || [],
    };
  }, [sessionReports]);

  // Process survey comparisons (Learning Beliefs only for post-survey)
  const beliefComparisons = useMemo<SurveyComparison[]>(() => {
    if (!preSurveyResults || !postSurveyResults) return [];

    const learningBeliefCodes = ["A1", "A2", "A3"];
    
    return learningBeliefCodes.map((code) => {
      const pre = preSurveyResults.find((r) => r.category_code === code);
      const post = postSurveyResults.find((r) => r.category_code === code);

      if (!pre) return null;

      const preScore = Number(pre.user_score);
      const postScore = post ? Number(post.user_score) : preScore;
      const change = postScore - preScore;

      let interpretation = "No Change";
      if (change > 0.5) interpretation = "Healthy Shift";
      else if (change < -0.5) interpretation = "Slight Decline";
      else if (postScore > 4) interpretation = "Still Dominant";

      return {
        categoryCode: code,
        categoryName: pre.category_name,
        preSurveyScore: preScore,
        postSurveyScore: postScore,
        maxScore: pre.max_score,
        nationalAverage: Number(pre.national_average),
        change,
        interpretation,
      };
    }).filter(Boolean) as SurveyComparison[];
  }, [preSurveyResults, postSurveyResults]);

  // Process learning orientation data (B1, B2, B3)
  const orientationComparisons = useMemo<SurveyComparison[]>(() => {
    if (!preSurveyResults) return [];

    const orientationCodes = ["B1", "B2", "B3"];
    
    return orientationCodes.map((code) => {
      const result = preSurveyResults.find((r) => r.category_code === code);
      if (!result) return null;

      return {
        categoryCode: code,
        categoryName: result.category_name,
        preSurveyScore: Number(result.user_score),
        postSurveyScore: Number(result.user_score), // No post for B categories
        maxScore: result.max_score,
        nationalAverage: Number(result.national_average),
        change: 0,
        interpretation: "",
      };
    }).filter(Boolean) as SurveyComparison[];
  }, [preSurveyResults]);

  // Process difficulty progression
  const difficultyProgression = useMemo<DifficultyProgression[]>(() => {
    if (!sessionSurveys) return [];

    return sessionSurveys
      .filter((survey: any) => !survey.sessions?.is_baseline)
      .map((survey: any, index: number) => ({
        session: index + 1,
        sessionLabel: `Session ${index + 1}`,
        practiceDifficulty: survey.practice_difficulty,
        designDifficulty: survey.design_difficulty,
      }));
  }, [sessionSurveys]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const regularSessions = sessions?.filter((s) => !s.is_baseline) || [];
    const totalSessions = regularSessions.length;

    // Calculate average scores from latest report
    const nonBaselineReports = sessionReports?.filter(
      (r: any) => !r.sessions?.is_baseline
    ) || [];
    const latestReport = nonBaselineReports[nonBaselineReports.length - 1];

    let avgScenario = 0;
    let avgDialogue = 0;

    if (latestReport) {
      const scenarioScores = latestReport.scenario_scores as any[];
      const dialogueScores = latestReport.dialogue_scores as any[];

      if (scenarioScores?.length) {
        avgScenario = scenarioScores.reduce((sum: number, s: any) => 
          sum + (s.score ?? s.value ?? 0), 0) / scenarioScores.length;
      }
      if (dialogueScores?.length) {
        avgDialogue = dialogueScores.reduce((sum: number, s: any) => 
          sum + (s.score ?? s.value ?? 0), 0) / dialogueScores.length;
      }
    }

    return {
      totalSessions,
      averageScenarioScore: avgScenario,
      averageDialogueScore: avgDialogue,
      hasBaseline: sessions?.some((s) => s.is_baseline) || false,
    };
  }, [sessions, sessionReports]);

  const isLoading = sessionsLoading || reportsLoading || surveysLoading || preLoading || postLoading;

  return {
    isLoading,
    journeyTimeline,
    scenarioScoreProgression,
    dialogueScoreProgression,
    talkTimeBySession,
    latestSpeakerInteractions,
    beliefComparisons,
    orientationComparisons,
    difficultyProgression,
    summaryStats,
    sessionReports,
  };
};
