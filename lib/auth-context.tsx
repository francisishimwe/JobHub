"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  email: string
  isAuthenticated: boolean
  planType?: string
  firstName?: string
  lastName?: string
  company?: string
  role?: 'admin' | 'employer' // Add role field
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("RwandaJobHub-auth-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email)
      return false
    }

    // Check if user exists in localStorage (from registration)
    const savedEmployerData = localStorage.getItem("employerData")
    if (savedEmployerData) {
      const employer = JSON.parse(savedEmployerData)
      
      // Validate against stored employer data
      if (employer.email === email && employer.password === password && employer.status === 'approved') {
        const newUser: User = {
          email,
          isAuthenticated: true,
          planType: employer.selectedPlan?.name || 'free',
          role: 'employer',
          firstName: employer.firstName,
          lastName: employer.lastName,
          company: employer.company
        }
        
        setUser(newUser)
        localStorage.setItem("RwandaJobHub-auth-user", JSON.stringify(newUser))
        console.log("Employer logged in successfully:", email)
        return true
      }
    }

    // Also check the newer 'employer' storage format
    const storedEmployer = localStorage.getItem("employer")
    if (storedEmployer) {
      const employer = JSON.parse(storedEmployer)
      
      // Validate against stored employer data
      if (employer.email === email && employer.status === 'approved') {
        const newUser: User = {
          email,
          isAuthenticated: true,
          planType: employer.plan?.name || 'free',
          role: 'employer',
          company: employer.companyName
        }
        
        setUser(newUser)
        localStorage.setItem("RwandaJobHub-auth-user", JSON.stringify(newUser))
        console.log("Employer logged in successfully:", email)
        return true
      }
    }

    // Fallback to admin credentials for development
    const ADMIN_CREDENTIALS = {
      email: "admin@RwandaJobHub.com",
      password: "Koral.admin@1234567890",
    }

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        email,
        isAuthenticated: true,
        planType: 'admin',
        role: 'admin'
      }
      
      setUser(adminUser)
      localStorage.setItem("RwandaJobHub-auth-user", JSON.stringify(adminUser))
      console.log("Admin logged in successfully")
      return true
    }

    console.error("Login failed for:", email)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("RwandaJobHub-auth-user")
  }

  const isAuthenticated = user?.isAuthenticated || false

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}