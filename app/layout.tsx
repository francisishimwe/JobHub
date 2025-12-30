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
import { InquiryProvider } from "@/lib/inquiry-context"
import { GoogleAnalytics } from "@/components/google-analytics"

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: 'auto',
})

export const metadata: Metadata = {
  title: "RwandaJobHub - The #1 job board for Rwandan jobs",
  description: "Rwanda Job Hub - Find jobs, internships, scholarships, tenders, and education opportunities. Browse Enterprise Applications Manager, Database Administrator, IT Security Engineer, System Administrator, Network Administrator positions and more from Rwanda's top employers.",
  icons: {
    icon: [
      { url: '/favicon.jpg', type: 'image/jpeg' },
      { url: '/favicon.jpg?v=2', type: 'image/jpeg' },
    ],
    shortcut: [{ url: '/favicon.jpg', type: 'image/jpeg' }],
    apple: [{ url: '/favicon.jpg', type: 'image/jpeg', sizes: '180x180' }],
  },
  openGraph: {
    title: "RwandaJobHub - The #1 job board for Rwandan jobs",
    description: "Find jobs, internships, scholarships, tenders, and education opportunities in Rwanda. Browse positions from top employers.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.rwandajobhub.rw",
    images: ['/favicon.jpg'],
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/favicon.jpg" />

      </head>
      <body className={`${lato.className} font-sans antialiased`}>
        <ReactQueryProvider>
          <AuthProvider>
            <CompanyProvider>
              <JobProvider>
                <ExamProvider>
                  <InquiryProvider>
                    {children}
                  </InquiryProvider>
                </ExamProvider>
              </JobProvider>
            </CompanyProvider>
          </AuthProvider>
        </ReactQueryProvider>
        <Analytics />
        <SpeedInsights />


        <GoogleAnalytics />

      </body>
    </html>
  )
}
