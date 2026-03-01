import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '0')
  const limit = parseInt(searchParams.get('limit') || '15')
  const offset = page * limit

  const emergencyJobs = [
    { 
      id: '1', 
      title: 'Full Stack Developer', 
      company_id: '1',
      company_name: 'Tech Solutions Rwanda',
      location: 'Kigali, Rwanda', 
      location_type: 'On-site',
      job_type: 'Full-time',
      opportunity_type: 'Job',
      experience_level: 'Mid-level (3-5 years)',
      deadline: '2025-03-31',
      description: 'We are looking for a talented Full Stack Developer to join our team. You will work on modern web applications using React, Node.js, and PostgreSQL.',
      status: 'published',
      approved: true,
      applicants: 12,
      views: 245,
      created_at: new Date().toISOString()
    },
    { 
      id: '2', 
      title: 'Frontend Developer', 
      company_id: '2',
      company_name: 'Digital Agency Ltd',
      location: 'Kigali, Rwanda', 
      location_type: 'Hybrid',
      job_type: 'Full-time',
      opportunity_type: 'Job',
      experience_level: 'Entry-level (0-2 years)',
      deadline: '2025-04-15',
      description: 'Join our frontend team to build beautiful, responsive web applications using React, TypeScript, and modern CSS frameworks.',
      status: 'published',
      approved: true,
      applicants: 8,
      views: 189,
      created_at: new Date().toISOString()
    },
    { 
      id: '3', 
      title: 'Backend Developer', 
      company_id: '3',
      company_name: 'Rwanda Innovations',
      location: 'Remote', 
      location_type: 'Remote',
      job_type: 'Full-time',
      opportunity_type: 'Job',
      experience_level: 'Senior-level (5+ years)',
      deadline: '2025-04-20',
      description: 'Looking for an experienced Backend Developer to design and implement scalable APIs and microservices using Node.js and PostgreSQL.',
      status: 'published',
      approved: true,
      applicants: 15,
      views: 312,
      created_at: new Date().toISOString()
    }
  ]

  // Paginate results
  const paginatedJobs = emergencyJobs.slice(offset, offset + limit)
  
  return NextResponse.json({
    jobs: paginatedJobs,
    total: emergencyJobs.length,
    featuredCount: emergencyJobs.length,
    featuredGroupCount: emergencyJobs.length,
    page,
    limit,
    hasMore: offset + limit < emergencyJobs.length,
    emergency: true // Flag to indicate this is emergency data
  })
}
