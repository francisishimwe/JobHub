import { NextResponse } from 'next/server'

// Temporary mock jobs with updated deadlines
const mockJobs = [
  {
    id: "1",
    title: "Full Stack Developer",
    company_name: "Tech Solutions Rwanda",
    location: "Kigali, Rwanda",
    location_type: "On-site",
    job_type: "Full-time",
    opportunity_type: "Job",
    experience_level: "Mid-level (3-5 years)",
    deadline: "2025-03-31",
    description: "We are looking for a talented Full Stack Developer to join our team. You will work on modern web applications using React, Node.js, and PostgreSQL.",
    status: "published",
    approved: true,
    applicants: 12,
    views: 245,
    created_at: "2025-02-17T00:00:00Z"
  },
  {
    id: "2", 
    title: "Frontend Developer",
    company_name: "Digital Agency Ltd",
    location: "Kigali, Rwanda",
    location_type: "Hybrid",
    job_type: "Full-time",
    opportunity_type: "Job",
    experience_level: "Entry-level (0-2 years)",
    deadline: "2025-04-15",
    description: "Join our frontend team to build beautiful, responsive web applications using React, TypeScript, and modern CSS frameworks.",
    status: "published",
    approved: true,
    applicants: 8,
    views: 189,
    created_at: "2025-02-17T00:00:00Z"
  },
  {
    id: "3",
    title: "Backend Developer", 
    company_name: "Rwanda Innovations",
    location: "Remote",
    location_type: "Remote",
    job_type: "Full-time",
    opportunity_type: "Job",
    experience_level: "Senior-level (5+ years)",
    deadline: "2025-04-20",
    description: "Looking for an experienced Backend Developer to design and implement scalable APIs and microservices using Node.js and PostgreSQL.",
    status: "published",
    approved: true,
    applicants: 15,
    views: 312,
    created_at: "2025-02-17T00:00:00Z"
  },
  {
    id: "4",
    title: "UI/UX Designer",
    company_name: "Creative Studio",
    location: "Kigali, Rwanda",
    location_type: "On-site",
    job_type: "Full-time",
    opportunity_type: "Job",
    experience_level: "Mid-level (3-5 years)",
    deadline: "2025-04-25",
    description: "We need a creative UI/UX Designer to design intuitive user interfaces and great user experiences for our web and mobile applications.",
    status: "published",
    approved: true,
    applicants: 6,
    views: 156,
    created_at: "2025-02-17T00:00:00Z"
  },
  {
    id: "5",
    title: "Mobile App Developer",
    company_name: "Mobile First Inc",
    location: "Kigali, Rwanda",
    location_type: "Hybrid",
    job_type: "Full-time",
    opportunity_type: "Job",
    experience_level: "Mid-level (3-5 years)",
    deadline: "2025-04-18",
    description: "Join our mobile team to build amazing iOS and Android applications using React Native and Flutter.",
    status: "published",
    approved: true,
    applicants: 9,
    views: 201,
    created_at: "2025-02-17T00:00:00Z"
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockJobs,
      count: mockJobs.length
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to fetch jobs', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
