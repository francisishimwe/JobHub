import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  try {
    // Fetch job data
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('title, description, company_id')
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

    const title = `${jobData.title} at ${companyData.name} | RwandaJobHub`
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
    openGraph: {
      title: 'Job Opportunity | RwandaJobHub',
      description: 'Find your next career opportunity in Rwanda',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Job Opportunity | RwandaJobHub',
      description: 'Find your next career opportunity in Rwanda',
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
