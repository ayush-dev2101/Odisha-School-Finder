-- Add reviews and testimonials fields to schools table
ALTER TABLE public.schools 
ADD COLUMN reviews jsonb DEFAULT '[]'::jsonb,
ADD COLUMN testimonials jsonb DEFAULT '[]'::jsonb;

-- Add comments to describe the new columns
COMMENT ON COLUMN public.schools.reviews IS 'Array of review objects containing user reviews and comments';
COMMENT ON COLUMN public.schools.testimonials IS 'Array of testimonial objects containing user testimonials and feedback';