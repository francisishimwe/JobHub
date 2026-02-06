"use client"

import { MapPinned, Mail, Phone, Globe } from "lucide-react"
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
    <footer className="bg-slate-900 border-t border-slate-800/50 text-white">
      {/* 
        Space for Google AdSense Ad Unit (Footer)
        To place a manual ad here:
        1. Create a "Display ad unit" in Google AdSense
        2. Get the <ins>...</ins> code
        3. Paste it here inside a <div>
      */}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Column 1: Logo Only */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">RJ</span>
              </div>
              <span className="text-gray-400 text-sm">RwandaJobHub</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-row flex-wrap gap-x-6 justify-center">
              <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</a>
              <a href="/exams" className="text-gray-400 hover:text-white transition-colors text-sm">View Exams</a>
              <a href="/jobs" className="text-gray-400 hover:text-white transition-colors text-sm">Jobs</a>
              <a href="/tenders" className="text-gray-400 hover:text-white transition-colors text-sm">Tenders</a>
            </div>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <div className="flex flex-row flex-wrap gap-x-6 justify-center">
              <a href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">Help</a>
              <a href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a>
              <a href="/employers" className="text-gray-400 hover:text-white transition-colors text-sm">Employers</a>
            </div>
          </div>

          {/* Column 4: Connect */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPinned className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">Kigali, Rwanda</span>
              </div>
              <div className="flex flex-row items-center gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">info@rwandajobhub.rw</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">+250 783 074 056</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons Section */}
        <div className="border-t border-slate-800/50 pt-4 mt-6">
          <div className="flex items-center justify-center gap-4">
            {/* Glassmorphism Social Icons */}
            <a
              href="https://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="h-4 w-4 text-green-400" />
            </a>
            
            <a
              href="https://www.facebook.com/profile.php?id=61584589785023"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              aria-label="Facebook"
            >
              <FaFacebook className="h-4 w-4 text-blue-400" />
            </a>
            
            <a
              href="https://x.com/Rwanda_Job_Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="h-4 w-4 text-gray-300" />
            </a>
            
            <a
              href="https://t.me/RwandaJobHub"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              aria-label="Telegram"
            >
              <FaTelegram className="h-4 w-4 text-blue-400" />
            </a>
          </div>
        </div>

        {/* Legal Links & Copyright Section */}
        <div className="border-t border-slate-800/50 pt-4 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-[10px]">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors py-1 px-2">Privacy Policy</a>
              <span className="text-gray-600">|</span>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors py-1 px-2">Terms & Conditions</a>
              <span className="text-gray-600">|</span>
              <a href="/disclaimer" className="text-gray-400 hover:text-white transition-colors py-1 px-2">Disclaimer</a>
            </div>
            <p className="text-gray-500" data-copyright>
              2026 RwandaJobHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}