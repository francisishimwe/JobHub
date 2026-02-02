"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Clock, ExternalLink, ArrowLeft, Share2, AlertTriangle, BadgeCheck, FileText } from "lucide-react"
import Image from "next/image"
import type { Job, Company } from "@/lib/types"
import { useCompanies } from "@/lib/company-context"
import Link from "next/link"

interface JobDetailsContentProps {
    job: Job
    initialCompany?: Company | null
}

export function JobDetailsContent({ job, initialCompany }: JobDetailsContentProps) {
    const { getCompanyById } = useCompanies()
    const contextCompany = getCompanyById(job.companyId)
    const company = initialCompany || contextCompany

    // Expired = deadline exists and is before today (date-only comparison)
    const isExpired = (() => {
        if (!job.deadline) return false
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const deadlineDate = new Date(job.deadline)
        deadlineDate.setHours(0, 0, 0, 0)
        return deadlineDate < today
    })()

    const handleApply = async () => {
        if (job.applicationLink) {
            // Track in Google Analytics only
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'apply', {
                    event_category: 'engagement',
                    event_label: job.title,
                    job_id: job.id,
                    company_name: company?.name
                })
            }

            // Open application link
            window.open(job.applicationLink, "_blank", "noopener,noreferrer")
        }
    }

    const handleShareWhatsApp = () => {
        const formattedDeadline = job.deadline
            ? new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Open'

        let shareText = `${company?.name || 'Company'} is hiring ${job.title}\nLocation: ${job.location}\nOpportunity Type: ${job.opportunityType}\nDeadline: ${formattedDeadline}\n\nApply here: ${window.location.href}\n\n📢 Join our WhatsApp group:\nhttps://chat.whatsapp.com/Ky7m3B0M5Gd3saO58Rb1tI\n\n📲 Follow our WhatsApp channel:\nhttps://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r`

        if (job.opportunityType === 'Scholarship') {
            shareText = `🎓 Scholarship Opportunity!\n\n${company?.name || 'Company'} is offering: ${job.title}\nDeadline: ${formattedDeadline}\n\nApply here: ${window.location.href}\n\n📢 Join our WhatsApp group:\nhttps://chat.whatsapp.com/Ky7m3B0M5Gd3saO58Rb1tI\n\n📲 Follow our WhatsApp channel:\nhttps://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r`
        }

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
        window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    }

    return (
        <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Jobs
                </Link>

                <div className="flex items-start gap-4 md:gap-6">
                    <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted border">
                        {company?.logo ? (
                            <Image
                                src={company.logo}
                                alt={`${company.name} logo`}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                                <Briefcase className="h-8 w-8" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{job.title}</h1>
                        {job.isVerified && (
                            <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                <BadgeCheck className="h-3 w-3" />
                                <span>Verified Official Posting</span>
                            </div>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="font-semibold text-gray-600 text-base">{company?.name || 'Unknown Company'}</span>
                            <span className="hidden md:inline">•</span>
                            <span className="text-muted-foreground">Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Job Overview - Hidden for Tender and Blog */}
                {job.opportunityType !== "Scholarship" && job.opportunityType !== "Tender" && job.opportunityType !== "Blog" && (
                    <div className="grid gap-4 sm:grid-cols-3 p-4 bg-muted/30 rounded-lg border">
                        {job.location && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-background rounded-full border">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold">Location</p>
                                    <p className="font-semibold">{job.location}{job.locationType && ` (${job.locationType})`}</p>
                                </div>
                            </div>
                        )}
                        {job.jobType && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-background rounded-full border">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold">Job Type</p>
                                    <p className="font-semibold">{job.jobType}</p>
                                </div>
                            </div>
                        )}
                        {job.experienceLevel && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-background rounded-full border">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold">Experience</p>
                                    <p className="font-semibold">{job.experienceLevel}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Description */}
                {job.description && (
                    <div>
                        <h3 className="text-lg font-bold mb-4">Job Description</h3>
                        <div
                            className="prose prose-sm max-w-none text-foreground leading-relaxed
                                [&_p]:mb-4 [&_p]:leading-7
                                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                                [&_li]:mb-2 [&_li]:pl-1
                                [&_strong]:font-bold [&_strong]:text-foreground
                                [&_b]:font-bold [&_b]:text-foreground
                                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-foreground
                                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-foreground
                                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:text-foreground
                                [&_h4]:font-bold [&_h4]:mb-2 [&_h4]:text-foreground
                                [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80
                                [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic
                                [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
                                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-4
                                [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:overflow-hidden
                                [&_td]:border [&_td]:border-border [&_td]:p-2 [&_td]:align-top
                                [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted/50 [&_th]:font-bold [&_th]:text-left
                            "
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                    </div>
                )}


                {/* Attachment Section */}
                {job.attachmentUrl && (
                    <div className="p-6 bg-muted/30 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Attached Document
                        </h3>
                        <a
                            href={job.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-background rounded-lg border hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground group-hover:text-blue-600 transition-colors">
                                        {decodeURIComponent(job.attachmentUrl.split('/').pop()?.split('?')[0] || 'Document').split('-').slice(1).join('-') || 'Download Document'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {job.attachmentUrl.endsWith('.pdf') && 'PDF Document'}
                                        {job.attachmentUrl.match(/\.(doc|docx)$/i) && 'Word Document'}
                                        {job.attachmentUrl.match(/\.(xls|xlsx)$/i) && 'Excel Spreadsheet'}
                                        {!job.attachmentUrl.match(/\.(pdf|doc|docx|xls|xlsx)$/i) && 'Click to download'}
                                    </p>
                                </div>
                            </div>
                            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                        </a>
                    </div>
                )}

                {/* Expired banner */}
                {isExpired && (
                    <div className="mt-4 p-4 rounded-md border border-red-200 bg-red-50 text-red-800 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">This position has closed.</p>
                            <p className="text-sm mt-1">
                                The application deadline has passed. You can still explore other opportunities on RwandaJobHub.
                            </p>
                        </div>
                    </div>
                )}

                {/* Share on WhatsApp and Apply Now Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t mt-4">
                    {job.applicationLink && !isExpired &&
                        job.opportunityType !== "Tender" &&
                        job.opportunityType !== "Blog" &&
                        job.opportunityType !== "Scholarship" &&
                        job.opportunityType !== "Education" &&
                        job.opportunityType !== "Announcement" && (
                            <Button
                                onClick={handleApply}
                                size="lg"
                                className="flex-1 bg-[#28a745] hover:bg-[#218838] text-white text-lg font-bold h-14 sm:h-12 px-8 rounded-lg shadow-sm hover:shadow-md transition-all"
                            >
                                Apply Now
                                <ExternalLink className="ml-2 h-6 w-6" />
                            </Button>
                        )}
                    <Button
                        onClick={handleShareWhatsApp}
                        size="lg"
                        className="flex-1 bg-[#28a745] hover:bg-[#218838] text-white text-base font-semibold h-14 sm:h-12 px-8 rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                        <Share2 className="mr-2 h-5 w-5" />
                        Share on WhatsApp
                    </Button>
                </div>

                {/* Build CV Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 text-base font-semibold h-14 sm:h-12 px-8 rounded-lg transition-all"
                    >
                        <Link href="/edit-cv">
                            <FileText className="mr-2 h-5 w-5" />
                            Build your CV for this Job
                        </Link>
                    </Button>
                </div>


            </div>
        </div>
    )
}
