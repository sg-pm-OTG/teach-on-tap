-- Create role enum (only admin for now)
CREATE TYPE public.app_role AS ENUM ('admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- RLS policy: Only admins can view user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS policy: Only admins can insert roles
CREATE POLICY "Admins can create roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- RLS policy: Only admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Add per-user event fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS masterclass_datetime TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS masterclass_location TEXT,
ADD COLUMN IF NOT EXISTS launch_huddle_datetime TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS launch_huddle_location TEXT;

-- Create admin-only RLS policies for profiles (admins can view/edit all profiles)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- Create admin-only RLS policies for sessions
CREATE POLICY "Admins can view all sessions"
ON public.sessions
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Admins can update all sessions"
ON public.sessions
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Admins can delete all sessions"
ON public.sessions
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create admin-only RLS policies for session_reports
CREATE POLICY "Admins can view all session reports"
ON public.session_reports
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- Create admin-only RLS policies for pre_survey_responses
CREATE POLICY "Admins can view all pre survey responses"
ON public.pre_survey_responses
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- Create admin-only RLS policies for pre_survey_results
CREATE POLICY "Admins can view all pre survey results"
ON public.pre_survey_results
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- Create admin-only RLS policies for post_survey_responses
CREATE POLICY "Admins can view all post survey responses"
ON public.post_survey_responses
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- Create admin-only RLS policies for post_survey_results
CREATE POLICY "Admins can view all post survey results"
ON public.post_survey_results
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- Create admin-only RLS policies for session_surveys
CREATE POLICY "Admins can view all session surveys"
ON public.session_surveys
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);