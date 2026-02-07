// Notification service for JobHub
// This handles sending notifications to candidates and employers

export interface NotificationData {
  recipientName: string
  recipientPhone?: string
  recipientEmail?: string
  jobTitle: string
  companyName?: string
  message: string
}

export class NotificationService {
  // Send WhatsApp notification (placeholder for actual WhatsApp API integration)
  static async sendWhatsAppNotification(data: NotificationData): Promise<boolean> {
    try {
      // In a real implementation, this would integrate with WhatsApp Business API
      // For now, we'll log the notification and return success
      
      const whatsappMessage = `Congratulations! You've been short-listed for ${data.jobTitle}. WhatsApp 0783074056 to confirm.`
      
      console.log('WhatsApp Notification:', {
        to: data.recipientPhone || 'No phone provided',
        message: whatsappMessage,
        timestamp: new Date().toISOString()
      })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error)
      return false
    }
  }

  // Send SMS notification (placeholder for actual SMS API integration)
  static async sendSMSNotification(data: NotificationData): Promise<boolean> {
    try {
      // In a real implementation, this would integrate with SMS API like Twilio
      const smsMessage = `Congratulations! You've been short-listed for ${data.jobTitle}. WhatsApp 0783074056 to confirm.`
      
      console.log('SMS Notification:', {
        to: data.recipientPhone || 'No phone provided',
        message: smsMessage,
        timestamp: new Date().toISOString()
      })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.error('Error sending SMS notification:', error)
      return false
    }
  }

  // Send Email notification
  static async sendEmailNotification(data: NotificationData): Promise<boolean> {
    try {
      // In a real implementation, this would integrate with email service like SendGrid
      console.log('Email Notification:', {
        to: data.recipientEmail || 'No email provided',
        subject: `Short-listed for ${data.jobTitle}`,
        message: data.message,
        timestamp: new Date().toISOString()
      })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.error('Error sending email notification:', error)
      return false
    }
  }

  // Send notification to short-listed candidate
  static async notifyShortlistedCandidate(
    candidateName: string,
    jobTitle: string,
    companyName: string,
    candidatePhone?: string,
    candidateEmail?: string
  ): Promise<boolean> {
    const notificationData: NotificationData = {
      recipientName: candidateName,
      recipientPhone: candidatePhone,
      recipientEmail: candidateEmail,
      jobTitle,
      companyName: companyName || 'Company',
      message: `Congratulations! You've been short-listed for ${jobTitle} at ${companyName || 'Company'}. Please contact us at 0783074056 to confirm your interest and proceed with the next steps.`
    }

    // Try WhatsApp first, then SMS, then email
    const whatsappSuccess = await this.sendWhatsAppNotification(notificationData)
    
    if (!whatsappSuccess && candidatePhone) {
      const smsSuccess = await this.sendSMSNotification(notificationData)
      if (!smsSuccess && candidateEmail) {
        return await this.sendEmailNotification(notificationData)
      }
      return smsSuccess
    }

    if (!whatsappSuccess && candidateEmail) {
      return await this.sendEmailNotification(notificationData)
    }

    return whatsappSuccess
  }

  // Send notification to employer about new applicants
  static async notifyEmployerAboutApplicants(
    employerEmail: string,
    employerPhone: string,
    jobTitle: string,
    applicantCount: number
  ): Promise<boolean> {
    const notificationData: NotificationData = {
      recipientName: 'Employer',
      recipientPhone: employerPhone,
      recipientEmail: employerEmail,
      jobTitle,
      message: `Great news! Your job posting "${jobTitle}" has received ${applicantCount} new applicant(s). Please check your dashboard to review and short-list candidates.`
    }

    // Send email notification to employer
    return await this.sendEmailNotification(notificationData)
  }

  // Send daily digest to admin
  static async sendAdminDigest(
    totalJobs: number,
    pendingApprovals: number,
    totalApplicants: number
  ): Promise<boolean> {
    const notificationData: NotificationData = {
      recipientName: 'Admin',
      jobTitle: 'Daily Digest',
      message: `Daily JobHub Digest: ${totalJobs} active jobs, ${pendingApprovals} pending approvals, ${totalApplicants} total applicants.`
    }

    // Log admin digest
    console.log('Admin Daily Digest:', {
      ...notificationData,
      timestamp: new Date().toISOString(),
      stats: { totalJobs, pendingApprovals, totalApplicants }
    })

    return true
  }
}
