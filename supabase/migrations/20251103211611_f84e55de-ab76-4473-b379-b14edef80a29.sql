-- Remove the overly permissive public policy that exposes API tokens and contact info
DROP POLICY IF EXISTS "Public can view contact info for form submissions" ON public.user_settings;

-- The existing user-specific policies remain:
-- - Users can view their own settings
-- - Users can update their own settings  
-- - Users can insert their own settings

-- These policies are correct and secure, allowing users to manage only their own data
-- The edge function uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS, so it will continue to work