-- Inquiries table for contact form submissions

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);

-- Enable Row Level Security
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert inquiries (for contact form submissions)
CREATE POLICY "Allow public insert on inquiries" ON inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read inquiries (you'll handle access control in your app)
-- If you want more security, you should set up proper Supabase auth
CREATE POLICY "Allow read on inquiries" ON inquiries
  FOR SELECT TO anon, authenticated
  USING (true);

-- Allow anyone to update inquiries (you'll handle access control in your app)
CREATE POLICY "Allow update on inquiries" ON inquiries
  FOR UPDATE TO anon, authenticated
  USING (true);

-- Allow anyone to delete inquiries (you'll handle access control in your app)
CREATE POLICY "Allow delete on inquiries" ON inquiries
  FOR DELETE TO anon, authenticated
  USING (true);
