-- Analytics tracking tables for RwandaJobHub

-- Page views tracking
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique visitors tracking (using session/fingerprint)
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT UNIQUE NOT NULL,
  first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visit_count INTEGER DEFAULT 1,
  country TEXT,
  device_type TEXT,
  browser TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);
CREATE INDEX IF NOT EXISTS idx_page_views_device ON page_views(device_type);
CREATE INDEX IF NOT EXISTS idx_page_views_browser ON page_views(browser);
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Create policies (allow insert for anyone, read for authenticated users only)
CREATE POLICY "Allow public insert on page_views" ON page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on page_views" ON page_views
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow public insert on visitors" ON visitors
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update on visitors" ON visitors
  FOR UPDATE TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated read on visitors" ON visitors
  FOR SELECT TO authenticated
  USING (true);
