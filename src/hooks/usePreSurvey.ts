import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { PreSurveyResponse, PreSurveyResult } from "@/types/preSurvey";
import { preSurveyCategories } from "@/data/preSurveyQuestions";
import { nationalBenchmarks, recommendations } from "@/data/nationalBenchmarks";
import { useToast } from "@/hooks/use-toast";

export const usePreSurvey = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<Map<string, number>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<PreSurveyResult[] | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const setResponse = (categoryCode: string, questionIndex: number, value: number) => {
    const key = `${categoryCode}_${questionIndex}`;
    setResponses(prev => new Map(prev).set(key, value));
  };

  const getResponse = (categoryCode: string, questionIndex: number): number | undefined => {
    const key = `${categoryCode}_${questionIndex}`;
    return responses.get(key);
  };

  const calculateResults = (): PreSurveyResult[] => {
    const results: PreSurveyResult[] = [];

    for (const category of preSurveyCategories) {
      const categoryResponses: number[] = [];
      
      for (let i = 0; i < category.questions.length; i++) {
        const response = getResponse(category.code, i);
        if (response !== undefined) {
          categoryResponses.push(response);
        }
      }

      if (categoryResponses.length > 0) {
        const average = categoryResponses.reduce((a, b) => a + b, 0) / categoryResponses.length;
        const userScore = Math.round(average * 100) / 100;
        
        results.push({
          categoryCode: category.code,
          categoryName: category.name,
          userScore,
          nationalAverage: nationalBenchmarks[category.code] || category.maxScore * 0.7,
          maxScore: category.maxScore,
          recommendation: recommendations[category.code] || "Continue developing your skills in this area.",
        });
      }
    }

    return results;
  };

  const submitSurvey = async (): Promise<boolean> => {
    if (!user) return false;
    
    setIsSubmitting(true);
    try {
      // Save individual responses
      const responseEntries: PreSurveyResponse[] = [];
      responses.forEach((value, key) => {
        const [categoryCode, questionIndexStr] = key.split('_');
        responseEntries.push({
          categoryCode,
          questionIndex: parseInt(questionIndexStr),
          responseValue: value,
        });
      });

      // Insert responses
      const { error: responseError } = await supabase
        .from('pre_survey_responses')
        .upsert(
          responseEntries.map(r => ({
            user_id: user.id,
            category_code: r.categoryCode,
            question_index: r.questionIndex,
            response_value: r.responseValue,
          })),
          { onConflict: 'user_id,category_code,question_index' }
        );

      if (responseError) throw responseError;

      // Calculate and save results
      const calculatedResults = calculateResults();
      
      const { error: resultsError } = await supabase
        .from('pre_survey_results')
        .upsert(
          calculatedResults.map(r => ({
            user_id: user.id,
            category_code: r.categoryCode,
            category_name: r.categoryName,
            user_score: r.userScore,
            national_average: r.nationalAverage,
            max_score: r.maxScore,
            recommendation: r.recommendation,
          })),
          { onConflict: 'user_id,category_code' }
        );

      if (resultsError) throw resultsError;

      // Update profile to mark survey as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ pre_survey_completed: true })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      setResults(calculatedResults);
      return true;
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadResults = async () => {
    if (!user) return;
    
    setIsLoadingResults(true);
    try {
      const { data, error } = await supabase
        .from('pre_survey_results')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        setResults(data.map(r => ({
          categoryCode: r.category_code,
          categoryName: r.category_name,
          userScore: Number(r.user_score),
          nationalAverage: Number(r.national_average),
          maxScore: r.max_score,
          recommendation: r.recommendation || "",
        })));
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const getCompletedCount = (): number => {
    return responses.size;
  };

  const getTotalQuestions = (): number => {
    return preSurveyCategories.reduce((total, cat) => total + cat.questions.length, 0);
  };

  return {
    responses,
    setResponse,
    getResponse,
    submitSurvey,
    isSubmitting,
    results,
    loadResults,
    isLoadingResults,
    getCompletedCount,
    getTotalQuestions,
  };
};
