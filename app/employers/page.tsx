'use client'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Building2, MapPin, Globe, ExternalLink, Users, Star, Phone, Mail, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function PartnersPage() {
  // Mock partner data - this will be managed through admin dashboard
  const partners = [
    {
      id: 1,
      name: "Bank of Kigali",
      logo: "/partners/bank-of-kigali.png",
      website: "https://bankofkigali.rw"
    },
    {
      id: 2,
      name: "MTN Rwanda",
      logo: "/partners/mtn-rwanda.png", 
      website: "https://mtn.rw"
    },
    {
      id: 3,
      name: "Rwanda Energy Group",
      logo: "/partners/energy-group.png",
      website: "https://reg.rw"
    },
    {
      id: 4,
      name: "Airtel Rwanda",
      logo: "/partners/airtel-rwanda.png",
      website: "https://airtel.rw"
    },
    {
      id: 5,
      name: "Rwanda Development Board",
      logo: "/partners/rdb.png",
      website: "https://rdb.rw"
    },
    {
      id: 6,
      name: "Bralirwa",
      logo: "/partners/bralirwa.png",
      website: "https://bralirwa.rw"
    },
    {
      id: 7,
      name: "SACOLA",
      logo: "/partners/sacola.png",
      website: "https://sacola.rw"
    },
    {
      id: 8,
      name: "Cogebanque",
      logo: "/partners/cogebanque.png",
      website: "https://cogebanque.rw"
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
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Trusted Partners
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We work with leading companies across Rwanda to connect them with top talent. 
            These are the organizations that trust RwandaJobHub for their recruitment needs.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="group relative bg-gray-50 rounded-xl p-6 hover:bg-blue-50 hover:shadow-md transition-all duration-300"
              >
                {/* Company Logo */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="w-full h-full object-cover"
                  />
                  {/* Fallback to initials */}
                  <div className="hidden text-2xl font-bold text-gray-400">
                    {partner.name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Company Name */}
                <h3 className="text-sm font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors">
                  {partner.name}
                </h3>

                {/* Hover Indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Star className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State for Admin */}
          {partners.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Partners Yet</h3>
              <p className="text-gray-600">
                Partners will appear here once added through the admin dashboard.
              </p>
            </div>
          )}
        </div>

        {/* Admin Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">For Administrators</h4>
              <p className="text-blue-700 text-sm">
                Partner logos and information can be managed through the admin dashboard. 
                Upload company logos to the <code className="bg-blue-100 px-1 rounded">/public/partners/</code> folder 
                and update the partner list in the admin panel.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
