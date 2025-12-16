import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SurveyData } from "@/types/survey";

export const useSurvey = (sessionId?: string) => {
  const [surveyData, setSurveyData] = useState<SurveyData>({});

  const updateSurveyData = (updates: Partial<SurveyData>) => {
    setSurveyData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = (): boolean => {
    return !!surveyData.practiceDifficulty;
  };

  const submitSurvey = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to submit the survey");
        return false;
      }

      const { error } = await supabase.from("session_surveys").insert({
        user_id: user.id,
        session_id: sessionId || null,
        engagement_types: [],
        practice_difficulty: surveyData.practiceDifficulty,
      });

      if (error) throw error;

      toast.success("Survey submitted successfully!");
      return true;
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Failed to submit survey");
      return false;
    }
  };

  return {
    surveyData,
    updateSurveyData,
    canProceed,
    submitSurvey,
  };
};
