import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { UserProfileTab } from "@/components/admin/UserProfileTab";
import { UserEventsTab } from "@/components/admin/UserEventsTab";
import { UserMilestonesTab } from "@/components/admin/UserMilestonesTab";
import { UserQuestionnaireTab } from "@/components/admin/UserQuestionnaireTab";
import { UserSessionsTab } from "@/components/admin/UserSessionsTab";

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin-user-detail", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">User not found</p>
        <Button variant="link" onClick={() => navigate("/admin/users")}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
          <p className="text-muted-foreground font-mono text-sm">{userId}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <UserProfileTab profile={profile} userId={userId!} />
        </TabsContent>

        <TabsContent value="events">
          <UserEventsTab profile={profile} userId={userId!} />
        </TabsContent>

        <TabsContent value="milestones">
          <UserMilestonesTab profile={profile} userId={userId!} />
        </TabsContent>

        <TabsContent value="questionnaire">
          <UserQuestionnaireTab userId={userId!} />
        </TabsContent>

        <TabsContent value="sessions">
          <UserSessionsTab userId={userId!} finalReportStatus={profile.final_report_status} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetail;
