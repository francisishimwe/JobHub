"use client"

import { useParams } from "next/navigation"
import { useJobs } from "@/lib/job-context"
import { useCompanies } from "@/lib/company-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPinned, Clock, UserCheck, BadgeCheck, Share2, ExternalLink, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Head from "next/head"
import { useEffect } from "react"

export default function JobDetailPage() {
  const params = useParams()
  const { jobs } = useJobs()
  const { getCompanyById } = useCompanies()
  
  const job = jobs.find(j => j.id === params.id)
  const company = job ? getCompanyById(job.companyId) : null

  // Check if data is still loading (jobs array is empty on first render)
  const isLoading = jobs.length === 0

  // Update favicon and meta tags dynamically
  useEffect(() => {
    if (company && job) {
      // Update favicon
      const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement
      if (favicon) {
        favicon.href = company.logo || "/favicon.ico"
      } else {
        const newFavicon = document.createElement('link')
        newFavicon.rel = 'icon'
        newFavicon.href = company.logo || "/favicon.ico"
        document.head.appendChild(newFavicon)
      }

      // Update Open Graph meta tags
      const updateMetaTag = (property: string, content: string) => {
        let metaTag = document.querySelector(`meta[property='${property}']`) as HTMLMetaElement
        if (metaTag) {
          metaTag.content = content
        } else {
          metaTag = document.createElement('meta')
          metaTag.setAttribute('property', property)
          metaTag.content = content
          document.head.appendChild(metaTag)
        }
      }

      updateMetaTag('og:title', `${job.title} at ${company.name}`)
      updateMetaTag('og:description', `${company.name} is hiring, Apply now on: ${window.location.href}`)
      updateMetaTag('og:image', company.logo || "/favicon.ico")
      updateMetaTag('og:url', window.location.href)
      updateMetaTag('og:type', 'website')

      // Update Twitter Card meta tags
      const updateTwitterTag = (name: string, content: string) => {
        let metaTag = document.querySelector(`meta[name='${name}']`) as HTMLMetaElement
        if (metaTag) {
          metaTag.content = content
        } else {
          metaTag = document.createElement('meta')
          metaTag.setAttribute('name', name)
          metaTag.content = content
          document.head.appendChild(metaTag)
        }
      }

      updateTwitterTag('twitter:card', 'summary_large_image')
      updateTwitterTag('twitter:title', `${job.title} at ${company.name}`)
      updateTwitterTag('twitter:description', `${company.name} is hiring, Apply now on: ${window.location.href}`)
      updateTwitterTag('twitter:image', company.logo || "/favicon.ico")
    }
  }, [company, job])

  // Show loading skeleton if data hasn't loaded or job not found
  if (isLoading || !job || !company) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          {/* Show skeleton or minimal content while loading */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-lg p-8 animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const shareToWhatsApp = () => {
    const message = `🔔 *${job.title}* at *${company.name}*\n\n${company.name} is hiring!\n\n📍 Location: ${job.location}\n💼 Type: ${job.jobType}\n📊 Level: ${job.experienceLevel}\n\n🔗 Apply now: ${window.location.href}\n\n💬 Join our WhatsApp group for more opportunities:\nhttps://chat.whatsapp.com/Ky7m3B0M5Gd3saO58Rb1tI`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const shareJob = () => {
    const shareText = `${company.name} is hiring, Apply now on: ${window.location.href}`
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${company.name}`,
        text: shareText,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Job link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-card border rounded-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={`${company.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                    <div className="flex items-center gap-2 text-lg text-muted-foreground">
                      <span className="font-medium text-foreground">{company.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={shareToWhatsApp} variant="outline" size="sm" className="gap-2">
                      <Phone className="h-4 w-4" />
                      WhatsApp
                    </Button>
                    <Button onClick={shareJob} variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPinned className="h-4 w-4" />
                    <span>{job.location} ({job.locationType})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Posted {formatDate(job.postedDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-4 w-4" />
                    <span>{job.applicants} applicants</span>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {formatDate(new Date(job.deadline))}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary">{job.jobType}</Badge>
                  <Badge variant="secondary">{job.experienceLevel}</Badge>
                  <Badge variant="secondary">{job.opportunityType}</Badge>
                  {job.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                </div>
                
                <Button size="lg" className="w-full md:w-auto" asChild>
                  <Link href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Content Sections */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div 
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>
              
              {/* How to Apply */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">How to Apply</h2>
                <p className="text-muted-foreground mb-4">
                  Ready to apply for this position? Click the "Apply Now" button to be redirected 
                  to the application page or contact the employer directly.
                </p>
                <Button asChild>
                  <Link href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">About {company.name}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={company.logo || "/placeholder.svg"}
                      alt={`${company.name} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Member since {formatDate(company.createdDate)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Job Details */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Job Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job Type:</span>
                    <span className="font-medium">{job.jobType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience Level:</span>
                    <span className="font-medium">{job.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Opportunity Type:</span>
                    <span className="font-medium">{job.opportunityType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location Type:</span>
                    <span className="font-medium">{job.locationType}</span>
                  </div>
                  {job.deadline && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Application Deadline:</span>
                      <span className="font-medium">{formatDate(new Date(job.deadline))}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Share Job */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Share this Job</h3>
                <div className="space-y-2">
                  <Button onClick={shareToWhatsApp} variant="outline" className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Share on WhatsApp
                  </Button>
                  <Button onClick={shareJob} variant="outline" className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}