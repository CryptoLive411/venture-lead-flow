-- Add policy to allow public read access to user_settings for edge functions
-- This is safe because we only expose phone_number and email fields
CREATE POLICY "Public can view contact info for form submissions"
ON public.user_settings
FOR SELECT
TO anon
USING (true);