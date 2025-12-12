-- Create post_survey_responses table
CREATE TABLE public.post_survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_code TEXT NOT NULL,
  question_index INTEGER NOT NULL,
  response_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, category_code, question_index)
);

-- Enable RLS
ALTER TABLE public.post_survey_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_survey_responses
CREATE POLICY "Users can view their own responses" 
ON public.post_survey_responses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses" 
ON public.post_survey_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses" 
ON public.post_survey_responses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create post_survey_results table
CREATE TABLE public.post_survey_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_code TEXT NOT NULL,
  category_name TEXT NOT NULL,
  user_score NUMERIC NOT NULL,
  national_average NUMERIC NOT NULL,
  max_score INTEGER NOT NULL,
  recommendation TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, category_code)
);

-- Enable RLS
ALTER TABLE public.post_survey_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_survey_results
CREATE POLICY "Users can view their own results" 
ON public.post_survey_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results" 
ON public.post_survey_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own results" 
ON public.post_survey_results 
FOR UPDATE 
USING (auth.uid() = user_id);