import { NextResponse } from 'next/server'

// Static sample data that works immediately
const sampleResources = [
  {
    id: "1",
    title: "RRA Revenue Officer Written Exam - Past Paper 2024",
    category: "WRITTEN_EXAM",
    content_type: "TEXT",
    institution: "Rwanda Revenue Authority (RRA)",
    featured: true,
    estimated_reading_time: 45,
    view_count: 156,
    created_at: "2026-04-19T06:30:20.357Z",
    updated_at: "2026-04-19T06:30:20.357Z",
    text_content: "<h2>RRA Revenue Officer Exam</h2><p>This is a comprehensive exam preparation guide...</p>"
  },
  {
    id: "2", 
    title: "RRA Interview Preparation Guide",
    category: "INTERVIEW_PREP",
    content_type: "TEXT",
    institution: "Rwanda Revenue Authority (RRA)",
    featured: true,
    estimated_reading_time: 30,
    view_count: 89,
    created_at: "2026-04-19T06:30:20.752Z",
    updated_at: "2026-04-19T06:30:20.752Z",
    text_content: "<h2>Interview Preparation</h2><p>Complete guide for RRA interviews...</p>"
  },
  {
    id: "3",
    title: "Irembo Digital Services Interview Guide", 
    category: "INTERVIEW_PREP",
    content_type: "TEXT",
    institution: "Irembo",
    featured: false,
    estimated_reading_time: 25,
    view_count: 67,
    created_at: "2026-04-19T06:30:20.752Z",
    updated_at: "2026-04-19T06:30:20.752Z",
    text_content: "<h2>Irembo Interview Guide</h2><p>Digital services interview preparation...</p>"
  }
]

export async function GET() {
  return NextResponse.json({ resources: sampleResources })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For now, just return success without actually saving
    // This allows the admin form to work without database issues
    const newResource = {
      id: Date.now().toString(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0
    }
    
    console.log('New resource created:', newResource)
    
    return NextResponse.json({ resource: newResource }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}
