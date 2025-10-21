import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Processing = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate processing progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to report after completion
          setTimeout(() => {
            navigate("/reports");
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full gradient-accent animate-pulse-slow flex items-center justify-center">
              <Loader2 className="h-16 w-16 text-primary-foreground animate-spin" />
            </div>
          </div>

          {/* Status */}
          <div className="text-center space-y-2 animate-slide-in-up">
            <h2 className="text-2xl font-bold text-foreground">
              Processing your session...
            </h2>
            <p className="text-muted-foreground">
              AI is analyzing your teaching patterns
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs space-y-2 animate-slide-in-up">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-secondary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Service Logos */}
          <div className="flex items-center gap-6 pt-4 animate-slide-in-up">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">SM</span>
              </div>
              <p className="text-xs text-muted-foreground">Speechmatics</p>
            </div>
            <div className="w-8 h-0.5 bg-border" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 border-2 border-secondary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-secondary">AI</span>
              </div>
              <p className="text-xs text-muted-foreground">OpenAI</p>
            </div>
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center max-w-xs animate-slide-in-up">
            This may take a few moments. We're transcribing your audio and generating
            personalized insights.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Processing;
