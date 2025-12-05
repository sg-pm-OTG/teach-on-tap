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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-[430px] h-[932px] bg-background rounded-[3rem] border-[14px] border-foreground/90 overflow-hidden relative flex flex-col">
          {/* Phone notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-foreground/90 rounded-b-3xl z-50" />
          
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
                <Route path="/processing" element={<ProtectedRoute><Processing /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
