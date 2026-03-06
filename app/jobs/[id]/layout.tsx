import { Metadata } from 'next'
import { sql } from '@/lib/db'
import { headers } from 'next/headers'

// Helper function to strip HTML tags and decode HTML entities
function stripHtmlAndDecode(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '')

  // Decode common HTML entities
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  }

  Object.keys(entities).forEach(entity => {
    text = text.replace(new RegExp(entity, 'g'), entities[entity])
  })

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim()

  return text
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params

  // Get the base URL for absolute URLs
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://www.rwandajobhub.rw' : 'http://localhost:3000'

  try {
    // Fetch job and company data in one query
    const result = await sql`
      SELECT j.title, j.description, j.location, j.opportunity_type, j.deadline, c.name, c.logo
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = ${id}
    `

    console.log('🔍 DEBUG: Database query result:', result)

    if (result.length === 0) {
      console.log('❌ DEBUG: No job found with ID:', id)
      return getDefaultMetadata(baseUrl)
    }

    const jobData = result[0]
    const companyName = jobData.name || 'Company'
    const companyLogo = jobData.logo

    console.log('🔍 DEBUG: Raw job data:', {
      jobTitle: jobData.title,
      companyName: jobData.name,
      companyLogo: jobData.logo,
      companyId: jobData.company_id
    })

    const formattedDeadline = jobData.deadline
      ? new Date(jobData.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Open'

    const title = `${jobData.title} at ${companyName}`

    // Strip HTML tags and decode entities from description
    const cleanDescription = jobData.description
      ? stripHtmlAndDecode(jobData.description).substring(0, 160)
      : 'Find your next career opportunity in Rwanda'

    // Ensure company logo URL is absolute and publicly accessible
    let logoUrl: string

    if (!companyLogo) {
      // No logo - don't set image
      logoUrl = ''
      console.log('🖼️ No company logo found in database')
    } else if (companyLogo.startsWith('http://') || companyLogo.startsWith('https://')) {
      logoUrl = companyLogo
      console.log('🖼️ Company logo is absolute URL:', logoUrl)
    } else if (companyLogo.startsWith('/')) {
      logoUrl = `${baseUrl}${companyLogo}`
      console.log('🖼️ Company logo is relative path:', logoUrl)
    } else if (companyLogo.startsWith('data:image/')) {
      // Base64 images are not supported by WhatsApp
      logoUrl = ''
      console.log('🖼️ Company logo is base64, not supported by WhatsApp')
    } else {
      logoUrl = `${baseUrl}/${companyLogo}`
      console.log('🖼️ Company logo is relative filename:', logoUrl)
    }

    console.log('🖼️ Database Logo Info:', { 
      company: companyName, 
      logoFromDb: companyLogo,
      finalUrl: logoUrl,
      jobId: id
    })

    // Build Open Graph metadata - only include image if logo exists
    const openGraphMetadata: any = {
      title,
      description: cleanDescription,
      type: 'website',
      url: `${baseUrl}/jobs/${id}`,
      siteName: 'RwandaJobHub',
    }

    console.log('🔍 DEBUG: Before image processing:', {
      logoUrl,
      logoUrlType: typeof logoUrl,
      logoUrlLength: logoUrl?.length,
      logoUrlStartsWith: logoUrl?.substring(0, 20)
    })

    // Only add image if company logo exists and is not base64
    if (logoUrl && logoUrl !== '') {
      // Add cache buster to prevent WhatsApp caching
      const cacheBuster = Date.now()
      const imageUrlWithCache = `${logoUrl}?t=${cacheBuster}`
      
      openGraphMetadata.images = [
        {
          url: imageUrlWithCache,
          width: 1200,
          height: 630,
          alt: `${companyName} - ${jobData.title}`,
        }
      ]
      console.log('✅ DEBUG: Image added to OG metadata with cache buster:', openGraphMetadata.images[0])
    } else {
      console.log('⚠️ DEBUG: No image added to OG metadata - logoUrl:', logoUrl)
    }

    console.log('🔍 DEBUG: Final Open Graph metadata:', JSON.stringify(openGraphMetadata, null, 2))

    return {
      title,
      description: cleanDescription,
      icons: {
        icon: companyLogo || '/favicon.jpg',
        apple: companyLogo || '/favicon.jpg',
      },
      openGraph: openGraphMetadata,
      twitter: {
        card: 'summary_large_image',
        title,
        description: cleanDescription,
        site: '@rwandajobhub',
        ...(logoUrl && logoUrl !== '' && { images: [logoUrl] }),
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return getDefaultMetadata(baseUrl)
  }
}

function getDefaultMetadata(baseUrl: string): Metadata {
  return {
    title: 'Job Opportunity | RwandaJobHub',
    description: 'Find your next career opportunity in Rwanda',
    icons: {
      icon: '/favicon.jpg',
      apple: '/favicon.jpg',
    },
    openGraph: {
      title: 'Job Opportunity | RwandaJobHub',
      description: 'Find your next career opportunity in Rwanda',
      type: 'website',
      siteName: 'RwandaJobHub',
      url: baseUrl,
      // No fallback image - only show image if company logo exists
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Job Opportunity | RwandaJobHub',
      description: 'Find your next career opportunity in Rwanda',
      site: '@rwandajobhub',
      // No fallback image - only show image if company logo exists
    },
  }
}

export default function JobLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
