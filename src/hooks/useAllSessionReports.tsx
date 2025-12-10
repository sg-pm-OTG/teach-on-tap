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

// Raw DB types
interface RawSpeaker {
  name: string;
  role: string;
  talkTime: string;
}

interface RawTheme {
  title: string;
  description: string;
}

interface RawScenarioContent {
  title: string;
  description: string;
  context: string;
}

interface RawAnalysisItem {
  marker: string;
  rating: number;
  summary: string;
  details: string;
}

interface RawFinalSummary {
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  recommendation: string;
}

interface RawSpeakerInteraction {
  from: string;
  interactions: { to: string; count: number }[];
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

const themeIcons = ["Target", "Wrench", "Brain", "Compass", "Users"];
const themeColors = ["bg-rose-100", "bg-amber-100", "bg-purple-100", "bg-blue-100", "bg-emerald-100"];

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

      // Transform scenario scores
      const rawScenarioScores = report.scenario_scores as unknown as ScoreItem[];
      const scenarioScores = rawScenarioScores.map(s => ({
        label: s.label,
        score: s.score,
      }));

      // Transform dialogue scores  
      const rawDialogueScores = report.dialogue_scores as unknown as ScoreItem[];
      const dialogueScores = rawDialogueScores.map(s => ({
        label: s.label,
        score: s.score,
      }));

      // Calculate overall score
      const scenarioAvg = scenarioScores.reduce((sum, s) => sum + s.score, 0) / scenarioScores.length;
      const dialogueAvg = dialogueScores.reduce((sum, s) => sum + s.score, 0) / dialogueScores.length;
      const overallScore = (scenarioAvg + dialogueAvg) / 2;

      // Transform speakers: {name, role, talkTime} -> {id, description}
      const rawSpeakers = report.speakers as unknown as RawSpeaker[];
      const speakers: Speaker[] = rawSpeakers.map((s) => ({
        id: s.name,
        description: `${s.role} • Talk time: ${s.talkTime}`,
      }));

      // Transform themes: {title, description} -> {title, icon, bullets, accentColor}
      const rawThemes = report.themes as unknown as RawTheme[];
      const themes: Theme[] = rawThemes.map((t, index) => ({
        title: t.title,
        icon: themeIcons[index % themeIcons.length],
        accentColor: themeColors[index % themeColors.length],
        bullets: [t.description],
      }));

      // Conclusions is already string[]
      const conclusions = report.conclusions as unknown as string[];

      // Transform talk time data
      const rawTalkTime = report.talk_time_data as unknown as TalkTimeItem[];
      const totalSeconds = rawTalkTime.reduce((sum, t) => sum + t.seconds, 0);
      const talkTimeData: TalkTimeItem[] = rawTalkTime.map((t, index) => ({
        speaker: t.speaker,
        seconds: t.seconds,
        percentage: totalSeconds > 0 ? parseFloat(((t.seconds / totalSeconds) * 100).toFixed(1)) : 0,
        color: index === 0 ? "bg-teal-500" : `bg-${["blue", "purple", "pink", "orange", "emerald", "indigo", "rose", "cyan"][index % 8]}-500`,
      }));

      // Transform speaker interactions: array of {from, interactions[]} -> 2D number array
      const rawInteractions = report.speaker_interactions as unknown as RawSpeakerInteraction[];
      const speakerInteractions: number[][] = rawInteractions.map((row) =>
        row.interactions.map((i) => i.count)
      );

      // Transform scenario content
      const rawScenarioContent = report.scenario_content as unknown as RawScenarioContent;
      const scenarioContent: ScenarioContent = {
        title: rawScenarioContent.title,
        content: [rawScenarioContent.description, rawScenarioContent.context].filter(Boolean),
      };

      // Transform scenario analysis: {marker, rating, summary, details} -> {title, score, content}
      const rawScenarioAnalysis = report.scenario_analysis as unknown as RawAnalysisItem[];
      const scenarioAnalysis: AnalysisItem[] = rawScenarioAnalysis.map((a) => ({
        title: a.marker,
        score: a.rating,
        content: `${a.summary}. ${a.details}`,
      }));

      // Transform dialogue analysis
      const rawDialogueAnalysis = report.dialogue_analysis as unknown as RawAnalysisItem[];
      const dialogueAnalysis: AnalysisItem[] = rawDialogueAnalysis.map((a) => ({
        title: a.marker,
        score: a.rating,
        content: `${a.summary}. ${a.details}`,
      }));

      // Transform final summary: object -> string[]
      const rawFinalSummary = report.final_summary as unknown as RawFinalSummary;
      const finalSummary: string[] = [
        `Overall Score: ${rawFinalSummary.overallScore}/4`,
        rawFinalSummary.strengths.length > 0 
          ? `Strengths: ${rawFinalSummary.strengths.join(", ")}` 
          : null,
        rawFinalSummary.areasForImprovement.length > 0 
          ? `Areas for improvement: ${rawFinalSummary.areasForImprovement.join(", ")}` 
          : null,
        rawFinalSummary.recommendation,
      ].filter(Boolean) as string[];

      return {
        id: report.id,
        sessionId: report.session_id,
        createdAt: report.created_at,
        sessionDate: session.session_date,
        useSite: session.use_site,
        sessionType: session.session_type,
        participants: session.number_of_participants,
        speakers,
        themes,
        conclusions,
        talkTimeData,
        speakerInteractions,
        scenarioContent,
        scenarioScores,
        scenarioAnalysis,
        dialogueScores,
        dialogueAnalysis,
        finalSummary,
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
