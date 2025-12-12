export interface PostSurveyResponse {
  categoryCode: string;
  questionIndex: number;
  responseValue: number;
}

export interface PostSurveyResult {
  categoryCode: string;
  categoryName: string;
  userScore: number;
  nationalAverage: number;
  maxScore: number;
  recommendation: string;
}
