/**
 * WhatsApp Job Posting Template
 * Creates clean, bold formatted job posts for WhatsApp sharing
 */

export interface JobTemplateData {
  title: string
  companyName: string
  location: string
  opportunityType: string
  deadline: string
  applyLink: string
  whatsappGroup?: string
  whatsappChannel?: string
}

export function generateWhatsAppJobPost(job: JobTemplateData): string {
  const post = `*${job.title} at ${job.companyName}*

*Location:* ${job.location}
*Opportunity Type:* ${job.opportunityType}
*Deadline:* ${job.deadline}

🚀 *Apply here:* ${job.applyLink}${job.whatsappGroup ? `
💬 *Join our WhatsApp group:* ${job.whatsappGroup}` : ''}${job.whatsappChannel ? `
📢 *Follow our WhatsApp channel:* ${job.whatsappChannel}` : ''}`

  return post
}

// Example usage data for Technical Assistant
export const technicalAssistantExample: JobTemplateData = {
  title: "Technical Assistant",
  companyName: "King Faisal Hospital Rwanda Foundation (KFHRF)",
  location: "Kigali",
  opportunityType: "Job",
  deadline: "Mar 19, 2026",
  applyLink: "https://www.rwandajobhub.rw/jobs/6bb3ecdf-a55e-437c-b8bb-e01b0f628f4b",
  whatsappGroup: "https://chat.whatsapp.com/your-group-link",
  whatsappChannel: "https://whatsapp.com/channel/your-channel-link"
}
