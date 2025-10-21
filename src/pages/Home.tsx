import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Mic, Upload, FileText, TrendingUp, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 144px)' }}>
        {/* Greeting */}
        <div className="animate-slide-in-left">
          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back, Sarah</h1>
          <p className="text-muted-foreground">Ready to track your teaching excellence?</p>
        </div>

        {/* Metrics Snapshot */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            title="Last Score"
            value="87%"
            subtitle="+5% from previous"
            trend="up"
            icon={<TrendingUp className="h-5 w-5 text-secondary-foreground" />}
          />
          <MetricCard
            title="Improvement"
            value="12%"
            subtitle="This month"
            trend="up"
            icon={<MessageSquare className="h-5 w-5 text-secondary-foreground" />}
          />
        </div>

        {/* AI Feedback Summary */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-5 border-2 border-border animate-slide-in-up">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Latest AI Feedback</h3>
              <p className="text-sm text-muted-foreground">From your session on Nov 18</p>
            </div>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            Excellent use of open-ended questions to encourage student thinking. Consider
            reducing wait time slightly to maintain engagement momentum.
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
