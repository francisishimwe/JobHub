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
  description: "Rwanda Job Hub - Find jobs, internships, scholarships, tenders, and education opportunities. Browse positions from Rwanda's top employers.",
  icons: {
    icon: [
      { url: '/favicon.jpg', type: 'image/jpeg' },
    ],
    shortcut: [{ url: '/favicon.jpg', type: 'image/jpeg' }],
    apple: [{ url: '/favicon.jpg', type: 'image/jpeg', sizes: '180x180' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    /* FIXED: Added dir="ltr" to stop the mirror/reversed layout effect */
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
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