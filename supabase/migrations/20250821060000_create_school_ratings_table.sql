-- Create school_ratings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.school_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  overall INTEGER NOT NULL CHECK (overall >= 1 AND overall <= 5),
  facility INTEGER NOT NULL CHECK (facility >= 1 AND facility <= 5),
  faculty INTEGER NOT NULL CHECK (faculty >= 1 AND faculty <= 5),
  activities INTEGER NOT NULL CHECK (activities >= 1 AND activities <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on school_ratings
ALTER TABLE public.school_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for school_ratings
CREATE POLICY "School ratings are viewable by everyone" 
ON public.school_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own ratings" 
ON public.school_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own ratings" 
ON public.school_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
ON public.school_ratings 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ratings" 
ON public.school_ratings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_school_ratings_updated_at
BEFORE UPDATE ON public.school_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_school_ratings_school_id ON public.school_ratings(school_id);
CREATE INDEX IF NOT EXISTS idx_school_ratings_user_id ON public.school_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_school_ratings_created_at ON public.school_ratings(created_at);

-- Add comments
COMMENT ON TABLE public.school_ratings IS 'Stores user ratings and reviews for schools';
COMMENT ON COLUMN public.school_ratings.overall IS 'Overall rating from 1-5 stars';
COMMENT ON COLUMN public.school_ratings.facility IS 'Facility rating from 1-5 stars';
COMMENT ON COLUMN public.school_ratings.faculty IS 'Faculty rating from 1-5 stars';
COMMENT ON COLUMN public.school_ratings.activities IS 'Activities rating from 1-5 stars';
COMMENT ON COLUMN public.school_ratings.comment IS 'Optional text review/comment';
