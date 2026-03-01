"use client"

import { Building2, Star, HelpCircle, Badge } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NotificationLinks() {
  const pathname = usePathname()

  const links = [
    {
      href: "/employers",
      label: "Employers",
      icon: Building2,
      description: "Post jobs & find talent",
      badge: null
    },
    {
      href: "/testimonials", 
      label: "Testimonials",
      icon: Star,
      description: "Success stories",
      badge: "New"
    },
    {
      href: "/help",
      label: "Help",
      icon: HelpCircle,
      description: "Get support",
      badge: null
    }
  ]

  return (
    <nav className="flex items-center justify-center gap-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              group relative flex items-center gap-3 px-6 py-3 rounded-xl 
              transition-all duration-300 ease-out
              ${isActive 
                ? 'bg-blue-50 text-blue-600 shadow-md scale-105' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:shadow-md hover:scale-105'
              }
            `}
          >
            {/* Icon */}
            <div className={`
              relative flex items-center justify-center w-5 h-5
              transition-transform duration-300 group-hover:scale-110
            `}>
              <Icon className={`
                w-4 h-4 
                ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}
                transition-colors duration-300
              `} />
              
              {/* Notification Badge */}
              {link.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {link.badge}
                </span>
              )}
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-start">
              <span className={`
                font-medium text-sm
                ${isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}
                transition-colors duration-300
              `}>
                {link.label}
              </span>
              <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                {link.description}
              </span>
            </div>

            {/* Active Indicator */}
            {isActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
            )}

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
          </Link>
        )
      })}
    </nav>
  )
}

// Alternative Minimal Version for Header
export function MinimalNotificationLinks() {
  const pathname = usePathname()

  const links = [
    { href: "/employers", label: "Employers" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/help", label: "Help" }
  ]

  return (
    <nav className="flex items-center gap-8">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`
            relative text-sm font-medium transition-all duration-300
            ${pathname === link.href 
              ? 'text-blue-600' 
              : 'text-gray-600 hover:text-blue-600'
            }
            after:content-[''] after:absolute after:bottom-0 after:left-0 
            after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300
            hover:after:w-full
            ${pathname === link.href ? 'after:w-full' : ''}
          `}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

// Floating Action Button Version
export function FloatingNotificationLinks() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Main Button */}
      <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group">
        <HelpCircle className="w-6 h-6" />
        
        {/* Expanded Menu on Hover */}
        <div className="absolute bottom-16 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex flex-col gap-2 min-w-[150px]">
            <Link
              href="/employers"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Employers
            </Link>
            <Link
              href="/testimonials"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Star className="w-4 h-4" />
              Testimonials
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </Link>
          </div>
        </div>
      </button>
    </div>
  )
}
