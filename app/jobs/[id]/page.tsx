import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JobDetailsContent } from '@/components/job-details-content'
import { JobViewTracker } from '@/components/job-view-tracker'
import { notFound } from 'next/navigation'
import { Job, Company } from '@/lib/types'

type Props = {
    params: Promise<{ id: string }>
}

async function getJob(id: string) {
    const supabase = await createClient()
    const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching job:', error)
        return null
    }
    return job
}

async function getCompany(id: string) {
    if (!id) return null
    const supabase = await createClient()
    const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching company:', error)
        return null
    }
    return company
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const job = await getJob(id)
    if (!job) return {}

    const company = await getCompany(job.company_id)
    const companyName = company?.name || 'Company'
    const pageTitle = `${companyName} - ${job.title}`
    const ogTitle = `${companyName} is hiring ${job.title}`

    // Strip HTML tags from description
    const cleanDescription = job.description
        ?.replace(/<[^>]*>/g, '')
        ?.replace(/&nbsp;/g, ' ')
        ?.replace(/&amp;/g, '&')
        ?.replace(/&lt;/g, '<')
        ?.replace(/&gt;/g, '>')
        ?.replace(/&quot;/g, '"')
        ?.trim()
        ?.substring(0, 160) || "Find your next career opportunity in Rwanda. Browse jobs, tenders, internships, scholarships, and more at RwandaJobHub."

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rwandajobhub.com'
    const jobUrl = `${siteUrl}/jobs/${job.id}`
    
    // Use company logo as favicon and OG image
    const companyLogo = company?.logo
    const defaultFavicon = `${siteUrl}/favicon.png`
    const faviconUrl = companyLogo || defaultFavicon
    const ogImageUrl = companyLogo || defaultFavicon

    return {
        title: {
            absolute: pageTitle
        },
        description: cleanDescription,
        openGraph: {
            title: {
                absolute: ogTitle
            },
            description: cleanDescription,
            url: jobUrl,
            siteName: 'RwandaJobHub',
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: company?.name || 'RwandaJobHub',
                    type: 'image/png',
                }
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: cleanDescription,
            images: [ogImageUrl],
        },
        icons: {
            icon: faviconUrl,
            shortcut: faviconUrl,
            apple: faviconUrl,
        },
        alternates: {
            canonical: jobUrl,
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default async function JobPage({ params }: Props) {
    const { id } = await params
    const jobData = await getJob(id)

    if (!jobData) {
        notFound()
    }

    const companyData = await getCompany(jobData.company_id)

    // Map DB job to Component Job
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
    }

    // Map DB company to Component Company
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
                    <JobDetailsContent job={job} initialCompany={company} />
                </main>
                <Footer />
            </div>
        </>
    )
}