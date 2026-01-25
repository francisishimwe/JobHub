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
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = `${protocol}://${host}`

  try {
    // Fetch job and company data in one query
    const result = await sql`
      SELECT j.title, j.description, j.location, j.opportunity_type, j.deadline, c.name, c.logo
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = ${id}
    `

    if (result.length === 0) {
      return getDefaultMetadata(baseUrl)
    }

    const jobData = result[0]
    const companyName = jobData.name || 'Company'
    const companyLogo = jobData.logo

    const formattedDeadline = jobData.deadline
      ? new Date(jobData.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Open'

    const title = `${companyName} is hiring ${jobData.title} location: ${jobData.location} opportunity type: ${jobData.opportunity_type} deadline is ${formattedDeadline}`

    // Strip HTML tags and decode entities from description
    const cleanDescription = jobData.description
      ? stripHtmlAndDecode(jobData.description).substring(0, 160)
      : 'Find your next career opportunity in Rwanda'

    // Ensure logo URL is absolute and publicly accessible
    let logoUrl: string

    if (!companyLogo) {
      logoUrl = `${baseUrl}/favicon.jpg`
    } else if (companyLogo.startsWith('http://') || companyLogo.startsWith('https://')) {
      logoUrl = companyLogo
    } else if (companyLogo.startsWith('/')) {
      logoUrl = `${baseUrl}${companyLogo}`
    } else {
      logoUrl = `${baseUrl}/${companyLogo}`
    }

    console.log('🖼️ OG Image:', { company: companyName, original: companyLogo, generated: logoUrl })

    return {
      title,
      description: cleanDescription,
      icons: {
        icon: companyLogo || '/favicon.jpg',
        apple: companyLogo || '/favicon.jpg',
      },
      openGraph: {
        title,
        description: cleanDescription,
        type: 'website',
        images: [{ url: logoUrl }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: cleanDescription,
        images: [logoUrl],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return getDefaultMetadata(baseUrl)
  }
}

function getDefaultMetadata(baseUrl: string): Metadata {
  const defaultLogoUrl = `${baseUrl}/favicon.jpg`

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
      images: [{ url: defaultLogoUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Job Opportunity | RwandaJobHub',
      description: 'Find your next career opportunity in Rwanda',
      images: [defaultLogoUrl],
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
