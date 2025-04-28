-- Supabase RLS Implementation
-- Copy and paste this entire file into the Supabase SQL Editor and run it.
-- This will set up Row Level Security (RLS) to prevent IDOR vulnerabilities.

-- First, let's make sure we're using correct case-sensitive column names
-- PostgreSQL requires exact case matching for column names

BEGIN;

-- 1. Enable Row Level Security on all tables
-- This prevents all access by default until we add policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_deals ENABLE ROW LEVEL SECURITY;

-- 2. Clean up any existing policies if needed
-- Uncomment these if you need to reset policies
-- DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
-- DROP POLICY IF EXISTS "SuperAdmins can view all profiles" ON profiles;
-- DROP POLICY IF EXISTS "SuperAdmins can update all profiles" ON profiles;

-- 3. Profile policies
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

-- 4. Evaluation policies
CREATE POLICY "Users can view their own evaluations"
ON evaluations FOR SELECT
USING (
  "profileId" IN (
    SELECT id FROM profiles WHERE "userId" = auth.uid()::text
  )
);

CREATE POLICY "Users can update their own evaluations"
ON evaluations FOR UPDATE
USING (
  "profileId" IN (
    SELECT id FROM profiles WHERE "userId" = auth.uid()::text
  )
);

CREATE POLICY "Users can create their own evaluations"
ON evaluations FOR INSERT
WITH CHECK (
  "profileId" IN (
    SELECT id FROM profiles WHERE "userId" = auth.uid()::text
  )
);

-- 5. Blog post policies
CREATE POLICY "Anyone can view published blog posts"
ON blog_posts FOR SELECT
USING (status = 'PUBLISHED');

CREATE POLICY "Authors can view their own blog posts"
ON blog_posts FOR SELECT
USING (
  "authorId" IN (
    SELECT id FROM profiles WHERE "userId" = auth.uid()::text
  )
);

-- 6. Engagement policies
CREATE POLICY "Users can view their own engagements"
ON engagements FOR SELECT
USING (
  "profileId" IN (
    SELECT id FROM profiles WHERE "userId" = auth.uid()::text
  )
);

CREATE POLICY "Users can update their own engagements"
ON engagements FOR UPDATE
USING (
  "profileId" IN (
    SELECT id FROM profiles WHERE "userId" = auth.uid()::text
  )
);

-- 7. Message policies
CREATE POLICY "Users can view messages in their own engagements"
ON engagement_messages FOR SELECT
USING (
  "engagementId" IN (
    SELECT id FROM engagements 
    WHERE "profileId" IN (
      SELECT id FROM profiles WHERE "userId" = auth.uid()::text
    )
  )
);

-- 8. Specialist policies
CREATE POLICY "Anyone can view active specialists"
ON specialists FOR SELECT
USING (active = true);

-- 9. Specialist deals policies
CREATE POLICY "Anyone can view active deals"
ON specialist_deals FOR SELECT
USING (active = true);

-- 10. SuperAdmin access policies for all tables
CREATE POLICY "SuperAdmins can view all evaluations"
ON evaluations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

CREATE POLICY "SuperAdmins can view all blog posts"
ON blog_posts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

CREATE POLICY "SuperAdmins can view all engagements"
ON engagements FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

CREATE POLICY "SuperAdmins can view all messages"
ON engagement_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

CREATE POLICY "SuperAdmins can update all profiles"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()::text AND profiles.role = 'SUPERADMIN'
  )
);

COMMIT; 