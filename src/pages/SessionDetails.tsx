import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowRight, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
  numberOfParticipants: number;
  emergentScenario: string;
  sessionType: string;
  sessionDate: Date;
}

const SessionDetails = () => {
  const navigate = useNavigate();
  const [useSite, setUseSite] = useState("");
  const [numberOfParticipants, setNumberOfParticipants] = useState(1);
  const [emergentScenario, setEmergentScenario] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [sessionDate, setSessionDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    useSite.trim() !== "" &&
    numberOfParticipants >= 1 &&
    emergentScenario.trim() !== "" &&
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
          number_of_participants: numberOfParticipants,
          session_type: sessionType,
          session_date: format(sessionDate, "yyyy-MM-dd"),
          emergent_scenario: emergentScenario.trim() || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to processing page with session ID and details
      navigate("/processing", {
        state: {
          sessionId: session.id,
          sessionDetails: {
            use_site: useSite.trim(),
            number_of_participants: numberOfParticipants,
            session_type: sessionType,
            session_date: format(sessionDate, "yyyy-MM-dd"),
            emergent_scenario: emergentScenario.trim() || null,
          },
        },
      });
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleParticipantChange = (delta: number) => {
    setNumberOfParticipants((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Session Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete these details before we analyze your recording
          </p>
        </div>

        <div className="space-y-5">
          {/* Use Site */}
          <div className="space-y-2">
            <Label htmlFor="useSite">Use Site</Label>
            <Input
              id="useSite"
              placeholder="e.g., Lincoln High School"
              value={useSite}
              onChange={(e) => setUseSite(e.target.value)}
            />
          </div>

          {/* Number of Participants */}
          <div className="space-y-2">
            <Label>Number of Participants</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleParticipantChange(-1)}
                disabled={numberOfParticipants <= 1}
              >
                −
              </Button>
              <Input
                type="number"
                min={1}
                value={numberOfParticipants}
                onChange={(e) =>
                  setNumberOfParticipants(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleParticipantChange(1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Type of Session */}
          <div className="space-y-2">
            <Label>Type of Session</Label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                {SESSION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Date */}
          <div className="space-y-2">
            <Label>Session Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !sessionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {sessionDate ? format(sessionDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={sessionDate}
                  onSelect={(date) => date && setSessionDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Emergent Scenario Description */}
          <div className="space-y-2">
            <Label htmlFor="emergentScenario">Description of Emergent Scenario</Label>
            <Textarea
              id="emergentScenario"
              placeholder="Describe the emergent scenario observed during the session..."
              value={emergentScenario}
              onChange={(e) => setEmergentScenario(e.target.value)}
              rows={4}
            />
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Enter "<span className="font-medium text-foreground">Assess session for scenario</span>" if you want the AI to detect the scenario automatically.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            variant="record"
            size="lg"
            className="w-full mt-6"
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
