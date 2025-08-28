-- Enhance user authentication and password reset functionality
-- This migration ensures proper user data storage and password management

-- Update profiles table to ensure it has all necessary fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;

-- Create index for email verification
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON profiles(email_verified);

-- Create index for password reset tokens
CREATE INDEX IF NOT EXISTS idx_profiles_password_reset ON profiles(password_reset_token);

-- Create function to handle password reset
CREATE OR REPLACE FUNCTION public.handle_password_reset()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's profile when password is changed
  UPDATE public.profiles 
  SET 
    password_reset_token = NULL,
    password_reset_expires = NULL,
    updated_at = NOW()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for password reset
DROP TRIGGER IF EXISTS on_password_reset ON auth.users;
CREATE TRIGGER on_password_reset
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_password_reset();

-- Create function to generate password reset token
CREATE OR REPLACE FUNCTION public.generate_password_reset_token(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  reset_token TEXT;
  user_profile RECORD;
BEGIN
  -- Generate a secure random token
  reset_token := encode(gen_random_bytes(32), 'hex');
  
  -- Find the user profile
  SELECT * INTO user_profile FROM profiles WHERE email = user_email;
  
  IF user_profile IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Update the profile with reset token and expiration
  UPDATE profiles 
  SET 
    password_reset_token = reset_token,
    password_reset_expires = NOW() + INTERVAL '1 hour',
    updated_at = NOW()
  WHERE user_id = user_profile.user_id;
  
  RETURN reset_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify password reset token
CREATE OR REPLACE FUNCTION public.verify_password_reset_token(token TEXT)
RETURNS UUID AS $$
DECLARE
  user_id UUID;
BEGIN
  SELECT profiles.user_id INTO user_id
  FROM profiles 
  WHERE 
    password_reset_token = token 
    AND password_reset_expires > NOW();
  
  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clear password reset token
CREATE OR REPLACE FUNCTION public.clear_password_reset_token(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET 
    password_reset_token = NULL,
    password_reset_expires = NULL,
    updated_at = NOW()
  WHERE profiles.user_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.generate_password_reset_token(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_password_reset_token(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.clear_password_reset_token(UUID) TO authenticated;

-- Create RLS policies for password reset functions
CREATE POLICY "Users can generate password reset tokens for themselves"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Ensure email verification is properly handled
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Update email verification status when user email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.profiles 
    SET 
      email_verified = TRUE,
      updated_at = NOW()
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email verification
DROP TRIGGER IF EXISTS on_email_verification ON auth.users;
CREATE TRIGGER on_email_verification
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_email_verification();
