-- Add contact information fields to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN phone_number TEXT,
ADD COLUMN whatsapp TEXT,
ADD COLUMN preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp')),
ADD COLUMN contact_visibility TEXT DEFAULT 'public' CHECK (contact_visibility IN ('public', 'private', 'friends_only'));

-- Add comment to explain the new fields
COMMENT ON COLUMN user_profiles.phone_number IS 'User phone number for contact';
COMMENT ON COLUMN user_profiles.whatsapp IS 'WhatsApp number or username';
COMMENT ON COLUMN user_profiles.preferred_contact_method IS 'User preferred method of contact';
COMMENT ON COLUMN user_profiles.contact_visibility IS 'Who can see contact information';

-- Update the trigger function to handle new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    role, 
    full_name, 
    avatar_url,
    phone_number,
    whatsapp,
    preferred_contact_method,
    contact_visibility
  )
  VALUES (
    NEW.id,
    'user',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    NULL, -- phone_number
    NULL, -- whatsapp
    'email', -- preferred_contact_method
    'public' -- contact_visibility
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to allow reading contact info for item owners
-- Users can read contact info of users who posted items they want to contact
CREATE POLICY "Allow reading contact info for item communication" ON user_profiles
FOR SELECT USING (
  -- Allow if user is reading their own profile
  auth.uid() = id
  OR 
  -- Allow if contact_visibility is public
  contact_visibility = 'public'
  OR
  -- Allow if user is admin
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Update the existing "Allow read for all users" policy to be more specific
DROP POLICY IF EXISTS "Allow read for all users" ON user_profiles;

-- Create a more specific policy for reading user profiles in joins
CREATE POLICY "Allow reading basic profile info for joins" ON user_profiles
FOR SELECT USING (
  -- Always allow reading basic info (name, avatar) for joins
  true
); 