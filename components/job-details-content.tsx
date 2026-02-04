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
        <div className="bg-white rounded-lg border shadow-sm w-full max-w-4xl mx-auto" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', hyphens: 'auto', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 md:p-8 rounded-t-lg" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-blue-100 hover:text-white transition-colors mb-6"
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Jobs
                </Link>

                <div className="flex flex-col md:flex-row items-start gap-6" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 backdrop-blur-md border border-white/20" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {company?.logo ? (
                            <Image
                                src={company.logo}
                                alt={`${company.name} logo`}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-white/20 backdrop-blur-md">
                                <Briefcase className="h-10 w-10 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'auto' }}>
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-blue-100" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                            <span className="text-lg font-medium text-white" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                {company?.name || 'Unknown Company'}
                            </span>
                            <span className="hidden md:inline">•</span>
                            <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>
                        {job.isVerified && (
                            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-sm font-medium text-white" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                <BadgeCheck className="h-4 w-4" />
                                <span>Verified Official Posting</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-4 md:px-8 py-6 md:py-8 space-y-8" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
                {/* Job Overview - Hidden for Tender and Blog */}
                {job.opportunityType !== "Scholarship" && job.opportunityType !== "Tender" && job.opportunityType !== "Blog" && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
                        <h3 className="text-lg font-bold italic uppercase tracking-wide text-gray-900 mt-8 mb-4 block border-b border-gray-100 pb-2" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>Job Overview</h3>
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                            {job.location && (
                                <div className="flex items-start gap-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        <p className="text-sm font-medium text-gray-900">Location</p>
                                        <p className="text-sm text-gray-600" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'auto' }}>
                                            {job.location}{job.locationType && ` (${job.locationType})`}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {job.jobType && (
                                <div className="flex items-start gap-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                        <Briefcase className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="min-w-0 flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        <p className="text-sm font-medium text-gray-900">Job Type</p>
                                        <p className="text-sm text-gray-600" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'auto' }}>
                                            {job.jobType}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {job.experienceLevel && (
                                <div className="flex items-start gap-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                                        <Clock className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="min-w-0 flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        <p className="text-sm font-medium text-gray-900">Experience Level</p>
                                        <p className="text-sm text-gray-600" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'auto' }}>
                                            {job.experienceLevel}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {job.deadline && (
                                <div className="flex items-start gap-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                    <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div className="min-w-0 flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        <p className="text-sm font-medium text-gray-900">Deadline</p>
                                        <p className="text-sm text-gray-600" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                            {new Date(job.deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {job.opportunityType && (
                                <div className="flex items-start gap-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                                        <BadgeCheck className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div className="min-w-0 flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        <p className="text-sm font-medium text-gray-900">Opportunity Type</p>
                                        <p className="text-sm text-gray-600" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'auto' }}>
                                            {job.opportunityType}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Description */}
                {job.description && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
                        <h3 className="text-xl font-bold italic uppercase tracking-wide text-gray-900 mt-8 mb-4 block border-b border-gray-100 pb-2" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>Job Description</h3>
                        <div
                            className="prose prose-lg max-w-none text-gray-700 leading-relaxed
                                [&_p]:mb-6 [&_p]:leading-relaxed [&_p]:break-words [&_p]:overflow-wrap-break-word [&_p]:whitespace-pre-wrap
                                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-4 [&_ul]:break-words
                                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_ol]:space-y-4 [&_ol]:break-words
                                [&_li]:mb-4 [&_li]:leading-relaxed [&_li]:break-words [&_li]:overflow-wrap-break-word [&_li]:whitespace-pre-wrap
                                [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:break-words
                                [&_b]:font-bold [&_b]:text-gray-900 [&_b]:break-words
                                [&_h1]:text-lg [&_h1]:font-bold [&_h1]:italic [&_h1]:uppercase [&_h1]:tracking-wide [&_h1]:text-gray-900 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:block [&_h1]:border-b [&_h1]:border-gray-100 [&_h1]:pb-2 [&_h1]:break-words
                                [&_h2]:text-lg [&_h2]:font-bold [&_h2]:italic [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:block [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:pb-2 [&_h2]:break-words
                                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:italic [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-4 [&_h3]:block [&_h3]:border-b [&_h3]:border-gray-100 [&_h3]:pb-2 [&_h3]:break-words
                                [&_h4]:text-lg [&_h4]:font-bold [&_h4]:italic [&_h4]:uppercase [&_h4]:tracking-wide [&_h4]:text-gray-900 [&_h4]:mt-8 [&_h4]:mb-4 [&_h4]:block [&_h4]:border-b [&_h4]:border-gray-100 [&_h4]:pb-2 [&_h4]:break-words
                                [&_h5]:text-lg [&_h5]:font-bold [&_h5]:italic [&_h5]:uppercase [&_h5]:tracking-wide [&_h5]:text-gray-900 [&_h5]:mt-8 [&_h5]:mb-4 [&_h5]:block [&_h5]:border-b [&_h5]:border-gray-100 [&_h5]:pb-2 [&_h5]:break-words
                                [&_h6]:text-lg [&_h6]:font-bold [&_h6]:italic [&_h6]:uppercase [&_h6]:tracking-wide [&_h6]:text-gray-900 [&_h6]:mt-8 [&_h6]:mb-4 [&_h6]:block [&_h6]:border-b [&_h6]:border-gray-100 [&_h6]:pb-2 [&_h6]:break-words
                                [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-800 [&_a]:break-all [&_a]:whitespace-pre-wrap
                                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:leading-relaxed [&_blockquote]:break-words
                                [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm break-all [&_code]:whitespace-pre-wrap
                                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-6
                                [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:overflow-hidden break-words
                                [&_td]:border [&_td]:border-gray-200 [&_td]:p-3 [&_td]:align-top break-words [&_td]:whitespace-pre-wrap
                                [&_th]:border [&_th]:border-gray-200 [&_th]:p-3 [&_th]:bg-gray-50 [&_th]:font-bold [&_th]:text-left [&_th]:break-words
                            "
                            style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                    </div>
                )}


                {/* Attachment Section */}
                {job.attachmentUrl && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
                        <h3 className="text-lg font-bold italic uppercase tracking-wide text-gray-900 mt-8 mb-4 block border-b border-gray-100 pb-2" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>Attached Document</h3>
                        <a
                            href={job.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
                            style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}
                        >
                            <div className="flex items-center gap-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="min-w-0 flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'auto' }}>
                                        {decodeURIComponent(job.attachmentUrl.split('/').pop()?.split('?')[0] || 'Document').split('-').slice(1).join('-') || 'Download Document'}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        {job.attachmentUrl.endsWith('.pdf') && 'PDF Document'}
                                        {job.attachmentUrl.match(/\.(doc|docx)$/i) && 'Word Document'}
                                        {job.attachmentUrl.match(/\.(xls|xlsx)$/i) && 'Excel Spreadsheet'}
                                        {!job.attachmentUrl.match(/\.(pdf|doc|docx|xls|xlsx)$/i) && 'Click to download'}
                                    </p>
                                </div>
                            </div>
                            <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
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

                {/* Action Buttons */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
                    <h3 className="text-lg font-bold italic uppercase tracking-wide text-gray-900 mt-8 mb-4 block border-b border-gray-100 pb-2" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>Take Action</h3>
                    
                    {/* Share on WhatsApp and Apply Now Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                        {job.applicationLink && !isExpired &&
                            job.opportunityType !== "Tender" &&
                            job.opportunityType !== "Blog" &&
                            job.opportunityType !== "Scholarship" &&
                            job.opportunityType !== "Education" &&
                            job.opportunityType !== "Announcement" && (
                                <Button
                                    onClick={handleApply}
                                    size="lg"
                                    className="w-full sm:w-auto flex-1 bg-green-600 hover:bg-green-700 text-white text-lg font-bold h-14 px-8 rounded-lg shadow-sm hover:shadow-md transition-all"
                                >
                                    Apply Now
                                    <ExternalLink className="ml-2 h-5 w-5" />
                                </Button>
                            )}
                        <Button
                            onClick={handleShareWhatsApp}
                            size="lg"
                            className="w-full sm:w-auto flex-1 bg-green-600 hover:bg-green-700 text-white text-base font-semibold h-14 px-8 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                            <Share2 className="mr-2 h-5 w-5" />
                            Share on WhatsApp
                        </Button>
                    </div>

                    {/* Build CV Button */}
                    <div className="flex flex-col sm:flex-row gap-4" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto flex-1 bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 text-base font-semibold h-14 px-8 rounded-lg transition-all"
                        >
                            <Link href="/edit-cv">
                                <FileText className="mr-2 h-5 w-5" />
                                Build your CV for this Job
                            </Link>
                        </Button>
                    </div>
                </div>


            </div>
        </div>
    )
}
