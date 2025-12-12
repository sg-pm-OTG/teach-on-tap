// Placeholder national average benchmarks - to be updated with real data
// All categories now use a 6-point scale (max score = 6)
export const nationalBenchmarks: Record<string, number> = {
  // Section A: Learning Beliefs (max 6)
  A1: 4.5, // Learning as acquisition
  A2: 4.3, // Learning as participation
  A3: 4.2, // Learning as knowledge building

  // Section B: Learning Orientation (max 6)
  B1: 4.6, // Internal motivation
  B2: 4.8, // Skills mastery
  B3: 4.4, // Deep learning

  // Section C: Good Job Framework (max 6)
  C1: 5.0, // TAE knowledge
  C2: 4.9, // Social Context (Teamwork)
  C3: 3.8, // Task complexity
  C4: 4.2, // Work autonomy
  C5: 3.5, // Professional development support
  C6: 3.8, // Job prospects
};

// Placeholder recommendations - to be updated with real recommendations
export const recommendations: Record<string, string> = {
  // Section A: Learning Beliefs
  A1: "Consider balancing structured knowledge acquisition with more exploratory learning approaches to give learners a stronger foundation while maintaining engagement.",
  A2: "Focus on creating more opportunities for meaningful interaction and collaborative learning experiences in your sessions.",
  A3: "Encourage learners to generate their own insights and solutions by incorporating more open-ended problems and knowledge-building activities.",

  // Section B: Learning Orientation
  B1: "Reflect on your learning habits and consider setting regular learning goals that align with your personal and professional aspirations.",
  B2: "Identify opportunities to develop and apply your expertise more fully, seeking out challenges that allow you to demonstrate and grow your skills.",
  B3: "Practice connecting new information to your existing knowledge and real-world applications to deepen your understanding and retention.",

  // Section C: Good Job Framework
  C1: "Invest in developing your subject matter expertise and pedagogical knowledge through targeted professional development opportunities.",
  C2: "Seek out collaborative projects and team-based initiatives to strengthen your social context and teamwork skills, contributing more effectively to group objectives.",
  C3: "Look for opportunities to engage with more complex problems in your work, which can help develop your problem-solving capabilities.",
  C4: "Discuss with your supervisor ways to increase your autonomy in decision-making around your work tasks and schedule.",
  C5: "Advocate for professional development support from your organization, including time during working hours and financial resources for training.",
  C6: "Have conversations with leadership about career progression paths and how your professional development connects to advancement opportunities.",
};
