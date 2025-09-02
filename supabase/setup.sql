-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  district VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Government', 'Private', 'Aided', 'International')),
  board VARCHAR(50) NOT NULL CHECK (board IN ('CBSE', 'ICSE', 'State Board', 'IB')),
  established INTEGER,
  
  -- Enhanced Contact Details
  principal_name VARCHAR(200),
  principal_email VARCHAR(200),
  principal_phone VARCHAR(20),
  contact_email VARCHAR(200),
  contact_phone VARCHAR(20),
  alternate_contact_name VARCHAR(200),
  alternate_contact_phone VARCHAR(20),
  website VARCHAR(300),
  
  -- Enhanced Address Fields
  street_address TEXT,
  address TEXT, -- Keep for backward compatibility
  state VARCHAR(100) DEFAULT 'Odisha',
  pincode VARCHAR(10),
  landmark VARCHAR(200),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  description TEXT,
  image_url VARCHAR(500), -- Keep for backward compatibility
  facilities TEXT[],
  achievements TEXT[],
  ratings JSONB DEFAULT '{"overall": 0, "facility": 0, "faculty": 0, "activities": 0}'::jsonb,
  fee_structure JSONB,
  admission_process TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create school_images table for multiple images
CREATE TABLE IF NOT EXISTS school_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  image_type VARCHAR(50) CHECK (image_type IN ('infrastructure', 'events', 'general')),
  title VARCHAR(200),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  display_name VARCHAR(200),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Create user_roles table (alternative approach for role management)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin', 'moderator')),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Create school_ratings table for storing individual user ratings
CREATE TABLE IF NOT EXISTS school_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  overall INTEGER CHECK (overall >= 1 AND overall <= 5),
  facility INTEGER CHECK (facility >= 1 AND facility <= 5),
  faculty INTEGER CHECK (faculty >= 1 AND faculty <= 5),
  activities INTEGER CHECK (activities >= 1 AND activities <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, user_id)
);

-- Create reviews table for detailed reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update school ratings when individual ratings change
CREATE OR REPLACE FUNCTION update_school_average_ratings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE schools 
  SET ratings = (
    SELECT jsonb_build_object(
      'overall', COALESCE(ROUND(AVG(overall::numeric), 1), 0),
      'facility', COALESCE(ROUND(AVG(facility::numeric), 1), 0),
      'faculty', COALESCE(ROUND(AVG(faculty::numeric), 1), 0),
      'activities', COALESCE(ROUND(AVG(activities::numeric), 1), 0)
    )
    FROM school_ratings 
    WHERE school_id = COALESCE(NEW.school_id, OLD.school_id)
  )
  WHERE id = COALESCE(NEW.school_id, OLD.school_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update school ratings
DROP TRIGGER IF EXISTS update_school_ratings_trigger ON school_ratings;
CREATE TRIGGER update_school_ratings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON school_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_school_average_ratings();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, email, display_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(NEW.email, '@', 1),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Insert sample cities
INSERT INTO cities (name, district) VALUES
  ('Bhubaneswar', 'Khordha'),
  ('Cuttack', 'Cuttack'),
  ('Puri', 'Puri'),
  ('Berhampur', 'Ganjam'),
  ('Sambalpur', 'Sambalpur'),
  ('Rourkela', 'Sundargarh'),
  ('Balasore', 'Balasore'),
  ('Brahmapur', 'Ganjam'),
  ('Jeypore', 'Koraput'),
  ('Jharsuguda', 'Jharsuguda')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Schools: Everyone can read schools, only admins can modify
CREATE POLICY "Schools are viewable by everyone" ON schools FOR SELECT USING (true);
CREATE POLICY "Admins can modify schools" ON schools FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- School images: Everyone can read images, only admins can modify
CREATE POLICY "School images are viewable by everyone" ON school_images FOR SELECT USING (true);
CREATE POLICY "Admins can modify school images" ON school_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- School ratings: Users can read all ratings, but only modify their own
CREATE POLICY "School ratings are viewable by everyone" ON school_ratings FOR SELECT USING (true);
CREATE POLICY "Users can manage their own ratings" ON school_ratings FOR ALL USING (auth.uid() = user_id);

-- Reviews: Users can read all reviews, but only modify their own
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can manage their own reviews" ON reviews FOR ALL USING (auth.uid() = user_id);
