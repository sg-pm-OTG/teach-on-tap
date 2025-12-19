import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SurveyContainer } from "@/components/survey/SurveyContainer";
import { SurveyResultsFeedback } from "@/components/survey/SurveyResultsFeedback";
import { supabase } from "@/integrations/supabase/client";
import { generateMockReport } from "@/lib/mockReportGenerator";
import { toast } from "sonner";
import type { SurveyData } from "@/types/survey";
import axios from 'axios';

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

const Processing = () => {
  const [progress, setProgress] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [showSurveyResults, setShowSurveyResults] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState | null;
  const sessionId = state?.sessionId;
  const isBaseline = state?.isBaseline || false;
  const sessionDetails = state?.sessionDetails;

  const getAccessToken = async (): Promise<string> => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session?.access_token) {
      throw new Error("Not authenticated");
    }

    return data.session.access_token;
  };
  // Update session status to processing and generate report
  useEffect(() => {
    const processSession = async () => {
      if (!sessionId || !sessionDetails) {
        toast.error("Session data not found");
        navigate("/");
        return;
      }

      try {
        // Update session status to processing
        await supabase
          .from("sessions")
          .update({ status: "processing" })
          .eq("id", sessionId);

        // Simulate processing progress
        const interval = setInterval(async () => {
          try {
            const token = await getAccessToken();
            const res = await axios.get(
              `https://be-sussial.otg-lab.xyz/api/v1/analyze/result?session_id=${sessionId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 30_000,
              }
            );

            if (res.data.status === "completed") {
              clearInterval(interval);
              setProgress(100);
              await handleCompleted(res.data.session.audio_file_url);
              return;
            }

            setProgress(res.data.progress ?? 0);
          } catch (err) {
            console.error("Polling error:", err);
            await supabase
              .from("sessions")
              .update({ status: "failed" })
              .eq("id", sessionId);
            }
        }, 10000);

        // Generate mock report after "processing" completes

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error processing session:", error);
        toast.error("Failed to process session");
      }
    };

    const handleCompleted = async (audio_file_url: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Update session status to completed
        await supabase
          .from("sessions")
          .update({ status: "completed", audio_file_url: audio_file_url })
          .eq("id", sessionId);

        // If baseline, update profile to mark baseline completed
        if (isBaseline) {
          await supabase
            .from("profiles")
            .update({ baseline_completed: true })
            .eq("user_id", user.id);
        }

        setReportGenerated(true);
        setProcessingComplete(true);
      } catch (error) {
        console.error("Error generating report:", error);
        toast.error("Failed to generate report");
        
        // Update session status to failed
        await supabase
          .from("sessions")
          .update({ status: "failed" })
          .eq("id", sessionId);
      }
    }

    processSession();
  }, [sessionId, sessionDetails, isBaseline, navigate]);

  useEffect(() => {
    // For baseline: navigate home once processing is complete (no survey needed)
    if (isBaseline && processingComplete) {
      setTimeout(() => {
        navigate("/baseline-success");
      }, 1000);
    }
    // Regular sessions now show survey results first, then user clicks to navigate
  }, [processingComplete, isBaseline, navigate]);

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setSurveyComplete(true);
    setShowSurveyResults(true);
  };

  const handleContinueToReport = () => {
    navigate("/reports");
  };

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 flex-1 overflow-y-auto">
        {/* Compact Processing Indicator */}
        <div className="mb-6 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center animate-pulse-slow">
              <Loader2 className="h-6 w-6 text-primary-foreground animate-spin" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {processingComplete 
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
              Weekly Progress Check
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
        {isBaseline && !processingComplete && (
          <div className="p-4 bg-muted/50 rounded-xl text-center">
            <p className="text-sm text-muted-foreground">
              This baseline recording will be saved for comparison after you complete the program.
            </p>
          </div>
        )}

        {/* Waiting Message - Show when survey results are displayed but processing not complete */}
        {!isBaseline && showSurveyResults && !processingComplete && (
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
