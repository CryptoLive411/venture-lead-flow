-- Add username field to user_settings for custom shareable links
ALTER TABLE public.user_settings
ADD COLUMN username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX idx_user_settings_username ON public.user_settings(username);

-- Add constraint to ensure username format
ALTER TABLE public.user_settings
ADD CONSTRAINT username_format CHECK (username ~ '^[a-z0-9-]+$');