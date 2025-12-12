import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, ClipboardList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { RecommendationCard } from "@/components/pre-survey/RecommendationCard";
import { usePreSurvey } from "@/hooks/usePreSurvey";
import { preSurveyCategories } from "@/data/preSurveyQuestions";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { results, loadResults, isLoadingResults } = usePreSurvey();
  const [showSurveyResults, setShowSurveyResults] = useState(false);

  useEffect(() => {
    loadResults();
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

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border pt-[env(safe-area-inset-top)]">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-lg">Profile</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!showSurveyResults ? (
          <div className="px-6 py-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  {profile?.name || "User"}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-card rounded-xl p-4 border border-border space-y-3">
              <h3 className="font-medium text-foreground">Profile Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teaching Experience</span>
                  <span className="text-foreground">
                    {profile?.years_teaching_experience || 0} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="text-foreground capitalize">
                    {profile?.gender?.replace(/_/g, " ") || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Survey Results Button */}
            {results && results.length > 0 && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => setShowSurveyResults(true)}
              >
                <ClipboardList className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Pre-Survey Results</p>
                  <p className="text-xs text-muted-foreground">
                    View your assessment scores
                  </p>
                </div>
              </Button>
            )}

            {/* Sign Out */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={signOut}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSurveyResults(false)}
              className="mb-2"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Profile
            </Button>

            <div className="text-center mb-4">
              <h2 className="font-semibold text-lg text-foreground">
                Pre-Survey Results
              </h2>
              <p className="text-sm text-muted-foreground">
                Your scores compared to national averages
              </p>
            </div>

            {isLoadingResults ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              groupedResults &&
              (["A", "B", "C"] as const).map((section) => (
                <div key={section}>
                  <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                      {section}
                    </span>
                    {sectionNames[section]}
                  </h3>
                  <div className="space-y-3">
                    {groupedResults[section].map((result) => (
                      <RecommendationCard key={result.categoryCode} result={result} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
