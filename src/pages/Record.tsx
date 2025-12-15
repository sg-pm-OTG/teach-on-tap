import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Waveform } from "@/components/Waveform";
import { Mic, Square, CheckCircle, ArrowRight, Info, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

const SESSION_TYPES = [
  "Classroom Lesson",
  "Work Meeting",
  "Workshop",
  "Informal Discussion",
  "Online Lesson",
] as const;

type Step = "details" | "recording" | "confirm";

const Record = () => {
  const [step, setStep] = useState<Step>("details");
  const navigate = useNavigate();
  const location = useLocation();
  const presetBaseline = (location.state as { presetBaseline?: boolean })?.presetBaseline ?? false;

  // Audio recording hook
  const {
    isRecording,
    recordingTime,
    audioBlob,
    error: recordingError,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  // Session details state
  const [useSite, setUseSite] = useState("");
  const [numberOfParticipants, setNumberOfParticipants] = useState(1);
  const [emergentScenario, setEmergentScenario] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [sessionDate, setSessionDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [isBaseline] = useState(presetBaseline);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    useSite.trim() !== "" &&
    numberOfParticipants >= 1 &&
    emergentScenario.trim() !== "" &&
    sessionType !== "";

  const handleStartRecording = () => {
    if (isFormValid) {
      setStep("recording");
    }
  };

  const handleRecord = async () => {
    if (!isRecording) {
      await startRecording();
    }
  };

  const handleStop = () => {
    stopRecording();
    setTimeout(() => {
      setStep("confirm");
    }, 500);
  };

  // Show error toast if recording fails
  useEffect(() => {
    if (recordingError) {
      toast.error(recordingError);
    }
  }, [recordingError]);

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

      let audioFileUrl: string | null = null;

      // Upload audio file if available
      if (audioBlob) {
        const timestamp = Date.now();
        const fileExtension = audioBlob.type.includes("webm") ? "webm" : "mp4";
        const fileName = `${user.id}/${timestamp}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("session-recordings")
          .upload(fileName, audioBlob, {
            contentType: audioBlob.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading audio:", uploadError);
          toast.error("Failed to upload audio recording");
          setIsSubmitting(false);
          return;
        }

        // Get the file URL
        const { data: urlData } = supabase.storage
          .from("session-recordings")
          .getPublicUrl(fileName);

        audioFileUrl = urlData.publicUrl;
      }

      const { data: session, error } = await supabase
        .from("sessions")
        .insert({
          user_id: user.id,
          use_site: useSite.trim(),
          number_of_participants: numberOfParticipants,
          session_type: sessionType,
          session_date: sessionDate,
          emergent_scenario: emergentScenario.trim() || null,
          status: "pending",
          is_baseline: isBaseline,
          audio_file_url: audioFileUrl,
        })
        .select()
        .single();

      if (error) throw error;

      navigate("/processing", {
        state: {
          sessionId: session.id,
          isBaseline,
          sessionDetails: {
            use_site: useSite.trim(),
            number_of_participants: numberOfParticipants,
            session_type: sessionType,
          session_date: sessionDate,
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1: Session Details Form
  if (step === "details") {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
        <TopBar />

        <main className="container max-w-md mx-auto px-4 py-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Tell Us About Your Session</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in these details before recording
            </p>
          </div>

          <div className="space-y-5">
            {/* Use Site */}
            <div className="space-y-2">
              <Label htmlFor="useSite">Course</Label>
              <Input
                id="useSite"
                placeholder="e.g., Mathematics 101"
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

            {/* Continue to Recording Button */}
            <Button
              variant="record"
              size="lg"
              className="w-full mt-6"
              onClick={handleStartRecording}
              disabled={!isFormValid}
            >
              Continue to Recording
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Step 2: Recording
  if (step === "recording") {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
        <TopBar />

        <main className="container max-w-md mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
            {/* Connection Status */}
            {recordingError ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full border border-destructive/20 animate-slide-in-up">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Microphone Error</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full border border-success/20 animate-slide-in-up">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  {isRecording ? "Recording..." : "Microphone Ready"}
                </span>
              </div>
            )}

            {/* Recording Timer */}
            {isRecording && (
              <div className="text-center animate-slide-in-up">
                <p className="text-sm text-muted-foreground mb-1">Recording Time</p>
                <p className="text-4xl font-bold text-foreground font-mono">
                  {formatTime(recordingTime)}
                </p>
              </div>
            )}

            {/* Waveform Visualization */}
            <div className="w-full max-w-xs">
              <Waveform isActive={isRecording} className="h-32" />
            </div>

            {/* Record/Stop Button */}
            <div className="flex flex-col items-center gap-4 w-full max-w-xs">
              {!isRecording ? (
                <button
                  onClick={handleRecord}
                  className="w-32 h-32 rounded-full gradient-primary hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
                >
                  <Mic className="h-12 w-12 text-primary-foreground group-hover:scale-110 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="w-32 h-32 rounded-full bg-destructive hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
                >
                  <Square className="h-10 w-10 text-destructive-foreground fill-current group-hover:scale-110 transition-transform" />
                </button>
              )}

              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {isRecording ? "Tap to stop recording" : "Tap to start recording"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRecording
                    ? "Your session is being captured"
                    : "Speak naturally during your lesson"}
                </p>
              </div>
            </div>

            {/* Tips */}
            {!isRecording && (
              <div className="w-full max-w-xs bg-muted/30 rounded-xl p-4 border border-border animate-slide-in-up">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Recording Tips</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Place phone near you during the lesson</li>
                      <li>• Ensure minimal background noise</li>
                      <li>• Record for at least 45 minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Back Button */}
            {!isRecording && (
              <Button
                variant="ghost"
                onClick={() => {
                  resetRecording();
                  setStep("details");
                }}
                className="text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Button>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Step 3: Confirm Details
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full border border-success/20 w-fit mb-4">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Recording Complete</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Confirm Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and edit your session details before submitting
          </p>
        </div>

        <div className="space-y-5">
          {/* Course */}
          <div className="space-y-2">
            <Label htmlFor="useSite">Course</Label>
            <Input
              id="useSite"
              placeholder="e.g., Mathematics 101"
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

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="sessionTypeConfirm">Type</Label>
            <select
              id="sessionTypeConfirm"
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

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="sessionDateConfirm">Date</Label>
            <Input
              id="sessionDateConfirm"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
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
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Record;
