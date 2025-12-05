import { PreSurveyCategory } from "@/types/preSurvey";

export const preSurveyCategories: PreSurveyCategory[] = [
  // Section A: Pedagogical Practices (4-point scale)
  {
    code: "A1",
    name: "Learning Beliefs",
    section: "A",
    sectionName: "Pedagogical Practices",
    maxScore: 4,
    questions: [
      {
        id: "A1_1",
        categoryCode: "A1",
        questionIndex: 0,
        text: "Students learn best when they construct their own knowledge through exploration and inquiry.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A1_2",
        categoryCode: "A1",
        questionIndex: 1,
        text: "Learning is most effective when students connect new information to their prior experiences.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A1_3",
        categoryCode: "A1",
        questionIndex: 2,
        text: "Students learn better when they are actively engaged in meaningful tasks rather than passive recipients of information.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  {
    code: "A2",
    name: "Fulfilment-based Learning Beliefs",
    section: "A",
    sectionName: "Pedagogical Practices",
    maxScore: 4,
    questions: [
      {
        id: "A2_1",
        categoryCode: "A2",
        questionIndex: 0,
        text: "Learning should help students develop a sense of purpose and meaning in their lives.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A2_2",
        categoryCode: "A2",
        questionIndex: 1,
        text: "Education should nurture students' emotional and social well-being alongside academic growth.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A2_3",
        categoryCode: "A2",
        questionIndex: 2,
        text: "Students' personal growth and self-actualization are important outcomes of education.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  {
    code: "A3",
    name: "Generative Dialogue",
    section: "A",
    sectionName: "Pedagogical Practices",
    maxScore: 4,
    questions: [
      {
        id: "A3_1",
        categoryCode: "A3",
        questionIndex: 0,
        text: "I regularly engage students in open-ended discussions that encourage diverse perspectives.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A3_2",
        categoryCode: "A3",
        questionIndex: 1,
        text: "I ask questions that promote critical thinking and deeper understanding.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A3_3",
        categoryCode: "A3",
        questionIndex: 2,
        text: "I create opportunities for students to build on each other's ideas during discussions.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A3_4",
        categoryCode: "A3",
        questionIndex: 3,
        text: "I encourage students to question assumptions and explore alternative viewpoints.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A3_5",
        categoryCode: "A3",
        questionIndex: 4,
        text: "I facilitate dialogue that leads to new insights and shared understanding.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  {
    code: "A4",
    name: "Teaching Stance",
    section: "A",
    sectionName: "Pedagogical Practices",
    maxScore: 4,
    questions: [
      {
        id: "A4_1",
        categoryCode: "A4",
        questionIndex: 0,
        text: "I see myself as a facilitator of learning rather than a transmitter of knowledge.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A4_2",
        categoryCode: "A4",
        questionIndex: 1,
        text: "I adapt my teaching approach based on students' needs and responses.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A4_3",
        categoryCode: "A4",
        questionIndex: 2,
        text: "I view teaching as a collaborative process between teacher and students.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  {
    code: "A5",
    name: "Knowledge Management",
    section: "A",
    sectionName: "Pedagogical Practices",
    maxScore: 4,
    questions: [
      {
        id: "A5_1",
        categoryCode: "A5",
        questionIndex: 0,
        text: "I help students organize and structure their knowledge effectively.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A5_2",
        categoryCode: "A5",
        questionIndex: 1,
        text: "I teach students strategies for retaining and applying what they learn.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A5_3",
        categoryCode: "A5",
        questionIndex: 2,
        text: "I encourage students to make connections across different subjects and concepts.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  {
    code: "A6",
    name: "Learner Management",
    section: "A",
    sectionName: "Pedagogical Practices",
    maxScore: 4,
    questions: [
      {
        id: "A6_1",
        categoryCode: "A6",
        questionIndex: 0,
        text: "I create a supportive learning environment that encourages risk-taking.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A6_2",
        categoryCode: "A6",
        questionIndex: 1,
        text: "I differentiate instruction to meet diverse student needs.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A6_3",
        categoryCode: "A6",
        questionIndex: 2,
        text: "I provide timely and constructive feedback to support student growth.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  {
    code: "A7",
    name: "Peer Observation",
    section: "A",
    sectionName: "Pedagogical Practices",
    maxScore: 4,
    questions: [
      {
        id: "A7_1",
        categoryCode: "A7",
        questionIndex: 0,
        text: "I regularly observe colleagues' teaching to learn new strategies.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A7_2",
        categoryCode: "A7",
        questionIndex: 1,
        text: "I welcome colleagues to observe my teaching and provide feedback.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "A7_3",
        categoryCode: "A7",
        questionIndex: 2,
        text: "Peer observation has positively influenced my teaching practice.",
        scaleType: 4,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  // Section B: Professional Environment (mixed scales)
  {
    code: "B1",
    name: "Organisational Commitment",
    section: "B",
    sectionName: "Professional Environment",
    maxScore: 5,
    questions: [
      {
        id: "B1_1",
        categoryCode: "B1",
        questionIndex: 0,
        text: "I feel a strong sense of belonging to my school.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B1_2",
        categoryCode: "B1",
        questionIndex: 1,
        text: "I am proud to tell others that I work at this school.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B1_3",
        categoryCode: "B1",
        questionIndex: 2,
        text: "I am willing to put in extra effort to help my school succeed.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B1_4",
        categoryCode: "B1",
        questionIndex: 3,
        text: "The school's values align with my personal values.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  {
    code: "B2",
    name: "Peer Culture",
    section: "B",
    sectionName: "Professional Environment",
    maxScore: 5,
    questions: [
      {
        id: "B2_1",
        categoryCode: "B2",
        questionIndex: 0,
        text: "My colleagues and I share a common vision for teaching and learning.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B2_2",
        categoryCode: "B2",
        questionIndex: 1,
        text: "There is a culture of mutual respect among teachers in my school.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B2_3",
        categoryCode: "B2",
        questionIndex: 2,
        text: "My colleagues actively support each other's professional growth.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B2_4",
        categoryCode: "B2",
        questionIndex: 3,
        text: "Collaboration is valued and encouraged among teachers here.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  {
    code: "B3",
    name: "Instructional Leadership",
    section: "B",
    sectionName: "Professional Environment",
    maxScore: 5,
    questions: [
      {
        id: "B3_1",
        categoryCode: "B3",
        questionIndex: 0,
        text: "School leaders provide clear direction for teaching and learning.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B3_2",
        categoryCode: "B3",
        questionIndex: 1,
        text: "Leaders actively support teachers in improving their practice.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B3_3",
        categoryCode: "B3",
        questionIndex: 2,
        text: "School leadership values and acts on teacher input.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B3_4",
        categoryCode: "B3",
        questionIndex: 3,
        text: "Leaders model effective teaching practices.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  {
    code: "B4",
    name: "Psychological Safety",
    section: "B",
    sectionName: "Professional Environment",
    maxScore: 7,
    questions: [
      {
        id: "B4_1",
        categoryCode: "B4",
        questionIndex: 0,
        text: "I feel safe to take risks and try new approaches in my teaching.",
        scaleType: 7,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B4_2",
        categoryCode: "B4",
        questionIndex: 1,
        text: "It is safe to admit mistakes in my school.",
        scaleType: 7,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B4_3",
        categoryCode: "B4",
        questionIndex: 2,
        text: "I can express my opinions freely without fear of negative consequences.",
        scaleType: 7,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B4_4",
        categoryCode: "B4",
        questionIndex: 3,
        text: "My unique skills and talents are valued by others.",
        scaleType: 7,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B4_5",
        categoryCode: "B4",
        questionIndex: 4,
        text: "I feel comfortable asking for help when I need it.",
        scaleType: 7,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B4_6",
        categoryCode: "B4",
        questionIndex: 5,
        text: "People in my school do not deliberately undermine others' efforts.",
        scaleType: 7,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B4_7",
        categoryCode: "B4",
        questionIndex: 6,
        text: "Working with colleagues in my school, my unique contributions are valued.",
        scaleType: 7,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  {
    code: "B5",
    name: "Collaborative Culture",
    section: "B",
    sectionName: "Professional Environment",
    maxScore: 5,
    questions: [
      {
        id: "B5_1",
        categoryCode: "B5",
        questionIndex: 0,
        text: "Teachers in my school regularly collaborate on lesson planning.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B5_2",
        categoryCode: "B5",
        questionIndex: 1,
        text: "We share teaching resources and materials openly.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B5_3",
        categoryCode: "B5",
        questionIndex: 2,
        text: "Teachers engage in joint problem-solving for student challenges.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B5_4",
        categoryCode: "B5",
        questionIndex: 3,
        text: "Professional learning communities are active and effective in my school.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B5_5",
        categoryCode: "B5",
        questionIndex: 4,
        text: "Cross-departmental collaboration is common and productive.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      },
      {
        id: "B5_6",
        categoryCode: "B5",
        questionIndex: 5,
        text: "We celebrate and learn from each other's successes.",
        scaleType: 5,
        scaleLabels: { low: "Strongly Disagree", high: "Strongly Agree" }
      }
    ]
  },
  // Section C: Skills Domain (6-point scale)
  {
    code: "C1",
    name: "Communication",
    section: "C",
    sectionName: "Skills Domain",
    maxScore: 6,
    questions: [
      {
        id: "C1_1",
        categoryCode: "C1",
        questionIndex: 0,
        text: "I can clearly articulate complex ideas to diverse audiences.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C1_2",
        categoryCode: "C1",
        questionIndex: 1,
        text: "I actively listen and seek to understand others' perspectives.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      }
    ]
  },
  {
    code: "C2",
    name: "Connecting",
    section: "C",
    sectionName: "Skills Domain",
    maxScore: 6,
    questions: [
      {
        id: "C2_1",
        categoryCode: "C2",
        questionIndex: 0,
        text: "I build strong relationships with students based on trust and respect.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C2_2",
        categoryCode: "C2",
        questionIndex: 1,
        text: "I effectively connect with colleagues across different departments.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C2_3",
        categoryCode: "C2",
        questionIndex: 2,
        text: "I engage parents and community members in student learning.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C2_4",
        categoryCode: "C2",
        questionIndex: 3,
        text: "I create inclusive environments where everyone feels valued.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      }
    ]
  },
  {
    code: "C3",
    name: "Collaboration",
    section: "C",
    sectionName: "Skills Domain",
    maxScore: 6,
    questions: [
      {
        id: "C3_1",
        categoryCode: "C3",
        questionIndex: 0,
        text: "I work effectively as part of a team to achieve common goals.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C3_2",
        categoryCode: "C3",
        questionIndex: 1,
        text: "I value and integrate diverse perspectives in collaborative work.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C3_3",
        categoryCode: "C3",
        questionIndex: 2,
        text: "I contribute constructively to group discussions and decision-making.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C3_4",
        categoryCode: "C3",
        questionIndex: 3,
        text: "I help resolve conflicts and build consensus within teams.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      }
    ]
  },
  {
    code: "C4",
    name: "Change",
    section: "C",
    sectionName: "Skills Domain",
    maxScore: 6,
    questions: [
      {
        id: "C4_1",
        categoryCode: "C4",
        questionIndex: 0,
        text: "I adapt quickly to new situations and requirements.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C4_2",
        categoryCode: "C4",
        questionIndex: 1,
        text: "I embrace change as an opportunity for growth.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C4_3",
        categoryCode: "C4",
        questionIndex: 2,
        text: "I help others navigate through periods of change.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C4_4",
        categoryCode: "C4",
        questionIndex: 3,
        text: "I proactively seek ways to improve my practice.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      }
    ]
  },
  {
    code: "C5",
    name: "Creativity",
    section: "C",
    sectionName: "Skills Domain",
    maxScore: 6,
    questions: [
      {
        id: "C5_1",
        categoryCode: "C5",
        questionIndex: 0,
        text: "I generate innovative ideas for teaching and learning.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C5_2",
        categoryCode: "C5",
        questionIndex: 1,
        text: "I experiment with new approaches and methods in my practice.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C5_3",
        categoryCode: "C5",
        questionIndex: 2,
        text: "I encourage and nurture creativity in my students.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C5_4",
        categoryCode: "C5",
        questionIndex: 3,
        text: "I find creative solutions to challenges in my work.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      }
    ]
  },
  {
    code: "C6",
    name: "Critical Thinking",
    section: "C",
    sectionName: "Skills Domain",
    maxScore: 6,
    questions: [
      {
        id: "C6_1",
        categoryCode: "C6",
        questionIndex: 0,
        text: "I analyze information carefully before making decisions.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C6_2",
        categoryCode: "C6",
        questionIndex: 1,
        text: "I question assumptions and seek evidence to support claims.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C6_3",
        categoryCode: "C6",
        questionIndex: 2,
        text: "I consider multiple perspectives when evaluating situations.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C6_4",
        categoryCode: "C6",
        questionIndex: 3,
        text: "I teach students to think critically about information.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C6_5",
        categoryCode: "C6",
        questionIndex: 4,
        text: "I reflect critically on my own teaching practice.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C6_6",
        categoryCode: "C6",
        questionIndex: 5,
        text: "I use data and evidence to inform my instructional decisions.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      }
    ]
  },
  {
    code: "C7",
    name: "Curiosity",
    section: "C",
    sectionName: "Skills Domain",
    maxScore: 6,
    questions: [
      {
        id: "C7_1",
        categoryCode: "C7",
        questionIndex: 0,
        text: "I am genuinely curious about how students learn.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C7_2",
        categoryCode: "C7",
        questionIndex: 1,
        text: "I actively seek out new knowledge and learning opportunities.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C7_3",
        categoryCode: "C7",
        questionIndex: 2,
        text: "I ask probing questions to deepen understanding.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      },
      {
        id: "C7_4",
        categoryCode: "C7",
        questionIndex: 3,
        text: "I model intellectual curiosity for my students.",
        scaleType: 6,
        scaleLabels: { low: "Not at all like me", high: "Very much like me" }
      }
    ]
  }
];

export const getTotalQuestions = (): number => {
  return preSurveyCategories.reduce((total, cat) => total + cat.questions.length, 0);
};

export const getSectionCategories = (section: 'A' | 'B' | 'C'): PreSurveyCategory[] => {
  return preSurveyCategories.filter(cat => cat.section === section);
};
