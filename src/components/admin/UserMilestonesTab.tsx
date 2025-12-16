import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Flag } from "lucide-react";
import { toast } from "sonner";

interface UserMilestonesTabProps {
  profile: any;
  userId: string;
}

export const UserMilestonesTab = ({ profile, userId }: UserMilestonesTabProps) => {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    pre_survey_completed: profile.pre_survey_completed,
    baseline_completed: profile.baseline_completed,
    masterclass_attended: profile.masterclass_attended,
    post_survey_completed: profile.post_survey_completed,
    final_report_status: profile.final_report_status,
    launch_huddle_attended: profile.launch_huddle_attended,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("Milestones updated");
      queryClient.invalidateQueries({ queryKey: ["admin-user-detail", userId] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update milestones");
    } finally {
      setIsSaving(false);
    }
  };

  const milestones = [
    {
      key: "pre_survey_completed",
      label: "Pre-Survey Completed",
      description: "User has completed the initial questionnaire",
    },
    {
      key: "baseline_completed",
      label: "Baseline Completed",
      description: "User has recorded their baseline session",
    },
    {
      key: "masterclass_attended",
      label: "Masterclass Attended",
      description: "User has attended the masterclass event",
    },
    {
      key: "post_survey_completed",
      label: "Post-Survey Completed",
      description: "User has completed the post-program questionnaire",
    },
    {
      key: "launch_huddle_attended",
      label: "Launch Huddle Attended",
      description: "User has attended the launch huddle event",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Journey Milestones
        </CardTitle>
        <CardDescription>
          Toggle milestone completion status for this user
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {milestones.map((milestone) => (
          <div
            key={milestone.key}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="space-y-0.5">
              <Label htmlFor={milestone.key} className="font-medium">
                {milestone.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {milestone.description}
              </p>
            </div>
            <Switch
              id={milestone.key}
              checked={formData[milestone.key as keyof typeof formData] as boolean}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, [milestone.key]: checked })
              }
            />
          </div>
        ))}

        <div className="flex items-center justify-between py-2 border-b">
          <div className="space-y-0.5">
            <Label htmlFor="final_report_status" className="font-medium">
              Final Report Status
            </Label>
            <p className="text-sm text-muted-foreground">
              Current status of the final report
            </p>
          </div>
          <Select
            value={formData.final_report_status}
            onValueChange={(value) =>
              setFormData({ ...formData, final_report_status: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="generated">Generated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Milestones
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
