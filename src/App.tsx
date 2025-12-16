import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminAuthProvider } from "./components/admin/AdminAuthProvider";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import Home from "./pages/Home";
import Record from "./pages/Record";
import Upload from "./pages/Upload";
import SessionDetails from "./pages/SessionDetails";
import Processing from "./pages/Processing";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PreSurveyIntro from "./pages/PreSurveyIntro";
import PreSurveyQuestions from "./pages/PreSurveyQuestions";
import PreSurveyResults from "./pages/PreSurveyResults";
import PostSurveyIntro from "./pages/PostSurveyIntro";
import PostSurveyQuestions from "./pages/PostSurveyQuestions";
import PostSurveyResults from "./pages/PostSurveyResults";
import Profile from "./pages/Profile";
import BaselineSuccess from "./pages/BaselineSuccess";
import FinalReport from "./pages/FinalReport";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import StaffManagement from "./pages/admin/StaffManagement";
import UsersList from "./pages/admin/UsersList";
import UserDetail from "./pages/admin/UserDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-background">
        <BrowserRouter>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
            <Route path="/admin/*" element={
              <AdminAuthProvider>
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              </AdminAuthProvider>
            }>
              <Route path="staff" element={<StaffManagement />} />
              <Route path="users" element={<UsersList />} />
              <Route path="users/:userId" element={<UserDetail />} />
            </Route>

            {/* User Routes */}
            <Route path="/auth" element={<AuthProvider><Auth /></AuthProvider>} />
            <Route path="/pre-survey" element={<AuthProvider><ProtectedRoute><PreSurveyIntro /></ProtectedRoute></AuthProvider>} />
            <Route path="/pre-survey/questions" element={<AuthProvider><ProtectedRoute><PreSurveyQuestions /></ProtectedRoute></AuthProvider>} />
            <Route path="/pre-survey/results" element={<AuthProvider><ProtectedRoute><PreSurveyResults /></ProtectedRoute></AuthProvider>} />
            <Route path="/post-survey" element={<AuthProvider><ProtectedRoute><PostSurveyIntro /></ProtectedRoute></AuthProvider>} />
            <Route path="/post-survey/questions" element={<AuthProvider><ProtectedRoute><PostSurveyQuestions /></ProtectedRoute></AuthProvider>} />
            <Route path="/post-survey/results" element={<AuthProvider><ProtectedRoute><PostSurveyResults /></ProtectedRoute></AuthProvider>} />
            <Route path="/profile" element={<AuthProvider><ProtectedRoute><Profile /></ProtectedRoute></AuthProvider>} />
            <Route path="/" element={<AuthProvider><ProtectedRoute><Home /></ProtectedRoute></AuthProvider>} />
            <Route path="/record" element={<AuthProvider><ProtectedRoute><Record /></ProtectedRoute></AuthProvider>} />
            <Route path="/upload" element={<AuthProvider><ProtectedRoute><Upload /></ProtectedRoute></AuthProvider>} />
            <Route path="/session-details" element={<AuthProvider><ProtectedRoute><SessionDetails /></ProtectedRoute></AuthProvider>} />
            <Route path="/baseline-success" element={<AuthProvider><ProtectedRoute><BaselineSuccess /></ProtectedRoute></AuthProvider>} />
            <Route path="/processing" element={<AuthProvider><ProtectedRoute><Processing /></ProtectedRoute></AuthProvider>} />
            <Route path="/reports" element={<AuthProvider><ProtectedRoute><Reports /></ProtectedRoute></AuthProvider>} />
            <Route path="/final-report" element={<AuthProvider><ProtectedRoute><FinalReport /></ProtectedRoute></AuthProvider>} />
            <Route path="/notifications" element={<AuthProvider><ProtectedRoute><Notifications /></ProtectedRoute></AuthProvider>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
