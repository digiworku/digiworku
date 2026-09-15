-- =============================================
-- DigiWorku Portfolio Projects Table Setup
-- Run this SQL in: Supabase Dashboard > SQL Editor
-- URL: https://supabase.com/dashboard/project/rjxbdjgagizjmjwnlbxx/sql
-- =============================================

-- 1. Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id            TEXT PRIMARY KEY,
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

-- 2. Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Public read policy (everyone can see portfolio)
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects"
  ON public.projects FOR SELECT
  USING (true);

-- 4. Allow all writes (admin can add/edit/delete)
DROP POLICY IF EXISTS "Allow all writes on projects" ON public.projects;
CREATE POLICY "Allow all writes on projects"
  ON public.projects FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Sample projects (optional - will be skipped if already exist)
INSERT INTO public.projects (id, title, description, category, tags, image_url, media_type, client_name, impact_result)
VALUES
  (
    'proj-001',
    'Viral D2C UGC Reel Campaign',
    'End-to-end UGC video production for a D2C fashion brand targeting Gen-Z on Instagram Reels.',
    'UGC Videos',
    ARRAY['UGC', 'REELS', 'D2C', 'INSTAGRAM'],
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    'image',
    'FashionForward Brand',
    '3.2M views | 18% engagement rate'
  ),
  (
    'proj-002',
    'Brand Identity & Logo Suite',
    'Complete brand identity design: logo, color palette, typography system and social media kit.',
    'Graphics Design',
    ARRAY['BRANDING', 'LOGO', 'DESIGN'],
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    'image',
    'Bloom Studio',
    '200% brand recognition increase'
  ),
  (
    'proj-003',
    'E-Commerce Web Platform',
    'Full-stack React + Supabase e-commerce platform with payment gateway integration.',
    'Web Development',
    ARRAY['REACT', 'SUPABASE', 'ECOMMERCE'],
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80',
    'image',
    'ShopNow India',
    'Rs.45L revenue in first quarter'
  )
ON CONFLICT (id) DO NOTHING;

-- Done! Table is ready.
