import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { sendApplicationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Parse FormData
    const formData = await request.formData()
    const jobId = formData.get('jobId') as string
    const jobTitle = formData.get('jobTitle') as string
    const applicantJson = formData.get('applicant') as string
    
    const applicant = applicantJson ? JSON.parse(applicantJson) : null
    
    // Get uploaded files
    const coverLetter = formData.get('coverLetter') as File | null
    const otherDocuments: File[] = []
    
    // Collect other documents
    let index = 0
    while (true) {
      const doc = formData.get(`otherDocument_${index}`) as File | null
      if (!doc) break
      otherDocuments.push(doc)
      index++
    }

    // Validate required fields
    if (!jobId || !jobTitle || !applicant) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!applicant.full_name || !applicant.email || !applicant.phone || !applicant.field_of_study) {
      return NextResponse.json(
        { error: 'Missing applicant information' },
        { status: 400 }
      )
    }

    // Fetch job email from database
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('primary_email')
      .eq('id', jobId)
      .single()

    if (jobError || !jobData || !jobData.primary_email) {
      return NextResponse.json(
        { error: 'Employer email not found. Application cannot be submitted.' },
        { status: 400 }
      )
    }

    // Upload files and get URLs
    let coverLetterUrl = ""
    let additionalDocsUrls: string[] = []

    // Upload cover letter if exists
    if (coverLetter) {
      const bytes = await coverLetter.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `cover-letter-${Date.now()}-${coverLetter.name}`
      
      // Save to uploads directory
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      
      const filePath = join(uploadsDir, fileName)
      await writeFile(filePath, buffer)
      coverLetterUrl = `/uploads/${fileName}`
    }

    // Upload additional documents
    for (const doc of otherDocuments) {
      const bytes = await doc.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `document-${Date.now()}-${doc.name}`
      
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      
      const filePath = join(uploadsDir, fileName)
      await writeFile(filePath, buffer)
      additionalDocsUrls.push(`/uploads/${fileName}`)
    }

    // Send email with links
    const emailResult = await sendApplicationEmail({
      employerEmail: jobData.primary_email,
      candidateName: applicant.full_name,
      jobTitle: jobTitle,
      fieldOfStudy: applicant.field_of_study,
      coverLetterUrl: coverLetterUrl || undefined,
      additionalDocsUrls: additionalDocsUrls.length > 0 ? additionalDocsUrls : undefined
    })

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Server busy. Please try again or contact support.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Application sent successfully!' 
    })

  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      { error: 'Server busy. Please try again or contact support.' },
      { status: 500 }
    )
  }
}
