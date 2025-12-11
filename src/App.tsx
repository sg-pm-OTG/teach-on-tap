import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Record from "./pages/Record";
import SessionDetails from "./pages/SessionDetails";
import Processing from "./pages/Processing";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PreSurveyIntro from "./pages/PreSurveyIntro";
import PreSurveyQuestions from "./pages/PreSurveyQuestions";
import PreSurveyResults from "./pages/PreSurveyResults";
import Profile from "./pages/Profile";
import BaselineSuccess from "./pages/BaselineSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-background">
        <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/pre-survey" element={<ProtectedRoute><PreSurveyIntro /></ProtectedRoute>} />
                <Route path="/pre-survey/questions" element={<ProtectedRoute><PreSurveyQuestions /></ProtectedRoute>} />
                <Route path="/pre-survey/results" element={<ProtectedRoute><PreSurveyResults /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/record" element={<ProtectedRoute><Record /></ProtectedRoute>} />
                <Route path="/session-details" element={<ProtectedRoute><SessionDetails /></ProtectedRoute>} />
                <Route path="/baseline-success" element={<ProtectedRoute><BaselineSuccess /></ProtectedRoute>} />
                <Route path="/processing" element={<ProtectedRoute><Processing /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
