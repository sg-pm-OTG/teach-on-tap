import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Sparkles, GraduationCap, Mic, ClipboardCheck, FileText } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import alcLogo from "@/assets/alc-logo.png";

const journeySteps = [
  {
    id: 1,
    label: "Pre-Survey Complete",
    icon: ClipboardCheck,
    status: "complete" as const,
  },
  {
    id: 2,
    label: "Record Baseline Session",
    icon: Mic,
    status: "next" as const,
    description: "Your next step",
  },
  {
    id: 3,
    label: "Attend Masterclass",
    icon: GraduationCap,
    status: "upcoming" as const,
  },
  {
    id: 4,
    label: "Record Teaching Sessions",
    icon: Mic,
    status: "upcoming" as const,
  },
  {
    id: 5,
    label: "Complete Post-Survey",
    icon: ClipboardCheck,
    status: "upcoming" as const,
  },
  {
    id: 6,
    label: "Final Report & Launch Huddle",
    icon: FileText,
    status: "upcoming" as const,
  },
];

const PreSurveyResults = () => {
  const navigate = useNavigate();
  const { refetch: refetchProfile } = useProfile();

  useEffect(() => {
    // Refetch profile to get updated pre_survey_completed status
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
          You've completed your pre-survey assessment
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-4 overflow-y-auto space-y-4">
        {/* Acknowledgment Card */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                31 questions across 12 categories
              </p>
              <p className="text-xs text-muted-foreground">
                Thank you for taking the time to share your learning practices with us. Your responses help us understand your starting point.
              </p>
            </div>
          </div>
        </Card>

        {/* Expectation Setting Card */}
        <Card className="p-4 bg-accent/50 border-accent">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Results in Your Final Report
              </p>
              <p className="text-xs text-muted-foreground">
                Your pre-survey results will be compared with your post-survey to show your growth throughout the program.
              </p>
            </div>
          </div>
        </Card>

        {/* Journey Timeline */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Your Journey</h2>
          <div className="space-y-0">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === journeySteps.length - 1;
              
              return (
                <div key={step.id} className="flex gap-3">
                  {/* Timeline line and dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === "complete"
                          ? "bg-success text-success-foreground"
                          : step.status === "next"
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.status === "complete" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 h-8 ${
                          step.status === "complete" ? "bg-success" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="pb-6">
                    <p
                      className={`text-sm font-medium ${
                        step.status === "complete"
                          ? "text-success"
                          : step.status === "next"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">
                        {step.description}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* What's Next Section */}
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/30 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                What's Next: Record Your Baseline
              </p>
              <p className="text-xs text-muted-foreground">
                Your first recording establishes a baseline of your current teaching style. This will be compared with later sessions to show your growth throughout the FOP program.
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

export default PreSurveyResults;
