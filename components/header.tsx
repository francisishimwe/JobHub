"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image" // Added Next.js Image component
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, UserCircle2, Menu, X, MessageCircle } from "lucide-react"
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
    { href: "/exams", label: "View job exams" },
    { href: "/edit-cv", label: "Edit CV" },
    { href: "/post-advert", label: "Post advert" },
    { href: "/employers", label: "Employers" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/help", label: "Help" },
    { href: "/about", label: "About us" },
    { href: "/contact", label: "Contact us" },
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
          </nav>

          <div className="flex items-center gap-4">
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
                <SheetContent side="right" className="w-full max-w-xs pl-6 pr-4 bg-[#2563EB] text-white h-full sm:max-w-sm" suppressHydrationWarning>
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
                    <Button
                      onClick={() => {
                        handleJoinWhatsApp()
                        setMobileMenuOpen(false)
                      }}
                      className="gap-2 bg-white text-[#2563EB] w-full font-semibold"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Join WhatsApp Group
                    </Button>
                    {!isAuthenticated && (
                      <Button
                        asChild
                        className="w-full text-black mt-2"
                        style={{ backgroundColor: '#60A5FA' }}
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
              className="hidden md:inline-flex gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
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
                className="hidden md:inline-flex text-black" 
                style={{ backgroundColor: '#60A5FA' }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#60A5FA'}
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