"use client"

import { FaWhatsapp, FaFacebook, FaXTwitter, FaTelegram } from "react-icons/fa6"

export function FollowUs() {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Follow Us</h3>
      <div className="flex items-center justify-center gap-3">
        <a
          href="https://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:opacity-80 transition-opacity"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="h-6 w-6 text-white" />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61584589785023"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] hover:opacity-80 transition-opacity"
          aria-label="Facebook"
        >
          <FaFacebook className="h-6 w-6 text-white" />
        </a>
        <a
          href="https://x.com/Rwanda_Job_Hub"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-black hover:opacity-80 transition-opacity"
          aria-label="X (Twitter)"
        >
          <FaXTwitter className="h-6 w-6 text-white" />
        </a>
        <a
          href="https://t.me/RwandaJobHub"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0088cc] hover:opacity-80 transition-opacity"
          aria-label="Telegram"
        >
          <FaTelegram className="h-6 w-6 text-white" />
        </a>
      </div>
    </div>
  )
}
