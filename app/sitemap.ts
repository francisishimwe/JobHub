import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rwandajobhub.rw'
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || baseUrl

    let jobs = []
    let companies = []
    let exams = []

    try {
        // Fetch all active jobs via API
        try {
            const jobsResponse = await fetch(`${apiBaseUrl}/api/jobs?limit=1000`, {
                cache: 'no-store'
            })
            if (jobsResponse.ok) {
                const jobsData = await jobsResponse.json()
                jobs = jobsData.jobs || []
            } else {
                console.error('Error fetching jobs for sitemap:', jobsResponse.status)
            }
        } catch (jobsError) {
            console.error('Error fetching jobs for sitemap:', jobsError)
        }

        // Fetch all active companies via API
        try {
            const companiesResponse = await fetch(`${apiBaseUrl}/api/companies`, {
                cache: 'no-store'
            })
            if (companiesResponse.ok) {
                const companiesData = await companiesResponse.json()
                companies = companiesData.companies || []
            } else {
                console.error('Error fetching companies for sitemap:', companiesResponse.status)
            }
        } catch (companiesError) {
            console.error('Error fetching companies for sitemap:', companiesError)
        }

        // Fetch all active exams via API
        try {
            const examsResponse = await fetch(`${apiBaseUrl}/api/exams`, {
                cache: 'no-store'
            })
            if (examsResponse.ok) {
                const examsData = await examsResponse.json()
                exams = examsData.exams || []
            } else {
                console.error('Error fetching exams for sitemap:', examsResponse.status)
            }
        } catch (examsError) {
            console.error('Error fetching exams for sitemap:', examsError)
        }

        // Log for debugging
        console.log(`Sitemap generated: ${jobs.length} jobs, ${companies.length} companies, ${exams.length} exams`)

        // Dynamic job routes
        const jobRoutes = jobs.map((job: any) => ({
            url: `${baseUrl}/jobs/${job.id}`,
            lastModified: new Date(job.created_at),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }))

        // Dynamic company routes
        const companyRoutes = companies.map((company: any) => ({
            url: `${baseUrl}/companies/${company.id}`,
            lastModified: new Date(company.created_at),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))

        // Dynamic exam routes
        const examRoutes = exams.map((exam: any) => ({
            url: `${baseUrl}/exams/${exam.id}`,
            lastModified: new Date(exam.created_at),
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
                url: `${baseUrl}/exams`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/employers`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/dashboard`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/post-advert`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/edit-cv`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
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
                url: `${baseUrl}/testimonials`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            },
            {
                url: `${baseUrl}/help`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            },
            {
                url: `${baseUrl}/disclaimer`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.5,
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

        return [...staticRoutes, ...jobRoutes, ...companyRoutes, ...examRoutes]
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
                url: `${baseUrl}/exams`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/employers`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/dashboard`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/post-advert`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/edit-cv`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
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
                url: `${baseUrl}/testimonials`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            },
            {
                url: `${baseUrl}/help`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            },
            {
                url: `${baseUrl}/disclaimer`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.5,
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
