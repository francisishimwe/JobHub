import type React from "react"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
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
    icon: [
      { url: '/rwandajobhub.png' },
      { url: '/icon.png' },
    ],
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
      </body>
    </html>
  )
}
