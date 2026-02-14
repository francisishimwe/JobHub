import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface ApplicationEmailData {
  employerEmail: string
  candidateName: string
  jobTitle: string
  fieldOfStudy: string
  coverLetterUrl?: string
  additionalDocsUrls?: string[]
}

export async function sendApplicationEmail(data: ApplicationEmailData) {
  try {
    const { employerEmail, candidateName, jobTitle, fieldOfStudy, coverLetterUrl, additionalDocsUrls } = data

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          New Application: ${candidateName} for ${jobTitle}
        </h2>
        
        <p style="font-size: 16px; color: #666; margin: 20px 0;">
          You have a new applicant from Rwanda Job Hub.
        </p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Candidate Information:</h3>
          <p><strong>Name:</strong> ${candidateName}</p>
          <p><strong>Field of Study:</strong> ${fieldOfStudy}</p>
        </div>
        
        ${coverLetterUrl ? `
        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Cover Letter:</h3>
          <a href="${coverLetterUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Click here to View PDF
          </a>
        </div>
        ` : ''}
        
        ${additionalDocsUrls && additionalDocsUrls.length > 0 ? `
        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Additional Documents:</h3>
          ${additionalDocsUrls.map((url, index) => `
            <div style="margin: 10px 0;">
              <a href="${url}" style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Document ${index + 1} - View PDF
              </a>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px;">
          <p>This application was submitted via Rwanda Job Hub.</p>
          <p>For questions about this application, please contact the candidate directly.</p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: 'Rwanda Job Hub <applications@rwandajobhub.rw>',
      to: [employerEmail],
      subject: `New Application: ${candidateName} for ${jobTitle}`,
      html: emailBody,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}
