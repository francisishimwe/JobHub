import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, Quote, Users, Building2, Award, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function TestimonialsPage() {
  const [filter, setFilter] = useState<'all' | 'jobseekers' | 'employers'>('all')

  // Mock testimonials data - this will be managed through admin dashboard
  const testimonials = [
    {
      id: 1,
      name: "Sarah Mugisha",
      role: "Software Developer",
      company: "Tech Corp Rwanda",
      type: "jobseeker",
      rating: 5,
      date: "2024-02-15",
      image: "/testimonials/sarah.jpg",
      quote: "RwandaJobHub helped me find my dream job in just 2 weeks! The platform is easy to use and the job listings are high quality. I'm now working at a great company with excellent benefits."
    },
    {
      id: 2,
      name: "Jean-Pierre Niyonzima",
      role: "HR Manager",
      company: "Bank of Kigali",
      type: "employer",
      rating: 5,
      date: "2024-02-10",
      image: "/testimonials/jean-pierre.jpg",
      quote: "We've hired over 20 qualified candidates through RwandaJobHub. The platform has streamlined our recruitment process and saved us countless hours. Highly recommended for any company looking to hire top talent."
    },
    {
      id: 3,
      name: "Grace Uwimana",
      role: "Marketing Specialist",
      company: "MTN Rwanda",
      type: "jobseeker",
      rating: 5,
      date: "2024-02-05",
      image: "/testimonials/grace.jpg",
      quote: "After months of searching, I found the perfect marketing role through RwandaJobHub. The application process was smooth, and I got responses from multiple employers. This platform truly connects job seekers with real opportunities."
    },
    {
      id: 4,
      name: "Michel Habimana",
      role: "CEO",
      company: "Rwanda Tech Solutions",
      type: "employer",
      rating: 5,
      date: "2024-01-28",
      image: "/testimonials/michel.jpg",
      quote: "As a startup, finding the right talent was challenging. RwandaJobHub made it easy to reach qualified candidates quickly. We've built our entire team through this platform!"
    },
    {
      id: 5,
      name: "Alice Mukamana",
      role: "Accountant",
      company: "SACOLA",
      type: "jobseeker",
      rating: 4,
      date: "2024-01-20",
      image: "/testimonials/alice.jpg",
      quote: "I was skeptical at first, but RwandaJobHub delivered! I found an accounting position that perfectly matches my skills and experience. The platform is professional and reliable."
    },
    {
      id: 6,
      name: "David Mutabazi",
      role: "Operations Director",
      company: "Airtel Rwanda",
      type: "employer",
      rating: 5,
      date: "2024-01-15",
      image: "/testimonials/david.jpg",
      quote: "The quality of candidates on RwandaJobHub is exceptional. We've reduced our time-to-hire by 60% since using this platform. It's become our primary recruitment tool."
    }
  ]

  const filteredTestimonials = testimonials.filter(testimonial => 
    filter === "all" || testimonial.type === filter
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))
  }

  const stats = {
    totalTestimonials: testimonials.length,
    jobseekers: testimonials.filter(t => t.type === "jobseeker").length,
    employers: testimonials.filter(t => t.type === "employer").length,
    averageRating: (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Quote className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What People Say About Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from job seekers and employers who found success through RwandaJobHub. 
            Discover why thousands trust us for their career and recruitment needs.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalTestimonials}+</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.jobseekers}</div>
            <div className="text-sm text-gray-600">Job Seekers</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.employers}</div>
            <div className="text-sm text-gray-600">Employers</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-3xl font-bold text-orange-600">{stats.averageRating}</span>
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-md transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All ({stats.totalTestimonials})
            </button>
            <button
              onClick={() => setFilter("jobseekers")}
              className={`px-6 py-2 rounded-md transition-all ${
                filter === "jobseekers"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Job Seekers ({stats.jobseekers})
            </button>
            <button
              onClick={() => setFilter("employers")}
              className={`px-6 py-2 rounded-md transition-all ${
                filter === "employers"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              Employers ({stats.employers})
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={testimonial.image}
                    alt={`${testimonial.name} photo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  {/* Fallback to initials */}
                  <div className="hidden w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {testimonial.name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-blue-600">{testimonial.company}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {renderStars(testimonial.rating)}
                <span className="text-sm text-gray-500 ml-2">
                  {new Date(testimonial.date).toLocaleDateString()}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 italic leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Type Badge */}
              <div className="mt-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  testimonial.type === "jobseeker"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {testimonial.type === "jobseeker" ? (
                    <>
                      <Users className="h-3 w-3" />
                      Job Seeker
                    </>
                  ) : (
                    <>
                      <Building2 className="h-3 w-3" />
                      Employer
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTestimonials.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Testimonials Found</h3>
            <p className="text-gray-600">
              {filter === "all" 
                ? "Testimonials will appear here once added through the admin dashboard."
                : `No ${filter} testimonials available yet.`
              }
            </p>
          </div>
        )}

        {/* Submit Testimonial CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <Award className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Share Your Success Story</h2>
          <p className="text-xl mb-8 opacity-90">
            Have you found success through RwandaJobHub? We'd love to hear your story!
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Submit Your Testimonial
          </button>
        </div>

        {/* Admin Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">For Administrators</h4>
              <p className="text-blue-700 text-sm">
                Testimonials can be managed through the admin dashboard. 
                Upload photos to the <code className="bg-blue-100 px-1 rounded">/public/testimonials/</code> folder 
                and update testimonials in the admin panel.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
