import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Mic, 
  ClipboardCheck,
  GraduationCap,
  Bell
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
  id: string;
  icon: React.ElementType;
  title: string;
  message: string;
  time: string;
  timestamp: Date;
  color: "primary" | "secondary" | "success";
  unread: boolean;
}

const Notifications = () => {
  const { profile, isLoading: profileLoading } = useProfile();

  // Fetch sessions for notification generation
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions-for-notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  // Generate notifications from real data
  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = [];
    const now = new Date();

    // Profile milestone notifications
    if (profile) {
      // Pre-survey completed notification
      if (profile.pre_survey_completed) {
        notifications.push({
          id: 'pre-survey-completed',
          icon: ClipboardCheck,
          title: "Questionnaire Completed",
          message: "Great job! You've completed your questionnaire.",
          time: formatDistanceToNow(new Date(profile.updated_at), { addSuffix: true }),
          timestamp: new Date(profile.updated_at),
          color: "success",
          unread: false,
        });
      }

      // Baseline completed notification
      if (profile.baseline_completed) {
        notifications.push({
          id: 'baseline-completed',
          icon: Mic,
          title: "Baseline Recording Completed",
          message: "Your baseline has been established for comparison.",
          time: formatDistanceToNow(new Date(profile.updated_at), { addSuffix: true }),
          timestamp: new Date(profile.updated_at),
          color: "success",
          unread: false,
        });
      }

      // Masterclass attended notification
      if (profile.masterclass_attended) {
        notifications.push({
          id: 'masterclass-attended',
          icon: GraduationCap,
          title: "Masterclass Attended",
          message: "You've completed the FOP Masterclass training.",
          time: formatDistanceToNow(new Date(profile.updated_at), { addSuffix: true }),
          timestamp: new Date(profile.updated_at),
          color: "success",
          unread: false,
        });
      }

      // Post-survey completed notification
      if (profile.post_survey_completed) {
        notifications.push({
          id: 'post-survey-completed',
          icon: ClipboardCheck,
          title: "Post-Program Questionnaire Completed",
          message: "Your questionnaire responses have been recorded.",
          time: formatDistanceToNow(new Date(profile.updated_at), { addSuffix: true }),
          timestamp: new Date(profile.updated_at),
          color: "success",
          unread: false,
        });
      }

      // Final report notifications
      if (profile.final_report_status === 'pending') {
        notifications.push({
          id: 'final-report-pending',
          icon: FileText,
          title: "Final Report Pending",
          message: "Your final report is being generated.",
          time: formatDistanceToNow(new Date(profile.updated_at), { addSuffix: true }),
          timestamp: new Date(profile.updated_at),
          color: "primary",
          unread: true,
        });
      } else if (profile.final_report_status === 'completed') {
        notifications.push({
          id: 'final-report-ready',
          icon: FileText,
          title: "Final Report Ready",
          message: "Your complete FOP journey report is now available.",
          time: formatDistanceToNow(new Date(profile.updated_at), { addSuffix: true }),
          timestamp: new Date(profile.updated_at),
          color: "success",
          unread: true,
        });
      }
    }

    // Session-based notifications
    if (sessions && sessions.length > 0) {
      sessions.forEach((session) => {
        const sessionDate = new Date(session.created_at);
        const isRecent = (now.getTime() - sessionDate.getTime()) < 24 * 60 * 60 * 1000; // within 24h

        if (session.status === 'completed' && !session.is_baseline) {
          notifications.push({
            id: `session-completed-${session.id}`,
            icon: FileText,
            title: "Session Report Ready",
            message: `Your ${session.session_type} session has been analyzed.`,
            time: formatDistanceToNow(sessionDate, { addSuffix: true }),
            timestamp: sessionDate,
            color: "primary",
            unread: isRecent,
          });
        } else if (session.status === 'processing') {
          notifications.push({
            id: `session-processing-${session.id}`,
            icon: Upload,
            title: "Session Processing",
            message: `Your ${session.session_type} recording is being analyzed.`,
            time: formatDistanceToNow(sessionDate, { addSuffix: true }),
            timestamp: sessionDate,
            color: "secondary",
            unread: true,
          });
        } else if (session.status === 'pending') {
          notifications.push({
            id: `session-uploaded-${session.id}`,
            icon: Upload,
            title: "Session Uploaded",
            message: `Your ${session.session_type} session has been uploaded.`,
            time: formatDistanceToNow(sessionDate, { addSuffix: true }),
            timestamp: sessionDate,
            color: "success",
            unread: isRecent,
          });
        }
      });

      // Count regular sessions for milestone notifications
      const regularSessions = sessions.filter(s => !s.is_baseline && s.status === 'completed');
      
      if (regularSessions.length >= 3) {
        notifications.push({
          id: 'milestone-3-sessions',
          icon: CheckCircle,
          title: "Milestone Reached!",
          message: "You've completed 3 sessions. You can now request your Final Report.",
          time: formatDistanceToNow(new Date(regularSessions[2]?.created_at || now), { addSuffix: true }),
          timestamp: new Date(regularSessions[2]?.created_at || now),
          color: "success",
          unread: false,
        });
      }

      if (regularSessions.length >= 5) {
        notifications.push({
          id: 'milestone-5-sessions',
          icon: CheckCircle,
          title: "Journey Complete!",
          message: "You've completed all 5 required sessions. Amazing work!",
          time: formatDistanceToNow(new Date(regularSessions[4]?.created_at || now), { addSuffix: true }),
          timestamp: new Date(regularSessions[4]?.created_at || now),
          color: "success",
          unread: false,
        });
      }
    }

    // Sort by timestamp descending (most recent first)
    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const notifications = generateNotifications();
  const isLoading = profileLoading || sessionsLoading;

  const getIconBg = (color: string) => {
    const colorMap = {
      primary: "bg-primary/10 border-primary/20 text-primary",
      secondary: "bg-secondary/10 border-secondary/20 text-secondary",
      success: "bg-success/10 border-success/20 text-success",
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
      <TopBar />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="animate-slide-in-left">
          <h1 className="text-2xl font-bold text-foreground mb-1">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay updated on your progress</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 border-2">
                <div className="flex gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-48 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`p-4 border-2 hover:border-primary/30 transition-all cursor-pointer animate-slide-in-up ${
                    notification.unread ? "bg-primary/5" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${getIconBg(
                        notification.color
                      )}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm">
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 animate-slide-in-up">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No notifications yet
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Complete your questionnaire and start recording sessions to see your activity here.
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Notifications;
