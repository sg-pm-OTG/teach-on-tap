import { MessageCircle, Sparkles } from "lucide-react";

interface AIInsightCardProps {
  strengths: { label: string; score: number }[];
  focusAreas: { label: string; score: number }[];
}

const getActionableTip = (focusArea: string): string => {
  const tips: Record<string, string> = {
    // Scenario Markers
    "authentic context": "Frame activities around real workplace challenges your learners face",
    "authentic resources": "Incorporate real documents, tools, or data from actual practice settings",
    "ownership": "Let learners choose how they approach problems and what solutions they propose",
    "ill-defined problem": "Present problems without clear-cut answers to encourage deeper thinking",
    "relevant to adults": "Connect content to learners' existing experience and career goals",
    "final product": "Have learners create something tangible they can use in their work",
    // Dialogue Markers
    "open questions": "Try starting with 'What do you think about...' or 'How might we...'",
    "wait time": "Count to 5 silently after asking a question before responding",
    "probing": "Follow up with 'Tell me more...' or 'What led you to that conclusion?'",
    "uptake": "Build on what participants say: 'Building on Sarah's point...'",
    "connections": "Ask 'How does this relate to what we discussed earlier?'",
    "meta-dialogue": "Pause to reflect: 'Let's think about how we're approaching this problem'",
    "constructive challenge": "Gently push back: 'What might be a counterargument to that?'",
  };
  
  const lowerFocus = focusArea.toLowerCase();
  const key = Object.keys(tips).find(k => lowerFocus.includes(k));
  return key ? tips[key] : "Pause and reflect before your next question.";
};

const getEncouragementMessage = (label: string, score: number): string => {
  const lowerLabel = label.toLowerCase();
  if (score >= 4) {
    return `Excellent mastery of <span class="text-success font-semibold">${lowerLabel}</span>! Keep it up.`;
  } else if (score >= 3) {
    return `Great work on <span class="text-success font-semibold">${lowerLabel}</span>! You're making real progress.`;
  } else {
    return `You're building strength in <span class="text-success font-semibold">${lowerLabel}</span>. Keep practicing!`;
  }
};

export const AIInsightCard = ({ strengths, focusAreas }: AIInsightCardProps) => {
  const topStrength = strengths[0] || { label: "Active engagement", score: 3 };
  const topFocus = focusAreas[0]?.label || "Open Questions";
  const actionableTip = getActionableTip(topFocus);
  const encouragementMessage = getEncouragementMessage(topStrength.label, topStrength.score);

  return (
    <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 rounded-2xl p-5 border border-border animate-slide-in-up">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg">
          <MessageCircle className="h-5 w-5 text-primary-foreground" />
        </div>
        <h3 className="font-semibold text-foreground flex items-center gap-1.5 mt-2.5">
          Your Coach Says
          <Sparkles className="h-4 w-4 text-secondary" />
        </h3>
      </div>
      
      <div className="space-y-3">
        <p 
          className="text-sm text-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: `"${encouragementMessage} 💪"` }}
        />
        
        <div className="bg-background/60 rounded-xl p-3 border border-border/50">
          <p className="text-xs font-medium text-secondary mb-1 flex items-center gap-1">
            <span className="text-base">💡</span> Try This Next
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Focus on <span className="text-secondary font-medium">{topFocus.toLowerCase()}</span>. {actionableTip}
          </p>
        </div>
      </div>
    </div>
  );
};
