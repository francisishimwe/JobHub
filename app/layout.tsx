import type React from "react"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import "./globals.css"
import { ReactQueryProvider } from "@/lib/react-query-provider"
import { JobProvider } from "@/lib/job-context"
import { CompanyProvider } from "@/lib/company-context"
import { AuthProvider } from "@/lib/auth-context"
import { ExamProvider } from "@/lib/exam-context"
import { GoogleAnalytics } from "@/components/google-analytics"

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"]
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.rwandajobhub.rw"),
  title: "RwandaJobHub - The #1 job board for Rwandan jobs",
  description: "Find your next career opportunity in Rwanda. Browse jobs, tenders, internships, scholarships, and more.",
  generator: "Maximillien",
  icons: {
    icon: '/favicon-.png',
    apple: '/favicon-.png',
  },
  openGraph: {
    title: "RwandaJobHub - The #1 job board for Rwandan jobs",
    description: "Find your next career opportunity in Rwanda. Browse jobs, tenders, internships, scholarships, and more.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.rwandajobhub.rw",
    siteName: "RwandaJobHub",
    images: [
      {
        url: '/rwandajobhub-.png',
        width: 1200,
        height: 630,
        alt: 'RwandaJobHub',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "RwandaJobHub - The #1 job board for Rwandan jobs",
    description: "Find your next career opportunity in Rwanda. Browse jobs, tenders, internships, scholarships, and more.",
    images: ['/favicon-.png'],
  },
  other: {
    "google-adsense-account": "ca-pub-1412133449814385",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${lato.className} font-sans antialiased`}>
        <ReactQueryProvider>
          <AuthProvider>
            <CompanyProvider>
              <JobProvider>
                <ExamProvider>
                  {children}
                </ExamProvider>
              </JobProvider>
            </CompanyProvider>
          </AuthProvider>
        </ReactQueryProvider>
        <Analytics />
        <SpeedInsights />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1412133449814385"
          crossOrigin="anonymous"
        />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
