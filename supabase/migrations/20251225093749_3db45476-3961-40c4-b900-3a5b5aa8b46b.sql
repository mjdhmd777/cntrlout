-- Create a function to handle new user role assignment
-- This will be called by a trigger or can be called by the Auth page
CREATE OR REPLACE FUNCTION public.assign_user_role(
  _user_id uuid,
  _role app_role,
  _email text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert the user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Insert the profile if it doesn't exist
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (_user_id, '', _email)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.assign_user_role TO authenticated;

-- Add a unique constraint on user_id in profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_user_id_key'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;