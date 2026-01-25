import { Metadata } from 'next'
import { sql } from '@/lib/db'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JobDetailsContent } from '@/components/job-details-content'
import { RecentJobsSidebar } from '@/components/recent-jobs-sidebar'
import { JobViewTracker } from '@/components/job-view-tracker'
import { notFound } from 'next/navigation'
import { Job, Company } from '@/lib/types'

type Props = {
    params: Promise<{ id: string }>
}

// Optimization: Fetch job and company in one request to speed up metadata
async function getFullJobData(id: string) {
    try {
        const result = await sql`
            SELECT j.*, c.id as company_id, c.name as company_name, c.logo as company_logo, c.created_at as company_created_at
            FROM jobs j
            LEFT JOIN companies c ON j.company_id = c.id
            WHERE j.id = ${id}
        `

        if (result.length === 0) {
            return null
        }

        const row = result[0]
        return {
            ...row,
            companies: {
                id: row.company_id,
                name: row.company_name,
                logo: row.company_logo,
                created_at: row.company_created_at,
            }
        }
    } catch (error) {
        console.error('Error fetching job details:', error)
        return null
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const data = await getFullJobData(id)
    
    if (!data) return { title: 'Job Not Found' }

    const job = data
    const company = data.companies
    const companyName = company?.name || 'Company'
    
    // Clean description for social media preview
    const cleanDescription = job.description
        ?.replace(/<[^>]*>/g, '')
        ?.replace(/&nbsp;/g, ' ')
        ?.trim()
        ?.substring(0, 160) || "Find your next career opportunity on RwandaJobHub."

    // WhatsApp needs an ABSOLUTE URL
    const siteUrl = 'https://rwandajobhub.rw'
    const jobUrl = `${siteUrl}/jobs/${id}`
    
    // Use company logo, if missing use site logo fallback
    const ogImageUrl = company?.logo || `${siteUrl}/full logo.jpg`

    return {
        title: `${companyName} - ${job.title}`,
        description: cleanDescription,
        openGraph: {
            title: `${companyName} is hiring: ${job.title}`,
            description: cleanDescription,
            url: jobUrl,
            siteName: 'RwandaJobHub',
            images: [
                {
                    url: ogImageUrl, // This is the company logo shown in WhatsApp
                    width: 1200,
                    height: 630,
                    alt: `${companyName} Logo`,
                }
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${companyName} - ${job.title}`,
            description: cleanDescription,
            images: [ogImageUrl],
        },
    }
}

export default async function JobPage({ params }: Props) {
    const { id } = await params
    const jobData = await getFullJobData(id)

    if (!jobData) {
        notFound()
    }

    const companyData = jobData.companies

    const job: Job = {
        id: jobData.id,
        title: jobData.title,
        companyId: jobData.company_id,
        description: jobData.description,
        location: jobData.location,
        locationType: jobData.location_type,
        jobType: jobData.job_type,
        opportunityType: jobData.opportunity_type,
        experienceLevel: jobData.experience_level,
        deadline: jobData.deadline,
        applicants: jobData.applicants || 0,
        postedDate: new Date(jobData.created_at),
        featured: jobData.featured,
        applicationLink: jobData.application_link,
        attachmentUrl: jobData.attachment_url,
    }

    const company: Company | null = companyData ? {
        id: companyData.id,
        name: companyData.name,
        logo: companyData.logo,
        createdDate: new Date(companyData.created_at),
    } : null

    return (
        <>
            <JobViewTracker jobId={job.id} />
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <JobDetailsContent job={job} initialCompany={company} />
                        </div>
                        <div className="hidden lg:block">
                            <RecentJobsSidebar currentJobId={job.id} />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}