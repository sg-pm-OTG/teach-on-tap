import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Trophy, FileText, TrendingUp, Award, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { eventData } from "@/data/eventData";

const FinalReport = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto">
            <Trophy className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Your Final Report
            </h1>
            <p className="text-muted-foreground mt-1">
              Congratulations on completing your FOP journey, {profile?.name || "Teacher"}!
            </p>
          </div>
        </div>

        {/* Report Summary Card */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Journey Summary</h3>
              <p className="text-sm text-muted-foreground">Your complete progress overview</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">3+</p>
              <p className="text-xs text-muted-foreground">Sessions Completed</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Award className="h-6 w-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground">Program Complete</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-br from-muted/50 to-muted rounded-xl border border-border p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Detailed Report</h3>
          <p className="text-sm text-muted-foreground">
            Your comprehensive analysis including pre/post survey comparisons, session insights, and personalized recommendations will be available here.
          </p>
        </div>

        {/* Launch Huddle Reminder */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Launch Huddle</h3>
              <p className="text-sm text-muted-foreground">Join us to celebrate!</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{eventData.launchHuddle.date}</span>
          </div>
          <p className="text-xs text-muted-foreground pl-6">
            {eventData.launchHuddle.location}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/reports")}
          >
            <FileText className="h-5 w-5 mr-2" />
            View Session Reports
          </Button>
          
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default FinalReport;
