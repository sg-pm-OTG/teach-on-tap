import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle2, Sparkles } from "lucide-react";
import alcLogo from "@/assets/alc-logo.png";

const PostSurveyIntro = () => {
  const navigate = useNavigate();

  const accomplishments = [
    "Completed your baseline recording",
    "Attended the Masterclass",
    "Recorded teaching sessions",
    "Participated in Learning Huddles",
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-gradient-to-b from-primary/5 via-background to-background pt-[max(env(safe-area-inset-top),24px)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-8 pb-6 px-6 text-center">
        <img 
          src={alcLogo} 
          alt="Adult Learning Collaboratory" 
          className="h-12 w-auto mx-auto mb-6"
        />
        
        {/* Celebratory Icon */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-primary-foreground" />
          </div>
          <Sparkles className="w-5 h-5 text-secondary absolute -top-1 -right-1 animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          You're Almost There!
        </h1>
        <p className="text-muted-foreground text-sm">
          One final reflection before your journey concludes
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 space-y-5 overflow-y-auto">
        {/* Journey Acknowledgment Card */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            Look at everything you've accomplished!
          </h2>
          <div className="space-y-2.5">
            {accomplishments.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Survey Purpose Card */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-medium text-foreground mb-2">One last reflection</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Take a moment to reflect on how your learning beliefs may have evolved 
            through this program. Your responses will help capture your growth.
          </p>
        </div>

        {/* What's Next Teaser */}
        <div className="bg-muted/50 rounded-xl p-4">
          <h3 className="font-medium text-foreground text-sm mb-2">What's waiting for you</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 bg-secondary/20 text-secondary rounded-full flex items-center justify-center text-xs font-medium">1</span>
              Your personalized Final Report
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 bg-secondary/20 text-secondary rounded-full flex items-center justify-center text-xs font-medium">2</span>
              The Launch Huddle celebration
            </li>
          </ul>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Just 6 quick questions • Takes about 2 minutes
        </p>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <Button
          onClick={() => navigate("/post-survey/questions")}
          className="w-full gradient-primary text-primary-foreground"
          size="lg"
        >
          Begin My Final Reflection
        </Button>
      </div>
    </div>
  );
};

export default PostSurveyIntro;
