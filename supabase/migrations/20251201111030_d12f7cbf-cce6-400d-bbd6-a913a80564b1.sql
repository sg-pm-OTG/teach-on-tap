-- Create session_surveys table for storing progress tracking responses
CREATE TABLE public.session_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Block 1: Engagement types (always required)
  engagement_types TEXT[] NOT NULL,
  engagement_other TEXT,
  
  -- Block 2: Practice details (shown if "practised FOP" selected)
  activity_involvement TEXT[],
  practice_difficulty TEXT,
  
  -- Block 3: Design difficulty (shown if "designed learning activity" selected)
  design_difficulty TEXT,
  
  -- Block 7: Non-engagement reasons (shown if "did not engage" selected)
  non_engagement_reasons TEXT[],
  non_engagement_other TEXT,
  
  -- Block 8: Time & Confidence (shown for any engagement except "did not engage")
  time_spent TEXT,
  confidence_change TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_surveys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can insert their own surveys"
  ON public.session_surveys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own surveys"
  ON public.session_surveys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);