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
    { href: "/jobs", label: "Find Jobs" },
    { href: "/exams", label: "View Job Exams" },
  ]

  const companyDropdownItems = [
    { href: "/employers", label: "Employers" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      {/* Secondary Top Bar - WhatsApp & Post Advert */}
      <header className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={handleJoinWhatsApp}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 text-sm font-medium rounded-md transition-all animate-pulse"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Join WhatsApp
            </Button>
            <Button 
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
            >
              <Link href="/post-advert">Post Advert</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Header - Clean Logo */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              {/* Single Logo - Responsive sizing */}
              <div className="relative h-10 w-32 md:h-12 md:w-40">
                <Image
                  src="/full logo.jpg"
                  alt="RwandaJobHub"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Company Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors gap-1 h-auto p-0"
                  >
                    Company
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white">
                  {companyDropdownItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link 
                        href={item.href} 
                        className="text-slate-900 hover:bg-gray-100 cursor-pointer"
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-gray-900 hover:bg-gray-100">
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
                <Button 
                  asChild 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors"
                >
                  <Link href="/dashboard">Login</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            {!mounted ? (
              <Button variant="ghost" size="sm" className="md:hidden text-gray-900 hover:bg-gray-100">
                <Menu className="h-5 w-5" />
              </Button>
            ) : (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs pl-6 pr-4 bg-white text-gray-900 h-full sm:max-w-sm" suppressHydrationWarning>
                  <div className="flex flex-col gap-4 mt-6">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors py-3 px-2 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    
                    {/* Mobile Company Dropdown Items */}
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-600 mb-3">Company</p>
                      {companyDropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors py-3 px-2 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    
                    {/* Mobile Auth */}
                    {!isAuthenticated && (
                      <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors w-full"
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