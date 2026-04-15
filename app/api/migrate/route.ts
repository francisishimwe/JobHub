import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST() {
  try {
    // Create resources table directly
    await sql`
      CREATE TABLE IF NOT EXISTS resources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        icon VARCHAR(100) NOT NULL,
        icon_color VARCHAR(20) NOT NULL,
        button_text VARCHAR(50) NOT NULL,
        button_color VARCHAR(20) NOT NULL,
        button_link VARCHAR(500) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category)`
    await sql`CREATE INDEX IF NOT EXISTS idx_resources_is_active ON resources(is_active)`
    await sql`CREATE INDEX IF NOT EXISTS idx_resources_sort_order ON resources(sort_order ASC, created_at DESC)`

    // Insert sample data
    await sql`
      INSERT INTO resources (title, description, category, icon, icon_color, button_text, button_color, button_link, sort_order) VALUES
      ('Job Prep Questions & Answers', 'Master technical exams for Rwanda''s top institutions with our curated database of past paper solutions and correct answers.', 'Q&A', 'FileText', 'blue', 'Browse Q&A', 'blue', '/resources/qa', 1),
      ('Interview Questions & Answers', 'From ''Tell me about yourself'' to salary negotiations, learn how to answer common interview questions used by Rwandan HR managers.', 'Interview', 'MessagesSquare', 'orange', 'Start Prep', 'orange', '/resources/interview', 2)
      ON CONFLICT DO NOTHING
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Resources table created successfully with sample data'
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Migration failed' 
    }, { status: 500 })
  }
}
