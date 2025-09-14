
-- Agencies Table: Stores information about each agency or team.
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects Table: Stores information about each project an agency works on.
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agencies(id),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Clients Table: Stores information about the clients for an agency.
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agencies(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Monthly Metrics Table: Stores aggregated financial and operational data for each agency on a monthly basis.
CREATE TABLE monthly_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agencies(id),
    month DATE NOT NULL,
    revenue INT NOT NULL,
    expenses INT NOT NULL,
    new_leads INT NOT NULL,
    projects_won INT NOT NULL,
    portfolio_updates INT NOT NULL,
    UNIQUE(agency_id, month)
);

-- User Profiles Table: Stores public-facing user information.
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    headline TEXT,
    bio TEXT,
    avatar_url TEXT,
    website TEXT,
    category VARCHAR(50),
    reliability_score INT DEFAULT 100,
    -- Match the structure of the User type in placeholder-data.ts
    -- We will add more fields as we build out features.
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
-- 1. Users can view all profiles.
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

-- 2. Users can insert their own profile.
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- 3. Users can update their own profile.
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );
