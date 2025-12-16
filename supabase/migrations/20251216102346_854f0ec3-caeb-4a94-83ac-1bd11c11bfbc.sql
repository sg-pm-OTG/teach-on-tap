-- Recreate SELECT policies as PERMISSIVE so admins can see all responses

-- pre_survey_responses
DROP POLICY IF EXISTS "Admins and users can view responses" ON public.pre_survey_responses;
CREATE POLICY "Admins and users can view responses"
ON public.pre_survey_responses
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR (auth.uid() = user_id));

-- post_survey_responses
DROP POLICY IF EXISTS "Admins and users can view responses" ON public.post_survey_responses;
CREATE POLICY "Admins and users can view responses"
ON public.post_survey_responses
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR (auth.uid() = user_id));
