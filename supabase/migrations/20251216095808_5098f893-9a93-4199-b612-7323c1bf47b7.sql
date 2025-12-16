-- Clean up duplicate SELECT policies and create single combined policies

-- pre_survey_responses
DROP POLICY IF EXISTS "Users can view their own responses" ON public.pre_survey_responses;
DROP POLICY IF EXISTS "Admins can view all pre survey responses" ON public.pre_survey_responses;
CREATE POLICY "Admins and users can view responses" 
ON public.pre_survey_responses FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- pre_survey_results
DROP POLICY IF EXISTS "Users can view their own results" ON public.pre_survey_results;
DROP POLICY IF EXISTS "Admins can view all pre survey results" ON public.pre_survey_results;
CREATE POLICY "Admins and users can view results" 
ON public.pre_survey_results FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- post_survey_responses
DROP POLICY IF EXISTS "Users can view their own responses" ON public.post_survey_responses;
DROP POLICY IF EXISTS "Admins can view all post survey responses" ON public.post_survey_responses;
CREATE POLICY "Admins and users can view responses" 
ON public.post_survey_responses FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- post_survey_results
DROP POLICY IF EXISTS "Users can view their own results" ON public.post_survey_results;
DROP POLICY IF EXISTS "Admins can view all post survey results" ON public.post_survey_results;
CREATE POLICY "Admins and users can view results" 
ON public.post_survey_results FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- session_reports
DROP POLICY IF EXISTS "Users can view their own reports" ON public.session_reports;
DROP POLICY IF EXISTS "Admins can view all session reports" ON public.session_reports;
CREATE POLICY "Admins and users can view reports" 
ON public.session_reports FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- session_surveys
DROP POLICY IF EXISTS "Users can view their own surveys" ON public.session_surveys;
DROP POLICY IF EXISTS "Admins can view all session surveys" ON public.session_surveys;
CREATE POLICY "Admins and users can view surveys" 
ON public.session_surveys FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.sessions;
CREATE POLICY "Admins and users can view sessions" 
ON public.sessions FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins and users can view profiles" 
ON public.profiles FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);