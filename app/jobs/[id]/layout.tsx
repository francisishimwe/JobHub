import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  try {
    // Fetch job data
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('title, description, company_id, location, opportunity_type, deadline')
      .eq('id', id)
      .single()

    if (jobError || !jobData) {
      console.error('Error fetching job for metadata:', jobError?.message || jobError)
      return getDefaultMetadata()
    }

    // Fetch company data to get logo
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('name, logo')
      .eq('id', jobData.company_id)
      .single()

    if (companyError || !companyData) {
      console.error('Error fetching company for metadata:', companyError?.message || companyError)
      return getDefaultMetadata()
    }

    const formattedDeadline = jobData.deadline
      ? new Date(jobData.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Open'

    const title = `${companyData.name} is hiring ${jobData.title} location: ${jobData.location} opportunity type: ${jobData.opportunity_type} deadline is ${formattedDeadline}`
    const description = jobData.description?.substring(0, 160) || 'Find your next career opportunity in Rwanda'

    return {
      title,
      description,
      icons: {
        icon: companyData.logo || '/favicon-.png',
        apple: companyData.logo || '/favicon-.png',
      },
      openGraph: {
        title,
        description,
        type: 'website',
        images: companyData.logo ? [{ url: companyData.logo }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: companyData.logo ? [companyData.logo] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return getDefaultMetadata()
  }
}

function getDefaultMetadata(): Metadata {
  return {
    title: 'Job Opportunity | RwandaJobHub',
    description: 'Find your next career opportunity in Rwanda',
    icons: {
      icon: '/favicon-.png',
      apple: '/favicon-.png',
    },
    openGraph: {
      title: 'Job Opportunity | RwandaJobHub',
      description: 'Find your next career opportunity in Rwanda',
      type: 'website',
      images: [{ url: '/favicon-.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Job Opportunity | RwandaJobHub',
      description: 'Find your next career opportunity in Rwanda',
      images: ['/favicon-.png'],
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
