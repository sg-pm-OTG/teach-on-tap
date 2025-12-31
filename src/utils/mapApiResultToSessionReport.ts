import type {
  SessionReport,
  Speaker,
  Theme,
  ScenarioContent,
  AnalysisItem,
  ScoreItem,
  TalkTimeItem,
} from "@/types/sessionReport.ts";

const themeIcons = ["Target", "Wrench", "Brain", "Compass", "Users"];
const themeColors = [
  "bg-rose-100",
  "bg-amber-100",
  "bg-purple-100",
  "bg-blue-100",
  "bg-emerald-100",
];

export const mapApiResultToSessionReport = (rawReport: any): SessionReport => {
  if (!rawReport) return null;

  /* ================= SCORE ================= */
  const scenarioScores: ScoreItem[] =
    rawReport.es_data.markers.map((m: any) => ({
      label: m.markerTitle,
      score: m.score,
    }));

  const dialogueScores: ScoreItem[] =
    rawReport.gd_data.markers.map((m: any) => ({
      label: m.markerTitle,
      score: m.score,
    }));

  const scenarioAvg =
    scenarioScores.reduce((s, i) => s + i.score, 0) /
    scenarioScores.length;

  const dialogueAvg =
    dialogueScores.reduce((s, i) => s + i.score, 0) /
    dialogueScores.length;

  /* ================= ANALYSIS ================= */
  const scenarioAnalysis: AnalysisItem[] =
    rawReport.es_data.markers.map((m: any) => ({
      title: m.markerTitle,
      score: m.score,
      content: m.detailedReasoning?.analysis ?? "",
    }));

  const dialogueAnalysis: AnalysisItem[] =
    rawReport.gd_data.markers.map((m: any) => ({
      title: m.markerTitle,
      score: m.score,
      content: m.detailedReasoning?.analysis ?? "",
    }));

  /* ================= SPEAKER MAP ================= */
  let participantIndex = 1;
  const speakerMap = Object.fromEntries(
    Object.entries(rawReport.speaker_map).map(([key, value]) => [
      key,
      value === "Facilitator" ? value : `Participant ${participantIndex++}`,
    ])
  );

  /* ================= TALK TIME ================= */
  const rawTalkTime = rawReport.talk_time_data.map((t: any) => ({
    speaker: speakerMap[t.speaker],
    seconds: Math.round(t.talk_time),
  }));

  const totalSeconds = rawTalkTime.reduce((s: number, t: any) => s + t.seconds, 0);

  const talkTimeData: TalkTimeItem[] = rawTalkTime.map(
    (t: any, index: number) => ({
      speaker: t.speaker,
      seconds: t.seconds,
      percentage:
        totalSeconds > 0
          ? Number(((t.seconds / totalSeconds) * 100).toFixed(1))
          : 0,
      color:
        index === 0
          ? "bg-teal-500"
          : `bg-${["blue", "purple", "pink", "orange", "emerald", "indigo"][index % 6]}-500`,
    })
  );

  /* ================= SPEAKERS ================= */
  const speakers: Speaker[] =
    rawReport.trainer_check_parsed.lesson_analysis.speaker_details.map(
      (s: any) => ({
        id: speakerMap[s.speaker_id],
        description: s.ai_description,
      })
    );

  /* ================= THEMES ================= */
  const themes: Theme[] =
    rawReport.trainer_check_parsed.lesson_analysis.main_discussion_themes.map(
      (t: any, index: number) => ({
        title: t.theme,
        icon: themeIcons[index % themeIcons.length],
        accentColor: themeColors[index % themeColors.length],
        bullets: [t.description],
      })
    );

  /* ================= INTERACTIONS ================= */
  const speakerInteractions: number[][] =
    rawReport.speaker_interaction_matrix.map((row: any) =>
      Object.values(row)
    );

  /* ================= CONTENT ================= */
  const scenarioContent: ScenarioContent = {
    title: rawReport.session.use_site,
    content: rawReport.es_data.summary.keyInsights,
  };

  /* ================= FINAL SUMMARY ================= */
  const finalSummary: string[] = [
    ...rawReport.es_data.summary.keyInsights,
    ...rawReport.gd_data.summary.keyInsights,
  ];

  return {
    id: rawReport.session.id,
    sessionId: rawReport.session.id,
    createdAt: rawReport.session.created_at,
    sessionDate: rawReport.session.session_date,
    useSite: rawReport.session.use_site,
    sessionType: rawReport.session.session_type,
    participants: rawReport.session.number_of_participants,
    audioFileUrl: rawReport.session.audio_file_url,
    totalTime: rawReport.total_time,
    transcript: rawReport.speaker_data,
    filename: rawReport.session.session_name,
    csvFileUrl: rawReport.session.csv_file_url,
    speakers,
    themes,
    conclusions: rawReport.trainer_check_parsed.lesson_analysis.overall_conclusions,
    talkTimeData,
    speakerInteractions,
    scenarioContent,
    scenarioScores,
    scenarioAnalysis,
    dialogueScores,
    dialogueAnalysis,
    finalSummary,
    esSummary: rawReport.es_data.summary,
    gdSummary: rawReport.gd_data.summary,
    scenarioAvg: Math.round(scenarioAvg),
    dialogueAvg: Math.round(dialogueAvg),
  };
};