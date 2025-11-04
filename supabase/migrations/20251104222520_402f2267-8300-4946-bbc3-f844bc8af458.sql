-- Add timezone column to user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN timezone TEXT DEFAULT 'America/New_York';