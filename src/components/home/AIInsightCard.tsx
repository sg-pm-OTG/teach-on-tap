import { MessageCircle, Sparkles } from "lucide-react";

interface AIInsightCardProps {
  strengths: { label: string; score: number }[];
  focusAreas: { label: string; score: number }[];
}

const getActionableTip = (focusArea: string): string => {
  const tips: Record<string, string> = {
    "open-ended questions": "Try starting with 'What do you think about...' or 'How might we...'",
    "wait time": "Count to 5 silently after asking a question before responding",
    "student voice": "Have learners share their thinking with a partner first",
    "scaffolding": "Break complex tasks into smaller, manageable steps",
    "feedback": "Ask 'What worked well?' before offering suggestions",
  };
  
  const key = Object.keys(tips).find(k => focusArea.toLowerCase().includes(k));
  return key ? tips[key] : "Pause and reflect before your next question.";
};

export const AIInsightCard = ({ strengths, focusAreas }: AIInsightCardProps) => {
  const topStrength = strengths[0]?.label || "Active engagement";
  const topFocus = focusAreas[0]?.label || "Open-ended questions";
  const actionableTip = getActionableTip(topFocus);

  return (
    <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 rounded-2xl p-5 border border-border animate-slide-in-up">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg">
          <MessageCircle className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-1.5">
            Your Coach Says
            <Sparkles className="h-4 w-4 text-secondary" />
          </h3>
          <p className="text-xs text-muted-foreground">Personalized for you</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-foreground leading-relaxed">
          "Great work on <span className="text-success font-semibold">{topStrength.toLowerCase()}</span>! 
          You're making real progress. 💪"
        </p>
        
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
