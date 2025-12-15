import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, Target } from "lucide-react";
import alcLogo from "@/assets/alc-logo.png";

const PreSurveyIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background pt-[max(env(safe-area-inset-top),24px)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-8 pb-6 px-6 text-center">
        <img 
          src={alcLogo} 
          alt="Adult Learning Collaboratory" 
          className="h-12 w-auto mx-auto mb-4"
        />
        <h1 className="text-xl font-bold text-foreground mb-6">
          Your FOP Journey
        </h1>
        <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          A Few Questions Before We Start
        </h2>
        <p className="text-muted-foreground text-sm">
          Help us personalize your FOP journey
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 space-y-6 overflow-y-auto">
        <div className="bg-card rounded-xl p-4 border border-border">
          <h2 className="font-medium text-foreground mb-3">Here's what we'll cover</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">31 Questions</p>
                <p className="text-xs text-muted-foreground">
                  Across 3 sections covering your learning practices
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">12 Categories</p>
                <p className="text-xs text-muted-foreground">
                  From learning beliefs to professional development
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4">
          <h3 className="font-medium text-foreground text-sm mb-2">Sections</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">A</span>
              Learning Beliefs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">B</span>
              Learning Orientation
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">C</span>
              Good Job Framework
            </li>
          </ul>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Takes approximately 10 minutes to complete
        </p>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
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
