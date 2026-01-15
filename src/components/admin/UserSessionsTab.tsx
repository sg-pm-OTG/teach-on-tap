import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Download, Trash2, Mic, Pause, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import axios from "axios";
import { mapApiResultToSessionReport } from "@/utils/mapApiResultToSessionReport";
import { useFinalReportData } from "@/hooks/useFinalReportData";
import PdfExportFinalReport from "../final-report/TemplateExportFinalReport";

interface UserSessionsTabProps {
  userId: string;
  finalReportStatus?: string;
}

export const UserSessionsTab = ({ userId, finalReportStatus }: UserSessionsTabProps) => {
  const queryClient = useQueryClient();
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const {
    isLoading,
    journeyTimeline,
    scenarioScoreProgression,
    dialogueScoreProgression,
    talkTimeBySession,
    latestSpeakerInteractions,
    beliefComparisons,
    orientationComparisons,
    difficultyProgression,
    summaryStats,
    allSpeakerInteractions,
    sessionReports,
  } = useFinalReportData(userId);

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user-name", userId],
    enabled: !!userId,
    queryFn: async () => {
      const {data, error} = await supabase.from("profiles").select('name').eq('user_id', userId);
      if (error) throw error;
      return data[0];
    },
  })

  const { data: sessions, isLoading: isLoadingSession } = useQuery({
    queryKey: ["admin-user-sessions", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const token = await getAccessToken();
      const apiData = await Promise.all(
        data.map(async (item: any) => {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/analyze/admin-get-result?session_id=${item.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 30_000,
            }
          );

          return {
            ...item,
            data: mapApiResultToSessionReport(res.data.data), // raw result
          };
        })
      )
      return apiData;
    },
  });

  const {data: finalReport, isLoading: isLoadingFinalReport} = useQuery({
    queryKey: ["admin-user-final-report", userId],
    enabled: !!userId,
    retry: false,
    queryFn: async () => {
      try {
        const token = await getAccessToken();

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/analyze/admin-get-final-report`,
          {
            params: { final_report_user_id: userId },
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30_000,
          }
        );

        return res.data;
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
  });

  const getAccessToken = async (): Promise<string> => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session?.access_token) {
      throw new Error("Not authenticated");
    }

    return data.session.access_token;
  };

  // Fetch session reports to know which sessions have reports
  const { data: sessionReportIds } = useQuery({
    queryKey: ["admin-user-session-reports", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_reports")
        .select("session_id")
        .eq("user_id", userId);

      if (error) throw error;
      return data?.map((r) => r.session_id) || [];
    },
  });

  const hasReport = (sessionId: string) => sessionReportIds?.includes(sessionId);

  const handleDownloadSessionPdf = (sessionId: string) => {
    // Placeholder - will be implemented via GitHub
    toast.info("Session PDF download - to be implemented");
    console.log("Download session PDF for:", sessionId);
  };

  const handlePlayAudio = async (audioUrl: string) => {
    if (playingAudioUrl === audioUrl && audioElement) {
      audioElement.pause();
      setPlayingAudioUrl(null);
      setAudioElement(null);
      return;
    }

    try {
      // Get signed URL for private bucket
      const path = audioUrl.split("/").slice(-2).join("/");
      const { data, error } = await supabase.storage
        .from("session-recordings")
        .createSignedUrl(path, 3600);

      if (error) throw error;

      const audio = new Audio(data.signedUrl);
      audio.onended = () => {
        setPlayingAudioUrl(null);
        setAudioElement(null);
      };
      audio.play();
      setPlayingAudioUrl(audioUrl);
      setAudioElement(audio);
    } catch (error: any) {
      toast.error("Failed to play audio");
    }
  };

  const handleDownloadTranscript = async (transcriptUrl: string, filename: string) => {
    try {
      const token = await getAccessToken()
      const res = await axios.get(
        transcriptUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", 
          timeout: 60_000,
        }
      );

      // CSV MIME type
      const blob = new Blob([res.data], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `session-${filename}.csv`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    } 
  };

  const handleDeleteSession = async () => {
    if (!deleteSessionId) return;
    setIsDeleting(true);

    try {
      // First, get the session to find the audio file
      const { data: session, error: fetchError } = await supabase
        .from("sessions")
        .select("audio_file_url")
        .eq("id", deleteSessionId)
        .single();

      if (fetchError) throw fetchError;

      // Delete audio file from storage if exists
      if (session?.audio_file_url) {
        const path = session.audio_file_url.split("/").slice(-2).join("/");
        await supabase.storage.from("session-recordings").remove([path]);
      }

      // Delete session report if exists
      await supabase
        .from("session_reports")
        .delete()
        .eq("session_id", deleteSessionId);

      // Delete session survey if exists
      await supabase
        .from("session_surveys")
        .delete()
        .eq("session_id", deleteSessionId);

      // Delete the session
      const { error: deleteError } = await supabase
        .from("sessions")
        .delete()
        .eq("id", deleteSessionId);

      if (deleteError) throw deleteError;

      toast.success("Session deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-user-sessions", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-session-reports", userId] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete session");
    } finally {
      setIsDeleting(false);
      setDeleteSessionId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    isLoading && isLoadingFinalReport ? <span>Loading...</span> :
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Recording Sessions
        </CardTitle>
        <CardDescription>
          View and manage user's recorded sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoadingSession ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No sessions recorded
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Baseline</TableHead>
                  <TableHead>Report</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions?.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      {format(new Date(session.session_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{session.use_site}</TableCell>
                    <TableCell>{session.session_type}</TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                    <TableCell>
                      {session.is_baseline ? (
                        <Badge variant="secondary">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {hasReport(session.id) ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadSessionPdf(session.id)}
                          title="Download Session Report PDF"
                        >
                          <FileText className="h-4 w-4 text-primary" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {session.data.audioFileUrl && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlayAudio(session.data.audioFileUrl!)}
                            >
                              {playingAudioUrl === session.data.audioFileUrl ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        )}
                        {session.data.csvFileUrl ?
                          (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadTranscript(session.data.csvFileUrl!, session.data.filename)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : 
                          (
                            <Button variant="ghost" size="icon" disabled>—</Button>
                          ) 
                        }
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteSessionId(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Final Report Download Section */}
        {finalReportStatus === "generated" && !isLoadingFinalReport && !isLoading && finalReport.data !== undefined && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Final Report</p>
                  <p className="text-sm text-muted-foreground">
                    Journey summary report has been generated
                  </p>
                </div>
              </div>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  {
                  !isLoading && !isLoadingFinalReport ?         
                    <PdfExportFinalReport
                      user={user.name}
                      exportData={finalReport?.data}
                      journeyTimeline={journeyTimeline.filter(item => !item.isBaseline)}
                      talkTimeBySession={talkTimeBySession}
                      scenarioScoreProgression={scenarioScoreProgression}
                      dialogueScoreProgression={dialogueScoreProgression}
                      allSpeakerInteractions={allSpeakerInteractions}
                      difficultyProgression={difficultyProgression}
                    />
                    : 'Generate PDF...'
                  }
                </Button>
            </div>
          </div>
        )}

        <AlertDialog
          open={!!deleteSessionId}
          onOpenChange={() => setDeleteSessionId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Session?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                session, its report, survey responses, and audio recording.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteSession}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete Session"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};