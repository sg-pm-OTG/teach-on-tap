-- Add Learning Huddle columns to profiles table
ALTER TABLE profiles ADD COLUMN learning_huddle_attended BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN learning_huddle_datetime TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN learning_huddle_location TEXT;