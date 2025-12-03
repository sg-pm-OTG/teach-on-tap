import { Lock, Mic, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const LockedPreview = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Blurred placeholder metrics */}
      <div className="blur-md pointer-events-none select-none">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card border-2 border-border rounded-xl p-4 h-24"
            >
              <div className="h-3 w-16 bg-muted rounded mb-2" />
              <div className="h-6 w-12 bg-muted rounded mb-1" />
              <div className="h-2 w-20 bg-muted rounded" />
            </div>
          ))}
        </div>

        <div className="bg-card border-2 border-border rounded-2xl p-5 h-40 mb-4">
          <div className="h-4 w-32 bg-muted rounded mb-3" />
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-3/4 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-2xl p-5 h-24">
          <div className="h-4 w-24 bg-muted rounded mb-3" />
          <div className="h-3 w-full bg-muted rounded" />
        </div>
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background/40 via-background/60 to-background/40">
        <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg max-w-[280px] text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-2">
            Unlock Your Insights
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            Record or upload your first session to see personalized teaching analytics
          </p>
          <div className="flex gap-3">
            <Button
              variant="record"
              size="sm"
              className="flex-1"
              onClick={() => navigate("/record")}
            >
              <Mic className="h-4 w-4" />
              Record
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
