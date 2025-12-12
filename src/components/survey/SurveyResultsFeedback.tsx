import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, Heart, Sun, MessageCircle, BookOpen, Lightbulb, Pencil } from "lucide-react";
import type { SurveyData } from "@/types/survey";

interface SurveyResultsFeedbackProps {
  surveyData: SurveyData;
  onContinue: () => void;
}

export const SurveyResultsFeedback = ({ surveyData, onContinue }: SurveyResultsFeedbackProps) => {
  const didNotEngage = surveyData.engagementTypes.includes("I did not engage with FOP");
  const practised = surveyData.engagementTypes.includes("I practised FOP in a learning session");
  const discussed = surveyData.engagementTypes.includes("I discussed FOP with someone");
  const reflected = surveyData.engagementTypes.includes("I reflected on FOP");
  const lookedForResources = surveyData.engagementTypes.includes("I looked for FOP-related resources or materials");
  const designed = surveyData.engagementTypes.includes("I designed a learning activity using FOP for a future session");

  const getEngagementMessages = () => {
    const messages: { icon: React.ReactNode; text: string }[] = [];
    
    if (practised) {
      messages.push({ icon: <Trophy className="h-5 w-5 text-tertiary" />, text: "You put FOP into action - that's the best way to learn!" });
    }
    if (discussed) {
      messages.push({ icon: <MessageCircle className="h-5 w-5 text-secondary" />, text: "Sharing knowledge multiplies it!" });
    }
    if (reflected) {
      messages.push({ icon: <Lightbulb className="h-5 w-5 text-tertiary" />, text: "Reflection deepens understanding - great habit!" });
    }
    if (lookedForResources) {
      messages.push({ icon: <BookOpen className="h-5 w-5 text-primary" />, text: "Curiosity drives growth - keep exploring!" });
    }
    if (designed) {
      messages.push({ icon: <Pencil className="h-5 w-5 text-secondary" />, text: "You're designing with FOP - impressive!" });
    }
    
    return messages;
  };

  const getConfidenceMessage = () => {
    if (!surveyData.confidenceChange) return null;
    
    if (surveyData.confidenceChange.includes("much more confident")) {
      return "Your confidence is soaring! 🚀";
    }
    if (surveyData.confidenceChange.includes("more confident")) {
      return "Your confidence is growing! 💪";
    }
    return null;
  };

  if (didNotEngage) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
        {/* Warm Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-tertiary/20 flex items-center justify-center">
            <Heart className="h-7 w-7 text-tertiary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">
          Every Week is a Fresh Start
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          Thank you for your honesty. We all have busy weeks!
        </p>

        {/* Tips Section */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sun className="h-5 w-5 text-tertiary" />
            Quick Ways to Engage This Week
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">1</span>
              <span>Try a 5-minute reflection after your next session</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">2</span>
              <span>Discuss one FOP concept with a colleague</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">3</span>
              <span>Look for one emergent scenario opportunity</span>
            </li>
          </ul>
        </div>

        {/* Motivational Quote */}
        <div className="text-center mb-6 p-4 border border-border rounded-lg bg-background">
          <p className="text-sm italic text-muted-foreground">
            "Progress is not about perfection. It's about showing up, one step at a time."
          </p>
        </div>

        <Button onClick={onContinue} className="w-full" size="lg">
          View My Report
        </Button>
      </div>
    );
  }

  // User engaged with FOP
  const engagementMessages = getEngagementMessages();
  const confidenceMessage = getConfidenceMessage();

  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
      {/* Celebratory Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Sparkles className="h-6 w-6 text-tertiary animate-pulse" />
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
          <Trophy className="h-8 w-8 text-primary-foreground" />
        </div>
        <Sparkles className="h-6 w-6 text-tertiary animate-pulse" />
      </div>
      
      <h2 className="text-2xl font-bold text-foreground text-center mb-2">
        Amazing Work This Week!
      </h2>
      <p className="text-muted-foreground text-center mb-6">
        You're making real progress on your FOP journey
      </p>

      {/* Engagement Highlights */}
      <div className="space-y-3 mb-6">
        {engagementMessages.map((msg, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {msg.icon}
            <span className="text-sm text-foreground">{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Confidence Boost */}
      {confidenceMessage && (
        <div className="text-center p-4 gradient-secondary rounded-lg mb-6">
          <p className="font-semibold text-secondary-foreground">{confidenceMessage}</p>
        </div>
      )}

      {/* Time Spent */}
      {surveyData.timeSpent && (
        <div className="text-center mb-6 p-3 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">
            Time invested: <span className="font-semibold text-foreground">{surveyData.timeSpent}</span>
          </p>
        </div>
      )}

      {/* Encouragement */}
      <p className="text-center text-sm text-muted-foreground mb-6">
        Keep up the momentum - your dedication is building real expertise!
      </p>

      <Button onClick={onContinue} className="w-full" size="lg">
        View My Report
      </Button>
    </div>
  );
};
