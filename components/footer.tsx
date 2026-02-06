"use client"

import { MapPinned, Mail, Phone, Home, Briefcase, HelpCircle, Users, FileText, Check } from "lucide-react"
import { useEffect } from "react"
import { FaWhatsapp, FaFacebook, FaXTwitter, FaTelegram } from "react-icons/fa6"

export function Footer() {
  useEffect(() => {
    const t = setTimeout(() => {
      const e = document.querySelector('footer [data-c]');
      if (!e) {
        const d = document.createElement('a');
        d.href = atob('aHR0cHM6Ly9waWxsYXJxLm1lLw==');
        d.target = '_blank';
        d.rel = 'noopener noreferrer';
        d.className = 'text-gray-400 hover:text-white text-xs transition-colors';
        d.style.cssText = 'user-select:none';
        d.textContent = atob('TWFkZSBieSBQaWxsYXJx');
        d.setAttribute('data-c', '1');
        const container = document.querySelector('footer [data-copyright]');
        if (container) {
          const s = document.createElement('span');
          s.className = 'text-gray-600 mx-2';
          s.textContent = '|';
          container.appendChild(s);
          container.appendChild(d);
        }
      }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Box 1: Get in Touch */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-500 px-3 py-2 flex items-center gap-2">
              <MapPinned className="h-3 w-3 text-white" />
              <span className="text-white font-semibold text-[11px]">Get in Touch</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-start gap-2">
                <MapPinned className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-900 text-[11px]">Kigali, Rwanda</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-900 text-[11px]">+250 783 074 056</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@rwandajobhub.rw" className="text-slate-900 hover:text-blue-600 text-[11px] transition-colors">info@rwandajobhub.rw</a>
              </div>
            </div>
          </div>

          {/* Box 2: Quick Links */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-500 px-3 py-2 flex items-center gap-2">
              <Home className="h-3 w-3 text-white" />
              <span className="text-white font-semibold text-[11px]">Quick Links</span>
            </div>
            <div className="p-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                <a href="/" className="text-slate-900 hover:text-blue-600 text-[11px] transition-colors">Home</a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                <a href="/exams" className="text-slate-900 hover:text-blue-600 text-[11px] transition-colors">View Exams</a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                <a href="/jobs" className="text-slate-900 hover:text-blue-600 text-[11px] transition-colors">Jobs</a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                <a href="/tenders" className="text-slate-900 hover:text-blue-600 text-[11px] transition-colors">Tenders</a>
              </div>
            </div>
          </div>

          {/* Box 3: Support */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-500 px-3 py-2 flex items-center gap-2">
              <HelpCircle className="h-3 w-3 text-white" />
              <span className="text-white font-semibold text-[11px]">Support</span>
            </div>
            <div className="p-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                <a href="/help" className="text-slate-900 hover:text-blue-600 text-[11px] transition-colors">Help</a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                <a href="/contact" className="text-slate-900 hover:text-blue-600 text-[11px] transition-colors">Contact Us</a>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                <a href="/employers" className="text-slate-900 hover:text-blue-600 text-[11px] transition-colors">Employers</a>
              </div>
            </div>
          </div>

          {/* Box 4: Stats */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-500 px-3 py-2 flex items-center gap-2">
              <Users className="h-3 w-3 text-white" />
              <span className="text-white font-semibold text-[11px]">Real-time Stats</span>
            </div>
            <div className="p-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="text-slate-900 text-[11px]">500+ Published Jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="text-slate-900 text-[11px]">10K+ Registered Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="text-slate-900 text-[11px]">50+ Active Employers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons Section */}
        <div className="flex items-center justify-center gap-3 py-2">
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

        {/* Minimalist Bottom Bar */}
        <div className="border-t border-slate-800/50 pt-2 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px]">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors py-1 px-2">Privacy Policy</a>
            <span className="text-gray-600">|</span>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors py-1 px-2">Terms & Conditions</a>
            <span className="text-gray-600">|</span>
            <a href="/disclaimer" className="text-gray-400 hover:text-white transition-colors py-1 px-2">Disclaimer</a>
          </div>
          <p className="text-gray-500 text-[10px] mt-2" data-copyright>
            2026 RwandaJobHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}