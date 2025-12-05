import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { RecommendationCard } from "@/components/pre-survey/RecommendationCard";
import { usePreSurvey } from "@/hooks/usePreSurvey";
import { useProfile } from "@/hooks/useProfile";

const PreSurveyResults = () => {
  const navigate = useNavigate();
  const { results, loadResults, isLoadingResults } = usePreSurvey();
  const { refetch: refetchProfile } = useProfile();

  useEffect(() => {
    if (!results) {
      loadResults();
    }
    // Refetch profile to get updated pre_survey_completed status
    refetchProfile();
  }, []);

  const groupedResults = results
    ? {
        A: results.filter((r) => r.categoryCode.startsWith("A")),
        B: results.filter((r) => r.categoryCode.startsWith("B")),
        C: results.filter((r) => r.categoryCode.startsWith("C")),
      }
    : null;

  const sectionNames: Record<string, string> = {
    A: "Pedagogical Practices",
    B: "Professional Environment",
    C: "Skills Domain",
  };

  if (isLoadingResults) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="pt-10 pb-4 px-6 text-center border-b border-border">
        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-7 h-7 text-success" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Survey Complete</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here are your results compared to national averages
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto space-y-6">
        {groupedResults &&
          (["A", "B", "C"] as const).map((section) => (
            <div key={section}>
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                  {section}
                </span>
                {sectionNames[section]}
              </h2>
              <div className="space-y-3">
                {groupedResults[section].map((result) => (
                  <RecommendationCard key={result.categoryCode} result={result} />
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <Button
          onClick={() => navigate("/")}
          className="w-full gradient-accent text-primary-foreground"
          size="lg"
        >
          Continue to Home
        </Button>
      </div>
    </div>
  );
};

export default PreSurveyResults;
