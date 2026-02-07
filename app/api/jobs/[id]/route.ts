import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

type Props = {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.company_id || !body.opportunity_type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, company_id, opportunity_type' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE jobs
      SET
        title = ${body.title},
        company_id = ${body.company_id},
        location = ${body.location || null},
        location_type = ${body.location_type || null},
        job_type = ${body.job_type || null},
        opportunity_type = ${body.opportunity_type},
        experience_level = ${body.experience_level || null},
        deadline = ${body.deadline || null},
        featured = ${body.featured || false},
        description = ${body.description || null},
        attachment_url = ${body.attachment_url || null},
        application_link = ${body.application_link || null},
        application_method = ${body.application_method || null},
        primary_email = ${body.primary_email || null},
        cc_emails = ${body.cc_emails || null}
      WHERE id = ${id}
      RETURNING *
    `

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const updatedJob = result[0]

    return NextResponse.json({
      id: updatedJob.id,
      title: updatedJob.title,
      company_id: updatedJob.company_id,
      location: updatedJob.location,
      location_type: updatedJob.location_type,
      job_type: updatedJob.job_type,
      opportunity_type: updatedJob.opportunity_type,
      experience_level: updatedJob.experience_level,
      deadline: updatedJob.deadline,
      featured: updatedJob.featured,
      description: updatedJob.description,
      attachment_url: updatedJob.attachment_url,
      application_link: updatedJob.application_link,
      application_method: updatedJob.application_method,
      primary_email: updatedJob.primary_email,
      cc_emails: updatedJob.cc_emails,
      status: updatedJob.status,
      approved: updatedJob.approved,
      created_at: updatedJob.created_at
    })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update job' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params

    // Check if job exists
    const jobExists = await sql`
      SELECT id FROM jobs WHERE id = ${id}
    `

    if (jobExists.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Delete the job
    await sql`
      DELETE FROM jobs WHERE id = ${id}
    `

    return NextResponse.json({ success: true, message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete job' },
      { status: 500 }
    )
  }
}
