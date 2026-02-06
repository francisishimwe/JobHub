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
    <footer className="bg-slate-900 border-t border-slate-800/50 text-white py-4">
      {/* 
        Space for Google AdSense Ad Unit (Footer)
        To place a manual ad here:
        1. Create a "Display ad unit" in Google AdSense
        2. Get the <ins>...</ins> code
        3. Paste it here inside a <div>
      */}
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-5 gap-4">
          
          {/* Box 1: Get in Touch */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl active:scale-110 transition-all duration-300">
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
                <span className="text-slate-900 text-[9px]">+250 783 074 056</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" style={{ fontSize: '12px' }} />
                <a href="mailto:info@rwandajobhub.rw" className="text-slate-900 hover:text-blue-600 text-[9px] transition-colors">info@rwandajobhub.rw</a>
              </div>
            </div>
          </div>

          {/* Box 2: Quick Links */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl active:scale-110 transition-all duration-300">
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl active:scale-110 transition-all duration-300">
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
                <a href="/employers" className="text-slate-900 hover:text-blue-600 text-[9px] transition-colors">Employers</a>
              </div>
            </div>
          </div>

          {/* Box 4: Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl active:scale-110 transition-all duration-300">
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

          {/* Box 5: Follow Us - Social Media */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:-translate-y-2 hover:shadow-xl active:scale-110 transition-all duration-300 lg:col-span-1">
            <div className="bg-blue-600 px-3 py-1 flex items-center gap-2">
              <span className="text-white font-semibold text-[9px]">Follow Us</span>
            </div>
            <div className="p-1.5">
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="h-3 w-3 text-green-400" />
                </a>
                
                <a
                  href="https://www.facebook.com/profile.php?id=61584589785023"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebook className="h-3 w-3 text-blue-400" />
                </a>
                
                <a
                  href="https://x.com/Rwanda_Job_Hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                  aria-label="X (Twitter)"
                >
                  <FaXTwitter className="h-3 w-3 text-gray-300" />
                </a>
                
                <a
                  href="https://t.me/RwandaJobHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                  aria-label="Telegram"
                >
                  <FaTelegram className="h-3 w-3 text-blue-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Bottom Bar */}
        <div className="border-t border-slate-800/50 pt-2 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[8px]">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors py-1 px-2">Privacy Policy</a>
            <span className="text-gray-600">|</span>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors py-1 px-2">Terms & Conditions</a>
            <span className="text-gray-600">|</span>
            <a href="/disclaimer" className="text-gray-400 hover:text-white transition-colors py-1 px-2">Disclaimer</a>
          </div>
          <p className="text-gray-500 text-[8px] mt-2">
            2026 RwandaJobHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}