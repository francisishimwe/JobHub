import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing job ID' }, { status: 400 })
  }

  try {
    // Fetch job and company data
    const result = await sql`
      SELECT j.title, j.description, j.location, j.opportunity_type, j.deadline, c.name, c.logo
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = ${id}
    `

    console.log('🔍 TEST API: Job data for ID', id, ':', result)

    if (result.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const jobData = result[0]
    const companyName = jobData.name || 'Company'
    const companyLogo = jobData.logo

    return NextResponse.json({
      success: true,
      jobId: id,
      jobTitle: jobData.title,
      companyName: companyName,
      companyLogo: companyLogo,
      logoType: companyLogo?.startsWith('data:') ? 'base64' : 'url',
      logoLength: companyLogo?.length || 0,
      hasLogo: !!companyLogo && companyLogo !== '' && !companyLogo.startsWith('data:'),
      rawDatabaseResult: result[0]
    })
  } catch (error) {
    console.error('❌ TEST API: Error fetching job:', error)
    return NextResponse.json({ error: 'Database error', details: error }, { status: 500 })
  }
}
