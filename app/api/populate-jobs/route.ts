import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const sampleJobs = [
  {
    title: "Full Stack Developer",
    location: "Kigali, Rwanda",
    location_type: "On-site",
    job_type: "Full-time",
    opportunity_type: "Job",
    experience_level: "Mid-level (3-5 years)",
    deadline: "2025-03-31",
    description: "We are looking for a talented Full Stack Developer to join our team. You will work on modern web applications using React, Node.js, and PostgreSQL.",
    status: "published",
    approved: true
  },
  {
    title: "Frontend Developer",
    location: "Kigali, Rwanda", 
    location_type: "Hybrid",
    job_type: "Full-time",
    opportunity_type: "Job",
    experience_level: "Entry-level (0-2 years)",
    deadline: "2025-04-15",
    description: "Join our frontend team to build beautiful, responsive web applications using React, TypeScript, and modern CSS frameworks.",
    status: "published",
    approved: true
  },
  {
    title: "Backend Developer",
    location: "Remote",
    location_type: "Remote",
    job_type: "Full-time", 
    opportunity_type: "Job",
    experience_level: "Senior-level (5+ years)",
    deadline: "2025-04-20",
    description: "Looking for an experienced Backend Developer to design and implement scalable APIs and microservices using Node.js and PostgreSQL.",
    status: "published",
    approved: true
  },
  {
    title: "UI/UX Designer",
    location: "Kigali, Rwanda",
    location_type: "On-site",
    job_type: "Full-time",
    opportunity_type: "Job", 
    experience_level: "Mid-level (3-5 years)",
    deadline: "2025-04-25",
    description: "We need a creative UI/UX Designer to design intuitive user interfaces and great user experiences for our web and mobile applications.",
    status: "published",
    approved: true
  },
  {
    title: "Mobile App Developer",
    location: "Kigali, Rwanda",
    location_type: "Hybrid",
    job_type: "Full-time",
    opportunity_type: "Job",
    experience_level: "Mid-level (3-5 years)", 
    deadline: "2025-04-18",
    description: "Join our mobile team to build amazing iOS and Android applications using React Native and Flutter.",
    status: "published",
    approved: true
  }
]

const sampleCompanies = [
  { name: "Tech Solutions Rwanda", location: "Kigali, Rwanda", industry: "Technology" },
  { name: "Digital Agency Ltd", location: "Kigali, Rwanda", industry: "Digital Marketing" },
  { name: "Rwanda Innovations", location: "Kigali, Rwanda", industry: "Software Development" },
  { name: "Creative Studio", location: "Kigali, Rwanda", industry: "Design" },
  { name: "Mobile First Inc", location: "Kigali, Rwanda", industry: "Mobile Development" }
]

export async function POST() {
  try {
    console.log('🚀 Populating database with sample jobs and companies...')

    // First create tables if they don't exist
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS companies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          logo TEXT,
          location VARCHAR(255),
          industry VARCHAR(255),
          website VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      
      await sql`
        CREATE TABLE IF NOT EXISTS jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
          company_logo TEXT,
          location VARCHAR(255),
          location_type VARCHAR(100),
          job_type VARCHAR(100),
          opportunity_type VARCHAR(100) NOT NULL,
          experience_level VARCHAR(100),
          deadline DATE,
          featured BOOLEAN DEFAULT false,
          description TEXT,
          attachment_url TEXT,
          application_link TEXT,
          status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'closed', 'pending')),
          approved BOOLEAN DEFAULT true,
          applicants INTEGER DEFAULT 0,
          views INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      
      console.log('✅ Tables created or already exist')
    } catch (error: any) {
      console.log('⚠️ Tables creation note:', error.message)
    }

    // Clear existing data to avoid duplicates
    await sql`DELETE FROM jobs`
    await sql`DELETE FROM companies`
    console.log('🧹 Cleared existing data')

    // Insert companies
    const insertedCompanies = []
    for (const company of sampleCompanies) {
      const result = await sql`
        INSERT INTO companies (name, location, industry)
        VALUES (${company.name}, ${company.location}, ${company.industry})
        RETURNING id, name
      `
      insertedCompanies.push(result[0])
    }
    console.log(`✅ Created ${insertedCompanies.length} companies`)

    // Insert jobs
    const insertedJobs = []
    for (let i = 0; i < sampleJobs.length; i++) {
      const job = sampleJobs[i]
      const company = insertedCompanies[i]
      
      const result = await sql`
        INSERT INTO jobs (
          title, company_id, location, location_type, job_type, 
          opportunity_type, experience_level, deadline, description, 
          status, approved
        ) VALUES (
          ${job.title}, ${company.id}, ${job.location}, ${job.location_type}, 
          ${job.job_type}, ${job.opportunity_type}, ${job.experience_level}, 
          ${job.deadline}, ${job.description}, ${job.status}, ${job.approved}
        )
        RETURNING id, title, company_id
      `
      insertedJobs.push(result[0])
    }
    console.log(`✅ Created ${insertedJobs.length} jobs`)

    // Verify the data
    const jobCount = await sql`SELECT COUNT(*) as count FROM jobs`
    const companyCount = await sql`SELECT COUNT(*) as count FROM companies`

    return NextResponse.json({
      success: true,
      message: 'Database populated successfully!',
      data: {
        companies: companyCount[0].count,
        jobs: jobCount[0].count,
        insertedCompanies: insertedCompanies.map(c => ({ id: c.id, name: c.name })),
        insertedJobs: insertedJobs.map(j => ({ id: j.id, title: j.title }))
      }
    })

  } catch (error: any) {
    console.error('❌ Error populating database:', error)
    return NextResponse.json(
      { 
        error: 'Failed to populate database', 
        details: error.message || 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
