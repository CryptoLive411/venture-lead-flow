-- user_settings had a SELECT policy for every role (USING (true)), so anyone
-- holding the site's public key could read every rep's pipedrive_api_token,
-- email and phone through the REST API.
--
-- The browser only needs two things from other reps' rows: turn a form link
-- slug into the rep's id (FormPage) and check whether a username is taken
-- (Settings). Both use rep_id_for_username(), which returns the id and
-- nothing else. The table itself is readable only by its owner (the existing
-- "Users can view their own settings" policy). Edge functions use the service
-- role and are not affected.

DROP POLICY IF EXISTS "Anyone can view public contact info" ON public.user_settings;
DROP POLICY IF EXISTS "Public can view contact info for form submissions" ON public.user_settings;

CREATE OR REPLACE FUNCTION public.rep_id_for_username(slug text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id FROM public.user_settings WHERE username = lower(trim(slug)) LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.rep_id_for_username(text) FROM public;
GRANT EXECUTE ON FUNCTION public.rep_id_for_username(text) TO anon, authenticated;
