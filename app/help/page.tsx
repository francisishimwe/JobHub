'use client'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HelpCircle, Users, Building2, Phone, Mail, MessageSquare, ExternalLink, Book, FileText, Shield, ChevronRight, Clock, CheckCircle, Star } from "lucide-react"

export default function HelpPage() {
  // FAQ data organized by category
  const faqData = {
    jobseekers: {
      title: "For Job Seekers",
      icon: Users,
      color: "green",
      questions: [
        {
          q: "How do I create a profile on RwandaJobHub?",
          a: "Creating a profile is easy! Click on 'Sign Up' in the top right corner, fill in your personal information, upload your CV, and complete your profile. The more complete your profile, the better your chances of getting noticed by employers."
        },
        {
          q: "How do I apply for jobs?",
          a: "Browse through our job listings, click on any job that interests you, and click the 'Apply Now' button. You can either apply with your RwandaJobHub profile or upload your CV directly."
        },
        {
          q: "Is RwandaJobHub free for job seekers?",
          a: "Yes! RwandaJobHub is completely free for job seekers. You can create a profile, browse jobs, and apply to positions at no cost."
        },
        {
          q: "How do I track my applications?",
          a: "Log into your account and go to 'My Applications' in your dashboard. You'll see all the jobs you've applied for and their current status."
        },
        {
          q: "How do I get notifications for new jobs?",
          a: "Go to your profile settings and enable job notifications. You can choose to receive notifications via email or WhatsApp for jobs matching your criteria."
        }
      ]
    },
    employers: {
      title: "For Employers",
      icon: Building2,
      color: "blue",
      questions: [
        {
          q: "How do I post a job on RwandaJobHub?",
          a: "Employers can post jobs by creating an account, selecting a pricing plan, and filling out the job posting form. Include detailed job descriptions, requirements, and application instructions for best results."
        },
        {
          q: "What are the pricing plans for employers?",
          a: "We offer four plans: Free (1 job post), Featured (₣50,000 for 5 posts), Premium (₣75,000 for 10 posts), and Enterprise (₣150,000 for unlimited posts). Each plan offers different durations and features."
        },
        {
          q: "How do I manage applications?",
          a: "Log into your employer dashboard and go to 'Manage Applications'. You can view, filter, sort, and respond to all applications received for your job postings."
        },
        {
          q: "Can I edit my job posting after publishing?",
          a: "Yes! You can edit your job postings at any time from your dashboard. Changes will be reflected immediately on the platform."
        },
        {
          q: "How do I search for candidates?",
          a: "Premium and Enterprise plans include access to our candidate database. You can search by skills, experience, location, and other criteria to find qualified candidates."
        }
      ]
    },
    technical: {
      title: "Technical Support",
      icon: Shield,
      color: "purple",
      questions: [
        {
          q: "I forgot my password. How do I reset it?",
          a: "Click on 'Forgot Password' on the login page. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
        },
        {
          q: "Why can't I log into my account?",
          a: "Make sure you're using the correct email and password. Check that your account is verified. If you still can't log in, try resetting your password or contact support."
        },
        {
          q: "How do I delete my account?",
          a: "Go to your account settings and click on 'Delete Account'. Please note that this action is permanent and cannot be undone. We recommend downloading your data first."
        },
        {
          q: "The website is not loading properly. What should I do?",
          a: "Try clearing your browser cache and cookies, or try using a different browser. Make sure you have a stable internet connection. If problems persist, contact our technical support."
        },
        {
          q: "Is my data secure on RwandaJobHub?",
          a: "Yes! We use industry-standard encryption and security measures to protect your data. Your personal information is never shared with third parties without your consent."
        }
      ]
    }
  }

  const contactOptions = [
    {
      icon: Phone,
      title: "Phone Support",
      value: "+250 783 074 056",
      description: "Monday - Friday, 9AM - 5PM",
      action: "tel:+250783074056"
    },
    {
      icon: Mail,
      title: "Email Support",
      value: "info@rwandajobhub.rw",
      description: "We respond within 24 hours",
      action: "mailto:info@rwandajobhub.rw"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Support",
      value: "Live Chat Available",
      description: "Quick responses via WhatsApp",
      action: "https://wa.me/250783074056"
    }
  ]

  const quickLinks = [
    {
      icon: Book,
      title: "User Guide",
      description: "Complete guide for using RwandaJobHub",
      href: "/user-guide"
    },
    {
      icon: FileText,
      title: "Terms & Conditions",
      description: "Read our terms and policies",
      href: "/terms"
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "How we protect your data",
      href: "/privacy"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How Can We Help You?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions, get support, and learn how to make the most of RwandaJobHub. 
            We're here to help you succeed.
          </p>
        </div>

        {/* Help Categories with Numbers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {Object.entries(faqData).map(([key, category], index) => {
            const Icon = category.icon
            
            return (
              <div key={key} className="relative">
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                  {index + 1}
                </div>
                
                {/* Category Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow pt-8">
                  {/* Category Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 text-${category.color}-600`} />
                      </div>
                      <h3 className="font-semibold text-gray-900">{category.title}</h3>
                    </div>
                  </div>

                  {/* FAQ Questions */}
                  <div className="divide-y divide-gray-100">
                    {category.questions.map((item, qIndex) => (
                      <div key={qIndex} className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{item.q}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Still Need Help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <a
                  key={index}
                  href={option.action}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-105 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                  <p className="text-blue-600 font-medium mb-2">{option.value}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </a>
              )
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <a
                  key={index}
                  href={link.href}
                  className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <Icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </a>
              )
            })}
          </div>
        </div>

        {/* Help Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-8">We're Here to Help</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-6 w-6" />
                <div className="text-4xl font-bold">24/7</div>
              </div>
              <div className="text-blue-100">WhatsApp Support</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6" />
                <div className="text-4xl font-bold">&lt;24h</div>
              </div>
              <div className="text-blue-100">Email Response Time</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-6 w-6" />
                <div className="text-4xl font-bold">98%</div>
              </div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
