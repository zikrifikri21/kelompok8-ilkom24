-- Create educational content table for energy saving tips
CREATE TABLE IF NOT EXISTS public.educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}'
);

-- Enable RLS for security
ALTER TABLE public.educational_content ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read published content (public access)
CREATE POLICY "Allow public read access to published content" 
ON public.educational_content FOR SELECT 
USING (is_published = true);

-- Create admin users table for content management
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE, -- Added UNIQUE constraint to email
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage their own data
CREATE POLICY "Allow admins to view their own data" 
ON public.admin_users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Allow admins to insert their own data" 
ON public.admin_users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow admins to manage educational content
CREATE POLICY "Allow admins to manage content" 
ON public.educational_content FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_educational_content_published ON public.educational_content(is_published);
CREATE INDEX IF NOT EXISTS idx_educational_content_category ON public.educational_content(category);
CREATE INDEX IF NOT EXISTS idx_educational_content_created_at ON public.educational_content(created_at DESC);
