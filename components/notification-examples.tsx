"use client"

import { NotificationLinks, MinimalNotificationLinks, FloatingNotificationLinks } from './notification-links'

// Example 1: Add to your main page layout
export function HeroSectionWithLinks() {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Dream Job in Rwanda
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Connect with top employers and discover exciting opportunities
        </p>
        
        {/* Add notification links here */}
        <div className="flex justify-center mb-12">
          <NotificationLinks />
        </div>
      </div>
    </section>
  )
}

// Example 2: Add to header for minimal navigation
export function HeaderWithLinks() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">JobHub</div>
          
          {/* Minimal links in header */}
          <MinimalNotificationLinks />
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    </header>
  )
}

// Example 3: Standalone section for testimonials page
export function TestimonialsSection() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What People Say About Us
        </h2>
        <p className="text-gray-600 mb-8">
          Real stories from job seekers and employers who found success through JobHub
        </p>
        
        {/* Quick access links */}
        <div className="flex justify-center mb-12">
          <NotificationLinks />
        </div>
        
        {/* Testimonials content would go here */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-700 mb-4">"JobHub helped me find my dream job in just 2 weeks!"</p>
            <p className="font-semibold text-gray-900">- Sarah K.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-700 mb-4">"We found qualified candidates quickly and efficiently."</p>
            <p className="font-semibold text-gray-900">- Tech Corp Rwanda</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-700 mb-4">"The best job platform in Rwanda!"</p>
            <p className="font-semibold text-gray-900">- Jean P.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Example 4: Help page with integrated navigation
export function HelpPageWithNavigation() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
            <MinimalNotificationLinks />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How can we help you?</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">For Job Seekers</h3>
              <p className="text-blue-700 text-sm">Learn how to create profiles, apply for jobs, and get noticed</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">For Employers</h3>
              <p className="text-green-700 text-sm">Post jobs, manage applications, and find the right talent</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">General Support</h3>
              <p className="text-purple-700 text-sm">Account issues, billing, and technical help</p>
            </div>
          </div>

          {/* Quick navigation */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <NotificationLinks />
          </div>
        </div>
      </main>

      {/* Floating help button */}
      <FloatingNotificationLinks />
    </div>
  )
}
