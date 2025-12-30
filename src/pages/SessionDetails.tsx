import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { ArrowRight, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SESSION_TYPES = [
  "Classroom Lesson",
  "Work Meeting",
  "Workshop",
  "Informal Discussion",
  "Online Lesson",
] as const;

export interface SessionDetailsData {
  useSite: string;
  emergentScenario: string;
  sessionType: string;
  sessionDate: Date;
  isBaseline: boolean;
}

const SessionDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const presetBaseline = (location.state as { presetBaseline?: boolean })?.presetBaseline ?? false;
  
  const [useSite, setUseSite] = useState("");
  const [emergentScenario, setEmergentScenario] = useState("");
  const [hasEmergentScenario, setHasEmergentScenario] = useState<boolean | null>(null);
  const [sessionType, setSessionType] = useState("");
  const [sessionDate, setSessionDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [isBaseline, setIsBaseline] = useState(presetBaseline);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    useSite.trim() !== "" &&
    hasEmergentScenario !== null &&
    (hasEmergentScenario === false || emergentScenario.trim() !== "") &&
    sessionType !== "";

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to submit a session");
        setIsSubmitting(false);
        return;
      }

      // Create session record in database
      const { data: session, error } = await supabase
        .from("sessions")
        .insert({
          user_id: user.id,
          use_site: useSite.trim(),
          number_of_participants: 1,
          session_type: sessionType,
          session_date: sessionDate,
          emergent_scenario: hasEmergentScenario === false ? "AUTO_DETECT" : (emergentScenario.trim() || null),
          status: "pending",
          is_baseline: isBaseline,
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to processing page for both baseline and regular sessions
      navigate("/processing", {
        state: {
          sessionId: session.id,
          isBaseline,
          sessionDetails: {
            use_site: useSite.trim(),
            session_type: sessionType,
            session_date: sessionDate,
            emergent_scenario: hasEmergentScenario === false ? "AUTO_DETECT" : (emergentScenario.trim() || null),
          },
        },
      });
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Session Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete these details before we analyze your recording
          </p>
        </div>

        <div className="space-y-5">
          {/* Course */}
          <div className="space-y-2">
            <Label htmlFor="useSite">Course</Label>
            <Input
              id="useSite"
              placeholder="e.g., Lincoln High School"
              value={useSite}
              onChange={(e) => setUseSite(e.target.value)}
            />
          </div>

          {/* Type of Session */}
          <div className="space-y-2">
            <Label htmlFor="sessionType">Type</Label>
            <select
              id="sessionType"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select session type</option>
              {SESSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Session Date */}
          <div className="space-y-2">
            <Label htmlFor="sessionDate">Date</Label>
            <Input
              id="sessionDate"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>

          {/* Emergent Scenario Description */}
          <div className="space-y-3">
            <Label>Do you have an Emergent Scenario for this session?</Label>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant={hasEmergentScenario === true ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setHasEmergentScenario(true)}
              >
                Yes, I have one
              </Button>
              <Button
                type="button"
                variant={hasEmergentScenario === false ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setHasEmergentScenario(false)}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                No, let AI detect
              </Button>
            </div>

            {hasEmergentScenario === true && (
              <Textarea
                id="emergentScenario"
                placeholder="Describe the emergent scenario you used..."
                value={emergentScenario}
                onChange={(e) => setEmergentScenario(e.target.value)}
                rows={4}
              />
            )}

            {hasEmergentScenario === false && (
              <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  AI will analyze your recording to identify the emergent scenario automatically.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            variant="record"
            size="lg"
            className="w-full mt-6 min-h-[60px]"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Creating Session..." : "Submit for Analysis"}
            {!isSubmitting && <ArrowRight className="h-5 w-5 ml-2" />}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SessionDetails;
