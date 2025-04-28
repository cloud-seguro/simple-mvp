-- RLS Policies for Supabase tables to prevent IDOR vulnerabilities
-- Run this on your Supabase database to enforce security at the database level

-- 1. Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_deals ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for the profiles table
-- Users can read their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid()::text = "userId");

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid()::text = "userId");

-- SuperAdmins can view all profiles 
CREATE POLICY "SuperAdmins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- SuperAdmins can update all profiles
CREATE POLICY "SuperAdmins can update all profiles"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- 3. Create policies for the evaluations table
-- Users can view their own evaluations
CREATE POLICY "Users can view their own evaluations"
ON evaluations FOR SELECT
USING (
  profileId IN (
    SELECT id FROM profiles WHERE userId = auth.uid()::text
  )
);

-- Users can update their own evaluations
CREATE POLICY "Users can update their own evaluations"
ON evaluations FOR UPDATE
USING (
  profileId IN (
    SELECT id FROM profiles WHERE userId = auth.uid()::text
  )
);

-- Users can insert evaluations for themselves
CREATE POLICY "Users can create their own evaluations"
ON evaluations FOR INSERT
WITH CHECK (
  profileId IN (
    SELECT id FROM profiles WHERE userId = auth.uid()::text
  )
);

-- SuperAdmins can view all evaluations
CREATE POLICY "SuperAdmins can view all evaluations"
ON evaluations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- SuperAdmins can update all evaluations
CREATE POLICY "SuperAdmins can update all evaluations"
ON evaluations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- 4. Create policies for the blog_posts table
-- Anyone can view published blog posts
CREATE POLICY "Anyone can view published blog posts"
ON blog_posts FOR SELECT
USING (status = 'PUBLISHED');

-- Authors can view their own blog posts regardless of status
CREATE POLICY "Authors can view their own blog posts"
ON blog_posts FOR SELECT
USING (
  authorId IN (
    SELECT id FROM profiles WHERE userId = auth.uid()::text
  )
);

-- Authors can update their own blog posts
CREATE POLICY "Authors can update their own blog posts"
ON blog_posts FOR UPDATE
USING (
  authorId IN (
    SELECT id FROM profiles WHERE userId = auth.uid()::text
  )
);

-- Authors can insert their own blog posts
CREATE POLICY "Authors can insert their own blog posts"
ON blog_posts FOR INSERT
WITH CHECK (
  authorId IN (
    SELECT id FROM profiles WHERE userId = auth.uid()::text
  )
);

-- SuperAdmins can view all blog posts
CREATE POLICY "SuperAdmins can view all blog posts"
ON blog_posts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- SuperAdmins can update all blog posts
CREATE POLICY "SuperAdmins can update all blog posts"
ON blog_posts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- 5. Create policies for engagements (CONTRATA module)
-- Users can view their own engagements
CREATE POLICY "Users can view their own engagements"
ON engagements FOR SELECT
USING (
  profileId IN (
    SELECT id FROM profiles WHERE userId = auth.uid()::text
  )
);

-- Users can update their own engagements
CREATE POLICY "Users can update their own engagements"
ON engagements FOR UPDATE
USING (
  profileId IN (
    SELECT id FROM profiles WHERE userId = auth.uid()::text
  )
);

-- SuperAdmins can view all engagements
CREATE POLICY "SuperAdmins can view all engagements"
ON engagements FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- 6. Create policies for messages
-- Users can view messages in their own engagements
CREATE POLICY "Users can view messages in their own engagements"
ON engagement_messages FOR SELECT
USING (
  engagementId IN (
    SELECT id FROM engagements 
    WHERE profileId IN (
      SELECT id FROM profiles WHERE userId = auth.uid()::text
    )
  )
);

-- 7. Create policies for specialists
-- Anyone can view active specialists
CREATE POLICY "Anyone can view active specialists"
ON specialists FOR SELECT
USING (active = true);

-- SuperAdmins can view all specialists
CREATE POLICY "SuperAdmins can view all specialists"
ON specialists FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- SuperAdmins can update specialists
CREATE POLICY "SuperAdmins can update specialists"
ON specialists FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- 8. Create policies for specialist deals
-- Anyone can view active deals
CREATE POLICY "Anyone can view active deals"
ON specialist_deals FOR SELECT
USING (active = true);

-- SuperAdmins can view all deals
CREATE POLICY "SuperAdmins can view all deals"
ON specialist_deals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

-- SuperAdmins can update deals
CREATE POLICY "SuperAdmins can update deals"
ON specialist_deals FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.userId = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
); 