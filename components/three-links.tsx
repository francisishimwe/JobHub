"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Star, HelpCircle } from "lucide-react"

export function ThreeNotificationLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-center gap-8 p-4">
      <Link
        href="/employers"
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          transition-all duration-300
          ${pathname === "/employers" 
            ? "bg-blue-100 text-blue-600 font-semibold" 
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
          }
        `}
      >
        <Building2 className="w-4 h-4" />
        <span>Partners</span>
      </Link>

      <Link
        href="/testimonials"
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          transition-all duration-300
          ${pathname === "/testimonials" 
            ? "bg-blue-100 text-blue-600 font-semibold" 
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
          }
        `}
      >
        <Star className="w-4 h-4" />
        <span>Testimonials</span>
      </Link>

      <Link
        href="/help"
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          transition-all duration-300
          ${pathname === "/help" 
            ? "bg-blue-100 text-blue-600 font-semibold" 
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
          }
        `}
      >
        <HelpCircle className="w-4 h-4" />
        <span>Help</span>
      </Link>
    </nav>
  )
}
