-- Create a view that provides a unified way to access user data
-- This view combines data from auth.users and public.users tables

CREATE OR REPLACE VIEW user_profile AS
SELECT 
  u.id,
  u.email,
  -- Use users.full_name if available, otherwise fallback to user_metadata
  COALESCE(pu.full_name, au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name') as name,
  -- Use users.avatar_url if available, otherwise fallback to user_metadata
  COALESCE(pu.avatar_url, au.raw_user_meta_data->>'avatar_url') as avatar_url,
  pu.level,
  pu.xp,
  pu.coins,
  COALESCE(pu.created_at, au.created_at) as created_at,
  COALESCE(pu.updated_at, au.updated_at) as updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;

-- Grant appropriate permissions for the authenticated users
ALTER VIEW user_profile OWNER TO authenticated;
GRANT SELECT ON user_profile TO authenticated;

-- We need to ensure RLS is enabled on the users table to prevent unauthorized access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to only see and update their own user data
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id); 