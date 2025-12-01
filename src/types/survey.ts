export interface SurveyData {
  engagementTypes: string[];
  engagementOther?: string;
  activityInvolvement?: string[];
  practiceDifficulty?: string;
  designDifficulty?: string;
  nonEngagementReasons?: string[];
  nonEngagementOther?: string;
  timeSpent?: string;
  confidenceChange?: string;
}

export const ENGAGEMENT_OPTIONS = [
  "I practised FOP in a learning session",
  "I discussed FOP with someone",
  "I reflected on FOP",
  "I looked for FOP-related resources or materials",
  "I designed a learning activity using FOP for a future session",
  "I did not engage with FOP",
] as const;

export const ACTIVITY_INVOLVEMENT_OPTIONS = [
  "Generative dialogue",
  "Emergent scenarios",
  "Recording the session with the FOP Analyzer",
  "None of the above",
] as const;

export const NON_ENGAGEMENT_REASONS = [
  "I had other priorities",
  "FOP did not come up in my work",
  "I was unsure how to apply FOP",
  "I forgot",
] as const;

export const TIME_SPENT_OPTIONS = [
  "Less than 2 hours",
  "Between 2 and 8 hours",
  "More than 8 hours",
] as const;

export const DIFFICULTY_SCALE = [
  "Very easy",
  "Easy",
  "Somewhat easy",
  "Somewhat difficult",
  "Difficult",
  "Very difficult",
] as const;

export const CONFIDENCE_SCALE = [
  "I feel much more confident than before",
  "I feel more confident than before",
  "I feel about the same as before",
  "I feel less confident than before",
  "I feel much less confident than before",
] as const;
