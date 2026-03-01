import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HelpCircle, Users, Building2, Phone, Mail, MessageSquare, Search, ChevronDown, ChevronUp, ExternalLink, Book, FileText, Shield } from "lucide-react"
import { useState } from "react"

export default function HelpPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

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

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  const filteredFAQs = searchQuery 
    ? Object.entries(faqData).reduce((acc, [key, category]) => {
        const filteredQuestions = category.questions.filter(
          item => 
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (filteredQuestions.length > 0) {
          acc[key as keyof typeof faqData] = { ...category, questions: filteredQuestions }
        }
        return acc
      }, {} as Partial<typeof faqData>)
    : faqData

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

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {Object.entries(filteredFAQs).map(([key, category]) => {
            const Icon = category.icon
            const isExpanded = expandedCategory === key
            
            return (
              <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(key)}
                  className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    isExpanded ? `bg-${category.color}-50` : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 text-${category.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* FAQ Questions */}
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {category.questions.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0">
                        <button
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            // Simple toggle for individual questions
                            const element = document.getElementById(`faq-${key}-${index}`)
                            if (element) {
                              element.classList.toggle('hidden')
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-2">{item.q}</h4>
                              <p id={`faq-${key}-${index}`} className="text-gray-600 text-sm leading-relaxed hidden">
                                {item.a}
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">WhatsApp Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">&lt;24h</div>
              <div className="text-blue-100">Email Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
