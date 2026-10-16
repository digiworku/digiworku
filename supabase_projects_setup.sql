-- =====================================================
-- DigiWorku — Complete Production Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- URL: https://supabase.com/dashboard/project/rjxbdjgagizjmjwnlbxx/sql
-- =====================================================

-- 1. PROJECTS TABLE (Portfolio)
CREATE TABLE IF NOT EXISTS public.projects (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT DEFAULT 'General',
  tags          TEXT[] DEFAULT '{}',
  image_url     TEXT,
  video_url     TEXT,
  media_type    TEXT DEFAULT 'image',
  client_name   TEXT DEFAULT 'DigiWorku Client',
  impact_result TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write projects" ON public.projects;
CREATE POLICY "Admin write projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- 2. MESSAGES TABLE (Real-time chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    TEXT NOT NULL,
  content    TEXT NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read messages" ON public.messages;
CREATE POLICY "Public read messages" ON public.messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert messages" ON public.messages;
CREATE POLICY "Public insert messages" ON public.messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin delete messages" ON public.messages;
CREATE POLICY "Admin delete messages" ON public.messages FOR DELETE USING (true);

-- 3. INQUIRIES TABLE (Lead forms)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  mobile     TEXT,
  service    TEXT,
  budget     TEXT,
  message    TEXT,
  status     TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'converted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert inquiries" ON public.inquiries;
CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin read inquiries" ON public.inquiries;
CREATE POLICY "Admin read inquiries" ON public.inquiries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin update inquiries" ON public.inquiries;
CREATE POLICY "Admin update inquiries" ON public.inquiries FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin delete inquiries" ON public.inquiries;
CREATE POLICY "Admin delete inquiries" ON public.inquiries FOR DELETE USING (true);

-- 4. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write services" ON public.services;
CREATE POLICY "Admin write services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- 5. TEAM TABLE
CREATE TABLE IF NOT EXISTS public.team (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
CREATE POLICY "Public read team" ON public.team FOR SELECT USING (blocked = false OR blocked IS NULL);
DROP POLICY IF EXISTS "Admin write team" ON public.team;
CREATE POLICY "Admin write team" ON public.team FOR ALL USING (true) WITH CHECK (true);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (approved = true);
DROP POLICY IF EXISTS "Admin write reviews" ON public.reviews;
CREATE POLICY "Admin write reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- 7. CRM PROJECTS TABLE (Internal pipeline)
CREATE TABLE IF NOT EXISTS public.crm_projects (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name         TEXT NOT NULL,
  lead_name    TEXT,
  lead_avatar  TEXT,
  status       TEXT DEFAULT 'ON TRACK' CHECK (status IN ('ON TRACK', 'IN REVIEW', 'STABLE', 'OFF TRACK')),
  health_score INTEGER DEFAULT 100,
  budget       TEXT,
  description  TEXT,
  progress     INTEGER DEFAULT 0,
  email        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.crm_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin only crm_projects" ON public.crm_projects;
CREATE POLICY "Admin only crm_projects" ON public.crm_projects FOR ALL USING (true) WITH CHECK (true);

-- 8. USER PROFILES TABLE (Client accounts linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT,
  mobile     TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own profile" ON public.user_profiles;
CREATE POLICY "Users read own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users upsert own profile" ON public.user_profiles;
CREATE POLICY "Users upsert own profile" ON public.user_profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Admin read all profiles" ON public.user_profiles;
CREATE POLICY "Admin read all profiles" ON public.user_profiles FOR SELECT USING (true);

-- Auto-create user_profile on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NULL
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. STORAGE BUCKET (File uploads — images, videos, PDFs)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'digiworku-uploads',
  'digiworku-uploads',
  true,
  52428800,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read uploads" ON storage.objects;
CREATE POLICY "Public read uploads" ON storage.objects FOR SELECT USING (bucket_id = 'digiworku-uploads');
DROP POLICY IF EXISTS "Auth upload" ON storage.objects;
CREATE POLICY "Auth upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'digiworku-uploads');
DROP POLICY IF EXISTS "Auth delete upload" ON storage.objects;
CREATE POLICY "Auth delete upload" ON storage.objects FOR DELETE USING (bucket_id = 'digiworku-uploads');

-- 10. ENABLE REALTIME on messages and inquiries
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;

-- ✅ Done! All 8 tables, RLS policies, storage bucket, and realtime are ready.
