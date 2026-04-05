'use client'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, Quote, Users, Building2, Award, MessageSquare } from "lucide-react"

export default function TestimonialsPage() {
  // Mock testimonials data - this will be managed through admin dashboardI
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
    }
  ]

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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded">
                        {testimonial.type}
                      </span>
                      <div className="flex">{renderStars(testimonial.rating)}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{testimonial.company}</p>
                  <p className="text-sm text-gray-600">{testimonial.date}</p>
                </div>
              </div>
              <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-700">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>

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
