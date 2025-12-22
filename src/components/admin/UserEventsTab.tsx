import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface UserEventsTabProps {
  profile: any;
  userId: string;
}

export const UserEventsTab = ({ profile, userId }: UserEventsTabProps) => {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    masterclass_datetime: profile.masterclass_datetime
      ? format(new Date(profile.masterclass_datetime), "yyyy-MM-dd'T'HH:mm")
      : "",
    masterclass_location: profile.masterclass_location || "",
    learning_huddle_datetime: profile.learning_huddle_datetime
      ? format(new Date(profile.learning_huddle_datetime), "yyyy-MM-dd'T'HH:mm")
      : "",
    learning_huddle_location: profile.learning_huddle_location || "",
    launch_huddle_datetime: profile.launch_huddle_datetime
      ? format(new Date(profile.launch_huddle_datetime), "yyyy-MM-dd'T'HH:mm")
      : "",
    launch_huddle_location: profile.launch_huddle_location || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData: any = {
        masterclass_location: formData.masterclass_location || null,
        learning_huddle_location: formData.learning_huddle_location || null,
        launch_huddle_location: formData.launch_huddle_location || null,
      };

      if (formData.masterclass_datetime) {
        updateData.masterclass_datetime = new Date(formData.masterclass_datetime).toISOString();
      } else {
        updateData.masterclass_datetime = null;
      }

      if (formData.learning_huddle_datetime) {
        updateData.learning_huddle_datetime = new Date(formData.learning_huddle_datetime).toISOString();
      } else {
        updateData.learning_huddle_datetime = null;
      }

      if (formData.launch_huddle_datetime) {
        updateData.launch_huddle_datetime = new Date(formData.launch_huddle_datetime).toISOString();
      } else {
        updateData.launch_huddle_datetime = null;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("Event details updated");
      queryClient.invalidateQueries({ queryKey: ["admin-user-detail", userId] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update event details");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Masterclass
          </CardTitle>
          <CardDescription>
            Schedule the masterclass event for this user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mc-datetime">Date & Time</Label>
            <Input
              id="mc-datetime"
              type="datetime-local"
              value={formData.masterclass_datetime}
              onChange={(e) =>
                setFormData({ ...formData, masterclass_datetime: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mc-location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Textarea
              id="mc-location"
              value={formData.masterclass_location}
              onChange={(e) =>
                setFormData({ ...formData, masterclass_location: e.target.value })
              }
              placeholder="Enter venue address..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Learning Huddle
          </CardTitle>
          <CardDescription>
            Schedule the learning huddle event for this user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="learningh-datetime">Date & Time</Label>
            <Input
              id="learningh-datetime"
              type="datetime-local"
              value={formData.learning_huddle_datetime}
              onChange={(e) =>
                setFormData({ ...formData, learning_huddle_datetime: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningh-location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Textarea
              id="learningh-location"
              value={formData.learning_huddle_location}
              onChange={(e) =>
                setFormData({ ...formData, learning_huddle_location: e.target.value })
              }
              placeholder="Enter venue address..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Launch Huddle
          </CardTitle>
          <CardDescription>
            Schedule the launch huddle event for this user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lh-datetime">Date & Time</Label>
            <Input
              id="lh-datetime"
              type="datetime-local"
              value={formData.launch_huddle_datetime}
              onChange={(e) =>
                setFormData({ ...formData, launch_huddle_datetime: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lh-location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Textarea
              id="lh-location"
              value={formData.launch_huddle_location}
              onChange={(e) =>
                setFormData({ ...formData, launch_huddle_location: e.target.value })
              }
              placeholder="Enter venue address..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 lg:col-span-3">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Event Details
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
