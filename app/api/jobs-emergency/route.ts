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
      location: 'Kigali, Rwanda', 
      location_type: 'On-site',
      job_type: 'Full-time',
      opportunity_type: 'Job',
      experience_level: 'Mid-level (3-5 years)',
      deadline: '2024-12-31',
      description: 'We are looking for a talented Full Stack Developer to join our team. You will work on modern web applications using React, Node.js, and PostgreSQL.',
      status: 'published',
      approved: true,
      created_at: new Date().toISOString()
    },
    { 
      id: '2', 
      title: 'Frontend Developer', 
      company_id: '2',
      location: 'Kigali, Rwanda', 
      location_type: 'Hybrid',
      job_type: 'Full-time',
      opportunity_type: 'Job',
      experience_level: 'Entry-level (0-2 years)',
      deadline: '2024-12-15',
      description: 'Join our frontend team to build beautiful, responsive web applications using React, TypeScript, and modern CSS frameworks.',
      status: 'published',
      approved: true,
      created_at: new Date().toISOString()
    },
    { 
      id: '3', 
      title: 'Backend Developer', 
      company_id: '3',
      location: 'Remote', 
      location_type: 'Remote',
      job_type: 'Full-time',
      opportunity_type: 'Job',
      experience_level: 'Senior-level (5+ years)',
      deadline: '2024-12-20',
      description: 'Looking for an experienced Backend Developer to design and implement scalable APIs and microservices using Node.js and PostgreSQL.',
      status: 'published',
      approved: true,
      created_at: new Date().toISOString()
    },
    { 
      id: '4', 
      title: 'UI/UX Designer', 
      company_id: '4',
      location: 'Kigali, Rwanda', 
      location_type: 'On-site',
      job_type: 'Full-time',
      opportunity_type: 'Job',
      experience_level: 'Mid-level (3-5 years)',
      deadline: '2024-12-25',
      description: 'We need a creative UI/UX Designer to design intuitive user interfaces and great user experiences for our web and mobile applications.',
      status: 'published',
      approved: true,
      created_at: new Date().toISOString()
    },
    { 
      id: '5', 
      title: 'Mobile App Developer', 
      company_id: '5',
      location: 'Kigali, Rwanda', 
      location_type: 'Hybrid',
      job_type: 'Full-time',
      opportunity_type: 'Job',
      experience_level: 'Mid-level (3-5 years)',
      deadline: '2024-12-18',
      description: 'Join our mobile team to build amazing iOS and Android applications using React Native and Flutter.',
      status: 'published',
      approved: true,
      created_at: new Date().toISOString()
    }
  ]

  const paginatedJobs = emergencyJobs.slice(offset, offset + limit)

  return NextResponse.json({
    jobs: paginatedJobs,
    pagination: {
      page,
      limit,
      total: emergencyJobs.length,
      hasMore: offset + limit < emergencyJobs.length
    }
  })
}
