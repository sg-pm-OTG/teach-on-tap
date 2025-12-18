// Mock report generator for simulating AI analysis results

interface SessionDetails {
  use_site: string;
  number_of_participants: number;
  session_type: string;
  session_date: string;
  emergent_scenario?: string;
}

const scenarioLabels = [
  "Authentic Context",
  "Authentic Resources",
  "Ownership",
  "Ill-defined Problem",
  "Relevant to Adults",
  "Final Product"
];

const dialogueLabels = [
  "Open Questions",
  "Wait Time",
  "Probing",
  "Uptake",
  "Connections",
  "Meta-Dialogue",
  "Constructive Challenge"
];

const themeTemplates = [
  { title: "Problem-Based Learning Approach", description: "Discussion focused on presenting ill-defined problems that required collaborative problem-solving skills." },
  { title: "Active Learner Engagement", description: "Participants demonstrated high levels of engagement through questioning and collaborative discussion." },
  { title: "Real-World Application", description: "Strong connections made between learning content and practical workplace scenarios." },
  { title: "Reflective Practice", description: "Facilitator encouraged metacognitive reflection on the learning process itself." },
  { title: "Collaborative Knowledge Building", description: "Group members built upon each other's ideas to construct shared understanding." },
  { title: "Critical Thinking Development", description: "Questions and discussions promoted analytical and evaluative thinking skills." }
];

const conclusionTemplates = [
  "The session demonstrated strong facilitation techniques with room for improvement in wait time after questions.",
  "Participants showed high engagement levels, particularly during problem-solving activities.",
  "The use of authentic resources enhanced the learning experience significantly.",
  "Consider increasing opportunities for learner ownership in future sessions.",
  "Meta-dialogue moments helped participants reflect on their learning processes.",
  "The session effectively balanced facilitator guidance with participant exploration."
];

const scenarioAnalysisTemplates = [
  { summary: "Strong use of authentic context and resources", details: "The session effectively situated learning within a realistic professional context." },
  { summary: "Learner ownership could be enhanced", details: "Consider providing more opportunities for participants to direct their own learning journey." },
  { summary: "Well-designed ill-defined problem", details: "The problem presented allowed for multiple solution pathways and encouraged critical thinking." }
];

const dialogueAnalysisTemplates = [
  { summary: "Effective use of open-ended questions", details: "Questions invited exploration and multiple perspectives from participants." },
  { summary: "Wait time could be extended", details: "Allow more silence after questions to give participants time to formulate thoughtful responses." },
  { summary: "Strong probing and follow-up", details: "Facilitator effectively deepened discussions by asking clarifying and extending questions." }
];

function randomScore(): number {
  // Generate scores between 1-4 with some variance
  return Math.floor(Math.random() * 4) + 1;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateMockReport(sessionDetails: SessionDetails) {
  const numParticipants = sessionDetails.number_of_participants;
  
  // Generate scores
  const scenarioScores = scenarioLabels.map(label => ({
    label,
    score: randomScore()
  }));
  
  const dialogueScores = dialogueLabels.map(label => ({
    label,
    score: randomScore()
  }));
  
  // Generate scenario analysis
  const scenarioAnalysis = scenarioLabels.map(label => {
    const template = shuffleAndPick(scenarioAnalysisTemplates, 1)[0];
    return {
      marker: label,
      rating: randomScore(),
      summary: template.summary,
      details: template.details
    };
  });
  
  // Generate dialogue analysis
  const dialogueAnalysis = dialogueLabels.map(label => {
    const template = shuffleAndPick(dialogueAnalysisTemplates, 1)[0];
    return {
      marker: label,
      rating: randomScore(),
      summary: template.summary,
      details: template.details
    };
  });
  
  // Generate talk time data
  const totalSeconds = Math.floor(randomFloat(2400, 4800)); // 40-80 minutes
  const facilitatorPercent = randomFloat(0.25, 0.45);
  const facilitatorSeconds = Math.floor(totalSeconds * facilitatorPercent);
  const remainingSeconds = totalSeconds - facilitatorSeconds;
  
  const talkTimeDataRaw: { speaker: string; seconds: number; color: string }[] = [
    { speaker: "Facilitator", seconds: facilitatorSeconds, color: "hsl(var(--primary))" }
  ];
  
  // Distribute remaining time among participants
  let usedSeconds = facilitatorSeconds;
  for (let i = 1; i <= numParticipants; i++) {
    const isLast = i === numParticipants;
    const participantSeconds = isLast 
      ? totalSeconds - usedSeconds 
      : Math.floor(remainingSeconds / numParticipants * randomFloat(0.7, 1.3));
    
    talkTimeDataRaw.push({
      speaker: `Participant ${i}`,
      seconds: Math.max(60, participantSeconds),
      color: `hsl(${(i * 60) % 360}, 60%, 50%)`
    });
    usedSeconds += participantSeconds;
  }

  // Add percentage to each entry
  const totalTimeForPercentage = talkTimeDataRaw.reduce((sum, t) => sum + t.seconds, 0);
  const talkTimeData = talkTimeDataRaw.map(item => ({
    ...item,
    percentage: Math.round((item.seconds / totalTimeForPercentage) * 100 * 10) / 10
  }));
  
  // Generate speakers
  const speakers = [
    { name: "Facilitator", role: "Session Lead", talkTime: `${Math.round(facilitatorSeconds / 60)}m` }
  ];
  for (let i = 1; i <= numParticipants; i++) {
    const participantTime = talkTimeData.find(t => t.speaker === `Participant ${i}`)?.seconds || 0;
    speakers.push({
      name: `Participant ${i}`,
      role: "Learner",
      talkTime: `${Math.round(participantTime / 60)}m`
    });
  }
  
  // Generate themes
  const themes = shuffleAndPick(themeTemplates, Math.min(4, Math.floor(randomFloat(2, 5))));
  
  // Generate conclusions
  const conclusions = shuffleAndPick(conclusionTemplates, Math.min(4, Math.floor(randomFloat(2, 5))));
  
  // Generate speaker interactions (heat map data)
  const allSpeakers = ["Facilitator", ...Array.from({ length: numParticipants }, (_, i) => `Participant ${i + 1}`)];
  const speakerInteractions = allSpeakers.map(from => ({
    from,
    interactions: allSpeakers.map(to => ({
      to,
      count: from === to ? 0 : Math.floor(randomFloat(0, 15))
    }))
  }));
  
  // Scenario content
  const scenarioContent = {
    title: sessionDetails.emergent_scenario || "Session Scenario",
    description: `A ${sessionDetails.session_type.toLowerCase()} session conducted at ${sessionDetails.use_site} with ${numParticipants} participant${numParticipants > 1 ? 's' : ''}.`,
    context: "The session focused on applying adult learning principles in a practical context."
  };
  
  // Final summary
  const avgScenarioScore = scenarioScores.reduce((sum, s) => sum + s.score, 0) / scenarioScores.length;
  const avgDialogueScore = dialogueScores.reduce((sum, s) => sum + s.score, 0) / dialogueScores.length;
  const overallScore = (avgScenarioScore + avgDialogueScore) / 2;
  
  const finalSummary = {
    overallScore: Math.round(overallScore),
    strengths: scenarioScores.concat(dialogueScores)
      .filter(s => s.score >= 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.label),
    areasForImprovement: scenarioScores.concat(dialogueScores)
      .filter(s => s.score <= 2)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map(s => s.label),
    recommendation: "Continue to build on your strengths while focusing on the identified areas for improvement in your next session."
  };
  
  return {
    scenario_scores: scenarioScores,
    dialogue_scores: dialogueScores,
    scenario_analysis: scenarioAnalysis,
    dialogue_analysis: dialogueAnalysis,
    talk_time_data: talkTimeData,
    themes,
    conclusions,
    speaker_interactions: speakerInteractions,
    speakers,
    scenario_content: scenarioContent,
    final_summary: finalSummary
  };
}
