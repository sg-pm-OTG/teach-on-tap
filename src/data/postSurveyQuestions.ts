import { PreSurveyCategory } from '@/types/preSurvey';

// Post-survey uses only Section A: Learning Beliefs (3 categories, 6 questions)
export const postSurveyCategories: PreSurveyCategory[] = [
  {
    code: 'A1',
    name: 'Learning as acquisition',
    section: 'A',
    sectionName: 'Learning Beliefs',
    maxScore: 6,
    questions: [
      {
        id: 'A1_1',
        categoryCode: 'A1',
        questionIndex: 0,
        text: 'I believe that accurate knowledge is important so that learners can build a solid foundation for application.',
        scaleType: 6,
        scaleLabels: { low: 'Strongly Disagree', high: 'Strongly Agree' },
      },
      {
        id: 'A1_2',
        categoryCode: 'A1',
        questionIndex: 1,
        text: 'I believe that structured content is necessary for learners to understand new topics effectively.',
        scaleType: 6,
        scaleLabels: { low: 'Strongly Disagree', high: 'Strongly Agree' },
      },
    ],
  },
  {
    code: 'A2',
    name: 'Learning as participation',
    section: 'A',
    sectionName: 'Learning Beliefs',
    maxScore: 6,
    questions: [
      {
        id: 'A2_1',
        categoryCode: 'A2',
        questionIndex: 0,
        text: 'I believe that learning happens through meaningful interaction with others.',
        scaleType: 6,
        scaleLabels: { low: 'Strongly Disagree', high: 'Strongly Agree' },
      },
      {
        id: 'A2_2',
        categoryCode: 'A2',
        questionIndex: 1,
        text: 'I believe that open-ended exploration helps learners engage more deeply with ideas.',
        scaleType: 6,
        scaleLabels: { low: 'Strongly Disagree', high: 'Strongly Agree' },
      },
    ],
  },
  {
    code: 'A3',
    name: 'Learning as knowledge building',
    section: 'A',
    sectionName: 'Learning Beliefs',
    maxScore: 6,
    questions: [
      {
        id: 'A3_1',
        categoryCode: 'A3',
        questionIndex: 0,
        text: 'I believe that learners develop best when they are encouraged to generate new insights or knowledge.',
        scaleType: 6,
        scaleLabels: { low: 'Strongly Disagree', high: 'Strongly Agree' },
      },
      {
        id: 'A3_2',
        categoryCode: 'A3',
        questionIndex: 1,
        text: 'I believe that learners benefit from creating new solutions to problems they identify themselves.',
        scaleType: 6,
        scaleLabels: { low: 'Strongly Disagree', high: 'Strongly Agree' },
      },
    ],
  },
];

export const getPostSurveyTotalQuestions = (): number => {
  return postSurveyCategories.reduce((total, category) => total + category.questions.length, 0);
};
