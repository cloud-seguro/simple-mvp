-- One-time setup for RLS in Supabase
-- Run this script in the Supabase SQL Editor

-- First, enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_deals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if needed (uncomment if you want to reset)
-- DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
-- DROP POLICY IF EXISTS "SuperAdmins can view all profiles" ON profiles;
-- DROP POLICY IF EXISTS "SuperAdmins can update all profiles" ON profiles;

-- Create essential profile policies
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid()::text = "userId");

CREATE POLICY "SuperAdmins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- Create essential evaluation policies
CREATE POLICY "Users can view their own evaluations"
ON evaluations FOR SELECT
USING (
  profileId IN (
    SELECT id FROM profiles WHERE "userId" = auth.uid()::text
  )
);

CREATE POLICY "Users can update their own evaluations"
ON evaluations FOR UPDATE
USING (
  profileId IN (
    SELECT id FROM profiles WHERE "userId" = auth.uid()::text
  )
);

-- Create essential blog post policies
CREATE POLICY "Anyone can view published blog posts"
ON blog_posts FOR SELECT
USING (status = 'PUBLISHED');

CREATE POLICY "Authors can view their own blog posts"
ON blog_posts FOR SELECT
USING (
  authorId IN (
    SELECT id FROM profiles WHERE "userId" = auth.uid()::text
  )
);

-- Create essential engagement policies
CREATE POLICY "Users can view their own engagements"
ON engagements FOR SELECT
USING (
  profileId IN (
    SELECT id FROM profiles WHERE "userId" = auth.uid()::text
  )
);

-- Create essential message policies 
CREATE POLICY "Users can view messages in their own engagements"
ON engagement_messages FOR SELECT
USING (
  engagementId IN (
    SELECT id FROM engagements 
    WHERE profileId IN (
      SELECT id FROM profiles WHERE "userId" = auth.uid()::text
    )
  )
);

-- Create essential specialist policies
CREATE POLICY "Anyone can view active specialists"
ON specialists FOR SELECT
USING (active = true);

-- Create essential specialist deals policies
CREATE POLICY "Anyone can view active deals"
ON specialist_deals FOR SELECT
USING (active = true); 