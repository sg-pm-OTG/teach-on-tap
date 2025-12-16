export interface SurveyData {
  practiceDifficulty?: string;
}

export const DIFFICULTY_SCALE = [
  "Very easy",
  "Easy",
  "Somewhat easy",
  "Somewhat difficult",
  "Difficult",
  "Very difficult",
] as const;
