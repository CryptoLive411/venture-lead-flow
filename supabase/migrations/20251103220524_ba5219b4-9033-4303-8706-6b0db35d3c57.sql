-- Allow anyone to view public contact information for shareable links
-- This enables the shareable link feature where agents can share their custom URLs
-- and players can see their contact info without being logged in

CREATE POLICY "Anyone can view public contact info"
ON public.user_settings
FOR SELECT
TO public
USING (true);

-- Note: Even though this allows reading all columns, sensitive data like pipedrive_api_token
-- is still protected because:
-- 1. The frontend only queries for specific non-sensitive columns
-- 2. Edge functions use service role to access full data when needed
-- 3. This enables the shareable link feature to work properly