import type React from "react"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import "./globals.css"
import { JobProvider } from "@/lib/job-context"
import { CompanyProvider } from "@/lib/company-context"
import { AuthProvider } from "@/lib/auth-context"
import { ExamProvider } from "@/lib/exam-context"

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"]
})

export const metadata: Metadata = {
  title: "RwandaJobHub - The #1 job board for Rwandan jobs",
  description: "Created with by maximillien",
  generator: "v0.app",
  icons: {
    icon: '/favicon-.png',
    apple: '/favicon-.png',
  },
  openGraph: {
    title: "RwandaJobHub - The #1 job board for Rwandan jobs",
    description: "Find your next career opportunity in Rwanda",
    type: 'website',
    images: [{ url: '/favicon-.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "RwandaJobHub - The #1 job board for Rwandan jobs",
    description: "Find your next career opportunity in Rwanda",
    images: ['/favicon-.png'],
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
        <AuthProvider>
          <CompanyProvider>
            <JobProvider>
              <ExamProvider>
                {children}
              </ExamProvider>
            </JobProvider>
          </CompanyProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1412133449814305"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-36H1L40GBH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-36H1L40GBH');
          `}
        </Script>
      </body>
    </html>
  )
}
