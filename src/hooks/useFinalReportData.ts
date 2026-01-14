import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useMemo } from "react";
import axios from "axios";

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
  postSurveyScore: number | null;
  maxScore: number;
  nationalAverage: number;
  change: number | null;
  interpretation: string;
  hasPostData: boolean;
}

interface DifficultyProgression {
  session: number;
  sessionLabel: string;
  practiceDifficulty: string | null;
  designDifficulty: string | null;
}

export const useFinalReportData = () => {
  const { user } = useAuth();
  const getAccessToken = async (): Promise<string> => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session?.access_token) {
      throw new Error("Not authenticated");
    }

    return data.session.access_token;
  };
  // Fetch all sessions (including baseline)
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["final-report-sessions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "completed")
        .order("session_date", { ascending: true })
        .limit(4);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch all session reports
  const { data: sessionReports, isLoading: reportsLoading } = useQuery({
    queryKey: ["final-report-reports", user?.id, sessions?.length],
    queryFn: async () => {
      if (!sessions || sessions.length === 0) return [];
      
      const token = await getAccessToken();
      const rawData = await Promise.all(
        sessions.filter((item: any) => !item.is_baseline)
          .map(async (item: any) => {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/analyze/result?session_id=${item.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 30_000,
            }
          );
          return res.data
      }));

      const data = rawData.map((itemData: any) => {
        try{
          if (!itemData?.data) return null;
          
          const scenario_scores = itemData.data.es_data?.markers?.map(item => ({
            label: item.markerTitle,
            score: item.score
          })) || [];

          const dialogue_scores = itemData.data.gd_data?.markers?.map(item => ({
            label: item.markerTitle,
            score: item.score
          })) || [];

          const scenario_analysis = itemData.data.es_data?.markers?.map(item => ({
            marker: item.markerTitle,
            rating: item.score,
            details: item.detailedReasoning?.analysis,
          })) || [];

          const dialogue_analysis = itemData.data.gd_data?.markers?.map(item => ({
            marker: item.markerTitle,
            rating: item.score,
            details: item.detailedReasoning?.analysis,
          })) || [];

          // const speaker_map = itemData.data.speaker_map.map((item: any) => );
          let participant = 1;
          const speaker_map = Object.fromEntries(Object.entries(itemData.data.speaker_map || {}).map(
            ([key, value]) => [key, value === 'Facilitator' ? value : `Participant ${participant++}`]
          ));

          const talk_time_data = (itemData.data.talk_time_data || []).map(item => {
            const speakerName = speaker_map[item.speaker];


            return {
              speaker: speakerName,
              seconds: Math.round(item.talk_time),
            };
          });

          const themes = (itemData.data.trainer_check_parsed?.lesson_analysis?.main_discussion_themes || []).map(item => ({
            title: item.theme,
            description: item.description
          }));

          const conclusions = itemData.data.trainer_check_parsed?.lesson_analysis?.overall_conclusions || [];

          const speaker_interactions = (itemData.data.speaker_interaction_matrix || []).map((row: any, index: number) => {
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

          const speakers = (itemData.data.trainer_check_parsed?.lesson_analysis?.speaker_details || []).map(item => ({
            name: speaker_map[item.speaker_id],
            description: item.ai_description,
          }))      

          const scenario_content = {
            title: itemData.data.session?.use_site,
            description: itemData.data.es_data?.summary?.keyInsights || [],
            // context: itemData.data.session.emergent_scenario,
          }

          const final_summary = {
            keyInsights: [...(itemData.data.es_data?.summary?.keyInsights || []), ...(itemData.data.gd_data?.summary?.keyInsights || [])],
            recommendation: [...(itemData.data.es_data?.summary?.recommendations || []), ...(itemData.data.gd_data?.summary?.recommendations || [])],
          }

          return {
            session_id: itemData.data.session?.id,
            session: itemData.data.session,
            sessionDate: itemData.data.session?.session_date,
            sessionType: itemData.data.session?.session_type,
            participants: itemData.data.session?.number_of_participants,
            createdAt: itemData.data.session?.created_at,
            totalTime: itemData.data.total_time,
            audioFileUrl: itemData.data.session?.audio_file_url,
            transcript: itemData.data.speaker_data,
            user_id: user?.id,
            isBaseline: itemData.data.session?.is_baseline || false,
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
            final_summary,
            es_summary: itemData.data.es_data?.summary, 
            gd_summary: itemData.data.gd_data?.summary,
          }
        } catch (err) {
          console.error('Error at item index:', err, itemData);
          return null;
        }
      }).filter(Boolean);

      return data;
    },
    enabled: !!user?.id && !!sessions && sessions.length > 0,
  });

  // Fetch session surveys for difficulty data
  const { data: sessionSurveys, isLoading: surveysLoading } = useQuery({
    queryKey: ["final-report-surveys", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_surveys")
        .select("*, sessions!inner(session_date, is_baseline)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: true })
        .limit(3);

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
      const duration = sessionReports?.find(item => item.session_id === session.id)?.totalTime / 60;
      return {
        sessionNumber: session.is_baseline ? 0 : regularSessionNumber,
        course: session.use_site || "Session",
        date: session.session_date,
        format: session.session_type === "Online Lesson" ? "Virtual" : "In-person",
        durationMinutes: Number.isFinite(duration) ? Number(duration.toFixed(2)) : 0, // Ensure number type
        isBaseline: session.is_baseline,
      };
    });
  }, [sessions, sessionReports]);

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
      .map((report: any, index: number) => {
        const rawData = (report.talk_time_data as any[]) || [];
        
        // Calculate total seconds for percentage if not already present
        const totalSeconds = rawData.reduce((sum, t) => sum + (t.seconds || 0), 0);
        
        const dataWithPercentage = rawData.map((item) => ({
          speaker: item.speaker,
          seconds: item.seconds || 0,
          color: item.color || "hsl(var(--muted))",
          percentage: item.percentage ?? (totalSeconds > 0 
            ? Math.round((item.seconds / totalSeconds) * 100 * 10) / 10 
            : 0),
        }));

        return {
          session: index + 1,
          sessionLabel: `Session ${index + 1}`,
          data: dataWithPercentage,
        };
      });
  }, [sessionReports]);

  // Get speaker interactions for latest session
  const latestSpeakerInteractions = useMemo(() => {
    if (!sessionReports || sessionReports.length === 0) return null;

    const nonBaselineReports = sessionReports.filter(
      (r: any) => !r.sessions?.is_baseline
    );
    const latest = nonBaselineReports[nonBaselineReports.length - 1];
    
    if (!latest?.speaker_interactions) return null;

    const rawInteractions = latest.speaker_interactions as any[];
    
    // Check if it's already a 2D matrix or needs transformation
    if (Array.isArray(rawInteractions) && rawInteractions.length > 0) {
      // If it's an array of objects with 'from' and 'interactions' keys, transform it
      if (rawInteractions[0]?.from !== undefined && rawInteractions[0]?.interactions !== undefined) {
        const speakers = (latest.speakers as any[])?.map((s: any) => s.name || s.label) || [];
        const matrix = rawInteractions.map((speaker: any) => 
          speaker.interactions.map((interaction: any) => interaction.count || 0)
        );
        return { interactions: matrix, speakers };
      }
      // If it's already a 2D matrix, use as-is
      if (Array.isArray(rawInteractions[0])) {
        const speakers = (latest.speakers as any[])?.map((s: any) => s.name || s.label) || [];
        return { interactions: rawInteractions as number[][], speakers };
      }
    }

    return null;
  }, [sessionReports]);

  // All interactions
  const allSpeakerInteractions = useMemo(() => {
    if (!sessionReports || sessionReports.length === 0) return null;

    const nonBaselineReports = sessionReports.filter(
      (r: any) => !r.sessions?.is_baseline
    );

    const all = nonBaselineReports?.map((nonBaselineReport) => {
      const item = nonBaselineReport;

      if (!item?.speaker_interactions) return null;

      const rawInteractions = item.speaker_interactions as any[];
      
      // Check if it's already a 2D matrix or needs transformation
      if (Array.isArray(rawInteractions) && rawInteractions.length > 0) {
        // If it's an array of objects with 'from' and 'interactions' keys, transform it
        if (rawInteractions[0]?.from !== undefined && rawInteractions[0]?.interactions !== undefined) {
          const speakers = (item.speakers as any[])?.map((s: any) => s.name || s.label) || [];
          const matrix = rawInteractions.map((speaker: any) => 
            speaker.interactions.map((interaction: any) => interaction.count || 0)
          );
          return { interactions: matrix, speakers };
        }
        // If it's already a 2D matrix, use as-is
        if (Array.isArray(rawInteractions[0])) {
          const speakers = (item.speakers as any[])?.map((s: any) => s.name || s.label) || [];
          return { interactions: rawInteractions as number[][], speakers };
        }
      }

      return null;
    })
    return all;
  }, [sessionReports]);

  // Process survey comparisons (Learning Beliefs only for post-survey)
  const beliefComparisons = useMemo<SurveyComparison[]>(() => {
    if (!preSurveyResults) return [];

    const learningBeliefCodes = ["A1", "A2", "A3"];
    const hasPostSurvey = postSurveyResults && postSurveyResults.length > 0;
    
    return learningBeliefCodes.map((code) => {
      const pre = preSurveyResults.find((r) => r.category_code === code);
      const post = hasPostSurvey 
        ? postSurveyResults.find((r) => r.category_code === code) 
        : null;

      if (!pre) return null;

      const preScore = Number(pre.user_score);
      const postScore = post ? Number(post.user_score) : null;
      const change = postScore !== null ? postScore - preScore : null;

      let interpretation = "";
      if (change !== null) {
        if (change > 0.5) interpretation = "Healthy Shift";
        else if (change < -0.5) interpretation = "Slight Decline";
        else if (postScore !== null && postScore > 4) interpretation = "Still Dominant";
        else interpretation = "No Change";
      }

      return {
        categoryCode: code,
        categoryName: pre.category_name,
        preSurveyScore: preScore,
        postSurveyScore: postScore,
        maxScore: pre.max_score,
        nationalAverage: Number(pre.national_average),
        change,
        interpretation,
        hasPostData: postScore !== null,
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

  // fetch data from API
  const { data: finalReportApi, isLoading: finalReportApiLoading } = useQuery({
    queryKey: ["final-report", user?.id, sessions?.length],
    queryFn: async () => {
      if (!sessions || sessions.length === 0) return null;
      
      const token = await getAccessToken();
      try {
        // 1️⃣ GET report
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/analyze/final-report`,
          {
            params: { report_id: user?.id },
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30_000,
          }
        );

        return res.data;
      } catch (error: any) {
        // Mock data body
        try {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/v1/analyze/final-report`,
              {
                "user_profile": {
                  "name": user?.user_metadata?.name || "User", 
                  "job_context": {
                    "autonomy_level": "Low", 
                    "support_level": "High",
                    "description": ""
                  },
  
                  "pedagogical_beliefs": {
                    "pre_survey": {
                      "acquisition": 	2.67, 
                      "participation": 200
                    },
                    "post_survey": {
                      "acquisition": 4.5,
                      "participation": 5.0
                    }
                  },
  
                  "learning_profile": {
                    "deep_learning": 5.0,
                    "skills_mastery": 5.0,
                    "internal_motivation": 5.0
                  }
                },
                "session_ids": sessions?.filter(item => !item.is_baseline).map(item => item.id) || []
              },
              {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 30_000,
              }
            );
  
            return { status: "processing" };
          }
          
        } catch (error) {
          console.log(error)
          throw error;
        }
      }
    },

    enabled: !!user?.id && !!sessions && sessions.length > 0,

    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "processing" ? 2000 : false;
    },

    retry: false,
  });
  
  const finalReportData = finalReportApi?.data;
  const processFinalReport = finalReportApi?.status;

  const isLoading = sessionsLoading || reportsLoading || surveysLoading || preLoading || postLoading || finalReportApiLoading || processFinalReport === 'processing';

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
    finalReportData,
    allSpeakerInteractions,
    processFinalReport,
  };
};
