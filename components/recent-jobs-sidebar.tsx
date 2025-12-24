"use client"

import { useJobs } from "@/lib/job-context"
import { useCompanies } from "@/lib/company-context"
import Link from "next/link"
import Image from "next/image"
import { Clock, MapPin, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FaWhatsapp, FaFacebook, FaXTwitter, FaTelegram } from "react-icons/fa6"

interface RecentJobsSidebarProps {
  currentJobId?: string
}

export function RecentJobsSidebar({ currentJobId }: RecentJobsSidebarProps) {
  const { jobs } = useJobs()
  const { getCompanyById } = useCompanies()

  // Get 5 most recent jobs excluding current job
  const recentJobs = jobs
    .filter(job => job.id !== currentJobId)
    .sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime())
    .slice(0, 5)

  if (recentJobs.length === 0) return null

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Recent Jobs
      </h3>
      <div className="space-y-3">
        {recentJobs.map((job) => {
          const company = getCompanyById(job.companyId)
          
          return (
            <Link 
              key={job.id} 
              href={`/jobs/${job.id}`}
              className="block group"
            >
              <div className="p-3 rounded-lg border hover:border-black/20 hover:bg-muted/50 transition-all">
                <div className="flex gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                    {company?.logo ? (
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={60}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {job.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {company?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {job.opportunityType}
                      </Badge>
                      {job.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{job.location.split(',')[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Social Media Links */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-medium mb-3">Follow Us</h4>
        <div className="flex items-center justify-around gap-2">
          <a
            href="https://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:opacity-80 transition-opacity"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="h-5 w-5 text-white" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61584589785023"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] hover:opacity-80 transition-opacity"
            aria-label="Facebook"
          >
            <FaFacebook className="h-5 w-5 text-white" />
          </a>
          <a
            href="https://x.com/Rwanda_Job_Hub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:opacity-80 transition-opacity"
            aria-label="X (Twitter)"
          >
            <FaXTwitter className="h-5 w-5 text-white" />
          </a>
          <a
            href="https://t.me/RwandaJobHub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0088cc] hover:opacity-80 transition-opacity"
            aria-label="Telegram"
          >
            <FaTelegram className="h-5 w-5 text-white" />
          </a>
        </div>
      </div>
    </div>
  )
}
