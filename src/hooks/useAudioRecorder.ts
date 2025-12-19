import { useState, useRef, useCallback } from "react";
import axios from 'axios';
import { supabase } from "@/integrations/supabase/client";

interface UseAudioRecorderReturn {
  isRecording: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  error: string | null;
  startRecording: (sessionId: string) => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
}

const CHUNK_DURATION_MS = 60_000

export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const sessionIdRef = useRef<string>();
  const chunkIndexRef = useRef<number>(0);
  const uploadQueueRef = useRef<Blob[]>([]);
  const isUploadingRef = useRef<boolean>(false);
  const isStoppingRef = useRef<boolean>(false);
  const tempIdRef = useRef<string | null>(null);
  const finalChunkSentRef = useRef(false);

  const getAccessToken = async (): Promise<string> => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session?.access_token) {
      throw new Error("Not authenticated");
    }

    return data.session.access_token;
  };

  const uploadChunk = async (blob: Blob, index: number, sessionId: string, isFinal: boolean) => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("index", String(index));
    formData.append("is_final", isFinal ? '1' : '0');
    formData.append("audio_chunk_file", blob, `chunk-${sessionId}-${index}.webm`);
    formData.append('upload_mode', 'stream')

    if (tempIdRef.current) {
      formData.append("temp_id", tempIdRef.current);
      const { data, error } = await supabase.from("sessions").select("*").eq("id", sessionId).single();
      formData.append("session", JSON.stringify(data));

      if (error) {
        console.error("Error fetching session:", error);
      }
    }

    const token = await getAccessToken();

    try {
      const res = await axios.post(
        "https://be-sussial.otg-lab.xyz/api/v1/analyze/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30_000,
        }
      );

      if (!tempIdRef.current && res.data?.temp_id) {
        tempIdRef.current = res.data.temp_id;
      }

    } catch (err) {
      // Retry
      uploadQueueRef.current.unshift(blob);
      throw err;
    }
  };

  const processQueue = useCallback(async (sessionId: string) => {
    if (isUploadingRef.current) return;
    isUploadingRef.current = true;

    while (uploadQueueRef.current.length > 0) {
      const blob = uploadQueueRef.current[0];
      const index = chunkIndexRef.current - uploadQueueRef.current.length;

      const isFinal =
        isStoppingRef.current &&
        uploadQueueRef.current.length === 1 &&
        !finalChunkSentRef.current;

      try {
        await uploadChunk(blob, index, sessionId, isFinal);

        if (isFinal) {
          finalChunkSentRef.current = true;
        }

        uploadQueueRef.current.shift();
      } catch {
        await new Promise((r) => setTimeout(r, 10000));
      }
    }

    isUploadingRef.current = false;
  }, []);

  const startRecording = useCallback(async (sessionId: string) => {
    try {
      setError(null);
      chunkIndexRef.current = 0;
      uploadQueueRef.current = [];
      tempIdRef.current = null;
      isStoppingRef.current = false;
      finalChunkSentRef.current = false;

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          uploadQueueRef.current.push(event.data);
          chunkIndexRef.current++;
          processQueue(sessionId);
        }
      };

      // Start recording
      mediaRecorder.start(CHUNK_DURATION_MS); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setError("Microphone permission denied. Please allow access to record.");
        } else if (err.name === "NotFoundError") {
          setError("No microphone found. Please connect a microphone.");
        } else {
          setError("Failed to access microphone. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    isStoppingRef.current = true;
    finalChunkSentRef.current = false;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
  }, []);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setRecordingTime(0);
    setError(null);
    chunkIndexRef.current = 0;
    sessionIdRef.current = crypto.randomUUID();
    uploadQueueRef.current = [];
  }, []);

  return {
    isRecording,
    recordingTime,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
