"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image" // Added Next.js Image component
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, UserCircle2, Menu, X, MessageCircle, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const handleJoinWhatsApp = () => {
    window.open('https://chat.whatsapp.com/Ky7m3B0M5Gd3saO58Rb1tI?mode=wwt', '_blank')
  }

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/exams", label: "View Exams" },
    { href: "/employers", label: "Employers" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/help", label: "Help" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ]

  return (
    <>
      {/* Gorgeous Single-Line Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full px-4 py-4">
          {/* Logo - Far Left */}
          <div className="bg-white rounded-xl shadow-lg p-4 pointer-events-none z-50 w-fit">
            <Link href="/" className="flex items-center gap-3 pointer-events-auto">
              <div className="relative h-20 w-32">
                <Image
                  src="/full logo.jpg"
                  alt="RwandaJobHub"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Navigation Links - Center (Large Desktop Only) */}
          <nav className="hidden lg:flex items-center gap-x-12">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 font-medium hover:text-blue-600 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons - Far Right */}
          <div className="flex items-center gap-x-8">
            {/* Login Text Link and Post Job Button Grouped */}
            <div className="flex flex-row items-center gap-x-8">
              {/* Royal Blue Post a Job Pill - Mobile Optimized - NOW ON LEFT */}
              <Button 
                asChild
                className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-2 sm:px-6 py-2 text-sm font-semibold rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
              >
                <Link href="/post-advert">
                  <span className="text-lg">+</span>
                  <span className="hidden sm:inline">Post a Job</span>
                  <span className="sm:hidden">Post a Job</span>
                </Link>
              </Button>

              {/* Login Text Link - NOW ON RIGHT */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-slate-700 hover:bg-gray-100 px-2">
                      <UserCircle2 className="h-4 w-4" />
                      <span className="hidden lg:inline">{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link 
                  href="/dashboard" 
                  className="text-slate-600 hover:text-slate-800 font-medium transition-colors px-2 whitespace-nowrap"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu - Hidden on Desktop, Visible on Mobile (Portrait & Landscape) */}
            {!mounted ? (
              <Button variant="ghost" size="sm" className="lg:hidden text-slate-700 hover:bg-gray-100">
                <Menu className="h-5 w-5" />
              </Button>
            ) : (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden text-slate-700 hover:bg-gray-100 border border-slate-300 rounded-md p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs pl-6 pr-4 bg-white text-slate-900 h-full sm:max-w-sm" suppressHydrationWarning>
                  <div className="flex flex-col gap-4 mt-6">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors py-3 px-2 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    
                    {/* Mobile Auth */}
                    {!isAuthenticated && (
                      <Button
                        asChild
                        className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-4 py-2 text-sm font-medium rounded-full transition-colors w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Login
                        </Link>
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>
    </>
  )
}