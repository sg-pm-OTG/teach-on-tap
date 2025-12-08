import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SurveyContainer } from "@/components/survey/SurveyContainer";
import { supabase } from "@/integrations/supabase/client";
import { generateMockReport } from "@/lib/mockReportGenerator";
import { toast } from "sonner";

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
  const [reportGenerated, setReportGenerated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState | null;
  const sessionId = state?.sessionId;
  const isBaseline = state?.isBaseline || false;
  const sessionDetails = state?.sessionDetails;

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
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 500);

        // Generate mock report after "processing" completes (skip for baseline)
        setTimeout(async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            // Only generate report for non-baseline sessions
            if (!isBaseline) {
              // Generate mock report data
              const reportData = generateMockReport(sessionDetails);

              // Insert report into database
              const { error: reportError } = await supabase
                .from("session_reports")
                .insert({
                  session_id: sessionId,
                  user_id: user.id,
                  scenario_scores: reportData.scenario_scores,
                  dialogue_scores: reportData.dialogue_scores,
                  scenario_analysis: reportData.scenario_analysis,
                  dialogue_analysis: reportData.dialogue_analysis,
                  talk_time_data: reportData.talk_time_data,
                  themes: reportData.themes,
                  conclusions: reportData.conclusions,
                  speaker_interactions: reportData.speaker_interactions,
                  speakers: reportData.speakers,
                  scenario_content: reportData.scenario_content,
                  final_summary: reportData.final_summary,
                });

              if (reportError) throw reportError;
            }

            // Update session status to completed
            await supabase
              .from("sessions")
              .update({ status: "completed" })
              .eq("id", sessionId);

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
        }, 5000); // 5 seconds to simulate processing

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error processing session:", error);
        toast.error("Failed to process session");
      }
    };

    processSession();
  }, [sessionId, sessionDetails, isBaseline, navigate]);

  useEffect(() => {
    // For baseline: navigate home once processing is complete (no survey needed)
    // For regular: navigate only when both processing and survey are complete
    if (isBaseline && processingComplete) {
      setTimeout(() => {
        navigate("/");
        toast.success("Baseline recording submitted successfully!");
      }, 1000);
    } else if (!isBaseline && processingComplete && surveyComplete && reportGenerated) {
      setTimeout(() => {
        navigate("/reports");
      }, 1000);
    }
  }, [processingComplete, surveyComplete, reportGenerated, isBaseline, navigate]);

  if (!sessionId) {
    return null;
  }

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

        {/* Survey Section - Only show for non-baseline sessions */}
        {!isBaseline && (
          <div className="bg-card rounded-xl border border-border p-4">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Weekly Progress Check
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              While we analyze your session, please complete this quick survey about your FOP engagement this week.
            </p>
            
            <SurveyContainer 
              onComplete={() => setSurveyComplete(true)} 
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

        {/* Waiting Message */}
        {!isBaseline && surveyComplete && !processingComplete && (
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
