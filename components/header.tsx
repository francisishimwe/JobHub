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
      {/* Logo Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Link href="/" className="flex items-center justify-center gap-3">
            {/* Mobile Logo Container - Fixed dimensions to stop layout shift */}
            <div className="relative h-12 w-32 md:hidden">
              <Image
                src="/full logo.jpg"
                alt="RwandaJobHub"
                fill
                priority
                className="object-contain"
              />
            </div>
            
            {/* Desktop Logo Container - Fixed dimensions to stop layout shift */}
            <div className="relative hidden md:block h-20 w-64">
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
      </header>

      {/* Navigation Header */}
      <header className="border-b" style={{ backgroundColor: '#003566' }}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <nav className="hidden md:flex items-center gap-7">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-white hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Company Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-lg font-medium text-white hover:text-gray-300 transition-colors gap-1 h-auto p-0"
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
                      className="text-gray-900 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-4">
            {/* Post Advert Button */}
            <Button 
              asChild
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              <Link href="/post-advert">Post Advert</Link>
            </Button>

            {/* Mobile Menu */}
            {!mounted ? (
              <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-gray-100">
                <Menu className="h-5 w-5" />
              </Button>
            ) : (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden text-white border-2 border-white rounded-md p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs pl-6 pr-4 bg-[#003D7A] text-white h-full sm:max-w-sm" suppressHydrationWarning>
                  <div className="flex flex-col gap-4 mt-6">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-medium text-white hover:text-gray-100 transition-colors py-3 px-2 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    
                    {/* Mobile Company Dropdown Items */}
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-sm font-semibold text-white/80 mb-3">Company</p>
                      {companyDropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block text-lg font-medium text-white hover:text-gray-100 transition-colors py-3 px-2 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    
                    {/* Mobile Post Advert */}
                    <Button
                      asChild
                      className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/post-advert">Post Advert</Link>
                    </Button>
                    <Button
                      onClick={() => {
                        handleJoinWhatsApp()
                        setMobileMenuOpen(false)
                      }}
                      className="gap-2 bg-white text-[#003D7A] w-full font-semibold"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Join WhatsApp Group
                    </Button>
                    {!isAuthenticated && (
                      <Button
                        asChild
                        className="w-full text-black mt-2"
                        style={{ backgroundColor: '#003D7A' }}
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

            {/* Join WhatsApp Button - Desktop */}
            <Button
              onClick={handleJoinWhatsApp}
              className="hidden md:inline-flex gap-2 bg-[#003D7A] hover:bg-[#002B5C] text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Join WhatsApp
            </Button>

            {/* Desktop Auth */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-gray-800">
                    <UserCircle2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.email}</span>
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
                className="hidden md:inline-flex text-white" 
                style={{ backgroundColor: '#003D7A' }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002B5C'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003D7A'}
              >
                <Link href="/dashboard">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}