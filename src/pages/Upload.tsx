import { useState, useRef } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, CheckCircle, ArrowRight, CalendarIcon, Info, ArrowLeft, FileAudio, X, Play, Pause } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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

const ACCEPTED_AUDIO_TYPES = [
  "audio/mp3",
  "audio/mpeg",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mp4",
  "audio/webm",
  "audio/ogg",
];

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

type Step = "details" | "upload" | "confirm";

const Upload = () => {
  const [step, setStep] = useState<Step>("details");
  const navigate = useNavigate();
  const location = useLocation();
  const presetBaseline = (location.state as { presetBaseline?: boolean })?.presetBaseline ?? false;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio file state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Session details state
  const [useSite, setUseSite] = useState("");
  const [numberOfParticipants, setNumberOfParticipants] = useState(1);
  const [emergentScenario, setEmergentScenario] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [sessionDate, setSessionDate] = useState<Date>(new Date());
  const [isBaseline] = useState(presetBaseline);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    useSite.trim() !== "" &&
    numberOfParticipants >= 1 &&
    emergentScenario.trim() !== "" &&
    sessionType !== "";

  const handleContinueToUpload = () => {
    if (isFormValid) {
      setStep("upload");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
      toast.error("Please select a valid audio file (MP3, WAV, M4A, WebM)");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 500MB");
      return;
    }

    setAudioFile(file);

    // Get audio duration
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration);
      URL.revokeObjectURL(audio.src);
    };
  };

  const handleRemoveFile = () => {
    setAudioFile(null);
    setAudioDuration(null);
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleContinueToConfirm = () => {
    if (audioFile) {
      setStep("confirm");
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async () => {
    if (!isFormValid || !audioFile || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to submit a session");
        setIsSubmitting(false);
        return;
      }

      // Upload audio file
      const timestamp = Date.now();
      const fileExtension = audioFile.name.split(".").pop() || "mp3";
      const fileName = `${user.id}/${timestamp}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("session-recordings")
        .upload(fileName, audioFile, {
          contentType: audioFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading audio:", uploadError);
        toast.error("Failed to upload audio file");
        setIsSubmitting(false);
        return;
      }

      // Get the file URL
      const { data: urlData } = supabase.storage
        .from("session-recordings")
        .getPublicUrl(fileName);

      const audioFileUrl = urlData.publicUrl;

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

  // Step 1: Session Details Form
  if (step === "details") {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
        <TopBar />

        <main className="container max-w-md mx-auto px-4 py-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Tell Us About Your Session</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in these details before uploading
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

            {/* Type of Session */}
            <div className="space-y-2">
              <Label>Type</Label>
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
              <Label>Date</Label>
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

            {/* Continue to Upload Button */}
            <Button
              variant="record"
              size="lg"
              className="w-full mt-6"
              onClick={handleContinueToUpload}
              disabled={!isFormValid}
            >
              Continue to Upload
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Step 2: Upload Audio File
  if (step === "upload") {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
        <TopBar />

        <main className="container max-w-md mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">Upload Audio File</h1>
              <p className="text-sm text-muted-foreground">
                Select an audio recording of your session
              </p>
            </div>

            {/* File Upload Area */}
            {!audioFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xs border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-primary hover:bg-muted/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <UploadIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Tap to select audio file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP3, WAV, M4A, WebM • Max 500MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="w-full max-w-xs bg-card border border-border rounded-xl p-4 space-y-4 animate-slide-in-up">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <FileAudio className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {audioFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {audioDuration ? formatDuration(audioDuration) : "Loading..."} • {formatFileSize(audioFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Audio Preview */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlayback}
                    className="flex-1"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Preview
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play Preview
                      </>
                    )}
                  </Button>
                </div>

                <audio
                  ref={audioRef}
                  src={audioFile ? URL.createObjectURL(audioFile) : undefined}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              </div>
            )}

            {/* Tips */}
            <div className="w-full max-w-xs bg-muted/30 rounded-xl p-4 border border-border animate-slide-in-up">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Upload Tips</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use recordings at least 45 minutes long</li>
                    <li>• Ensure audio quality is clear</li>
                    <li>• Supported formats: MP3, WAV, M4A, WebM</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            {audioFile && (
              <Button
                variant="record"
                size="lg"
                className="w-full max-w-xs"
                onClick={handleContinueToConfirm}
              >
                Continue to Confirm
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            )}

            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => {
                handleRemoveFile();
                setStep("details");
              }}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Button>
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
            <span className="text-sm font-medium">File Ready</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Confirm Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and edit your session details before submitting
          </p>
        </div>

        <div className="space-y-5">
          {/* Audio File Info */}
          {audioFile && (
            <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
              <FileAudio className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {audioFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {audioDuration ? formatDuration(audioDuration) : ""} • {formatFileSize(audioFile.size)}
                </p>
              </div>
            </div>
          )}

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
            <Label>Type</Label>
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

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
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

          {/* Emergent Scenario */}
          <div className="space-y-2">
            <Label htmlFor="emergentScenario">Description of Emergent Scenario</Label>
            <Textarea
              id="emergentScenario"
              placeholder="Describe the emergent scenario observed during the session..."
              value={emergentScenario}
              onChange={(e) => setEmergentScenario(e.target.value)}
              rows={4}
            />
          </div>

          {/* Back and Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep("upload")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              variant="record"
              className="flex-1"
              onClick={handleSubmit}
              disabled={!isFormValid || !audioFile || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Session"}
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Upload;
