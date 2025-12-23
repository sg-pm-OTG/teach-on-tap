import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthContext } from "./AdminAuthProvider";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAdminAuthContext();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    // Only mark initial check as done once loading completes
    if (!loading) {
      setInitialCheckDone(true);
    }
  }, [loading]);

  // Show loader while initial check is in progress
  // This prevents premature redirects during state transitions
  if (loading || !initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
