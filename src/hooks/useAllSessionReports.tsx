import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import axios from "axios";

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
  description: string;
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
  keyInsights: string[];
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
  participants: number;
  sessionDate: string;
  useSite: string;
  sessionType: string;
  totalTime: number;
  audioFileUrl: string | null;
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
  scenarioAvg: number;
  dialogueAvg: number;
  transcript: string;
}

const themeIcons = ["Target", "Wrench", "Brain", "Compass", "Users"];
const themeColors = ["bg-rose-100", "bg-amber-100", "bg-purple-100", "bg-blue-100", "bg-emerald-100"];

export const useAllSessionReports = () => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [comparisonReportIds, setComparisonReportIds] = useState<string[]>([]);

  const getAccessToken = async (): Promise<string> => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session?.access_token) {
      throw new Error("Not authenticated");
    }

    return data.session.access_token;
  };
  // Fetch regular (non-baseline) session reports
  const { data: rawReports, isLoading } = useQuery({
    queryKey: ["allSessionReports"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const token = await getAccessToken();
      const allSession = await axios.get(
        `https://be-sussial.otg-lab.xyz/api/v1/analyze/sessions`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30_000,
        }
      );

      const rawData = await Promise.all(
        allSession.data.data.map(async (item: any) => {
        const res = await axios.get(
          `https://be-sussial.otg-lab.xyz/api/v1/analyze/result?session_id=${item.session_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30_000,
          }
        );
        return res.data;
      }));

      const data = rawData.map((item: any) => {
        try{
        const scenario_scores = item.data.es_data.markers.map(item => ({
          label: item.markerTitle,
          score: item.score
        }));

        const dialogue_scores = item.data.gd_data.markers.map(item => ({
          label: item.markerTitle,
          score: item.score
        }));

        const scenario_analysis = item.data.es_data.markers.map(item => ({
          marker: item.markerTitle,
          rating: item.score,
          details: item.detailedReasoning?.analysis,
        }));

        const dialogue_analysis = item.data.gd_data.markers.map(item => ({
          marker: item.markerTitle,
          rating: item.score,
          details: item.detailedReasoning?.analysis,
        }));

        const talk_time_data = item.data.talk_time_data.map(item => {
          const speakerName = item.speaker;

          return {
            speaker: speakerName,
            // percentage: Number(item.percentage.toFixed(1)),
            seconds: Math.round(item.talk_time),
          };
        });

        const themes = item.data.trainer_check_parsed.lesson_analysis.main_discussion_themes.map(item => ({
          title: item.theme,
          description: item.description
        }));

        const conclusions = item.data.trainer_check_parsed.lesson_analysis.overall_conclusions;

        const speaker_interactions = item.data.speaker_interaction_matrix.map((row: any, index: number) => {
          const keys = Object.keys(row);
          const fromKey = keys[index];

          return {
            from: fromKey,
            interactions: keys
              .map(k => ({
                to: k,
                count: row[k]
              }))
          };
        });

        const speakers = item.data.trainer_check_parsed.lesson_analysis.speaker_details.map(item => ({
          name: item.extracted_name || item.speaker_id,
          description: item.ai_description,
        }))      

        const scenario_content = {
          title: item.data.session.use_site,
          description: item.data.es_data.summary.keyInsights,
          context: item.data.session.emergent_scenario,
        }

        const final_summary = {
          keyInsights: item.data.es_data.summary.keyInsights.join('\n') + item.data.gd_data.summary.keyInsights.join('\n'),
          recommendation: item.data.es_data.summary.recommendations.join('\n') + item.data.gd_data.summary.recommendations.join('\n')
        }

        return {
          session_id: item.data.session.id,
          session: item.data.session,
          sessionDate: item.data.session.session_date,
          sessionType: item.data.session.session_type,
          participants: item.data.session.number_of_participants,
          createdAt: item.data.session.created_at,
          totalTime: item.data.total_time,
          audioFileUrl: item.data.session.audio_file_url,
          transcript: item.data.speaker_data,
          user_id: user.id,
          scenario_scores, 
          dialogue_scores,
          scenario_analysis,
          dialogue_analysis,
          talk_time_data,
          themes,
          conclusions,
          speaker_interactions,
          speakers,
          scenario_content,
          final_summary
        }
        } catch (err) {
          console.error('Error at item index:', err, item);
          return null;
        }
      }) 

      // if (error) throw error;
      return data || [];
    },
  });

  // Fetch baseline session report separately
  const { data: rawBaselineReport } = useQuery({
    queryKey: ["baselineSessionReport"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const token = await getAccessToken();
      const allSession = await axios.get(
        `https://be-sussial.otg-lab.xyz/api/v1/analyze/sessions`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30_000,
        }
      );
      

      const rawData = await Promise.all(
        allSession.data.data.map(async (item: any) => {
        const res = await axios.get(
          `https://be-sussial.otg-lab.xyz/api/v1/analyze/result?session_id=${item.session_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30_000,
          }
        );
        return res.data;
      }));

      const data = rawData.map((item: any) => {
        try {
          const scenario_scores = item.data.es_data.markers.map(item => ({
            label: item.markerTitle,
            score: item.score
          }));

          const dialogue_scores = item.data.gd_data.markers.map(item => ({
            label: item.markerTitle,
            score: item.score
          }));

          const scenario_analysis = item.data.es_data.markers.map(item => ({
            marker: item.markerTitle,
            rating: item.score,
            details: item.detailedReasoning?.analysis,
          }));

          const dialogue_analysis = item.data.gd_data.markers.map(item => ({
            marker: item.markerTitle,
            rating: item.score,
            details: item.detailedReasoning?.analysis,
          }));

          const talk_time_data = item.data.talk_time_data.map(item => {
            const speakerName = item.speaker;

            return {
              speaker: speakerName,
              // percentage: Number(item.percentage.toFixed(1)),
              seconds: Math.round(item.talk_time),
            };
          });

          const themes = item.data.trainer_check_parsed.lesson_analysis.main_discussion_themes.map(item => ({
            title: item.theme,
            description: item.description
          }));

          const conclusions = item.data.trainer_check_parsed.lesson_analysis.overall_conclusions;

          const speaker_interactions = item.data.speaker_interaction_matrix.map((row: any, index: number) => {
            const keys = Object.keys(row);
            const fromKey = keys[index];

            return {
              from: fromKey,
              interactions: keys
                .map(k => ({
                  to: k,
                  count: row[k]
                }))
            };
          });

          const speakers = item.data.trainer_check_parsed.lesson_analysis.speaker_details.map(item => ({
            name: item.extracted_name || item.speaker_id,
            description: item.ai_description,
          }))      

          const scenario_content = {
            title: item.data.session.use_site,
            description: item.data.es_data.summary.keyInsights,
            context: item.data.session.emergent_scenario,
          }

          const final_summary = {
            keyInsights: item.data.es_data.summary.keyInsights.join('\n') + item.data.gd_data.summary.keyInsights.join('\n')  ,
            recommendation: item.data.es_data.summary.recommendations.join('\n') + item.data.gd_data.summary.recommendations.join('\n')
          }
          return {
            session_id: item.data.session.id,
            session: item.data.session,
            sessionDate: item.data.session.session_date,
            sessionType: item.data.session.session_type,
            participants: item.data.session.number_of_participants,
            createdAt: item.data.session.created_at,
            totalTime: item.data.total_time,
            audioFileUrl: item.data.session.audio_file_url,
            transcript: item.data.speaker_data,
            user_id: user.id,
            scenario_scores, 
            dialogue_scores,
            scenario_analysis,
            dialogue_analysis,
            talk_time_data,
            themes,
            conclusions,
            speaker_interactions,
            speakers,
            scenario_content,
            final_summary
          }
        } catch (err) {
          console.error('Error at item index:', err, item);
          return null;
        }
      }) 

      // if (error) throw error;
      return data[0] ?? null;
    },
  });

  const reports: SessionReport[] = useMemo(() => {
    if (!rawReports) return [];

    return rawReports.map((report) => {
      const session = report.session as {
        session_date: string;
        use_site: string;
        session_type: string;
        number_of_participants: number;
        audio_file_url: string | null;
        created_at: string;
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

      // Calculate individual averages
      const scenarioAvg = scenarioScores.reduce((sum, s) => sum + s.score, 0) / scenarioScores.length;
      const dialogueAvg = dialogueScores.reduce((sum, s) => sum + s.score, 0) / dialogueScores.length;

      // Transform speakers: {name, role, talkTime} -> {id, description}
      const rawSpeakers = report.speakers as unknown as RawSpeaker[];

      const speakers: Speaker[] = rawSpeakers.map((s) => ({
        id: s.name,
        description: `${s.description}`,
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
        Object.values(row.interactions.map(item => item.count))
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
        content: `${a.details}`,
      }));

      // Transform dialogue analysis
      const rawDialogueAnalysis = report.dialogue_analysis as unknown as RawAnalysisItem[];
      const dialogueAnalysis: AnalysisItem[] = rawDialogueAnalysis.map((a) => ({
        title: a.marker,
        score: a.rating,
        content: `${a.details}`,
      }));

      // Transform final summary: object -> string[]
      const rawFinalSummary = report.final_summary as unknown as RawFinalSummary;
      const finalSummary: string[] = [
        rawFinalSummary.keyInsights.length > 0 
          ? `Key Insights: ${rawFinalSummary.keyInsights}` 
          : null,
        rawFinalSummary.recommendation.length > 0 
          ? `Recommendations: ${rawFinalSummary.recommendation}` 
          : null,
      ].filter(Boolean) as string[];

      return {
        id: report.session_id,
        sessionId: report.session_id,
        createdAt: session.created_at,
        sessionDate: session.session_date,
        useSite: session.use_site,
        sessionType: session.session_type,
        participants: session.number_of_participants,
        audioFileUrl: session.audio_file_url,
        totalTime: report.totalTime,
        transcript: report.transcript,
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
        scenarioAvg: Math.round(scenarioAvg),
        dialogueAvg: Math.round(dialogueAvg),
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
    if (!comparisonReportIds.length || !reports.length) return null;
    // Return first comparison report for backward compatibility (single comparison)
    return reports.find((r) => r.id === comparisonReportIds[0]) || null;
  }, [reports, comparisonReportIds]);

  // Transform baseline report using the same logic
  const baselineReport: SessionReport | null = useMemo(() => {
    if (!rawBaselineReport) return null;

    const session = rawBaselineReport.session as {
      session_date: string;
      use_site: string;
      session_type: string;
      number_of_participants: number;
      audio_file_url: string | null;
      created_at: string;
    };

    // Transform scenario scores
    const rawScenarioScores = rawBaselineReport.scenario_scores as unknown as ScoreItem[]
    const scenarioScores = rawScenarioScores.map(s => ({
      label: s.label,
      score: s.score,
    }));

    // Transform dialogue scores  
    const rawDialogueScores = rawBaselineReport.dialogue_scores as unknown as ScoreItem[];
    const dialogueScores = rawDialogueScores.map(s => ({
      label: s.label,
      score: s.score,
    }));

    // Calculate individual averages
    const scenarioAvg = scenarioScores.reduce((sum, s) => sum + s.score, 0) / scenarioScores.length;
    const dialogueAvg = dialogueScores.reduce((sum, s) => sum + s.score, 0) / dialogueScores.length;

    // Transform speakers
    const rawSpeakers = rawBaselineReport.speakers as unknown as RawSpeaker[];
    const speakers: Speaker[] = rawSpeakers.map((s) => ({
      id: s.name,
      description: `${s.description}`,
    }));

    // Transform themes
    const rawThemes = rawBaselineReport.themes as unknown as RawTheme[];
    const themes: Theme[] = rawThemes.map((t, index) => ({
      title: t.title,
      icon: themeIcons[index % themeIcons.length],
      accentColor: themeColors[index % themeColors.length],
      bullets: [t.description],
    }));

    const conclusions = rawBaselineReport.conclusions as unknown as string[];

    // Transform talk time data
    const rawTalkTime = rawBaselineReport.talk_time_data as unknown as TalkTimeItem[];
    const totalSeconds = rawTalkTime.reduce((sum, t) => sum + t.seconds, 0);
    const talkTimeData: TalkTimeItem[] = rawTalkTime.map((t, index) => ({
      speaker: t.speaker,
      seconds: t.seconds,
      percentage: totalSeconds > 0 ? parseFloat(((t.seconds / totalSeconds) * 100).toFixed(1)) : 0,
      color: index === 0 ? "bg-teal-500" : `bg-${["blue", "purple", "pink", "orange", "emerald", "indigo", "rose", "cyan"][index % 8]}-500`,
    }));

    // Transform speaker interactions
    const rawInteractions = rawBaselineReport.speaker_interactions as unknown as RawSpeakerInteraction[];
    // const rawInteractions = rawBaselineReport.speaker_interactions as Record<string, Record<string, number>>;

    const speakerInteractions: number[][] = Object.values(rawInteractions).map(row =>
      Object.values(row.interactions.map(item => item.count))
    );


    // Transform scenario content
    const rawScenarioContent = rawBaselineReport.scenario_content as unknown as RawScenarioContent;
    const scenarioContent: ScenarioContent = {
      title: rawScenarioContent.title,
      content: [rawScenarioContent.description, rawScenarioContent.context].filter(Boolean),
    };

    // Transform scenario analysis
    const rawScenarioAnalysis = rawBaselineReport.scenario_analysis as unknown as RawAnalysisItem[];
 
    const scenarioAnalysis: AnalysisItem[] = rawScenarioAnalysis.map((a) => ({
      title: a.marker,
      score: a.rating,
      content: `${a.details}`,
    }));

    // Transform dialogue analysis
    const rawDialogueAnalysis = rawBaselineReport.dialogue_analysis as unknown as RawAnalysisItem[];
    const dialogueAnalysis: AnalysisItem[] = rawDialogueAnalysis.map((a) => ({
      title: a.marker,
      score: a.rating,
      content: `${a.details}`,
    }));

    // Transform final summary
    const rawFinalSummary = rawBaselineReport.final_summary as unknown as RawFinalSummary;
    const finalSummary: string[] = [
      rawFinalSummary.keyInsights.length > 0 
        ? `Key Insights: ${rawFinalSummary.keyInsights}` 
        : null,
        rawFinalSummary.recommendation.length > 0 
          ? `Recommendations: ${rawFinalSummary.recommendation}` 
          : null,
    ].filter(Boolean) as string[];

    return {
      id: rawBaselineReport.session_id,
      sessionId: rawBaselineReport.session_id,
      createdAt: session.created_at,
      sessionDate: session.session_date,
      useSite: session.use_site,
      sessionType: session.session_type,
      participants: session.number_of_participants,
      audioFileUrl: session.audio_file_url,
      totalTime: rawBaselineReport.totalTime,
      transcript: rawBaselineReport.transcript,
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
      scenarioAvg: Math.round(scenarioAvg),
      dialogueAvg: Math.round(dialogueAvg),
      isBaseline: true,
    } as SessionReport & { isBaseline: boolean };
  }, [rawBaselineReport]);

  // Get reports available for comparison (exclude currently selected, include baseline)
  const availableForComparison = useMemo(() => {
    if (!selectedReport) return [];
    const regularSessions = reports.filter((r) => r.id !== selectedReport.id);
    
    // Add baseline report if it exists
    if (baselineReport) {
      return [{ ...baselineReport, isBaseline: true }, ...regularSessions];
    }
    return regularSessions;
  }, [reports, selectedReport, baselineReport]);

  // Update comparison reports lookup to include baseline (returns array)
  const comparisonReports = useMemo(() => {
    if (!comparisonReportIds.length) return [];
    return comparisonReportIds.map((id) => {
      if (baselineReport && id === baselineReport.id) {
        return baselineReport;
      }
      return reports.find((r) => r.id === id);
    }).filter(Boolean) as SessionReport[];
  }, [reports, comparisonReportIds, baselineReport]);

  // For backward compatibility - single comparison (first selected)
  const comparisonReportWithBaseline = useMemo(() => {
    if (!comparisonReportIds.length) return null;
    const firstId = comparisonReportIds[0];
    if (baselineReport && firstId === baselineReport.id) {
      return baselineReport;
    }
    return reports.find((r) => r.id === firstId) || null;
  }, [reports, comparisonReportIds, baselineReport]);

  // All sessions for timeline (chronological order with labels) - includes full scores
  const allSessionsForTimeline = useMemo(() => {
    const allSessions: Array<{
      id: string;
      date: string;
      scenarioScores: ScoreItem[];
      dialogueScores: ScoreItem[];
      isBaseline?: boolean;
      label: string;
    }> = [];

    // Add baseline first if exists
    if (baselineReport) {
      allSessions.push({
        id: baselineReport.id,
        date: baselineReport.sessionDate,
        scenarioScores: baselineReport.scenarioScores,
        dialogueScores: baselineReport.dialogueScores,
        isBaseline: true,
        label: "Baseline",
      });
    }

    // Add regular sessions
    reports.forEach((r, index) => {
      allSessions.push({
        id: r.id,
        date: r.sessionDate,
        scenarioScores: r.scenarioScores,
        dialogueScores: r.dialogueScores,
        isBaseline: false,
        label: `Session ${reports.length - index}`,
      });
    });

    // Sort chronologically
    return allSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [reports, baselineReport]);

  return {
    reports,
    selectedReport,
    comparisonReport: comparisonReportWithBaseline,
    comparisonReports,
    comparisonReportIds,
    availableForComparison,
    baselineReport,
    allSessionsForTimeline,
    setSelectedReportId,
    setComparisonReportIds,
    isLoading,
  };
};
