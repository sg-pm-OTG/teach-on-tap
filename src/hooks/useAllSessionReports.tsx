import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ScoreItem {
  label: string;
  score: number;
}

interface TalkTimeItem {
  speaker: string;
  percentage: number;
  seconds: number;
  color: string;
}

interface Speaker {
  id: string;
  description: string;
}

interface Theme {
  title: string;
  icon: string;
  accentColor: string;
  bullets: string[];
}

interface AnalysisItem {
  title: string;
  score: number;
  content: string;
  opportunity?: {
    speaker: string;
    quote: string;
    observation: string;
    opportunity: string;
  };
}

interface ScenarioContent {
  title: string;
  content: string[];
}

export interface SessionReport {
  id: string;
  sessionId: string;
  createdAt: string;
  sessionDate: string;
  useSite: string;
  sessionType: string;
  participants: number;
  speakers: Speaker[];
  themes: Theme[];
  conclusions: string[];
  talkTimeData: TalkTimeItem[];
  speakerInteractions: number[][];
  scenarioContent: ScenarioContent;
  scenarioScores: ScoreItem[];
  scenarioAnalysis: AnalysisItem[];
  dialogueScores: ScoreItem[];
  dialogueAnalysis: AnalysisItem[];
  finalSummary: string[];
  overallScore: number;
}

export const useAllSessionReports = () => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [comparisonReportId, setComparisonReportId] = useState<string | null>(null);

  const { data: rawReports, isLoading } = useQuery({
    queryKey: ["allSessionReports"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("session_reports")
        .select("*, sessions!inner(*)")
        .eq("user_id", user.id)
        .eq("sessions.is_baseline", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const reports: SessionReport[] = useMemo(() => {
    if (!rawReports) return [];

    return rawReports.map((report) => {
      const session = report.sessions as {
        session_date: string;
        use_site: string;
        session_type: string;
        number_of_participants: number;
      };

      const scenarioScores = report.scenario_scores as unknown as ScoreItem[];
      const dialogueScores = report.dialogue_scores as unknown as ScoreItem[];

      const scenarioAvg = scenarioScores.reduce((sum, s) => sum + s.score, 0) / scenarioScores.length;
      const dialogueAvg = dialogueScores.reduce((sum, s) => sum + s.score, 0) / dialogueScores.length;
      const overallScore = (scenarioAvg + dialogueAvg) / 2;

      return {
        id: report.id,
        sessionId: report.session_id,
        createdAt: report.created_at,
        sessionDate: session.session_date,
        useSite: session.use_site,
        sessionType: session.session_type,
        participants: session.number_of_participants,
        speakers: report.speakers as unknown as Speaker[],
        themes: report.themes as unknown as Theme[],
        conclusions: report.conclusions as unknown as string[],
        talkTimeData: report.talk_time_data as unknown as TalkTimeItem[],
        speakerInteractions: report.speaker_interactions as unknown as number[][],
        scenarioContent: report.scenario_content as unknown as ScenarioContent,
        scenarioScores,
        scenarioAnalysis: report.scenario_analysis as unknown as AnalysisItem[],
        dialogueScores,
        dialogueAnalysis: report.dialogue_analysis as unknown as AnalysisItem[],
        finalSummary: report.final_summary as unknown as string[],
        overallScore: parseFloat(overallScore.toFixed(1)),
      };
    });
  }, [rawReports]);

  // Auto-select latest report if none selected
  const selectedReport = useMemo(() => {
    if (!reports.length) return null;
    if (selectedReportId) {
      return reports.find((r) => r.id === selectedReportId) || reports[0];
    }
    return reports[0];
  }, [reports, selectedReportId]);

  const comparisonReport = useMemo(() => {
    if (!comparisonReportId || !reports.length) return null;
    return reports.find((r) => r.id === comparisonReportId) || null;
  }, [reports, comparisonReportId]);

  // Get reports available for comparison (exclude currently selected)
  const availableForComparison = useMemo(() => {
    if (!selectedReport) return [];
    return reports.filter((r) => r.id !== selectedReport.id);
  }, [reports, selectedReport]);

  return {
    reports,
    selectedReport,
    comparisonReport,
    availableForComparison,
    setSelectedReportId,
    setComparisonReportId,
    isLoading,
  };
};
