// types/session-report.types.ts

export interface ScoreItem {
  label: string;
  score: number;
}

export interface TalkTimeItem {
  speaker: string;
  percentage: number;
  seconds: number;
  color: string;
}

export interface Speaker {
  id: string;
  description: string;
}

export interface Theme {
  title: string;
  icon: string;
  accentColor: string;
  bullets: string[];
}

export interface AnalysisItem {
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

export interface ScenarioContent {
  title: string;
  content: string[];
}

export interface Summary {
  keyInsights: string[];
  recommendations: string[];
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
  esSummary: Summary;
  gdSummary: Summary;
  scenarioAvg: number;
  dialogueAvg: number;
  transcript: string;
  filename: string;
  csvFileUrl: string;
}
