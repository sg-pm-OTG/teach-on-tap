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

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["admin-user-sessions", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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

  const handleDownloadFinalReportPdf = () => {
    // Placeholder - will be implemented via GitHub
    toast.info("Final Report PDF download - to be implemented");
    console.log("Download final report PDF for user:", userId);
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

  const handleDownloadAudio = async (audioUrl: string) => {
    try {
      const path = audioUrl.split("/").slice(-2).join("/");
      const { data, error } = await supabase.storage
        .from("session-recordings")
        .createSignedUrl(path, 3600);

      if (error) throw error;

      const response = await fetch(data.signedUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `session_${path.split("/").pop()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error: any) {
      toast.error("Failed to download audio");
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
        {isLoading ? (
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
                  <TableHead>Participants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Baseline</TableHead>
                  <TableHead>Report</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      {format(new Date(session.session_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{session.use_site}</TableCell>
                    <TableCell>{session.session_type}</TableCell>
                    <TableCell>{session.number_of_participants}</TableCell>
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
                        {session.audio_file_url && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlayAudio(session.audio_file_url!)}
                            >
                              {playingAudioUrl === session.audio_file_url ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadAudio(session.audio_file_url!)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
        {finalReportStatus === "generated" && (
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
              <Button onClick={handleDownloadFinalReportPdf}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
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