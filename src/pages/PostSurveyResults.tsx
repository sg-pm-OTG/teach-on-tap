import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Sparkles, FileText, Users, Heart, PartyPopper } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import alcLogo from "@/assets/alc-logo.png";

const PostSurveyResults = () => {
  const navigate = useNavigate();
  const { refetch: refetchProfile } = useProfile();

  useEffect(() => {
    // Refetch profile to get updated post_survey_completed status
    refetchProfile();
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-gradient-to-b from-secondary/10 via-primary/5 to-background pt-[max(env(safe-area-inset-top),24px)] pb-[env(safe-area-inset-bottom)]">
      {/* Header - Celebration */}
      <div className="pt-6 pb-4 px-6 text-center">
        <img 
          src={alcLogo} 
          alt="Adult Learning Collaboratory" 
          className="h-10 w-auto mx-auto mb-4"
        />
        
        {/* Celebratory Icon */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full flex items-center justify-center animate-scale-in">
            <PartyPopper className="w-8 h-8 text-secondary" />
          </div>
          <Sparkles className="w-5 h-5 text-primary absolute -top-1 -right-1 animate-pulse" />
          <Sparkles className="w-4 h-4 text-secondary absolute -bottom-0.5 -left-1 animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Congratulations!
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          You've completed your learning journey reflection
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-4 overflow-y-auto space-y-4">
        {/* Warm Thank You Card */}
        <Card className="p-4 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Thank you for your dedication
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your commitment to growth throughout this program has been incredible. 
                We're honored to have been part of your learning journey.
              </p>
            </div>
          </div>
        </Card>

        {/* Final Report Card */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Your Final Report is Coming
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We're preparing a personalized report that captures your growth — 
                comparing where you started to how far you've come.
              </p>
            </div>
          </div>
        </Card>

        {/* Launch Huddle Card */}
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                See You at the Launch Huddle!
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The celebration awaits! Join us to receive your Final Report, 
                share experiences with fellow educators, and celebrate this milestone together.
              </p>
            </div>
          </div>
        </Card>

        {/* Completion Badge */}
        <div className="flex items-center justify-center gap-2 py-3">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">
            Questionnaire completed • Responses saved
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <Button
          onClick={() => navigate("/")}
          className="w-full gradient-primary text-primary-foreground"
          size="lg"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default PostSurveyResults;
