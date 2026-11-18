-- ==============================================================================
-- HTML Showcase App - Supabase Database Schema
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  token VARCHAR(25) NOT NULL UNIQUE,
  device_frame TEXT DEFAULT 'mobile', -- 'mobile', 'tablet', 'desktop', 'frameless'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  html_code TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for high performance lookup
CREATE INDEX IF NOT EXISTS idx_templates_slug_token ON templates(slug, token);
CREATE INDEX IF NOT EXISTS idx_pages_template_id ON pages(template_id);
CREATE INDEX IF NOT EXISTS idx_pages_sort_order ON pages(template_id, sort_order ASC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 5. Open access policies (as requested: admin URL is unauthenticated, public showcase is viewable)
DROP POLICY IF EXISTS "Public can view templates" ON templates;
CREATE POLICY "Public can view templates" ON templates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert templates" ON templates;
CREATE POLICY "Public can insert templates" ON templates FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update templates" ON templates;
CREATE POLICY "Public can update templates" ON templates FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete templates" ON templates;
CREATE POLICY "Public can delete templates" ON templates FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public can view pages" ON pages;
CREATE POLICY "Public can view pages" ON pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert pages" ON pages;
CREATE POLICY "Public can insert pages" ON pages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update pages" ON pages;
CREATE POLICY "Public can update pages" ON pages FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete pages" ON pages;
CREATE POLICY "Public can delete pages" ON pages FOR DELETE USING (true);
