-- Create profile for the existing admin user
INSERT INTO public.profiles (user_id, email, display_name, created_at, updated_at)
VALUES (
  'c6c47e74-17bd-45b3-a92d-5ed62396592e',
  'ayushkr2705@gmail.com', 
  'Admin User',
  now(),
  now()
) ON CONFLICT (user_id) DO NOTHING;

-- Create a trigger to automatically create profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    now(),
    now()
  );
  RETURN NEW;
END;
$$;

-- Create trigger to run the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();