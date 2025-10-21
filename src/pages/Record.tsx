import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/components/Waveform";
import { Mic, Square, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const navigate = useNavigate();

  const handleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      // Store interval for cleanup
      (window as any).recordingInterval = interval;
    }
  };

  const handleStop = () => {
    setIsRecording(false);
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval);
    }
    // Navigate to processing page
    setTimeout(() => {
      navigate("/processing");
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
          {/* Connection Status */}
          <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full border border-success/20 animate-slide-in-up">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium">Microphone Connected</span>
          </div>

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
                className="w-32 h-32 rounded-full gradient-accent shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
              >
                <Mic className="h-12 w-12 text-primary-foreground group-hover:scale-110 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="w-32 h-32 rounded-full bg-destructive shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
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
                    <li>• Record for at least 10 minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Record;
