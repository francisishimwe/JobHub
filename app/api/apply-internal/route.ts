import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Parse FormData instead of JSON
    const formData = await request.formData()
    const jobId = formData.get('jobId') as string
    const jobTitle = formData.get('jobTitle') as string
    const applicantJson = formData.get('applicant') as string
    
    console.log("🔍 Apply Internal API - Received data:", {
      jobId,
      jobTitle,
      applicantJson: applicantJson ? "✅ Present" : "❌ Missing"
    })
    
    const applicant = applicantJson ? JSON.parse(applicantJson) : null
    
    console.log("🔍 Apply Internal API - Parsed applicant:", applicant)
    
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
    console.log("🔍 Validating required fields:", {
      jobId: !!jobId,
      jobTitle: !!jobTitle,
      applicant: !!applicant
    })
    
    if (!jobId || !jobTitle || !applicant) {
      console.log("❌ Missing required fields:", { jobId, jobTitle, applicant })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log("🔍 Validating applicant fields:", {
      full_name: !!applicant?.full_name,
      email: !!applicant?.email,
      phone: !!applicant?.phone,
      field_of_study: !!applicant?.field_of_study
    })

    if (!applicant.full_name || !applicant.email || !applicant.phone || !applicant.field_of_study) {
      console.log("❌ Missing applicant information:", applicant)
      return NextResponse.json(
        { error: 'Missing applicant information' },
        { status: 400 }
      )
    }

    // Fetch application emails securely from database
    let primaryEmail = ""
    let ccEmails: string[] = []
    
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('primary_email, cc_emails')
        .eq('id', jobId)
        .single()

      if (jobError) {
        console.error('Error fetching job emails:', jobError)
        return NextResponse.json(
          { error: 'Failed to fetch job application details' },
          { status: 500 }
        )
      }

      if (!jobData) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        )
      }

      // Use the database email fields
      primaryEmail = jobData.primary_email || ""
      
      // Parse CC emails
      const ccEmailsField = jobData.cc_emails || ""
      if (ccEmailsField) {
        ccEmails = ccEmailsField.split(',').map((email: string) => email.trim()).filter((email: string) => email)
      }

      if (!primaryEmail) {
        console.log("Missing Employer Email for Job ID:", jobId, "Application cannot be processed")
        return NextResponse.json(
          { error: 'This employer has not provided an email address. Applications cannot be submitted.' },
          { status: 400 }
        )
      }

    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to fetch job application details' },
        { status: 500 }
      )
    }

    // Save applicant data to cv_profiles table for job alerts
    let cvProfileId = null
    try {
      const { data: cvProfile, error: cvProfileError } = await supabase
        .from('cv_profiles')
        .upsert({
          user_id: applicant.email, // Use email as user_id for simplicity
          full_name: applicant.full_name,
          email: applicant.email,
          phone: applicant.phone,
          field_of_study: applicant.field_of_study,
          skills: [], // Default to empty array for email applications
          experience_json: {}, // Empty JSON for email applications
          education_json: {}, // Empty JSON for email applications
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
        .select('id')
        .single()

      if (cvProfileError) {
        console.error('Error saving to cv_profiles:', cvProfileError)
      } else {
        cvProfileId = cvProfile.id
      }
    } catch (cvError) {
      console.error('CV Profile save error:', cvError)
    }
    
    // Save uploaded files and create job application record
    const uploadedFiles = []
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'applications')
    
    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Save cover letter
    let coverLetterUrl = null
    if (coverLetter) {
      const timestamp = Date.now()
      const filename = `${applicant.email.replace(/[^a-zA-Z0-9]/g, '_')}_cover_letter_${timestamp}.${coverLetter.name.split('.').pop()}`
      const filepath = join(uploadsDir, filename)
      await writeFile(filepath, Buffer.from(await coverLetter.arrayBuffer()))
      coverLetterUrl = `/uploads/applications/${filename}`
      uploadedFiles.push({ name: coverLetter.name, url: coverLetterUrl, type: 'cover_letter' })
    }
    
    // Save other documents
    const otherDocumentUrls = []
    for (let i = 0; i < otherDocuments.length; i++) {
      const doc = otherDocuments[i]
      const timestamp = Date.now()
      const filename = `${applicant.email.replace(/[^a-zA-Z0-9]/g, '_')}_doc_${i + 1}_${timestamp}.${doc.name.split('.').pop()}`
      const filepath = join(uploadsDir, filename)
      await writeFile(filepath, Buffer.from(await doc.arrayBuffer()))
      const url = `/uploads/applications/${filename}`
      otherDocumentUrls.push(url)
      uploadedFiles.push({ name: doc.name, url, type: 'other_document' })
    }
    
    // Save job application with document references
    if (cvProfileId) {
      try {
        const { error: appError } = await supabase
          .from('job_applications')
          .insert({
            job_id: jobId,
            cv_profile_id: cvProfileId,
            applicant_name: applicant.full_name,
            status: 'pending',
            match_score: 0,
            applied_at: new Date().toISOString(),
            // Store document URLs as JSON
            documents_json: uploadedFiles.length > 0 ? uploadedFiles : null
          })
          
        if (appError) {
          console.error('Error saving job application:', appError)
        }
      } catch (appError) {
        console.error('Job application save error:', appError)
      }
    }

    // Send email to employer
    const emailSubject = `New Application for ${jobTitle}`
    
    // Build document links for email
    let documentLinks = ''
    if (uploadedFiles.length > 0) {
      documentLinks = `
        <div style="margin-bottom: 20px;">
          <strong>Uploaded Documents:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${uploadedFiles.map(file => 
              `<li><a href="https://rwandajobhub.rw${file.url}" style="color: #0066cc; text-decoration: none;">${file.name}</a> (${file.type === 'cover_letter' ? 'Cover Letter' : 'Additional Document'})</li>`
            ).join('')}
          </ul>
        </div>
      `
    }
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">New Job Application</h2>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #0066cc; margin-bottom: 15px;">Position: ${jobTitle}</h3>
            
            <div style="margin-bottom: 15px;">
              <strong>Applicant Information:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Name:</strong> ${applicant.full_name}</li>
                <li><strong>Email:</strong> ${applicant.email}</li>
                <li><strong>Phone:</strong> ${applicant.phone}</li>
                <li><strong>Field of Study:</strong> ${applicant.field_of_study}</li>
              </ul>
            </div>
            
            ${documentLinks}
            
            <div style="margin-bottom: 15px;">
              <strong>Application Date:</strong> ${new Date().toLocaleDateString()}
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin-top: 20px;">
              <p style="margin: 0; color: #1565c0;">
                <strong>Note:</strong> This application was submitted via RwandaJobHub. 
                The applicant's information has been saved for future job matching.
                ${uploadedFiles.length > 0 ? ' Documents are available for download in the admin dashboard.' : ''}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>This email was sent from RwandaJobHub - Rwanda's #1 Job Portal</p>
            <p>Visit us at: <a href="https://rwandajobhub.rw" style="color: #0066cc;">rwandajobhub.rw</a></p>
            <p>Need support? Contact us on WhatsApp: <a href="https://wa.me/250783074056" style="color: #0066cc;">0783074056</a></p>
          </div>
        </div>
      </div>
    `

    // Prepare email recipients
    const to = [primaryEmail]
    const cc = ccEmails && ccEmails.length > 0 ? ccEmails : []

    // Use Resend or your preferred email service
    // For now, we'll simulate the email sending
    try {
      // In a real implementation, you would use an email service like Resend, SendGrid, etc.
      // Example with Resend:
      /*
      const { data, error } = await resend.emails.send({
        from: 'noreply@rwandajobhub.rw',
        to: to,
        cc: cc,
        subject: emailSubject,
        html: emailHtml,
      })
      
      if (error) {
        console.error('Email sending error:', error)
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        )
      }
      */

      // For now, we'll just log the email details
      console.log('Email would be sent to:', to)
      console.log('CC:', cc)
      console.log('Subject:', emailSubject)
      console.log('HTML content length:', emailHtml.length)

      // Simulate successful email sending
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully'
    })

  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
