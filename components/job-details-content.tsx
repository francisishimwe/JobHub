"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Clock, ExternalLink, ArrowLeft } from "lucide-react"
import Image from "next/image"
import type { Job } from "@/lib/types"
import { useCompanies } from "@/lib/company-context"
import Link from "next/link"

interface JobDetailsContentProps {
    job: Job
}

export function JobDetailsContent({ job }: JobDetailsContentProps) {
    const { getCompanyById } = useCompanies()
    const company = getCompanyById(job.companyId)

    const handleApply = () => {
        if (job.applicationLink) {
            window.open(job.applicationLink, "_blank", "noopener,noreferrer")
        }
    }

    return (
        <div className="max-w-3xl mx-auto bg-card rounded-lg border shadow-sm p-6 md:p-8">
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
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground text-base">{company?.name || 'Unknown Company'}</span>
                            <span className="hidden md:inline">•</span>
                            <span className="text-muted-foreground">Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Job Overview */}
                <div className="grid gap-4 sm:grid-cols-3 p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-background rounded-full border">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Location</p>
                            <p className="font-medium">{job.location} ({job.locationType})</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-background rounded-full border">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Job Type</p>
                            <p className="font-medium">{job.jobType}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-background rounded-full border">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Experience</p>
                            <p className="font-medium">{job.experienceLevel}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                    <div
                        className="prose prose-sm max-w-none text-muted-foreground leading-relaxed
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

                {/* Stats */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <span className="text-sm font-medium text-muted-foreground">Total Applicants</span>
                    <span className="text-lg font-bold">{job.applicants}</span>
                </div>

                {/* Apply Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                    <Button
                        onClick={handleApply}
                        size="lg"
                        className="flex-1 bg-foreground text-background hover:bg-foreground/90 text-base font-medium h-12"
                    >
                        Apply Now
                        <ExternalLink className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
