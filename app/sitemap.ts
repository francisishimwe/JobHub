import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rwandajobhub.com'
    const supabase = await createClient()

    // Fetch all jobs
    const { data: jobs } = await supabase
        .from('jobs')
        .select('id, created_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    const jobRoutes = (jobs || []).map((job) => ({
        url: `${baseUrl}/jobs/${job.id}`,
        lastModified: new Date(job.created_at),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    const routes = [
        '',
        '/jobs',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    return [...routes, ...jobRoutes]
}
