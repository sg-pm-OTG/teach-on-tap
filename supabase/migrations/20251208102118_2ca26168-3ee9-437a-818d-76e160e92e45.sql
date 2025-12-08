-- Add is_baseline column to sessions table
ALTER TABLE public.sessions ADD COLUMN is_baseline boolean NOT NULL DEFAULT false;

-- Add journey tracking columns to profiles table
ALTER TABLE public.profiles ADD COLUMN baseline_completed boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN masterclass_attended boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN post_survey_completed boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN final_report_status text NOT NULL DEFAULT 'not_started';
ALTER TABLE public.profiles ADD COLUMN launch_huddle_attended boolean NOT NULL DEFAULT false;