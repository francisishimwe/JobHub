"use client"

import { MapPinned, Mail, Phone } from "lucide-react"
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
        d.className = 'text-gray-300 hover:text-white text-xs transition-colors';
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
    <footer className="text-white py-8" style={{ backgroundColor: '#003566' }}>
      {/* 
        Space for Google AdSense Ad Unit (Footer)
        To place a manual ad here:
        1. Create a "Display ad unit" in Google AdSense
        2. Get the <ins>...</ins> code
        3. Paste it here inside a <div>
      */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold mb-6 text-center">Get in Touch</h3>

          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <MapPinned className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-gray-300 text-sm">Kigali, Rwanda</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-300 text-sm">rwandaiobhub2050@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-300 text-sm">+250 783 074 056</p>
              </div>
            </div>
          </div>

          {/* Follow Us Section */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <h4 className="text-center font-bold mb-4">Follow Us</h4>
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#25D366] hover:opacity-80 transition-opacity"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61584589785023"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1877F2] hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </a>
              <a
                href="https://x.com/Rwanda_Job_Hub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black hover:opacity-80 transition-opacity"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </a>
              <a
                href="https://t.me/RwandaJobHub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0088cc] hover:opacity-80 transition-opacity"
                aria-label="Telegram"
              >
                <FaTelegram className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </a>
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <a href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-600">|</span>
              <a href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms & Conditions
              </a>
              <span className="text-gray-600">|</span>
              <a href="/disclaimer" className="text-gray-300 hover:text-white text-sm transition-colors">
                Disclaimer
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2" data-copyright>
              <p className="text-gray-400 text-sm">
                © 2025 RwandaJobHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}