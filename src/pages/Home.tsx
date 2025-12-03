import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Mic, Upload, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 144px)' }}>
        {/* Greeting */}
        <div className="animate-slide-in-left">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Welcome, {profile?.name || "Teacher"}!
          </h1>
          <p className="text-muted-foreground">
            Start your teaching analytics journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          
          <Button
            variant="record"
            size="touch"
            className="w-full justify-start"
            onClick={() => navigate("/record")}
          >
            <Mic className="h-5 w-5" />
            <span>Record New Session</span>
          </Button>

          <Button
            variant="action"
            size="touch"
            className="w-full justify-start"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Audio File</span>
          </Button>

          <Button
            variant="action"
            size="touch"
            className="w-full justify-start"
            onClick={() => navigate("/reports")}
          >
            <FileText className="h-5 w-5" />
            <span>View All Reports</span>
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
