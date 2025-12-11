import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { FileText, Upload, CheckCircle, TrendingUp } from "lucide-react";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      icon: FileText,
      title: "New Report Ready",
      message: "Your session from Nov 18 has been analyzed",
      time: "5 minutes ago",
      color: "primary" as const,
      unread: true,
    },
    {
      id: 2,
      icon: Upload,
      title: "Audio Uploaded Successfully",
      message: "Your recording is being processed",
      time: "1 hour ago",
      color: "success" as const,
      unread: true,
    },
    {
      id: 3,
      icon: TrendingUp,
      title: "Great Progress!",
      message: "You've improved 12% this month",
      time: "2 days ago",
      color: "secondary" as const,
      unread: false,
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "Weekly Goal Achieved",
      message: "You've completed 3 recordings this week",
      time: "3 days ago",
      color: "success" as const,
      unread: false,
    },
  ];

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

        {/* Notifications List */}
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

        {/* Empty State (hidden when notifications exist) */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 animate-slide-in-up">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              You're all caught up!
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              No new notifications right now. Keep recording sessions to get feedback.
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Notifications;
