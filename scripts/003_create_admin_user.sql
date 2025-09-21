-- Create first admin user
-- This script should be run after the first admin signs up through the auth system

-- Function to create admin user after signup
CREATE OR REPLACE FUNCTION public.create_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create admin profile for specific email domains or emails
  -- You can modify this condition based on your needs
  IF NEW.email LIKE '%@energicerdas.com' OR NEW.email = 'admin@example.com' THEN
    INSERT INTO public.admin_users (id, email, role)
    VALUES (NEW.id, NEW.email, 'admin')
    ON CONFLICT (id) DO NOTHING; -- Changed from email to id conflict resolution
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create admin users
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_admin_user();

-- Removed the manual INSERT statement that was causing the conflict error
-- The admin user will be created automatically when they sign up through the auth system
