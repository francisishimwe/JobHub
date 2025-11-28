'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JobDetailsContent } from '@/components/job-details-content'
import { DynamicFavicon } from '@/components/dynamic-favicon'
import { useJobs } from '@/lib/job-context'
import { useCompanies } from '@/lib/company-context'
import { Loader2 } from 'lucide-react'

export default function JobPage() {
    const params = useParams()
    const router = useRouter()
    const { jobs } = useJobs()
    const { getCompanyById } = useCompanies()

    const jobId = params.id as string
    const job = jobs.find(j => j.id === jobId)
    const company = job ? getCompanyById(job.companyId) : null

    useEffect(() => {
        // Track page view
        const trackView = async () => {
            try {
                await fetch('/api/track-view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content_type: 'job',
                        content_id: jobId,
                    }),
                })
            } catch (error) {
                console.error('Error tracking view:', error)
            }
        }

        if (jobId) {
            trackView()
        }
    }, [jobId])



    if (!job || !company) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Loading job details...</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <>
            {/* Dynamic favicon component */}
            <DynamicFavicon companyLogo={company.logo} />

            <div className="min-h-screen bg-background flex flex-col">
                <Header />

                <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                    <JobDetailsContent job={job} />

                    {/* 
                      Space for Google AdSense Ad Unit
                      To place a manual ad here:
                      1. Create a "Display ad unit" in Google AdSense
                      2. Get the <ins>...</ins> code
                      3. Paste it here inside a <div>
                    */}
                </main>

                <Footer />
            </div>
        </>
    )
}
