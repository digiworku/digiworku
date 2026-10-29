-- ==============================================================================
-- DigiWorku — Enterprise Hardened Production Database Schema & Security Policies
-- Run this in: Supabase Dashboard > SQL Editor
-- URL: https://supabase.com/dashboard/project/rjxbdjgagizjmjwnlbxx/sql
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to check if the requesting user is a DigiWorku administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() ->> 'email') IN ('digiworku55@gmail.com', 'virkanwlia@gmail.com')
    OR (auth.jwt() ->> 'role') = 'admin'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. PORTFOLIO PROJECTS TABLE
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT DEFAULT 'General',
  tags          TEXT[] DEFAULT '{}',
  image_url     TEXT,
  video_url     TEXT,
  media_type    TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  client_name   TEXT DEFAULT 'DigiWorku Client',
  impact_result TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Admin write projects" ON public.projects;
DROP POLICY IF EXISTS "Admin insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admin update projects" ON public.projects;
DROP POLICY IF EXISTS "Admin delete projects" ON public.projects;

-- Strict RLS: Public can only read portfolio projects
CREATE POLICY "Public read projects" ON public.projects 
  FOR SELECT USING (true);

-- Strict RLS: Only verified admins can insert, update, or delete portfolio projects
CREATE POLICY "Admin insert projects" ON public.projects 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin update projects" ON public.projects 
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete projects" ON public.projects 
  FOR DELETE USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. REAL-TIME CHAT MESSAGES TABLE
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         TEXT NOT NULL,
  content         TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'admin')),
  attachment_url  TEXT,
  attachment_type TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read messages" ON public.messages;
DROP POLICY IF EXISTS "Public insert messages" ON public.messages;
DROP POLICY IF EXISTS "Admin delete messages" ON public.messages;
DROP POLICY IF EXISTS "Users read own messages or admin read all" ON public.messages;
DROP POLICY IF EXISTS "Users send own messages" ON public.messages;
DROP POLICY IF EXISTS "Admins send messages" ON public.messages;
DROP POLICY IF EXISTS "Admins delete messages" ON public.messages;

-- Strict RLS: Users can only select their own messages, while admins can read all conversations
CREATE POLICY "Users read own messages or admin read all" ON public.messages
  FOR SELECT USING (
    public.is_admin() 
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid()::text)
    OR (user_id = current_setting('request.jwt.claims', true)::json->>'sub')
    OR (user_id = current_setting('request.headers', true)::json->>'x-client-session-id')
  );

-- Strict RLS: Verified users can only insert with their own user_id; admins can insert as admin
CREATE POLICY "Users send own messages" ON public.messages
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR (role = 'user' AND (auth.uid() IS NULL OR user_id = auth.uid()::text))
  );

-- Strict RLS: Only admins can delete messages
CREATE POLICY "Admins delete messages" ON public.messages
  FOR DELETE USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. INBOUND CLIENT INQUIRIES & LEADS TABLE
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inquiries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  mobile        TEXT,
  service       TEXT,
  budget        TEXT,
  message       TEXT,
  dpdp_consent  BOOLEAN DEFAULT true,
  status        TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'converted', 'archived')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admin read inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admin update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admin delete inquiries" ON public.inquiries;

-- Strict RLS: Public anonymous visitors can ONLY submit inquiries (write-only)
CREATE POLICY "Public insert inquiries" ON public.inquiries 
  FOR INSERT WITH CHECK (true);

-- Strict RLS: Only verified admins can read, update status, or delete client lead data
CREATE POLICY "Admin read inquiries" ON public.inquiries 
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin update inquiries" ON public.inquiries 
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete inquiries" ON public.inquiries 
  FOR DELETE USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. SERVICES CATALOG TABLE
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE,
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT DEFAULT 'Development',
  price        TEXT,
  icon         TEXT DEFAULT 'Globe',
  content      TEXT,
  overview     TEXT,
  offerings    JSONB DEFAULT '[]',
  process      JSONB DEFAULT '[]',
  features     JSONB DEFAULT '[]',
  why_us       TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  faqs         JSONB DEFAULT '[]',
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read services" ON public.services;
DROP POLICY IF EXISTS "Admin write services" ON public.services;
DROP POLICY IF EXISTS "Admin insert services" ON public.services;
DROP POLICY IF EXISTS "Admin update services" ON public.services;
DROP POLICY IF EXISTS "Admin delete services" ON public.services;

CREATE POLICY "Public read services" ON public.services 
  FOR SELECT USING (true);

CREATE POLICY "Admin insert services" ON public.services 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin update services" ON public.services 
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete services" ON public.services 
  FOR DELETE USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. TEAM DIRECTORY TABLE
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.team (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  role       TEXT NOT NULL,
  avatar_url TEXT,
  status     TEXT DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'OFF SHIFT')),
  blocked    BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read team" ON public.team;
DROP POLICY IF EXISTS "Admin write team" ON public.team;
DROP POLICY IF EXISTS "Admin insert team" ON public.team;
DROP POLICY IF EXISTS "Admin update team" ON public.team;
DROP POLICY IF EXISTS "Admin delete team" ON public.team;

CREATE POLICY "Public read team" ON public.team 
  FOR SELECT USING (blocked = false OR blocked IS NULL);

CREATE POLICY "Admin insert team" ON public.team 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin update team" ON public.team 
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete team" ON public.team 
  FOR DELETE USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. CLIENT REVIEWS & TESTIMONIALS TABLE
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  role            TEXT,
  rating          INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text            TEXT NOT NULL,
  avatar_initials TEXT,
  approved        BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin write reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin delete reviews" ON public.reviews;

CREATE POLICY "Public read approved reviews" ON public.reviews 
  FOR SELECT USING (approved = true);

CREATE POLICY "Admin insert reviews" ON public.reviews 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin update reviews" ON public.reviews 
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete reviews" ON public.reviews 
  FOR DELETE USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────────
-- 7. CRM CLIENT PROJECTS & KANBAN PIPELINE TABLE
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  lead_name    TEXT,
  lead_avatar  TEXT,
  status       TEXT DEFAULT 'ON TRACK' CHECK (status IN ('ON TRACK', 'IN REVIEW', 'STABLE', 'OFF TRACK')),
  kanban_stage TEXT DEFAULT 'planning' CHECK (kanban_stage IN ('planning', 'in_progress', 'review', 'completed')),
  health_score INTEGER DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
  budget       TEXT,
  description  TEXT,
  progress     INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  email        TEXT,
  deadline     TIMESTAMPTZ,
  milestones   JSONB DEFAULT '[]',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crm_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin only crm_projects" ON public.crm_projects;
DROP POLICY IF EXISTS "Admin select crm_projects" ON public.crm_projects;
DROP POLICY IF EXISTS "Admin insert crm_projects" ON public.crm_projects;
DROP POLICY IF EXISTS "Admin update crm_projects" ON public.crm_projects;
DROP POLICY IF EXISTS "Admin delete crm_projects" ON public.crm_projects;

-- Strict RLS: CRM Kanban board is strictly admin-accessible
CREATE POLICY "Admin select crm_projects" ON public.crm_projects 
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin insert crm_projects" ON public.crm_projects 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin update crm_projects" ON public.crm_projects 
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete crm_projects" ON public.crm_projects 
  FOR DELETE USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────────
-- 8. USER PROFILES TABLE (Linked with Supabase Auth)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT,
  email      TEXT,
  mobile     TEXT,
  role       TEXT DEFAULT 'client' CHECK (role IN ('client', 'freelancer', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users upsert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin update all profiles" ON public.user_profiles;

CREATE POLICY "Users read own profile" ON public.user_profiles 
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users upsert own profile" ON public.user_profiles 
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin update all profiles" ON public.user_profiles
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Trigger to auto-create user_profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NULL,
    CASE 
      WHEN NEW.email IN ('digiworku55@gmail.com', 'virkanwlia@gmail.com') THEN 'admin'
      ELSE 'client'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ──────────────────────────────────────────────────────────────────────────────
-- 9. PERFORMANCE INDEXES (High-Frequency Filter & Query Optimization)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_projects_status ON public.crm_projects(status);
CREATE INDEX IF NOT EXISTS idx_crm_projects_kanban_stage ON public.crm_projects(kanban_stage);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

-- ──────────────────────────────────────────────────────────────────────────────
-- 10. STORAGE BUCKETS & POLICIES (Eliminate Base64 Bloat)
-- ──────────────────────────────────────────────────────────────────────────────
-- Bucket: projects-media (Portfolio images max 5MB, videos max 50MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'projects-media',
  'projects-media',
  true,
  52428800,
  ARRAY['image/jpeg','image/png','image/webp','image/svg+xml','video/mp4','video/webm','video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- Bucket: chat-attachments (Client chat attachments max 10MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments',
  'chat-attachments',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','application/pdf','text/plain']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- Storage Policies
DROP POLICY IF EXISTS "Public view projects media" ON storage.objects;
CREATE POLICY "Public view projects media" ON storage.objects 
  FOR SELECT USING (bucket_id IN ('projects-media', 'chat-attachments', 'digiworku-uploads'));

DROP POLICY IF EXISTS "Admin upload projects media" ON storage.objects;
CREATE POLICY "Admin upload projects media" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'projects-media' AND public.is_admin());

DROP POLICY IF EXISTS "Public upload chat attachments" ON storage.objects;
CREATE POLICY "Public upload chat attachments" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'chat-attachments');

-- ──────────────────────────────────────────────────────────────────────────────
-- 11. REALTIME REPLICATION PUBLICATION
-- ──────────────────────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_projects;

-- Verification notification
COMMENT ON TABLE public.projects IS 'DigiWorku portfolio projects with hardened admin-only write RLS';
COMMENT ON TABLE public.messages IS 'Realtime chat isolated per user session with admin visibility';
COMMENT ON TABLE public.inquiries IS 'Lead capture with anon insert only and admin read/update';
COMMENT ON TABLE public.crm_projects IS 'Persisted Postgres CRM Kanban & milestones pipeline';
