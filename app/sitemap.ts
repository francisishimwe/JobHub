import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rwandajobhub.rw'
    const supabase = await createClient()

    try {
        // Fetch all active jobs
        const { data: jobs, error: jobsError } = await supabase
            .from('jobs')
            .select('id, posted_date')
            .order('posted_date', { ascending: false })

        if (jobsError) {
            console.error('Error fetching jobs for sitemap:', jobsError)
        }

        // Fetch all active companies
        const { data: companies, error: companiesError } = await supabase
            .from('companies')
            .select('id, created_date')
            .order('created_date', { ascending: false })

        if (companiesError) {
            console.error('Error fetching companies for sitemap:', companiesError)
        }

        // Log for debugging
        console.log(`Sitemap generated: ${jobs?.length || 0} jobs, ${companies?.length || 0} companies`)

        // Dynamic job routes
        const jobRoutes = (jobs || []).map((job) => ({
            url: `${baseUrl}/jobs/${job.id}`,
            lastModified: new Date(job.posted_date),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }))

        // Dynamic company routes
        const companyRoutes = (companies || []).map((company) => ({
            url: `${baseUrl}/companies/${company.id}`,
            lastModified: new Date(company.created_date),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))

        // Static routes with differentiated priorities and change frequencies
        const staticRoutes: MetadataRoute.Sitemap = [
            {
                url: `${baseUrl}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/jobs`,
                lastModified: new Date(),
                changeFrequency: 'hourly',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/contact`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/privacy`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.5,
            },
            {
                url: `${baseUrl}/terms`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.5,
            },
        ]

        return [...staticRoutes, ...jobRoutes, ...companyRoutes]
    } catch (error) {
        console.error('Error generating sitemap:', error)

        // Return at least static routes if database fails
        return [
            {
                url: `${baseUrl}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/jobs`,
                lastModified: new Date(),
                changeFrequency: 'hourly',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/contact`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/privacy`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.5,
            },
            {
                url: `${baseUrl}/terms`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.5,
            },
        ]
    }
}
