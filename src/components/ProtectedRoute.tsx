import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const location = useLocation();

  // Pre-survey routes that don't require pre-survey completion check
  const preSurveyRoutes = ["/pre-survey", "/pre-survey/questions", "/pre-survey/results"];
  const isPreSurveyRoute = preSurveyRoutes.includes(location.pathname);

  if (loading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If profile exists and pre-survey not completed, redirect to pre-survey
  // (unless already on a pre-survey route)
  if (profile && !profile.pre_survey_completed && !isPreSurveyRoute) {
    return <Navigate to="/pre-survey" replace />;
  }

  // If pre-survey is completed and user is on intro page, redirect to home
  if (profile?.pre_survey_completed && location.pathname === "/pre-survey") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
