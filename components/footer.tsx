"use client"

import { MapPinned, Mail, Phone, Home, Briefcase, HelpCircle, Users, FileText, Check } from "lucide-react"
import { useEffect } from "react"
import { FaWhatsapp, FaFacebook, FaXTwitter, FaTelegram } from "react-icons/fa6"

export function Footer() {
  useEffect(() => {
    const t = setTimeout(() => {
      // Removed developer credits as requested
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <footer className="bg-slate-100 text-slate-800 py-4 w-full mx-0 mb-0">
      {/* 
        Space for Google AdSense Ad Unit (Footer)
        To place a manual ad here:
        1. Create a "Display ad unit" in Google AdSense
        2. Get the <ins>...</ins> code
        3. Paste it here inside a <div>
      */}
      
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 gap-4">
          
          {/* Box 1: Get in Touch */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl active:scale-105 transition-transform duration-200">
            <div className="bg-blue-600 px-3 py-1 flex items-center gap-2">
              <MapPinned className="h-3 w-3 text-white" />
              <span className="text-white font-semibold text-[9px]">Get in Touch</span>
            </div>
            <div className="p-1.5 space-y-2">
              <div className="flex items-start gap-2">
                <MapPinned className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" style={{ fontSize: '12px' }} />
                <span className="text-slate-900 text-[9px]">Kigali, Rwanda</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" style={{ fontSize: '12px' }} />
                <span className="text-slate-900 text-[9px]">0783074056</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" style={{ fontSize: '12px' }} />
                <a href="mailto:info@rwandajobhub.rw" className="text-slate-900 hover:text-blue-600 text-[9px] transition-colors">info@rwandajobhub.rw</a>
              </div>
            </div>
          </div>

          {/* Box 2: Quick Links */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl active:scale-105 transition-transform duration-200">
            <div className="bg-blue-600 px-3 py-1 flex items-center gap-2">
              <Home className="h-3 w-3 text-white" />
              <span className="text-white font-semibold text-[9px]">Quick Links</span>
            </div>
            <div className="p-1.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-orange-600 flex-shrink-0" style={{ fontSize: '12px' }} />
                <a href="/" className="text-slate-900 hover:text-blue-600 text-[9px] transition-colors">Home</a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-orange-600 flex-shrink-0" style={{ fontSize: '12px' }} />
                <a href="/exams" className="text-slate-900 hover:text-blue-600 text-[9px] transition-colors">View Exams</a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-orange-600 flex-shrink-0" style={{ fontSize: '12px' }} />
                <a href="/jobs" className="text-slate-900 hover:text-blue-600 text-[9px] transition-colors">Jobs</a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-orange-600 flex-shrink-0" style={{ fontSize: '12px' }} />
                <a href="/tenders" className="text-slate-900 hover:text-blue-600 text-[9px] transition-colors">Tenders</a>
              </div>
            </div>
          </div>

          {/* Box 3: Support */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl active:scale-105 transition-transform duration-200">
            <div className="bg-blue-600 px-3 py-1 flex items-center gap-2">
              <HelpCircle className="h-3 w-3 text-white" />
              <span className="text-white font-semibold text-[9px]">Support</span>
            </div>
            <div className="p-1.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-orange-600 flex-shrink-0" style={{ fontSize: '12px' }} />
                <a href="/help" className="text-slate-900 hover:text-blue-600 text-[9px] transition-colors">Help</a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-orange-600 flex-shrink-0" style={{ fontSize: '12px' }} />
                <a href="/contact" className="text-slate-900 hover:text-blue-600 text-[9px] transition-colors">Contact Us</a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-orange-600 flex-shrink-0" style={{ fontSize: '12px' }} />
                <a 
                  href="https://wa.me/250783074056" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-900 hover:text-green-600 text-[9px] transition-colors flex items-center gap-1"
                >
                  <FaWhatsapp className="h-3 w-3 text-green-600" />
                  WhatsApp Support
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-orange-600 flex-shrink-0" style={{ fontSize: '12px' }} />
                <a href="/employers" className="text-slate-900 hover:text-blue-600 text-[9px] transition-colors">Partners</a>
              </div>
            </div>
          </div>

          {/* Box 4: Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl active:scale-105 transition-transform duration-200">
            <div className="bg-blue-600 px-3 py-1 flex items-center gap-2">
              <Users className="h-3 w-3 text-white" />
              <span className="text-white font-semibold text-[9px]">Real-time Stats</span>
            </div>
            <div className="p-1.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="text-slate-900 text-[9px]">500+ Published Jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="text-slate-900 text-[9px]">10K+ Registered Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="text-slate-900 text-[9px]">50+ Active Employers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons Section - Classic Horizontal Row */}
        <div className="flex items-center justify-center gap-3 py-2">
          <a
            href="https://chat.whatsapp.com/250783074056?mode=wwt"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center hover:bg-slate-300 hover:border-slate-400 transition-all duration-300"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="h-3 w-3 text-green-600" />
          </a>
          
          <a
            href="https://www.facebook.com/profile.php?id=61584589785023"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center hover:bg-slate-300 hover:border-slate-400 transition-all duration-300"
            aria-label="Facebook"
          >
            <FaFacebook className="h-3 w-3 text-blue-600" />
          </a>
          
          <a
            href="https://x.com/Rwanda_Job_Hub"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center hover:bg-slate-300 hover:border-slate-400 transition-all duration-300"
            aria-label="X (Twitter)"
          >
            <FaXTwitter className="h-3 w-3 text-slate-600" />
          </a>
          
          <a
            href="https://t.me/RwandaJobHub"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center hover:bg-slate-300 hover:border-slate-400 transition-all duration-300"
            aria-label="Telegram"
          >
            <FaTelegram className="h-3 w-3 text-blue-600" />
          </a>
        </div>

        {/* Minimalist Bottom Bar */}
        <div className="pt-2 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[8px]">
            <a href="/privacy" className="text-slate-500 hover:text-slate-700 transition-colors py-1 px-2">Privacy Policy</a>
            <span className="text-slate-400">|</span>
            <a href="/terms" className="text-slate-500 hover:text-slate-700 transition-colors py-1 px-2">Terms & Conditions</a>
            <span className="text-slate-400">|</span>
            <a href="/disclaimer" className="text-slate-500 hover:text-slate-700 transition-colors py-1 px-2">Disclaimer</a>
          </div>
          <p className="text-slate-400 text-[8px] mt-2">
            2026 RwandaJobHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}