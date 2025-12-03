import { Target, Wrench, Brain, Compass, Users } from "lucide-react";

export const sessionDetails = {
  title: "FOP Analysis Full Report",
  useSite: "US01",
  date: "October 11, 2025",
  participants: 13,
  activityType: "Classroom lesson",
  userName: "User",
};

export const speakers = [
  { id: "Speaker 1", description: "Facilitator leading the session." },
  { id: "Speaker 2", description: "Regularly contributes practical suggestions and personal classroom experiences." },
  { id: "Speaker 3", description: "Actively engages with questions about behaviour management strategies." },
  { id: "Speaker 4", description: "Offers insights from a primary school context." },
  { id: "Speaker 5", description: "Shares experiences from secondary education, often providing contrast." },
  { id: "Speaker 6", description: "Brings up the emotional side of dealing with disruptions." },
  { id: "Speaker 7", description: "Focuses on long-term approaches and building relationships with students." },
  { id: "Speaker 8", description: "Asks clarifying questions and seeks deeper understanding of issues raised." },
  { id: "Speaker 9", description: "Provides administrative or institutional perspective when relevant." },
];

export const themes = [
  {
    title: "Managing disruptive adult learners",
    icon: Target,
    accentColor: "bg-rose-100",
    bullets: [
      "Participants discussed strategies for handling adult learners who exhibit disruptive behaviours similar to children.",
      "Examples included talking over the facilitator and refusing to participate in activities.",
    ],
  },
  {
    title: "Strategies for regaining classroom control",
    icon: Wrench,
    accentColor: "bg-amber-100",
    bullets: [
      "Various techniques were shared, such as proximity, redirection, and setting clear expectations.",
      "Some participants emphasized preventive measures over reactive ones.",
    ],
  },
  {
    title: "Facilitator emotional regulation",
    icon: Brain,
    accentColor: "bg-purple-100",
    bullets: [
      "Discussion on staying calm when faced with challenging behaviour.",
      "Importance of modelling composure and not escalating conflicts.",
    ],
  },
  {
    title: "Adaptive teaching and flexibility",
    icon: Compass,
    accentColor: "bg-blue-100",
    bullets: [
      "Participants explored how to adjust lesson plans on the fly when disruptions occur.",
      "Emphasis on having backup activities and flexible timing.",
    ],
  },
  {
    title: "Influence of group dynamics",
    icon: Users,
    accentColor: "bg-emerald-100",
    bullets: [
      "How the behaviour of one participant can influence the entire group.",
      "Strategies for leveraging positive peer pressure.",
    ],
  },
];

export const conclusions = [
  "Dealing with disruptive adult learners requires patience, flexibility, and clear communication.",
  "Preventive strategies are often more effective than reactive measures.",
  "Emotional regulation is crucial for maintaining a productive learning environment.",
  "Group dynamics play a significant role in shaping individual behaviour.",
  "Adaptability in teaching approaches can help mitigate the impact of disruptions.",
];

export const talkTimeData = [
  { speaker: "Speaker 1", percentage: 32, color: "bg-teal-500" },
  { speaker: "Speaker 2", percentage: 15, color: "bg-blue-500" },
  { speaker: "Speaker 3", percentage: 12, color: "bg-purple-500" },
  { speaker: "Speaker 4", percentage: 10, color: "bg-pink-500" },
  { speaker: "Speaker 5", percentage: 9, color: "bg-orange-500" },
  { speaker: "Speaker 6", percentage: 8, color: "bg-emerald-500" },
  { speaker: "Speaker 7", percentage: 7, color: "bg-indigo-500" },
  { speaker: "Speaker 8", percentage: 4, color: "bg-rose-500" },
  { speaker: "Speaker 9", percentage: 3, color: "bg-cyan-500" },
];

export const scenarioContent = {
  title: "Anne-Marie's FOP 2 session",
  content: [
    "Anne-Marie is a facilitator conducting a professional development session for teachers on classroom management. The session is interactive and requires participant engagement.",
    "Alex, one of the participants, begins exhibiting disruptive behaviours:",
    "• Talking loudly to neighbours during instruction",
    "• Checking phone repeatedly and visibly",
    "• Making dismissive comments about the content",
    "Other participants notice and some begin to disengage. Anne-Marie must decide how to address the situation while maintaining a positive learning environment for all.",
  ],
};

export const scenarioScores = [
  { label: "Real-world relevance", score: 3 },
  { label: "High enough level of complexity", score: 2 },
  { label: "Critical thinking and reasoning", score: 2 },
  { label: "Perspective-taking", score: 3 },
  { label: "Interdisciplinarity", score: 2 },
  { label: "Challenging and change-making", score: 2 },
];

export const scenarioAnalysis = [
  {
    title: "Real-world relevance",
    score: 3,
    content: "The scenario directly mirrors situations facilitators commonly face in professional development settings. The behaviours described are authentic and frequently reported by educators. The context is immediately applicable to participants' daily work.",
  },
  {
    title: "High enough level of complexity",
    score: 2,
    content: "The scenario presents multiple layers: individual behaviour management, group dynamics, maintaining session objectives, and professional relationships. However, the complexity could be enhanced by adding institutional constraints or conflicting priorities.",
  },
  {
    title: "Critical thinking and reasoning",
    score: 2,
    content: "Participants must analyze the situation from multiple angles and consider consequences of various approaches. The scenario encourages weighing short-term solutions against long-term relationship building.",
  },
  {
    title: "Perspective-taking",
    score: 3,
    content: "The scenario naturally prompts consideration of multiple viewpoints: the facilitator's, the disruptive participant's, other participants', and potentially institutional stakeholders. This multi-perspective approach enriches discussion.",
  },
  {
    title: "Interdisciplinarity",
    score: 2,
    content: "The scenario touches on psychology, adult learning theory, group dynamics, and conflict resolution. Integration of these disciplines could be made more explicit to deepen learning.",
  },
  {
    title: "Challenging and change-making",
    score: 2,
    content: "The scenario challenges participants to reconsider default responses to disruption. It has potential to shift mindsets from punitive to constructive approaches, though this transformative element could be strengthened.",
  },
];

export const dialogueScores = [
  { label: "Active Engagement", score: 3 },
  { label: "Open-Ended Questions", score: 2 },
  { label: "Reflective Elements", score: 3 },
  { label: "Collaborative Problem Solving", score: 2 },
  { label: "Respectful Listening", score: 2 },
  { label: "Emergent Ideas", score: 2 },
  { label: "Emotional/Cognitive Engagement", score: 3 },
];

export const dialogueAnalysis = [
  {
    title: "Active Engagement",
    score: 3,
    content: "Participants demonstrated high levels of engagement throughout the session, with multiple speakers contributing substantive comments and building on each other's ideas.",
  },
  {
    title: "Open-Ended Questions",
    score: 2,
    content: "The facilitator posed several open-ended questions that sparked discussion. However, there were opportunities to dig deeper with follow-up probing questions.",
    opportunity: {
      speaker: "Speaker 3",
      quote: "I usually just ignore it and hope it stops",
      observation: "This comment revealed a common but potentially ineffective strategy.",
      opportunity: "Follow up with 'What happens when ignoring doesn't work? What alternatives have you considered?'",
    },
  },
  {
    title: "Reflective Elements",
    score: 3,
    content: "Strong reflective practice was evident, with participants connecting the scenario to their own experiences and examining their assumptions about behaviour management.",
  },
  {
    title: "Collaborative Problem Solving",
    score: 2,
    content: "Participants worked together to generate solutions, though the collaboration could be more structured to ensure all voices are heard equally.",
    opportunity: {
      speaker: "Speaker 6",
      quote: "It's frustrating when one person derails everything you planned",
      observation: "This emotional response indicates personal connection to the scenario.",
      opportunity: "Invite the group to co-develop strategies: 'How might we support each other in similar situations?'",
    },
  },
  {
    title: "Respectful Listening",
    score: 2,
    content: "Generally good listening behaviours, though there were instances of speakers talking over each other or prematurely offering solutions before fully understanding the speaker's point.",
  },
  {
    title: "Emergent Ideas",
    score: 2,
    content: "Several new ideas emerged from the discussion, including the concept of 'preventive relationship building' and 'strategic vulnerability' as facilitation tools.",
  },
  {
    title: "Emotional/Cognitive Engagement",
    score: 3,
    content: "High emotional investment was evident, with participants sharing personal frustrations and breakthrough moments. This emotional connection enhanced the learning experience.",
  },
];

export const finalSummary = [
  "This session demonstrated strong engagement with a highly relevant scenario. Participants actively shared experiences and collaboratively explored solutions for managing disruptive adult learners.",
  "Key strengths include the authentic real-world scenario, high participant engagement, and meaningful reflection on personal practice.",
  "Areas for growth include deepening the complexity of analysis through more probing questions and ensuring more structured opportunities for all participants to contribute equally.",
  "The emotional connection participants showed to this topic suggests it addresses a genuine professional need and could be developed further in future sessions.",
];
