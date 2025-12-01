import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SurveyContainer } from "@/components/survey/SurveyContainer";

const Processing = () => {
  const [progress, setProgress] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [surveyComplete, setSurveyComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate processing progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessingComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Navigate only when both processing and survey are complete
    if (processingComplete && surveyComplete) {
      setTimeout(() => {
        navigate("/reports");
      }, 1000);
    }
  }, [processingComplete, surveyComplete, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 flex-1 overflow-y-auto">
        {/* Compact Processing Indicator */}
        <div className="mb-6 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center animate-pulse-slow">
              <Loader2 className="h-6 w-6 text-primary-foreground animate-spin" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {processingComplete ? "Analysis complete!" : "Processing your session..."}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-secondary transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground min-w-[40px] text-right">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Section */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Weekly Progress Check
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            While we analyze your session, please complete this quick survey about your FOP engagement this week.
          </p>
          
          <SurveyContainer onComplete={() => setSurveyComplete(true)} />
        </div>

        {/* Waiting Message */}
        {surveyComplete && !processingComplete && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Survey submitted! Waiting for analysis to complete...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Processing;
