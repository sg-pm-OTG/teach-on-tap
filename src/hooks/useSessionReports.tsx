import { useMemo } from "react";
import {
  scenarioScores,
  dialogueScores,
  scenarioAnalysis,
  dialogueAnalysis,
  talkTimeData,
  sessionDetails,
} from "@/data/reportData";

interface SessionInsights {
  overallScore: number;
  scenarioAvg: number;
  dialogueAvg: number;
  strengths: { label: string; score: number }[];
  focusAreas: { label: string; score: number }[];
  facilitatorTalkTimeMinutes: number;
  latestSessionDate: string;
  latestSessionTitle: string;
  sessionCount: number;
  finalReportGenerated: boolean;
}

export const useSessionReports = () => {
  const hasReports = true;

  const insights = useMemo<SessionInsights | null>(() => {
    if (!hasReports) return null;

    const scenarioAvg =
      scenarioScores.reduce((sum, s) => sum + s.score, 0) / scenarioScores.length;
    const dialogueAvg =
      dialogueScores.reduce((sum, s) => sum + s.score, 0) / dialogueScores.length;
    const overallScore = (scenarioAvg + dialogueAvg) / 2;

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

    // Mock data for POC
    const sessionCount = 3;
    const finalReportGenerated = false;

    return {
      overallScore: parseFloat(overallScore.toFixed(1)),
      scenarioAvg: parseFloat(scenarioAvg.toFixed(2)),
      dialogueAvg: parseFloat(dialogueAvg.toFixed(2)),
      strengths,
      focusAreas,
      facilitatorTalkTimeMinutes,
      latestSessionDate: sessionDetails.date,
      latestSessionTitle: sessionDetails.title,
      sessionCount,
      finalReportGenerated,
    };
  }, [hasReports]);

  return { hasReports, insights };
};
