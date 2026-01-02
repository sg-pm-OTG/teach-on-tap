import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import alcLogo from "@/assets/alc-logo.png";

const PreSurveyIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-gradient-to-b from-primary/5 via-background to-background pt-[max(env(safe-area-inset-top),24px)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-8 pb-6 px-6 text-center">
        {/* App Identity - Top */}
        <span className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          FOP Companion
        </span>
        
        {/* Main Headline */}
        <h1 className="text-2xl font-bold text-foreground mb-2 mt-6">
          A Few Questions Before We Start
        </h1>
        
        {/* Subtitle */}
        <p className="text-muted-foreground">
          Help us personalize your FOP journey
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 space-y-6 overflow-y-auto">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">34 Questions</p>
              <p className="text-xs text-muted-foreground">
                Quick scale-based responses about your learning practices
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Takes approximately 10 minutes to complete
        </p>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        {/* Branding - Bottom */}
        <div className="flex items-center justify-center mb-4">
          <img 
            src={alcLogo} 
            alt="Adult Learning Collaboratory" 
            className="h-6 w-auto opacity-60"
          />
        </div>
        
        <Button
          onClick={() => navigate("/pre-survey/questions")}
          className="w-full gradient-primary text-primary-foreground"
          size="lg"
        >
          Let's Go!
        </Button>
      </div>
    </div>
  );
};

export default PreSurveyIntro;
