import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // This provides fallback metadata that will be replaced by client-side dynamic updates
  // The client component will update the favicon and OG tags with company-specific data
  // For better SEO with web crawlers, consider server-side data fetching from Supabase
  
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
