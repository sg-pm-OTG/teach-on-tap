import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  years_teaching_experience: number;
  pre_survey_completed: boolean;
  post_survey_completed: boolean;
  baseline_completed: boolean;
  masterclass_attended: boolean;
  final_report_status: string;
  launch_huddle_attended: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
  };

  return { 
    profile: profile ?? null, 
    isLoading, 
    loading: isLoading, 
    error: error?.message ?? null, 
    refetch 
  };
};
