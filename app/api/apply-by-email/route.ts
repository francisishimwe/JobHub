import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const body = await request.json()
    const { jobId, jobTitle, primaryEmail, ccEmails, applicant } = body

    // Validate required fields
    if (!jobId || !jobTitle || !primaryEmail || !applicant) {
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

    // Save applicant data to cv_profiles table for job alerts
    try {
      const { error: cvProfileError } = await supabase
        .from('cv_profiles')
        .upsert({
          job_id: jobId,
          full_name: applicant.full_name,
          email: applicant.email,
          phone: applicant.phone,
          field_of_study: applicant.field_of_study,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'job_id,email'
        })

      if (cvProfileError) {
        console.error('Error saving to cv_profiles:', cvProfileError)
        // Continue with email sending even if cv_profiles fails
      }
    } catch (cvError) {
      console.error('CV Profile save error:', cvError)
      // Continue with email sending even if cv_profiles fails
    }

    // Send email to employer
    const emailSubject = `New Application for ${jobTitle}`
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
            
            <div style="margin-bottom: 15px;">
              <strong>Application Date:</strong> ${new Date().toLocaleDateString()}
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin-top: 20px;">
              <p style="margin: 0; color: #1565c0;">
                <strong>Note:</strong> This application was submitted via RwandaJobHub. 
                The applicant's information has been saved for future job matching.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>This email was sent from RwandaJobHub - Rwanda's #1 Job Portal</p>
            <p>Visit us at: <a href="https://rwandajobhub.rw" style="color: #0066cc;">rwandajobhub.rw</a></p>
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
