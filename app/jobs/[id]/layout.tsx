import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
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
  const supabase = await createClient()

  // Get the base URL for absolute URLs
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = `${protocol}://${host}`

  try {
    // Fetch job data
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('title, description, company_id, location, opportunity_type, deadline')
      .eq('id', id)
      .single()

    if (jobError || !jobData) {
      console.error('Error fetching job for metadata:', jobError?.message || jobError)
      return getDefaultMetadata(baseUrl)
    }

    // Fetch company data to get logo
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('name, logo')
      .eq('id', jobData.company_id)
      .single()

    if (companyError || !companyData) {
      console.error('Error fetching company for metadata:', companyError?.message || companyError)
      return getDefaultMetadata(baseUrl)
    }

    const formattedDeadline = jobData.deadline
      ? new Date(jobData.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Open'

    const title = `${companyData.name} is hiring ${jobData.title} location: ${jobData.location} opportunity type: ${jobData.opportunity_type} deadline is ${formattedDeadline}`

    // Strip HTML tags and decode entities from description
    const cleanDescription = jobData.description
      ? stripHtmlAndDecode(jobData.description).substring(0, 160)
      : 'Find your next career opportunity in Rwanda'

    // Ensure logo URL is absolute and publicly accessible
    let logoUrl: string

    if (!companyData.logo) {
      logoUrl = `${baseUrl}/favicon.jpg`
    } else if (companyData.logo.startsWith('http://') || companyData.logo.startsWith('https://')) {
      logoUrl = companyData.logo
    } else if (companyData.logo.startsWith('/')) {
      logoUrl = `${baseUrl}${companyData.logo}`
    } else {
      logoUrl = `${baseUrl}/${companyData.logo}`
    }

    console.log('🖼️ OG Image:', { company: companyData.name, original: companyData.logo, generated: logoUrl })

    return {
      title,
      description: cleanDescription,
      icons: {
        icon: companyData.logo || '/favicon.jpg',
        apple: companyData.logo || '/favicon.jpg',
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
