import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rwandajobhub.rw'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/admin/',
                    '/*.json$',
                    '/search?',
                ],
            },
            // Specific rules for GoogleBot
            {
                userAgent: 'Googlebot',
                allow: '/',
                crawlDelay: 0,
            },
            // Specific rules for BingBot
            {
                userAgent: 'Bingbot',
                allow: '/',
                crawlDelay: 0.2,
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}
