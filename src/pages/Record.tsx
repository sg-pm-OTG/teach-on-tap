import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Waveform } from "@/components/Waveform";
import { Mic, Square, CheckCircle, ArrowRight, ArrowLeft, AlertCircle, Sparkles, Target, Upload, FileAudio, X, Play, Pause, Loader2, BellOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useProfile } from "@/hooks/useProfile";
import axios from 'axios';

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
  "audio/x-mpeg",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mp4",
  "audio/x-mp4",
  "audio/aac",
  "",
];

const ACCEPTED_AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a"];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

type Step = "details" | "mode-select" | "recording" | "upload" | "confirm";
type InputMode = "record" | "upload" | null;

const Record = () => {
  const [step, setStep] = useState<Step>("details");
  const [inputMode, setInputMode] = useState<InputMode>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useProfile();
  const presetBaseline = (location.state as { presetBaseline?: boolean })?.presetBaseline ?? false;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Auto-force baseline if not completed yet
  const isBaseline = !profile?.baseline_completed || presetBaseline;

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

  // Upload file state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Session details state
  const [useSite, setUseSite] = useState("");
  const [emergentScenario, setEmergentScenario] = useState("");
  const [hasEmergentScenario, setHasEmergentScenario] = useState<boolean | null>(null);
  const [sessionType, setSessionType] = useState("");
  const [sessionDate, setSessionDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sessionRef = useRef<any>(null);

  const isFormValid =
    useSite.trim() !== "" &&
    hasEmergentScenario !== null &&
    (hasEmergentScenario === false || emergentScenario.trim() !== "") &&
    sessionType !== "";

  const handleContinueToModeSelect = () => {
    if (isFormValid) {
      setStep("mode-select");
    }
  };

  const handleSelectRecordMode = () => {
    setInputMode("record");
    setStep("recording");
  };

  const handleSelectUploadMode = () => {
    setInputMode("upload");
    setStep("upload");
  };

  // File upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
    const isValidMimeType = ACCEPTED_AUDIO_TYPES.includes(file.type);
    const isValidExtension = ACCEPTED_AUDIO_EXTENSIONS.includes(fileExtension);
    
    if (!isValidMimeType && !isValidExtension) {
      toast.error("Please select a valid audio file (MP3, WAV, or M4A)");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 500MB");
      return;
    }

    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration);
    };
  };

  const handleRemoveFile = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioFile(null);
    setAudioDuration(null);
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const togglePlayback = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback error:", error);
      toast.error("Unable to play audio preview");
      setIsPlaying(false);
    }
  };

  const handleContinueToConfirmFromUpload = () => {
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

  // Recording handlers
  const handleRecord = async () => {
    if (!isRecording) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to submit a session");
        setIsSubmitting(false);
        return;
      }

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
  
      sessionRef.current = session;
      await startRecording(session.id);
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
    
    // For upload mode, check audio file
    if (inputMode === "upload" && !audioFile) return;

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to submit a session");
        setIsSubmitting(false);
        return;
      }

      // For recording mode, session is already created - just navigate
      if (inputMode === "record") {
        navigate("/processing", {
          state: {
            sessionId: sessionRef.current.id,
            isBaseline,
            sessionDetails: {
              use_site: useSite.trim(),
              session_type: sessionType,
              session_date: sessionDate,
              emergent_scenario: hasEmergentScenario === false ? "AUTO_DETECT" : (emergentScenario.trim() || null),
            },
          },
        });
        return;
      }

      // For upload mode, create session and upload file
      const getAccessToken = async (): Promise<string> => {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session?.access_token) {
          throw new Error("Not authenticated");
        }
        return data.session.access_token;
      };

      const accessToken = await getAccessToken();
      
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

      // Upload audio file to analysis API
      const formData = new FormData();
      formData.append("session_id", session.id);
      formData.append("is_final", "1");

      const ext = (audioFile!.name.split(".").pop() || "webm").toLowerCase();
      formData.append("audio_chunk_file", audioFile!, `chunk-${session.id}-0.${ext}`);
      formData.append("upload_mode", "segment");
      formData.append("session", JSON.stringify(session));

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/analyze/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (uploadError) {
        console.error("Error triggering analysis:", uploadError);
        await supabase
          .from("sessions")
          .update({ status: "failed" })
          .eq("id", session.id);

        const statusCode = axios.isAxiosError(uploadError) ? uploadError.response?.status : undefined;
        toast.error(statusCode ? `Failed to start analysis (${statusCode}). Please try again.` : "Failed to start analysis. Please try again.");
        setIsSubmitting(false);
        return;
      }

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
            <h1 className="text-2xl font-bold text-foreground">
              {isBaseline ? "Submit Your Baseline Session" : "Tell Us About Your Session"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in these details before submitting
            </p>
          </div>

          <div className="space-y-5">
            {/* Baseline Recording Indicator */}
            {isBaseline && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                  <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Baseline Session</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    This captures your current teaching style before FOP training. It will be used for comparison in your Final Report.
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

            {/* Continue Button */}
            <Button
              variant="record"
              size="lg"
              className="w-full mt-6"
              onClick={handleContinueToModeSelect}
              disabled={!isFormValid}
            >
              Continue
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Step 2: Mode Selection
  if (step === "mode-select") {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
        <TopBar />

        <main className="container max-w-md mx-auto px-4 py-6 flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              How would you like to submit?
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choose to record now or upload an existing file
            </p>
          </div>

          {isBaseline && (
            <div className="mb-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Baseline Session</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  This will be your baseline for comparison.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Record Option */}
            <button
              onClick={handleSelectRecordMode}
              className="p-6 rounded-xl border-2 border-border hover:border-primary bg-card text-left transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Record Live</h3>
              <p className="text-xs text-muted-foreground">
                Record directly in the app
              </p>
            </button>

            {/* Upload Option */}
            <button
              onClick={handleSelectUploadMode}
              className="p-6 rounded-xl border-2 border-border hover:border-primary bg-card text-left transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Upload File</h3>
              <p className="text-xs text-muted-foreground">
                Select existing recording
              </p>
            </button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setStep("details")}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Button>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Step 3a: Recording
  if (step === "recording") {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
        <TopBar />

        <main className="container max-w-md mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
            {/* Baseline Recording Badge */}
            {isBaseline && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full border border-amber-200 dark:border-amber-700 animate-slide-in-up">
                <Target className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Baseline Recording</span>
              </div>
            )}
            
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
              <div className="w-full max-w-xs space-y-3 animate-slide-in-up">
                {/* Do Not Disturb Warning */}
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <BellOff className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Enable Do Not Disturb
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        Swipe down from the top of your screen and tap the Do Not Disturb icon to prevent interruptions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recording Tips */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Recording Tips</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Place phone near you during the lesson</li>
                        <li>• Ensure minimal background noise</li>
                        <li>• Recommended: 45 minutes – 2 hours</li>
                      </ul>
                    </div>
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
                  setStep("mode-select");
                }}
                className="text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Step 3b: Upload
  if (step === "upload") {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
        <TopBar />

        <main className="container max-w-md mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
            {/* Baseline Badge */}
            {isBaseline && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full border border-amber-200 dark:border-amber-700 animate-slide-in-up">
                <Target className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Baseline Upload</span>
              </div>
            )}
            
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isBaseline ? "Upload Baseline Audio" : "Upload Audio File"}
              </h1>
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
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Tap to select audio file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP3, WAV, M4A • Max 500MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a"
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
                  src={audioUrl || undefined}
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
                    <li>• Recommended length: 45 minutes – 2 hours</li>
                    <li>• Ensure audio quality is clear</li>
                    <li>• Supported formats: MP3, WAV, M4A</li>
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
                onClick={handleContinueToConfirmFromUpload}
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
                setStep("mode-select");
              }}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Step 4: Confirm Details
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col pb-24">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full border border-success/20 w-fit">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {inputMode === "record" ? "Recording Complete" : "File Ready"}
              </span>
            </div>
            {isBaseline && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full border border-amber-200 dark:border-amber-700">
                <Target className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Baseline</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {isBaseline ? "Confirm Baseline Details" : "Confirm Details"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and edit your session details before submitting
          </p>
        </div>

        <div className="space-y-5">
          {/* Baseline Recording Indicator */}
          {isBaseline && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  {inputMode === "record" ? "Baseline Recording" : "Baseline Upload"}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  This captures your current teaching style before FOP training.
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
                id="emergentScenarioConfirm"
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
            className="w-full mt-6"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting || (inputMode === "upload" && !audioFile)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit for Analysis
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Record;
