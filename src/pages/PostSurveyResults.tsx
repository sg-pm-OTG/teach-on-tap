import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Sparkles, FileText, Home } from "lucide-react";
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
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background pt-[max(env(safe-area-inset-top),24px)] pb-[env(safe-area-inset-bottom)]">
      {/* Header - Celebration */}
      <div className="pt-6 pb-4 px-6 text-center">
        <img 
          src={alcLogo} 
          alt="Adult Learning Collaboratory" 
          className="h-10 w-auto mx-auto mb-4"
        />
        <div className="w-14 h-14 bg-gradient-to-br from-success/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 relative">
          <CheckCircle2 className="w-7 h-7 text-success" />
          <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Thank You!</h1>
        <p className="text-muted-foreground">
          You've completed your post-survey assessment
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-4 overflow-y-auto space-y-4">
        {/* Acknowledgment Card */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                6 questions completed
              </p>
              <p className="text-xs text-muted-foreground">
                Your responses have been saved successfully. Thank you for sharing your updated learning beliefs with us.
              </p>
            </div>
          </div>
        </Card>

        {/* Final Report Card */}
        <Card className="p-4 bg-accent/50 border-accent">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Included in Your Final Report
              </p>
              <p className="text-xs text-muted-foreground">
                Your post-survey results will be compared with your pre-survey to show your growth throughout the FOP program.
              </p>
            </div>
          </div>
        </Card>

        {/* What's Next Card */}
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/30 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                What's Next
              </p>
              <p className="text-xs text-muted-foreground">
                Your Final Report will be generated soon. Check your journey progress on the home page for updates.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <Button
          onClick={() => navigate("/")}
          className="w-full gradient-primary text-primary-foreground"
          size="lg"
        >
          Continue to Home
        </Button>
      </div>
    </div>
  );
};

export default PostSurveyResults;
