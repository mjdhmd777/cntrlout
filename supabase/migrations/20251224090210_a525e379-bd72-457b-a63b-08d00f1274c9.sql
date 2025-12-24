-- Add explicit policy to block anonymous access to profiles table
-- This ensures unauthenticated users cannot read any profile data

CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);
