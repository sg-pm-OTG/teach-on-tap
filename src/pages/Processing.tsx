import { useEffect, useState, useCallback, useRef } from "react";
import { TopBar } from "@/components/TopBar";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SurveyContainer } from "@/components/survey/SurveyContainer";
import { SurveyResultsFeedback } from "@/components/survey/SurveyResultsFeedback";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SurveyData } from "@/types/survey";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface LocationState {
  sessionId: string;
  isBaseline?: boolean;
  sessionDetails: {
    use_site: string;
    number_of_participants: number;
    session_type: string;
    session_date: string;
    emergent_scenario?: string;
  };
}

type ProcessingStatus = "processing" | "completed" | "failed" | "timeout";

const Processing = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<ProcessingStatus>("processing");
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [showSurveyResults, setShowSurveyResults] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState | null;
  const sessionId = state?.sessionId;
  const isBaseline = state?.isBaseline || false;
  const sessionDetails = state?.sessionDetails;

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const getAccessToken = async (): Promise<string> => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session?.access_token) {
      throw new Error("Not authenticated");
    }

    return data.session.access_token;
  };

  // Handle completion logic
  const handleCompleted = useCallback(async (audio_file_url: string | null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Update session status to completed
      await supabase
        .from("sessions")
        .update({ status: "completed", ...(audio_file_url && { audio_file_url }) })
        .eq("id", sessionId);

      // If baseline, update profile to mark baseline completed
      if (isBaseline) {
        await supabase
          .from("profiles")
          .update({ baseline_completed: true })
          .eq("user_id", user.id);
      }

      setStatus("completed");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
      
      // Update session status to failed
      await supabase
        .from("sessions")
        .update({ status: "failed" })
        .eq("id", sessionId);
      
      setStatus("failed");
    }
  }, [sessionId, isBaseline]);

  const startPolling = useCallback(async () => {
    if (!sessionId || !sessionDetails) {
      toast.error("Session data not found");
      navigate("/");
      return;
    }

    clearTimers();

    try {
      await supabase
        .from("sessions")
        .update({ status: "processing" })
        .eq("id", sessionId);

      setStatus("processing");
      setProgress(0);

      intervalRef.current = window.setInterval(async () => {
        try {
          const token = await getAccessToken();
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/analyze/result?session_id=${sessionId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 30_000,
            }
          );

          const currentProgress = res.data.progress ?? 0;
          setProgress(currentProgress);

          if (res.data.status === "completed" || currentProgress >= 100) {
            clearTimers();
            setProgress(100);
            await handleCompleted(res.data.session?.audio_file_url || null);
          }
        } catch (err) {
          console.error("Polling error:", err);
          clearTimers();

          await supabase
            .from("sessions")
            .update({ status: "failed" })
            .eq("id", sessionId);

          toast.error("Processing failed. You can retry below.");
          setStatus("failed");
        }
      }, 5000);

      timeoutRef.current = window.setTimeout(() => {
        clearTimers();
        toast.error("Processing is taking longer than expected.");
        setStatus("timeout");
      }, 600000);

    } catch (error) {
      console.error("Error processing session:", error);
      toast.error("Failed to process session");
      setStatus("failed");
    }
  }, [sessionId, sessionDetails, navigate, clearTimers, handleCompleted]);

  useEffect(() => {
    startPolling();
    return () => clearTimers();
  }, [startPolling, clearTimers]);

  // Fallback: if stuck at 100% for 5 seconds, force completion
  useEffect(() => {
    if (progress >= 100 && status === "processing") {
      const fallbackTimer = setTimeout(async () => {
        console.log("Fallback: forcing completion after progress reached 100%");
        await handleCompleted(null);
      }, 5000);
      return () => clearTimeout(fallbackTimer);
    }
  }, [progress, status, handleCompleted]);

  useEffect(() => {
    // For baseline: navigate home once processing is complete (no survey needed)
    if (isBaseline && status === "completed") {
      setTimeout(() => {
        navigate("/baseline-success");
      }, 1000);
    }
    // Regular sessions now show survey results first, then user clicks to navigate
  }, [status, isBaseline, navigate]);

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setSurveyComplete(true);
    setShowSurveyResults(true);
  };

  const handleContinueToReport = () => {
    navigate("/reports");
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    setStatus("processing");
    setProgress(0);

    await startPolling();
    setIsRetrying(false);
  };

  if (!sessionId) {
    return null;
  }

  const isProcessing = status === "processing";
  const isCompleted = status === "completed";
  const isFailed = status === "failed" || status === "timeout";

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 flex-1 overflow-y-auto">
        {/* Processing Indicator */}
        <div className={`mb-6 p-4 bg-card rounded-xl border ${isFailed ? 'border-destructive/50' : 'border-border'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isFailed 
                ? 'bg-destructive/10' 
                : isCompleted 
                  ? 'bg-success/10' 
                  : 'gradient-primary animate-pulse-slow'
            }`}>
              {isFailed ? (
                <AlertCircle className="h-6 w-6 text-destructive" />
              ) : isCompleted ? (
                <Loader2 className="h-6 w-6 text-success" />
              ) : (
                <Loader2 className="h-6 w-6 text-primary-foreground animate-spin" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {isFailed 
                  ? "Processing failed" 
                  : isCompleted 
                    ? isBaseline 
                      ? "Baseline recorded!" 
                      : "Analysis complete!" 
                    : isBaseline 
                      ? "Saving your baseline..." 
                      : "Processing your session..."}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ease-out ${
                      isFailed ? 'bg-destructive' : 'gradient-secondary'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground min-w-[40px] text-right">
                  {progress}%
                </span>
              </div>
            </div>
          </div>

          {/* Retry button for failed sessions */}
          {isFailed && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                {status === "timeout" 
                  ? "The processing timed out. You can try again or return to reports."
                  : "Something went wrong during processing. You can retry or return to reports."}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex-1"
                >
                  {isRetrying ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Retry Processing
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/reports")}
                  className="flex-1"
                >
                  Go to Reports
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Survey Results Feedback - Show after survey is submitted */}
        {!isBaseline && showSurveyResults && surveyData && (
          <SurveyResultsFeedback 
            surveyData={surveyData} 
            onContinue={handleContinueToReport}
          />
        )}

        {/* Survey Section - Only show for non-baseline sessions before completion */}
        {!isBaseline && !showSurveyResults && (
          <div className="bg-card rounded-xl border border-border p-4">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Session Reflection
              </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Quick check-in while we process your session.
            </p>
            
            <SurveyContainer 
              onComplete={handleSurveyComplete} 
              sessionId={sessionId}
            />
          </div>
        )}

        {/* Baseline info message */}
        {isBaseline && isProcessing && (
          <div className="p-4 bg-muted/50 rounded-xl text-center">
            <p className="text-sm text-muted-foreground">
              This baseline recording will be saved for comparison after you complete the program.
            </p>
          </div>
        )}

        {/* Waiting Message - Show when survey results are displayed but processing not complete */}
        {!isBaseline && showSurveyResults && isProcessing && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Processing your session in the background...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Processing;