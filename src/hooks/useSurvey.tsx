import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SurveyData } from "@/types/survey";

export const useSurvey = (sessionId?: string) => {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    engagementTypes: [],
  });

  const [currentStep, setCurrentStep] = useState(1);

  const updateSurveyData = (updates: Partial<SurveyData>) => {
    setSurveyData((prev) => ({ ...prev, ...updates }));
  };

  const getNextStep = (): number | null => {
    const didNotEngage = surveyData.engagementTypes.includes("I did not engage with FOP");
    const practised = surveyData.engagementTypes.includes("I practised FOP in a learning session");
    const designed = surveyData.engagementTypes.includes("I designed a learning activity using FOP for a future session");

    if (currentStep === 1) {
      if (didNotEngage) return 7; // Non-engagement reasons
      if (practised) return 2; // Practice details
      if (designed) return 3; // Design difficulty
      return 8; // Time & Confidence
    }

    if (currentStep === 2) {
      if (designed) return 3; // Design difficulty after practice
      return 8; // Time & Confidence
    }

    if (currentStep === 3) {
      return 8; // Time & Confidence
    }

    return null; // Survey complete
  };

  const getTotalSteps = (): number => {
    const didNotEngage = surveyData.engagementTypes.includes("I did not engage with FOP");
    const practised = surveyData.engagementTypes.includes("I practised FOP in a learning session");
    const designed = surveyData.engagementTypes.includes("I designed a learning activity using FOP for a future session");

    if (didNotEngage) return 2; // Block 1 + Block 7
    if (practised && designed) return 4; // Block 1 + 2 + 3 + 8
    if (practised || designed) return 3; // Block 1 + (2 or 3) + 8
    return 2; // Block 1 + Block 8
  };

  const canProceed = (): boolean => {
    if (currentStep === 1) {
      return surveyData.engagementTypes.length > 0;
    }

    if (currentStep === 2) {
      return !!(surveyData.activityInvolvement?.length && surveyData.practiceDifficulty);
    }

    if (currentStep === 3) {
      return !!surveyData.designDifficulty;
    }

    if (currentStep === 7) {
      return !!(surveyData.nonEngagementReasons?.length);
    }

    if (currentStep === 8) {
      return !!(surveyData.timeSpent && surveyData.confidenceChange);
    }

    return false;
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
        engagement_types: surveyData.engagementTypes,
        engagement_other: surveyData.engagementOther,
        activity_involvement: surveyData.activityInvolvement,
        practice_difficulty: surveyData.practiceDifficulty,
        design_difficulty: surveyData.designDifficulty,
        non_engagement_reasons: surveyData.nonEngagementReasons,
        non_engagement_other: surveyData.nonEngagementOther,
        time_spent: surveyData.timeSpent,
        confidence_change: surveyData.confidenceChange,
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
    currentStep,
    setCurrentStep,
    updateSurveyData,
    getNextStep,
    getTotalSteps,
    canProceed,
    submitSurvey,
  };
};
