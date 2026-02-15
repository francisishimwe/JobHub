import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ReactQueryProvider } from "@/lib/react-query-provider"
import { JobProvider } from "@/lib/job-context"
import { CompanyProvider } from "@/lib/company-context"
import { AuthProvider } from "@/lib/auth-context"
import { ExamProvider } from "@/lib/exam-context"
import { InquiryProvider } from "@/lib/inquiry-context"
import { GoogleAnalytics } from "@/components/google-analytics"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "RwandaJobHub - The #1 job board for Rwandan jobs",
  description: "Rwanda Job Hub - Find jobs, internships, scholarships, tenders, and education opportunities. Browse positions from Rwanda's top employers.",
  icons: {
    icon: [{ url: '/favicon.jpg', type: 'image/jpeg' }],
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
    /* suppressHydrationWarning added here to handle browser extension mismatches */
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
      </head>
      {/* The suppressHydrationWarning on <body> ignores extra tags added by extensions like Grammarly.
      */}
      <body className="antialiased font-sans" suppressHydrationWarning>
        <ReactQueryProvider>
          <AuthProvider>
            <CompanyProvider>
              <ErrorBoundary>
                <JobProvider>
                  <ExamProvider>
                    <InquiryProvider>
                      {children}
                      <ScrollToTop />
                    </InquiryProvider>
                  </ExamProvider>
                </JobProvider>
              </ErrorBoundary>
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