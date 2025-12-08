-- Create sessions table
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  use_site TEXT NOT NULL,
  number_of_participants INTEGER NOT NULL,
  session_type TEXT NOT NULL,
  session_date DATE NOT NULL,
  emergent_scenario TEXT,
  audio_file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create session_reports table
CREATE TABLE public.session_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_scores JSONB NOT NULL,
  dialogue_scores JSONB NOT NULL,
  scenario_analysis JSONB NOT NULL,
  dialogue_analysis JSONB NOT NULL,
  talk_time_data JSONB NOT NULL,
  themes JSONB NOT NULL,
  conclusions JSONB NOT NULL,
  speaker_interactions JSONB NOT NULL,
  speakers JSONB NOT NULL,
  scenario_content JSONB NOT NULL,
  final_summary JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add session_id to session_surveys (optional link)
ALTER TABLE public.session_surveys ADD COLUMN session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL;

-- Enable RLS on sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
ON public.sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
ON public.sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
ON public.sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Enable RLS on session_reports
ALTER TABLE public.session_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
ON public.session_reports FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
ON public.session_reports FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add trigger for sessions updated_at
CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON public.sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();