"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Clock, ExternalLink, ArrowLeft, Share2, AlertTriangle, BadgeCheck, FileText } from "lucide-react"
import Image from "next/image"
import type { Job, Company } from "@/lib/types"
import { useCompanies } from "@/lib/company-context"
import Link from "next/link"
import { EmailApplicationForm } from "@/components/email-application-form"
import { InternalApplicationModal } from "@/components/internal-application-modal"

interface JobDetailsContentProps {
  job: Job
  initialCompany?: Company | null
}

export function JobDetailsContent({ job, initialCompany }: JobDetailsContentProps) {
    const { getCompanyById } = useCompanies()
    const contextCompany = job.companyId ? getCompanyById(job.companyId) : null
    const company = initialCompany || contextCompany
    const [showApplicationForm, setShowApplicationForm] = useState(false)
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

    // Global event listener fallback for modal opening
    React.useEffect(() => {
        const handleGlobalModalOpen = (event: CustomEvent) => {
            if (event.detail?.jobId === job.id && event.detail?.action === 'openModal') {
                console.log("Global modal open event received for job:", job.id)
                setIsApplyModalOpen(true)
            }
        }

        window.addEventListener('openApplicationModal', handleGlobalModalOpen as EventListener)
        
        return () => {
            window.removeEventListener('openApplicationModal', handleGlobalModalOpen as EventListener)
        }
    }, [job.id])

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
        console.log("CRITICAL DEBUG - Method is:", job.application_method, "Full Job Object:", job)
        
        // NUCLEAR FIX: NEVER redirect to WhatsApp from Apply Now button
        // Always open the InternalApplicationModal regardless of method or email configuration
        setIsApplyModalOpen(true)
    }

    const handleShareWhatsApp = () => {
        const formattedDeadline = job.deadline
            ? new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Open'

        let shareText = `${company?.name || 'Company'} is hiring ${job.title}\nLocation: ${job.location}\nOpportunity Type: ${job.opportunityType}\nDeadline: ${formattedDeadline}\n\nApply here: ${window.location.href}\n\n📢 Join our WhatsApp group:\nhttps://chat.whatsapp.com/Ky7m3B0M5Gd3saO58Rb1tI\n\n📲 Follow our WhatsApp channel:\nhttps://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r`

        if (job.opportunityType === 'Scholarship') {
            shareText = `🎓 Scholarship Opportunity!\n\n${company?.name || 'Company'} is offering: ${job.title}\nDeadline: ${formattedDeadline}\n\nApply here: ${window.location.href}\n\n📢 Join our WhatsApp group:\nhttps://chat.whatsapp.com/Ky7m3B0M5Gd3saO58Rb1tI\n\n📲 Follow our WhatsApp channel:\nhttps://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r`
        }

        // Share to WhatsApp number 0783074056
        const whatsappUrl = `https://wa.me/250783074056?text=${encodeURIComponent(shareText)}`
        window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    }

    return (
        <div className="bg-white rounded-lg border shadow-sm w-full max-w-4xl mx-auto" style={{ wordBreak: 'normal', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', hyphens: 'none', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:p-6 rounded-t-lg overflow-hidden" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', hyphens: 'none' }}>
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg px-4 py-2 mb-2 transition-all"
                    style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Jobs
                </Link>

                <div className="flex flex-row items-center gap-4" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 backdrop-blur-md border border-white/20" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                        {company?.logo ? (
                            <Image
                                src={company.logo}
                                alt={`${company.name} logo`}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-white/20 backdrop-blur-md">
                                <Briefcase className="h-8 w-8 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                        <h1 className="text-xl md:text-3xl font-bold text-white mb-2" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'none' }}>
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                            <span className="text-base font-medium text-amber-400" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                {company?.name || 'Unknown Company'}
                            </span>
                            <span className="hidden md:inline text-amber-400">•</span>
                            <span className="text-sm text-amber-400">Posted {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently'}</span>
                        </div>
                        {job.isVerified && (
                            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-sm font-medium text-white" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                                <BadgeCheck className="h-4 w-4" />
                                <span>Verified Official Posting</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-4 md:px-6 py-3 md:py-4 space-y-6" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
                {/* Job Overview - Hidden for Tender and Blog */}
                {job.opportunityType !== "Scholarship" && job.opportunityType !== "Tender" && job.opportunityType !== "Blog" && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
                        <h3 className="text-lg font-bold italic uppercase tracking-wide text-gray-900 mt-4 mb-3 block border-b border-gray-100 pb-2" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>Job Overview</h3>
                        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                            {job.location && (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        <p className="text-sm font-semibold text-gray-900">Location</p>
                                        <p className="text-sm text-gray-600" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'none' }}>
                                            {job.location}{job.locationType && ` (${job.locationType})`}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {job.jobType && (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                        <Briefcase className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="min-w-0 flex-1" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        <p className="text-sm font-semibold text-gray-900">Job Type</p>
                                        <p className="text-sm text-gray-600" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'none' }}>
                                            {job.jobType}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {job.experienceLevel && (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                                        <Clock className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="min-w-0 flex-1" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        <p className="text-sm font-semibold text-gray-900">Experience</p>
                                        <p className="text-sm text-gray-600" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'none' }}>
                                            {job.experienceLevel}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {job.deadline && (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                    <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div className="min-w-0 flex-1" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        <p className="text-sm font-semibold text-gray-900">Deadline</p>
                                        <p className="text-sm text-gray-600" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                            {new Date(job.deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {job.opportunityType && (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                                        <BadgeCheck className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div className="min-w-0 flex-1" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                        <p className="text-sm font-semibold text-gray-900">Type</p>
                                        <p className="text-sm text-gray-600" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'none' }}>
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
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
                        <h3 className="text-xl font-bold italic uppercase tracking-wide text-gray-900 mt-4 mb-3 block border-b border-gray-100 pb-2" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>Job Description</h3>
                        <div
                            className="prose prose-lg max-w-none text-slate-800 font-normal leading-relaxed
                                [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:break-words [&_p]:overflow-wrap-break-word [&_p]:whitespace-pre-wrap [&_p]:text-justify [&_p]:text-align-justify
                                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-4 [&_ul]:break-words
                                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:space-y-4 [&_ol]:break-words
                                [&_li]:mb-4 [&_li]:leading-relaxed [&_li]:break-words [&_li]:overflow-wrap-break-word [&_li]:whitespace-pre-wrap
                                [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:break-words
                                [&_b]:font-bold [&_b]:text-gray-900 [&_b]:break-words
                                [&_h1]:text-lg [&_h1]:font-bold [&_h1]:italic [&_h1]:uppercase [&_h1]:tracking-wide [&_h1]:text-gray-900 [&_h1]:mt-4 [&_h1]:mb-3 [&_h1]:block [&_h1]:border-b [&_h1]:border-gray-100 [&_h1]:pb-2 [&_h1]:break-words
                                [&_h2]:text-lg [&_h2]:font-bold [&_h2]:italic [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-gray-900 [&_h2]:mt-4 [&_h2]:mb-3 [&_h2]:block [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:pb-2 [&_h2]:break-words
                                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:italic [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-3 [&_h3]:block [&_h3]:border-b [&_h3]:border-gray-100 [&_h3]:pb-2 [&_h3]:break-words
                                [&_h4]:text-lg [&_h4]:font-bold [&_h4]:italic [&_h4]:uppercase [&_h4]:tracking-wide [&_h4]:text-gray-900 [&_h4]:mt-4 [&_h4]:mb-3 [&_h4]:block [&_h4]:border-b [&_h4]:border-gray-100 [&_h4]:pb-2 [&_h4]:break-words
                                [&_h5]:text-lg [&_h5]:font-bold [&_h5]:italic [&_h5]:uppercase [&_h5]:tracking-wide [&_h5]:text-gray-900 [&_h5]:mt-4 [&_h5]:mb-3 [&_h5]:block [&_h5]:border-b [&_h5]:border-gray-100 [&_h5]:pb-2 [&_h5]:break-words
                                [&_h6]:text-lg [&_h6]:font-bold [&_h6]:italic [&_h6]:uppercase [&_h6]:tracking-wide [&_h6]:text-gray-900 [&_h6]:mt-4 [&_h6]:mb-3 [&_h6]:block [&_h6]:border-b [&_h6]:border-gray-100 [&_h6]:pb-2 [&_h6]:break-words
                                [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-800 [&_a]:break-all [&_a]:whitespace-pre-wrap
                                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:leading-relaxed [&_blockquote]:break-words [&_blockquote]:text-justify [&_blockquote]:text-align-justify
                                [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm break-all [&_code]:whitespace-pre-wrap
                                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-4
                                [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:overflow-hidden break-words
                                [&_td]:border [&_td]:border-gray-200 [&_td]:p-3 [&_td]:align-top break-words [&_td]:whitespace-pre-wrap [&_td]:text-justify [&_td]:text-align-justify
                                [&_th]:border [&_th]:border-gray-200 [&_th]:p-3 [&_th]:bg-gray-50 [&_th]:font-bold [&_th]:text-left [&_th]:break-words
                            "
                            style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%', hyphens: 'none', textAlign: 'justify' }}
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                    </div>
                )}

                {/* Document Attachment Section - Simple if statement */}
                {job.attachment_url && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
                        <h3 className="text-lg font-bold italic uppercase tracking-wide text-gray-900 mt-4 mb-3 block border-b border-gray-100 pb-2" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>Attachment</h3>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0' }}>
                            <svg className="h-5 w-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 01-2 2v-8a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2v-8a2 2 0 00-2-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16h5l-3 3m0 0l5-5m-5 5v-8" />
                            </svg>
                            <div className="min-w-0 flex-1" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                <a 
                                    href={job.attachment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 underline font-medium transition-colors"
                                    style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', hyphens: 'none' }}
                                >
                                    Download Job Document (PDF)
                                </a>
                            </div>
                        </div>
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
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden', minWidth: '0', maxWidth: '100%' }}>
                    {/* Row 1: Apply Now and Share on WhatsApp Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                        {/* Apply Now Button - Only show if external_link exists */}
                        {!isExpired &&
                            job.opportunityType !== "Tender" &&
                            job.opportunityType !== "Blog" &&
                            job.opportunityType !== "Scholarship" &&
                            job.opportunityType !== "Education" &&
                            job.opportunityType !== "Announcement" &&
                            job.applicationLink && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        // Open the application link in a new tab
                                        if (job.applicationLink) {
                                            window.open(job.applicationLink, '_blank')
                                        }
                                    }}
                                    size="lg"
                                    className="w-full text-white text-lg font-bold h-14 px-8 rounded-lg shadow-sm hover:shadow-md transition-all"
                                    style={{ backgroundColor: '#22c55e' }}
                                >
                                    Apply Now
                                </Button>
                            )}
                        
                        <Button
                            onClick={handleShareWhatsApp}
                            size="lg"
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold h-14 px-8 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                            <Share2 className="mr-2 h-5 w-5" />
                            Share on WhatsApp
                        </Button>
                    </div>

                    {/* Row 2: Build CV Button (Full Width) */}
                    <div className="w-full" style={{ wordBreak: 'normal', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 text-lg font-bold h-14 px-8 rounded-lg transition-all"
                        >
                            <Link href={`/edit-cv?job_id=${job.id}`}>
                                <FileText className="mr-2 h-5 w-5" />
                                Build your CV for this Job
                            </Link>
                        </Button>
                    </div>
                </div>

                </div>
            
            {/* Internal Application Modal - Root Level */}
            <InternalApplicationModal
                open={isApplyModalOpen}
                onOpenChange={setIsApplyModalOpen}
                jobId={job.id}
                jobTitle={job.title}
            />
        </div>
    )
}
