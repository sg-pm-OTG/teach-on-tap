import { CheckCircle, Mic, GraduationCap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";

const BaselineSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
          {/* Success Icon */}
          <div className="relative animate-slide-in-up">
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🎉</div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-3 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
            <h1 className="text-2xl font-bold text-foreground">
              Baseline Recorded!
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Congratulations! You've completed your first milestone. Your baseline recording provides a helpful starting snapshot of your current practice, so that you can later see how it has shifted over the course of your FOP journey.
            </p>
          </div>

          {/* Milestone Progress */}
          <div className="w-full max-w-xs space-y-3 animate-slide-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <Mic className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Baseline Recording</p>
                <p className="text-xs text-success">Complete</p>
              </div>
              <CheckCircle className="h-5 w-5 text-success" />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Master Class</p>
                <p className="text-xs text-primary">Next Step</p>
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </div>

          {/* Back to Home Button */}
          <Button
            onClick={() => navigate("/")}
            className="w-full max-w-xs animate-slide-in-up"
            style={{ animationDelay: "300ms" }}
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BaselineSuccess;
