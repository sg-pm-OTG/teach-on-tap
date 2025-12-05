export interface PreSurveyQuestion {
  id: string;
  categoryCode: string;
  questionIndex: number;
  text: string;
  scaleType: 4 | 5 | 6 | 7;
  scaleLabels: {
    low: string;
    high: string;
  };
}

export interface PreSurveyCategory {
  code: string;
  name: string;
  section: 'A' | 'B' | 'C';
  sectionName: string;
  questions: PreSurveyQuestion[];
  maxScore: number;
}

export interface PreSurveyResponse {
  categoryCode: string;
  questionIndex: number;
  responseValue: number;
}

export interface PreSurveyResult {
  categoryCode: string;
  categoryName: string;
  userScore: number;
  nationalAverage: number;
  maxScore: number;
  recommendation: string;
}
