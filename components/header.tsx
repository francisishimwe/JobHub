"use client"

import { useState } from "react"
import Link from "next/link"
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

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const handleJoinWhatsApp = () => {
    // Replace with your actual WhatsApp group/channel link
    window.open('https://chat.whatsapp.com/Ky7m3B0M5Gd3saO58Rb1tI?mode=wwt', '_blank')
  }

  const navigationLinks = [
    { href: "/exams", label: "View job exams" },
    { href: "/edit-cv", label: "Edit CV" },
    { href: "/about", label: "About us" },
    { href: "/contact", label: "Contact us" },
  ]

  return (
    <header className="border-b" style={{ backgroundColor: '#003566' }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-white">RwandaJobHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-gray-100">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
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
                  className="gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Join WhatsApp
                </Button>
                {!isAuthenticated && (
                  <Link
                    href="/dashboard"
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Join WhatsApp Button - Desktop */}
          <Button 
            onClick={handleJoinWhatsApp}
            className="hidden md:inline-flex gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white"
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
            <Button asChild className="hidden md:inline-flex text-black" style={{ backgroundColor: '#76c893' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#52b69a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#76c893'}>
              <Link href="/dashboard">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
